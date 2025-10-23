# Campus Mindspace Favicon Generator
# This script creates all necessary favicon files

# Create a simple SVG favicon
cat > favicon.svg << 'EOF'
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="14" fill="#00b5ad"/>
  <path d="M12 16L15 19L20 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="16" cy="16" r="3" fill="white" opacity="0.3"/>
</svg>
EOF

echo "✅ Created favicon.svg"

# Create favicon.ico placeholder (you'll need to convert SVG to ICO)
cat > favicon-placeholder.txt << 'EOF'
# To create favicon.ico:
# 1. Go to https://favicon.io/favicon-converter/
# 2. Upload favicon.svg
# 3. Download the generated favicon.ico
# 4. Place it in your project root

# Required favicon files:
# - favicon.ico (16x16, 32x32)
# - favicon-16x16.png
# - favicon-32x32.png
# - apple-touch-icon.png (180x180)
# - android-chrome-192x192.png
# - android-chrome-512x512.png
EOF

echo "📋 Created favicon instructions"
