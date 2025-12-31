import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, LogOut, Copy, Check, Search, Inbox, Users } from 'lucide-react';

const Admin = ({ apiUrl, onBack }) => {
  const [password, setPassword] = useState(''); 
  const [token, setToken] = useState(sessionStorage.getItem('adminToken') || '');
  const [activeTab, setActiveTab] = useState('signups'); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // 1. Check for existing token on load
  useEffect(() => {
    const storedToken = sessionStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      fetchData(storedToken, activeTab);
    }
  }, [activeTab]);

  // 2. LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Access Denied');
      }

      setToken(result.token);
      sessionStorage.setItem('adminToken', result.token);
      fetchData(result.token, activeTab);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. FETCH DATA
  const fetchData = async (currentToken, endpoint) => {
    if (!currentToken) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${apiUrl}/admin/${endpoint}`, {
        headers: { 
          'Authorization': `Bearer ${currentToken}` 
        }
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
      
      const result = await response.json();

      if (!Array.isArray(result)) {
        throw new Error('Received invalid data format');
      }

      // Sort by newest first
      const sortedData = result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setData(sortedData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setToken('');
    setPassword('');
    setData([]);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 4. RENDER LOGIC
  
  // -- LOGIN SCREEN --
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6 selection:bg-sky-900 selection:text-white relative overflow-hidden">
        {/* Background Ambient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-900 via-sky-500 to-sky-900 opacity-50"></div>
        
        <div className="w-full max-w-sm bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-8 rounded-xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center gap-4 mb-8">
             <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-full text-sky-500">
                <Lock size={24} />
             </div>
             <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-wide">Command Center</h2>
                <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">Restricted Access</p>
             </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Master Key"
                  className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all placeholder:text-neutral-700 text-center tracking-widest"
                />
            </div>
            
            {error && (
                <div className="text-red-400 text-xs text-center bg-red-950/20 border border-red-900/50 p-2 rounded">
                    {error}
                </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-sky-600 text-white py-3 font-bold rounded-lg hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-900/20 transition-all uppercase tracking-wider text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader /> : 'Authenticate'}
            </button>
          </form>
          <button onClick={onBack} className="w-full text-neutral-600 text-xs mt-6 hover:text-white transition-colors">
            ← Return to Gummyte
          </button>
        </div>
      </div>
    );
  }

  // -- DASHBOARD SCREEN --
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-sky-900 selection:text-white flex flex-col">
      
      {/* Top Bar */}
      <header className="bg-neutral-900/50 backdrop-blur border-b border-neutral-800 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h1 className="text-lg font-bold text-white tracking-wide">
              Gummyte <span className="text-neutral-600 font-normal">/ Admin</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => fetchData(token, activeTab)} className="p-2 hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-white transition-colors" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin text-sky-500' : ''} />
            </button>
            <div className="w-px h-8 bg-neutral-800 mx-1"></div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-950/30 rounded-md text-neutral-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Controls & Metrics */}
          <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-neutral-800 pb-1">
             <div className="flex gap-6">
                <TabButton 
                    label="Waitlist" 
                    icon={<Users size={16}/>} 
                    isActive={activeTab === 'signups'} 
                    onClick={() => setActiveTab('signups')} 
                    count={activeTab === 'signups' ? data.length : null}
                />
                <TabButton 
                    label="Messages" 
                    icon={<Inbox size={16}/>} 
                    isActive={activeTab === 'messages'} 
                    onClick={() => setActiveTab('messages')}
                    count={activeTab === 'messages' ? data.length : null}
                />
             </div>
             <div className="text-xs text-neutral-600 font-mono">
                Total Records: {data.length}
             </div>
          </div>

          {/* Data Table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-sm min-h-[400px]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-neutral-500 uppercase bg-neutral-950 border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider w-48">Timestamp</th>
                    <th className="px-6 py-4 font-semibold tracking-wider w-64">{activeTab === 'signups' ? 'User Email' : 'Sender Details'}</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">{activeTab === 'signups' ? 'Source' : 'Message Content'}</th>
                    <th className="px-6 py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {data.map((item) => (
                    <tr key={item._id} className="hover:bg-neutral-800/40 transition-colors group">
                      {/* Date Column */}
                      <td className="px-6 py-4 font-mono text-neutral-500 text-xs whitespace-nowrap">
                        <div className="text-neutral-300">{new Date(item.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}</div>
                        <div className="text-neutral-600">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </td>

                      {/* Identity Column */}
                      <td className="px-6 py-4">
                        {activeTab === 'signups' ? (
                            <div className="flex items-center justify-between group/email">
                                <span className="text-white font-medium truncate max-w-[180px]">{item.email}</span>
                                <button 
                                    onClick={() => copyToClipboard(item.email, item._id)}
                                    className="text-neutral-600 hover:text-sky-500 opacity-0 group-hover/email:opacity-100 transition-opacity p-1"
                                    title="Copy Email"
                                >
                                    {copiedId === item._id ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            </div>
                        ) : (
                          <div>
                            <div className="text-white font-bold">{item.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-neutral-500 text-xs font-mono">{item.email}</span>
                                <button 
                                    onClick={() => copyToClipboard(item.email, item._id)}
                                    className="text-neutral-600 hover:text-sky-500 p-0.5"
                                    title="Copy Email"
                                >
                                    {copiedId === item._id ? <Check size={12} /> : <Copy size={12} />}
                                </button>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Content Column */}
                      <td className="px-6 py-4 text-neutral-400">
                        {activeTab === 'signups' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-medium text-neutral-400 font-mono">
                            {item.source || 'Web Form'}
                          </span>
                        ) : (
                          <div className="relative group/msg cursor-help">
                             <p className="line-clamp-1 group-hover/msg:line-clamp-none transition-all duration-300 text-sm">
                                {item.message}
                             </p>
                          </div>
                        )}
                      </td>
                      
                      {/* Action Column */}
                      <td className="px-6 py-4 text-right">
                         {/* Placeholder for delete/archive actions later */}
                      </td>
                    </tr>
                  ))}

                  {/* Empty State */}
                  {data.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-neutral-950 rounded-full border border-neutral-800 text-neutral-600">
                                <Search size={24} />
                            </div>
                            <p className="text-neutral-500 text-sm">No records found in database.</p>
                            {error && <span className="text-red-400 text-xs bg-red-950/30 px-2 py-1 rounded border border-red-900/50">{error}</span>}
                        </div>
                      </td>
                    </tr>
                  )}
                  
                  {/* Loading State Skeleton */}
                  {loading && data.length === 0 && (
                     [1,2,3].map(i => (
                        <tr key={i} className="animate-pulse">
                            <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded w-24"></div></td>
                            <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded w-48"></div></td>
                            <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded w-32"></div></td>
                            <td></td>
                        </tr>
                     ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// UI Helper Components
const TabButton = ({ label, icon, isActive, onClick, count }) => (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 pb-4 text-sm font-medium tracking-wide transition-all relative
        ${isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}
      `}
    >
      {icon}
      {label}
      {count !== null && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-sky-900/50 text-sky-400 border border-sky-800' : 'bg-neutral-800 text-neutral-400'}`}>
              {count}
          </span>
      )}
      {isActive && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>}
    </button>
);

const Loader = () => (
    <div className="flex items-center justify-center gap-2">
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
);

export default Admin;