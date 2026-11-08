# Git Workflow Comparison System

A beginner-friendly DevOps project comparing Git Flow, GitHub Flow and Trunk-Based Development.

## Requirements
- A modern web browser
- Git and GitHub (for version control and CI)
- Optional: VS Code

No Node.js server, database, package installation or external chart library is required to run the dashboard.

## Run locally
1. Download or clone this repository.
2. Open the project folder.
3. Double-click `index.html`, or use VS Code Live Server.
4. Edit the metric values in the form and select **Save and update dashboard**.
5. Export your results as JSON when needed.

The dashboard stores edited metrics in the browser's localStorage. Use the same browser to see saved values. The `data/metrics.json` file is a reference data sheet; the dashboard does not automatically write browser edits back to that file.

## Important about sample metrics
The initial dashboard values are illustrative placeholders only. They are not research findings. Run the experiments described in `tests/EXPERIMENT-GUIDE.md`, record your own observations, and replace the sample values before submitting your report.

## Metrics
- Merge conflicts
- Code integration time
- Commit frequency
- PR review time as a collaboration-efficiency proxy
- Deployment failure rate

## GitHub Actions
- `.github/workflows/ci.yml` checks JavaScript syntax, required files and JSON validity on pushes and pull requests.
- `.github/workflows/deploy.yml` deploys the static dashboard to GitHub Pages when changes are pushed to `main` (after Pages is configured in repository settings).

## Suggested Git workflow demonstrations
See `tests/EXPERIMENT-GUIDE.md` for step-by-step Git Flow, GitHub Flow and Trunk-Based procedures.

## Publish with GitHub Pages
1. Push this repository to GitHub.
2. Open repository Settings > Pages.
3. Under Build and deployment, choose **GitHub Actions** as the source.
4. Push a change to `main`, or manually run the `Deploy dashboard to GitHub Pages` workflow from the Actions tab.
5. Wait for the deployment job to finish and open the published URL shown in the job summary.

GitHub Pages serves the static dashboard. The included deployment workflow publishes the site; the separate CI workflow validates the files.

## Screenshots for report
Save genuine screenshots in `screenshots/`:
1. Project structure in VS Code
2. `git init`, initial commit and `git log`
3. Git Flow branches and merge history
4. GitHub Flow feature branch and pull request
5. Trunk-based short-lived integration and commit history
6. A real merge conflict and its resolution
7. GitHub Actions successful run
8. A failed check (only if you intentionally demonstrate one)
9. Dashboard with your recorded results
10. GitHub Pages deployed dashboard
11. Repository overview

## Limitations
This is a small educational comparison. A deployment failure rate from a small number of attempts has high uncertainty. Report the number of attempts alongside the percentage and avoid claiming that one workflow is always safest.
