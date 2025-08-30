import { _mock } from 'src/_mock';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function useMockedUser() {
  const { user: authUser } = useAuthContext();
  const test = authUser;
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Jeremy Bacca',
    email: test?.email,
    password: 'demo1234',
    photoURL: _mock.image.avatar(24),
    phoneNumber: test?.phone,
    country: test?.country,
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about:
      'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
