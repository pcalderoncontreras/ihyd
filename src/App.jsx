import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Home from './pages/Home';
import Footer from './components/Footer';
import './App.css'

function App() {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('dark');

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
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <Routes>
          <Route path="/" element={
            category === 'all' ? (
              <Home setCategory={setCategory} globalSearchTerm={searchTerm} />
            ) : (
              <ProductList category={category} />
            )
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin searchTerm={searchTerm} />} />
        </Routes>
        <Footer theme={theme} />
      </Router>
    </AuthProvider>
  )
}

export default App
