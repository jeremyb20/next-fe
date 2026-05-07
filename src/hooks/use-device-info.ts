// src/hooks/use-device-info-simple.ts
import { useMemo } from 'react';



export function useDeviceInfo() {
  const deviceInfo = useMemo(() => {
    const { userAgent } = navigator;
    let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';

    // Detectar tipo de dispositivo
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      if (/iPad|Android(?!.*Mobile)/i.test(userAgent)) {
        deviceType = 'tablet';
      } else {
        deviceType = 'mobile';
      }
    }

    // Obtener nombre del dispositivo
    let name = 'Unknown Device';
    if (deviceType === 'mobile') {
      if (/iPhone/i.test(userAgent)) name = 'iPhone';
      else if (/Android/i.test(userAgent)) name = 'Android Phone';
      else if (/iPod/i.test(userAgent)) name = 'iPod';
      else name = 'Mobile Device';
    } else if (deviceType === 'tablet') {
      if (/iPad/i.test(userAgent)) name = 'iPad';
      else if (/Android/i.test(userAgent)) name = 'Android Tablet';
      else name = 'Tablet';
    } else if (/Mac/i.test(userAgent)) {
      name = 'Mac';
    } else if (/Windows/i.test(userAgent)) {
      name = 'Windows PC';
    } else if (/Linux/i.test(userAgent)) {
      name = 'Linux PC';
    } else {
      name = 'Desktop';
    }

    // Ubicación (por defecto desconocida, se puede actualizar después con geolocalización)
    const location = 'Unknown location';

    return {
      name,
      deviceType,
      location,
      userAgent
    };
  }, []);

  return deviceInfo;
}

export default useDeviceInfo;