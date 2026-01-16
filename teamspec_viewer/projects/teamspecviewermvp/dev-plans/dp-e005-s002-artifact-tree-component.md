---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e005-s002"
filename_pattern: "dp-e005-s002-artifact-tree-component.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e005-002"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - artifact tree
  - tree component
  - collapsible tree
  - hierarchy
aliases:
  - tree view plan
anti_keywords:
  - story
  - feature
---

# Dev Plan: `dp-e005-s002-artifact-tree-component`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-16

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e005-s002 |
| **Story** | [s-e005-002](../stories/backlog/s-e005-002-artifact-tree-component.md) |
| **Epic** | epic-TSV-005 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-16 |
| **Status** | Implemented |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e005-002](../stories/backlog/s-e005-002-artifact-tree-component.md) | Artifact Tree Component | [fi-TSV-005](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

1. **Use MUI TreeView**: Leverage `@mui/x-tree-view` for proven tree component
2. **Custom TreeItem Rendering**: Style nodes to show artifact info (ID, title, status)
3. **Data Transformation**: Convert relationships API response to tree structure
4. **State Management**: Track expanded nodes in component state
5. **Integrate with FeatureCard**: Render tree inside expanded card content

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `ArtifactTree.tsx` | New | Tree component rendering Feature → FI → Epic → Story |
| `ArtifactTreeNode.tsx` | New | Custom tree node with artifact info styling |
| `FeatureCard.tsx` | Modified | Integrate ArtifactTree in collapsed content |
| `useArtifactTree.ts` | New | Hook for tree state management |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/ArtifactTree.tsx` | Create | Main tree component |
| `frontend/src/components/ArtifactTreeNode.tsx` | Create | Custom node renderer |
| `frontend/src/hooks/useArtifactTree.ts` | Create | State management hook |
| `frontend/src/components/FeatureCard.tsx` | Modify | Add tree as child |
| `frontend/src/types/tree.ts` | Create | Type definitions |

### 2.2 Type Definitions

```typescript
// types/tree.ts
export interface TreeNode {
  id: string;
  type: 'feature' | 'fi' | 'epic' | 'story';
  title: string;
  status?: string;
  project?: string;
  children: TreeNode[];
}

export interface ArtifactTreeProps {
  rootNode: TreeNode;
  expandedIds: string[];
  onToggleNode: (nodeId: string) => void;
  onNodeClick: (node: TreeNode) => void;
  onNodeDoubleClick: (node: TreeNode) => void;
}
```

### 2.3 Component Implementation

#### ArtifactTree.tsx

```tsx
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { ArtifactTreeNode } from './ArtifactTreeNode';

export function ArtifactTree({ 
  rootNode, 
  expandedIds, 
  onToggleNode,
  onNodeClick,
  onNodeDoubleClick 
}: ArtifactTreeProps) {
  
  const renderTree = (node: TreeNode) => (
    <TreeItem
      key={node.id}
      itemId={node.id}
      label={
        <ArtifactTreeNode 
          node={node}
          onClick={() => onNodeClick(node)}
          onDoubleClick={() => onNodeDoubleClick(node)}
        />
      }
    >
      {node.children.length > 0 
        ? node.children.map(renderTree)
        : null
      }
    </TreeItem>
  );

  return (
    <SimpleTreeView
      expandedItems={expandedIds}
      onExpandedItemsChange={(_, ids) => {
        // Compute diff and call onToggleNode
      }}
    >
      {rootNode.children.map(renderTree)}
    </SimpleTreeView>
  );
}
```

#### ArtifactTreeNode.tsx

```tsx
import { Box, Chip, Typography } from '@mui/material';
import { Description, Folder, Code } from '@mui/icons-material';

const TYPE_ICONS = {
  feature: Folder,
  fi: Description,
  epic: Folder,
  story: Code,
};

const STATUS_COLORS = {
  'proposed': 'warning',
  'in-progress': 'info', 
  'done': 'success',
  'draft': 'default',
};

export function ArtifactTreeNode({ node, onClick, onDoubleClick }) {
  const Icon = TYPE_ICONS[node.type] || Description;
  
  return (
    <Box 
      sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(); }}
    >
      <Icon fontSize="small" color="action" />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {node.id}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
        {node.title}
      </Typography>
      {node.status && (
        <Chip 
          label={node.status} 
          size="small" 
          color={STATUS_COLORS[node.status] || 'default'}
        />
      )}
      {node.project && (
        <Chip label={node.project} size="small" variant="outlined" />
      )}
    </Box>
  );
}
```

### 2.4 Data Transformation

```typescript
// Transform API response to tree structure
function buildTree(relationships: RelationshipsResponse): TreeNode {
  return {
    id: relationships.feature.id,
    type: 'feature',
    title: relationships.feature.title,
    status: relationships.feature.status,
    children: relationships.featureIncrements.map(fi => ({
      id: fi.id,
      type: 'fi',
      title: fi.title,
      status: fi.status,
      project: fi.project,
      children: fi.epic ? [{
        id: fi.epic.id,
        type: 'epic',
        title: fi.epic.title,
        status: fi.epic.status,
        children: (fi.epic.stories || []).map(story => ({
          id: story.id,
          type: 'story',
          title: story.title,
          status: story.status,
          children: [],
        })),
      }] : [],
    })),
  };
}
```

### 2.5 State Hook

```typescript
// hooks/useArtifactTree.ts
export function useArtifactTree() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);
  
  const expandAll = useCallback((tree: TreeNode) => {
    const ids = new Set<string>();
    const traverse = (node: TreeNode) => {
      ids.add(node.id);
      node.children.forEach(traverse);
    };
    traverse(tree);
    setExpandedIds(ids);
  }, []);
  
  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);
  
  return { expandedIds: [...expandedIds], toggleNode, expandAll, collapseAll };
}
```

### 2.6 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `@mui/x-tree-view` | New | Need to install |
| MUI Icons | Existing | ✓ |
| Relationships API (s-e005-003) | New | Dependency |

### 2.7 Installation

```bash
pnpm add @mui/x-tree-view
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] ArtifactTree renders correct hierarchy depth
- [ ] ArtifactTreeNode displays ID, title, status, project
- [ ] Tree expands/collapses on toggle
- [ ] expandAll/collapseAll functions work correctly
- [ ] Empty children shows placeholder message

### 3.2 Integration Tests

- [ ] Tree renders from relationships API response
- [ ] Click on node triggers callback
- [ ] Double-click on node triggers callback
- [ ] Expand toggle doesn't trigger click

### 3.3 Manual Testing

- [ ] Tree shows Feature → FI → Epic → Story hierarchy
- [ ] Visual connectors show hierarchy
- [ ] Status badges display correctly
- [ ] Project tags show on FI nodes
- [ ] Expand All / Collapse All buttons work

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| MUI TreeView API changes | Low | Medium | Pin version, check docs |
| Performance with deep trees | Medium | Medium | Lazy load children, virtualize |
| Click vs expand toggle conflict | Medium | Low | Separate click targets |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Tree renders when Feature expanded | ArtifactTree in FeatureCard Collapse |
| 2 | Hierarchy visually clear | Indentation via TreeItem nesting |
| 3 | Individual expand/collapse | SimpleTreeView handles this |
| 4 | Expand All / Collapse All | Hook methods + buttons |
| 5 | Node shows ID, title, status, project | ArtifactTreeNode layout |
| 6 | Empty children placeholder | Conditional render "(No linked...)" |

---

## 6. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] MUI TreeView docs reviewed
- [ ] Dependencies installed (`@mui/x-tree-view`)
- [ ] s-e005-003 (API) complete or mock available

### Implementation

- [ ] Type definitions created
- [ ] ArtifactTreeNode component created
- [ ] ArtifactTree component created
- [ ] useArtifactTree hook created
- [ ] FeatureCard integration complete
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] Integration tests passing
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-16 | AI-Generated | Initial plan |
