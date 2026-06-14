# GitHub Deployment Checklist

## Before Pushing to GitHub
- [ ] 🔑 **SECRET CHECK: NO API key NOT in .env.example (only placeholders)
- [ ] 🔑 **SECRET CHECK: backend/.env is in gitignore
- [ ] 🔑 **SECRET CHECK: root .gitignore ignores all sensitive files
- [ ] 🔄 **Git Status Check: git status does NOT list .env or crm.db or __pycache__
- [ ] 🔄 **Git Status Check: git status does NOT list node_modules or .next
- [ ] 📝 **README check: if repo has a README (if needed)
- [ ] 🛠️ **backend/.env.example has placeholders only
- [ ] 📝 Root .gitignore exists and is configured correctly

## First-Time Git Setup (if repo not initialized)
```bash
# Initialize repo
git init
git add .
# Check git status - ensure no secrets!
git status
# Commit safe files only!
```

## If backend/.env was tracked by git (remove it shouldn't be, but just in case):
```bash
git rm --cached backend/.env
git commit -m "Remove .env from git tracking"
```

## Git Commit Steps
```bash
git add .
git status  # double-check no secrets!
git commit -m "Initial commit"
# Add remote and push
```
