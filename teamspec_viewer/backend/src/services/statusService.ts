/**
 * Status Service
 *
 * Service for validating and updating artifact status in markdown files.
 * Uses gray-matter for frontmatter parsing/serialization.
 *
 * Story: s-e006-003 (Backend Status Update API)
 * Feature: f-TSV-008 (Inline Status Editing)
 */

import { readFile, writeFile, rename, unlink } from 'fs/promises';
import { join, normalize } from 'path';
import matter from 'gray-matter';

// ============================================================================
// Types
// ============================================================================

export interface StatusUpdateResult {
    success: boolean;
    previousStatus?: string;
    newStatus?: string;
    error?: string;
}

// ============================================================================
// Status Options (Backend validation)
// ============================================================================

const STATUS_OPTIONS: Record<string, string[]> = {
    'feature': ['Planned', 'Active', 'Deprecated', 'Retired'],
    'feature-increment': ['Proposed', 'Approved', 'In-Progress', 'Done', 'Rejected'],
    'epic': ['Planned', 'Active', 'Done', 'Cancelled'],
    'story': ['Backlog', 'Refining', 'Ready', 'In-Progress', 'Done', 'Deferred', 'Out-of-Scope'],
    'business-analysis': ['Draft', 'Active', 'Deprecated'],
    'ba-increment': ['Proposed', 'Approved', 'Done', 'Rejected'],
    'devplan': ['Draft', 'In-Progress', 'Implemented', 'Blocked'],
    'solution-design': ['Draft', 'Active', 'Deprecated'],
    'sd-increment': ['Proposed', 'Approved', 'Done', 'Rejected'],
    'technical-architecture': ['Draft', 'Active', 'Deprecated'],
    'ta-increment': ['Proposed', 'Approved', 'Done', 'Rejected'],
    'test-case': ['Draft', 'Active', 'Deprecated'],
    'regression-test': ['Draft', 'Active', 'Deprecated'],
};

// ============================================================================
// Helper Functions
// ============================================================================

function getArtifactType(frontmatter: any, filename: string): string | null {
    // First check frontmatter artifact_kind
    if (frontmatter.artifact_kind) {
        return frontmatter.artifact_kind;
    }

    // Fallback to filename pattern detection
    const patterns: [RegExp, string][] = [
        [/^f-[A-Z]+-\d+/, 'feature'],
        [/^fi-[A-Z]+-\d+/, 'feature-increment'],
        [/^epic-[A-Z]+-\d+/, 'epic'],
        [/^s-e\d+-\d+/, 'story'],
        [/^ba-[A-Z]+-\d+/, 'business-analysis'],
        [/^bai-[A-Z]+-\d+/, 'ba-increment'],
        [/^dp-e\d+-s\d+/, 'devplan'],
        [/^sd-[A-Z]+-\d+/, 'solution-design'],
        [/^sdi-[A-Z]+-\d+/, 'sd-increment'],
        [/^ta-[A-Z]+-\d+/, 'technical-architecture'],
        [/^tai-[A-Z]+-\d+/, 'ta-increment'],
        [/^tc-/, 'test-case'],
        [/^rt-/, 'regression-test'],
    ];

    for (const [pattern, type] of patterns) {
        if (pattern.test(filename)) {
            return type;
        }
    }

    return null;
}

function isValidStatus(artifactType: string, status: string): boolean {
    const validStatuses = STATUS_OPTIONS[artifactType];
    return validStatuses ? validStatuses.includes(status) : false;
}

function getValidStatuses(artifactType: string): string[] {
    return STATUS_OPTIONS[artifactType] || [];
}

function extractStatusFromTable(content: string): string | undefined {
    const match = content.match(/\|\s*\*\*Status\*\*\s*\|\s*([^|]+)\s*\|/i);
    return match?.[1]?.trim();
}

// ============================================================================
// Main Service Function
// ============================================================================

export async function updateArtifactStatus(
    workspaceRoot: string,
    relativePath: string,
    newStatus: string
): Promise<StatusUpdateResult> {
    // Normalize the path
    const normalizedPath = normalize(relativePath).replace(/\\/g, '/');
    const fullPath = join(workspaceRoot, normalizedPath);

    // Security: ensure the path is within the workspace
    const normalizedFullPath = normalize(fullPath);
    const normalizedWorkspace = normalize(workspaceRoot);
    if (!normalizedFullPath.startsWith(normalizedWorkspace)) {
        return {
            success: false,
            error: 'Invalid path: outside workspace',
        };
    }

    const filename = normalizedPath.split('/').pop() || '';

    try {
        // Read file
        const content = await readFile(fullPath, 'utf-8');

        // Parse frontmatter
        const parsed = matter(content);
        const artifactType = getArtifactType(parsed.data, filename);

        if (!artifactType) {
            return {
                success: false,
                error: `Could not determine artifact type for file: ${relativePath}`,
            };
        }

        // Validate status
        if (!isValidStatus(artifactType, newStatus)) {
            const validStatuses = getValidStatuses(artifactType);
            return {
                success: false,
                error: `Invalid status '${newStatus}' for artifact type '${artifactType}'. Valid options: ${validStatuses.join(', ')}`,
            };
        }

        // Get previous status (from frontmatter or table)
        const previousStatus = parsed.data.status || extractStatusFromTable(parsed.content);

        // Update frontmatter status
        parsed.data.status = newStatus;

        // Update metadata table if present (handles both | **Status** | Value | format)
        let updatedContent = parsed.content;
        const tableMatch = updatedContent.match(/(\|\s*\*\*Status\*\*\s*\|\s*)([^|]+)(\s*\|)/i);
        if (tableMatch) {
            updatedContent = updatedContent.replace(
                tableMatch[0],
                `${tableMatch[1]}${newStatus}${tableMatch[3]}`
            );
        }

        // Serialize back to markdown with frontmatter
        const newContent = matter.stringify(updatedContent, parsed.data);

        // Atomic write: write to temp file, then rename
        const tempPath = `${fullPath}.tmp`;
        await writeFile(tempPath, newContent, 'utf-8');

        try {
            await rename(tempPath, fullPath);
        } catch (renameError) {
            // If rename fails, try to clean up temp file
            try {
                await unlink(tempPath);
            } catch {
                // Ignore cleanup errors
            }
            throw renameError;
        }

        return {
            success: true,
            previousStatus: previousStatus || 'unknown',
            newStatus,
        };

    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return {
                success: false,
                error: `File not found: ${relativePath}`,
            };
        }
        return {
            success: false,
            error: `Failed to update status: ${error.message}`,
        };
    }
}
