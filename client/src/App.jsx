import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './hooks/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './screens/Dashboard';
import Alerts from './screens/Alerts';
import Services from './screens/Services';
import Instructions from './screens/Instructions';
import Admin from './screens/Admin';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-[#0f172a] text-slate-200">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/services" element={<Services />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Navbar />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
