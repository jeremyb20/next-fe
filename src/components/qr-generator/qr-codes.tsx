import { LOGO } from '@/src/config-global';
import { useState, useEffect } from 'react';
import {
  QrcodeStyle,
  QrcodeCanvas,
  QrcodeColorEffect,
  useQrcodeDownload,
} from 'react-qrcode-pretty';

import { Box, Stack } from '@mui/system';
import {
  Grid,
  Card,
  Alert,
  Button,
  Select,
  Slider,
  Switch,
  Divider,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  CardContent,
  FormControlLabel,
} from '@mui/material';

import Iconify from '../iconify';

interface Props {
  value: string;
  fileName: string;
}

// Función para convertir imagen URL a base64
async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Tipos para las variantes
type EyeVariant = 'square' | 'circle' | 'rounded' | 'gravity' | 'jelly';
type BodyVariant = 'square' | 'circle' | 'rounded' | 'fluid' | 'jelly';
type ColorEffect = 'none' | 'gradient' | 'fusion';

export function QrcodeCustom({ value, fileName }: Props) {
  const [setQrcode, download, isReady] = useQrcodeDownload();
  const [base64Logo, setBase64Logo] = useState<string | null>(null);
  const [logoURL, setLogoURL] = useState<string>(LOGO);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados para personalización
  const [qrValue, setQrValue] = useState(value);
  const [size, setSize] = useState(250);
  const [padding, setPadding] = useState(16);
  const [margin, setMargin] = useState(20);
  const [bgColor, setBgColor] = useState('#ddeeff');

  // Colores
  const [eyesColor, setEyesColor] = useState('#223344');
  const [bodyColor, setBodyColor] = useState('#335577');

  // Variantes
  const [eyesVariant, setEyesVariant] = useState<EyeVariant>('gravity');
  const [bodyVariant, setBodyVariant] = useState<BodyVariant>('fluid');

  // Efectos de color
  const [eyesEffect, setEyesEffect] = useState<ColorEffect>('none');
  const [bodyEffect, setBodyEffect] = useState<ColorEffect>('none');

  // Opciones booleanas
  const [bgRounded, setBgRounded] = useState(true);
  const [divider, setDivider] = useState(true);

  // Configuración de imagen
  const [logoSize, setLogoSize] = useState(80);
  const [logoPositionX, setLogoPositionX] = useState(120);
  const [logoPositionY, setLogoPositionY] = useState(125);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const convertImage = async () => {
      try {
        const base64 = await imageUrlToBase64(logoURL);
        setBase64Logo(base64);
        setImageError(false);
      } catch (error) {
        console.error('Failed to convert image to base64:', error);
        setImageError(true);
      } finally {
        setLoading(false);
      }
    };

    convertImage();
  }, [logoURL]);

  const imageConfig =
    showLogo && base64Logo
      ? {
          src: base64Logo,
          height: logoSize,
          width: logoSize,
          positionX: logoPositionX,
          positionY: logoPositionY,
        }
      : undefined;

  const handleDownload = () => {
    try {
      download(fileName);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const resetToDefault = () => {
    setQrValue(value);
    setSize(250);
    setPadding(16);
    setMargin(20);
    setBgColor('#ddeeff');
    setEyesColor('#223344');
    setBodyColor('#335577');
    setEyesVariant('gravity');
    setBodyVariant('fluid');
    setEyesEffect('none');
    setBodyEffect('none');
    setBgRounded(true);
    setDivider(true);
    setLogoSize(80);
    setLogoPositionX(120);
    setLogoPositionY(125);
    setShowLogo(true);
    setLogoURL(LOGO);
  };

  if (loading) {
    return <div>Loading QR code...</div>;
  }

  return (
    <Grid container spacing={3}>
      {/* Panel de controles */}
      <Grid item xs={12} sm={12} md={8}>
        <Grid container spacing={2}>
          {/* Columna 1 - Configuración básica */}
          <Grid item xs={12} sm={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Settings
                </Typography>

                {/* Contenido QR */}
                <TextField
                  fullWidth
                  label="QR Content"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Logo URL"
                  value={logoURL}
                  onChange={(e) => setLogoURL(e.target.value)}
                  margin="normal"
                />

                {/* Tamaños */}
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Sizes
                </Typography>

                <Stack spacing={2}>
                  <div>
                    <Typography gutterBottom>Size: {size}px</Typography>
                    <Slider
                      value={size}
                      onChange={(_, newValue) => setSize(newValue as number)}
                      min={100}
                      max={500}
                      step={10}
                    />
                  </div>

                  <div>
                    <Typography gutterBottom>Padding: {padding}px</Typography>
                    <Slider
                      value={padding}
                      onChange={(_, newValue) => setPadding(newValue as number)}
                      min={0}
                      max={50}
                      step={2}
                    />
                  </div>

                  <div>
                    <Typography gutterBottom>Margin: {margin}px</Typography>
                    <Slider
                      value={margin}
                      onChange={(_, newValue) => setMargin(newValue as number)}
                      min={0}
                      max={50}
                      step={2}
                    />
                  </div>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Colores */}
                <Typography variant="subtitle1" gutterBottom>
                  Colors
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    type="color"
                    label="Background Color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    margin="dense"
                  />
                  <TextField
                    fullWidth
                    type="color"
                    label="Eyes Color"
                    value={eyesColor}
                    onChange={(e) => setEyesColor(e.target.value)}
                    margin="dense"
                  />
                  <TextField
                    fullWidth
                    type="color"
                    label="Body Color"
                    value={bodyColor}
                    onChange={(e) => setBodyColor(e.target.value)}
                    margin="dense"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Columna 2 - Estilos y efectos */}
          <Grid item xs={12} sm={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Style & Effects
                </Typography>

                {/* Variantes */}
                <Typography variant="subtitle1" gutterBottom>
                  Variants
                </Typography>

                <Stack spacing={2}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Eyes Style</InputLabel>
                    <Select
                      value={eyesVariant}
                      label="Eyes Style"
                      onChange={(e) =>
                        setEyesVariant(e.target.value as EyeVariant)
                      }
                    >
                      <MenuItem value="square">Square</MenuItem>
                      <MenuItem value="circle">Circle</MenuItem>
                      <MenuItem value="rounded">Rounded</MenuItem>
                      <MenuItem value="gravity">Gravity</MenuItem>
                      <MenuItem value="jelly">Jelly</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="dense">
                    <InputLabel>Body Style</InputLabel>
                    <Select
                      value={bodyVariant}
                      label="Body Style"
                      onChange={(e) =>
                        setBodyVariant(e.target.value as BodyVariant)
                      }
                    >
                      <MenuItem value="square">Square</MenuItem>
                      <MenuItem value="circle">Circle</MenuItem>
                      <MenuItem value="rounded">Rounded</MenuItem>
                      <MenuItem value="fluid">Fluid</MenuItem>
                      <MenuItem value="jelly">Jelly</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Efectos */}
                <Typography variant="subtitle1" gutterBottom>
                  Color Effects
                </Typography>

                <Stack spacing={2}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Eyes Effect</InputLabel>
                    <Select
                      value={eyesEffect}
                      label="Eyes Effect"
                      onChange={(e) =>
                        setEyesEffect(e.target.value as ColorEffect)
                      }
                    >
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="gradient">Gradient</MenuItem>
                      <MenuItem value="fusion">Fusion</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="dense">
                    <InputLabel>Body Effect</InputLabel>
                    <Select
                      value={bodyEffect}
                      label="Body Effect"
                      onChange={(e) =>
                        setBodyEffect(e.target.value as ColorEffect)
                      }
                    >
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="gradient">Gradient</MenuItem>
                      <MenuItem value="fusion">Fusion</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>

            {/* Configuración del logo */}
            {showLogo && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Logo Settings
                  </Typography>

                  <Stack spacing={2}>
                    <div>
                      <Typography gutterBottom>
                        Logo Size: {logoSize}px
                      </Typography>
                      <Slider
                        value={logoSize}
                        onChange={(_, newValue) =>
                          setLogoSize(newValue as number)
                        }
                        min={20}
                        max={120}
                        step={5}
                      />
                    </div>

                    <div>
                      <Typography gutterBottom>
                        Position X: {logoPositionX}px
                      </Typography>
                      <Slider
                        value={logoPositionX}
                        onChange={(_, newValue) =>
                          setLogoPositionX(newValue as number)
                        }
                        min={0}
                        max={size - logoSize}
                        step={5}
                      />
                    </div>

                    <div>
                      <Typography gutterBottom>
                        Position Y: {logoPositionY}px
                      </Typography>
                      <Slider
                        value={logoPositionY}
                        onChange={(_, newValue) =>
                          setLogoPositionY(newValue as number)
                        }
                        min={0}
                        max={size - logoSize}
                        step={5}
                      />
                    </div>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Vista previa del QR */}
      <Grid item xs={12} sm={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>

            {imageError && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Logo cannot be loaded. Generating QR code without logo.
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <QrcodeCanvas
                value={qrValue}
                variant={{
                  eyes: eyesVariant as QrcodeStyle,
                  body: bodyVariant as QrcodeStyle,
                }}
                color={{
                  eyes: eyesColor,
                  body: bodyColor,
                }}
                colorEffect={{
                  eyes: eyesEffect as QrcodeColorEffect,
                  body: bodyEffect as QrcodeColorEffect,
                }}
                padding={padding}
                margin={margin}
                size={size}
                bgColor={bgColor}
                onReady={setQrcode}
                bgRounded={bgRounded}
                divider={divider}
                image={imageConfig}
              />
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* Opciones */}
            <Typography variant="subtitle1" gutterBottom>
              Options
            </Typography>

            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={bgRounded}
                    onChange={(e) => setBgRounded(e.target.checked)}
                  />
                }
                label="Background Rounded"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={divider}
                    onChange={(e) => setDivider(e.target.checked)}
                  />
                }
                label="Divider"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                  />
                }
                label="Show Logo"
              />
            </Stack>
            <Divider sx={{ my: 2 }} />
            {/* Botones de acción */}
            <Stack spacing={1}>
              <Button
                onClick={handleDownload}
                disabled={!isReady}
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="solar:gallery-download-broken" />}
                fullWidth
              >
                Download QR Code
              </Button>

              <Button
                onClick={resetToDefault}
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Reset to Default
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
