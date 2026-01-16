/**
 * Relationship Service
 * 
 * Provides artifact relationship resolution for the Feature-centric dashboard.
 * Scans workspace files to build Feature → FI → Epic → Story hierarchies.
 * 
 * Story: s-e005-003 (Relationship API)
 * Dev Plan: dp-e005-s003
 */

import { readdir, readFile } from 'fs/promises';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base path to the TeamSpec workspace
const WORKSPACE_ROOT = join(__dirname, '..', '..', '..');

// ============================================================================
// Types
// ============================================================================

export interface FeatureInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
}

export interface StoryInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
}

export interface EpicInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    stories: StoryInfo[];
}

export interface FIInfo {
    id: string;
    title: string;
    status?: string;
    project: string;
    path: string;
    epic?: EpicInfo;
}

export interface FeatureRelationshipsResponse {
    feature: FeatureInfo;
    featureIncrements: FIInfo[];
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract title from markdown file (frontmatter title field, then first # heading)
 */
function extractTitle(content: string): string {
    const lines = content.split(/\r?\n/);
    let inFrontmatter = false;
    let frontmatterTitle: string | undefined;

    for (const line of lines) {
        if (line.trim() === '---') {
            // Exiting frontmatter - check if we found a title
            if (inFrontmatter && frontmatterTitle) {
                return frontmatterTitle;
            }
            inFrontmatter = !inFrontmatter;
            continue;
        }
        if (inFrontmatter) {
            // Check for title field in frontmatter
            const titleMatch = line.match(/^title:\s*["']?([^"'\n]+)["']?\s*$/);
            if (titleMatch) {
                frontmatterTitle = titleMatch[1].trim();
            }
            continue;
        }

        // Fallback: first # heading after frontmatter
        const match = line.match(/^#\s+(.+)$/);
        if (match) {
            // Remove backticks and formatting
            return match[1].replace(/`/g, '').trim();
        }
    }
    return 'Untitled';
}

/**
 * Extract status from markdown content
 */
function extractStatus(content: string): string | undefined {
    const match = content.match(/\*\*Status\*\*\s*\|\s*(\w+[-\w]*)/i) ||
        content.match(/status:\s*["']?(\w+[-\w]*)/i);
    return match?.[1];
}

/**
 * Check if FI content targets a specific feature
 */
function targetsFeature(content: string, featureId: string): boolean {
    // Check Target Feature line
    if (content.includes('Target Feature:') && content.includes(featureId)) {
        return true;
    }
    // Check frontmatter links_required
    const yamlMatch = content.match(/---\n([\s\S]*?)\n---/);
    if (yamlMatch) {
        const frontmatter = yamlMatch[1];
        // Look for pattern field in links_required
        if (frontmatter.includes(`pattern: "${featureId}"`) ||
            frontmatter.includes(`pattern: '${featureId}'`) ||
            frontmatter.includes(`"${featureId}"`)) {
            return true;
        }
    }
    return false;
}

/**
 * Extract epic link from FI content
 */
function extractEpicLink(content: string): string | undefined {
    // Look for Epic: [epic-TSV-XXX] or **Epic:** `epic-TSV-XXX`
    const epicMatch = content.match(/\*\*Epic:\*\*\s*\[?(epic-[A-Z]+-\d+)/i) ||
        content.match(/Epic:\s*\[?(epic-[A-Z]+-\d+)/i) ||
        content.match(/\[(epic-[A-Z]+-\d+)\]/);
    return epicMatch?.[1];
}

/**
 * List directories in a path
 */
async function listDirectories(basePath: string): Promise<string[]> {
    try {
        const entries = await readdir(basePath, { withFileTypes: true });
        return entries.filter(e => e.isDirectory()).map(e => e.name);
    } catch {
        return [];
    }
}

/**
 * Find markdown files matching a pattern
 */
async function findMarkdownFiles(dir: string, pattern?: RegExp): Promise<string[]> {
    const files: string[] = [];

    try {
        const entries = await readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = join(dir, entry.name);

            if (entry.isDirectory()) {
                const subFiles = await findMarkdownFiles(fullPath, pattern);
                files.push(...subFiles);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                if (!pattern || pattern.test(entry.name)) {
                    files.push(fullPath);
                }
            }
        }
    } catch {
        // Directory doesn't exist
    }

    return files;
}

// ============================================================================
// Main Service Functions
// ============================================================================

/**
 * Get feature info by ID
 */
async function getFeatureInfo(featureId: string): Promise<FeatureInfo | null> {
    const productsDir = join(WORKSPACE_ROOT, 'products');

    try {
        const products = await listDirectories(productsDir);

        for (const product of products) {
            const featuresDir = join(productsDir, product, 'features');

            try {
                const files = await readdir(featuresDir);
                const featureFile = files.find(f => f.startsWith(featureId) && f.endsWith('.md'));

                if (featureFile) {
                    const filePath = join(featuresDir, featureFile);
                    const content = await readFile(filePath, 'utf-8');

                    return {
                        id: featureId,
                        title: extractTitle(content),
                        status: extractStatus(content),
                        path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
                    };
                }
            } catch {
                // Features dir doesn't exist for this product
            }
        }
    } catch {
        // Products dir doesn't exist
    }

    return null;
}

/**
 * Find all FIs targeting a specific feature across all projects
 */
async function findFIsForFeature(featureId: string): Promise<Array<{
    id: string;
    title: string;
    status?: string;
    project: string;
    path: string;
    epicId?: string;
}>> {
    const fiList: Array<{
        id: string;
        title: string;
        status?: string;
        project: string;
        path: string;
        epicId?: string;
    }> = [];

    const projectsDir = join(WORKSPACE_ROOT, 'projects');

    try {
        const projects = await listDirectories(projectsDir);

        for (const project of projects) {
            const fiDir = join(projectsDir, project, 'feature-increments');

            try {
                const files = await readdir(fiDir);

                for (const file of files) {
                    if (!file.endsWith('.md') || file.startsWith('increments-index')) continue;

                    const filePath = join(fiDir, file);
                    const content = await readFile(filePath, 'utf-8');

                    if (targetsFeature(content, featureId)) {
                        fiList.push({
                            id: file.replace('.md', ''),
                            title: extractTitle(content),
                            status: extractStatus(content),
                            project,
                            path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
                            epicId: extractEpicLink(content),
                        });
                    }
                }
            } catch {
                // FI dir doesn't exist for this project
            }
        }
    } catch {
        // Projects dir doesn't exist
    }

    return fiList;
}

/**
 * Get epic info by ID
 */
async function getEpicInfo(project: string, epicId: string): Promise<Omit<EpicInfo, 'stories'> | null> {
    const epicsDir = join(WORKSPACE_ROOT, 'projects', project, 'epics');

    try {
        const files = await readdir(epicsDir);
        const epicFile = files.find(f => f.startsWith(epicId) && f.endsWith('.md'));

        if (epicFile) {
            const filePath = join(epicsDir, epicFile);
            const content = await readFile(filePath, 'utf-8');

            return {
                id: epicId,
                title: extractTitle(content),
                status: extractStatus(content),
                path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
            };
        }
    } catch {
        // Epics dir doesn't exist
    }

    return null;
}

/**
 * Get stories for an epic by matching s-eXXX-* pattern
 * Deduplicates by story ID, keeping the most advanced status version
 */
async function getStoriesForEpic(project: string, epicId: string): Promise<StoryInfo[]> {
    // Extract epic number (e.g., epic-TSV-005 -> 005)
    const epicNumMatch = epicId.match(/epic-[A-Z]+-(\d+)/i);
    if (!epicNumMatch) return [];

    const epicNum = epicNumMatch[1];
    const storiesPattern = new RegExp(`^s-e${epicNum}-\\d+.*\\.md$`);

    // Use a Map to deduplicate by story ID, keeping most advanced status
    const storiesMap = new Map<string, StoryInfo>();
    const storiesBase = join(WORKSPACE_ROOT, 'projects', project, 'stories');

    // Status priority: higher number = more advanced (prefer these)
    const statusPriority: Record<string, number> = {
        'Backlog': 1,
        'Refining': 2,
        'Ready': 3,
        'In Progress': 4,
        'Done': 5,
    };

    // Scan all story folders
    const folders = ['backlog', 'ready-to-refine', 'ready-to-develop', 'in-progress', 'done'];

    for (const folder of folders) {
        try {
            const folderPath = join(storiesBase, folder);
            const files = await readdir(folderPath);

            for (const file of files) {
                if (storiesPattern.test(file)) {
                    const filePath = join(folderPath, file);
                    const content = await readFile(filePath, 'utf-8');

                    // Map folder to display status
                    const folderStatus =
                        folder === 'done' ? 'Done' :
                            folder === 'in-progress' ? 'In Progress' :
                                folder === 'ready-to-develop' ? 'Ready' :
                                    folder === 'ready-to-refine' ? 'Refining' :
                                        'Backlog';

                    const storyId = file.replace('.md', '');
                    const existing = storiesMap.get(storyId);

                    // Keep story with higher priority status (or add if new)
                    if (!existing || (statusPriority[folderStatus] || 0) > (statusPriority[existing.status || 'Backlog'] || 0)) {
                        storiesMap.set(storyId, {
                            id: storyId,
                            title: extractTitle(content),
                            status: folderStatus,
                            path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
                        });
                    }
                }
            }
        } catch {
            // Folder doesn't exist
        }
    }

    // Convert map to array and sort by ID
    const stories = Array.from(storiesMap.values());
    stories.sort((a, b) => a.id.localeCompare(b.id));

    return stories;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Get full relationship tree for a feature
 */
export async function getFeatureRelationships(featureId: string): Promise<FeatureRelationshipsResponse> {
    // 1. Get feature info
    const feature = await getFeatureInfo(featureId);
    if (!feature) {
        throw new Error(`Feature ${featureId} not found`);
    }

    // 2. Find all FIs targeting this feature
    const fiList = await findFIsForFeature(featureId);

    // 3. For each FI, get linked epic and stories
    const featureIncrements: FIInfo[] = await Promise.all(
        fiList.map(async (fi) => {
            let epic: EpicInfo | undefined;

            if (fi.epicId) {
                const epicInfo = await getEpicInfo(fi.project, fi.epicId);
                if (epicInfo) {
                    const stories = await getStoriesForEpic(fi.project, fi.epicId);
                    epic = { ...epicInfo, stories };
                }
            }

            return {
                id: fi.id,
                title: fi.title,
                status: fi.status,
                project: fi.project,
                path: fi.path,
                epic,
            };
        })
    );

    return { feature, featureIncrements };
}

/**
 * Get FI count for a feature (lightweight, no full tree)
 */
export async function getFeatureFICount(featureId: string): Promise<number> {
    const fiList = await findFIsForFeature(featureId);
    return fiList.length;
}

/**
 * Get FI counts for multiple features at once
 */
export async function getFeatureFICounts(featureIds: string[]): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};

    await Promise.all(
        featureIds.map(async (featureId) => {
            counts[featureId] = await getFeatureFICount(featureId);
        })
    );

    return counts;
}

// ============================================================================
// BA Relationship Types
// ============================================================================

export interface BAInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
}

export interface BAIInfo {
    id: string;
    title: string;
    status?: string;
    project: string;
    path: string;
}

export interface BARelationshipsResponse {
    ba: BAInfo;
    baIncrements: BAIInfo[];
}

// ============================================================================
// BA Relationship Functions
// ============================================================================

/**
 * Get BA info by ID
 */
async function getBAInfo(baId: string): Promise<BAInfo | null> {
    const productsDir = join(WORKSPACE_ROOT, 'products');

    try {
        const products = await listDirectories(productsDir);

        for (const product of products) {
            const baDir = join(productsDir, product, 'business-analysis');

            try {
                const files = await readdir(baDir);
                const baFile = files.find(f => f.startsWith(baId) && f.endsWith('.md'));

                if (baFile) {
                    const filePath = join(baDir, baFile);
                    const content = await readFile(filePath, 'utf-8');

                    return {
                        id: baId,
                        title: extractTitle(content),
                        status: extractStatus(content),
                        path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
                    };
                }
            } catch {
                // BA dir doesn't exist for this product
            }
        }
    } catch {
        // Products dir doesn't exist
    }

    return null;
}

/**
 * Check if BAI content targets a specific BA document
 */
function targetsBA(content: string, baId: string): boolean {
    // Check Target BA line
    if (content.includes('Target BA:') && content.includes(baId)) {
        return true;
    }
    // Check for references in links_required or body
    const yamlMatch = content.match(/---\n([\s\S]*?)\n---/);
    if (yamlMatch) {
        const frontmatter = yamlMatch[1];
        if (frontmatter.includes(`pattern: "${baId}"`) ||
            frontmatter.includes(`pattern: '${baId}'`) ||
            frontmatter.includes(`"${baId}"`)) {
            return true;
        }
    }
    // Check body for reference
    if (content.includes(baId)) {
        return true;
    }
    return false;
}

/**
 * Find all BAIs targeting a specific BA across all projects
 */
async function findBAIsForBA(baId: string): Promise<Array<{
    id: string;
    title: string;
    status?: string;
    project: string;
    path: string;
}>> {
    const baiList: Array<{
        id: string;
        title: string;
        status?: string;
        project: string;
        path: string;
    }> = [];

    const projectsDir = join(WORKSPACE_ROOT, 'projects');

    try {
        const projects = await listDirectories(projectsDir);

        for (const project of projects) {
            const baiDir = join(projectsDir, project, 'business-analysis-increments');

            try {
                const files = await readdir(baiDir);

                for (const file of files) {
                    if (!file.endsWith('.md') || file.startsWith('index')) continue;

                    const filePath = join(baiDir, file);
                    const content = await readFile(filePath, 'utf-8');

                    if (targetsBA(content, baId)) {
                        baiList.push({
                            id: file.replace('.md', ''),
                            title: extractTitle(content),
                            status: extractStatus(content),
                            project,
                            path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
                        });
                    }
                }
            } catch {
                // BAI dir doesn't exist for this project
            }
        }
    } catch {
        // Projects dir doesn't exist
    }

    return baiList;
}

/**
 * Get full relationship tree for a BA document
 */
export async function getBARelationships(baId: string): Promise<BARelationshipsResponse> {
    // 1. Get BA info
    const ba = await getBAInfo(baId);
    if (!ba) {
        throw new Error(`BA ${baId} not found`);
    }

    // 2. Find all BAIs targeting this BA
    const baiList = await findBAIsForBA(baId);

    const baIncrements: BAIInfo[] = baiList.map(bai => ({
        id: bai.id,
        title: bai.title,
        status: bai.status,
        project: bai.project,
        path: bai.path,
    }));

    return { ba, baIncrements };
}

/**
 * Get BAI count for a BA document
 */
export async function getBABAICount(baId: string): Promise<number> {
    const baiList = await findBAIsForBA(baId);
    return baiList.length;
}

/**
 * Get BAI counts for multiple BA documents at once
 */
export async function getBABAICounts(baIds: string[]): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};

    await Promise.all(
        baIds.map(async (baId) => {
            counts[baId] = await getBABAICount(baId);
        })
    );

    return counts;
}
