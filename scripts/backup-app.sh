#!/bin/bash

# CityPulse App Backup Script
# This script creates a timestamped backup of the current app state

# Configuration
BACKUP_DIR="./backups"
APP_DIR="."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="citypulse_backup_${TIMESTAMP}"
EXCLUDE_PATTERNS=(
  "node_modules"
  "dist"
  "build"
  ".git"
  "backups"
  "*.log"
  "*.zip"
)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Build exclude pattern for tar
EXCLUDE_ARGS=""
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
  EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude=$pattern"
done

# Create the backup
echo "Creating backup: $BACKUP_NAME"
tar $EXCLUDE_ARGS -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$APP_DIR" .

# Create a metadata file with information about the backup
cat > "$BACKUP_DIR/$BACKUP_NAME.info.txt" << EOF
CityPulse App Backup
====================
Date: $(date)
Git Branch: $(git rev-parse --abbrev-ref HEAD)
Git Commit: $(git rev-parse HEAD)
Git Status:
$(git status --short)

Notes:
- This backup contains the full application state at the time of backup
- To restore, use the restore-app.sh script with this backup file
EOF

# Create a symlink to the latest backup
ln -sf "$BACKUP_NAME.tar.gz" "$BACKUP_DIR/latest_backup.tar.gz"
ln -sf "$BACKUP_NAME.info.txt" "$BACKUP_DIR/latest_backup.info.txt"

echo "Backup completed successfully: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
echo "Backup info: $BACKUP_DIR/$BACKUP_NAME.info.txt"
echo "Latest backup symlink updated"
