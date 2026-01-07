/**
 * Context Pack
 * 
 * Gathers workspace context for TeamSpec commands.
 * Provides relevant files, project state, and metadata.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export interface WorkspaceContext {
    /** Workspace root path */
    workspaceRoot?: string;
    /** Detected TeamSpec project folder */
    projectFolder?: string;
    /** Project metadata from project.yml */
    projectMeta?: ProjectMeta;
    /** Team context from team.yml */
    teamContext?: TeamContext;
    /** Current file path */
    currentFile?: string;
    /** Current selection text */
    currentSelection?: string;
    /** Active sprint info */
    activeSprint?: SprintInfo;
    /** Recent/relevant features */
    features: FeatureRef[];
    /** Recent/relevant stories */
    stories: StoryRef[];
    /** Recent/relevant ADRs */
    adrs: AdrRef[];
}

export interface TeamContext {
    /** Organization info */
    org: {
        name: string;
        department?: string;
        industry?: string;
        profile?: 'none' | 'startup' | 'platform-team' | 'enterprise' | 'regulated';
        compliance?: string[];
    };
    /** Team info */
    team: {
        name: string;
        roles: string[];
    };
    /** Loaded profile configuration */
    profileConfig?: ProfileConfig;
}

export interface ProfileConfig {
    name: string;
    governanceLevel: string;
    signOffRequired: boolean;
    auditTrail: boolean;
    changeControlBoard: boolean;
    documentation: string;
}

export interface ProjectMeta {
    id: string;
    name: string;
    description?: string;
}

export interface SprintInfo {
    number: number;
    goal?: string;
    folder: string;
}

export interface FeatureRef {
    id: string;
    title: string;
    path: string;
}

export interface StoryRef {
    id: string;
    title: string;
    path: string;
    state: 'backlog' | 'ready-to-refine' | 'ready-for-development' | 'sprint' | 'done';
    featureId?: string;
}

export interface AdrRef {
    id: string;
    title: string;
    path: string;
}

/**
 * Find TeamSpec project folder in workspace
 */
function findProjectFolder(workspaceFolder: vscode.WorkspaceFolder): string | undefined {
    const root = workspaceFolder.uri.fsPath;
    
    // Check for projects/ folder structure
    const projectsFolder = path.join(root, 'projects');
    if (fs.existsSync(projectsFolder)) {
        // Find first project with project.yml
        const projects = fs.readdirSync(projectsFolder);
        for (const proj of projects) {
            const projPath = path.join(projectsFolder, proj);
            if (fs.existsSync(path.join(projPath, 'project.yml'))) {
                return projPath;
            }
        }
    }

    // Check root for project.yml
    if (fs.existsSync(path.join(root, 'project.yml'))) {
        return root;
    }

    // Check for features/ folder as indicator
    if (fs.existsSync(path.join(root, 'features'))) {
        return root;
    }

    return undefined;
}

/**
 * Parse project.yml for metadata
 */
function parseProjectMeta(projectFolder: string): ProjectMeta | undefined {
    const ymlPath = path.join(projectFolder, 'project.yml');
    if (!fs.existsSync(ymlPath)) {
        return undefined;
    }

    try {
        const content = fs.readFileSync(ymlPath, 'utf-8');
        // Simple YAML parsing for id and name
        const idMatch = content.match(/^id:\s*(.+)$/m);
        const nameMatch = content.match(/^name:\s*(.+)$/m);
        const descMatch = content.match(/^description:\s*(.+)$/m);

        if (idMatch || nameMatch) {
            return {
                id: idMatch?.[1]?.trim() || 'unknown',
                name: nameMatch?.[1]?.trim() || 'Unknown Project',
                description: descMatch?.[1]?.trim()
            };
        }
    } catch (error) {
        console.warn('Failed to parse project.yml', error);
    }

    return undefined;
}

/**
 * Parse team.yml for team context
 */
function parseTeamContext(workspaceRoot: string): TeamContext | undefined {
    // Look for .teamspec/context/team.yml
    const teamYmlPath = path.join(workspaceRoot, '.teamspec', 'context', 'team.yml');
    if (!fs.existsSync(teamYmlPath)) {
        return undefined;
    }

    try {
        const content = fs.readFileSync(teamYmlPath, 'utf-8');
        
        // Parse org section
        const orgNameMatch = content.match(/^\s*name:\s*["']?([^"'\n]+)["']?/m);
        const orgDeptMatch = content.match(/department:\s*["']?([^"'\n]+)["']?/m);
        const orgIndustryMatch = content.match(/industry:\s*(\w+)/m);
        const orgProfileMatch = content.match(/profile:\s*(\w+(?:-\w+)?)/m);
        
        // Parse compliance array
        const complianceMatch = content.match(/compliance:\s*\n([\s\S]*?)(?=\n\w|$)/);
        let compliance: string[] = [];
        if (complianceMatch) {
            const complianceLines = complianceMatch[1].match(/-\s*(\w+)/g);
            if (complianceLines) {
                compliance = complianceLines.map(l => l.replace(/^-\s*/, ''));
            }
        }
        
        // Parse team section
        const teamSection = content.match(/team:\s*\n([\s\S]*?)(?=\n[a-z]+:|$)/i);
        let teamName = 'Unknown Team';
        let roles: string[] = [];
        
        if (teamSection) {
            const teamNameMatch = teamSection[1].match(/name:\s*["']?([^"'\n]+)["']?/);
            if (teamNameMatch) {
                teamName = teamNameMatch[1].trim();
            }
            
            const rolesMatch = teamSection[1].match(/roles:\s*\n([\s\S]*?)(?=\n\s*[a-z]+:|$)/i);
            if (rolesMatch) {
                const roleLines = rolesMatch[1].match(/-\s*(\w+)/g);
                if (roleLines) {
                    roles = roleLines.map(l => l.replace(/^-\s*/, ''));
                }
            }
        }
        
        const teamContext: TeamContext = {
            org: {
                name: orgNameMatch?.[1]?.trim() || 'Unknown Org',
                department: orgDeptMatch?.[1]?.trim(),
                industry: orgIndustryMatch?.[1]?.trim(),
                profile: orgProfileMatch?.[1]?.trim() as TeamContext['org']['profile'],
                compliance: compliance.length > 0 ? compliance : undefined
            },
            team: {
                name: teamName,
                roles: roles
            }
        };
        
        // Load profile configuration if specified
        if (teamContext.org.profile && teamContext.org.profile !== 'none') {
            teamContext.profileConfig = loadProfileConfig(workspaceRoot, teamContext.org.profile);
        }
        
        return teamContext;
    } catch (error) {
        console.warn('Failed to parse team.yml', error);
        return undefined;
    }
}

/**
 * Load profile configuration from profiles folder
 */
function loadProfileConfig(workspaceRoot: string, profileName: string): ProfileConfig | undefined {
    const profilePath = path.join(workspaceRoot, '.teamspec', 'profiles', `${profileName}.yml`);
    if (!fs.existsSync(profilePath)) {
        return undefined;
    }

    try {
        const content = fs.readFileSync(profilePath, 'utf-8');
        
        // Parse profile characteristics table or YAML
        const governanceMatch = content.match(/Governance Level\s*\|\s*(\w+)/i) ||
                               content.match(/governance[_-]?level:\s*(\w+)/i);
        const signOffMatch = content.match(/Sign-off Required\s*\|\s*(Yes|No)/i) ||
                            content.match(/sign[_-]?off[_-]?required:\s*(true|false)/i);
        const auditMatch = content.match(/Audit Trail\s*\|\s*(Yes|No)/i) ||
                          content.match(/audit[_-]?trail:\s*(true|false)/i);
        const ccbMatch = content.match(/Change Control Board\s*\|\s*(Yes|No)/i) ||
                        content.match(/change[_-]?control[_-]?board:\s*(true|false)/i);
        const docMatch = content.match(/Documentation\s*\|\s*(\w+)/i) ||
                        content.match(/documentation:\s*(\w+)/i);
        
        return {
            name: profileName,
            governanceLevel: governanceMatch?.[1] || 'Standard',
            signOffRequired: signOffMatch?.[1]?.toLowerCase() === 'yes' || signOffMatch?.[1]?.toLowerCase() === 'true',
            auditTrail: auditMatch?.[1]?.toLowerCase() === 'yes' || auditMatch?.[1]?.toLowerCase() === 'true',
            changeControlBoard: ccbMatch?.[1]?.toLowerCase() === 'yes' || ccbMatch?.[1]?.toLowerCase() === 'true',
            documentation: docMatch?.[1] || 'Standard'
        };
    } catch (error) {
        console.warn(`Failed to load profile: ${profileName}`, error);
        return undefined;
    }
}

/**
 * Find features in project folder
 */
function findFeatures(projectFolder: string): FeatureRef[] {
    const featuresFolder = path.join(projectFolder, 'features');
    if (!fs.existsSync(featuresFolder)) {
        return [];
    }

    const features: FeatureRef[] = [];
    const files = fs.readdirSync(featuresFolder);
    
    for (const file of files) {
        if (file.match(/^F-\d+.*\.md$/)) {
            const filePath = path.join(featuresFolder, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            
            // Extract ID and title
            const idMatch = file.match(/^(F-\d+)/);
            const titleMatch = content.match(/^#\s*(.+)$/m);
            
            if (idMatch) {
                features.push({
                    id: idMatch[1],
                    title: titleMatch?.[1]?.replace(/^F-\d+[-:]?\s*/, '') || file,
                    path: filePath
                });
            }
        }
    }

    return features;
}

/**
 * Find stories in project folder
 */
function findStories(projectFolder: string): StoryRef[] {
    const storiesFolder = path.join(projectFolder, 'stories');
    if (!fs.existsSync(storiesFolder)) {
        return [];
    }

    const stories: StoryRef[] = [];
    const states: Array<{ folder: string; state: StoryRef['state'] }> = [
        { folder: 'backlog', state: 'backlog' },
        { folder: 'ready-to-refine', state: 'ready-to-refine' },
        { folder: 'ready-for-development', state: 'ready-for-development' },
    ];

    for (const { folder, state } of states) {
        const stateFolder = path.join(storiesFolder, folder);
        if (!fs.existsSync(stateFolder)) {
            continue;
        }

        const files = fs.readdirSync(stateFolder);
        for (const file of files) {
            if (file.match(/^S-\d+.*\.md$/)) {
                const filePath = path.join(stateFolder, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                
                const idMatch = file.match(/^(S-\d+)/);
                const titleMatch = content.match(/^#\s*(.+)$/m);
                const featureMatch = content.match(/Linked Feature[s]?:?\s*(F-\d+)/i) ||
                                   content.match(/Feature:?\s*(F-\d+)/i);
                
                if (idMatch) {
                    stories.push({
                        id: idMatch[1],
                        title: titleMatch?.[1]?.replace(/^S-\d+[-:]?\s*/, '') || file,
                        path: filePath,
                        state,
                        featureId: featureMatch?.[1]
                    });
                }
            }
        }
    }

    return stories;
}

/**
 * Find ADRs in project folder
 */
function findAdrs(projectFolder: string): AdrRef[] {
    const adrFolder = path.join(projectFolder, 'adr');
    if (!fs.existsSync(adrFolder)) {
        return [];
    }

    const adrs: AdrRef[] = [];
    const files = fs.readdirSync(adrFolder);
    
    for (const file of files) {
        if (file.match(/^ADR-\d+.*\.md$/)) {
            const filePath = path.join(adrFolder, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            
            const idMatch = file.match(/^(ADR-\d+)/);
            const titleMatch = content.match(/^#\s*(.+)$/m);
            
            if (idMatch) {
                adrs.push({
                    id: idMatch[1],
                    title: titleMatch?.[1]?.replace(/^ADR-\d+[-:]?\s*/, '') || file,
                    path: filePath
                });
            }
        }
    }

    return adrs;
}

/**
 * Find active sprint
 */
function findActiveSprint(projectFolder: string): SprintInfo | undefined {
    const sprintsFolder = path.join(projectFolder, 'sprints');
    if (!fs.existsSync(sprintsFolder)) {
        return undefined;
    }

    // Look for active-sprint.md
    const activeSprintPath = path.join(sprintsFolder, 'active-sprint.md');
    if (fs.existsSync(activeSprintPath)) {
        const content = fs.readFileSync(activeSprintPath, 'utf-8');
        const numberMatch = content.match(/Sprint[:\s]+(\d+)/i);
        const goalMatch = content.match(/Goal:?\s*(.+)$/m);
        
        if (numberMatch) {
            return {
                number: parseInt(numberMatch[1], 10),
                goal: goalMatch?.[1]?.trim(),
                folder: path.join(sprintsFolder, `sprint-${numberMatch[1]}`)
            };
        }
    }

    // Find highest numbered sprint folder
    const folders = fs.readdirSync(sprintsFolder);
    let maxSprint = 0;
    for (const folder of folders) {
        const match = folder.match(/^sprint-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxSprint) {
                maxSprint = num;
            }
        }
    }

    if (maxSprint > 0) {
        const sprintFolder = path.join(sprintsFolder, `sprint-${maxSprint}`);
        const goalPath = path.join(sprintFolder, 'sprint-goal.md');
        let goal: string | undefined;
        
        if (fs.existsSync(goalPath)) {
            const content = fs.readFileSync(goalPath, 'utf-8');
            const goalMatch = content.match(/Goal:?\s*(.+)$/m);
            goal = goalMatch?.[1]?.trim();
        }

        return {
            number: maxSprint,
            goal,
            folder: sprintFolder
        };
    }

    return undefined;
}

/**
 * Gather workspace context for TeamSpec commands
 */
export async function gatherContext(): Promise<WorkspaceContext> {
    const context: WorkspaceContext = {
        features: [],
        stories: [],
        adrs: []
    };

    // Get workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return context;
    }

    const workspaceFolder = workspaceFolders[0];
    context.workspaceRoot = workspaceFolder.uri.fsPath;

    // Load team context from .teamspec/context/team.yml
    context.teamContext = parseTeamContext(context.workspaceRoot);

    // Find project folder
    context.projectFolder = findProjectFolder(workspaceFolder);
    
    if (context.projectFolder) {
        // Get project metadata
        context.projectMeta = parseProjectMeta(context.projectFolder);
        
        // Find features, stories, ADRs
        context.features = findFeatures(context.projectFolder);
        context.stories = findStories(context.projectFolder);
        context.adrs = findAdrs(context.projectFolder);
        
        // Find active sprint
        context.activeSprint = findActiveSprint(context.projectFolder);
    }

    // Get current file and selection
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        context.currentFile = editor.document.uri.fsPath;
        
        const selection = editor.selection;
        if (!selection.isEmpty) {
            context.currentSelection = editor.document.getText(selection);
        }
    }

    return context;
}

/**
 * Read a specific file's content for context
 */
export async function readFileContent(filePath: string, maxLines: number = 200): Promise<string | undefined> {
    try {
        if (!fs.existsSync(filePath)) {
            return undefined;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        
        if (lines.length > maxLines) {
            return lines.slice(0, maxLines).join('\n') + `\n\n... (truncated, ${lines.length - maxLines} more lines)`;
        }
        
        return content;
    } catch (error) {
        console.warn(`Failed to read file: ${filePath}`, error);
        return undefined;
    }
}

/**
 * Format context for prompt injection
 */
export function formatContextForPrompt(context: WorkspaceContext): string {
    const parts: string[] = [];

    parts.push('## Current Workspace Context');
    parts.push('');

    // Team context
    if (context.teamContext) {
        parts.push(`**Organization:** ${context.teamContext.org.name}`);
        if (context.teamContext.org.department) {
            parts.push(`**Department:** ${context.teamContext.org.department}`);
        }
        parts.push(`**Team:** ${context.teamContext.team.name}`);
        if (context.teamContext.team.roles.length > 0) {
            parts.push(`**Active Roles:** ${context.teamContext.team.roles.join(', ')}`);
        }
        if (context.teamContext.org.profile) {
            parts.push(`**Profile:** ${context.teamContext.org.profile}`);
        }
        if (context.teamContext.org.compliance && context.teamContext.org.compliance.length > 0) {
            parts.push(`**Compliance:** ${context.teamContext.org.compliance.join(', ')}`);
        }
        if (context.teamContext.profileConfig) {
            parts.push(`**Governance:** ${context.teamContext.profileConfig.governanceLevel} (Sign-off: ${context.teamContext.profileConfig.signOffRequired ? 'Required' : 'Not Required'})`);
        }
        parts.push('');
    }

    if (context.projectMeta) {
        parts.push(`**Project:** ${context.projectMeta.name} (${context.projectMeta.id})`);
        if (context.projectMeta.description) {
            parts.push(`**Description:** ${context.projectMeta.description}`);
        }
    }

    if (context.currentFile) {
        parts.push(`**Current File:** ${context.currentFile}`);
    }

    if (context.activeSprint) {
        parts.push(`**Active Sprint:** Sprint ${context.activeSprint.number}`);
        if (context.activeSprint.goal) {
            parts.push(`**Sprint Goal:** ${context.activeSprint.goal}`);
        }
    }

    if (context.features.length > 0) {
        parts.push('');
        parts.push('### Features');
        for (const f of context.features.slice(0, 10)) {
            parts.push(`- ${f.id}: ${f.title}`);
        }
    }

    if (context.stories.length > 0) {
        parts.push('');
        parts.push('### Stories');
        for (const s of context.stories.slice(0, 10)) {
            parts.push(`- ${s.id}: ${s.title} [${s.state}]`);
        }
    }

    if (context.adrs.length > 0) {
        parts.push('');
        parts.push('### ADRs');
        for (const a of context.adrs.slice(0, 10)) {
            parts.push(`- ${a.id}: ${a.title}`);
        }
    }

    return parts.join('\n');
}
