import { Hono } from 'hono';
import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

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

        // Find and skip YAML frontmatter
        let startIndex = 0;
        if (lines[0]?.trim() === '---') {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '---') {
                    startIndex = i + 1;
                    break;
                }
            }
        }

        // Find the first # heading after frontmatter
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

export default artifacts;
