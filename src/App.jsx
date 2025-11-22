import { useState } from 'react'
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
  const [adminSearchTerm, setAdminSearchTerm] = useState('');

  return (
    <AuthProvider>
      <Router>
        <Navbar
          setCategory={setCategory}
          searchTerm={adminSearchTerm}
          setSearchTerm={setAdminSearchTerm}
        />
        <Routes>
          <Route path="/" element={
            category === 'all' ? (
              <Home setCategory={setCategory} />
            ) : (
              <ProductList category={category} />
            )
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin searchTerm={adminSearchTerm} />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App
