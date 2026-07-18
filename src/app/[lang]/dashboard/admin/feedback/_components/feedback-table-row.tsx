// sections/feedback/feedback-table-row.tsx
'use client';

import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import {
  Chip,
  Stack,
  Tooltip,
  Checkbox,
  ListItemText,
  Avatar,
  Typography,
} from '@mui/material';

import Iconify from '@/components/iconify';
import { IFeedback } from '@/types/feedback';
import { useBoolean } from '@/hooks/use-boolean';
import { fDate, fTime } from '@/utils/format-time';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import FeedbackQuickView from './feedback-quick-view';

// ----------------------------------------------------------------------

type Props = {
  row: IFeedback;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onViewRow: VoidFunction;
  updateStatusAction: (id: string, status: string) => void;
  refetchAction: () => void;
  getRatingDisplayAction: (rating?: number) => React.ReactNode;
  typeLabels: Record<string, { label: string; color: string; icon: string }>;
  statusLabels: Record<string, { label: string; color: string }>;
  priorityLabels: Record<string, { label: string; color: string }>;
};

export default function FeedbackTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onViewRow,
  updateStatusAction,
  refetchAction,
  getRatingDisplayAction,
  typeLabels,
  statusLabels,
  priorityLabels,
}: Props) {
  const {
    _id,
    type,
    title,
    description,
    rating,
    reason,
    comments,
    user,
    priority,
    status,
    createdAt,
  } = row;

  const popover = usePopover();
  const quickView = useBoolean();

  const getTypeInfo = (feedbackType: string) => {
    return typeLabels[feedbackType] || typeLabels.general_feedback;
  };

  const getStatusInfo = (feedbackStatus: string) => {
    return statusLabels[feedbackStatus] || statusLabels.pending;
  };

  const getPriorityInfo = (feedbackPriority: string) => {
    return priorityLabels[feedbackPriority] || priorityLabels.medium;
  };

  const getStatusColor = (feedbackStatus: string) => {
    switch (feedbackStatus) {
      case 'pending':
        return 'warning';
      case 'reviewing':
        return 'info';
      case 'in-progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (feedbackType: string) => {
    switch (feedbackType) {
      case 'general_feedback':
        return 'primary';
      case 'improvement':
        return 'info';
      case 'bug':
        return 'error';
      case 'suggestion':
        return 'warning';
      case 'question':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (feedbackPriority: string) => {
    switch (feedbackPriority) {
      case 'low':
        return 'info';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'Anonymous';
  };

  const getFeedbackTitle = () => {
    if (type === 'general_feedback') {
      return `Feedback - Rating ${rating || 'N/A'}`;
    }
    return title || 'Untitled';
  };

  const getFeedbackDescription = () => {
    if (type === 'general_feedback') {
      return reason || comments || 'No additional details';
    }
    return description || 'No description';
  };

  const handleUpdateStatus = (newStatus: string) => {
    updateStatusAction(_id, newStatus);
    popover.onClose();
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {/* Type */}
        <TableCell>
          <Chip
            label={getTypeInfo(type).label}
            color={getTypeColor(type) as any}
            size="small"
            icon={<Iconify icon={getTypeInfo(type).icon} width={16} />}
            variant="filled"
          />
        </TableCell>

        {/* Title / Description */}
        <TableCell>
          <ListItemText
            primary={getFeedbackTitle()}
            secondary={getFeedbackDescription()}
            primaryTypographyProps={{
              typography: 'body2',
              noWrap: true,
              sx: { maxWidth: 200 },
            }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
              noWrap: true,
              sx: { maxWidth: 200, display: 'block' },
            }}
          />
        </TableCell>

        {/* Rating */}
        <TableCell align="center">
          {type === 'general_feedback' ? getRatingDisplayAction(rating) : '-'}
        </TableCell>

        {/* User */}
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
              <Typography variant="caption" fontWeight={600}>
                {getUserInitials(user?.name)}
              </Typography>
            </Avatar>
            <ListItemText
              primary={getUserDisplayName()}
              secondary={user?.email || 'No email'}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
                noWrap: true,
              }}
            />
          </Stack>
        </TableCell>

        {/* Priority */}
        <TableCell align="center">
          <Chip
            label={getPriorityInfo(priority).label}
            color={getPriorityColor(priority) as any}
            size="small"
            variant="outlined"
          />
        </TableCell>

        {/* Status */}
        <TableCell align="center">
          <Chip
            label={getStatusInfo(status).label}
            color={getStatusColor(status) as any}
            size="small"
          />
        </TableCell>

        {/* Created At */}
        <TableCell>
          <ListItemText
            primary={fDate(createdAt) || 'N/A'}
            secondary={fTime(createdAt) || 'N/A'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        {/* Actions */}
        <TableCell align="right" padding="none">
          <Tooltip title="Quick View" placement="top" arrow>
            <IconButton
              color={quickView.value ? 'inherit' : 'default'}
              onClick={quickView.onTrue}
            >
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>
          <IconButton
            color={popover.open ? 'primary' : 'default'}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem
          onClick={() => {
            quickView.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={() => handleUpdateStatus('reviewing')}>
          <Iconify icon="mdi:eye-outline" />
          Mark as Reviewing
        </MenuItem>

        <MenuItem onClick={() => handleUpdateStatus('in-progress')}>
          <Iconify icon="mdi:progress-clock" />
          Mark as In Progress
        </MenuItem>

        <MenuItem onClick={() => handleUpdateStatus('completed')}>
          <Iconify icon="mdi:check-circle" />
          Mark as Completed
        </MenuItem>

        <MenuItem onClick={() => handleUpdateStatus('rejected')}>
          <Iconify icon="mdi:close-circle" />
          Mark as Rejected
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDeleteRow();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <FeedbackQuickView
        open={quickView.value}
        feedback={row}
        onCloseAction={quickView.onFalse}
        onRefetchAction={refetchAction}
        onUpdateStatusAction={updateStatusAction}
      />
    </>
  );
}
