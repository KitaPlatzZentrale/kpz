# Documentation Folder

This folder is automatically synced with the [GitHub Wiki](https://github.com/KitaPlatzZentrale/kpz/wiki).

## How It Works

1. **Edit files in this `docs/` folder** in your local repository
2. **Commit and push to `main` branch**
3. **GitHub Actions automatically syncs** the content to the Wiki

## Setup Instructions

### Initial Setup (One-time)

Before the automatic sync works, you need to initialize the Wiki:

1. **Enable Wiki on GitHub**:
   - Go to: https://github.com/KitaPlatzZentrale/kpz/settings
   - Scroll to "Features"
   - Check "Wikis"

2. **Create the Wiki** (if it doesn't exist):
   - Go to: https://github.com/KitaPlatzZentrale/kpz/wiki
   - Click "Create the first page"
   - Add any content and save

3. **Push this docs folder** to trigger the first sync:
   ```bash
   git add docs/
   git commit -m "Add documentation folder"
   git push origin main
   ```

### Writing Documentation

- Create `.md` files in this folder
- Use standard Markdown syntax
- `Home.md` becomes the wiki homepage
- Other files become wiki pages (e.g., `API.md` → "API" page)

### File Naming

- Use descriptive names: `Getting-Started.md`, `API-Reference.md`
- Avoid spaces in filenames (use hyphens or underscores)
- The `.md` extension is required

### Manual Sync (Optional)

If you need to manually update the wiki without waiting for the GitHub Action:

```bash
# Clone the wiki repository
git clone https://github.com/KitaPlatzZentrale/kpz.wiki.git wiki-temp

# Copy docs content to wiki
cp -r docs/* wiki-temp/

# Commit and push
cd wiki-temp
git add .
git commit -m "Manual sync from docs folder"
git push
cd ..
rm -rf wiki-temp
```

## Current Documentation Structure

- `Home.md` - Wiki homepage and overview
- `Architecture.md` - System architecture documentation
- `Development-Guide.md` - Development setup and workflows
- `API-Reference.md` - API endpoints documentation
- `Deployment.md` - Deployment procedures
- `Terraform-Migration.md` - Infrastructure migration plan

## Notes

- The sync is **one-way** (docs → wiki)
- Changes made directly in the GitHub Wiki UI will be **overwritten**
- Always edit files in this `docs/` folder, not in the wiki UI
- The GitHub Action runs on every push to `main` that modifies `docs/**`
