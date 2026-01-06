
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SproutIcon, ShoppingCartIcon, SettingsIcon, UserIcon, ShieldCheckIcon, LeafIcon } from './icons';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';

type UserRole = 'farmer' | 'admin' | 'buyer';
type AuthMode = 'signin' | 'signup';

const Login: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const roleParam = searchParams.get('role');
  const userRole: UserRole = (roleParam === 'admin' || roleParam === 'buyer') ? roleParam : 'farmer';

  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const roleDetails = {
    farmer: {
      title: 'Farmer Portal',
      subtitle: 'Access your farm dashboard',
      bgImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920')",
      icon: <SproutIcon className="w-12 h-12 text-white" />,
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      accentColor: 'text-green-400',
      demoUser: 'farmer_demo',
      demoPass: 'password'
    },
    buyer: {
      title: 'Buyer Portal',
      subtitle: 'Source fresh produce directly',
      bgImage: "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=1920')",
      icon: <ShoppingCartIcon className="w-12 h-12 text-white" />,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      accentColor: 'text-blue-400',
      demoUser: 'buyer-01',
      demoPass: 'password'
    },
    admin: {
      title: 'Admin Login',
      subtitle: 'Platform Management',
      bgImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920')",
      icon: <SettingsIcon className="w-12 h-12 text-white" />,
      color: 'bg-slate-700',
      hoverColor: 'hover:bg-slate-800',
      accentColor: 'text-slate-300',
      demoUser: 'admin',
      demoPass: 'password'
    },
  };

  const details = roleDetails[userRole];

  const handleAuthSuccess = (role: UserRole) => {
      if (role === 'farmer') navigate('/farmer/dashboard');
      else if (role === 'buyer') navigate('/buyer/dashboard');
      else if (role === 'admin') navigate('/admin/analytics');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (authMode === 'signin') {
        const result = await signIn(username, password);
        if (!result.success) {
            setError(result.message);
            setIsLoading(false);
        } else if (result.role !== userRole && result.role !== 'admin') { 
             if(userRole === 'admin') {
                 setError("Unauthorized access.");
                 setIsLoading(false);
             } else if (result.role) {
                 handleAuthSuccess(result.role);
             }
        } else if (result.role) {
            handleAuthSuccess(result.role);
        }
    } else {
        if(password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }
        const result = await signUp(fullName, username, password, userRole);
        if (!result.success) {
            setError(result.message);
            setIsLoading(false);
        } else {
            handleAuthSuccess(userRole);
        }
    }
  };

  const handleDemoLogin = () => {
      setUsername(details.demoUser);
      setPassword(details.demoPass);
  };

  const commonFormClasses = "w-full px-4 py-3 rounded-xl bg-black/40 text-white placeholder-gray-400 border border-white/20 focus:border-white/40 focus:bg-black/60 focus:outline-none transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed font-sans" style={{ backgroundImage: details.bgImage, backgroundColor: '#000' }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 w-full max-w-md p-10 bg-black/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 animate-fadeIn">
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors text-xs font-black uppercase tracking-widest flex items-center">
            &larr; Back
        </button>
        
        <div className="text-center mb-10">
            <div className="inline-block relative mb-6">
                <div className={`p-4 rounded-3xl ${details.color} shadow-2xl relative z-10 animate-float`}>
                    {details.icon}
                </div>
                <div className={`absolute inset-0 ${details.color} blur-3xl opacity-40 rounded-full`}></div>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">{details.title}</h1>
            <p className={`${details.accentColor} font-bold text-xs uppercase tracking-[0.2em] mt-2 opacity-80`}>{details.subtitle}</p>
        </div>

        {userRole !== 'admin' && (
            <div className="flex justify-center p-1.5 bg-black/40 rounded-2xl mb-8 border border-white/5">
                <button onClick={() => { setAuthMode('signin'); setError(null); }} className={`w-1/2 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${authMode === 'signin' ? details.color + ' text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Sign In</button>
                <button onClick={() => { setAuthMode('signup'); setError(null); }} className={`w-1/2 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${authMode === 'signup' ? details.color + ' text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Sign Up</button>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            {authMode === 'signup' && (
                 <div className="animate-slideDown">
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5 ml-2">Full Name</label>
                    <input className={commonFormClasses} value={fullName} onChange={e => setFullName(e.target.value)} type="text" placeholder="Ramesh Kumar" required />
                </div>
            )}

            <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5 ml-2">Username</label>
                <input className={commonFormClasses} value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="farmer_demo" required />
            </div>

            <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5 ml-2">Password</label>
                <input className={commonFormClasses} value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" required />
            </div>

             {authMode === 'signup' && (
                 <div className="animate-slideDown">
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5 ml-2">Confirm</label>
                    <input className={commonFormClasses} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" required />
                </div>
            )}
            
            {error && <p className="text-red-300 text-xs font-bold text-center bg-red-900/40 p-4 rounded-xl border border-red-500/20 animate-shake">{error}</p>}

            <button type="submit" disabled={isLoading} className={`w-full py-4 ${details.color} ${details.hoverColor} text-white font-black rounded-2xl shadow-xl shadow-black/20 transition-all uppercase tracking-widest text-xs active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center`}>
                {isLoading ? <Spinner className="w-5 h-5"/> : (authMode === 'signup' ? 'Launch Account' : 'Secure Entry')}
            </button>
        </form>
        
        {authMode === 'signin' && (
            <div className="mt-8">
                <button 
                    type="button" 
                    onClick={handleDemoLogin} 
                    className="w-full py-4 bg-white/5 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition border border-white/10 flex items-center justify-center group"
                >
                    <UserIcon className="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100 transition-opacity"/>
                    Use Demo Credentials
                </button>
            </div>
        )}
        
        <div className="mt-10 text-center border-t border-white/5 pt-6">
             <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.3em]">
                 Raitha Mitra Security • End-to-End Encrypted
             </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
