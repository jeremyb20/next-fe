'use client';

import isEqual from 'lodash/isEqual';
import { endpoints } from '@/src/utils/axios';
import { HOST_API } from '@/src/config-global';
import { useAuthContext } from '@/src/auth/hooks';
import { useGetUserSettings } from '@/src/hooks/use-fetch';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { localStorageGetItem } from 'src/utils/storage-available';

import { SettingsValueProps } from '../types';
import { SettingsContext } from './settings-context';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'settings';

type SettingsProviderProps = {
  children: React.ReactNode;
  defaultSettings: SettingsValueProps;
};

export function SettingsProvider({
  children,
  defaultSettings,
}: SettingsProviderProps) {
  const { state, update, reset } = useLocalStorage(
    STORAGE_KEY,
    defaultSettings
  );

  const { mutateAsync } = useCreateGenericMutation();

  // Ref para mantener el estado más reciente
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { authenticated } = useAuthContext();

  // Usar el custom hook para obtener configuraciones
  const {
    data: userSettingsData,
    isFetching: isFetchingSettings,
    isError: isErrorSettings,
    error: errorSettings,
    refetch: refetchSettings,
  } = useGetUserSettings();

  const isArabic = localStorageGetItem('i18next') === 'ar';

  useEffect(() => {
    if (isArabic) {
      onChangeDirectionByLang('ar');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArabic]);

  // Cargar configuraciones cuando se obtengan datos del hook
  useEffect(() => {
    if (userSettingsData) {
      if (userSettingsData?.theme) {
        const themeData = userSettingsData.theme;

        // Array de campos a sincronizar
        const themeFields = [
          'themeMode',
          'themeContrast',
          'themeDirection',
          'themeLayout',
          'themeStretch',
          'themeColorPresets',
          'fontSizeScale',
        ] as const;

        themeFields.forEach((field) => {
          const serverValue = themeData[field];
          if (serverValue !== undefined && serverValue !== null) {
            const localField = field as keyof SettingsValueProps;

            // Solo actualizar si es diferente
            if (stateRef.current[localField] !== serverValue) {
              console.log(`Applying theme ${field}: ${serverValue}`);
              update(localField, serverValue);
            }
          }
        });
      }
    }
  }, [userSettingsData, update]);

  // Función para guardar configuraciones en el servidor
  const saveSettingsToServer = useCallback(async () => {
    if (!authenticated) return;

    setIsSaving(true);

    try {
      const currentState = stateRef.current;

      // Estructura que coincide con la respuesta del backend
      const updateData = {
        theme: {
          fontSizeScale: currentState.fontSizeScale || 1,
          themeColorPresets: currentState.themeColorPresets,
          themeContrast: currentState.themeContrast,
          themeDirection: currentState.themeDirection,
          themeLayout: currentState.themeLayout,
          themeMode: currentState.themeMode,
          themeStretch: currentState.themeStretch,
        },
      };

      const endpoint = `${HOST_API}${endpoints.user.updateSettings}`;
      const method = 'PUT';

      await mutateAsync({
        payload: updateData,
        pEndpoint: endpoint,
        method,
      });

      // Actualizar la hora del último guardado
      setLastSaved(new Date());

      // Invalidar y refetch para obtener datos actualizados
      refetchSettings();
    } catch (error) {
      console.error('Error saving settings via mutation:', error);
    } finally {
      setIsSaving(false);
    }
  }, [authenticated, mutateAsync, refetchSettings]);
  // Wrapper para update que también guarda en el servidor
  const updateWithSave = useCallback(
    <K extends keyof SettingsValueProps>(
      key: K,
      value: SettingsValueProps[K]
    ) => {
      console.log(
        `Updating setting ${key} from ${stateRef.current[key]} to ${value}`
      );

      // Actualizar localmente primero
      update(key, value);

      // Cancelar timeout anterior si existe
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      // Configurar nuevo timeout para guardar automáticamente
      if (authenticated) {
        console.log('Setting auto-save timeout for 1.5 seconds');
        saveTimeoutRef.current = setTimeout(() => {
          console.log('Auto-saving triggered for setting:', key);
          saveSettingsToServer();
        }, 1500);
      }
    },
    [update, saveSettingsToServer, authenticated]
  );

  // Guardar manualmente
  const onSaveSettings = useCallback(async () => {
    if (authenticated) {
      console.log('Manual save triggered with state:', stateRef.current);
      await saveSettingsToServer();
    }
  }, [authenticated, saveSettingsToServer]);

  // Direction by lang
  const onChangeDirectionByLang = useCallback(
    (lang: string) => {
      updateWithSave('themeDirection', lang === 'ar' ? 'rtl' : 'ltr');
    },
    [updateWithSave]
  );

  // Drawer
  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const canReset = !isEqual(state, defaultSettings);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      onUpdate: updateWithSave,
      onSaveSettings,
      isSaving,
      lastSaved,
      isFetchingSettings,
      isErrorSettings,
      errorSettings,
      onChangeDirectionByLang,
      canReset,
      onReset: reset,
      open: openDrawer,
      onToggle: onToggleDrawer,
      onClose: onCloseDrawer,
    }),
    [
      reset,
      updateWithSave,
      onSaveSettings,
      state,
      canReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      onChangeDirectionByLang,
      isSaving,
      lastSaved,
      isFetchingSettings,
      isErrorSettings,
      errorSettings,
    ]
  );

  // Limpiar timeout al desmontar
  useEffect(
    () => () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    },
    []
  );

  return (
    <SettingsContext.Provider value={memoizedValue}>
      {children}
    </SettingsContext.Provider>
  );
}
