import './fonts.css';
import './globals.css';
import './invitation.css';
const title = 'Vous êtes invités à L’expérience Silky — CARIMO';
const description = 'Atelier découverte de la gamme Silky. Kit découverte offert à chaque salon présent, démonstration et partenariat. Places limitées à 10 salons.';
export const metadata = {
 metadataBase: new URL('https://carimo-silky.vercel.app'),
 title, description,
 alternates: { canonical: '/' },
 openGraph: {
  type: 'website', locale: 'fr_FR', siteName: 'CARIMO EMPIRE',
  url: '/', title, description,
  images: [{ url: '/assets/silky-partage.jpg', width: 440, height: 440, type: 'image/jpeg', alt: 'La gamme capillaire Silky Argan Oil de CARIMO' }]
 },
 twitter: { card: 'summary_large_image', title, description, images: [{ url: '/assets/silky-partage.jpg', alt: 'La gamme capillaire Silky Argan Oil de CARIMO' }] }
};
export const viewport = { themeColor:'#0c0c0a' };
export default function RootLayout({children}) {return <html lang="fr"><body>{children}</body></html>}
