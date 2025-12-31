import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, LogOut } from 'lucide-react';

const Admin = ({ apiUrl, onBack }) => {
  const [password, setPassword] = useState(''); 
  const [token, setToken] = useState(sessionStorage.getItem('adminToken') || '');
  const [activeTab, setActiveTab] = useState('signups'); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Check for existing token on load
  useEffect(() => {
    const storedToken = sessionStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      fetchData(storedToken, activeTab);
    }
  }, [activeTab]);

  // 2. LOGIN FUNCTION (Get Token)
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
        throw new Error(result.error || 'Login failed');
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

  // 3. FETCH DATA (Use Token)
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

      setData(result);
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

  // 4. RENDER LOGIC
  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6 selection:bg-sky-900 selection:text-white">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-lg space-y-6 shadow-2xl shadow-sky-900/10">
          <div className="flex items-center gap-3 justify-center text-sky-500 mb-4">
             <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white text-center tracking-tight">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Master Key"
              className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 rounded focus:outline-none focus:border-sky-500 transition-colors placeholder:text-neutral-600"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-sky-600 text-white py-3 font-bold rounded hover:bg-sky-500 transition-colors uppercase tracking-wider text-sm disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>
          <button onClick={onBack} className="w-full text-neutral-500 text-sm hover:text-white transition-colors">Back to Site</button>
        </div>
      </div>
    );
  }

  // DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 p-6 font-sans selection:bg-sky-900 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Gummyte <span className="text-neutral-500 font-normal">Dashboard</span></h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => fetchData(token, activeTab)} className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors" title="Refresh Data">
              <RefreshCw size={20} className={loading ? 'animate-spin text-sky-500' : ''} />
            </button>
            <button onClick={handleLogout} className="p-2 hover:bg-red-900/20 rounded text-neutral-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-neutral-800">
          {['signups', 'messages'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium uppercase tracking-wider transition-colors ${activeTab === tab ? 'text-sky-500 border-b-2 border-sky-500' : 'text-neutral-500 hover:text-white'}`}
            >
              {tab} <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded-full ml-1 text-neutral-400">{activeTab === tab ? data.length : ''}</span>
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-neutral-950/50 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wider">Date</th>
                  <th className="px-6 py-4 font-medium tracking-wider">{activeTab === 'signups' ? 'Email' : 'Sender'}</th>
                  <th className="px-6 py-4 font-medium tracking-wider">{activeTab === 'signups' ? 'Source' : 'Content'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {data.map((item) => (
                  <tr key={item._id} className="hover:bg-neutral-800/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-neutral-500 whitespace-nowrap text-xs">
                      {new Date(item.timestamp).toLocaleDateString()} <span className="text-neutral-700 mx-1">|</span> {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4 font-medium text-white group-hover:text-sky-100 transition-colors">
                      {activeTab === 'signups' ? item.email : (
                        <div>
                          <div className="text-white font-medium">{item.name}</div>
                          <div className="text-neutral-500 text-xs font-mono mt-0.5">{item.email}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-neutral-400 max-w-md truncate">
                      {activeTab === 'signups' ? (
                        <span className="px-2 py-1 bg-neutral-800/50 border border-neutral-700/50 rounded text-xs text-neutral-400 font-mono">{item.source}</span>
                      ) : (
                        <span className="block truncate">{item.message}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-16 text-center text-neutral-500">
                      {error ? <span className="text-red-400">{error}</span> : "No records found yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;