// components/dashboard/user/pet-sticky-note.tsx

import { useState } from 'react';

import { Box, alpha, useTheme, Typography } from '@mui/material';

interface PetStickyNoteProps {
  notes: string;
  color?: 'blue' | 'yellow' | 'green' | 'pink' | 'red';
  editable?: boolean;
  onNoteChange?: (notes: string) => void;
}

export default function PetStickyNote({
  notes,
  color = 'blue',
  editable = false,
  onNoteChange,
}: PetStickyNoteProps) {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);

  const getNoteColors = () => {
    switch (color) {
      case 'yellow':
        return {
          start: '#FFF9C4',
          mid: '#FFF59D',
          end: '#FFF176',
        };
      case 'green':
        return {
          start: '#C8E6C9',
          mid: '#A5D6A7',
          end: '#81C784',
        };
      case 'pink':
        return {
          start: '#F8BBD9',
          mid: '#F48FB1',
          end: '#F06292',
        };

      case 'red':
        return {
          start: '#f1969f',
          mid: '#db4444',
          end: '#d34e4e',
        };

      default:
        return {
          start: theme.palette.info.light,
          mid: alpha(theme.palette.info.main, 0.8),
          end: alpha(theme.palette.info.light, 0.9),
        };
    }
  };

  const colors = getNoteColors();

  const handleSave = () => {
    setIsEditing(false);
    if (onNoteChange) {
      onNoteChange(localNotes);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 200,
        position: 'relative',
        mx: 'auto',
        my: 3,
        cursor: editable ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: editable ? 'scale(1.02)' : 'none',
        },
      }}
      onClick={() => editable && setIsEditing(true)}
    >
      {/* SVG para el clipPath */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="stickyClip" clipPathUnits="objectBoundingBox">
            <path
              d="M 0 0 Q 0 0.69, 0.03 0.96 0.03 0.96, 1 0.96 Q 0.96 0.69, 0.96 0 0.96 0, 0 0"
              strokeLinejoin="round"
              strokeLinecap="square"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Contenedor con proporción */}
      <Box
        sx={{
          display: 'flex',
          paddingTop: '91.5925926%',
          position: 'relative',
          width: '100%',
        }}
      >
        {/* Sombra */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            '&::before': {
              boxShadow: theme.shadows[8],
              backgroundColor: alpha(theme.palette.common.black, 0.25),
              content: '""',
              width: '90%',
              left: '5px',
              height: '75%',
              position: 'absolute',
              top: '30%',
              zIndex: 0,
              borderRadius: '2px',
            },
          }}
        >
          {/* Sticky Note */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              background: `linear-gradient(
                180deg,
                ${colors.start} 0%,
                ${colors.start} 12%,
                ${colors.mid} 75%,
                ${colors.end} 100%
              )`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 2,
              clipPath: 'url(#stickyClip)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            {isEditing && editable ? (
              <textarea
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSave();
                  }
                }}
                ref={(el) => {
                  el?.focus();
                }}
                style={{
                  width: '90%',
                  height: '80%',
                  background: 'transparent',
                  border: 'none',
                  fontFamily: '"Kalam", cursive',
                  fontSize: '1rem',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  textAlign: 'center',
                  resize: 'none',
                  outline: 'none',
                  color:
                    color === 'yellow' ? '#000' : theme.palette.text.primary,
                }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Kalam", cursive',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                  fontWeight: 500,
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  textAlign: 'center',
                  maxHeight: '90%',
                  overflow: 'auto',
                  color:
                    color === 'yellow' ? '#000' : theme.palette.text.primary,
                  px: 1,
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: alpha(theme.palette.common.black, 0.1),
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: alpha(theme.palette.common.black, 0.3),
                    borderRadius: '4px',
                  },
                }}
              >
                {notes}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Pequeña decoración de chincheta */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${alpha(
            theme.palette.common.white,
            0.8
          )}, ${alpha(theme.palette.grey[600], 0.6)})`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 2,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${alpha(
              theme.palette.common.white,
              0.9
            )}, ${alpha(theme.palette.grey[400], 0.7)})`,
          },
        }}
      />
    </Box>
  );
}
