import axios from 'axios';
import { useState, useEffect } from 'react';

export interface IPInfoResponse {
  ip: string;
  country: string;
  country_code: string;
}

const useIPInfo = () => {
  const [ipData, setIPData] = useState<IPInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchIPInfo = async () => {
      const services = [
        {
          url: 'https://ipapi.co/json/',
          parser: (data: any) => ({
            ip: data.ip,
            country: data.country_name || data.country,
            country_code: data.country_code || data.country,
          }),
        },
        {
          url: 'https://api.ipify.org?format=json',
          parser: (data: any) => ({
            ip: data.ip,
            country: 'Desconocido',
            country_code: 'XX',
          }),
        },
      ];

      const tryServices = async () => {
        const results = await Promise.allSettled(
          services.map((service) =>
            axios.get(service.url).then((response) => ({
              data: service.parser(response.data),
              success: true,
            }))
          )
        );

        if (!mounted) return;

        const successfulResult = results.find(
          (result) => result.status === 'fulfilled'
        );

        if (successfulResult && successfulResult.status === 'fulfilled') {
          setIPData(successfulResult.value.data);
          setLoading(false);
        } else {
          setError('Could not retrieve IP information from any service');
          setLoading(false);
        }
      };

      tryServices();
    };

    fetchIPInfo();

    return () => {
      mounted = false;
    };
  }, []);

  return { ipData, loading, error };
};

export default useIPInfo;
