#!/usr/bin/env bash
set -euo pipefail

#=============================================================
# Vintage Vault 后端一键部署脚本
# 用法: chmod +x deploy.sh && sudo ./deploy.sh
#
# 支持场景:
#   - 全新部署
#   - 重复执行（幂等，不会破坏已有数据）
#   - 升级更新（git pull 后重新执行）
#=============================================================

# ---------- 配置区 ----------
APP_NAME="vintage-vault"
APP_SERVICE_USER="vintage"        # 专用运行用户（root 登录时自动创建）
APP_USER="${SUDO_USER:-$(whoami)}"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV_DIR="$APP_DIR/venv"
ENV_FILE="$APP_DIR/.env"
DB_FILE="$APP_DIR/vintage_vault.db"
BACKUP_DIR="$APP_DIR/backups"
PORT=5000
WORKERS=4
MIN_PYTHON="3.8"
MIN_DISK_MB=500

# ---------- 颜色输出 ----------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
err()   { echo -e "${RED}[✗]${NC} $1"; }
fatal() { err "$1"; exit 1; }
step()  { echo -e "\n${CYAN}──── $1 ────${NC}"; }

# ---------- 日志记录 ----------
LOG_FILE="$APP_DIR/deploy.log"
exec > >(tee -a "$LOG_FILE") 2>&1
echo ""
echo "===== 部署开始: $(date '+%Y-%m-%d %H:%M:%S') ====="

# ---------- 清理函数（异常退出时执行） ----------
cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo ""
        err "部署中断 (exit code: $exit_code)"
        err "查看完整日志: $LOG_FILE"
        # 如果服务之前在运行且本次部署失败，尝试恢复
        if systemctl is-enabled --quiet "$APP_NAME" 2>/dev/null; then
            warn "尝试重启原有服务..."
            systemctl restart "$APP_NAME" 2>/dev/null || true
        fi
    fi
}
trap cleanup EXIT

# ==========================================================
#  前置检查
# ==========================================================
step "前置检查"

# 1) root 权限
if [ "$EUID" -ne 0 ]; then
    fatal "请用 sudo 运行: sudo ./deploy.sh"
fi

# 2) root 登录时自动创建专用用户
if [ "$APP_USER" = "root" ]; then
    warn "检测到以 root 直接登录，将创建专用用户 '$APP_SERVICE_USER' 来运行服务"
    if ! id "$APP_SERVICE_USER" &>/dev/null; then
        useradd -r -m -s /bin/bash "$APP_SERVICE_USER" 2>/dev/null || useradd -m -s /bin/bash "$APP_SERVICE_USER"
        info "已创建用户: $APP_SERVICE_USER"
    else
        info "用户 $APP_SERVICE_USER 已存在"
    fi
    APP_USER="$APP_SERVICE_USER"
    # 确保该用户对应用目录有权限
    chown -R "$APP_USER":"$APP_USER" "$APP_DIR"
fi

# 3) requirements.txt 存在
if [ ! -f "$APP_DIR/requirements.txt" ]; then
    fatal "找不到 requirements.txt，请确认在 backend/ 目录下执行"
fi

# 4) run.py 存在
if [ ! -f "$APP_DIR/run.py" ]; then
    fatal "找不到 run.py，请确认在 backend/ 目录下执行"
fi

# 5) 磁盘空间
AVAIL_MB=$(df -m "$APP_DIR" | awk 'NR==2 {print $4}')
if [ "${AVAIL_MB:-0}" -lt "$MIN_DISK_MB" ]; then
    fatal "磁盘剩余空间不足: ${AVAIL_MB}MB < ${MIN_DISK_MB}MB"
fi
info "磁盘空间充足 (剩余 ${AVAIL_MB}MB)"

# 6) Python 版本
if ! command -v python3 &>/dev/null; then
    warn "未找到 python3，将尝试安装..."
    NEED_PYTHON=true
else
    PY_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
    if python3 -c "import sys; exit(0 if sys.version_info >= (3,8) else 1)"; then
        info "Python 版本: $PY_VERSION"
        NEED_PYTHON=false
    else
        fatal "Python 版本过低: $PY_VERSION (需要 >= $MIN_PYTHON)"
    fi
fi

# 7) 端口检查
if ss -tlnp 2>/dev/null | grep -q ":${PORT} " || netstat -tlnp 2>/dev/null | grep -q ":${PORT} "; then
    # 检查是不是自己的服务占用的
    if systemctl is-active --quiet "$APP_NAME" 2>/dev/null; then
        info "端口 $PORT 被本服务占用（将在部署后重启）"
    else
        BLOCKING_PID=$(ss -tlnp 2>/dev/null | grep ":${PORT} " | grep -oP 'pid=\K[0-9]+' | head -1 || true)
        if [ -n "$BLOCKING_PID" ]; then
            BLOCKING_CMD=$(ps -p "$BLOCKING_PID" -o comm= 2>/dev/null || echo "未知")
            fatal "端口 $PORT 已被占用 (PID: $BLOCKING_PID, 进程: $BLOCKING_CMD)。请修改脚本中的 PORT 或停掉占用进程"
        fi
    fi
fi

echo ""
echo "=========================================="
echo "  Vintage Vault 后端部署"
echo "=========================================="
echo "  应用目录: $APP_DIR"
echo "  运行用户: $APP_USER"
echo "  端口:     $PORT"
echo "=========================================="

# ==========================================================
#  1. 系统依赖
# ==========================================================
step "安装系统依赖"

install_packages() {
    if command -v apt-get &>/dev/null; then
        apt-get update -qq 2>/dev/null
        apt-get install -y -qq python3 python3-pip python3-venv curl >/dev/null 2>&1
    elif command -v dnf &>/dev/null; then
        dnf install -y -q python3 python3-pip curl >/dev/null 2>&1
    elif command -v yum &>/dev/null; then
        yum install -y -q python3 python3-pip curl >/dev/null 2>&1
    elif command -v pacman &>/dev/null; then
        pacman -Sy --noconfirm python python-pip curl >/dev/null 2>&1
    else
        fatal "无法识别包管理器 (需要 apt/dnf/yum/pacman)。请手动安装 python3 python3-pip python3-venv"
    fi
}

if [ "${NEED_PYTHON:-false}" = true ] || ! command -v python3 &>/dev/null; then
    install_packages
    if ! command -v python3 &>/dev/null; then
        fatal "Python3 安装失败，请手动安装后重试"
    fi
    info "系统依赖安装完成"
else
    # 确保 venv 模块可用
    if ! python3 -m venv --help &>/dev/null; then
        warn "python3-venv 模块缺失，正在安装..."
        install_packages
    fi
    info "系统依赖已就绪"
fi

# ==========================================================
#  2. Python 虚拟环境
# ==========================================================
step "Python 虚拟环境"

# 检查已有虚拟环境是否损坏
if [ -d "$VENV_DIR" ]; then
    if [ ! -f "$VENV_DIR/bin/python3" ] || ! "$VENV_DIR/bin/python3" -c "import sys" 2>/dev/null; then
        warn "虚拟环境已损坏，正在重建..."
        rm -rf "$VENV_DIR"
    fi
fi

if [ ! -d "$VENV_DIR" ]; then
    sudo -u "$APP_USER" python3 -m venv "$VENV_DIR" || fatal "创建虚拟环境失败"
    info "虚拟环境已创建"
else
    info "虚拟环境已存在"
fi

info "安装 Python 依赖..."
sudo -u "$APP_USER" "$VENV_DIR/bin/pip" install --quiet --upgrade pip 2>&1 | tail -1 || true
if ! sudo -u "$APP_USER" "$VENV_DIR/bin/pip" install --quiet -r "$APP_DIR/requirements.txt" 2>&1; then
    err "pip install 失败，尝试不使用缓存重装..."
    sudo -u "$APP_USER" "$VENV_DIR/bin/pip" install --no-cache-dir -r "$APP_DIR/requirements.txt" || fatal "依赖安装失败，请检查网络连接"
fi
sudo -u "$APP_USER" "$VENV_DIR/bin/pip" install --quiet gunicorn 2>&1 | tail -1 || fatal "gunicorn 安装失败"
info "依赖安装完成"

# ==========================================================
#  3. 环境配置 (.env)
# ==========================================================
step "环境配置"

generate_secret() {
    "$VENV_DIR/bin/python3" -c "import secrets; print(secrets.token_hex(32))"
}

if [ ! -f "$ENV_FILE" ]; then
    # 全新生成
    info "生成 .env 配置..."
    cat > "$ENV_FILE" << EOF
FLASK_ENV=production
SECRET_KEY=$(generate_secret)
JWT_SECRET_KEY=$(generate_secret)
DATABASE_URL=sqlite:///${DB_FILE}
UPLOAD_FOLDER=uploads
PORT=${PORT}
EOF
    info ".env 已生成（密钥已随机生成）"
elif grep -q "change-me" "$ENV_FILE" 2>/dev/null; then
    # 替换占位密钥
    warn ".env 中发现占位密钥，正在替换..."
    sed -i "s|SECRET_KEY=change-me.*|SECRET_KEY=$(generate_secret)|" "$ENV_FILE"
    sed -i "s|JWT_SECRET_KEY=change-me.*|JWT_SECRET_KEY=$(generate_secret)|" "$ENV_FILE"
    # 确保是 production 模式
    sed -i "s|FLASK_ENV=development|FLASK_ENV=production|" "$ENV_FILE"
    info ".env 占位密钥已替换"
else
    info ".env 已存在且有效，跳过"
fi

# 确保 .env 中有 DATABASE_URL（升级兼容）
if ! grep -q "^DATABASE_URL=" "$ENV_FILE" 2>/dev/null; then
    echo "DATABASE_URL=sqlite:///${DB_FILE}" >> "$ENV_FILE"
    warn ".env 中补充了 DATABASE_URL"
fi

chown "$APP_USER":"$APP_USER" "$ENV_FILE"
chmod 600 "$ENV_FILE"

# ==========================================================
#  4. 目录准备
# ==========================================================
step "创建目录"

sudo -u "$APP_USER" mkdir -p "$APP_DIR/logs"
sudo -u "$APP_USER" mkdir -p "$APP_DIR/uploads"
sudo -u "$APP_USER" mkdir -p "$BACKUP_DIR"
info "logs / uploads / backups 目录就绪"

# ==========================================================
#  5. 数据库
# ==========================================================
step "数据库"

# 如果已有数据库，先备份
if [ -f "$DB_FILE" ]; then
    BACKUP_NAME="vintage_vault_$(date +%Y%m%d_%H%M%S).db"
    cp "$DB_FILE" "$BACKUP_DIR/$BACKUP_NAME"
    chown "$APP_USER":"$APP_USER" "$BACKUP_DIR/$BACKUP_NAME"
    info "已备份现有数据库 → backups/$BACKUP_NAME"

    # 清理旧备份，只保留最近 10 个
    ls -1t "$BACKUP_DIR"/vintage_vault_*.db 2>/dev/null | tail -n +11 | xargs -r rm -f
fi

info "初始化数据库..."
cd "$APP_DIR"
if ! sudo -u "$APP_USER" bash -c "
    source '$VENV_DIR/bin/activate'
    export FLASK_APP=run.py
    set -a; source '$ENV_FILE'; set +a
    flask init-db 2>&1
    flask seed 2>&1
"; then
    # 如果失败且有备份，恢复
    if [ -f "$BACKUP_DIR/$BACKUP_NAME" ]; then
        warn "数据库初始化失败，正在恢复备份..."
        cp "$BACKUP_DIR/$BACKUP_NAME" "$DB_FILE"
        chown "$APP_USER":"$APP_USER" "$DB_FILE"
    fi
    fatal "数据库初始化失败，请查看上方错误信息"
fi
chown "$APP_USER":"$APP_USER" "$DB_FILE" 2>/dev/null || true
info "数据库就绪（admin / admin123321）"

# ==========================================================
#  6. Systemd 服务
# ==========================================================
step "配置 systemd 服务"

# 检查 systemd 是否可用
if ! command -v systemctl &>/dev/null; then
    warn "当前系统无 systemd，跳过服务注册"
    warn "请手动启动: cd $APP_DIR && source venv/bin/activate && gunicorn -w $WORKERS -b 0.0.0.0:$PORT run:app"
    SKIP_SYSTEMD=true
else
    SKIP_SYSTEMD=false
fi

if [ "$SKIP_SYSTEMD" = false ]; then
    # 如果旧服务在跑，先优雅停掉
    if systemctl is-active --quiet "$APP_NAME" 2>/dev/null; then
        info "停止旧服务..."
        systemctl stop "$APP_NAME"
    fi

    SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"
    cat > "$SERVICE_FILE" << EOF
[Unit]
Description=Vintage Vault API Server
After=network.target
StartLimitIntervalSec=300
StartLimitBurst=5

[Service]
Type=simple
User=${APP_USER}
Group=${APP_USER}
WorkingDirectory=${APP_DIR}
EnvironmentFile=${ENV_FILE}
ExecStart=${VENV_DIR}/bin/gunicorn \\
    --workers ${WORKERS} \\
    --bind 0.0.0.0:${PORT} \\
    --timeout 120 \\
    --graceful-timeout 30 \\
    --access-logfile ${APP_DIR}/logs/access.log \\
    --error-logfile ${APP_DIR}/logs/error.log \\
    run:app
ExecReload=/bin/kill -s HUP \$MAINPID
KillMode=mixed
Restart=on-failure
RestartSec=5

# 安全加固
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=${APP_DIR}

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable "$APP_NAME" >/dev/null 2>&1
    systemctl start "$APP_NAME"

    # 等待并检查
    info "等待服务启动..."
    RETRIES=5
    while [ $RETRIES -gt 0 ]; do
        sleep 2
        if systemctl is-active --quiet "$APP_NAME"; then
            break
        fi
        RETRIES=$((RETRIES - 1))
    done

    if systemctl is-active --quiet "$APP_NAME"; then
        info "服务启动成功!"
    else
        err "服务启动失败，最近日志:"
        journalctl -u "$APP_NAME" -n 20 --no-pager 2>/dev/null || true
        fatal "请根据上方日志排查问题"
    fi

    # API 健康检查
    sleep 1
    if command -v curl &>/dev/null; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}/api/v1/dashboard/stats" --max-time 5 2>/dev/null || echo "000")
        if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ]; then
            info "API 健康检查通过 (HTTP $HTTP_CODE)"
        else
            warn "API 健康检查未通过 (HTTP $HTTP_CODE)，服务可能仍在启动中"
        fi
    fi
fi

# ==========================================================
#  7. 防火墙
# ==========================================================
step "防火墙"

FIREWALL_DONE=false
if command -v ufw &>/dev/null; then
    if ufw status 2>/dev/null | grep -q "active"; then
        ufw allow "$PORT"/tcp >/dev/null 2>&1
        info "ufw 已放行端口 $PORT"
        FIREWALL_DONE=true
    else
        info "ufw 未启用，跳过"
    fi
elif command -v firewall-cmd &>/dev/null; then
    if firewall-cmd --state 2>/dev/null | grep -q "running"; then
        firewall-cmd --permanent --add-port="${PORT}/tcp" >/dev/null 2>&1
        firewall-cmd --reload >/dev/null 2>&1
        info "firewalld 已放行端口 $PORT"
        FIREWALL_DONE=true
    else
        info "firewalld 未运行，跳过"
    fi
elif command -v iptables &>/dev/null; then
    # 检查是否已存在规则
    if ! iptables -C INPUT -p tcp --dport "$PORT" -j ACCEPT 2>/dev/null; then
        iptables -I INPUT -p tcp --dport "$PORT" -j ACCEPT 2>/dev/null
        info "iptables 已放行端口 $PORT"
        FIREWALL_DONE=true
    else
        info "iptables 规则已存在"
        FIREWALL_DONE=true
    fi
fi

if [ "$FIREWALL_DONE" = false ]; then
    warn "未检测到活跃防火墙。如果使用云服务器，请在安全组中放行端口 $PORT"
fi

# ==========================================================
#  8. 日志轮转
# ==========================================================
step "日志轮转"

LOGROTATE_CONF="/etc/logrotate.d/$APP_NAME"
if command -v logrotate &>/dev/null; then
    cat > "$LOGROTATE_CONF" << EOF
${APP_DIR}/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
EOF
    info "logrotate 已配置（保留 30 天日志）"
else
    warn "logrotate 未安装，建议安装以防日志文件过大"
fi

# ==========================================================
#  完成
# ==========================================================
SERVER_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || curl -s --max-time 3 ifconfig.me 2>/dev/null || echo "你的服务器IP")

echo ""
echo "=========================================="
echo -e "  ${GREEN}部署完成!${NC}"
echo "=========================================="
echo ""
echo "  API 地址:  http://${SERVER_IP}:${PORT}/api/v1"
echo "  登录账号:  admin"
echo "  登录密码:  admin123321"
echo ""
if [ "$SKIP_SYSTEMD" = false ]; then
echo "  服务管理:"
echo "    查看状态  systemctl status $APP_NAME"
echo "    查看日志  journalctl -u $APP_NAME -f"
echo "    重启服务  systemctl restart $APP_NAME"
echo "    停止服务  systemctl stop $APP_NAME"
echo ""
fi
echo "  数据库备份: $BACKUP_DIR/"
echo "  部署日志:   $LOG_FILE"
echo ""
echo "  前端构建环境变量:"
echo "    VITE_API_BASE=http://${SERVER_IP}:${PORT}/api/v1"
echo ""
echo -e "  ${YELLOW}提醒:${NC}"
echo "    - 云服务器请确认安全组已放行端口 $PORT"
echo "    - 生产环境建议配置 HTTPS (可用 Caddy 反代)"
echo "    - 首次部署后建议修改 admin 密码"
echo ""
echo "===== 部署结束: $(date '+%Y-%m-%d %H:%M:%S') ====="
