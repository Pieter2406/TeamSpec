import { useState, useEffect, useCallback, ReactNode } from 'react';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { marked } from 'marked';

interface TbdHighlighterProps {
    content: string;
    children: (processedContent: string) => ReactNode;
}

const TBD_PATTERN = /\{TBD\}/g;
const TBD_CLASS = 'tbd-marker';

// Strip YAML frontmatter from markdown content
function stripFrontmatter(content: string): string {
    const lines = content.split(/\r?\n/);
    if (lines[0]?.trim() === '---') {
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
                // Return content after frontmatter, skipping the closing ---
                return lines.slice(i + 1).join('\n').trim();
            }
        }
    }
    return content;
}

export function TbdHighlighter({ content, children }: TbdHighlighterProps) {
    const [tbdCount, setTbdCount] = useState(0);
    const [currentTbdIndex, setCurrentTbdIndex] = useState(0);
    const [processedHtml, setProcessedHtml] = useState('');

    useEffect(() => {
        // Strip YAML frontmatter before processing
        const strippedContent = stripFrontmatter(content);

        // Count TBD occurrences
        const matches = strippedContent.match(TBD_PATTERN);
        const count = matches ? matches.length : 0;
        setTbdCount(count);
        setCurrentTbdIndex(count > 0 ? 1 : 0);

        // Convert markdown to HTML and highlight TBD markers
        const html = marked(strippedContent, { async: false }) as string;

        let tbdIndex = 0;
        const highlightedHtml = html.replace(TBD_PATTERN, () => {
            tbdIndex++;
            return `<span class="${TBD_CLASS}" data-tbd-index="${tbdIndex}" style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 4px; font-weight: bold; color: #000;">{TBD}</span>`;
        });

        setProcessedHtml(highlightedHtml);
    }, [content]);

    const navigateToTbd = useCallback((index: number) => {
        const markers = document.querySelectorAll(`.${TBD_CLASS}`);
        if (markers.length > 0 && index >= 1 && index <= markers.length) {
            const target = markers[index - 1] as HTMLElement;
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Flash highlight effect
            target.style.transition = 'background-color 0.3s';
            target.style.backgroundColor = '#ff9800';
            setTimeout(() => {
                target.style.backgroundColor = '#ffeb3b';
            }, 300);

            setCurrentTbdIndex(index);
        }
    }, []);

    const goToNextTbd = useCallback(() => {
        const nextIndex = currentTbdIndex < tbdCount ? currentTbdIndex + 1 : 1;
        navigateToTbd(nextIndex);
    }, [currentTbdIndex, tbdCount, navigateToTbd]);

    const goToPrevTbd = useCallback(() => {
        const prevIndex = currentTbdIndex > 1 ? currentTbdIndex - 1 : tbdCount;
        navigateToTbd(prevIndex);
    }, [currentTbdIndex, tbdCount, navigateToTbd]);

    return (
        <Box>
            {tbdCount > 0 && (
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        background: 'linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%)',
                        zIndex: 10,
                        py: 1.5,
                        px: 3,
                        mb: 0,
                        borderBottom: '2px solid #ffc107',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        boxShadow: '0 4px 12px rgba(255, 193, 7, 0.2)',
                    }}
                >
                    <Chip
                        label={`⚠️ ${tbdCount} TBD${tbdCount > 1 ? 's' : ''} to resolve`}
                        sx={{
                            bgcolor: '#ffc107',
                            color: '#7c4d00',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                        }}
                        size="medium"
                    />
                    <Typography
                        variant="body2"
                        sx={{ color: '#856404', fontWeight: 500 }}
                    >
                        Viewing {currentTbdIndex} of {tbdCount}
                    </Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                        <Tooltip title="Previous TBD (Ctrl+↑)">
                            <IconButton
                                size="small"
                                onClick={goToPrevTbd}
                                sx={{
                                    bgcolor: 'rgba(0,0,0,0.08)',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.15)' },
                                }}
                            >
                                <NavigateBeforeIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Next TBD (Ctrl+↓)">
                            <IconButton
                                size="small"
                                onClick={goToNextTbd}
                                sx={{
                                    bgcolor: 'rgba(0,0,0,0.08)',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.15)' },
                                }}
                            >
                                <NavigateNextIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            )}
            {children(processedHtml)}
        </Box>
    );
}
