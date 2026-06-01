import Footer from '../main/footer';
import Header from '../common/header-simple';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function SimpleLayout({ children }: Props) {
  return (
    <>
      <Header /> {/* Si tienes header */}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer /> {/* Si tienes footer */}
    </>
  );
}
