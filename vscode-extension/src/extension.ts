/**
 * TeamSpec VS Code Extension
 * 
 * Main entry point for the @teamspec chat participant.
 * Provides role-based AI assistance for Feature Canon-driven software delivery.
 */

import * as vscode from 'vscode';
import { COMMAND_LIBRARY, findCommand, getRoleDisplayName, RoleCode } from './commands';
import { gatherContext, formatContextForPrompt } from './context-pack';
import { assemblePrompt, buildDispatcherPrompt, extractIds } from './prompt-builder';
import { preloadAgents, clearAgentCache } from './agent-loader';

const PARTICIPANT_ID = 'teamspec.chat';

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('TeamSpec extension activating...');

    // Create the chat participant
    const participant = vscode.chat.createChatParticipant(PARTICIPANT_ID, handleChatRequest);
    
    // Set participant properties
    participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'teamspec-icon.png');
    
    // Register follow-up provider for contextual suggestions
    participant.followupProvider = {
        provideFollowups(result, context, token) {
            return getFollowups(result, context);
        }
    };

    // Preload agents on activation
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    preloadAgents(workspaceFolder).catch(console.error);

    // Register reload command for development
    const reloadCommand = vscode.commands.registerCommand('teamspec.reloadAgents', async () => {
        clearAgentCache();
        await preloadAgents(workspaceFolder);
        vscode.window.showInformationMessage('TeamSpec agents reloaded');
    });

    // Register context show command
    const contextCommand = vscode.commands.registerCommand('teamspec.showContext', async () => {
        const ctx = await gatherContext();
        const output = vscode.window.createOutputChannel('TeamSpec Context');
        output.clear();
        output.appendLine(formatContextForPrompt(ctx));
        output.show();
    });

    context.subscriptions.push(participant, reloadCommand, contextCommand);
    
    console.log('TeamSpec extension activated');
}

/**
 * Main chat request handler
 */
async function handleChatRequest(
    request: vscode.ChatRequest,
    chatContext: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<vscode.ChatResult> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    
    try {
        // Gather workspace context
        const workspaceContext = await gatherContext();

        // Route based on command
        if (request.command) {
            return await handleCommand(request, chatContext, workspaceContext, stream, token, workspaceFolder);
        } else {
            return await handleDispatcher(request, workspaceContext, stream, token, workspaceFolder);
        }
    } catch (error) {
        stream.markdown(`❌ **Error:** ${error instanceof Error ? error.message : 'Unknown error'}`);
        return { metadata: { error: true } };
    }
}

/**
 * Handle a specific slash command
 */
async function handleCommand(
    request: vscode.ChatRequest,
    chatContext: vscode.ChatContext,
    workspaceContext: Awaited<ReturnType<typeof gatherContext>>,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken,
    workspaceFolder?: vscode.WorkspaceFolder
): Promise<vscode.ChatResult> {
    const command = findCommand(request.command!);
    
    if (!command) {
        stream.markdown(`❓ Unknown command: \`/${request.command}\`. Use \`/help\` to see available commands.`);
        return { metadata: { command: request.command, success: false } };
    }

    // Show role badge
    stream.markdown(`🏷️ **${getRoleDisplayName(command.role)}** mode\n\n`);

    // Handle special meta commands
    if (request.command === 'help') {
        return handleHelpCommand(stream);
    }

    if (request.command === 'context') {
        return handleContextCommand(workspaceContext, stream);
    }

    if (request.command === 'status') {
        return handleStatusCommand(workspaceContext, stream);
    }

    // Assemble prompt for the command
    const assembled = await assemblePrompt(
        command,
        request.prompt,
        workspaceContext,
        workspaceFolder
    );

    // Check for required inputs
    const ids = assembled.extractedIds;
    if (command.requiredInputs?.includes('feature-id') && ids.featureIds.length === 0) {
        stream.markdown(`⚠️ **Missing Required Input**\n\nThis command requires a feature ID (e.g., F-001).\n\nPlease specify which feature you're working with.`);
        
        // Suggest available features
        if (workspaceContext.features.length > 0) {
            stream.markdown('\n\n**Available Features:**\n');
            for (const f of workspaceContext.features.slice(0, 5)) {
                stream.markdown(`- \`${f.id}\`: ${f.title}\n`);
            }
        }
        
        return { metadata: { command: request.command, needsInput: 'feature-id' } };
    }

    if (command.requiredInputs?.includes('story-id') && ids.storyIds.length === 0) {
        stream.markdown(`⚠️ **Missing Required Input**\n\nThis command requires a story ID (e.g., S-001).\n\nPlease specify which story you're working with.`);
        
        // Suggest available stories
        if (workspaceContext.stories.length > 0) {
            stream.markdown('\n\n**Recent Stories:**\n');
            for (const s of workspaceContext.stories.slice(0, 5)) {
                stream.markdown(`- \`${s.id}\`: ${s.title} [${s.state}]\n`);
            }
        }
        
        return { metadata: { command: request.command, needsInput: 'story-id' } };
    }

    // Build the full prompt
    const fullUserPrompt = assembled.userPromptPrefix + request.prompt;

    // Select model and send request
    const [model] = await vscode.lm.selectChatModels({
        vendor: 'copilot',
        family: 'gpt-4o'
    });

    if (!model) {
        stream.markdown('❌ **Error:** No chat model available. Please ensure GitHub Copilot is enabled.');
        return { metadata: { error: true } };
    }

    // Create messages
    const messages = [
        vscode.LanguageModelChatMessage.User(assembled.systemPrompt),
        vscode.LanguageModelChatMessage.User(fullUserPrompt)
    ];

    // Add conversation history for context
    for (const turn of chatContext.history) {
        if (turn instanceof vscode.ChatRequestTurn) {
            messages.push(vscode.LanguageModelChatMessage.User(turn.prompt));
        } else if (turn instanceof vscode.ChatResponseTurn) {
            const responseText = turn.response
                .filter((part): part is vscode.ChatResponseMarkdownPart => part instanceof vscode.ChatResponseMarkdownPart)
                .map(part => part.value.value)
                .join('');
            if (responseText) {
                messages.push(vscode.LanguageModelChatMessage.Assistant(responseText));
            }
        }
    }

    // Send to model
    const response = await model.sendRequest(messages, {}, token);

    // Stream the response
    for await (const chunk of response.text) {
        stream.markdown(chunk);
    }

    // Add action buttons based on command
    addActionButtons(command.role, stream, ids);

    return {
        metadata: {
            command: request.command,
            role: command.role,
            extractedIds: ids
        }
    };
}

/**
 * Handle dispatcher mode (no command specified)
 */
async function handleDispatcher(
    request: vscode.ChatRequest,
    workspaceContext: Awaited<ReturnType<typeof gatherContext>>,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken,
    workspaceFolder?: vscode.WorkspaceFolder
): Promise<vscode.ChatResult> {
    stream.markdown('🤖 **TeamSpec Assistant**\n\n');

    // Assemble dispatcher prompt
    const assembled = await buildDispatcherPrompt(
        request.prompt,
        workspaceContext,
        workspaceFolder
    );

    const fullUserPrompt = assembled.userPromptPrefix + request.prompt;

    // Select model
    const [model] = await vscode.lm.selectChatModels({
        vendor: 'copilot',
        family: 'gpt-4o'
    });

    if (!model) {
        stream.markdown('❌ **Error:** No chat model available. Please ensure GitHub Copilot is enabled.');
        return { metadata: { error: true } };
    }

    const messages = [
        vscode.LanguageModelChatMessage.User(assembled.systemPrompt),
        vscode.LanguageModelChatMessage.User(fullUserPrompt)
    ];

    const response = await model.sendRequest(messages, {}, token);

    for await (const chunk of response.text) {
        stream.markdown(chunk);
    }

    return { metadata: { dispatcher: true } };
}

/**
 * Handle /help command
 */
function handleHelpCommand(stream: vscode.ChatResponseStream): vscode.ChatResult {
    stream.markdown(`
## TeamSpec Commands

### Business Analyst (BA)
| Command | Description |
|---------|-------------|
| \`/ba\` | Show BA commands menu |
| \`/ba-project\` | Create project structure |
| \`/ba-epic\` | Define an epic |
| \`/ba-feature\` | Create feature file |
| \`/ba-decision\` | Log business decision |
| \`/ba-sync\` | Validate business attributes |
| \`/ba-review\` | Review BA document |

### Functional Analyst (FA)
| Command | Description |
|---------|-------------|
| \`/fa\` | Show FA commands menu |
| \`/fa-story\` | Create a new story |
| \`/fa-slice\` | Slice feature into stories |
| \`/fa-refine\` | Move story to ready-to-refine |
| \`/fa-sync\` | Update Feature Canon |

### Solution Architect (ARCH)
| Command | Description |
|---------|-------------|
| \`/arch\` | Show ARCH commands menu |
| \`/arch-adr\` | Create an ADR |
| \`/arch-sync\` | Sync design to stories |
| \`/arch-review\` | Review technical approach |

### Developer (DEV)
| Command | Description |
|---------|-------------|
| \`/dev\` | Show DEV commands menu |
| \`/dev-plan\` | Create development plan |
| \`/dev-implement\` | Start implementation |
| \`/dev-commit\` | Generate commit message |
| \`/dev-branch\` | Create branch name |
| \`/dev-ready\` | Move story to ready |

### QA Engineer (QA)
| Command | Description |
|---------|-------------|
| \`/qa\` | Show QA commands menu |
| \`/qa-test\` | Design test cases |
| \`/qa-bug\` | File bug report |
| \`/qa-uat\` | Create UAT pack |
| \`/qa-dor-check\` | Check Definition of Ready |
| \`/qa-dod-check\` | Check Definition of Done |

### Scrum Master (SM)
| Command | Description |
|---------|-------------|
| \`/sm\` | Show SM commands menu |
| \`/sm-sprint-create\` | Create new sprint |
| \`/sm-sprint-plan\` | Sprint planning |
| \`/sm-sprint-add\` | Add story to sprint |
| \`/sm-sprint-remove\` | Remove story from sprint |
| \`/sm-sprint-status\` | Sprint health report |
| \`/sm-sprint-close\` | Close sprint |
| \`/sm-standup\` | Standup agenda |
| \`/sm-planning\` | Planning facilitation |
| \`/sm-retro\` | Retrospective |

### Designer (DES)
| Command | Description |
|---------|-------------|
| \`/des\` | Show DES commands menu |
| \`/des-design\` | Create feature design |
| \`/des-flow\` | Design user flow |
| \`/des-handoff\` | Prepare design handoff |

### Quick Commands
| Command | Delegates To |
|---------|--------------|
| \`/story\` | FA story creation |
| \`/feature\` | BA feature creation |
| \`/adr\` | SA ADR creation |
| \`/bug\` | QA bug report |
| \`/sprint\` | SM sprint operations |

### Meta Commands
- \`/status\` - Project overview and health
- \`/context\` - Show workspace context
- \`/feedback\` - Report issues or suggestions
- \`/help\` - This help message

### Examples
\`\`\`
@teamspec /fa-story F-042 Add password reset
@teamspec /dev-plan S-001
@teamspec /qa-test F-042
@teamspec /sm-sprint-status
\`\`\`

### TeamSpec Philosophy
- **Feature Canon** is the source of truth
- **Stories are deltas**, not full documentation
- Each **role has boundaries** - stay in your lane
- **Quality gates** enforce DoR and DoD
`);

    return { metadata: { command: 'help' } };
}

/**
 * Handle /context command
 */
function handleContextCommand(
    workspaceContext: Awaited<ReturnType<typeof gatherContext>>,
    stream: vscode.ChatResponseStream
): vscode.ChatResult {
    if (!workspaceContext.projectFolder) {
        stream.markdown('⚠️ **No TeamSpec project detected**\n\nEnsure your workspace contains:\n- A `project.yml` file, or\n- A `features/` folder, or\n- A `projects/` folder with project subfolders');
        return { metadata: { command: 'context', hasProject: false } };
    }

    stream.markdown(formatContextForPrompt(workspaceContext));

    if (workspaceContext.projectFolder) {
        stream.markdown(`\n\n**Project Path:** \`${workspaceContext.projectFolder}\``);
    }

    return { metadata: { command: 'context', hasProject: true } };
}

/**
 * Handle /status command
 */
function handleStatusCommand(
    workspaceContext: Awaited<ReturnType<typeof gatherContext>>,
    stream: vscode.ChatResponseStream
): vscode.ChatResult {
    if (!workspaceContext.projectFolder) {
        stream.markdown('⚠️ **No TeamSpec project detected**');
        return { metadata: { command: 'status', hasProject: false } };
    }

    stream.markdown('## 📊 Project Status\n\n');

    // Project info
    if (workspaceContext.projectMeta) {
        stream.markdown(`**Project:** ${workspaceContext.projectMeta.name}\n`);
    }

    // Sprint info
    if (workspaceContext.activeSprint) {
        stream.markdown(`\n### 🏃 Active Sprint\n`);
        stream.markdown(`- **Sprint:** ${workspaceContext.activeSprint.number}\n`);
        if (workspaceContext.activeSprint.goal) {
            stream.markdown(`- **Goal:** ${workspaceContext.activeSprint.goal}\n`);
        }
    } else {
        stream.markdown(`\n### 🏃 No Active Sprint\n`);
    }

    // Feature count
    stream.markdown(`\n### 📋 Features\n`);
    stream.markdown(`- **Total:** ${workspaceContext.features.length}\n`);

    // Story breakdown
    stream.markdown(`\n### 📝 Stories\n`);
    const storyByState = workspaceContext.stories.reduce((acc, s) => {
        acc[s.state] = (acc[s.state] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    stream.markdown(`- **Backlog:** ${storyByState['backlog'] || 0}\n`);
    stream.markdown(`- **Ready to Refine:** ${storyByState['ready-to-refine'] || 0}\n`);
    stream.markdown(`- **Ready for Dev:** ${storyByState['ready-for-development'] || 0}\n`);

    // ADR count
    stream.markdown(`\n### 🏗️ ADRs\n`);
    stream.markdown(`- **Total:** ${workspaceContext.adrs.length}\n`);

    return { metadata: { command: 'status', hasProject: true } };
}

/**
 * Add action buttons based on role
 */
function addActionButtons(
    role: RoleCode,
    stream: vscode.ChatResponseStream,
    ids: { featureIds: string[]; storyIds: string[] }
): void {
    // Add relevant action buttons based on role and context
    const buttons: vscode.Command[] = [];

    switch (role) {
        case 'BA':
            buttons.push({
                command: 'teamspec.createFeature',
                title: '📄 Create Feature File',
                arguments: []
            });
            break;
        case 'FA':
            if (ids.featureIds.length > 0) {
                buttons.push({
                    command: 'teamspec.createStory',
                    title: '📝 Create Story',
                    arguments: [ids.featureIds[0]]
                });
            }
            break;
        case 'DEV':
            if (ids.storyIds.length > 0) {
                buttons.push({
                    command: 'teamspec.createDevPlan',
                    title: '📋 Create Dev Plan',
                    arguments: [ids.storyIds[0]]
                });
            }
            break;
        case 'QA':
            if (ids.featureIds.length > 0) {
                buttons.push({
                    command: 'teamspec.createTestCases',
                    title: '🧪 Create Test Cases',
                    arguments: [ids.featureIds[0]]
                });
            }
            break;
    }

    // Add buttons to stream
    for (const button of buttons) {
        stream.button(button);
    }
}

/**
 * Provide follow-up suggestions
 */
function getFollowups(
    result: vscode.ChatResult,
    context: vscode.ChatContext
): vscode.ChatFollowup[] {
    const followups: vscode.ChatFollowup[] = [];
    const metadata = result.metadata as Record<string, unknown> | undefined;

    if (!metadata) {
        return followups;
    }

    const role = metadata.role as RoleCode | undefined;
    const command = metadata.command as string | undefined;
    const ids = metadata.extractedIds as { featureIds: string[]; storyIds: string[] } | undefined;

    // Role-specific follow-ups
    switch (role) {
        case 'BA':
            followups.push({
                prompt: 'Now slice this into stories',
                command: 'fa',
                label: '→ Create Stories (FA)'
            });
            break;
        case 'FA':
            if (ids?.storyIds.length) {
                followups.push({
                    prompt: `Create dev plan for ${ids.storyIds[0]}`,
                    command: 'dev',
                    label: '→ Create Dev Plan'
                });
            }
            break;
        case 'DEV':
            if (ids?.storyIds.length) {
                followups.push({
                    prompt: `Design tests for the feature`,
                    command: 'qa',
                    label: '→ Create Test Cases'
                });
            }
            break;
    }

    // Always offer help
    followups.push({
        prompt: 'Show me available commands',
        command: 'help',
        label: '❓ Help'
    });

    return followups;
}

/**
 * Extension deactivation
 */
export function deactivate() {
    console.log('TeamSpec extension deactivated');
}
