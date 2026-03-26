import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import { User } from 'lucide-react';
// Importaremos el Dashboard que haremos a continuación
// import Dashboard from './pages/Dashboard'; 

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinished={() => setShowSplash(false)} />
      ) : (
        <div className="min-h-screen bg-slate-50 animate-in fade-in duration-700">
          {/* Content of HomePage / Dashboard */}
           <nav className="p-6 bg-white shadow-sm flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">CFG Management</h2>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                <User/>
              </div>
           </nav>
           
           <main className="p-8">
              <h1 className="text-3xl font-black text-slate-900">Bienvenido,</h1>
              <p className="text-slate-500">Selecciona una opción del menú para comenzar.</p>
           </main>
        </div>
      )}
    </>
  );
}

export default App;