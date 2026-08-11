# Git Branch Strategy & Workflow Guidelines

To ensure smooth collaboration and minimize merge conflicts during development, the team will follow this Git workflow.

---

## Branch Structure

* **`main`**: Stable production-ready branch. Must compile and pass all tests. Only **Juwel** is authorized to merge Pull Requests into `main`.
* **Feature Branches**: Every member will work in an isolated feature branch named according to their role/module:
  - `feature/ashwin-data` - Dataset preparation, seed scripts, and schemas
  - `feature/deon-db` - Database configuration, SQLAlchemy models
  - `feature/anna-ml` - Optimization algorithms and forecast models
  - `feature/juwel-backend` - FastAPI routers and main service coordination
  - `feature/sourav-frontend` - Web client layout, map, styles, and interactivity
  - `feature/nandana-tests` - Test scripts and presentation assets

---

## Step-by-Step Developer Workflow

### 1. Clone & Setup
```bash
git clone <repository-url>
cd sih_kerala_tourism
git checkout main
```

### 2. Create and Switch to Feature Branch
Before doing any coding, ensure you are on your specific branch:
```bash
git checkout -b feature/<your-name-module>
```

### 3. Work on Your Module
* Make atomic, meaningful commits.
* Prefix commit messages with your module name:
  - `git commit -m "data: Add Alleppey water-tourism Carrying Capacity boundaries"`
  - `git commit -m "ml: Add weighted sum scorer for tourist redirection"`
* Do not modify files owned by another member without coordinate approval.

### 4. Syncing with Main (Rebasing)
Before submitting code, pull the latest changes from `main` to verify no conflicts exist:
```bash
git checkout main
git pull origin main
git checkout feature/<your-name-module>
git rebase main
```
*If conflicts arise, resolve them locally in your IDE and execute `git rebase --continue`.*

### 5. Push Feature Branch & Create Pull Request (PR)
Push your branch to the remote repository:
```bash
git push origin feature/<your-name-module>
```
Go to GitHub and create a Pull Request targeting `main`.

### 6. Review & Merge
* Juwel (Team Lead) will review the PR.
* Code must be run locally or pass automated tests before Juwel merges it into `main`.
* Once merged, delete the remote feature branch.

---

## Git Safety Rules
1. **Never commit secrets/API keys.** Use `.env` file for local development and keep it ignored.
2. **Never push directly to `main`.** Always use PRs.
3. **Do not commit dataset raw dumps.** If a dataset is > 10MB, place it in git LFS or host it externally, adding a small sample in `data/sample/`.
