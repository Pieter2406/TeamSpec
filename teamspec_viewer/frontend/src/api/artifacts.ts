const API_BASE = 'http://localhost:3000/api';

export interface Artifact {
    id: string;
    path: string;
    title: string;
    type: string;
    status?: string;
}

export interface ArtifactsResponse {
    artifacts: Artifact[];
}

export interface ArtifactContentResponse {
    content: string;
    path: string;
}

// BA artifacts
export async function getBusinessAnalysis(productId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/products/${productId}/business-analysis`);
    if (!response.ok) throw new Error('Failed to fetch business analysis');
    return response.json();
}

export async function getBusinessAnalysisIncrements(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/business-analysis-increments`);
    if (!response.ok) throw new Error('Failed to fetch BA increments');
    return response.json();
}

// FA artifacts
export async function getFeatures(productId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/products/${productId}/features`);
    if (!response.ok) throw new Error('Failed to fetch features');
    return response.json();
}

export async function getFeatureIncrements(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/feature-increments`);
    if (!response.ok) throw new Error('Failed to fetch feature increments');
    return response.json();
}

export async function getEpics(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/epics`);
    if (!response.ok) throw new Error('Failed to fetch epics');
    return response.json();
}

export async function getStories(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/stories`);
    if (!response.ok) throw new Error('Failed to fetch stories');
    return response.json();
}

// Artifact content
export async function getArtifactContent(path: string): Promise<ArtifactContentResponse> {
    const response = await fetch(`${API_BASE}/artifact?path=${encodeURIComponent(path)}`);
    if (!response.ok) throw new Error('Failed to fetch artifact content');
    return response.json();
}

// FI sections (AS-IS/TO-BE)
export interface FISectionsResponse {
    fiId: string;
    asIs: string;
    toBe: string;
}

export async function getFISections(fiId: string, projectId: string = 'teamspecviewermvp'): Promise<FISectionsResponse> {
    const response = await fetch(`${API_BASE}/feature-increments/${fiId}/sections?projectId=${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch FI sections');
    return response.json();
}

// Linked stories for FI
export interface LinkedStoriesResponse {
    fiId: string;
    stories: Artifact[];
    count: number;
}

export async function getLinkedStories(fiId: string, projectId: string = 'teamspecviewermvp'): Promise<LinkedStoriesResponse> {
    const response = await fetch(`${API_BASE}/feature-increments/${fiId}/stories?projectId=${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch linked stories');
    return response.json();
}

// Feature increments for a feature
export interface FeatureIncrementsResponse {
    featureId: string;
    increments: Artifact[];
    count: number;
}

export async function getFeatureIncrementsForFeature(featureId: string, projectId: string = 'teamspecviewermvp'): Promise<FeatureIncrementsResponse> {
    const response = await fetch(`${API_BASE}/features/${featureId}/increments?projectId=${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch feature increments');
    return response.json();
}

// Search
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

export async function searchArtifacts(
    query: string,
    filters?: { type?: string; role?: string }
): Promise<SearchResponse> {
    const params = new URLSearchParams({ q: query });
    if (filters?.type) params.set('type', filters.type);
    if (filters?.role) params.set('role', filters.role);

    const response = await fetch(`${API_BASE}/search?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to search artifacts');
    return response.json();
}

// Products
export interface Product {
    id: string;
    name: string;
    prefix: string;
    status: string;
    description: string;
    projectCount: number;
}

export interface ProductsResponse {
    products: Product[];
    count: number;
}

export async function getProducts(): Promise<ProductsResponse> {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
}

export async function getProductById(productId: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
}

// Projects for product
export interface Project {
    id: string;
    name: string;
    status: string;
    featureIncrementCount: number;
}

export interface ProjectsForProductResponse {
    productId: string;
    projects: Project[];
    count: number;
}

export async function getProjectsForProduct(productId: string): Promise<ProjectsForProductResponse> {
    const response = await fetch(`${API_BASE}/products/${productId}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
}

// ============================================================================
// Feature Relationships API (Story s-e005-003)
// ============================================================================

export interface StoryInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    hasTBD?: boolean;
}

export interface EpicInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    stories: StoryInfo[];
    hasTBD?: boolean;
}

export interface FIInfo {
    id: string;
    title: string;
    status?: string;
    project: string;
    path: string;
    epic?: EpicInfo;
    hasTBD?: boolean;
}

export interface FeatureInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    hasTBD?: boolean;
}

export interface FeatureRelationshipsResponse {
    feature: FeatureInfo;
    featureIncrements: FIInfo[];
}

/**
 * Get full relationship tree for a feature (Feature → FIs → Epics → Stories)
 */
export async function getFeatureRelationships(featureId: string): Promise<FeatureRelationshipsResponse> {
    const response = await fetch(`${API_BASE}/features/${featureId}/relationships`);
    if (!response.ok) throw new Error('Failed to fetch feature relationships');
    return response.json();
}

export interface FICountsResponse {
    counts: Record<string, number>;
}

/**
 * Get FI counts for multiple features at once (for dashboard optimization)
 */
export async function getFeatureFICounts(featureIds: string[]): Promise<FICountsResponse> {
    const response = await fetch(`${API_BASE}/features/fi-counts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureIds }),
    });
    if (!response.ok) throw new Error('Failed to fetch FI counts');
    return response.json();
}

// ============================================================================
// BA Relationships API
// ============================================================================

export interface BAInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    hasTBD?: boolean;
}

export interface BAIInfo {
    id: string;
    title: string;
    status?: string;
    project: string;
    path: string;
    hasTBD?: boolean;
}

export interface BARelationshipsResponse {
    ba: BAInfo;
    baIncrements: BAIInfo[];
}

/**
 * Get full relationship tree for a BA document (BA → BAIs)
 */
export async function getBARelationships(baId: string): Promise<BARelationshipsResponse> {
    const response = await fetch(`${API_BASE}/ba/${baId}/relationships`);
    if (!response.ok) throw new Error('Failed to fetch BA relationships');
    return response.json();
}

export interface BAICountsResponse {
    counts: Record<string, number>;
}

/**
 * Get BAI counts for multiple BA documents at once (for dashboard optimization)
 */
export async function getBABAICounts(baIds: string[]): Promise<BAICountsResponse> {
    const response = await fetch(`${API_BASE}/ba/bai-counts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baIds }),
    });
    if (!response.ok) throw new Error('Failed to fetch BAI counts');
    return response.json();
}

// ============================================================================
// Status Update API (Story s-e006-003)
// ============================================================================

export interface StatusUpdateResponse {
    success: boolean;
    previousStatus?: string;
    newStatus?: string;
    error?: string;
}

/**
 * Update the status of an artifact
 */
export async function updateArtifactStatus(
    path: string,
    status: string
): Promise<StatusUpdateResponse> {
    const response = await fetch(`${API_BASE}/artifacts/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, status }),
    });
    return response.json();
}
