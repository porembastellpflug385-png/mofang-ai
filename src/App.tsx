/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Introduction from './components/Introduction';
import SkillsPlatform from './components/SkillsPlatform';
import Showcase from './components/Showcase';
import Ecosystem from './components/Ecosystem';
import Partners from './components/Partners';
import Vision from './components/Vision';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPage from './components/AdminPage';
import { LanguageProvider } from './context/LanguageContext';
import { useEffect, useState } from 'react';

function RoutedApp() {
  const [route, setRoute] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === '#/admin') {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      <Navbar />
      <main>
        <Hero />
        <Introduction />
        <SkillsPlatform />
        <Showcase />
        <Ecosystem />
        <Vision />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <RoutedApp />
    </LanguageProvider>
  );
}
