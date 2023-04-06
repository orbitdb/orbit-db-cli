# Getting Started

> [PoC Innovation's Open-Source project template](https://github.com/PoCInnovation/open-source-project-template)

Please read carefully this guide.

## Setup

In this part, you will configure your project.

### Branches

Branch protection is really important. It helps you to have control on your code.

For each of the following branches, add the required protections.

#### `main`

```markdown
- [x] Require a pull request before merging
  - [x] Require approvals
        Required number of approvals before merging: 1

- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging

- [x] Require conversation resolution before merging
```

### Documents

This template provides the must-have documents.

#### README.md

The README.md is the showcase of your project. It always must be clean and consistent. Otherwise, no one will care of your project.

Fill every sections of the [README.md](/README.md).
> If you add pictures, put them in the [assets](./assets/) folder.

#### CONTRIBUTING.md

The CONTRIBUTING.md is the guide to contribute to your project. It always must be clean and consistent. Otherwise, no one will contribute to your project.

Fill every sections of the [CONTRIBUTING.md](/CONTRIBUTING.md).

#### LICENSE

The LICENSE protects your code and contributors.

This template provides an [Apache Licence 2.0](https://www.apache.org/licenses/LICENSE-2.0).
> If you want another one, check this [guide](https://choosealicense.com).

If your project doesn't belong to [PoC Innovation](https://github.com/PoCInnovation), make sure to update the copyrights of the [LICENCE](/LICENSE).

### About

Update the `About` section by adding a description, a website, and topics.

### Templates

This template provides the must-have templates.

#### Issues

An issue is a tool to track and focus tasks.

This template provides two issues templates :
- `Bug Report`
- `Feature Request`

Change the default assignee of the [bug_report](./ISSUE_TEMPLATE/bug_report.yml) template.

Change the default assignee of the [feature_request](./ISSUE_TEMPLATE/feature_request.yml) template.

#### Pull Requests

A pull request is an event where a contributor asks a maintainer to review code.

This template provides a [pull request template](./pull_request_template.md). You don't need to update it.

#### Milestones

A milestone helps to track progress on groups of issues or pull requests.

This template provides a [milestone template](./milestone_template.md). You don't need to update it.

### Labels

A label helps to categorize issues and pull requests.

Make sure to have the following labels :

- `bug`: Something isn't working
- `bugfix`: Resolve a bug
- `chore`: Global maintenance
- `documentation`: Improvements or additions to documentation
- `duplicate`: This issue or pull request already exists
- `enhancement`: New feature or request
- `help wanted`: Extra attention is needed
- `invalid`: This doesn't seem right
- `major`: Major update (for release)
- `minor`: Minor update (for release)
- `patch`: Patch update (for release)
- `question`: Further information is requested
- `triage`: Need to be tagged
- `wontfix`: This will not be worked on

### GitHub project

Create a GitHub project to manage your milestones, issues and pull requests.

### Actions

This template provides some GitHub actions.

#### Release Drafter

A release is tool with changelogs that present a full history of a project.

This template provides an [action](./workflows/release-drafter.yml) that drafts [next releases notes](./release-drafter.yml) as pull requests are merged into the main branch. You don't need to update it.
> Check this [action's documentation](https://github.com/release-drafter/release-drafter) to understand how it works

### Settings

#### Visibility

Make your repository public.

## Sprints

In this part, you will learn how to manage sprints.

A sprint is associated as a milestone.\
A task is associated as an issue.

### Workflow

The workflow to follow is:

1) Create a milestone
2) Create all the needed issues linked to this milestone
3) Manage the pull requests linked with these issues using the GitHib project
4) Resolve these issues
5) Publish a release
6) Close the milestone

### Milestones

Each milestones must use the [milestone template](./milestone_template.md).

There are two parts :
- Overall
  > **⚠️ It's checklist must be completed before starting this sprint ⚠️**
- Final Report
  > **⚠️ It's checklist must be completed before starting a new sprint ⚠️**

Additional information is written in the milestones's checklists. Read them carefully!

### Issues

Create all the required issues of a sprint before starting it. Once the sprint started, no issue linked to it should be create.

**Each issue must be linked to a milestone and a GitHub project, have the right labels and be assigned to someone.**

You can discuss in a issue, do it as much as you can!

### Pull Requests

**Each pull request must be linked to an issue and a GitHub project, have the right labels, be assigned to someone and have a reviewer.**

You can discuss in a pull request, do it as much as you can!

### GitHub project

**No tasks (issue) must be created directly from the GitHub project. Create an issue using a template, it will automatically appears on the GitHub project. Don't forget to archive the tasks once the milestone is closed.**

It is a powerful tool, use it well!

### Releases

**Each update on the main branch must be linked to a release.**

Tag pull requests with the `patch`, `minor` or `major` labels.

## Notes

### Discord Webhook

We strongly advice you to have a discord channel on which you will receive GitHub updates on your project.

Follow this [tutorial](https://gist.github.com/SGTGunner/50d6a3cc0d489cf779f77695ba3e22ea).

### Security dependabot

We strongly advice you to have a security dependabot to fix vulnerable dependencies.

Follow this [tutorial](https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/configuring-dependabot-security-updates#managing-dependabot-security-updates-for-your-repositories).

### Help

If you have any questions, please contact [Reza Rahemtola](https://github.com/RezaRahemtola).

> Made with ❤️ by PoC
