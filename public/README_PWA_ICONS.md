# PWA Icons for CityPulse South Africa

This directory contains placeholder files for PWA (Progressive Web App) icons. To ensure the best experience on mobile devices, please replace these placeholder files with actual icon images.

## Required Icon Files

1. **pwa-192x192.png** - 192x192 pixel PNG icon for Android and other platforms
2. **pwa-512x512.png** - 512x512 pixel PNG icon for Android and other platforms
3. **apple-touch-icon.png** - 180x180 pixel PNG icon for iOS devices
4. **maskable-icon.png** - 512x512 pixel PNG icon with padding for adaptive icons on Android

## How to Generate Proper Icons

The easiest way to generate all the required icons is to use a tool like [RealFaviconGenerator](https://realfavicongenerator.net/) or [PWABuilder](https://www.pwabuilder.com/imageGenerator).

### Using RealFaviconGenerator:

1. Visit https://realfavicongenerator.net/
2. Upload your high-resolution logo (at least 512x512 pixels)
3. Customize the icons for different platforms
4. Download the generated package
5. Replace the placeholder files in this directory with the generated files

### Using PWABuilder:

1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload your high-resolution logo (at least 512x512 pixels)
3. Customize the padding and background color
4. Download the generated package
5. Replace the placeholder files in this directory with the generated files

## Icon Design Guidelines

For the best results, follow these guidelines:

- Use a simple, recognizable design that works well at small sizes
- Ensure good contrast for visibility
- For maskable icons, leave padding around the main content (about 20% on each side)
- Use PNG format with transparency where appropriate
- Test your icons on different devices and platforms

## After Replacing Icons

After replacing the placeholder icons with your actual icon files, run:

```bash
npm install
npm run build
```

This will build your application with the new PWA icons.
