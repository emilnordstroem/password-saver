# Icons for Password Saver

This directory contains app icons for different platforms.

## Required Icons

For macOS support, you need the following icon files:

1. **icon.icns** - macOS application icon (REQUIRED for macOS)
2. **icon.ico** - Windows application icon (optional, but recommended)
3. **icon.png** - Generic PNG icon (optional, but recommended)
4. **icon.svg** - SVG source icon (optional, but recommended)

## Generating macOS .icns Icon

To create a `.icns` file from a source image (PNG or SVG), you have several options:

### Option 1: Using ImageMagick (Recommended)

If you have ImageMagick installed:

```bash
# Convert SVG to PNG at various sizes
convert -background none -density 300 icon.svg -resize 16x16 icon_16.png
convert -background none -density 300 icon.svg -resize 32x32 icon_32.png
convert -background none -density 300 icon.svg -resize 64x64 icon_64.png
convert -background none -density 300 icon.svg -resize 128x128 icon_128.png
convert -background none -density 300 icon.svg -resize 256x256 icon_256.png
convert -background none -density 300 icon.svg -resize 512x512 icon_512.png

# Create .icns from PNGs
iconutil -c icns -o icon.icns icon_16.png icon_32.png icon_64.png icon_128.png icon_256.png icon_512.png

# Clean up temporary files
rm icon_16.png icon_32.png icon_64.png icon_128.png icon_256.png icon_512.png
```

### Option 2: Using macOS Built-in Tools

On macOS, you can use the `iconutil` command:

```bash
# Create a temporary iconset directory
mkdir icon.iconset

# Create PNGs at required sizes (use any image editor or online converter)
# Place them in icon.iconset:
# - icon_16x16.png
# - icon_16x16@2x.png
# - icon_32x32.png
# - icon_32x32@2x.png
# - icon_64x64.png
# - icon_128x128.png
# - icon_128x128@2x.png
# - icon_256x256.png
# - icon_256x256@2x.png
# - icon_512x512.png
# - icon_512x512@2x.png

# Convert to .icns
iconutil -c icns -o icon.icns icon.iconset

# Clean up
rm -rf icon.iconset
```

### Option 3: Online Icon Generators

Use free online tools to generate `.icns` files:
- https://iconverticons.com/convert/
- https://icoconvert.com/

Upload your SVG or PNG and download the `.icns` file.

## Icon Sizes for macOS

The `.icns` file should contain the following sizes:
- 16x16 pixels
- 32x32 pixels
- 64x64 pixels
- 128x128 pixels
- 256x256 pixels
- 512x512 pixels
- 1024x1024 pixels (optional for Retina displays)

## Current Files

- `icon.svg` - Source vector icon (included)
- `icon.icns` - macOS icon (TODO: Generate this file)
- `icon.ico` - Windows icon (optional)
- `icon.png` - Generic icon (optional)

## Notes

- The `.icns` file is REQUIRED for building macOS applications
- The `tauri.conf.json` file references all icon files
- Without proper icons, the macOS build will fail or use a default icon
