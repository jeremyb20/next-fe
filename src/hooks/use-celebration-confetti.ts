// hooks/useCelebrationConfetti.ts
import { useCallback } from 'react';
import confetti, { Options } from 'canvas-confetti';

interface CelebrationOptions {
  type?: 'success' | 'celebration' | 'fireworks' | 'custom';
  customOptions?: Partial<Options>;
}

const useCelebrationConfetti = () => {
  const fireSuccessConfetti = useCallback((options: Partial<Options> = {}) => {
    const successOptions: Partial<Options> = {
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'],
      ...options,
    };

    confetti(successOptions);
  }, []);

  const fireCelebrationConfetti = useCallback(
    (options: Partial<Options> = {}) => {
      const celebrationOptions: Partial<Options> = {
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD166'],
        ...options,
      };

      // Disparo central
      confetti(celebrationOptions);

      // Disparos laterales
      setTimeout(() => {
        confetti({
          ...celebrationOptions,
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
        });

        confetti({
          ...celebrationOptions,
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
        });
      }, 100);
    },
    []
  );

  const fireFireworksConfetti = useCallback(
    (options: Partial<Options> = {}) => {
      const fireworksOptions: Partial<Options> = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff'],
        ...options,
      };

      // Múltiples disparos para efecto de fuegos artificiales
      const durations = [0, 200, 400];

      durations.forEach((duration) => {
        setTimeout(() => {
          confetti({
            ...fireworksOptions,
            particleCount: 50,
            spread: 100,
            decay: 0.91,
            scalar: 0.8,
          });
        }, duration);
      });
    },
    []
  );

  const celebrate = useCallback(
    (options: CelebrationOptions = {}) => {
      const { type = 'success', customOptions } = options;

      switch (type) {
        case 'success':
          fireSuccessConfetti(customOptions);
          break;
        case 'celebration':
          fireCelebrationConfetti(customOptions);
          break;
        case 'fireworks':
          fireFireworksConfetti(customOptions);
          break;
        case 'custom':
          if (customOptions) {
            confetti(customOptions);
          }
          break;
        default:
          fireSuccessConfetti();
      }
    },
    [fireSuccessConfetti, fireCelebrationConfetti, fireFireworksConfetti]
  );

  return {
    celebrate,
    fireSuccessConfetti,
    fireCelebrationConfetti,
    fireFireworksConfetti,
  };
};

export default useCelebrationConfetti;
