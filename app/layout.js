import './fonts.css';
import './globals.css';
import './invitation.css';
export const metadata = {title:'Invitation Silky — Atelier découverte CARIMO',description:'Carimo invite 10 salons à découvrir la gamme Silky : démonstration en direct, kit découverte offert à chaque salon présent et présentation du partenariat.'};
export const viewport = { themeColor:'#0c0c0a' };
export default function RootLayout({children}) {return <html lang="fr"><body>{children}</body></html>}
