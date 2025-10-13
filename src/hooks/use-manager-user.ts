import { _mock } from 'src/_mock';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useManagerUser } from 'src/hooks/use-mocked-user';
// const { user } = useManagerUser();

// TO:
import { useAuthContext } from 'src/auth/hooks';

import {
  getUserRoleFromState,
  getUserStatusFromState,
} from '../utils/constants';

// ----------------------------------------------------------------------

export function useManagerUser() {
  const { user: authUser } = useAuthContext();
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Jeremy Bacca',
    email: authUser?.email,
    password: 'demo1234',
    photoURL: _mock.image.avatar(24),
    phoneNumber: authUser?.phone,
    country: authUser?.country,
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about:
      'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: getUserRoleFromState(authUser?.role), // admin | user | groomer | veterinarian
    isActive: getUserStatusFromState(authUser?.user), // active | inactive
    isPublic: false,
  };

  return { user };
}
