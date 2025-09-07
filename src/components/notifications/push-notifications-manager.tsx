'use client';

import { endpoints } from '@/src/utils/axios';
import { useRef, useState, useEffect } from 'react';
import { getApplicationServerKey } from '@/src/utils/notifications';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';
import ScheduleNotificationForm from '@/src/layouts/common/notifications-popover/components/schedule-notification-form';

import {
  Box,
  Card,
  Alert,
  Button,
  Typography,
  CardContent,
} from '@mui/material';

import { HOST_API } from 'src/config-global';

import Iconify from 'src/components/iconify';

interface PushNotificationProps {
  onNotificationScheduled: () => void;
}

const PushNotificationManager = ({
  onNotificationScheduled,
}: PushNotificationProps) => {
  const initializedRef = useRef(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const { mutateAsync } = useCreateGenericMutation();
  const [permission, setPermission] =
    useState<NotificationPermission>('default');

  useEffect(() => {
    // Evitar ejecución múltiple en desarrollo
    if (initializedRef.current) return;

    // Verificar compatibilidad
    if (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Cargar notificaciones programadas existentes
      onNotificationScheduled();

      initializedRef.current = true;
    }
  }, [onNotificationScheduled]);

  const requestPermission = async () => {
    if (!isSupported) return;

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      await registerServiceWorker();
    }
  };

  const registerServiceWorker = async () => {
    try {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error('VAPID public key is not defined');
        return;
      }
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado correctamente');

      // Suscribirse a las notificaciones push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: getApplicationServerKey(vapidPublicKey),
      });
      await mutateAsync<PushSubscription>({
        payload: subscription,
        pEndpoint: `${HOST_API}${endpoints.notification.subscribe}`,
        method: 'POST',
      });
      onNotificationScheduled();
    } catch (error) {
      console.error('Error registrando Service Worker:', error);
    }
  };

  if (!isSupported) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Tu navegador no soporta notificaciones push. Por favor, actualiza a un
        navegador más moderno.
      </Alert>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Iconify
              width={28}
              icon="eva:bell-fill"
              style={{ marginRight: 8 }}
            />
            <Typography variant="h5" component="h2">
              Configuración de Notificaciones
            </Typography>
          </Box>

          {permission === 'default' && (
            <Box>
              <Typography paragraph>
                Para recibir notificaciones, necesitamos tu permiso.
              </Typography>
              <Button
                variant="contained"
                onClick={requestPermission}
                startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
              >
                Activar Notificaciones
              </Button>
            </Box>
          )}

          {permission === 'granted' && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Notificaciones activadas correctamente
            </Alert>
          )}

          {permission === 'denied' && (
            <Alert severity="error">
              Has bloqueado las notificaciones. Para activarlas, actualiza los
              permisos en la configuración de tu navegador.
            </Alert>
          )}
        </CardContent>
      </Card>

      {permission === 'granted' && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Iconify
                width={28}
                icon="eva:clock-fill"
                style={{ marginRight: 8 }}
              />
              <Typography variant="h6" component="h3">
                Programar Nueva Notificación
              </Typography>
            </Box>
            <ScheduleNotificationForm
              onNotificationScheduled={onNotificationScheduled}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PushNotificationManager;
