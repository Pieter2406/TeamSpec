import { Hono } from 'hono';
import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getFeatureRelationships, getFeatureFICounts, getBARelationships, getBABAICounts } from '../services/relationshipService.js';

const artifacts = new Hono();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base path to the TeamSpec workspace (parent of backend folder)
const WORKSPACE_ROOT = join(__dirname, '..', '..', '..');

interface Artifact {
    id: string;
    path: string;
    title: string;
    type: string;
    status?: string;
}

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
    } catch (error) {
        // Directory doesn't exist or can't be read
    }

    return files;
}

async function extractTitle(filePath: string): Promise<string> {
    try {
        const content = await readFile(filePath, 'utf-8');

        // Split by any line ending (CRLF or LF)
        const lines = content.split(/\r?\n/);

        // Check for YAML frontmatter title first
        let startIndex = 0;
        if (lines[0]?.trim() === '---') {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '---') {
                    startIndex = i + 1;
                    break;
                }
                // Check for title field in frontmatter
                const titleMatch = lines[i].match(/^title:\s*["']?([^"'\n]+)["']?\s*$/);
                if (titleMatch) {
                    return titleMatch[1].trim();
                }
            }
        }

        // Fallback: Find the first # heading after frontmatter
        for (let i = startIndex; i < lines.length; i++) {
            const match = lines[i].match(/^#\s+(.+)$/);
            if (match) {
                const title = match[1].trim();
                // Skip LLM metadata headers (=== markers)
                if (title.startsWith('===') || title.includes('LLM Retrieval')) {
                    continue;
                }
                // Remove backticks and other formatting
                return title.replace(/`/g, '').trim();
            }
        }
        // Fallback to filename
        return filePath.split(/[/\\]/).pop()?.replace('.md', '') || 'Untitled';
    } catch {
        return 'Untitled';
    }
}

async function extractStatus(filePath: string): Promise<string | undefined> {
    try {
        const content = await readFile(filePath, 'utf-8');
        // Look for Status in metadata table or frontmatter
        const statusMatch = content.match(/\*\*Status\*\*\s*\|\s*(\w+)/i) ||
            content.match(/status:\s*(\w+)/i);
        return statusMatch?.[1];
    } catch {
        return undefined;
    }
}

// GET /api/products/:productId/business-analysis
artifacts.get('/products/:productId/business-analysis', async (c) => {
    const { productId } = c.req.param();
    const baDir = join(WORKSPACE_ROOT, 'products', productId, 'business-analysis');

    const files = await findMarkdownFiles(baDir, /^ba-.*\.md$/);
    const artifacts: Artifact[] = await Promise.all(
        files.map(async (filePath) => ({
            id: filePath.split(/[/\\]/).pop()?.replace('.md', '') || '',
            path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
            title: await extractTitle(filePath),
            type: 'business-analysis',
            status: await extractStatus(filePath),
        }))
    );

    return c.json({ artifacts });
});

// GET /api/projects/:projectId/business-analysis-increments
artifacts.get('/projects/:projectId/business-analysis-increments', async (c) => {
    const { projectId } = c.req.param();
    const baiDir = join(WORKSPACE_ROOT, 'projects', projectId, 'business-analysis-increments');

    const files = await findMarkdownFiles(baiDir, /^bai-.*\.md$/);
    const artifacts: Artifact[] = await Promise.all(
        files.map(async (filePath) => ({
            id: filePath.split(/[/\\]/).pop()?.replace('.md', '') || '',
            path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
            title: await extractTitle(filePath),
            type: 'business-analysis-increment',
            status: await extractStatus(filePath),
        }))
    );

    return c.json({ artifacts });
});

// GET /api/products/:productId/features
artifacts.get('/products/:productId/features', async (c) => {
    const { productId } = c.req.param();
    const featuresDir = join(WORKSPACE_ROOT, 'products', productId, 'features');

    const files = await findMarkdownFiles(featuresDir, /^f-.*\.md$/);
    const artifacts: Artifact[] = await Promise.all(
        files.map(async (filePath) => ({
            id: filePath.split(/[/\\]/).pop()?.replace('.md', '') || '',
            path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
            title: await extractTitle(filePath),
            type: 'feature',
            status: await extractStatus(filePath),
        }))
    );

    return c.json({ artifacts });
});

// GET /api/projects/:projectId/feature-increments
artifacts.get('/projects/:projectId/feature-increments', async (c) => {
    const { projectId } = c.req.param();
    const fiDir = join(WORKSPACE_ROOT, 'projects', projectId, 'feature-increments');

    const files = await findMarkdownFiles(fiDir, /^fi-.*\.md$/);
    const artifacts: Artifact[] = await Promise.all(
        files.map(async (filePath) => ({
            id: filePath.split(/[/\\]/).pop()?.replace('.md', '') || '',
            path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
            title: await extractTitle(filePath),
            type: 'feature-increment',
            status: await extractStatus(filePath),
        }))
    );

    return c.json({ artifacts });
});

// GET /api/projects/:projectId/epics
artifacts.get('/projects/:projectId/epics', async (c) => {
    const { projectId } = c.req.param();
    const epicsDir = join(WORKSPACE_ROOT, 'projects', projectId, 'epics');

    const files = await findMarkdownFiles(epicsDir, /^epic-.*\.md$/);
    const artifacts: Artifact[] = await Promise.all(
        files.map(async (filePath) => ({
            id: filePath.split(/[/\\]/).pop()?.replace('.md', '') || '',
            path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
            title: await extractTitle(filePath),
            type: 'epic',
            status: await extractStatus(filePath),
        }))
    );

    return c.json({ artifacts });
});

// GET /api/projects/:projectId/stories
artifacts.get('/projects/:projectId/stories', async (c) => {
    const { projectId } = c.req.param();
    const storiesDir = join(WORKSPACE_ROOT, 'projects', projectId, 'stories');

    // Search all subdirectories (backlog, in-progress, done, etc.)
    const files = await findMarkdownFiles(storiesDir, /^s-.*\.md$/);
    const artifacts: Artifact[] = await Promise.all(
        files.map(async (filePath) => {
            // Determine status from folder
            const relativePath = relative(storiesDir, filePath);
            const folder = relativePath.split(/[/\\]/)[0];
            const folderStatus = folder === 'done' ? 'Done' :
                folder === 'in-progress' ? 'In Progress' :
                    folder === 'backlog' ? 'Backlog' : undefined;

            return {
                id: filePath.split(/[/\\]/).pop()?.replace('.md', '') || '',
                path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
                title: await extractTitle(filePath),
                type: 'story',
                status: folderStatus || await extractStatus(filePath),
            };
        })
    );

    return c.json({ artifacts });
});

// GET /api/artifact - Read artifact content
artifacts.get('/artifact', async (c) => {
    const path = c.req.query('path');

    if (!path) {
        return c.json({ error: 'Path is required' }, 400);
    }

    const fullPath = join(WORKSPACE_ROOT, path);

    // Security: ensure the path is within the workspace
    if (!fullPath.startsWith(WORKSPACE_ROOT)) {
        return c.json({ error: 'Invalid path' }, 403);
    }

    try {
        const content = await readFile(fullPath, 'utf-8');
        return c.json({ content, path });
    } catch (error) {
        return c.json({ error: 'Artifact not found' }, 404);
    }
});

// Helper to parse FI sections (AS-IS/TO-BE)
function parseFISections(content: string): { asIs: string; toBe: string } {
    const lines = content.split(/\r?\n/);

    let asIsStart = -1;
    let toBeStart = -1;
    let asIsEnd = -1;
    let toBeEnd = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Match "## 2. AS-IS" or similar
        if (line.match(/^##\s*2\.?\s*AS-IS/i)) {
            asIsStart = i + 1;
        }
        // Match "## 3. TO-BE" or similar
        else if (line.match(/^##\s*3\.?\s*TO-BE/i)) {
            toBeStart = i + 1;
            if (asIsStart !== -1 && asIsEnd === -1) {
                asIsEnd = i;
            }
        }
        // Match next major section (## 4. or ## 5. etc.)
        else if (line.match(/^##\s*[4-9]\./) && toBeStart !== -1 && toBeEnd === -1) {
            toBeEnd = i;
        }
    }

    // Handle case where TO-BE goes to end of file
    if (toBeStart !== -1 && toBeEnd === -1) {
        toBeEnd = lines.length;
    }

    const asIsContent = asIsStart !== -1 && asIsEnd !== -1
        ? lines.slice(asIsStart, asIsEnd).join('\n').trim()
        : '';

    const toBeContent = toBeStart !== -1 && toBeEnd !== -1
        ? lines.slice(toBeStart, toBeEnd).join('\n').trim()
        : '';

    return { asIs: asIsContent, toBe: toBeContent };
}

// GET /api/feature-increments/:fiId/sections - Get parsed AS-IS/TO-BE sections
artifacts.get('/feature-increments/:fiId/sections', async (c) => {
    const { fiId } = c.req.param();
    const projectId = c.req.query('projectId') || 'teamspecviewermvp';

    const fiDir = join(WORKSPACE_ROOT, 'projects', projectId, 'feature-increments');

    try {
        const files = await findMarkdownFiles(fiDir, new RegExp(`^${fiId}.*\\.md$`));

        if (files.length === 0) {
            return c.json({ error: 'Feature increment not found' }, 404);
        }

        const content = await readFile(files[0], 'utf-8');
        const sections = parseFISections(content);

        return c.json({
            fiId,
            ...sections,
        });
    } catch (error) {
        return c.json({ error: 'Failed to parse feature increment' }, 500);
    }
});

// GET /api/feature-increments/:fiId/stories - Get stories linked to a feature increment
artifacts.get('/feature-increments/:fiId/stories', async (c) => {
    const { fiId } = c.req.param();
    const projectId = c.req.query('projectId') || 'teamspecviewermvp';

    const storiesDir = join(WORKSPACE_ROOT, 'projects', projectId, 'stories');
    const linkedStories: Artifact[] = [];

    try {
        const storyFiles = await findMarkdownFiles(storiesDir, /^s-.*\.md$/);

        for (const filePath of storyFiles) {
            const content = await readFile(filePath, 'utf-8');

            // Check if story references this FI in front matter or body
            const fiPattern = new RegExp(fiId, 'i');
            if (fiPattern.test(content)) {
                const relativePath = relative(storiesDir, filePath);
                const folder = relativePath.split(/[/\\]/)[0];
                const folderStatus = folder === 'done' ? 'Done' :
                    folder === 'in-progress' ? 'In Progress' :
                        folder === 'backlog' ? 'Backlog' : undefined;

                linkedStories.push({
                    id: filePath.split(/[/\\]/).pop()?.replace('.md', '') || '',
                    path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
                    title: await extractTitle(filePath),
                    type: 'story',
                    status: folderStatus || await extractStatus(filePath),
                });
            }
        }
    } catch (error) {
        // No stories found
    }

    return c.json({
        fiId,
        stories: linkedStories,
        count: linkedStories.length,
    });
});

// GET /api/features/:featureId/increments - Get FIs targeting a specific feature
artifacts.get('/features/:featureId/increments', async (c) => {
    const { featureId } = c.req.param();
    const projectId = c.req.query('projectId') || 'teamspecviewermvp';

    const fiDir = join(WORKSPACE_ROOT, 'projects', projectId, 'feature-increments');
    const linkedFIs: Artifact[] = [];

    try {
        const fiFiles = await findMarkdownFiles(fiDir, /^fi-.*\.md$/);

        for (const filePath of fiFiles) {
            const content = await readFile(filePath, 'utf-8');

            // Check if FI references this feature in front matter or body
            // Look for patterns like "Target Feature: f-TSV-002" or "links_required: f-TSV-002"
            const featurePattern = new RegExp(featureId, 'i');
            if (featurePattern.test(content)) {
                linkedFIs.push({
                    id: filePath.split(/[/\\]/).pop()?.replace('.md', '') || '',
                    path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
                    title: await extractTitle(filePath),
                    type: 'feature-increment',
                    status: await extractStatus(filePath),
                });
            }
        }
    } catch (error) {
        // No FIs found
    }

    return c.json({
        featureId,
        increments: linkedFIs,
        count: linkedFIs.length,
    });
});

// ============================================================================
// Feature Relationships API (Story s-e005-003)
// ============================================================================

/**
 * GET /features/:featureId/relationships
 * Get full relationship tree for a feature (Feature → FIs → Epics → Stories)
 */
artifacts.get('/features/:featureId/relationships', async (c) => {
    const featureId = c.req.param('featureId');

    try {
        const relationships = await getFeatureRelationships(featureId);
        return c.json(relationships);
    } catch (error: any) {
        if (error.message?.includes('not found')) {
            return c.json({ error: error.message }, 404);
        }
        return c.json({ error: 'Failed to get feature relationships' }, 500);
    }
});

/**
 * POST /features/fi-counts
 * Get FI counts for multiple features at once (for dashboard optimization)
 */
artifacts.post('/features/fi-counts', async (c) => {
    try {
        const body = await c.req.json();
        const featureIds: string[] = body.featureIds || [];

        if (!Array.isArray(featureIds) || featureIds.length === 0) {
            return c.json({ error: 'featureIds array required' }, 400);
        }

        const counts = await getFeatureFICounts(featureIds);
        return c.json({ counts });
    } catch (error) {
        return c.json({ error: 'Failed to get FI counts' }, 500);
    }
});

// ============================================================================
// BA Relationships API
// ============================================================================

/**
 * GET /ba/:baId/relationships
 * Get full relationship tree for a BA document (BA → BAIs)
 */
artifacts.get('/ba/:baId/relationships', async (c) => {
    const baId = c.req.param('baId');

    try {
        const relationships = await getBARelationships(baId);
        return c.json(relationships);
    } catch (error: any) {
        if (error.message?.includes('not found')) {
            return c.json({ error: error.message }, 404);
        }
        return c.json({ error: 'Failed to get BA relationships' }, 500);
    }
});

/**
 * POST /ba/bai-counts
 * Get BAI counts for multiple BA documents at once (for dashboard optimization)
 */
artifacts.post('/ba/bai-counts', async (c) => {
    try {
        const body = await c.req.json();
        const baIds: string[] = body.baIds || [];

        if (!Array.isArray(baIds) || baIds.length === 0) {
            return c.json({ error: 'baIds array required' }, 400);
        }

        const counts = await getBABAICounts(baIds);
        return c.json({ counts });
    } catch (error) {
        return c.json({ error: 'Failed to get BAI counts' }, 500);
    }
});

export default artifacts;
