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

      if (scheduledTime <= new Date()) {
        setMessage({
          type: 'error',
          text: 'Please select a future date and time',
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
