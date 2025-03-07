import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Team from './pages/Team';
import Statistics from './pages/Statistics';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import PasswordProtection from './components/PasswordProtection';
import { Analytics } from "@vercel/analytics/react"
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authCookie = Cookies.get('auth');
    if (authCookie === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
    <Analytics />
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    </>
  );
}

export default App
