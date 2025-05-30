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
if ! tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"; then
  echo "Error: Failed to extract backup file. The file may be corrupted."
  rm -rf "$TEMP_DIR"
  exit 1
fi

# Save current git state
GIT_BRANCH=$(git -C "$APP_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "Unknown")
GIT_COMMIT=$(git -C "$APP_DIR" rev-parse HEAD 2>/dev/null || echo "Unknown")

# Create a pre-restore backup
PRE_RESTORE_BACKUP="$BACKUP_DIR/pre_restore_$(date +"%Y%m%d_%H%M%S").tar.gz"
echo "Creating pre-restore backup: $PRE_RESTORE_BACKUP"
tar --exclude="node_modules" --exclude=".git" --exclude="dist" --exclude="build" --exclude="backups" -czf "$PRE_RESTORE_BACKUP" -C "$APP_DIR" .

# Backup current .git directory if it exists
if [ -d "$APP_DIR/.git" ]; then
  echo "Preserving git repository..."
  cp -r "$APP_DIR/.git" "$TEMP_DIR/.git.bak"
fi

# Remove current app files (except .git and node_modules)
echo "Removing current app files..."
find "$APP_DIR" -mindepth 1 -maxdepth 1 \
  ! -name ".git" \
  ! -name "node_modules" \
  ! -name "backups" \
  ! -name ".env" \
  ! -name ".env.local" \
  ! -name ".env.development.local" \
  ! -name ".env.test.local" \
  ! -name ".env.production.local" \
  -exec rm -rf {} \;

# Copy files from temp directory to app directory
echo "Restoring files from backup..."
find "$TEMP_DIR" -mindepth 1 -maxdepth 1 \
  ! -name ".git.bak" \
  -exec cp -r {} "$APP_DIR/" \;

# Restore original .git directory if it was backed up
if [ -d "$TEMP_DIR/.git.bak" ]; then
  echo "Restoring git repository..."
  rm -rf "$APP_DIR/.git"
  mv "$TEMP_DIR/.git.bak" "$APP_DIR/.git"
fi

# Clean up
echo "Cleaning up..."
rm -rf "$TEMP_DIR"

echo "Restoration completed successfully!"
echo "Previous git state: branch=$GIT_BRANCH, commit=$GIT_COMMIT"
echo "Current git status:"
git -C "$APP_DIR" status --short 2>/dev/null || echo "Git repository not available"

echo ""
echo "Pre-restore backup created at: $PRE_RESTORE_BACKUP"
echo "If you need to revert this restoration, you can use this backup."
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to ensure dependencies are up to date"
echo "2. Verify the application works as expected"
echo "3. Check for any environment variables that may need to be restored"

# Check if package.json exists and suggest running npm install
if [ -f "$APP_DIR/package.json" ]; then
  echo ""
  read -p "Would you like to run 'npm install' now? (y/N): " run_npm
  if [[ "$run_npm" =~ ^[Yy]$ ]]; then
    echo "Running npm install..."
    cd "$APP_DIR" && npm install
  fi
fi
