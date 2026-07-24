// src/components/catalog/PetTagCatalog.tsx
'use client';

import { m, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';

import { endpoints } from '@/utils/axios';
import { HOST_API } from '@/config-global';
import { useSnackbar } from '@/components/snackbar';
import { useCreateGenericMutation } from '@/hooks/user-generic-mutation';

// import TagGallery from './TagGallery';
import StepShape from './steps/StepShape';
import StepMaterial from './steps/StepMaterial';
import StepPersonalize from './steps/StepPersonalize';
import {
  TagFilters,
  TagOption,
  PersonalizationData,
} from '../../types/pet-tag.types';

export default function PetTagCustomize() {
  const [activeStep, setActiveStep] = useState(0);
  const [filters, setFilters] = useState<TagFilters>({
    petType: '',
    size: '',
    material: '',
    shape: 'bone',
  });
  const [backgroundFiles, setBackgroundFiles] = useState<{
    front?: File;
    back?: File;
  }>({});
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [completedValue, setCompletedValue] = useState<any>(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactNote, setContactNote] = useState('');
  const { mutateAsync } = useCreateGenericMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [personalization, setPersonalization] = useState<PersonalizationData>({
    name: 'Tobby',
    phone: '',
    fontSize: 36,
    fontColor: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 3,
    strokePosition: 'outside',
    fontFamily: 'Comic Sans MS',
    moldScale: 1.45,
    namePosition: {
      x: 50,
      y: 45,
    },
    phonePosition: {
      x: 50,
      y: 65,
    },
  });

  const [selectedTag, setSelectedTag] = useState<TagOption | null>({
    id: 'custom',
    shape: filters.shape || 'circle',
    material: filters.material || 'resin',
    background: '/assets/images/customize/shapes/bg-1.png',
    name: personalization.name || 'Tobby',
    phone: personalization.phone || '8888-8888',
    imageUrl: '',
    isCustomizable: true,
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () =>
    topRef.current?.scrollIntoView({ behavior: 'smooth' });

  const steps = [
    {
      label: 'Material',
      description: 'Elige el material de la plaquita',
    },
    {
      label: 'Forma',
      description: 'Selecciona la forma de la plaquita',
    },
    {
      label: 'Tipo y Tamaño',
      description: 'Selecciona el tipo y tamaño de tu mascota',
    },
    {
      label: 'Personalización',
      description: 'Personaliza tu plaquita',
    },
  ];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
    scrollToTop();
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    scrollToTop();
  };

  const handleFilterChange = (newFilters: Partial<TagFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleComplete = (value: any) => {
    setErrorMsg('');
    setCompletedValue(value);
    setContactModalOpen(true);
  };

  const handleContactSubmit = async () => {
    try {
      const { front, back } = backgroundFiles;
      setIsLoading(true);

      const frontP = personalization;
      const backP = personalization.backPersonalization;

      const payload: Record<string, any> = {
        shape: filters.shape,
        material: filters.material || '',
        size: filters.size || '',
        petType: filters.petType || '',
        contactName,
        contactPhone,
        contactNote,
        front: JSON.stringify({
          background: selectedTag?.background || '',
          personalization: {
            name: frontP.name,
            phone: frontP.phone || '',
            fontSize: frontP.fontSize ?? 36,
            nameFontSize: frontP.nameFontSize ?? 36,
            phoneFontSize: frontP.phoneFontSize ?? 24,
            fontColor: frontP.fontColor || '#ffffff',
            strokeColor: frontP.strokeColor || '#000000',
            strokeWidth: frontP.strokeWidth ?? 3,
            strokePosition: frontP.strokePosition || 'outside',
            fontFamily: frontP.fontFamily || 'Comic Sans MS',
            moldScale: frontP.moldScale ?? 1.45,
            doubleSided: frontP.doubleSided ?? false,
            namePosition: frontP.namePosition ?? { x: 50, y: 45 },
            phonePosition: frontP.phonePosition ?? { x: 50, y: 65 },
          },
        }),
      };

      if (front) payload['frontImage'] = front;

      if (frontP.doubleSided) {
        payload.back = JSON.stringify({
          background: frontP.backBackground || '',
          personalization: {
            name: backP?.name || frontP.name,
            phone: backP?.phone || frontP.phone || '',
            fontSize: backP?.fontSize ?? frontP.fontSize ?? 36,
            nameFontSize: backP?.nameFontSize ?? frontP.nameFontSize,
            phoneFontSize: backP?.phoneFontSize ?? frontP.phoneFontSize,
            fontColor: backP?.fontColor || frontP.fontColor || '#ffffff',
            strokeColor: backP?.strokeColor || frontP.strokeColor || '#000000',
            strokeWidth: backP?.strokeWidth ?? frontP.strokeWidth ?? 3,
            strokePosition:
              backP?.strokePosition || frontP.strokePosition || 'outside',
            fontFamily:
              backP?.fontFamily || frontP.fontFamily || 'Comic Sans MS',
            moldScale: backP?.moldScale ?? frontP.moldScale ?? 1.45,
            doubleSided: true,
            namePosition: backP?.namePosition ?? { x: 50, y: 45 },
            phonePosition: backP?.phonePosition ?? { x: 50, y: 65 },
          },
        });
        if (back) payload['backImage'] = back;
      }
      await mutateAsync({
        payload,
        pEndpoint: `${HOST_API}${endpoints.admin.petTags.create}`,
        method: 'POST',
        isFormData: true,
      });
      setContactModalOpen(false);
      setIsLoading(false);
      enqueueSnackbar(
        'Has completado el proceso de selección de tu plaquita personalizada.'
      );
    } catch (error) {
      console.error('Error creating order:', error);
      setIsLoading(false);
      enqueueSnackbar(`Hubo un inconveniente, intentelo mas tarde`, {
        variant: 'error',
        autoHideDuration: 8000,
      });
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <StepMaterial
            filters={filters}
            onFilterChange={handleFilterChange}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <StepShape
            filters={filters}
            onFilterChange={handleFilterChange}
            onNext={handleNext}
            onBack={handleBack}
            isShapeStep
          />
        );
      case 2:
        return (
          <StepShape
            filters={filters}
            onFilterChange={handleFilterChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepPersonalize
            filters={filters}
            onFilterChange={handleFilterChange}
            tag={selectedTag}
            personalization={personalization}
            onPersonalizationChange={setPersonalization}
            onComplete={handleComplete}
            onBack={handleBack}
            onSelectBackground={(bg) =>
              setSelectedTag((prev) =>
                prev ? { ...prev, background: bg } : prev
              )
            }
            onSelectBackgroundFile={(file, side) =>
              setBackgroundFiles((prev) => ({ ...prev, [side]: file }))
            }
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Box ref={topRef} sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 0, sm: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        🐾 Personaliza tu plaquita
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        align="center"
        sx={{ mb: 4 }}
      >
        Diseña la plaquita perfecta para tu compañero peludo
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: { xs: 1, sm: 3 } }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {step.description}
                </Typography>

                <AnimatePresence mode="wait">
                  <m.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent(index)}
                  </m.div>
                </AnimatePresence>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper
            sx={{
              p: 3,
              mt: 3,
              bgcolor: (theme) => theme.palette.success.light,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" gutterBottom>
              🎉 ¡Plaquita seleccionada con éxito!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Has completado el proceso de selección de tu plaquita
              personalizada.
            </Typography>
            <Button variant="contained" color="primary">
              Ver mi plaquita
            </Button>
          </Paper>
        )}
      </Paper>

      <Dialog
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Datos de contacto</DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Una vez enviado el formulario, nos pondremos en contacto contigo
            para coordinar la entrega.
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Nombre de la persona a contactar"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Teléfono de WhatsApp"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              fullWidth
              required
              placeholder="8888-8888"
            />
            <TextField
              label="Nota"
              value={contactNote}
              onChange={(e) => setContactNote(e.target.value)}
              multiline
              rows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactModalOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleContactSubmit}
            disabled={!contactName || !contactPhone || isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
