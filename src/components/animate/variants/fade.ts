// fade.ts
import { VariantsType } from '../types';
import { varTranExit, varTranEnter } from './transition';

// ----------------------------------------------------------------------

export const varFade = (props?: VariantsType): Record<string, any> => {
  // ✅ Cambiado a Record<string, any>
  const distance = props?.distance || 120;
  const durationIn = props?.durationIn;
  const durationOut = props?.durationOut;
  const easeIn = props?.easeIn;
  const easeOut = props?.easeOut;

  return {
    in: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: varTranEnter(),
      },
      exit: {
        opacity: 0,
        transition: varTranExit(),
      },
    },
    inUp: {
      initial: { y: distance, opacity: 0 },
      animate: {
        y: 0,
        opacity: 1,
        transition: varTranEnter({ durationIn, easeIn }),
      },
      exit: {
        y: distance,
        opacity: 0,
        transition: varTranExit({ durationOut, easeOut }),
      },
    },
    // ... resto de variantes
  };
};
