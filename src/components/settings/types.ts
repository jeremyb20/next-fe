// ----------------------------------------------------------------------

export type SettingsValueProps = {
  themeStretch: boolean;
  themeMode: 'light' | 'dark';
  themeDirection: 'rtl' | 'ltr';
  themeContrast: 'default' | 'bold';
  themeLayout: 'vertical' | 'horizontal' | 'mini';
  themeColorPresets: 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red';
  fontSizeScale: number; // Nuevo: factor de escala de tipografía
};

export const defaultSettings: SettingsValueProps = {
  themeMode: 'dark', // 'light' | 'dark'
  themeDirection: 'ltr', //  'rtl' | 'ltr'
  themeContrast: 'default', // 'default' | 'bold'
  themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
  themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
  themeStretch: false,
  fontSizeScale: 1,
};

export type SettingsContextProps = SettingsValueProps & {
  // Update
  onUpdate: (name: string, value: string | boolean | number) => void;
  // Direction by lang
  onChangeDirectionByLang: (lang: string) => void;
  // Reset
  canReset: boolean;
  onReset: VoidFunction;
  // Drawer
  open: boolean;
  onToggle: VoidFunction;
  onClose: VoidFunction;
};
