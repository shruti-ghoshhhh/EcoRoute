import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Data State
  const [metrics, setMetrics] = useState({ totalUsers: 0, activePickups: 0, totalCO2Saved: 0, totalRoutesSearched: 0, activeUsersToday: 0 });
  const [users, setUsers] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // User Edit State
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || '';
  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [uRes, pRes, mRes, rRes, fRes] = await Promise.all([
        axios.get(`${API_URL}/api/users`, config),
        axios.get(`${API_URL}/api/pickups/all`, config),
        axios.get(`${API_URL}/api/admin/metrics`, config),
        axios.get(`${API_URL}/api/routes/all`, config),
        axios.get(`${API_URL}/api/feedback/all`, config)
      ]);
      setUsers(uRes.data);
      setPickups(pRes.data);
      setMetrics(mRes.data);
      setRoutes(rRes.data);
      setFeedbacks(fRes.data);
    } catch (error) {
      console.error("Failed to fetch Admin Database", error);
      alert('Network Error during sync: ' + (error.response?.data?.message || error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, [user.token]);

  // CSV Generator
  const downloadCSV = (type) => {
    let headers = [];
    let rows = [];
    if (type === 'routes') {
      headers = ['Route ID', 'User Email', 'Origin', 'Destination', 'Distance (Km)', 'Mode', 'CO2 Offset (Kg)', 'Date'];
      rows = routes.map(r => [r._id, r.user?.email || 'N/A', r.origin, r.destination, r.distanceKm, r.transportMode, r.emissionsSaved, r.createdAt]);
    } else if (type === 'users') {
      headers = ['User ID', 'Name', 'Email', 'Role', 'Points', 'Banned Status', 'Created'];
      rows = users.map(u => [u._id, u.name, u.email, u.role, u.points, u.isBanned, u.createdAt]);
    }
    
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EcoRoute_${type}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* Actions */
  const toggleBan = async (id, isBanned) => {
    if(!window.confirm(`Are you sure you want to ${isBanned ? 'UNBAN' : 'BAN'} this operative?`)) return;
    try {
      await axios.put(`${API_URL}/api/users/${id}/ban`, {}, config);
      fetchAdminData();
    } catch (e) { alert("Failed to execute Ban directive."); }
  };

  const updatePickupStatus = async (pickupId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/pickups/${pickupId}/status`, { status: newStatus }, config);
      fetchAdminData(); 
    } catch (e) { alert("Failed operation."); }
  };

  const toggleFeedbackStatus = async (id) => {
    try {
      await axios.put(`${API_URL}/api/feedback/${id}/resolve`, {}, config);
      fetchAdminData();
    } catch (e) { alert("Failed to mark feedback."); }
  };

  // Dynamic Chart Aggregators
  const scheduledDispatches = pickups.reduce((acc, p) => {
    const d = new Date(p.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    let day = acc.find(m => m.date === d);
    if (!day) { day = { date: d, count: 0 }; acc.push(day); }
    day.count += 1;
    return acc;
  }, []);

  const pickupDistribution = [
    { name: 'Pending', count: pickups.filter(p => p.status === 'Pending').length },
    { name: 'In-Route', count: pickups.filter(p => p.status === 'In-Route').length },
    { name: 'Completed', count: pickups.filter(p => p.status === 'Completed').length }
  ];


  if (loading) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-200 flex">
      
      {/* Sidebar Navigation */}
      <div className="w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col hidden md:flex h-screen sticky top-0">
        <h1 className="text-xl font-black mb-8 flex items-center gap-3">
          <span className="text-red-500 animate-pulse">●</span> Command Center
        </h1>
        <div className="space-y-2 flex-grow">
          {['Overview', 'Users', 'Logistics', 'Routing History', 'Feedback'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${activeTab === tab ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-auto">
          <button onClick={() => downloadCSV('routes')} className="w-full mb-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-4 py-3 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-sm">Download Route CSV</button>
          <button onClick={() => downloadCSV('users')} className="w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-4 py-3 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-sm">Download User CSV</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={activeTab}>
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black mb-6">Global Platform Telemetry</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
                  <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Total CO₂ Saved</h3>
                  <div className="text-4xl font-black text-emerald-500">{metrics.totalCO2Saved} <span className="text-lg">kg</span></div>
                  <p className="text-xs text-zinc-500 mt-2">Core USP Metric Engine</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
                  <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Active Network Users</h3>
                  <div className="text-4xl font-black text-blue-500">{metrics.activeUsersToday}</div>
                  <p className="text-xs text-zinc-500 mt-2">Users logged in last 24H</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
                  <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Global Routes Searched</h3>
                  <div className="text-4xl font-black text-amber-500">{metrics.totalRoutesSearched}</div>
                  <p className="text-xs text-zinc-500 mt-2">Historic navigation logs</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
                  <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Total Registered</h3>
                  <div className="text-4xl font-black text-purple-500">{metrics.totalUsers}</div>
                  <p className="text-xs text-zinc-500 mt-2">Accounts across database</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl block">
                  <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-6">Scheduled Dispatches Over Time</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={scheduledDispatches}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.2} vertical={false} />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 2 }} contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={4} activeDot={{ r: 8, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} name="Pickups" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl block">
                  <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-6">Logistics Fulfillment Volume</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pickupDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.2} vertical={false} />
                        <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Volume" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: USERS */}
          {activeTab === 'Users' && (
            <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
               <div className="p-6 border-b border-zinc-200 dark:border-zinc-800"><h2 className="text-sm font-bold text-zinc-400 uppercase">Personnel Database Moderation</h2></div>
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-950/50 text-xs uppercase text-zinc-500">
                      <th className="p-4">Name</th><th className="p-4">Email Address</th><th className="p-4">Role</th><th className="p-4">Points</th><th className="p-4">Status</th><th className="p-4 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                        <td className="p-4 font-bold">{u.name}</td>
                        <td className="p-4 text-zinc-400">{u.email}</td>
                        <td className="p-4"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{u.role.toUpperCase()}</span></td>
                        <td className="p-4 font-black">{u.points}</td>
                        <td className="p-4">{u.isBanned ? <span className="text-red-500 font-bold text-xs uppercase bg-red-500/10 px-2 py-1 rounded">BANNED</span> : <span className="text-emerald-500 font-bold text-xs uppercase bg-emerald-500/10 px-2 py-1 rounded">ACTIVE</span>}</td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button onClick={() => toggleBan(u._id, u.isBanned)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${u.isBanned ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                            {u.isBanned ? 'UNBAN' : 'RESTRICT'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          )}

          {/* TAB: ROUTING */}
          {activeTab === 'Routing History' && (
            <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
               <div className="p-6 border-b border-zinc-200 dark:border-zinc-800"><h2 className="text-sm font-bold text-zinc-400 uppercase">Globally Tracked Navigation Logs</h2></div>
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-950/50 text-xs uppercase text-zinc-500">
                      <th className="p-4">User</th><th className="p-4">Origin ➡️ Dest</th><th className="p-4">Distance</th><th className="p-4">Transport Mode</th><th className="p-4">CO2 Saved</th><th className="p-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map(r => (
                      <tr key={r._id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                        <td className="p-4 font-bold text-emerald-500">{r.user?.name || 'N/A'}</td>
                        <td className="p-4 text-sm"><span className="text-zinc-400">{r.origin}</span> <span className="mx-2">➡️</span> <span className="text-zinc-200">{r.destination}</span></td>
                        <td className="p-4 font-mono">{r.distanceKm} km</td>
                        <td className="p-4"><span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full text-xs font-bold">{r.transportMode}</span></td>
                        <td className="p-4 font-bold text-emerald-500">+{r.emissionsSaved.toFixed(2)}kg</td>
                        <td className="p-4 text-right text-xs text-zinc-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {routes.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-zinc-500">No telemetry logged. Standardize Map Routing protocol on frontend.</td></tr>}
                  </tbody>
                </table>
               </div>
            </div>
          )}

          {/* TAB: LOGISTICS */}
          {activeTab === 'Logistics' && (
             <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
             <div className="p-6 border-b border-zinc-200 dark:border-zinc-800"><h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Global Logistics & Dispatch</h2></div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-zinc-100 dark:bg-zinc-950/50 text-xs uppercase text-zinc-500">
                     <th className="p-4 border-b border-zinc-200 dark:border-zinc-800">Operative</th>
                     <th className="p-4 border-b border-zinc-200 dark:border-zinc-800">Target Config</th>
                     <th className="p-4 border-b border-zinc-200 dark:border-zinc-800">Status Vector</th>
                     <th className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-right">Execute</th>
                   </tr>
                 </thead>
                 <tbody>
                   {pickups.map(pickup => (
                     <tr key={pickup._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/50 transition-colors">
                       <td className="p-4 font-bold text-emerald-500">{pickup.user?.name || 'Nullified'}</td>
                       <td className="p-4">
                         <div className="font-bold">{pickup.category} ({pickup.volume})</div>
                         <div className="text-xs text-zinc-500">Deploy: {pickup.date} | Coord: [{pickup.position.lat.toFixed(2)}, {pickup.position.lng.toFixed(2)}]</div>
                       </td>
                       <td className="p-4">
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${pickup.status === 'Pending' ? 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' : pickup.status === 'In-Route' ? 'text-blue-600 dark:bg-blue-500/10' : 'text-emerald-600 dark:bg-emerald-500/10'}`}>{pickup.status}</span>
                       </td>
                       <td className="p-4 text-right">
                         {pickup.status === 'Pending' && <button onClick={() => updatePickupStatus(pickup._id, 'In-Route')} className="bg-blue-500/10 text-blue-500 text-xs font-bold py-1.5 px-4 rounded-lg hover:bg-blue-500/20 transition-colors">Dispatch</button>}
                         {pickup.status === 'In-Route' && <button onClick={() => updatePickupStatus(pickup._id, 'Completed')} className="bg-emerald-500 text-white text-xs font-bold py-1.5 px-4 rounded-lg hover:bg-emerald-600 transition-colors">Mark Completed</button>}
                         {pickup.status === 'Completed' && <span className="text-xs font-bold text-emerald-500">Verified</span>}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
          )}

          {/* TAB: FEEDBACK */}
          {activeTab === 'Feedback' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {feedbacks.map(f => (
                  <div key={f._id} className={`p-6 rounded-[2rem] border shadow-xl relative ${f.status === 'Resolved' ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-800 opacity-60' : 'bg-white dark:bg-zinc-950 border-emerald-500/30'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold">{f.user?.name || 'Anonymous'}</h4>
                        <p className="text-xs text-zinc-500">{f.user?.email || '[Deleted User]'}</p>
                      </div>
                      <button onClick={() => toggleFeedbackStatus(f._id)} className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${f.status === 'Pending' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
                        {f.status === 'Pending' ? 'Mark Resolved' : 'Re-open Ticket'}
                      </button>
                    </div>
                    <p className="text-sm dark:text-zinc-300 leading-relaxed italic border-l-2 border-emerald-500 pl-4">{f.message}</p>
                    <p className="text-[10px] text-zinc-600 mt-4 text-right">{new Date(f.createdAt).toLocaleString()}</p>
                  </div>
                ))}
                {feedbacks.length === 0 && <div className="col-span-2 p-8 text-center text-zinc-500">Inbox is empty. No user feedback registered.</div>}
             </div>
          )}

        </motion.div>
      </div>

    </div>
  );
};

export default AdminDashboard;
