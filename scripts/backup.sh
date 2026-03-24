#!/bin/bash
# ============================================
# 远程备份脚本 - PostgreSQL / Redis / MinIO
# 部署到备份服务器，crontab 定时执行
# ============================================

SERVER=your_server_ip
BACKUP_ROOT=~/backups
KEEP_DAYS=30

# PostgreSQL
PG_PORT=15872
PG_USER=your_pg_user
PG_PASS=your_pg_password
PG_DB=postgres

# MinIO
MINIO_URL=http://$SERVER:9000
MINIO_USER=your_minio_user
MINIO_PASS=your_minio_password
MINIO_ALIAS=vintage_srv

# ============================================

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$DATE"
LOG="$BACKUP_ROOT/backup.log"
mkdir -p "$BACKUP_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG"
}

log "===== 开始备份 ====="

# 1. PostgreSQL
log "备份 PostgreSQL..."
PGPASSWORD=$PG_PASS pg_dump -h $SERVER -p $PG_PORT -U $PG_USER -d $PG_DB -F c -f "$BACKUP_DIR/postgres.dump" 2>>"$LOG"
if [ $? -eq 0 ]; then
    SIZE=$(du -sh "$BACKUP_DIR/postgres.dump" | cut -f1)
    log "PostgreSQL 备份完成 ($SIZE)"
else
    log "PostgreSQL 备份失败!"
fi

# 2. Redis
log "备份 Redis..."
ssh root@$SERVER "redis-cli BGSAVE && sleep 2 && docker cp redis:/data/dump.rdb /tmp/redis_dump.rdb" 2>>"$LOG"
scp root@$SERVER:/tmp/redis_dump.rdb "$BACKUP_DIR/redis.rdb" 2>>"$LOG"
if [ $? -eq 0 ]; then
    SIZE=$(du -sh "$BACKUP_DIR/redis.rdb" | cut -f1)
    log "Redis 备份完成 ($SIZE)"
else
    log "Redis 备份失败!"
fi

# 3. MinIO
log "备份 MinIO..."
mc alias set $MINIO_ALIAS $MINIO_URL $MINIO_USER $MINIO_PASS --api S3v4 2>>"$LOG"
mc mirror $MINIO_ALIAS/ "$BACKUP_DIR/minio/" 2>>"$LOG"
if [ $? -eq 0 ]; then
    SIZE=$(du -sh "$BACKUP_DIR/minio/" 2>/dev/null | cut -f1)
    log "MinIO 备份完成 ($SIZE)"
else
    log "MinIO 备份失败!"
fi

# 4. 清理旧备份
log "清理 ${KEEP_DAYS} 天前的备份..."
find "$BACKUP_ROOT" -maxdepth 1 -type d -name "20*" -mtime +$KEEP_DAYS -exec rm -rf {} \;

log "===== 备份完成: $BACKUP_DIR ====="
echo ""
