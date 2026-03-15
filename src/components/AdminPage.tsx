import Navbar from './Navbar';
import OperationsConsole from './OperationsConsole';
import Footer from './Footer';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      <Navbar isAdminView />
      <main className="pt-28 md:pt-32">
        <OperationsConsole />
      </main>
      <Footer />
    </div>
  );
}
