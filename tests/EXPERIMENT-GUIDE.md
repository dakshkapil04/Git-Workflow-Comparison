# Experiment guide and measurement rules

## Goal
Compare Git Flow, GitHub Flow and Trunk-Based Development using the same small feature tasks and consistent measurement rules.

## Keep the experiment fair
- Use the same repository codebase and feature tasks for each workflow.
- Use the same number of contributors (or clearly state that this is a single-student simulation).
- Use the same testing and deployment procedure.
- Repeat each task consistently; record timestamps and outcomes immediately.
- Do not treat the dashboard's sample values as measured results.

## Suggested tasks
1. Add a `status` section to the page.
2. Add a metric card for average integration time.
3. Add a small explanatory section for deployment failure rate.

## Workflow procedure
### Git Flow
- `main` contains production-ready versions.
- Create `develop` from `main`.
- Create `feature/task-name` from `develop`.
- Merge feature branches into `develop`.
- Create a `release/1.0` branch when preparing a release.
- Merge the release into `main` and back into `develop`.

### GitHub Flow
- Keep `main` deployable.
- Create a short-lived feature branch from `main`.
- Commit and push the feature branch.
- Open a Pull Request, review it, and merge to `main`.
- Record PR open-to-merge time.

### Trunk-Based Development
- Keep `main` as the shared trunk.
- Make small changes and integrate them frequently.
- Use very short-lived branches if direct commits are not suitable.
- Run automated checks on every push and Pull Request.
- Record time between first task commit and trunk integration.

## Metric definitions
- Merge conflicts: count each distinct conflict event encountered while integrating a task. Use the same counting rule for all strategies.
- Integration time: elapsed wall-clock time from the first task commit to successful integration into the target shared branch. Record in hours.
- Commit frequency: meaningful commits divided by contributor-days. Report as commits per developer per day.
- Collaboration efficiency: use median PR review time (hours) as a measurable proxy where PRs exist. Also discuss review quality, hand-offs and coordination limitations. A direct-commit workflow may have no PR review time; mark it N/A rather than inventing a value.
- Deployment failure rate: failed deployment attempts / total deployment attempts * 100. Define a failure before starting (for example, failed health check or failed automated deployment job).

## Data collection sheet
For every task and workflow record:
- Workflow name and task ID
- Start timestamp and first commit timestamp
- Integration timestamp
- Commit count and number of contributors
- Conflict events and resolution time
- PR opened, first review and merged timestamps (if applicable)
- Deployment attempts, successful deployments and failed deployments
- Notes about environment or unusual events

## Limitations
A small student experiment is not enough to establish universal failure-rate rankings. Results depend on team size, codebase, test quality, branch protection, deployment environment and experience. Explain these limitations in the report.
