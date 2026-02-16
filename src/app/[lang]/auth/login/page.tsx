import { JwtLoginView } from '@/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Login Page',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
