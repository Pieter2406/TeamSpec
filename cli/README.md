# TeamSpec CLI

> Bootstrap TeamSpec 2.0 Feature Canon Operating Model in any repository

[![npm version](https://img.shields.io/npm/v/teamspec.svg)](https://www.npmjs.com/package/teamspec)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is TeamSpec?

TeamSpec is a **Feature Canon Operating Model** for software teams. It provides:

- **Feature Canon** — Single source of truth for system behavior
- **Delta-based Stories** — Stories describe changes, not full behavior
- **Role-based Workflows** — Clear ownership boundaries (BA, FA, SA, DEV, QA, SM)
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
1. Which AI IDE/Agent you'll use
2. Your team profile (startup, enterprise, regulated, etc.)
3. Organization and team name
4. Development cadence (scrum, kanban, scrumban)
5. Initial project ID

### Non-Interactive Setup

```bash
teamspec --ide copilot --profile startup --org "My Company" --team "Web Team" -y
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
└── .github/copilot-instructions.md  # AI agent instructions (varies by IDE)
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
| `-i, --ide <ide>` | AI IDE to configure |
| `-p, --profile <profile>` | Team profile |
| `-o, --org <name>` | Organization name |
| `--team <name>` | Team name |
| `--project <id>` | Project ID |
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

## Supported IDEs

| IDE | Instruction Path | Status |
|-----|------------------|--------|
| GitHub Copilot | `.github/copilot-instructions.md` | Placeholder* |
| Cursor | `.cursor/rules` | Placeholder* |
| Claude | `CLAUDE.md` | Placeholder* |
| Windsurf | `.windsurfrules` | Placeholder* |
| Aider | `.aider/conventions.md` | Placeholder* |
| Cline | `.clinerules` | Placeholder* |
| Continue | `.continue/config.json` | Placeholder* |
| Generic | `.teamspec/AGENT_INSTRUCTIONS.md` | Placeholder* |

*Agent-specific prompts will be added in a future update. For now, copy agent prompts from the [TeamSpec repository](https://github.com/teamspec/teamspec/tree/main/agents).

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

### Business Analysis

```
ts:ba create     # Create business analysis
ts:ba feature    # Propose and create features
ts:ba epic       # Propose epics with justification
```

### Functional Analysis

```
ts:fa story      # Create user story
ts:fa slice      # Slice requirements into stories
ts:fa sync       # Update Feature Canon after story completion
```

### Development

```
ts:dev plan      # Create development plan
ts:dev implement # Execute from existing plan
```

### Quality Assurance

```
ts:qa test       # Design test cases
ts:qa bug        # File bug report
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
