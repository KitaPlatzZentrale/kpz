# Wiki Setup Instructions

Complete guide for setting up the docs folder to sync with GitHub Wiki.

## Overview

This repository uses a `docs/` folder that automatically syncs with the GitHub Wiki. This provides:
- Documentation version control alongside code
- Automated wiki updates
- Markdown-based documentation workflow

## Initial Setup (First Time)

### Step 1: Pull Existing Wiki Content

Before the automated sync overwrites existing wiki content, we should preserve it:

```bash
# Clone the existing wiki repository
git clone https://github.com/KitaPlatzZentrale/kpz.wiki.git wiki-backup

# Review existing content
ls -la wiki-backup/

# If there's valuable content, copy it to docs/
# (Manual review recommended)
```

### Step 2: Enable Wiki on GitHub

1. Go to https://github.com/KitaPlatzZentrale/kpz/settings
2. Scroll to "Features" section
3. Ensure "Wikis" is checked (enabled)

### Step 3: Initialize Wiki (if empty)

If the wiki doesn't exist yet:

1. Go to https://github.com/KitaPlatzZentrale/kpz/wiki
2. Click "Create the first page"
3. Add any temporary content
4. Click "Save Page"

This creates the wiki Git repository that the GitHub Action will push to.

### Step 4: Test GitHub Action Permissions

The GitHub Action needs permission to push to the wiki repository:

1. Go to repository Settings → Actions → General
2. Under "Workflow permissions", ensure:
   - ✅ "Read and write permissions" is selected
   - ✅ "Allow GitHub Actions to create and approve pull requests" (optional)

### Step 5: Push docs Folder

```bash
# From repository root
git add docs/
git commit -m "Add documentation folder for wiki sync"
git push origin main
```

### Step 6: Verify Sync

1. Check GitHub Actions: https://github.com/KitaPlatzZentrale/kpz/actions
2. Look for "Sync Documentation to Wiki" workflow
3. Verify it completed successfully
4. Check wiki: https://github.com/KitaPlatzZentrale/kpz/wiki

## How the Sync Works

### Automatic Sync

The GitHub Action (`.github/workflows/sync_wiki.yml`) runs when:
- Changes are pushed to `main` branch
- Files in `docs/**` are modified
- Manual trigger via workflow_dispatch

### Sync Process

1. Action checks out the main repository
2. Action checks out the wiki repository
3. All wiki content is deleted (except .git folder)
4. All docs/ content is copied to wiki
5. Changes are committed and pushed to wiki

### Important Notes

⚠️ **One-Way Sync**: The sync is **docs → wiki** only
- Changes made in docs/ folder will be pushed to wiki
- Changes made directly in wiki UI will be **overwritten**
- **Always edit files in docs/ folder, not in wiki UI**

## Daily Workflow

### Editing Documentation

1. Edit files in `docs/` folder locally
2. Preview locally (any Markdown viewer)
3. Commit changes
4. Push to `main` branch
5. GitHub Action automatically syncs to wiki

### Adding New Pages

1. Create new `.md` file in `docs/` folder
2. Use descriptive name: `New-Feature-Guide.md`
3. Write content in Markdown
4. Push to GitHub
5. New page appears in wiki automatically

### File Naming Conventions

- Use hyphens for spaces: `API-Reference.md`
- Start with capital letters
- Use `.md` extension
- Avoid special characters
- `Home.md` becomes the wiki homepage

### Linking Between Pages

Use wiki-style links:
```markdown
See [Architecture](Architecture.md) for details.
Or: See [[Architecture]] for details.
```

## Manual Sync (Advanced)

If you need to manually sync without waiting for GitHub Actions:

```bash
# Clone wiki repository
git clone https://github.com/KitaPlatzZentrale/kpz.wiki.git wiki-temp

# Remove old content
cd wiki-temp
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

# Copy docs content
cp -r ../docs/* .

# Commit and push
git add .
git commit -m "Manual sync from docs folder - $(date)"
git push origin master

# Clean up
cd ..
rm -rf wiki-temp
```

## Troubleshooting

### Sync Not Working

**Check GitHub Actions Log**:
1. Go to Actions tab
2. Click on failed workflow
3. Review error messages

**Common Issues**:
- Wiki not enabled in repository settings
- Workflow doesn't have write permissions
- Wiki repository doesn't exist (create first page manually)

### Wiki Shows Old Content

- Check if GitHub Action completed successfully
- Clear browser cache
- Wait a few minutes for GitHub to refresh

### Changes Not Syncing

- Ensure changes were pushed to `main` branch
- Verify files are in `docs/` folder (not a subfolder)
- Check file paths in GitHub Actions workflow

### Permission Denied

- Verify workflow permissions in repository settings
- Check if GITHUB_TOKEN has write access

## Pulling Wiki Changes (If Needed)

If you need to pull changes from wiki to docs/ (rare):

```bash
# Clone wiki
git clone https://github.com/KitaPlatzZentrale/kpz.wiki.git wiki-temp

# Copy to docs
cp -r wiki-temp/* docs/

# Review changes
git diff docs/

# Commit if desired
git add docs/
git commit -m "Update docs from wiki"
git push origin main

# Clean up
rm -rf wiki-temp
```

⚠️ **Warning**: This will be overwritten on next automatic sync from docs/

## Migrating Existing Wiki Content

If you have valuable content in the current wiki:

### Step 1: Backup Existing Wiki

```bash
# Clone current wiki
git clone https://github.com/KitaPlatzZentrale/kpz.wiki.git wiki-backup

# Create backup archive
cd wiki-backup
tar -czf ../wiki-backup-$(date +%Y%m%d).tar.gz .
cd ..
```

### Step 2: Review and Integrate

```bash
# List existing wiki pages
ls -la wiki-backup/

# Copy valuable content to docs/
# (Manual review recommended)
cp wiki-backup/Important-Page.md docs/
```

### Step 3: Clean Up

```bash
# After integrating valuable content
rm -rf wiki-backup
```

## Disabling Automatic Sync

If you need to temporarily disable automatic sync:

1. Go to `.github/workflows/sync_wiki.yml`
2. Comment out the `on:` triggers:
```yaml
# on:
#   push:
#     branches:
#       - main
#     paths:
#       - 'docs/**'
#   workflow_dispatch:
```
3. Commit and push

To re-enable, uncomment the triggers.

## Best Practices

1. **Always edit in docs/**, never in wiki UI
2. **Test locally** before pushing
3. **Use descriptive file names**
4. **Link between pages** for better navigation
5. **Keep docs organized** with clear structure
6. **Review sync logs** after pushing changes
7. **Backup** before major restructuring

## Future Enhancements

Potential improvements:
- [ ] Bi-directional sync (docs ↔ wiki)
- [ ] Conflict detection and resolution
- [ ] Automatic table of contents generation
- [ ] Link validation
- [ ] Markdown linting in CI/CD

---

For questions or issues with wiki sync, create a GitHub issue or contact the maintainers.
