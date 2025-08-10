# Contributing

Contributing guidelines, code review process, and development standards.

## Contents

- [Getting Started](./getting-started.md) - How to start contributing
- [Code Standards](./code-standards.md) - Coding conventions and best practices
- [Pull Request Process](./pull-requests.md) - How to submit changes
- [Testing Guidelines](./testing.md) - Testing requirements and standards

## Quick Start for Contributors

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/mtkcare-help.git
   cd mtkcare-help
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Make your changes** following our coding standards
6. **Test your changes**:
   ```bash
   npm run build
   npm run dev
   ```
7. **Submit a pull request**

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Provide proper type definitions for all functions
- Avoid `any` types where possible

### React Components
- Use functional components with hooks
- Follow consistent naming conventions
- Implement proper accessibility attributes

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography

### Commit Messages
Follow conventional commits format:
```
feat: add new help panel feature
fix: resolve sidebar navigation issue
docs: update API documentation
style: improve button component styling
refactor: reorganize component structure
test: add unit tests for help system
```

## Review Process

1. All changes require a pull request
2. At least one reviewer must approve
3. All CI checks must pass
4. Documentation must be updated if applicable
5. Breaking changes require additional review