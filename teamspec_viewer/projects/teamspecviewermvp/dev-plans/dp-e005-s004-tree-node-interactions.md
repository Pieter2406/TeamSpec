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
id_pattern: "dp-e005-s004"
filename_pattern: "dp-e005-s004-tree-node-interactions.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e005-004"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - tree interactions
  - click handlers
  - tooltip
  - quick view
aliases:
  - node interactions plan
anti_keywords:
  - story
  - feature
---

# Dev Plan: `dp-e005-s004-tree-node-interactions`

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
| **Dev Plan ID** | dp-e005-s004 |
| **Story** | [s-e005-004](../stories/backlog/s-e005-004-tree-node-interactions.md) |
| **Epic** | epic-TSV-005 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-16 |
| **Status** | Implemented |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e005-004](../stories/backlog/s-e005-004-tree-node-interactions.md) | Tree Node Interactions | [fi-TSV-005](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

1. **Hover Tooltip**: Use MUI Tooltip with delay for artifact summary
2. **Click/Double-Click Handling**: Timer-based differentiation (250ms)
3. **Quick-View Panel**: Side drawer showing artifact preview
4. **Selection State**: Track selected node for highlighting
5. **Integration**: Connect with existing ArtifactReader for full view

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `ArtifactTreeNode.tsx` | Modified | Add tooltip, click handlers |
| `QuickViewPanel.tsx` | New | Side panel for artifact preview |
| `useNodeInteractions.ts` | New | Hook for click/double-click logic |
| `FADashboard.tsx` | Modified | Add QuickViewPanel, selection state |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/ArtifactTreeNode.tsx` | Modify | Add tooltip, interaction handlers |
| `frontend/src/components/QuickViewPanel.tsx` | Create | Artifact preview panel |
| `frontend/src/hooks/useNodeInteractions.ts` | Create | Click timing logic |
| `frontend/src/components/FADashboard.tsx` | Modify | Integrate quick view |

### 2.2 Click vs Double-Click Detection

```typescript
// hooks/useNodeInteractions.ts
import { useCallback, useRef } from 'react';

interface UseNodeInteractionsOptions {
  onSingleClick: (nodeId: string) => void;
  onDoubleClick: (nodeId: string) => void;
  delay?: number;
}

export function useNodeInteractions({
  onSingleClick,
  onDoubleClick,
  delay = 250,
}: UseNodeInteractionsOptions) {
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const clickCount = useRef(0);
  
  const handleClick = useCallback((nodeId: string) => {
    clickCount.current += 1;
    
    if (clickCount.current === 1) {
      // Wait to see if it's a double-click
      clickTimer.current = setTimeout(() => {
        if (clickCount.current === 1) {
          onSingleClick(nodeId);
        }
        clickCount.current = 0;
      }, delay);
    } else if (clickCount.current === 2) {
      // Double-click detected
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
      }
      onDoubleClick(nodeId);
      clickCount.current = 0;
    }
  }, [onSingleClick, onDoubleClick, delay]);
  
  return { handleClick };
}
```

### 2.3 Tooltip Implementation

```tsx
// In ArtifactTreeNode.tsx
import { Tooltip } from '@mui/material';

interface TooltipContent {
  id: string;
  title: string;
  status?: string;
  description?: string; // First 100 chars
}

function ArtifactTooltip({ node }: { node: TreeNode }) {
  return (
    <Box sx={{ p: 1, maxWidth: 300 }}>
      <Typography variant="subtitle2" fontWeight={600}>
        {node.id}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {node.title}
      </Typography>
      {node.status && (
        <Chip label={node.status} size="small" sx={{ mt: 0.5 }} />
      )}
      {node.description && (
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          {node.description.slice(0, 100)}...
        </Typography>
      )}
    </Box>
  );
}

export function ArtifactTreeNode({ 
  node, 
  selected,
  onClick,
  onDoubleClick 
}: ArtifactTreeNodeProps) {
  return (
    <Tooltip
      title={<ArtifactTooltip node={node} />}
      enterDelay={500}
      placement="right"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 0.5,
          px: 1,
          borderRadius: 1,
          bgcolor: selected ? 'action.selected' : 'transparent',
          '&:hover': { bgcolor: 'action.hover' },
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(node.id);
        }}
      >
        {/* ... existing content ... */}
      </Box>
    </Tooltip>
  );
}
```

### 2.4 Quick-View Panel Component

```tsx
// components/QuickViewPanel.tsx
import { Drawer, Box, Typography, IconButton, Button, Divider } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getArtifactContent, Artifact } from '../api/artifacts';
import ReactMarkdown from 'react-markdown';

interface QuickViewPanelProps {
  artifact: Artifact | null;
  open: boolean;
  onClose: () => void;
  onOpenFull: () => void;
}

export function QuickViewPanel({ 
  artifact, 
  open, 
  onClose, 
  onOpenFull 
}: QuickViewPanelProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (artifact?.path) {
      setLoading(true);
      getArtifactContent(artifact.path)
        .then((res) => {
          // Extract Overview/Summary section
          const overview = extractOverviewSection(res.content);
          setContent(overview);
        })
        .catch(() => setContent('Failed to load content'))
        .finally(() => setLoading(false));
    }
  }, [artifact?.path]);
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          p: 2,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Quick View
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
      
      {artifact && (
        <>
          {/* Artifact Info */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {artifact.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {artifact.title}
            </Typography>
            {artifact.status && (
              <Chip label={artifact.status} size="small" sx={{ mt: 1 }} />
            )}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Content Preview */}
          <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
            {loading ? (
              <Typography color="text.secondary">Loading...</Typography>
            ) : (
              <ReactMarkdown>{content}</ReactMarkdown>
            )}
          </Box>
          
          {/* Actions */}
          <Button 
            variant="contained" 
            fullWidth 
            onClick={onOpenFull}
          >
            Open Full Reader →
          </Button>
        </>
      )}
    </Drawer>
  );
}

function extractOverviewSection(markdown: string): string {
  // Find Overview or Summary section
  const overviewMatch = markdown.match(
    /##\s*(Overview|Summary|1\.\s*Overview)[\s\S]*?(?=##|$)/i
  );
  if (overviewMatch) {
    return overviewMatch[0].slice(0, 500) + '...';
  }
  // Fallback: first 500 chars after frontmatter
  const afterFrontmatter = markdown.replace(/---[\s\S]*?---/, '').trim();
  return afterFrontmatter.slice(0, 500) + '...';
}
```

### 2.5 FADashboard Integration

```tsx
// In FADashboard.tsx
import { QuickViewPanel } from './QuickViewPanel';
import { useNodeInteractions } from '../hooks/useNodeInteractions';

export function FADashboard() {
  // ... existing state ...
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [quickViewArtifact, setQuickViewArtifact] = useState<Artifact | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  
  const handleSingleClick = useCallback((nodeId: string) => {
    // Find artifact by nodeId
    const artifact = findArtifactById(nodeId, allArtifacts);
    setSelectedNodeId(nodeId);
    setQuickViewArtifact(artifact);
    setQuickViewOpen(true);
  }, [allArtifacts]);
  
  const handleDoubleClick = useCallback((nodeId: string) => {
    // Find artifact and open full reader
    const artifact = findArtifactById(nodeId, allArtifacts);
    setQuickViewOpen(false);
    setSelectedArtifact(artifact);
  }, [allArtifacts]);
  
  const { handleClick } = useNodeInteractions({
    onSingleClick: handleSingleClick,
    onDoubleClick: handleDoubleClick,
  });
  
  const handleOpenFull = useCallback(() => {
    setQuickViewOpen(false);
    if (quickViewArtifact) {
      setSelectedArtifact(quickViewArtifact);
    }
  }, [quickViewArtifact]);
  
  return (
    <>
      {/* ... existing content ... */}
      
      {/* Feature cards with tree */}
      <FeatureCardList
        features={features}
        selectedNodeId={selectedNodeId}
        onNodeClick={handleClick}
      />
      
      {/* Quick View Panel */}
      <QuickViewPanel
        artifact={quickViewArtifact}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        onOpenFull={handleOpenFull}
      />
      
      {/* Full Reader (existing) */}
      <ArtifactReader
        artifact={selectedArtifact}
        onClose={() => setSelectedArtifact(null)}
      />
    </>
  );
}
```

### 2.6 Expand Toggle Isolation

```tsx
// In ArtifactTree - ensure expand toggle has separate click handler
<TreeItem
  itemId={node.id}
  slots={{
    expandIcon: () => (
      <IconButton 
        size="small" 
        onClick={(e) => {
          e.stopPropagation(); // Prevent node click
          onToggleExpand(node.id);
        }}
      >
        <ChevronRight />
      </IconButton>
    ),
    collapseIcon: () => (
      <IconButton 
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand(node.id);
        }}
      >
        <ExpandMore />
      </IconButton>
    ),
  }}
  label={
    <ArtifactTreeNode 
      node={node}
      selected={selectedNodeId === node.id}
      onClick={() => handleClick(node.id)}
    />
  }
/>
```

### 2.7 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| MUI Tooltip | Existing | ✓ |
| MUI Drawer | Existing | ✓ |
| react-markdown | Existing | ✓ |
| ArtifactTree (s-e005-002) | New | Dependency |

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] `useNodeInteractions` distinguishes single/double click
- [ ] Tooltip renders with node info
- [ ] QuickViewPanel shows artifact details
- [ ] Selected node has highlight style

### 3.2 Integration Tests

- [ ] Single click opens quick view panel
- [ ] Double click opens full reader
- [ ] Expand toggle doesn't trigger click
- [ ] Selecting new node updates quick view
- [ ] "Open Full Reader" button works

### 3.3 Manual Testing

- [ ] Hover shows tooltip after 500ms delay
- [ ] Single click opens side panel, tree stays visible
- [ ] Double click opens full reader
- [ ] Quick view shows Overview section
- [ ] Selected node is highlighted

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Click timing feels slow | Medium | Low | Make delay configurable; test with users |
| Touch devices have no hover | Medium | Low | Show info button for touch |
| Content extraction fails | Low | Low | Fallback to raw content preview |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Hover shows tooltip | MUI Tooltip with 500ms delay |
| 2 | Single click opens quick-view | `useNodeInteractions` + QuickViewPanel |
| 3 | Quick-view shows header + overview | `extractOverviewSection()` |
| 4 | Double-click opens full reader | Timer-based detection |
| 5 | Quick-view has "Open Full Reader" | Button in QuickViewPanel |
| 6 | Expand toggle doesn't trigger | `stopPropagation()` on toggle |
| 7 | Selecting new node updates panel | State update in `handleSingleClick` |

---

## 6. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] s-e005-002 (tree component) complete
- [ ] Click timing UX validated

### Implementation

- [ ] useNodeInteractions hook created
- [ ] Tooltip added to ArtifactTreeNode
- [ ] QuickViewPanel component created
- [ ] FADashboard integrated
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] Integration tests passing
- [ ] Manual testing complete
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-16 | AI-Generated | Initial plan |
