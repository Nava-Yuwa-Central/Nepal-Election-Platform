# GitHub Setup Guide for Who's My Neta

## Initial Repository Setup

### 1. Create Repository on GitHub

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `whosmyneta`
3. Add description: "Civic engagement platform for rating Nepal's Gen Z leaders"
4. Choose public repository
5. Do NOT initialize with README (we have one)
6. Click "Create repository"

### 2. Initialize Git and Push Code

```bash
cd whosmyneta

# Initialize git
git init
git add .
git commit -m "Initial commit: MVP with full-stack implementation"

# Add remote
git remote add origin https://github.com/yourusername/whosmyneta.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Create Development Branch

```bash
git checkout -b develop
git push -u origin develop
```

## Branch Strategy

- **main** - Production-ready code (stable releases)
- **develop** - Development branch for next release
- **feature/*** - Feature branches (e.g., feature/polling-system)
- **bugfix/*** - Bug fix branches (e.g., bugfix/vote-counting)

## Collaboration Setup

### 1. Add Collaborators

1. Go to Settings → Collaborators
2. Add team members with appropriate permissions
3. Recommended roles:
   - Maintainers: Full access
   - Developers: Can push to develop, create PRs
   - Contributors: Can fork and submit PRs

### 2. Branch Protection Rules

1. Go to Settings → Branches
2. Add rule for `main` branch:
   - Require pull request reviews (1 approval)
   - Require status checks to pass
   - Include administrators in restrictions

### 3. GitHub Actions (CI/CD)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm build
```

## Contributing Guidelines

Create `CONTRIBUTING.md`:

```markdown
# Contributing to Who's My Neta

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/whosmyneta.git`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Commit: `git commit -am 'Add feature description'`
6. Push: `git push origin feature/your-feature`
7. Submit a Pull Request

## Code Style

- Use TypeScript for type safety
- Follow existing code patterns
- Run `pnpm lint` before committing
- Write meaningful commit messages

## Pull Request Process

1. Update README.md with any new features
2. Ensure all tests pass
3. Request review from maintainers
4. Address feedback and push updates
5. Merge after approval

## Reporting Issues

Use GitHub Issues to report bugs or suggest features. Include:
- Clear description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable
```

## Release Management

### Semantic Versioning

Use semantic versioning (MAJOR.MINOR.PATCH):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Creating a Release

```bash
# Update version in package.json
npm version minor

# Create git tag
git tag v1.1.0

# Push tag to GitHub
git push origin v1.1.0

# Create release on GitHub with changelog
```

## Documentation

### README Structure
- ✅ Project description
- ✅ Features list
- ✅ Tech stack
- ✅ Project structure
- ✅ Getting started
- ✅ Development guide
- ✅ API documentation
- ✅ Database schema
- ✅ Deployment instructions

### Additional Documentation
- ✅ USER_GUIDE.md - For end users
- ✅ CONTRIBUTING.md - For contributors
- ✅ API.md - Detailed API documentation (optional)

## Deployment

### Vercel Deployment

1. Go to [Vercel](https://vercel.com)
2. Import GitHub repository
3. Configure environment variables
4. Deploy

### Environment Variables for Production

```
DATABASE_URL=your_mysql_connection_string
JWT_SECRET=your_jwt_secret
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im
VITE_APP_TITLE=Who's My Neta
VITE_APP_LOGO=https://your-cdn.com/logo.png
```

## Maintenance

### Regular Tasks

- Review and merge pull requests
- Update dependencies: `pnpm update`
- Monitor issues and discussions
- Release updates quarterly or as needed

### Security

- Keep dependencies updated
- Review security advisories
- Use GitHub's security features
- Implement rate limiting for APIs

## Resources

- [GitHub Docs](https://docs.github.com)
- [Semantic Versioning](https://semver.org)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Keep a Changelog](https://keepachangelog.com)

---

For questions or issues, open a GitHub Issue or contact the maintainers.
