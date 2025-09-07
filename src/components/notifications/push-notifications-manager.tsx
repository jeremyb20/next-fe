'use client';

import { endpoints } from '@/src/utils/axios';
import { useRef, useState, useEffect, useCallback } from 'react';
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
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkExistingSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();

      if (existingSubscription) {
        setIsSubscribed(true);
        console.log('Ya existe una suscripción activa');
        return true;
      }

      setIsSubscribed(false);
      return false;
    } catch (error) {
      console.error('Error verificando suscripción existente:', error);
      setIsSubscribed(false);
      return false;
    }
  }, []);

  const registerServiceWorker = useCallback(async () => {
    setIsLoading(true);
    try {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error('VAPID public key is not defined');
        setIsLoading(false);
        return;
      }

      // Verificar si ya existe una suscripción
      const alreadySubscribed = await checkExistingSubscription();
      if (alreadySubscribed) {
        console.log(
          'Usuario ya está suscrito, no es necesario suscribirse nuevamente'
        );
        setIsLoading(false);
        onNotificationScheduled();
        return;
      }

      // Registrar service worker si no existe
      let registration;
      try {
        registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registrado correctamente');
        }
      } catch (swError) {
        console.error('Error con Service Worker:', swError);
        setIsLoading(false);
        return;
      }

      // Suscribirse a las notificaciones push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: getApplicationServerKey(vapidPublicKey),
      });

      // Enviar la suscripción al servidor
      await mutateAsync<PushSubscription>({
        payload: subscription,
        pEndpoint: `${HOST_API}${endpoints.notification.subscribe}`,
        method: 'POST',
      });

      setIsSubscribed(true);
      console.log('Suscripción creada exitosamente');
      onNotificationScheduled();
    } catch (error) {
      console.error('Error en el proceso de suscripción:', error);
    } finally {
      setIsLoading(false);
    }
  }, [mutateAsync, onNotificationScheduled, checkExistingSubscription]);

  const unsubscribeFromNotifications = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        console.log('Suscripción cancelada');

        // Opcional: Notificar al servidor que se canceló la suscripción
        try {
          await mutateAsync({
            payload: { endpoint: subscription.endpoint },
            pEndpoint: `${HOST_API}${endpoints.notification.unsubscribe}`,
            method: 'POST',
          });
        } catch (serverError) {
          console.error('Error notificando al servidor:', serverError);
        }

        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Error cancelando suscripción:', error);
    }
  }, [mutateAsync]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return;

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      await registerServiceWorker();
    }
  }, [isSupported, registerServiceWorker]);

  useEffect(() => {
    if (initializedRef.current) return;

    const initializePushNotifications = async () => {
      if (
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window
      ) {
        setIsSupported(true);
        setPermission(Notification.permission);

        // Si ya tiene permiso concedido, verificar el estado de la suscripción
        if (Notification.permission === 'granted') {
          try {
            await navigator.serviceWorker.ready;
            await checkExistingSubscription();
          } catch (error) {
            console.error('Error inicializando notificaciones:', error);
          }
        }

        initializedRef.current = true;
      }
    };

    initializePushNotifications();
  }, [checkExistingSubscription]);

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
                disabled={isLoading}
                startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
              >
                {isLoading ? 'Procesando...' : 'Activar Notificaciones'}
              </Button>
            </Box>
          )}

          {permission === 'granted' && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                {isSubscribed
                  ? 'Notificaciones activadas correctamente'
                  : 'Permiso concedido, pero necesita suscribirse'}
              </Alert>

              {!isSubscribed && (
                <Button
                  variant="contained"
                  onClick={registerServiceWorker}
                  disabled={isLoading}
                  startIcon={<Iconify icon="eva:bell-fill" />}
                >
                  {isLoading
                    ? 'Suscribiendo...'
                    : 'Suscribirse a Notificaciones'}
                </Button>
              )}

              {isSubscribed && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={unsubscribeFromNotifications}
                  disabled={isLoading}
                  startIcon={<Iconify icon="eva:bell-off-fill" />}
                  sx={{ mt: 1 }}
                >
                  Desactivar Notificaciones
                </Button>
              )}
            </Box>
          )}

          {permission === 'denied' && (
            <Alert severity="error">
              Has bloqueado las notificaciones. Para activarlas, actualiza los
              permisos en la configuración de tu navegador.
            </Alert>
          )}
        </CardContent>
      </Card>

      {permission === 'granted' && isSubscribed && (
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
