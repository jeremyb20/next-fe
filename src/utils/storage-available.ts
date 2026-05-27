// utils/storage.ts

// Verificar si estamos en el cliente (navegador)
const isClient = typeof window !== 'undefined';

// ----------------------------------------------------------------------

export function localStorageAvailable() {
  if (!isClient) return false;

  try {
    const key = '__some_random_key_you_are_not_going_to_use__';
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function localStorageGetItem(key: string, defaultValue = '') {
  if (!isClient) return defaultValue;

  const storageAvailable = localStorageAvailable();
  let value = defaultValue;

  if (storageAvailable) {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      value = storedValue;
    }
  }

  return value;
}

export function localStorageSetItem(key: string, value: string) {
  if (!isClient) return;

  const storageAvailable = localStorageAvailable();

  if (storageAvailable) {
    localStorage.setItem(key, value);
  }
}

// Función adicional útil
export function localStorageRemoveItem(key: string) {
  if (!isClient) return;

  const storageAvailable = localStorageAvailable();

  if (storageAvailable) {
    localStorage.removeItem(key);
  }
}

// Para valores JSON
export function localStorageGetJSON<T>(
  key: string,
  defaultValue: T | null = null
): T | null {
  if (!isClient) return defaultValue;

  const value = localStorageGetItem(key);
  if (value) {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error parsing JSON for key "${key}":`, error);
      return defaultValue;
    }
  }
  return defaultValue;
}

export function localStorageSetJSON<T>(key: string, value: T): void {
  if (!isClient) return;

  try {
    localStorageSetItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error stringifying JSON for key "${key}":`, error);
  }
}
