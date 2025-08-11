# Backend Deployment Strategy

## Context

MTK Care Help is a healthcare application serving community service organizations (mental health, family violence, youth counselling). Primary users are counsellors, case managers, and supervisors.

### Current Architecture
- **Main App**: Django backend deployed in client's Azure tenant (compliance requirement)
- **Frontend**: Next.js help panel integrated into main application
- **Help Content**: Currently using mock API data

## Deployment Decision: External vs Internal

### Business Requirements
- Avoid compliance challenges by deploying main app in client's Azure tenant
- Need flexible help content management system
- Fast iteration cycles for help content updates
- Cost-effective solution for content delivery

### Compliance Considerations

#### ✅ External Deployment - Acceptable
- Pure help content (no PHI/PII)
- Anonymous usage analytics
- Anonymous feedback ratings
- Search queries (non-specific content)

#### ❌ External Deployment - Compliance Issues  
- User identification/tracking across systems
- Session data linking to client cases
- Contextual data from case management
- Patterns that could enable re-identification

### Recommended Architecture: External Deployment

```
┌─────────────────────────────┐    ┌──────────────────────────────┐
│     Azure Tenant            │    │    External Provider         │
│   (Client Organization)     │    │   (Railway/Vercel/Render)   │
│                             │    │                              │
│  ┌─────────────────────┐    │    │  ┌─────────────────────┐     │
│  │   Django Backend    │────┼────┼──│  Help Content API   │     │
│  │   - Healthcare Data │    │    │  │  - Static Articles  │     │
│  │   - User Auth       │    │    │  │  - Anonymous Stats  │     │
│  │   - Case Management │    │    │  │  - Content CMS      │     │
│  │   - Local Analytics │    │    │  └─────────────────────┘     │
│  └─────────────────────┘    │    │                              │
│                             │    └──────────────────────────────┘
│  ┌─────────────────────┐    │
│  │   Next.js Frontend  │    │
│  │   - Help Panel UI   │    │
│  │   - User Interface  │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

## Implementation Strategy

### Phase 1: External Deployment (Current)
- Deploy help content service on external provider
- Anonymous content delivery only
- No user identification or tracking
- Simple content management interface

### Phase 2: Enhanced Integration
- Add Django proxy layer if needed
- Local analytics collection
- Enhanced feedback system
- Content synchronization

### Phase 3: Migration Path (If Required)
- Easy migration to Azure tenant if compliance requires
- Zero code changes in frontend
- Export/import content workflow
- Maintain API compatibility

## Compliance Safeguards

### Data Processing Agreement
- Clear boundaries on data types
- No PHI/PII transmission
- Anonymous usage patterns only
- Right to audit and migrate

### Technical Safeguards
- No user authentication on external service
- No session tracking or cookies
- Stripped request headers (no identifying info)
- Local logging of user interactions

### Questions for Client Validation
1. Can external services be used for non-sensitive help content?
2. Are there data residency requirements for user interactions?
3. Do you need audit trails for help system usage?
4. What are your BAA requirements for help content?

## Risk Assessment

### Low Risk ✅
- Static help content delivery
- Anonymous usage analytics
- Content management workflows
- Performance and cost benefits

### Medium Risk ⚠️
- Feedback collection (can be handled locally)
- Usage pattern analysis (aggregate only)
- Search query logging (anonymized)

### High Risk ❌
- User identification across services
- Case-related contextual help
- Personal data in any form

## Decision Matrix

| Factor | External | Internal |
|--------|----------|----------|
| Compliance Risk | Low | None |
| Development Speed | High | Medium |
| Cost | Low | High |
| Performance | High | Medium |
| Control | Medium | High |
| Migration Effort | Medium | None |

**Recommendation**: Start with external deployment, maintain migration path to internal if compliance requirements change.

## Documentation Status
- **Created**: 2024-01-XX
- **Last Updated**: 2024-01-XX  
- **Review Date**: Quarterly
- **Stakeholders**: Development Team, Compliance, Client Organizations