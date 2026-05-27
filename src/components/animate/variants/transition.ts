// src/components/animate/transition.ts
import { Transition } from 'motion/react';

import { TranExitType, TranHoverType, TranEnterType } from '../types';

// ----------------------------------------------------------------------

export const varTranHover = (props?: TranHoverType): Transition => {
  const duration = props?.duration || 0.32;
  const ease = props?.ease || [0.43, 0.13, 0.23, 0.96 as any];

  return { duration, ease } as Transition;
};

export const varTranEnter = (props?: TranEnterType) => {
  const duration = props?.durationIn || 0.64;
  const ease = props?.easeIn || ([0.43, 0.13, 0.23, 0.96] as any); // ✅ Agregar 'as const'

  return { duration, ease };
};

export const varTranExit = (props?: TranExitType): Transition => {
  const duration = props?.durationOut || 0.48;
  const ease = props?.easeOut || [0.43, 0.13, 0.23, 0.96 as any];

  return { duration, ease } as Transition;
};
