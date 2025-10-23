# Campus Mindspace - Domain Configuration Guide

## 🌐 **Domain Setup Instructions**

### **Step 1: Choose Your Domain**

#### **Free Subdomains (No Cost)**

- **Netlify**: `your-site.netlify.app`
- **GitHub Pages**: `your-username.github.io/campus-mindspace`
- **Vercel**: `your-site.vercel.app`

#### **Custom Domains (Professional)**

- **Namecheap**: $8.88/year
- **GoDaddy**: $12.99/year
- **Google Domains**: $12/year
- **Cloudflare**: $9.15/year

### **Step 2: DNS Configuration**

#### **For Netlify:**

1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Update DNS records:

   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

#### **For GitHub Pages:**

1. Go to Repository Settings → Pages
2. Add custom domain
3. Create CNAME file with your domain
4. Update DNS:

   ```
   Type: CNAME
   Name: www
   Value: your-username.github.io

   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

#### **For VPS/Shared Hosting:**

1. Point domain to your server IP
2. Configure web server
3. Set up SSL certificate

### **Step 3: SSL Certificate Setup**

#### **Free SSL Options:**

- **Let's Encrypt**: Free, 90-day renewal
- **Cloudflare**: Free SSL + CDN
- **Hosting Provider**: Often included

#### **SSL Configuration Commands:**

```bash
# Install Certbot (Ubuntu/Debian)
sudo apt update
sudo apt install certbot python3-certbot-apache

# Get SSL certificate
sudo certbot --apache -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Step 4: Update Website Configuration**

#### **Update Domain References:**

1. Replace `your-domain.com` in:

   - `index-production.html`
   - `sitemap.xml`
   - `robots.txt`
   - `site.webmanifest`

2. Update Open Graph URLs:
   ```html
   <meta property="og:url" content="https://your-actual-domain.com" />
   <meta
     property="og:image"
     content="https://your-actual-domain.com/images/og-image.jpg"
   />
   ```

### **Step 5: Test Your Domain**

#### **DNS Propagation Check:**

- Use [whatsmydns.net](https://whatsmydns.net)
- Check A and CNAME records
- Wait 24-48 hours for full propagation

#### **SSL Test:**

- Use [ssllabs.com](https://ssllabs.com/ssltest/)
- Check SSL grade and configuration
- Ensure HTTPS redirect works

### **Step 6: Performance Optimization**

#### **CDN Setup:**

- **Cloudflare**: Free CDN + SSL
- **AWS CloudFront**: Pay-per-use
- **KeyCDN**: $0.04/GB

#### **DNS Optimization:**

```
# Use Cloudflare nameservers for better performance
ns1.cloudflare.com
ns2.cloudflare.com
```

## 🔧 **Quick Domain Setup Script**

```bash
#!/bin/bash
# Update domain references in all files

DOMAIN="your-actual-domain.com"

# Update HTML files
sed -i "s/your-domain.com/$DOMAIN/g" index-production.html
sed -i "s/your-domain.com/$DOMAIN/g" sitemap.xml
sed -i "s/your-domain.com/$DOMAIN/g" robots.txt
sed -i "s/your-domain.com/$DOMAIN/g" site.webmanifest

echo "✅ Domain references updated to: $DOMAIN"
```

## 📊 **Domain Health Checklist**

- ✅ Domain registered
- ✅ DNS configured
- ✅ SSL certificate installed
- ✅ HTTPS redirect working
- ✅ WWW redirect configured
- ✅ Domain references updated
- ✅ CDN configured (optional)
- ✅ DNS propagation complete

## 🚨 **Common Issues & Solutions**

### **DNS Not Propagating:**

- Wait 24-48 hours
- Clear DNS cache: `ipconfig /flushdns`
- Check with different DNS servers

### **SSL Certificate Issues:**

- Verify domain ownership
- Check DNS records
- Use Let's Encrypt troubleshooting

### **HTTPS Redirect Not Working:**

- Check .htaccess file
- Verify SSL configuration
- Test with curl: `curl -I https://your-domain.com`

---

**Your domain is now ready for professional hosting! 🌍**
