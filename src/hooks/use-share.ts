import { DOMAIN } from '@/config-global';
import { IPetProfile } from '@/types/api';
import { useState, useCallback } from 'react';

import { useTranslation } from './use-translation';

interface UseShareOptions {
  petProfile?: IPetProfile | null;
  customUrl?: string;
  customTitle?: string;
  customDescription?: string;
}

interface UseShareReturn {
  open: boolean;
  shareUrl: string;
  shareTitle: string;
  shareDescription: string;
  handleOpen: () => void;
  handleClose: () => void;
}

export function useShare({
  petProfile,
  customUrl,
  customTitle,
  customDescription,
}: UseShareOptions): UseShareReturn {
  const [open, setOpen] = useState(false);
  const { t, lng: currentLang } = useTranslation();

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const shareUrl =
    customUrl || `${DOMAIN}/${currentLang}/pet/${petProfile?.memberPetId}`;
  const shareTitle =
    customTitle ||
    `${t('View the profile of')} ${petProfile?.petName || t('this pet')}`;
  const shareDescription =
    customDescription ||
    `${t('Meet')} ${petProfile?.petName}, ${t(
      'a pet who needs your attention.'
    )}`;

  return {
    open,
    shareUrl,
    shareTitle,
    shareDescription,
    handleOpen,
    handleClose,
  };
}
