# TeamSpec CLI

> Bootstrap TeamSpec 4.0 Product-Canon Operating Model in any repository

[![npm version](https://img.shields.io/npm/v/teamspec.svg)](https://www.npmjs.com/package/teamspec)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is TeamSpec?

TeamSpec is a **Product-Canon Operating Model** for software teams. It provides:

- **Product Canon** — Single source of truth for production behavior (AS-IS)
- **Feature-Increments** — Proposed changes to products (TO-BE)
- **Delta-based Stories** — Stories describe changes, not full behavior
- **Role-based Workflows** — Clear ownership boundaries (PO, BA, FA, SA, DEV, QA, SM)
- **AI Agent Integration** — Works with GitHub Copilot, Cursor, Claude, and more

## Installation

### Global Install (Recommended)

```bash
npm install -g teamspec
```

### npx (No Install)

```bash
npx teamspec
```

## Quick Start

### Interactive Setup

```bash
cd your-repo
teamspec
```

The CLI will ask:
1. Your team profile (startup, enterprise, regulated, etc.)
2. Organization and team name
3. Industry sector
4. Development cadence (scrum, kanban, scrumban)
5. Initial project ID

### Non-Interactive Setup

```bash
teamspec --profile startup --org "My Company" --team "Web Team" -y
```

## What Gets Created

```
your-repo/
├── .teamspec/                    # Core framework
│   ├── templates/                # Document templates
│   ├── definitions/              # DoR/DoD checklists
│   ├── profiles/                 # Profile overlays
│   └── context/
│       └── team.yml              # Your team configuration
├── .github/
│   └── copilot-instructions.md   # GitHub Copilot guidance (optional)
├── projects/main-project/        # Project artifacts
│   ├── features/                 # Feature Canon (source of truth)
│   │   ├── features-index.md     # Feature registry
│   │   └── story-ledger.md       # Completed story tracking
│   ├── stories/                  # User stories
│   │   ├── backlog/              # New stories
│   │   ├── ready-to-refine/      # Ready for dev refinement
│   │   └── ready-for-development/# Ready for sprint
│   ├── adr/                      # Architecture decisions
│   ├── decisions/                # Business decisions
│   ├── dev-plans/                # Development task breakdowns
│   ├── qa/                       # Test cases
│   ├── sprints/                  # Sprint management
│   └── epics/                    # Epic specifications

```

## Commands

### Initialize TeamSpec

```bash
teamspec [init] [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `-t, --target <dir>` | Target directory (default: current) |
| `-p, --profile <profile>` | Team profile |
| `-o, --org <name>` | Organization name |
| `--team <name>` | Team name |
| `--project <id>` | Project ID |
| `--ide <ide>` | IDE integration (vscode, cursor, other, none) |
| `--copilot <yes\|no>` | Install GitHub Copilot instructions (default: yes) |
| `-y, --non-interactive` | Skip prompts, use defaults |

### Update TeamSpec

```bash
teamspec update [options]
```

Updates templates, definitions, and profiles while preserving your team configuration.

**Options:**

| Option | Description |
|--------|-------------|
| `-f, --force` | Update without confirmation |
| `-y, --non-interactive` | Skip confirmation prompt |

## Profiles

| Profile | Description |
|---------|-------------|
| `none` | Vanilla TeamSpec |
| `startup` | Lean documentation, speed focus |
| `platform-team` | API-first, SLA focus |
| `enterprise` | Full governance, audit trails |
| `regulated` | Banking, healthcare, government compliance |

## TeamSpec Commands (for AI Agents)

Once configured, use these commands with your AI assistant:

### Product Owner

```
ts:po product    # Create new product with PRX prefix
ts:po project    # Create new project targeting product(s)
ts:po sync       # Sync Feature-Increments to Product Canon (post-deploy)
ts:po status     # Product/project status overview
```

### Business Analysis

```
ts:ba analysis   # Create business analysis document
ts:ba ba-increment # Create BA increment in project
ts:ba review     # Review artifacts for business intent
```

### Functional Analysis

```
ts:fa feature    # Create feature in Product Canon
ts:fa feature-increment # Create feature-increment in project
ts:fa epic       # Create epic in project
ts:fa story      # Create story linked to epic
```

### Development

```
ts:dev plan      # Create development plan
ts:dev implement # Execute from existing plan
```

### Quality Assurance

```
ts:qa test       # Design test cases for Feature-Increment
ts:qa regression # Update product regression tests
ts:qa verify     # Validate DoD compliance
ts:qa uat        # Create UAT pack
```

### Scrum Master

```
ts:sm sprint create  # Create new sprint
ts:sm sprint status  # View sprint status
ts:sm sprint close   # Close sprint with metrics
```

## Key Concepts

### Feature Canon

The Feature Canon is the **single source of truth** for system behavior. It lives in `projects/<project-id>/features/` and contains:

- **Feature Files** — Define what the system does
- **Features Index** — Registry of all features
- **Story Ledger** — Tracks how features evolved through stories

### Delta-based Stories

Stories describe **changes** (deltas) to the Feature Canon, not full behavior:

```markdown
### Before (current behavior)
Reference: F-001, Section: User Registration

### After (new behavior)
Email confirmation is now optional for OAuth users.
```

### Workflow Folders

Stories move through workflow folders:

1. `stories/backlog/` — FA creates new stories here
2. `stories/ready-to-refine/` — FA moves stories ready for dev refinement
3. `stories/ready-for-development/` — DEV moves refined stories here
4. Sprint — SM assigns to active sprint

## Configuration

Edit `.teamspec/context/team.yml` to customize:

```yaml
org:
  name: "Your Organization"
  industry: technology
  profile: startup

team:
  name: "Your Team"
  roles: [BA, FA, DEV, QA, SM]
  cadence:
    type: scrum
    sprint_length_days: 14

tech:
  stack:
    - Python
    - React
    - PostgreSQL

governance:
  sign_off_required: false
  audit_trail: false
```

## Development

### Local Testing

```bash
cd cli
npm link
teamspec --help
```

### Running Tests

```bash
npm test
```

## License

MIT

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
