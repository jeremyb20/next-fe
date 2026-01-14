import { m } from 'framer-motion';
import { endpoints } from '@/src/utils/axios';
import { HOST_API } from '@/src/config-global';
import { NotificationData } from '@/src/types/api';
import { useManagerUser } from '@/src/hooks/use-manager-user';
import { useFetchGetNotifications } from '@/src/hooks/use-fetch';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';
import PushNotificationManager from '@/src/components/notifications/push-notifications-manager';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';

import NotificationItem from './notification-item';
import ScheduleNotificationForm from './components/schedule-notification-form';

// ----------------------------------------------------------------------

interface TabType {
  value: string;
  label: string;
  count: number | null;
}

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const drawer = useBoolean();
  const smUp = useResponsive('up', 'sm');
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const { user } = useManagerUser();
  const currentRole = user?.role;
  const { mutateAsync } = useCreateGenericMutation();

  // Usar el hook para obtener notificaciones reales
  const { data: fetchedNotifications = [], refetch: refetchNotifications } =
    useFetchGetNotifications();

  // Estado para las notificaciones
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Actualizar notificaciones cuando los datos obtenidos cambien
  useEffect(() => {
    if (fetchedNotifications && fetchedNotifications.length > 0) {
      setNotifications(fetchedNotifications);
    }
  }, [fetchedNotifications]);

  // Función para ordenar notificaciones por fecha (más reciente primero)
  const sortNotificationsByDate = useCallback(
    (notifs: NotificationData[]) =>
      [...notifs].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      }),
    []
  );

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
      setShowSettings(false);
    },
    []
  );

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    switch (currentTab) {
      case 'unread':
        filtered = notifications.filter((item) => item.read === false);
        break;
      case 'schedule':
        filtered = notifications.filter((item) => item.type === 'schedule');
        break;
      case 'all':
      default:
        filtered = notifications;
        break;
    }

    return sortNotificationsByDate(filtered);
  }, [notifications, currentTab, sortNotificationsByDate]);

  const totalUnRead = useMemo(
    () => notifications.filter((item) => item.read === false).length,
    [notifications]
  );

  const totalScheduled = useMemo(
    () => notifications.filter((item) => item.type === 'schedule').length,
    [notifications]
  );

  const TABS: TabType[] = [
    {
      value: 'all',
      label: 'All',
      count: notifications.length,
    },
    {
      value: 'unread',
      label: 'Unread',
      count: totalUnRead,
    },
    {
      value: 'schedule',
      label: 'Schedule',
      count: totalScheduled,
    },
    ...(currentRole === 'admin'
      ? [
          {
            value: 'newSchedule',
            label: 'New Schedule',
            count: null,
          },
        ]
      : []),
  ];

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true, // Cambiado a true para marcar como leído
    }));
    setNotifications(updatedNotifications);
  };

  const deleteScheduledNotification = async (notificationId: string) => {
    try {
      await mutateAsync<{ id: string }>({
        payload: { id: notificationId },
        pEndpoint: `${HOST_API}${endpoints.notification.delete}/${notificationId}`,
        method: 'DELETE',
      });
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error('Error al eliminar la notificación:', error);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>
      {!!totalUnRead && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      <IconButton onClick={toggleSettings}>
        <Iconify
          icon={
            showSettings
              ? 'solar:bell-bing-bold-duotone'
              : 'solar:settings-bold-duotone'
          }
        />
      </IconButton>

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={
                ((tab.value === 'all' || tab.value === currentTab) &&
                  'filled') ||
                'soft'
              }
              color={
                (tab.value === 'unread' && 'info') ||
                (tab.value === 'archived' && 'success') ||
                'default'
              }
            >
              {tab.count !== null ? (
                tab.count
              ) : (
                <Iconify icon="eva:plus-fill" />
              )}
            </Label>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {filteredNotifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            deleteScheduledNotification={deleteScheduledNotification}
          />
        ))}
      </List>
    </Scrollbar>
  );

  const renderScheduleTab = (
    <Box sx={{ p: 2 }}>
      <PushNotificationManager
        onNotificationScheduled={refetchNotifications}
        setNotifications={setNotifications}
      />
    </Box>
  );

  const renderNewScheduleTab = (
    <Box sx={{ p: 2 }}>
      <ScheduleNotificationForm
        onNotificationScheduled={refetchNotifications}
        setNotifications={setNotifications}
      />
    </Box>
  );

  // Determinar qué contenido mostrar
  const renderContent = () => {
    if (showSettings) {
      return renderScheduleTab;
    }

    return renderList;
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}
        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2.5, pr: 1 }}
        >
          {renderTabs}
        </Stack>

        <Divider />
        {currentTab === 'newSchedule' && renderNewScheduleTab}
        {notifications.length === 0 && currentTab !== 'newSchedule' && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              No notifications available
            </Typography>
          </Box>
        )}
        {renderContent()}

        {!showSettings &&
          currentTab !== 'schedule' &&
          currentTab !== 'newSchedule' && (
            <Box sx={{ p: 1 }}>
              <Button fullWidth size="large">
                View All
              </Button>
            </Box>
          )}
      </Drawer>
    </>
  );
}
