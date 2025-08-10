# Troubleshooting

Common issues, debugging guides, and FAQ for MTK Care Help.

## Contents

- [Common Issues](./common-issues.md) - Frequently encountered problems
- [Development Issues](./development.md) - Development-specific troubleshooting
- [Browser Compatibility](./browser-compatibility.md) - Browser-specific issues
- [FAQ](./faq.md) - Frequently asked questions

## Quick Fixes

### Development Server Won't Start
1. **Port already in use**:
   ```bash
   # Find process using port 3001
   ss -tlnp | grep :3001
   
   # Kill the process (replace PID)
   kill -9 <PID>
   ```

2. **Module not found errors**:
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build errors**:
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

### CSS Issues
- **Tailwind classes not working**: Check if Tailwind CSS is properly configured
- **Styles not updating**: Clear browser cache and restart dev server
- **Component styling broken**: Verify all required CSS imports are present

### Help Panel Issues
- **Help panel won't open**: Check browser console for JavaScript errors
- **Help content not loading**: Verify API endpoints are accessible
- **Search not working**: Ensure help content API is responding correctly

## Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Known Issues
- Some animations may not work on older browsers
- Internet Explorer is not supported

## Getting Help
- Check the [FAQ](./faq.md) for common questions
- Review [development issues](./development.md) for coding problems
- Contact support if issues persist