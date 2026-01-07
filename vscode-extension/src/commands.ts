/**
 * TeamSpec Command Library
 * 
 * Single source of truth for all slash commands in the TeamSpec chat participant.
 * Each command maps to a role's agent prompt + specific macro instructions.
 */

export type RoleCode = 'BA' | 'FA' | 'SA' | 'DEV' | 'QA' | 'SM' | 'DES' | 'DISPATCHER';

export interface CommandDefinition {
    /** Command name (matches package.json commands[].name) */
    name: string;
    /** What the command does */
    description: string;
    /** Which role agent to load */
    role: RoleCode;
    /** Subcommand patterns this command handles */
    subcommands?: SubCommand[];
    /** Macro instruction to inject after role prompt */
    macro: string;
    /** Expected output format */
    outputSchema?: string;
    /** Required inputs (IDs, references) */
    requiredInputs?: string[];
    /** Files/folders to read for context */
    contextNeeds?: ContextNeed[];
    /** Quality gates to enforce before processing */
    gateChecks?: GateCheck[];
}

export interface SubCommand {
    /** Subcommand name pattern */
    pattern: string;
    /** Description */
    description: string;
    /** Override macro for this subcommand */
    macro: string;
    /** Additional required inputs */
    requiredInputs?: string[];
}

export interface ContextNeed {
    /** What to look for */
    type: 'feature' | 'story' | 'adr' | 'decision' | 'sprint' | 'project' | 'devplan';
    /** Description of what's needed */
    description: string;
    /** Is this required or optional? */
    required: boolean;
}

export interface GateCheck {
    /** Gate name */
    name: string;
    /** What to check */
    check: string;
    /** Message if gate fails */
    failMessage: string;
}

/**
 * Complete command library - maps slash commands to role prompts + macros
 */
export const COMMAND_LIBRARY: CommandDefinition[] = [
    // ========== BA Commands ==========
    {
        name: 'ba',
        description: 'Business Analyst workflows: project creation, features, decisions',
        role: 'BA',
        subcommands: [
            {
                pattern: 'project',
                description: 'Create project structure',
                macro: `Execute project creation workflow:
1. Gather project information (name, ID, stakeholders, goals)
2. Create project folder structure
3. Generate project.yml
4. Create README.md
5. Initialize features/ and stories/ folders
Wait for user confirmation before creating files.`,
                requiredInputs: ['project-name']
            },
            {
                pattern: 'epic',
                description: 'Define an epic',
                macro: `Execute epic creation workflow:
1. Identify epic scope and goal
2. Link to project
3. Break down into candidate features
4. Create epic file in /epics/
Wait for user confirmation before creating files.`,
                requiredInputs: ['epic-title']
            },
            {
                pattern: 'feature',
                description: 'Create feature file',
                macro: `Execute feature creation workflow:
1. Gather feature requirements (purpose, value, scope)
2. Define personas/actors
3. Create feature file in /features/
4. Update features-index.md
Ensure feature is implementation-agnostic.
Wait for user confirmation before creating files.`,
                requiredInputs: ['feature-title']
            },
            {
                pattern: 'decision',
                description: 'Log business decision',
                macro: `Log a business decision:
1. Capture decision context
2. Document options considered
3. Record rationale
4. Link to affected features
5. Create decision file in /decisions/`,
                requiredInputs: ['decision-title']
            },
            {
                pattern: 'sync',
                description: 'Validate business attributes',
                macro: `Validate Canon business sections:
1. Check all features have Purpose, Value, Scope sections
2. Verify BA ownership sections are complete
3. Report any gaps or inconsistencies
4. Suggest updates if needed`,
            },
            {
                pattern: 'review',
                description: 'Review BA document critically',
                macro: `Review the BA document:
1. Check for implementation-agnostic language
2. Verify business value is clear
3. Check scope boundaries
4. Identify any gaps
5. Provide actionable feedback`,
            }
        ],
        macro: `You are the Business Analyst agent. Help with:
- Project creation (ba project)
- Epic definition (ba epic)
- Feature extraction (ba feature)
- Decision logging (ba decision)
- Business validation (ba sync)

Ask what specific BA task the user needs help with.`,
        contextNeeds: [
            { type: 'project', description: 'Current project context', required: false },
            { type: 'feature', description: 'Related features', required: false }
        ]
    },

    // ========== FA Commands ==========
    {
        name: 'fa',
        description: 'Functional Analyst workflows: stories, Canon sync, story slicing',
        role: 'FA',
        subcommands: [
            {
                pattern: 'story',
                description: 'Create a new story',
                macro: `Create a story as a DELTA to the Feature Canon:
1. Identify the linked feature (REQUIRED)
2. Document BEFORE state (reference Canon)
3. Document AFTER state (the delta)
4. Write testable Acceptance Criteria
5. Mark impact type (Adds/Changes/Fixes/Removes)
6. Create story in /stories/backlog/
NEVER create a story without a feature link.`,
                requiredInputs: ['feature-id']
            },
            {
                pattern: 'slice',
                description: 'Slice feature into stories',
                macro: `Slice a feature into implementable stories:
1. Read the Feature Canon entry
2. Identify discrete behavior changes
3. Create story deltas for each change
4. Ensure each story is independently deliverable
5. Link all stories to the feature`,
                requiredInputs: ['feature-id']
            },
            {
                pattern: 'refine',
                description: 'Move story to ready-to-refine',
                macro: `Refine a story for development:
1. Verify feature link exists
2. Check Before/After delta is clear
3. Validate ACs are testable
4. Move to /stories/ready-to-refine/`,
                requiredInputs: ['story-id']
            },
            {
                pattern: 'sync',
                description: 'Update Feature Canon after story completion',
                macro: `CRITICAL: Canon sync workflow:
1. Identify completed story
2. Check impact type (Adds/Changes Behavior?)
3. Update Feature Canon sections
4. Add Change Log entry with story reference
5. Update story-ledger.md
6. Verify DoD checkbox is checked
A story CANNOT be Done until Canon is synchronized.`,
                requiredInputs: ['story-id']
            }
        ],
        macro: `You are the Functional Analyst agent. Help with:
- Story creation (fa story)
- Story slicing (fa slice)
- Story refinement (fa refine)
- Canon synchronization (fa sync)

The Feature Canon is the source of truth. Stories are DELTAS only.
Ask what specific FA task the user needs help with.`,
        contextNeeds: [
            { type: 'feature', description: 'Feature Canon entry', required: true },
            { type: 'story', description: 'Existing stories', required: false }
        ],
        gateChecks: [
            {
                name: 'Feature Link',
                check: 'Story must link to at least one feature',
                failMessage: 'Cannot create story without feature link. Please specify feature ID (F-XXX).'
            }
        ]
    },

    // ========== SA Commands ==========
    {
        name: 'arch',
        description: 'Solution Architect workflows: ADRs, technical design',
        role: 'SA',
        subcommands: [
            {
                pattern: 'adr',
                description: 'Create an ADR',
                macro: `Create an Architecture Decision Record:
1. Define decision scope and title
2. Document context and problem
3. List alternatives considered
4. Record decision and rationale
5. Link to affected features
6. Assess consequences
7. Create in /adr/`,
                requiredInputs: ['decision-title']
            },
            {
                pattern: 'sync',
                description: 'Sync technical design to stories',
                macro: `Sync ADR constraints to stories:
1. Identify ADR constraints
2. Find affected stories
3. Add technical notes to stories
4. Ensure DEV is aware of constraints`,
                requiredInputs: ['adr-id']
            },
            {
                pattern: 'review',
                description: 'Review technical approach',
                macro: `Review technical approach:
1. Check ADR coverage for significant decisions
2. Verify constraints are documented
3. Assess technical coherence
4. Identify missing ADRs`,
            }
        ],
        macro: `You are the Solution Architect agent. Help with:
- ADR creation (arch adr)
- Technical sync (arch sync)
- Technical review (arch review)

SA defines HOW the system is built, not WHAT it does.
Ask what specific architecture task the user needs help with.`,
        contextNeeds: [
            { type: 'adr', description: 'Existing ADRs', required: false },
            { type: 'feature', description: 'Features for linking', required: false }
        ]
    },

    // ========== DEV Commands ==========
    {
        name: 'dev',
        description: 'Developer workflows: dev plans, implementation, branches',
        role: 'DEV',
        subcommands: [
            {
                pattern: 'plan',
                description: 'Create development plan',
                macro: `Create a development plan:
1. Load story from ready-to-refine or ready-for-development
2. Verify ADR exists (if required)
3. Break down into tasks
4. Estimate effort for each task
5. Identify dependencies
6. Create dev plan in /dev-plans/
NEVER start coding without a dev plan.`,
                requiredInputs: ['story-id']
            },
            {
                pattern: 'implement',
                description: 'Start implementation workflow',
                macro: `Guide implementation:
1. Verify dev plan exists
2. Load Canon and ADR constraints
3. Guide through tasks
4. Suggest commit structure
5. Check for scope creep
6. Prepare for PR`,
                requiredInputs: ['story-id']
            },
            {
                pattern: 'commit',
                description: 'Generate structured commit message',
                macro: `Generate commit message:
1. Identify story and task
2. Create conventional commit format
3. Link to story ID
4. Describe changes`,
            },
            {
                pattern: 'branch',
                description: 'Create correctly-named branch',
                macro: `Create branch name:
1. Get story ID
2. Generate branch name: feature/S-XXX-description
3. Suggest git command`,
                requiredInputs: ['story-id']
            },
            {
                pattern: 'ready',
                description: 'Move story to ready-for-development',
                macro: `Move story to ready:
1. Verify story is in ready-to-refine
2. Check DoR criteria met
3. Verify dev plan exists
4. Move to /stories/ready-for-development/`,
                requiredInputs: ['story-id']
            }
        ],
        macro: `You are the Developer agent. Help with:
- Dev planning (dev plan)
- Implementation guidance (dev implement)
- Commit messages (dev commit)
- Branch creation (dev branch)
- Story readiness (dev ready)

Plan before code. Never implement what's not in the Canon.
Ask what specific dev task the user needs help with.`,
        contextNeeds: [
            { type: 'story', description: 'Story to implement', required: true },
            { type: 'devplan', description: 'Development plan', required: false },
            { type: 'adr', description: 'Technical constraints', required: false },
            { type: 'feature', description: 'Feature Canon', required: true }
        ],
        gateChecks: [
            {
                name: 'Dev Plan',
                check: 'Dev plan must exist before implementation',
                failMessage: 'No dev plan found. Run @teamspec /dev plan first.'
            }
        ]
    },

    // ========== QA Commands ==========
    {
        name: 'qa',
        description: 'QA Engineer workflows: test cases, bug reports, UAT',
        role: 'QA',
        subcommands: [
            {
                pattern: 'test',
                description: 'Design test cases',
                macro: `Create feature-level test cases:
1. Read Feature Canon entry
2. Identify test scenarios from behavior
3. Create test cases for each AC
4. Include edge cases from Canon
5. Create in /qa/test-cases/
Tests are FEATURE-LEVEL, not story-specific.`,
                requiredInputs: ['feature-id']
            },
            {
                pattern: 'bug',
                description: 'File bug report',
                macro: `Create bug report:
1. Document expected vs actual behavior
2. CLASSIFY bug type (REQUIRED):
   - Implementation Defect (code doesn't match Canon)
   - Canon Wrong (Canon doesn't match intent)
   - Undocumented Behavior (not specified)
3. Link to feature and story
4. Create in /qa/bugs/`,
            },
            {
                pattern: 'uat',
                description: 'Create UAT pack',
                macro: `Create UAT instructions:
1. Identify feature personas
2. Create persona-based scenarios
3. Write step-by-step instructions
4. Define success criteria
5. Create in /qa/uat/`,
                requiredInputs: ['feature-id']
            },
            {
                pattern: 'dor-check',
                description: 'Check Definition of Ready',
                macro: `Validate DoR for story:
1. Check feature link exists
2. Verify Before/After delta
3. Check ACs are testable
4. Verify no TBD content
5. Check estimate exists
Report pass/fail for each criterion.`,
                requiredInputs: ['story-id']
            },
            {
                pattern: 'dod-check',
                description: 'Check Definition of Done',
                macro: `Validate DoD for story:
1. Check all ACs verified
2. Check code reviewed
3. Check tests passing
4. Check Canon updated (if behavior changed)
5. Check documentation updated
Report pass/fail for each criterion.`,
                requiredInputs: ['story-id']
            }
        ],
        macro: `You are the QA Engineer agent. Help with:
- Test case design (qa test)
- Bug reporting (qa bug)
- UAT packs (qa uat)
- DoR checking (qa dor-check)
- DoD checking (qa dod-check)

Tests are feature-level. Bugs must be classified.
Ask what specific QA task the user needs help with.`,
        contextNeeds: [
            { type: 'feature', description: 'Feature Canon', required: true },
            { type: 'story', description: 'Story under test', required: false }
        ]
    },

    // ========== SM Commands ==========
    {
        name: 'sm',
        description: 'Scrum Master workflows: sprints, standups, retros',
        role: 'SM',
        subcommands: [
            {
                pattern: 'sprint create',
                description: 'Create new sprint',
                macro: `Create sprint:
1. Determine sprint number
2. Create /sprints/sprint-N/ folder
3. Create sprint-goal.md
4. Initialize metrics tracking`,
            },
            {
                pattern: 'sprint plan',
                description: 'Facilitate sprint planning',
                macro: `Sprint planning facilitation:
1. Show ready stories (from ready-for-development)
2. Calculate team capacity
3. Help select stories
4. Validate commitment
ONLY ready stories can be added.`,
            },
            {
                pattern: 'sprint add',
                description: 'Add story to current sprint',
                macro: `Add story to sprint:
1. Verify story is in ready-for-development
2. Check DoR is met
3. Add to sprint backlog
4. Update sprint-goal.md`,
                requiredInputs: ['story-id']
            },
            {
                pattern: 'sprint remove',
                description: 'Remove story from sprint',
                macro: `Remove story from sprint:
1. Document reason for removal
2. Move back to ready-for-development
3. Update sprint-goal.md`,
                requiredInputs: ['story-id']
            },
            {
                pattern: 'sprint status',
                description: 'Sprint health report',
                macro: `Generate sprint status:
1. Count stories by state
2. Calculate burndown
3. Identify blockers
4. Report risks
5. Show Canon sync status`,
            },
            {
                pattern: 'sprint close',
                description: 'Close sprint with metrics',
                macro: `Close sprint:
1. Verify all stories are Done
2. Capture velocity
3. Archive sprint folder
4. Create next sprint folder`,
            },
            {
                pattern: 'standup',
                description: 'Generate standup agenda',
                macro: `Standup facilitation:
1. List in-progress stories
2. Identify blockers
3. Check Canon sync status
4. Generate discussion agenda`,
            },
            {
                pattern: 'planning',
                description: 'Sprint planning facilitation',
                macro: `Sprint planning guide:
1. Review sprint goal
2. Show available stories
3. Estimate capacity
4. Facilitate commitment`,
            },
            {
                pattern: 'retro',
                description: 'Retrospective facilitation',
                macro: `Retrospective facilitation:
1. What went well?
2. What could improve?
3. Action items
4. Update process docs`,
            }
        ],
        macro: `You are the Scrum Master agent. Help with:
- Sprint management (sm sprint create/plan/add/remove/status/close)
- Ceremonies (sm standup, sm planning, sm retro)

SM is NEUTRAL: facilitate, track, report - never decide.
Ask what specific SM task the user needs help with.`,
        contextNeeds: [
            { type: 'sprint', description: 'Current sprint', required: false },
            { type: 'story', description: 'Stories in sprint', required: false }
        ]
    },

    // ========== DES Commands ==========
    {
        name: 'des',
        description: 'Designer workflows: UX design, feature flows',
        role: 'DES',
        subcommands: [
            {
                pattern: 'design',
                description: 'Create feature design',
                macro: `Create feature-level design:
1. Read Feature Canon
2. Identify personas
3. Design user journey
4. Create wireframes/flows
5. Link to feature
Designs are FEATURE-LEVEL, not story-level.`,
                requiredInputs: ['feature-id']
            },
            {
                pattern: 'flow',
                description: 'Design user flow',
                macro: `Design user flow:
1. Identify entry/exit points
2. Map user journey
3. Note decision points
4. Document error states`,
                requiredInputs: ['feature-id']
            },
            {
                pattern: 'handoff',
                description: 'Prepare design handoff',
                macro: `Prepare design handoff:
1. List all design artifacts
2. Document specifications
3. Note behavior decisions
4. Create checklist for DEV`,
                requiredInputs: ['feature-id']
            }
        ],
        macro: `You are the Designer agent. Help with:
- Feature design (des design)
- User flows (des flow)
- Design handoff (des handoff)

Designs are feature-level. Design serves the Canon, doesn't dictate it.
Ask what specific design task the user needs help with.`,
        contextNeeds: [
            { type: 'feature', description: 'Feature Canon', required: true }
        ],
        gateChecks: [
            {
                name: 'Personas',
                check: 'Feature must have defined personas',
                failMessage: 'Cannot design without personas. Ask BA to define personas first.'
            }
        ]
    },

    // ========== Quick Commands (Artifact shortcuts) ==========
    {
        name: 'story',
        description: 'Quick story creation (delegates to FA)',
        role: 'FA',
        macro: `Create a story as a DELTA to the Feature Canon:
1. Identify the linked feature (REQUIRED)
2. Document BEFORE state (reference Canon)
3. Document AFTER state (the delta)
4. Write testable Acceptance Criteria
5. Mark impact type (Adds/Changes/Fixes/Removes)
6. Create story in /stories/backlog/
NEVER create a story without a feature link.`,
        requiredInputs: ['feature-id'],
        contextNeeds: [
            { type: 'feature', description: 'Feature Canon entry', required: true }
        ]
    },
    {
        name: 'feature',
        description: 'Quick feature creation (delegates to BA)',
        role: 'BA',
        macro: `Execute feature creation workflow:
1. Gather feature requirements (purpose, value, scope)
2. Define personas/actors
3. Create feature file in /features/
4. Update features-index.md
Ensure feature is implementation-agnostic.
Wait for user confirmation before creating files.`,
        requiredInputs: ['feature-title']
    },
    {
        name: 'adr',
        description: 'Quick ADR creation (delegates to SA)',
        role: 'SA',
        macro: `Create an Architecture Decision Record:
1. Define decision scope and title
2. Document context and problem
3. List alternatives considered
4. Record decision and rationale
5. Link to affected features
6. Assess consequences
7. Create in /adr/`,
        requiredInputs: ['decision-title']
    },
    {
        name: 'bug',
        description: 'Quick bug report (delegates to QA)',
        role: 'QA',
        macro: `Create bug report:
1. Document expected vs actual behavior
2. CLASSIFY bug type (REQUIRED):
   - Implementation Defect (code doesn't match Canon)
   - Canon Wrong (Canon doesn't match intent)
   - Undocumented Behavior (not specified)
3. Link to feature and story
4. Create in /qa/bugs/`
    },
    {
        name: 'sprint',
        description: 'Quick sprint operations (delegates to SM)',
        role: 'SM',
        macro: `Sprint operations menu:
- Create new sprint: "sprint create"
- Plan sprint: "sprint plan"
- Add story: "sprint add S-XXX"
- Remove story: "sprint remove S-XXX"
- Status: "sprint status"
- Close: "sprint close"

What would you like to do?`
    },

    // ========== Meta Commands ==========
    {
        name: 'status',
        description: 'Project status overview and health check',
        role: 'DISPATCHER',
        macro: `Generate project status report:
1. Scan project structure
2. Count features, stories by state
3. Show current sprint status
4. Identify Canon sync gaps
5. List blocking issues
6. Show recent changes`,
        contextNeeds: [
            { type: 'project', description: 'Project structure', required: true },
            { type: 'sprint', description: 'Active sprint', required: false }
        ]
    },
    {
        name: 'feedback',
        description: 'Report issues, bugs, or improvement suggestions for TeamSpec',
        role: 'DISPATCHER',
        macro: `Help the user provide structured feedback about TeamSpec:

1. Ask what type of feedback:
   - 🐛 Bug Report
   - 📝 Prompt Issue
   - 💡 Feature Request
   - 📚 Documentation Issue
   - ⚡ UX Improvement

2. Collect relevant details based on feedback type

3. Generate structured feedback in markdown format with:
   - Type, Date, Severity
   - Summary and Details
   - Steps to reproduce (if applicable)
   - Affected components
   - Environment info
   - Suggested fix (optional)

4. Offer to:
   - Create GitHub issue at github.com/Pieter2406/TeamSpec/issues
   - Save locally to feedback/ folder
   - Just display without saving

Be thorough but empathetic. Make it easy to report issues.`
    },
    {
        name: 'help',
        description: 'Show available commands and examples',
        role: 'DISPATCHER',
        macro: `Show TeamSpec help:

## Available Commands

### Role Commands
- \`/ba\` - Business Analyst: projects, features, decisions
- \`/fa\` - Functional Analyst: stories, Canon sync
- \`/arch\` - Solution Architect: ADRs, technical design
- \`/dev\` - Developer: dev plans, implementation
- \`/qa\` - QA Engineer: tests, bugs, UAT
- \`/sm\` - Scrum Master: sprints, ceremonies
- \`/des\` - Designer: UX design, flows

### Quick Commands
- \`/story\` - Create story (quick FA)
- \`/feature\` - Create feature (quick BA)
- \`/adr\` - Create ADR (quick SA)
- \`/bug\` - Report bug (quick QA)
- \`/sprint\` - Sprint ops (quick SM)

### Meta Commands
- \`/status\` - Project overview
- \`/context\` - Show workspace context
- \`/help\` - This help

## Examples
- \`@teamspec /fa story F-042\` - Create story for feature F-042
- \`@teamspec /dev plan S-001\` - Create dev plan for story S-001
- \`@teamspec /qa test F-042\` - Design tests for feature F-042
- \`@teamspec /sm sprint status\` - Show sprint health`
    },
    {
        name: 'context',
        description: 'Show current workspace context and project state',
        role: 'DISPATCHER',
        macro: `Show current context:
1. Detected project folder
2. Current file/selection
3. Active sprint (if any)
4. Recent features and stories
5. Agent configuration`
    }
];

/**
 * Find command definition by name
 * Handles both direct commands (ba, fa) and flattened subcommands (ba-project, fa-story)
 */
export function findCommand(name: string): CommandDefinition | undefined {
    // Direct match first
    const direct = COMMAND_LIBRARY.find(cmd => cmd.name === name);
    if (direct) {
        return direct;
    }
    
    // Check for flattened subcommand format (role-subcommand)
    const match = name.match(/^(\w+)-(.+)$/);
    if (match) {
        const [, roleName, subName] = match;
        const parentCmd = COMMAND_LIBRARY.find(cmd => cmd.name === roleName);
        if (parentCmd && parentCmd.subcommands) {
            // Find the matching subcommand
            const normalizedSubName = subName.replace(/-/g, ' ');
            const subCmd = parentCmd.subcommands.find(sub => 
                sub.pattern === normalizedSubName || sub.pattern === subName
            );
            if (subCmd) {
                // Return a synthetic command with the subcommand's macro
                return {
                    name: name,
                    description: subCmd.description,
                    role: parentCmd.role,
                    macro: subCmd.macro,
                    requiredInputs: subCmd.requiredInputs || parentCmd.requiredInputs,
                    contextNeeds: parentCmd.contextNeeds,
                    gateChecks: parentCmd.gateChecks
                };
            }
        }
    }
    
    return undefined;
}

/**
 * Find subcommand within a command
 */
export function findSubCommand(command: CommandDefinition, subName: string): SubCommand | undefined {
    return command.subcommands?.find(sub => subName.startsWith(sub.pattern));
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: RoleCode): string {
    const names: Record<RoleCode, string> = {
        'BA': 'Business Analyst',
        'FA': 'Functional Analyst',
        'SA': 'Solution Architect',
        'DEV': 'Developer',
        'QA': 'QA Engineer',
        'SM': 'Scrum Master',
        'DES': 'Designer',
        'DISPATCHER': 'TeamSpec Assistant'
    };
    return names[role];
}
