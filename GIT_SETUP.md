# 🌐 Git Setup & GitHub Instructions

## 📝 Initial Git Setup

### 1. Initialize Git Repository

```bash
cd "c:\Users\dimit\Desktop\Final Project\restaurant-management"
git init
```

### 2. Create .gitignore (Already done!)

The `.gitignore` file is already configured to exclude:
- `node_modules/`
- `.env` files
- `dist/` build folders
- IDE files

### 3. Make First Commit

```bash
# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Restaurant Management System backend setup

- Complete TypeScript + Express + Prisma setup
- Authentication system with JWT
- Products module (CRUD)
- Domain-Driven Design architecture
- Layered structure (Repository/Service/Controller)
- Zod validation
- Error handling middleware
- Database seeding
- Comprehensive documentation"
```

---

## 🚀 Push to GitHub

### 1. Create GitHub Repository

1. Go to https://github.com
2. Click "New repository"
3. Name: `restaurant-management-system`
4. Description: `Full-stack Restaurant Inventory & Sales Management System - Coding Factory Final Project`
5. **Public** or **Private** (your choice)
6. **DO NOT** initialize with README (we have one)
7. Click "Create repository"

### 2. Connect Local Repo to GitHub

```bash
# Add remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/restaurant-management-system.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 📦 What Gets Committed

### ✅ Included in Git:
- Source code (`src/`)
- Prisma schema (`prisma/schema.prisma`)
- Configuration files (`tsconfig.json`, `.eslintrc.json`, etc.)
- Documentation (`.md` files)
- `.gitignore`
- `.env.example` (template)

### ❌ Excluded from Git (in `.gitignore`):
- `node_modules/` - Dependencies (huge!)
- `.env` - Secrets (passwords, JWT keys)
- `dist/` - Build output
- IDE files (`.vscode`, `.idea`)

---

## 🔄 Git Workflow

### Daily Development

```bash
# Check status
git status

# Add changed files
git add .

# Commit with message
git commit -m "Add recipe module with CRUD operations"

# Push to GitHub
git push
```

### Good Commit Messages

✅ **Good:**
```
Add recipe CRUD endpoints
Fix authentication middleware bug
Update Prisma schema for sales module
Add input validation for products
```

❌ **Bad:**
```
update
fix bug
changes
asdf
```

---

## 🌿 Branching Strategy (Optional but Professional)

### Main Branch Protection

```bash
# Create development branch
git checkout -b develop

# Work on feature
git checkout -b feature/recipe-module

# After testing, merge to develop
git checkout develop
git merge feature/recipe-module

# When stable, merge to main
git checkout main
git merge develop
git push
```

---

## 📝 README for GitHub

Your `README.md` is already perfect! It includes:
- ✅ Project description
- ✅ Tech stack
- ✅ Features
- ✅ Installation instructions
- ✅ Architecture explanation

---

## 🎯 For Final Project Submission

### What to Submit (18/1/2026)

**Create a .txt file with:**
```
GitHub Repository: https://github.com/YOUR_USERNAME/restaurant-management-system
Live Demo (optional): https://your-deployed-app.com
```

---

## 📄 Important Files to Have on GitHub

Make sure these are present:
- ✅ `README.md` - Main documentation
- ✅ `backend/README.md` - Backend setup
- ✅ `backend/prisma/schema.prisma` - Domain models
- ✅ Source code (`src/`)
- ✅ `.env.example` - Environment template
- ✅ `package.json` - Dependencies

---

## 🔐 Security Checklist

Before pushing to GitHub:

- [ ] `.env` is in `.gitignore` ✅ (Already done)
- [ ] No passwords in code ✅
- [ ] No API keys in code ✅
- [ ] `.env.example` has placeholder values ✅

---

## 🎓 Git Commands Cheat Sheet

```bash
# Status & Info
git status              # Check changes
git log                 # View commits
git diff                # See changes

# Basic Workflow
git add .               # Stage all changes
git commit -m "message" # Commit with message
git push                # Push to GitHub

# Branching
git branch              # List branches
git checkout -b feature # Create & switch to branch
git merge feature       # Merge branch

# Undo Changes
git reset HEAD file     # Unstage file
git checkout -- file    # Discard changes
git revert <commit>     # Undo commit

# Sync
git pull                # Get latest from GitHub
git fetch               # Check for updates
```

---

## 📸 Repository Structure on GitHub

```
restaurant-management-system/
├── README.md                  # ⭐ Main documentation
├── GETTING_STARTED.md
├── PROJECT_STRUCTURE.md
├── QUICK_REFERENCE.md
├── SETUP_COMPLETE.md
│
└── backend/
    ├── README.md
    ├── package.json
    ├── tsconfig.json
    ├── .env.example          # Template (no secrets!)
    ├── prisma/
    │   └── schema.prisma     # ⭐ Domain models
    └── src/
        ├── domain/
        │   ├── users/
        │   ├── products/
        │   ├── recipes/
        │   └── sales/
        └── shared/
```

---

## 🚀 After Pushing to GitHub

Your repository will show:
- Complete project structure
- Professional documentation
- Clean commit history
- Easy to clone and run

Anyone (including evaluators) can:
```bash
git clone https://github.com/YOUR_USERNAME/restaurant-management-system.git
cd restaurant-management-system/backend
npm install
cp .env.example .env
# Edit .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

---

## 💡 Pro Tips

1. **Commit often** - Small, focused commits are better
2. **Write clear messages** - Explain what and why
3. **Use branches** for new features (optional)
4. **Keep `.env` secret** - Never commit it!
5. **Update README** as you add features

---

## 🎯 For Your Presentation

Highlight in README:
- 🏗️ Architecture (DDD, layered)
- 🔐 Security (JWT, bcrypt)
- ✅ Best practices (TypeScript, validation)
- 📚 Documentation (multiple .md files)
- 🧪 Easy to setup and test

---

## ✅ Ready to Push?

```bash
cd "c:\Users\dimit\Desktop\Final Project\restaurant-management"
git init
git add .
git commit -m "Initial commit: Complete backend setup"
git remote add origin https://github.com/YOUR_USERNAME/restaurant-management-system.git
git push -u origin main
```

**Replace YOUR_USERNAME with your actual GitHub username!**
