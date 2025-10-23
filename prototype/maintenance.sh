#!/bin/bash
# Campus Mindspace - Backup and Maintenance Script

echo "🔧 Campus Mindspace Maintenance Script"
echo "====================================="

# Configuration
BACKUP_DIR="../campus-mindspace-backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="campus-mindspace-backup-$DATE"

# Function to create backup
create_backup() {
    echo "📦 Creating backup..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Create backup
    tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='*.log' \
        --exclude='*.tmp' \
        .
    
    echo "✅ Backup created: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
    
    # Keep only last 10 backups
    cd "$BACKUP_DIR"
    ls -t campus-mindspace-backup-*.tar.gz | tail -n +11 | xargs -r rm
    cd - > /dev/null
    
    echo "🧹 Old backups cleaned up"
}

# Function to restore from backup
restore_backup() {
    echo "📂 Available backups:"
    ls -la "$BACKUP_DIR"/*.tar.gz 2>/dev/null || echo "No backups found"
    
    echo ""
    read -p "Enter backup filename to restore: " backup_file
    
    if [ -f "$BACKUP_DIR/$backup_file" ]; then
        echo "🔄 Restoring from $backup_file..."
        
        # Create restore directory
        mkdir -p "../restore-$DATE"
        
        # Extract backup
        tar -xzf "$BACKUP_DIR/$backup_file" -C "../restore-$DATE"
        
        echo "✅ Backup restored to: ../restore-$DATE"
    else
        echo "❌ Backup file not found"
    fi
}

# Function to check system health
check_health() {
    echo "🏥 Checking system health..."
    
    # Check file sizes
    echo "📁 File sizes:"
    find . -name "*.css" -o -name "*.js" -o -name "*.html" | xargs ls -lh | sort -k5 -hr
    
    # Check for broken links
    echo ""
    echo "🔗 Checking for broken internal links..."
    grep -r "href=" *.html | grep -v "http" | grep -v "mailto" | grep -v "tel" | while read line; do
        link=$(echo "$line" | sed 's/.*href="\([^"]*\)".*/\1/')
        if [ ! -f "$link" ] && [ ! -d "$link" ]; then
            echo "⚠️  Broken link: $link"
        fi
    done
    
    # Check for missing files
    echo ""
    echo "🔍 Checking for missing referenced files..."
    grep -r "src=" *.html | while read line; do
        file=$(echo "$line" | sed 's/.*src="\([^"]*\)".*/\1/')
        if [[ "$file" != http* ]] && [ ! -f "$file" ]; then
            echo "⚠️  Missing file: $file"
        fi
    done
    
    # Check JavaScript errors
    echo ""
    echo "🔧 Checking JavaScript syntax..."
    for js_file in js/*.js; do
        if [ -f "$js_file" ]; then
            if node -c "$js_file" 2>/dev/null; then
                echo "✅ $js_file - OK"
            else
                echo "❌ $js_file - Syntax error"
            fi
        fi
    done
    
    echo "✅ Health check complete"
}

# Function to optimize files
optimize_files() {
    echo "⚡ Optimizing files..."
    
    # Minify CSS (if cssnano is available)
    if command -v cssnano &> /dev/null; then
        echo "🎨 Minifying CSS files..."
        for css_file in css/*.css; do
            if [ -f "$css_file" ]; then
                cssnano "$css_file" "$css_file.min"
                echo "✅ Minified $css_file"
            fi
        done
    else
        echo "💡 Install cssnano for CSS minification: npm install -g cssnano-cli"
    fi
    
    # Minify JavaScript (if terser is available)
    if command -v terser &> /dev/null; then
        echo "📜 Minifying JavaScript files..."
        for js_file in js/*.js; do
            if [ -f "$js_file" ]; then
                terser "$js_file" -o "$js_file.min"
                echo "✅ Minified $js_file"
            fi
        done
    else
        echo "💡 Install terser for JS minification: npm install -g terser"
    fi
    
    # Optimize images (if imagemagick is available)
    if command -v convert &> /dev/null; then
        echo "🖼️  Optimizing images..."
        find . -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | while read img_file; do
            convert "$img_file" -quality 85 -strip "$img_file.optimized"
            echo "✅ Optimized $img_file"
        done
    else
        echo "💡 Install ImageMagick for image optimization"
    fi
    
    echo "✅ File optimization complete"
}

# Function to update dependencies
update_dependencies() {
    echo "🔄 Updating dependencies..."
    
    # Check for package.json
    if [ -f "package.json" ]; then
        echo "📦 Checking npm dependencies..."
        npm outdated 2>/dev/null || echo "No npm dependencies to check"
    fi
    
    # Check for external CDN resources
    echo ""
    echo "🌐 Checking external resources..."
    echo "Font Awesome: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
    echo "Google Fonts: https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
    echo "Pixabay Video: https://cdn.pixabay.com/video/2016/03/29/2569-160748715_large.mp4"
    
    echo "✅ Dependency check complete"
}

# Function to generate report
generate_report() {
    echo "📊 Generating maintenance report..."
    
    REPORT_FILE="../maintenance-report-$DATE.txt"
    
    {
        echo "Campus Mindspace Maintenance Report"
        echo "Generated: $(date)"
        echo "=================================="
        echo ""
        
        echo "File Statistics:"
        echo "HTML files: $(find . -name "*.html" | wc -l)"
        echo "CSS files: $(find . -name "*.css" | wc -l)"
        echo "JavaScript files: $(find . -name "*.js" | wc -l)"
        echo "Total size: $(du -sh . | cut -f1)"
        echo ""
        
        echo "Recent Changes:"
        git log --oneline -10 2>/dev/null || echo "No git history available"
        echo ""
        
        echo "Performance Metrics:"
        echo "Largest files:"
        find . -type f -size +100k -not -path "./.git/*" | xargs ls -lh | head -10
        echo ""
        
        echo "Recommendations:"
        echo "- Run health check regularly"
        echo "- Keep backups up to date"
        echo "- Monitor performance metrics"
        echo "- Update dependencies monthly"
        
    } > "$REPORT_FILE"
    
    echo "✅ Report generated: $REPORT_FILE"
}

# Main menu
echo ""
echo "What would you like to do?"
echo "1) Create backup"
echo "2) Restore from backup"
echo "3) Check system health"
echo "4) Optimize files"
echo "5) Update dependencies"
echo "6) Generate report"
echo "7) Exit"
echo ""

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        create_backup
        ;;
    2)
        restore_backup
        ;;
    3)
        check_health
        ;;
    4)
        optimize_files
        ;;
    5)
        update_dependencies
        ;;
    6)
        generate_report
        ;;
    7)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Maintenance task completed!"
