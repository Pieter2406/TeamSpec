import { readdir, readFile } from 'fs/promises';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORKSPACE_ROOT = join(__dirname, '..', '..', '..', '..');

export interface SearchResult {
    id: string;
    title: string;
    type: string;
    path: string;
    snippet: string;
    role?: string;
}

export interface SearchResponse {
    query: string;
    results: SearchResult[];
    count: number;
}

async function findMarkdownFilesRecursive(dir: string): Promise<string[]> {
    const files: string[] = [];

    try {
        const entries = await readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = join(dir, entry.name);

            if (entry.isDirectory()) {
                // Skip node_modules, .git, and other non-relevant directories
                if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
                    const subFiles = await findMarkdownFilesRecursive(fullPath);
                    files.push(...subFiles);
                }
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                files.push(fullPath);
            }
        }
    } catch (error) {
        // Directory doesn't exist or can't be read
    }

    return files;
}

function extractTitle(content: string, filePath: string): string {
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

    // Fallback: Find first heading after frontmatter
    for (let i = startIndex; i < lines.length; i++) {
        const match = lines[i].match(/^#\s+(.+)$/);
        if (match) {
            const title = match[1].trim();
            if (!title.startsWith('===') && !title.includes('LLM Retrieval')) {
                return title.replace(/`/g, '').trim();
            }
        }
    }

    return filePath.split(/[/\\]/).pop()?.replace('.md', '') || 'Untitled';
}

function extractSnippet(content: string, query: string): string {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);

    if (index === -1) return '';

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 100);

    let snippet = content.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    return snippet.replace(/\r?\n/g, ' ').trim();
}

function extractMetadata(content: string): { type: string; role: string } {
    const typeMatch = content.match(/artifact_kind:\s*(\w+)/);
    const roleMatch = content.match(/role_owner:\s*(\w+)/);

    let type = typeMatch?.[1] || 'unknown';

    // Normalize artifact types
    const typeMap: Record<string, string> = {
        'fi': 'feature-increment',
        'feature': 'feature',
        'epic': 'epic',
        'story': 'story',
        'ba': 'business-analysis',
        'bai': 'business-analysis-increment',
        'devplan': 'dev-plan',
        'sd': 'solution-design',
        'ta': 'technical-architecture',
    };

    type = typeMap[type] || type;

    return {
        type,
        role: roleMatch?.[1] || 'unknown',
    };
}

export async function search(
    query: string,
    filters?: { type?: string; role?: string }
): Promise<SearchResponse> {
    if (!query || query.trim().length === 0) {
        return { query, results: [], count: 0 };
    }

    const productsDir = join(WORKSPACE_ROOT, 'products');
    const projectsDir = join(WORKSPACE_ROOT, 'projects');

    const [productFiles, projectFiles] = await Promise.all([
        findMarkdownFilesRecursive(productsDir),
        findMarkdownFilesRecursive(projectsDir),
    ]);

    const allFiles = [...productFiles, ...projectFiles];
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    for (const filePath of allFiles) {
        try {
            const content = await readFile(filePath, 'utf-8');

            if (!content.toLowerCase().includes(lowerQuery)) {
                continue;
            }

            const metadata = extractMetadata(content);

            // Apply filters
            if (filters?.type && filters.type !== 'all' && metadata.type !== filters.type) {
                continue;
            }
            if (filters?.role && filters.role !== 'all' && metadata.role !== filters.role) {
                continue;
            }

            const title = extractTitle(content, filePath);
            const snippet = extractSnippet(content, query);
            const id = filePath.split(/[/\\]/).pop()?.replace('.md', '') || '';

            results.push({
                id,
                title,
                type: metadata.type,
                path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
                snippet,
                role: metadata.role,
            });
        } catch (error) {
            // Skip files that can't be read
        }
    }

    // Sort by relevance (match count)
    results.sort((a, b) => {
        const aCount = (a.title.toLowerCase().match(new RegExp(lowerQuery, 'g')) || []).length;
        const bCount = (b.title.toLowerCase().match(new RegExp(lowerQuery, 'g')) || []).length;
        return bCount - aCount;
    });

    return {
        query,
        results: results.slice(0, 50), // Limit to 50 results
        count: results.length,
    };
}
