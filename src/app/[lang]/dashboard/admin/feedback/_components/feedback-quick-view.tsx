// sections/feedback/feedback-quick-view.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
  Box,
  Divider,
  IconButton,
  Rating,
  Grid,
  Paper,
  TextField,
  MenuItem,
} from '@mui/material';

import Iconify from '@/components/iconify';
import { IFeedback } from '@/types/feedback';
import { fDate, fTime } from '@/utils/format-time';

type Props = {
  open: boolean;
  feedback?: IFeedback;
  onCloseAction: () => void;
  onRefetchAction: () => void;
  onUpdateStatusAction: (id: string, status: string) => void;
};

export default function FeedbackQuickView({
  open,
  feedback,
  onCloseAction,
  onRefetchAction,
  onUpdateStatusAction,
}: Props) {
  type FeedbackStatus =
    | 'pending'
    | 'reviewing'
    | 'in-progress'
    | 'completed'
    | 'rejected';
  const [newStatus, setNewStatus] = useState<FeedbackStatus>(
    feedback?.status || 'pending'
  );

  if (!feedback) return null;

  const typeLabels: Record<
    string,
    { label: string; color: string; icon: string }
  > = {
    general_feedback: {
      label: 'General',
      color: 'primary',
      icon: 'mdi:star-outline',
    },
    improvement: {
      label: 'Improvement',
      color: 'info',
      icon: 'mdi:lightbulb-outline',
    },
    bug: { label: 'Bug', color: 'error', icon: 'mdi:bug-outline' },
    suggestion: {
      label: 'Suggestion',
      color: 'warning',
      icon: 'mdi:comment-outline',
    },
    question: {
      label: 'Question',
      color: 'secondary',
      icon: 'mdi:help-circle-outline',
    },
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const handleStatusChange = () => {
    onUpdateStatusAction(feedback._id, newStatus);
    onRefetchAction();
  };

  return (
    <Dialog open={open} onClose={onCloseAction} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify
              icon={typeLabels[feedback.type]?.icon || 'mdi:message-outline'}
              width={24}
            />
            <Typography variant="h6">
              {feedback.type === 'general_feedback'
                ? 'Feedback Details'
                : feedback.title || 'Feedback Details'}
            </Typography>
          </Stack>
          <IconButton onClick={onCloseAction}>
            <Iconify icon="mdi:close" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Información básica */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Type
                </Typography>
                <Chip
                  label={typeLabels[feedback.type]?.label || feedback.type}
                  color={typeLabels[feedback.type]?.color as any}
                  size="small"
                  icon={
                    <Iconify
                      icon={typeLabels[feedback.type]?.icon || ''}
                      width={16}
                    />
                  }
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Priority
                </Typography>
                <Chip
                  label={feedback.priority}
                  color={
                    feedback.priority === 'critical' ||
                    feedback.priority === 'high'
                      ? 'error'
                      : 'warning'
                  }
                  size="small"
                />
              </Stack>
            </Grid>
          </Grid>

          {/* Rating (si existe) */}
          {feedback.type === 'general_feedback' && feedback.rating && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Rating
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating value={feedback.rating} readOnly size="large" />
                <Typography variant="h6">{feedback.rating}/5</Typography>
              </Stack>
            </Box>
          )}

          {/* Detalles del feedback */}
          {feedback.type === 'general_feedback' ? (
            <>
              {feedback.reason && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Reason
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, mt: 0.5, bgcolor: 'background.default' }}
                  >
                    <Typography variant="body2">{feedback.reason}</Typography>
                  </Paper>
                </Box>
              )}
              {feedback.improvements && feedback.improvements.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Areas to Improve
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ mt: 0.5 }}
                  >
                    {feedback.improvements.map((area) => (
                      <Chip
                        key={area}
                        label={area.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
              {feedback.comments && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Additional Comments
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, mt: 0.5, bgcolor: 'background.default' }}
                  >
                    <Typography variant="body2">{feedback.comments}</Typography>
                  </Paper>
                </Box>
              )}
            </>
          ) : (
            <>
              {feedback.description && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Description
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, mt: 0.5, bgcolor: 'background.default' }}
                  >
                    <Typography variant="body2">
                      {feedback.description}
                    </Typography>
                  </Paper>
                </Box>
              )}
              {feedback.steps && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Steps to Reproduce
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, mt: 0.5, bgcolor: 'background.default' }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {feedback.steps}
                    </Typography>
                  </Paper>
                </Box>
              )}
              {feedback.expected && feedback.actual && (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Expected Result
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, mt: 0.5, bgcolor: 'background.default' }}
                    >
                      <Typography variant="body2">
                        {feedback.expected}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Actual Result
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, mt: 0.5, bgcolor: 'background.default' }}
                    >
                      <Typography variant="body2">{feedback.actual}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </>
          )}

          <Divider />

          {/* Información del usuario */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              User Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body2">
                  {feedback.user?.name || 'Anonymous'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body2">
                  {feedback.user?.email || 'Not provided'}
                </Typography>
              </Grid>
              {feedback.contact?.phone && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body2">
                    {feedback.contact.phone}
                  </Typography>
                </Grid>
              )}
              {feedback.contact?.consent && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Consent
                  </Typography>
                  <Chip
                    label="Contact consent given"
                    size="small"
                    color="success"
                  />
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Metadatos */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Metadata
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2">
                  {fDate(feedback.createdAt)} {fTime(feedback.createdAt)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {fDate(feedback.updatedAt)} {fTime(feedback.updatedAt)}
                </Typography>
              </Grid>
              {feedback.metadata?.url && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">
                    URL
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {feedback.metadata.url}
                  </Typography>
                </Grid>
              )}
              {feedback.metadata?.trigger && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Trigger
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {feedback.metadata.trigger}
                  </Typography>
                </Grid>
              )}
              {feedback.metadata?.language && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Language
                  </Typography>
                  <Typography variant="body2">
                    {feedback.metadata.language}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Admin Notes */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Admin Notes
            </Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, mt: 0.5, bgcolor: 'background.default' }}
            >
              <Typography variant="body2">
                {feedback.adminNotes || 'No admin notes yet'}
              </Typography>
            </Paper>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <TextField
            select
            label="Update Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as FeedbackStatus)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            onClick={handleStatusChange}
            size="small"
            disabled={newStatus === feedback.status}
          >
            Update
          </Button>
        </Box>
        <Button onClick={onCloseAction} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
