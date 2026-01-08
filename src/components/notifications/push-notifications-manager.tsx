/* eslint-disable no-nested-ternary */

'use client';

import { endpoints } from '@/src/utils/axios';
import { NotificationData } from '@/src/types/api';
import { useRef, useState, useEffect, useCallback } from 'react';
import { getApplicationServerKey } from '@/src/utils/notifications';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';

import {
  Box,
  Card,
  Alert,
  Button,
  Typography,
  CardContent,
  CircularProgress,
} from '@mui/material';

import { HOST_API } from 'src/config-global';

import Iconify from 'src/components/iconify';

interface PushNotificationProps {
  onNotificationScheduled: () => void;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationData[]>>;
}

const PushNotificationManager = ({
  onNotificationScheduled,
  setNotifications,
}: PushNotificationProps) => {
  const initializedRef = useRef(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const { mutateAsync } = useCreateGenericMutation();
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [swRegistered, setSwRegistered] = useState<boolean>(false);
  const [errors, setError] = useState<string>('');

  const checkExistingSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();

      if (existingSubscription) {
        setIsSubscribed(true);
        console.log('Suscripción existente:', existingSubscription);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verificando suscripción:', error);
      return false;
    }
  }, []);

  const registerServiceWorker = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error('VAPID public key no configurada');
      }

      // Verificar permisos
      if (Notification.permission === 'denied') {
        throw new Error('Los permisos de notificación fueron denegados');
      }

      // Solicitar permiso si es necesario
      if (Notification.permission === 'default') {
        const permissionResult = await Notification.requestPermission();
        setPermission(permissionResult);

        if (permissionResult !== 'granted') {
          throw new Error('Permiso denegado por el usuario');
        }
      }

      // Registrar Service Worker
      let registration: ServiceWorkerRegistration;
      try {
        registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        console.log('Service Worker registrado:', registration);
        setSwRegistered(true);

        // Esperar a que el service worker esté activo
        await registration.update();
        const worker =
          registration.active ||
          registration.waiting ||
          registration.installing;
        if (worker) {
          await new Promise((resolve) => {
            if (worker.state === 'activated') {
              resolve(true);
            } else {
              worker.addEventListener('statechange', function listener() {
                if (worker.state === 'activated') {
                  worker.removeEventListener('statechange', listener);
                  resolve(true);
                }
              });
            }
          });
        }
      } catch (swError) {
        console.error('Error registrando Service Worker:', swError);
        throw new Error('No se pudo registrar el Service Worker');
      }

      // Suscribirse a push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: getApplicationServerKey(vapidPublicKey),
      });

      console.log('Suscripción creada:', subscription);

      // Enviar al servidor
      const subscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(
            String.fromCharCode.apply(
              null,
              Array.from(new Uint8Array(subscription.getKey('p256dh')!))
            )
          ),
          auth: btoa(
            String.fromCharCode.apply(
              null,
              Array.from(new Uint8Array(subscription.getKey('auth')!))
            )
          ),
        },
      };

      await mutateAsync({
        payload: subscriptionData,
        pEndpoint: `${HOST_API}${endpoints.notification.subscribe}`,
        method: 'POST',
      });

      setIsSubscribed(true);
      console.log('Suscripción completada exitosamente');

      // Test: Enviar notificación de prueba
      setTimeout(async () => {
        try {
          await mutateAsync({
            payload: {
              title: '¡Notificaciones activadas!',
              body: 'Ahora recibirás notificaciones importantes.',
              type: 'system',
            },
            pEndpoint: `${HOST_API}${endpoints.notification.send}`,
            method: 'POST',
          });
          console.log('Notificación de prueba enviada');
        } catch (testError) {
          console.error('Error enviando notificación de prueba:', testError);
        }
      }, 2000);
    } catch (error: any) {
      console.error('Error en suscripción:', error);
      setError(error.message || 'Error desconocido');
      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  }, [mutateAsync]);

  const unsubscribeFromNotifications = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const success = await subscription.unsubscribe();
        if (success) {
          console.log('Suscripción cancelada');
          setIsSubscribed(false);

          // Notificar al servidor
          try {
            await mutateAsync({
              payload: { endpoint: subscription.endpoint },
              pEndpoint: `${HOST_API}${endpoints.notification.unsubscribe}`,
              method: 'POST',
            });
          } catch (serverError) {
            console.error('Error notificando al servidor:', serverError);
          }
        }
      }
    } catch (error) {
      console.error('Error cancelando suscripción:', error);
    }
  }, [mutateAsync]);

  useEffect(() => {
    if (initializedRef.current) return;

    const initialize = async () => {
      if (
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window
      ) {
        setIsSupported(true);
        setPermission(Notification.permission);

        try {
          // Verificar si ya hay una suscripción activa
          const registered = await navigator.serviceWorker.getRegistration();
          if (registered) {
            setSwRegistered(true);
            await checkExistingSubscription();
          }
        } catch (error) {
          console.error('Error inicializando:', error);
        }

        initializedRef.current = true;
      }
    };

    initialize();
  }, [checkExistingSubscription]);

  if (!isSupported) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Tu navegador no soporta notificaciones push. Usa Chrome, Firefox o Edge.
      </Alert>
    );
  }

  return (
    <Box>
      {errors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors}
        </Alert>
      )}

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

          <Typography variant="body2" color="text.secondary" paragraph>
            Estado: {isSubscribed ? '✅ Suscrito' : '❌ No suscrito'}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Permisos:{' '}
            {permission === 'granted'
              ? '✅ Concedidos'
              : permission === 'denied'
                ? '❌ Denegados'
                : '⏳ Pendientes'}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Service Worker:{' '}
            {swRegistered ? '✅ Registrado' : '❌ No registrado'}
          </Typography>

          {permission === 'granted' && !isSubscribed && (
            <Button
              variant="contained"
              onClick={registerServiceWorker}
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Iconify icon="eva:bell-fill" />
                )
              }
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Suscribiendo...' : 'Suscribirse a Notificaciones'}
            </Button>
          )}

          {isSubscribed && (
            <Button
              variant="outlined"
              color="error"
              onClick={unsubscribeFromNotifications}
              disabled={isLoading}
              startIcon={<Iconify icon="eva:bell-off-fill" />}
              sx={{ mt: 2 }}
            >
              Desactivar Notificaciones
            </Button>
          )}

          {permission === 'default' && (
            <Button
              variant="contained"
              onClick={registerServiceWorker}
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Iconify icon="eva:checkmark-circle-2-fill" />
                )
              }
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Solicitando...' : 'Activar Notificaciones'}
            </Button>
          )}

          {permission === 'denied' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Has bloqueado las notificaciones. Para activarlas, ve a la
              configuración de tu navegador y permite las notificaciones para
              este sitio.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PushNotificationManager;
