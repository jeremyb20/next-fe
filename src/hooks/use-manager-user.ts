// use-manager-user.ts
import { useCallback } from 'react';

import { useAuthContext } from 'src/auth/hooks';

import { LOGO } from '../config-global';
import { useResponsive } from './use-responsive';
import {
  getUserRoleFromState,
  getUserStatusFromState,
} from '../utils/constants';

// ----------------------------------------------------------------------

export function useManagerUser() {
  const { user: authUser, updateUser } = useAuthContext();
  const isMobile = useResponsive('down', 'sm');

  const fullName = authUser?.profile?.name || authUser?.profile?.userName;
  const gender = authUser?.profile?.gender || 'boy';

  const user = {
    id: authUser?._id,
    displayName: fullName,
    email: authUser?.email,
    photoURL:
      authUser?.profile?.photoProfile ||
      `https://avatar.iran.liara.run/public/${gender}?username=${fullName}` ||
      LOGO,
    coverUrl: `https://picsum.photos/seed/picsum/${isMobile ? '300' : '1800'}/${
      isMobile ? '300' : '500'
    }`,
    memberId: authUser?.memberId,
    phoneNumber: authUser?.profile?.phone,
    phone: authUser?.profile?.phone,
    country: authUser?.profile?.country,
    address: authUser?.profile?.address,
    state: authUser?.profile?.state,
    city: authUser?.profile?.city,
    zipCode: authUser?.profile?.zipCode,
    isPublic: authUser?.profile?.isPublic,
    about: authUser?.profile?.about || '',
    role: getUserRoleFromState(authUser?.role),
    isActive: getUserStatusFromState(authUser?.userState),
    updatedAt: authUser?.updatedAt,
    createdAt: authUser?.createdAt,
    isVerified: authUser?.isVerified,
    configuration: authUser?.configuration,
    profile: authUser?.profile,
  };

  // Función específica para actualizar el perfil - CON useCallback
  const updateUserProfile = useCallback(
    (profileData: any) => {
      if (authUser) {
        updateUser({
          ...authUser,
          profile: {
            ...authUser.profile,
            ...profileData,
          },
        });
      }
    },
    [authUser, updateUser]
  );

  // Función para actualizar cualquier dato del usuario
  const updateUserData = useCallback(
    (userData: any) => {
      updateUser(userData);
    },
    [updateUser]
  );

  return {
    user,
    updateUser, // Función general del contexto
    updateUserProfile, // Función específica para perfil
    updateUserData, // Función para cualquier dato
  };
}
