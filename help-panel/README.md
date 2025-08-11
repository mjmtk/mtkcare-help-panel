# MTK Care Help Panel

Standalone help panel component for integration with Django applications. Optimized for New Zealand healthcare organizations.

## Features

- 🚀 **Fast**: Optimized for NZ/Australia with Sydney edge deployment
- 🎨 **Customizable**: Configurable themes, positions, and behaviors  
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- ♿ **Accessible**: Built on Radix UI primitives
- 🔐 **Compliant**: Healthcare-compliant with no PII tracking
- ✏️ **Content Management**: Non-coder friendly via Notion integration

## Quick Start

### Installation

```bash
# In your Django app's frontend
npm install @supabase/supabase-js
```

### Basic Usage

```typescript
import { 
  HelpProvider, 
  HelpTrigger, 
  IntegratedHelpPanel 
} from './help-panel'

function App() {
  return (
    <HelpProvider config={{
      apiBaseUrl: 'https://mtkcare-help.vercel.app/api',
      analytics: false,  // Disabled for compliance
      theme: 'auto'
    }}>
      <div className="app-layout">
        <Header>
          <HelpTrigger />  {/* Help button (?) */}
        </Header>
        <MainContent />
        <IntegratedHelpPanel />  {/* Help panel overlay */}
      </div>
    </HelpProvider>
  )
}
```

## Configuration Options

```typescript
interface HelpPanelConfig {
  apiBaseUrl: string           // Required: API endpoint
  theme?: 'light' | 'dark' | 'auto'    // Default: 'auto'
  position?: 'right' | 'left'           // Default: 'right'
  defaultMode?: 'sheet' | 'pinned'      // Default: 'sheet'
  analytics?: boolean                   // Default: false
  customStyles?: string                 // Optional: custom CSS
}
```

## Content Management

### For Non-Coders

1. **Notion Setup**: Content creators use Notion database
2. **Claude Desktop**: AI assists with content creation
3. **Auto Sync**: Content syncs to Supabase every 6 hours
4. **Live Updates**: Changes appear in help panel automatically

### Notion Template

```
Help Articles Database:
├── Title (Title field)
├── Description (Text field)
├── Content (Rich text field)
├── Category (Select: Getting Started, Features, etc.)
├── Tags (Multi-select field)
├── Status (Select: Draft, Review, Published)
└── ID (Auto-generated slug)
```

### Claude Desktop Prompts

```
"Help me create a help article for healthcare case managers about [TOPIC]. 
Include:
- Clear step-by-step instructions
- Common problems and solutions
- Keep it simple for busy counsellors"
```

## API Endpoints

The help panel connects to these API endpoints:

```
GET /api/help/content          # List help articles
GET /api/help/content/[id]     # Get specific article
GET /api/help/popular          # Popular articles
POST /api/help/analytics       # Track usage (anonymous)
```

## Performance

- **NZ Optimized**: Sydney region deployment for <50ms latency
- **CDN Cached**: Content cached at edge for fast delivery
- **Lightweight**: <100KB total bundle size
- **Lazy Loading**: Content loaded on demand

## Compliance Features

- **No PII**: No personal information collected or stored
- **Anonymous Analytics**: Usage tracking without user identification
- **GDPR Compliant**: Built-in data protection controls
- **Audit Trail**: Optional local logging in Django app

## Integration Examples

### Django Proxy (Optional)

```python
# For additional compliance control
class HelpContentProxy(View):
    def get(self, request):
        response = requests.get(
            'https://mtkcare-help.vercel.app/api/help/content',
            params=request.GET
        )
        
        # Log locally if needed
        HelpUsageLog.objects.create(
            user=request.user,
            action='view',
            timestamp=timezone.now()
        )
        
        return JsonResponse(response.json())
```

### Custom Styling

```typescript
<HelpProvider config={{
  apiBaseUrl: 'your-api-url',
  customStyles: `
    .help-panel { 
      --help-primary-color: #your-brand-color;
    }
  `
}}>
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build

# Deploy to Vercel
vercel --prod
```

## Support

- **Documentation**: See `/docs` folder for detailed guides
- **Issues**: Report via GitHub issues
- **Healthcare Compliance**: Contact for compliance documentation