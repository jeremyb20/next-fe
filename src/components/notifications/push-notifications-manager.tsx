'use client';

import { AxiosError } from 'axios';
import { isBefore } from 'date-fns';
import { format } from 'date-fns/esm';
import { useRef, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from '@/src/utils/axios';
import { useFetchGetNotifications } from '@/src/hooks/use-fetch';

import {
  Box,
  Card,
  List,
  Chip,
  Alert,
  Button,
  ListItem,
  TextField,
  Typography,
  IconButton,
  CardContent,
  ListItemText,
} from '@mui/material';

import { HOST_API } from 'src/config-global';

import Iconify from 'src/components/iconify';

interface NotificationFormData {
  title: string;
  body: string;
  date: string;
  time: string;
}

const PushNotificationManager = () => {
  const initializedRef = useRef(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    body: '',
    date: '',
    time: '',
  });

  const {
    data: scheduledNotifications = [],
    refetch: loadScheduledNotifications,
  } = useFetchGetNotifications();

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
      loadScheduledNotifications();
      initializedRef.current = true;
    }
  }, [loadScheduledNotifications]);

  const requestPermission = async () => {
    if (!isSupported) return;

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      await registerServiceWorker();
    }
  };

  const sendEndpoint = async (params: { payload: any; pEndpoint: string }) => {
    const { payload, pEndpoint } = params;
    const response = await axiosInstance.post(pEndpoint, payload);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: sendEndpoint,
    onSuccess: (data) => {
      console.log('Success:', data);
    },
    onError: (error) => {
      console.error('Error:', error);
      if (error instanceof AxiosError) {
        console.log(error.response?.data?.message || error.message, 'error');
      } else {
        console.log('An unexpected error occurred', 'error');
      }
    },
  });

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
      mutation.mutate({
        payload: subscription,
        pEndpoint: `${HOST_API}${endpoints.notification.subscribe}`,
      });
    } catch (error) {
      console.error('Error registrando Service Worker:', error);
    }
  };

  const handleFormChange =
    (field: keyof NotificationFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    };

  const scheduleNotification = async () => {
    const { title, body, date, time } = formData;

    if (!title || !body || !date || !time) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const scheduledTime = new Date(`${date}T${time}`);
    if (isBefore(scheduledTime, new Date())) {
      alert('Por favor, selecciona una fecha y hora futuras');
      return;
    }

    const schedule = {
      title,
      body,
      scheduledTime: scheduledTime.toISOString(),
    };

    mutation.mutate({
      payload: schedule,
      pEndpoint: `${HOST_API}${endpoints.notification.schedule}`,
    });
  };

  const deleteScheduledNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadScheduledNotifications();
      } else {
        alert('Error al eliminar la notificación');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Error al eliminar la notificación');
    }
  };

  const getApplicationServerKey = (base64String: string): ArrayBuffer => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    // Versión corregida sin el operador ++
    for (let i = 0; i < rawData.length; i += 1) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray.buffer;
  };

  if (!isSupported) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Tu navegador no soporta notificaciones push. Por favor, actualiza a un
        navegador más moderno.
      </Alert>
    );
  }

  console.log(scheduledNotifications, 'scheduledNotifications');

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
        <>
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

              <Box
                component="form"
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <TextField
                  label="Título"
                  value={formData.title}
                  onChange={handleFormChange('title')}
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Mensaje"
                  value={formData.body}
                  onChange={handleFormChange('body')}
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                />

                <Box
                  display="flex"
                  gap={2}
                  flexDirection={{ xs: 'column', sm: 'row' }}
                >
                  <TextField
                    label="Fecha"
                    type="date"
                    value={formData.date}
                    onChange={handleFormChange('date')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="outlined"
                  />

                  <TextField
                    label="Hora"
                    type="time"
                    value={formData.time}
                    onChange={handleFormChange('time')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="outlined"
                  />
                </Box>

                <Button
                  variant="contained"
                  onClick={scheduleNotification}
                  disabled={
                    !formData.title ||
                    !formData.body ||
                    !formData.date ||
                    !formData.time
                  }
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Programar Notificación
                </Button>
              </Box>
            </CardContent>
          </Card>

          {scheduledNotifications.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Notificaciones Programadas
                </Typography>

                <List>
                  {scheduledNotifications.map((notification, index) => (
                    <ListItem
                      key={index + notification.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() =>
                            deleteScheduledNotification(notification.id)
                          }
                        >
                          <Iconify width={24} icon="eva:smiling-face-fill" />
                        </IconButton>
                      }
                      divider
                    >
                      <ListItemText
                        primary={notification.title}
                        secondary={
                          <Box component="span">
                            <Box component="span" display="block">
                              {notification.body}
                            </Box>
                            <Box component="span" display="block" mt={0.5}>
                              <Chip
                                label={format(
                                  new Date(notification.scheduledFor),
                                  'PPpp'
                                )}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

export default PushNotificationManager;
