#!/bin/bash

# CityPulse App Restore Script
# This script restores the app from a backup

# Configuration
BACKUP_DIR="./backups"
APP_DIR="."
TEMP_DIR="/tmp/citypulse_restore_temp"

# Function to display usage information
usage() {
  echo "Usage: $0 [OPTIONS]"
  echo "Options:"
  echo "  -b, --backup FILENAME   Specify backup file to restore (default: latest backup)"
  echo "  -l, --list              List available backups"
  echo "  -h, --help              Display this help message"
  exit 1
}

# Function to list available backups
list_backups() {
  echo "Available backups:"
  echo "------------------"
  
  if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR/*.tar.gz 2>/dev/null)" ]; then
    echo "No backups found in $BACKUP_DIR"
    exit 1
  fi
  
  # List backups with their creation date
  for backup in "$BACKUP_DIR"/*.tar.gz; do
    if [ -f "$backup" ]; then
      filename=$(basename "$backup")
      created=$(date -r "$backup" "+%Y-%m-%d %H:%M:%S")
      size=$(du -h "$backup" | cut -f1)
      
      # Check if this is the latest backup
      if [ -L "$BACKUP_DIR/latest_backup.tar.gz" ] && [ "$(readlink -f $BACKUP_DIR/latest_backup.tar.gz)" = "$(readlink -f $backup)" ]; then
        echo "* $filename ($size) - Created: $created [LATEST]"
      else
        echo "  $filename ($size) - Created: $created"
      fi
    fi
  done
  exit 0
}

# Parse command line arguments
BACKUP_FILE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    -b|--backup)
      BACKUP_FILE="$2"
      shift 2
      ;;
    -l|--list)
      list_backups
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# If no backup file specified, use the latest
if [ -z "$BACKUP_FILE" ]; then
  if [ -L "$BACKUP_DIR/latest_backup.tar.gz" ]; then
    BACKUP_FILE=$(readlink -f "$BACKUP_DIR/latest_backup.tar.gz")
    echo "Using latest backup: $(basename "$BACKUP_FILE")"
  else
    echo "Error: No latest backup found and no backup specified"
    echo "Use --list to see available backups"
    exit 1
  fi
elif [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_DIR/$BACKUP_FILE"
  echo "Use --list to see available backups"
  exit 1
else
  BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
fi

# Confirm restoration
echo "WARNING: This will replace your current app state with the backup."
echo "All uncommitted changes will be lost."
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Restoration cancelled"
  exit 0
fi

# Create temporary directory
mkdir -p "$TEMP_DIR"

# Extract backup to temporary directory
echo "Extracting backup to temporary location..."
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# Save current git state
GIT_BRANCH=$(git -C "$APP_DIR" rev-parse --abbrev-ref HEAD)
GIT_COMMIT=$(git -C "$APP_DIR" rev-parse HEAD)

# Backup current .git directory
echo "Preserving git repository..."
cp -r "$APP_DIR/.git" "$TEMP_DIR/.git.bak"

# Remove current app files (except .git and node_modules)
echo "Removing current app files..."
find "$APP_DIR" -mindepth 1 -maxdepth 1 \
  ! -name ".git" \
  ! -name "node_modules" \
  ! -name "backups" \
  -exec rm -rf {} \;

# Copy files from temp directory to app directory
echo "Restoring files from backup..."
find "$TEMP_DIR" -mindepth 1 -maxdepth 1 \
  ! -name ".git.bak" \
  -exec cp -r {} "$APP_DIR/" \;

# Restore original .git directory
echo "Restoring git repository..."
rm -rf "$APP_DIR/.git"
mv "$TEMP_DIR/.git.bak" "$APP_DIR/.git"

# Clean up
echo "Cleaning up..."
rm -rf "$TEMP_DIR"

echo "Restoration completed successfully!"
echo "Previous git state: branch=$GIT_BRANCH, commit=$GIT_COMMIT"
echo "Current git status:"
git -C "$APP_DIR" status --short

echo ""
echo "NOTE: You may need to run 'npm install' if dependencies have changed."
