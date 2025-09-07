import { m } from 'framer-motion';
import { NotificationData } from '@/src/types/api';
import { useFetchGetNotifications } from '@/src/hooks/use-fetch';
import { useMemo, useState, useEffect, useCallback } from 'react';
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

// ----------------------------------------------------------------------

interface TabType {
  value: string;
  label: string;
  count: number;
}

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const drawer = useBoolean();
  const smUp = useResponsive('up', 'sm');
  const [currentTab, setCurrentTab] = useState<string>('all');

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

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const filteredNotifications = useMemo(() => {
    switch (currentTab) {
      case 'unread':
        return fetchedNotifications.filter((item) => item.read === false);
      case 'schedule':
        return fetchedNotifications.filter((item) => item.type === 'scheduled');
      case 'all':
      default:
        return fetchedNotifications;
    }
  }, [fetchedNotifications, currentTab]);

  const totalUnRead = useMemo(
    () => fetchedNotifications.filter((item) => item.read === false).length,
    [fetchedNotifications]
  );

  const totalScheduled = useMemo(
    () =>
      fetchedNotifications.filter((item) => item.type === 'scheduled').length,
    [fetchedNotifications]
  );
  const TABS: TabType[] = [
    {
      value: 'all',
      label: 'All',
      count: fetchedNotifications.length,
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
  ];
  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: false,
      }))
    );
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
              {tab.count}
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
          />
        ))}
      </List>
    </Scrollbar>
  );

  const renderScheduleTab = (
    <Box sx={{ p: 2 }}>
      <PushNotificationManager onNotificationScheduled={refetchNotifications} />
    </Box>
  );

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
          <IconButton onClick={handleMarkAllAsRead}>
            <Iconify icon="solar:settings-bold-duotone" />
          </IconButton>
        </Stack>

        <Divider />

        {currentTab === 'schedule' ? renderScheduleTab : renderList}
        {/* {currentTab === 'schedule' ? <PushNotificationManager /> : renderList} */}

        {currentTab !== 'schedule' && (
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
