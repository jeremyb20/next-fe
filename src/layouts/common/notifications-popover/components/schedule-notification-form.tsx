// schedule-notification-form.tsx
import { useState } from 'react';
import { endpoints } from '@/src/utils/axios';
import { NotificationData, NotificationFormData } from '@/src/types/api';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';

import {
  Box,
  Alert,
  Stack,
  Button,
  TextField,
  Typography,
} from '@mui/material';

import { HOST_API } from 'src/config-global';

interface ScheduleNotificationFormProps {
  onNotificationScheduled: () => void;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationData[]>>;
}

const ScheduleNotificationForm = ({
  onNotificationScheduled,
  setNotifications,
}: ScheduleNotificationFormProps) => {
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    body: '',
    date: '',
    time: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    text: string;
  }>({ type: 'info', text: '' });
  const { mutateAsync } = useCreateGenericMutation();

  const handleFormChange =
    (field: keyof NotificationFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: 'info', text: '' });

    try {
      const scheduledTime = new Date(`${formData.date}T${formData.time}`);
      const now = new Date();

      // Validación: si la fecha/hora seleccionada es anterior al momento actual
      if (scheduledTime <= now) {
        setMessage({
          type: 'error',
          text: 'Please select a date and time in the future',
        });
        setIsSubmitting(false);
        return;
      }

      const schedule = {
        title: formData.title,
        body: formData.body,
        scheduledTime: scheduledTime.toISOString(),
        type: 'schedule',
        date: '',
        time: '',
      };

      await mutateAsync<NotificationFormData>({
        payload: schedule,
        pEndpoint: `${HOST_API}${endpoints.notification.schedule}`,
        method: 'POST',
      })
        .then((data) => {
          console.log('Éxito:', data);
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            data.payload as NotificationData,
          ]);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      setMessage({
        type: 'success',
        text: 'Notification scheduled successfully',
      });

      // Reset form
      setFormData({
        title: '',
        body: '',
        date: '',
        time: '',
      });

      // Notificar al componente padre para actualizar la lista
      // if (onNotificationScheduled) {
      //   onNotificationScheduled();
      // }
    } catch (error) {
      console.error('Error scheduling notification:', error);
      setMessage({
        type: 'error',
        text: 'Failed to schedule notification. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para obtener la fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Función para obtener la hora mínima si la fecha seleccionada es hoy
  const getMinTime = () => {
    if (formData.date === getMinDate()) {
      const now = new Date();
      // Agregar 1 minuto al tiempo actual para evitar segundos/milisegundos de diferencia
      const nextMinute = new Date(now.getTime() + 60000);
      return nextMinute.toTimeString().slice(0, 5); // Formato HH:mm
    }
    return undefined;
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Schedule New Notification
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          label="Title"
          value={formData.title}
          onChange={handleFormChange('title')}
          fullWidth
          required
          variant="outlined"
        />

        <TextField
          label="Message"
          value={formData.body}
          onChange={handleFormChange('body')}
          multiline
          rows={3}
          fullWidth
          required
          variant="outlined"
        />

        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
          <TextField
            label="Date"
            type="date"
            value={formData.date}
            onChange={handleFormChange('date')}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: getMinDate() }} // Establecer fecha mínima como hoy
            fullWidth
            required
            variant="outlined"
          />

          <TextField
            label="Time"
            type="time"
            value={formData.time}
            onChange={handleFormChange('time')}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: getMinTime(), // Si la fecha es hoy, establecer hora mínima
            }}
            fullWidth
            required
            variant="outlined"
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={
            isSubmitting ||
            !formData.title ||
            !formData.body ||
            !formData.date ||
            !formData.time
          }
          sx={{ alignSelf: 'flex-start' }}
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Notification'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ScheduleNotificationForm;
