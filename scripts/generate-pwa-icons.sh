#!/bin/bash

# Script to generate PWA icons from a source SVG
# Requires ImageMagick to be installed

# Configuration
SOURCE_SVG="public/icons/icon-generator.svg"
OUTPUT_DIR="public/icons"
FAVICON_OUTPUT="public/favicon.ico"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Array of icon sizes needed for PWA
SIZES=(72 96 128 144 152 192 384 512)

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is required but not installed."
    echo "Please install ImageMagick and try again."
    echo "On Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "On macOS: brew install imagemagick"
    exit 1
fi

# Check if source SVG exists
if [ ! -f "$SOURCE_SVG" ]; then
    echo "Error: Source SVG file not found at $SOURCE_SVG"
    exit 1
fi

echo "Generating PWA icons from $SOURCE_SVG..."

# Generate icons for each size
for size in "${SIZES[@]}"; do
    output_file="$OUTPUT_DIR/icon-${size}x${size}.png"
    echo "Creating $output_file..."
    convert -background none "$SOURCE_SVG" -resize "${size}x${size}" "$output_file"
    
    if [ $? -ne 0 ]; then
        echo "Error: Failed to generate $output_file"
        exit 1
    fi
done

# Generate favicon.ico with multiple sizes
echo "Creating favicon.ico..."
convert -background none "$SOURCE_SVG" -define icon:auto-resize=64,48,32,16 "$FAVICON_OUTPUT"

if [ $? -ne 0 ]; then
    echo "Error: Failed to generate favicon.ico"
    exit 1
fi

# Generate Apple touch icons
echo "Creating Apple touch icons..."
convert -background none "$SOURCE_SVG" -resize "180x180" "$OUTPUT_DIR/apple-touch-icon.png"
convert -background none "$SOURCE_SVG" -resize "152x152" "$OUTPUT_DIR/apple-touch-icon-152x152.png"
convert -background none "$SOURCE_SVG" -resize "167x167" "$OUTPUT_DIR/apple-touch-icon-167x167.png"

# Generate maskable icons (with padding)
echo "Creating maskable icons..."
convert -background none "$SOURCE_SVG" -resize "480x480" -gravity center -extent "512x512" "$OUTPUT_DIR/maskable-icon-512x512.png"
convert -background none "$SOURCE_SVG" -resize "180x180" -gravity center -extent "192x192" "$OUTPUT_DIR/maskable-icon-192x192.png"

echo "All PWA icons generated successfully!"
echo "Don't forget to update your manifest.json to reference these icons."
