import axios from 'axios';
import { useState, useEffect } from 'react';

export interface IPInfoResponse {
  ip: string;
  country: string;
  country_code: string;
}

// Hook to get IP information using ipwho.is service
const useIPInfo = () => {
  const [ipData, setIPData] = useState<IPInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchIPInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usar solo ipwho.is que funciona con CORS
        const response = await axios.get('https://ipwho.is/');

        if (!mounted) return;

        if (response.data?.ip && response.data?.country_code) {
          setIPData({
            ip: response.data.ip,
            country: response.data.country,
            country_code: response.data.country_code,
          });
        } else {
          throw new Error('No IP data received from ipwho.is');
        }
      } catch (err) {
        if (!mounted) return;
        setError('Could not retrieve IP information');
        console.error('IP info error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchIPInfo();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once

  return { ipData, loading, error };
};

export default useIPInfo;
