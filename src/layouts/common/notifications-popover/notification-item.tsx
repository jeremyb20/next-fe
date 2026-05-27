import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import Image from '@/components/image';
import { bgGradient } from '@/theme/css';
import Iconify from '@/components/iconify';
import { fToNow } from '@/utils/format-time';
import { NotificationData } from '@/types/api';
import FileThumbnail from '@/components/file-thumbnail';
import CustomPopover, { usePopover } from '@/components/custom-popover';

// ----------------------------------------------------------------------

type NotificationItemProps = {
  notification: NotificationData;
  deleteNotification: (id: string) => void;
  markAsRead: (id: string) => void;
};

export default function NotificationItem({
  notification,
  deleteNotification,
  markAsRead,
}: NotificationItemProps) {
  const popover = usePopover();
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.main;
  const handleMarkAsRead = () => {
    markAsRead(notification._id);
    popover.onClose();
  };

  const handleDelete = () => {
    deleteNotification(notification._id);
    popover.onClose();
  };

  const renderAvatar = () => {
    // Colores para diferentes tipos de notificaciones
    const getIconColor = () => {
      switch (notification.type) {
        case 'system':
          return '#FF6B4A';
        case 'schedule':
          return '#4CAF50';
        case 'order':
          return '#2196F3';
        case 'chat':
          return '#9C27B0';
        case 'alert':
          return '#FF9800';
        case 'mail':
          return '#E91E63';
        case 'delivery':
          return '#00BCD4';
        default:
          return '#757575';
      }
    };

    const getIcon = () => {
      switch (notification.type) {
        case 'system':
          return 'solar:bell-bing-bold-duotone';
        case 'schedule':
          return 'lets-icons:clock';
        case 'order':
          return 'ic_order';
        case 'chat':
          return 'ic_chat';
        case 'alert':
          return 'heroicons:user-plus-solid';
        case 'mail':
          return 'ic_mail';
        case 'delivery':
          return 'ic_delivery';
        default:
          return 'solar:bell-bing-bold-duotone';
      }
    };

    return (
      <ListItemAvatar>
        {/* Imagen si existe - tamaño pequeño */}
        {notification.image ? (
          renderImagePreview()
        ) : (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Iconify
              icon={getIcon()}
              sx={{
                fontSize: 24,
                color: getIconColor(),
              }}
            />
          </Box>
        )}
      </ListItemAvatar>
    );
  };

  const renderImagePreview = () => (
    <Box sx={{ mt: 1.5 }}>
      <Image
        alt={notification.title}
        src={notification.image}
        sx={{
          width: 50,
          height: 50,
          borderRadius: 2,
          cursor: 'pointer',
          objectFit: 'cover',
        }}
      />
    </Box>
  );

  const renderContent = () => (
    <Box sx={{ flex: 1 }}>
      <Stack spacing={0.5}>
        {/* Header con título, hora y menú */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack>
            <Typography
              variant="subtitle2"
              sx={{
                color: notification.read ? 'text.secondary' : 'text.primary',
                fontWeight: notification.read ? 400 : 600,
              }}
            >
              {notification.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {fToNow(notification.createdAt)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            {/* Botón de menú con tres puntos */}
            <IconButton
              size="small"
              onClick={popover.onOpen}
              sx={{
                opacity: 0.7,
                '&:hover': { opacity: 1 },
              }}
            >
              <Iconify icon="eva:more-vertical-fill" sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Cuerpo de la notificación */}
        {notification.body && (
          <Box
            sx={{
              color: 'text.secondary',
              typography: 'body2',
              lineHeight: 1.5,
            }}
          >
            {reader(notification.body)}
          </Box>
        )}

        {/* Actions basadas en tipo de notificación */}
        {notification.type === 'project' && renderProjectAction()}
        {notification.type === 'file' && renderFileAction()}
        {notification.type === 'tags' && renderTagsAction()}
        {notification.type === 'payment' && renderPaymentAction()}
      </Stack>
    </Box>
  );

  const renderProjectAction = () => (
    <Card variant="outlined" sx={{ mt: 1.5, bgcolor: 'background.default' }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            <strong>@Jaydon Frankie</strong> dejó un comentario
          </Typography>
          <Button size="small" variant="text" sx={{ minWidth: 'auto' }}>
            Responder
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderFileAction = () => (
    <Card variant="outlined" sx={{ mt: 1.5, bgcolor: 'background.default' }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <FileThumbnail
            file="design-suriname-2015.mp3"
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" noWrap>
              design-suriname-2015.mp3
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                2.3 GB
              </Typography>
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  bgcolor: 'text.disabled',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Hace 30 min
              </Typography>
            </Stack>
          </Box>
          <Button size="small" variant="outlined">
            Descargar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderTagsAction = () => (
    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
      <Chip label="Design" size="small" variant="outlined" />
      <Chip label="Dashboard" size="small" variant="outlined" color="warning" />
      <Chip label="Design system" size="small" variant="outlined" />
    </Stack>
  );

  const renderPaymentAction = () => (
    <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        Pagar ahora
      </Button>
      <Button size="small" variant="text" color="inherit">
        Rechazar
      </Button>
    </Stack>
  );

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          m: 1.5,
          alignItems: 'flex-start',
          borderBottom: '1px solid',
          borderColor: 'divider',

          '&:hover': {
            bgcolor: 'action.hover',
          },
          ...(!notification.read && {
            // bgcolor: 'action.selected',
            // bgcolor: alpha(theme.palette.primary.main, 0.1),
            ...bgGradient({
              direction: '135deg',
              startColor: alpha(PRIMARY_MAIN, 0.2),
              endColor: alpha(theme.palette.primary.main, 0.01),
            }),
          }),
        }}
      >
        <CardContent sx={{ p: 1, display: 'flex', alignItems: 'flex-start' }}>
          {renderAvatar()}
          <Box sx={{ flexGrow: 1 }}>{renderContent()}</Box>
        </CardContent>
      </Card>

      {/* Custom Popover para las acciones */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 180 }}
      >
        {!notification.read && (
          <MenuItem onClick={handleMarkAsRead}>
            <Iconify icon="solar:check-read-bold" />
            Marcar como leído
          </MenuItem>
        )}

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Eliminar
        </MenuItem>
      </CustomPopover>
    </>
  );
}

// ----------------------------------------------------------------------

function reader(data: string) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        '& p': {
          typography: 'body2',
          m: 0,
          fontSize: '0.375rem',
          lineHeight: 1.5,
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '& strong': {
          typography: 'subtitle2',
          fontWeight: 600,
        },
      }}
    />
  );
}
