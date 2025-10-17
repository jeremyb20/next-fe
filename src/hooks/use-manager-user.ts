// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useManagerUser } from 'src/hooks/use-mocked-user';
// const { user } = useManagerUser();

// TO:
import { useAuthContext } from 'src/auth/hooks';

import { LOGO } from '../config-global';
import { useResponsive } from './use-responsive';
import {
  getUserRoleFromState,
  getUserStatusFromState,
} from '../utils/constants';

// ----------------------------------------------------------------------

export function useManagerUser() {
  const { user: authUser } = useAuthContext();
  const isMobile = useResponsive('down', 'sm');
  const user = {
    id: authUser?._id,
    displayName: 'Jeremy Bacca',
    email: authUser?.email,
    password: 'demo1234',
    photoURL: LOGO,
    coverUrl: `https://picsum.photos/seed/picsum/${isMobile ? '300' : '1800'}/${
      isMobile ? '300' : '500'
    }`,
    phoneNumber: authUser?.phone,
    country: authUser?.country,
    memberId: authUser?.memberId,
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about:
      'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: getUserRoleFromState(authUser?.role), // admin | user | groomer | veterinarian
    isActive: getUserStatusFromState(authUser?.user), // active | inactive
    isPublic: false,
    updatedAt: authUser?.updatedAt,
    createdAt: authUser?.createdAt,
    isVerified: authUser?.isVerified,
  };

  return { user };
}
