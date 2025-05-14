#!/bin/bash

# CityPulse App Backup Script
# This script creates a timestamped backup of the current app state

# Configuration
BACKUP_DIR="./backups"
APP_DIR="."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="citypulse_backup_${TIMESTAMP}"
MAX_BACKUPS=10  # Maximum number of backups to keep
EXCLUDE_PATTERNS=(
  "node_modules"
  "dist"
  "build"
  ".git"
  "backups"
  "*.log"
  "*.zip"
  "*.tar.gz"
  ".DS_Store"
  "Thumbs.db"
  ".env.local"
  ".env.development.local"
  ".env.test.local"
  ".env.production.local"
)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Build exclude pattern for tar
EXCLUDE_ARGS=""
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
  EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude=$pattern"
done

# Check if the backup directory exists and is writable
if [ ! -d "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR" || { echo "Error: Failed to create backup directory"; exit 1; }
fi

if [ ! -w "$BACKUP_DIR" ]; then
  echo "Error: Backup directory is not writable"
  exit 1
fi

# Check disk space before creating backup
REQUIRED_SPACE=$(du -s --block-size=1M "$APP_DIR" | cut -f1)
REQUIRED_SPACE=$((REQUIRED_SPACE + 100))  # Add 100MB buffer
AVAILABLE_SPACE=$(df --output=avail --block-size=1M "$BACKUP_DIR" | tail -n 1)

if [ "$AVAILABLE_SPACE" -lt "$REQUIRED_SPACE" ]; then
  echo "Warning: Low disk space. Required: ${REQUIRED_SPACE}MB, Available: ${AVAILABLE_SPACE}MB"
  read -p "Continue anyway? (y/N): " confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Backup cancelled"
    exit 0
  fi
fi

# Create the backup
echo "Creating backup: $BACKUP_NAME"
tar $EXCLUDE_ARGS -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$APP_DIR" . || {
  echo "Error: Backup creation failed"
  rm -f "$BACKUP_DIR/$BACKUP_NAME.tar.gz"
  exit 1
}

# Verify the backup
echo "Verifying backup integrity..."
if ! tar -tzf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" > /dev/null 2>&1; then
  echo "Error: Backup verification failed. The backup file may be corrupted."
  rm -f "$BACKUP_DIR/$BACKUP_NAME.tar.gz"
  exit 1
fi

# Create a metadata file with information about the backup
cat > "$BACKUP_DIR/$BACKUP_NAME.info.txt" << EOF
CityPulse App Backup
====================
Date: $(date)
Git Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "Unknown")
Git Commit: $(git rev-parse HEAD 2>/dev/null || echo "Unknown")
App Version: $(grep -m 1 '"version"' package.json | cut -d'"' -f4 2>/dev/null || echo "Unknown")
Git Status:
$(git status --short 2>/dev/null || echo "Git information not available")

Files:
$(find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/build/*" | wc -l) files backed up

Notes:
- This backup contains the full application state at the time of backup
- To restore, use the restore-app.sh script with this backup file
EOF

# Create a symlink to the latest backup
ln -sf "$BACKUP_NAME.tar.gz" "$BACKUP_DIR/latest_backup.tar.gz"
ln -sf "$BACKUP_NAME.info.txt" "$BACKUP_DIR/latest_backup.info.txt"

# Clean up old backups if we have more than MAX_BACKUPS
backup_count=$(find "$BACKUP_DIR" -name "citypulse_backup_*.tar.gz" | wc -l)
if [ "$backup_count" -gt "$MAX_BACKUPS" ]; then
  echo "Cleaning up old backups (keeping the $MAX_BACKUPS most recent)..."
  ls -t "$BACKUP_DIR"/citypulse_backup_*.tar.gz | tail -n +$((MAX_BACKUPS+1)) | xargs rm -f
  ls -t "$BACKUP_DIR"/citypulse_backup_*.info.txt | tail -n +$((MAX_BACKUPS+1)) | xargs rm -f
fi

echo "Backup completed successfully: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
echo "Backup info: $BACKUP_DIR/$BACKUP_NAME.info.txt"
echo "Latest backup symlink updated"
echo "Backup size: $(du -h "$BACKUP_DIR/$BACKUP_NAME.tar.gz" | cut -f1)"
