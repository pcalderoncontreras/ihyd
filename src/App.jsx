import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Home from './pages/Home';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AdModal from './components/AdModal';
import './App.css'

function App() {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('dark');
  const [showAds, setShowAds] = useState(false);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar
          setCategory={setCategory}
          currentCategory={category}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          theme={theme}
          toggleTheme={toggleTheme}
          onShowAds={() => setShowAds(true)}
        />
        <Routes>
          <Route path="/" element={
            category === 'all' ? (
              <Home setCategory={setCategory} globalSearchTerm={searchTerm} />
            ) : (
              <ProductList category={category} globalSearchTerm={searchTerm} />
            )
          } />
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/admin" element={<Admin searchTerm={searchTerm} />} />
        </Routes>
        <AdModal forceShow={showAds} onManualClose={() => setShowAds(false)} />
        <FloatingWhatsApp />
        <Footer theme={theme} />
      </Router>
    </AuthProvider>
  )
}

export default App
