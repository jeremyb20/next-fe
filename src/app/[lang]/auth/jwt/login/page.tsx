import { JwtLoginView } from '@/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Login to your account',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
