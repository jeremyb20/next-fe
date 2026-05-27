// utils/format-time.ts
import { es, enUS, ar, vi, zhCN, fr } from 'date-fns/locale';
import { format, getTime, formatDistanceToNow, Locale } from 'date-fns';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;
type SupportedLng = 'es' | 'en' | 'vi' | 'fr' | 'zh' | 'ar';

// Variable global para almacenar el idioma actual
let currentLocale: SupportedLng = 'es';

// Mapeo de idiomas a locales de date-fns
const getDateFnsLocale = (lng: SupportedLng = 'es'): Locale => {
  const locales: Record<SupportedLng, Locale> = {
    es: es,
    en: enUS,
    vi: vi,
    ar: ar,
    zh: zhCN,
    fr: fr,
  };
  return locales[lng] || es;
};

// Función para actualizar el idioma global (llamar desde el hook de traducción)
export const setDateTimeLocale = (lng: SupportedLng) => {
  currentLocale = lng;
};

// Función para obtener el idioma actual
export const getDateTimeLocale = (): SupportedLng => {
  return currentLocale;
};

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'p';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

// Función fToNow modificada para usar el locale global
export function fToNow(date: InputValue) {
  if (!date) return '';

  const locale = getDateFnsLocale(currentLocale);

  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale,
  });
}

// Mantenemos tu versión refactorizada como alternativa (sin cambios)
export function fToNowRefactor(date: InputValue) {
  if (!date) return '';

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y`;
}

// Resto de las funciones sin cambios...
export function isBetween(
  inputDate: Date | string | number,
  startDate: Date,
  endDate: Date
) {
  const date = new Date(inputDate);

  const results =
    new Date(date.toDateString()) >= new Date(startDate.toDateString()) &&
    new Date(date.toDateString()) <= new Date(endDate.toDateString());

  return results;
}

export function isAfter(startDate: Date | null, endDate: Date | null) {
  const results =
    startDate && endDate
      ? new Date(startDate).getTime() > new Date(endDate).getTime()
      : false;

  return results;
}

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export function getNextBirthday(birthDate: string | Date) {
  const today = new Date();
  const birth = new Date(birthDate);

  let nextBirthday = new Date(
    today.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  );

  if (nextBirthday < today) {
    nextBirthday = new Date(
      today.getFullYear() + 1,
      birth.getMonth(),
      birth.getDate()
    );
  }

  return nextBirthday;
}

export function getDaysUntilNextBirthday(birthDate: string | Date) {
  const nextBirthday = getNextBirthday(birthDate);
  const today = new Date();

  const diffTime = nextBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function getAge(birthDate: string | Date) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
}

export function formatDateSpanish(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
