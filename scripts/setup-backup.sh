#!/bin/bash
# ============================================
# 备份服务器一键初始化
# 在备份机器上运行此脚本即可
# ============================================

echo "=== 安装依赖 ==="

# PostgreSQL 客户端
apt update && apt install -y postgresql-client

# MinIO 客户端 (mc)
if ! command -v mc &> /dev/null; then
    curl -sO https://dl.min.io/client/mc/release/linux-amd64/mc
    chmod +x mc && mv mc /usr/local/bin/
    echo "mc 安装完成"
else
    echo "mc 已安装"
fi

echo ""
echo "=== 配置 SSH 免密登录 ==="
if [ ! -f ~/.ssh/id_ed25519 ]; then
    ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519
fi
echo "请输入源服务器 root 密码完成免密配置:"
ssh-copy-id root@your_server_ip

echo ""
echo "=== 部署备份脚本 ==="
mkdir -p ~/backups
cp backup.sh ~/backup.sh
chmod +x ~/backup.sh

echo ""
echo "=== 设置定时任务 (每天凌晨3点) ==="
(crontab -l 2>/dev/null | grep -v backup.sh; echo "0 3 * * * /root/backup.sh") | crontab -
echo "定时任务已添加:"
crontab -l | grep backup

echo ""
echo "=== 初始化完成 ==="
echo "手动测试: bash ~/backup.sh"
echo "备份目录: ~/backups/"
echo "日志文件: ~/backups/backup.log"
