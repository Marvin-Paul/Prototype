#!/bin/bash
# Campus Mindspace Favicon Generator
# Generates all required favicon files from a single SVG source.

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# 1. Source SVG (check in)
cat > favicon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="240" fill="#00b5ad"/>
  <path d="M160 280L232 352L352 192" stroke="white" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

echo "✅ Created favicon.svg (512x512 source)"

# 2. Render PNGs. Uses ImageMagick if available; otherwise skips with a hint.
if command -v magick >/dev/null 2>&1; then
    for size in 16 32 180 192 512; do
        if [ "$size" = "180" ]; then
            out="apple-touch-icon.png"
        else
            out="favicon-${size}x${size}.png"
            [ "$size" = "192" ] && out="android-chrome-192x192.png"
            [ "$size" = "512" ] && out="android-chrome-512x512.png"
        fi
        magick -background none favicon.svg -resize "${size}x${size}" "$out"
        echo "✅ Created $out (${size}x${size})"
    done

    # 3. ICO (multi-size, contains 16x16 and 32x32)
    magick -background none favicon.svg -define icon:auto-resize=16,32 favicon.ico
    echo "✅ Created favicon.ico"
else
    echo "⚠️  ImageMagick not found. PNG/ICO generation skipped."
    echo "    Re-run this script after installing ImageMagick, or use https://favicon.io/"
fi

echo "🎉 Favicon generation complete!"
