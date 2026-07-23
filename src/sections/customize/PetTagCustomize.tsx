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
} from '@mui/material';

import { mockTags } from '@/utils/pet-tag-utils';

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
  const [filteredTags] = useState<TagOption[]>(mockTags);

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
      x: 50, // Cambiado de 0.5 a 50 (porcentaje)
      y: 45, // Cambiado de 0.5 a 45 (porcentaje)
    },
    phonePosition: {
      x: 50, // Cambiado de 0.5 a 50 (porcentaje)
      y: 65, // Cambiado de 0.7 a 65 (porcentaje)
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

    // {
    //   label: 'Fondos disponibles',
    //   description: 'Explora los fondos para plaquitas disponibles',
    // },
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

  // const handleSelectTag = (tag: TagOption) => {
  //   setSelectedTag(tag);
  //   handleNext();
  // };

  // const handleCustomize = () => {
  //   // Si no hay tag seleccionado, crear uno nuevo
  //   if (!selectedTag) {
  //     setSelectedTag({
  //       id: 'custom',
  //       shape: filters.shape || 'circle',
  //       material: filters.material || 'resin',
  //       background: '/images/default-background.jpg',
  //       name: personalization.name || 'Mi mascota',
  //       phone: personalization.phone || '',
  //       imageUrl: '',
  //       isCustomizable: true,
  //     });
  //   }
  //   handleNext();
  // };

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
      // case 3:
      //   return (
      //     <Box>
      //       <Box sx={{ mt: 2 }}>
      //         <Button onClick={handleBack}>Atrás</Button>
      //       </Box>
      //       <TagGallery
      //         filters={filters}
      //         tags={filteredTags}
      //         onSelectTag={handleSelectTag}
      //         onCustomize={handleCustomize}
      //         personalization={personalization}
      //         onPersonalizationChange={setPersonalization}
      //       />
      //     </Box>
      //   );
      case 3:
        return (
          <StepPersonalize
            filters={filters}
            onFilterChange={handleFilterChange}
            tag={selectedTag}
            personalization={personalization}
            onPersonalizationChange={setPersonalization}
            onComplete={(value) => {
              setErrorMsg('');
              console.log('Proceso completado', value);
            }}
            onBack={handleBack}
            onSelectBackground={(bg) =>
              setSelectedTag((prev) =>
                prev ? { ...prev, background: bg } : prev
              )
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
    </Box>
  );
}
