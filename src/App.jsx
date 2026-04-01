import TopNavigation from './components/TopNavigation';
import Footer from './components/Footer';
import Inventory from './pages/Inventory';
import Contact from './pages/Contact';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation />
      <main className="flex-grow">
        <Inventory />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
