import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, Award, MessageSquare, ShieldCheck, UserX, 
  CheckCircle, BarChart3, Grid, Heart, Utensils, Hotel, HelpCircle,
  TrendingUp, LayoutDashboard, Search, Filter, Ban, RefreshCw, 
  ArrowUpRight, AlertTriangle, ShieldAlert, CheckCircle2, FileText
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    users: 0,
    reservations: 0,
    services: 0,
    avis: 0,
    pendingPrestataires: 0,
    reservationsParCategorie: {
      sante: 0,
      beaute: 0,
      restaurant: 0,
      hotel: 0,
      autre: 0
    }
  });
  
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'client', 'prestataire', 'blocked'
  const [validationFilter, setValidationFilter] = useState('all'); // 'all', 'pending', 'validated'

  const fetchAdminData = async () => {
    try {
      // 1. Fetch dashboard stats
      const statsResponse = await fetch('/admin/dashboard');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // 2. Fetch all users to display & manage
      const usersResponse = await fetch('/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsersList(usersData.users || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Impossible de se connecter au serveur backend.');
      
      // Mock fallback data for demonstration
      setStats({
        users: 12,
        reservations: 24,
        services: 58,
        avis: 8,
        pendingPrestataires: 2,
        reservationsParCategorie: {
          sante: 8,
          beaute: 6,
          restaurant: 6,
          hotel: 4,
          autre: 0
        }
      });
      setUsersList([
        { _id: 'prest-salma', nom: 'Dr. Salma Touil', email: 'salma@wakti.tn', telephone: '71900100', role: 'prestataire', categorie: 'medecin', statutPrestataire: 'valide', isBlocked: false, createdAt: '2026-07-01' },
        { _id: 'prest-amel', nom: 'Restaurant El Amel', email: 'amel@wakti.tn', telephone: '73200300', role: 'prestataire', categorie: 'restaurant', statutPrestataire: 'valide', isBlocked: false, createdAt: '2026-07-05' },
        { _id: 'prest-mouradi', nom: 'El Mouradi Palm Marina', email: 'mouradi@wakti.tn', telephone: '73240222', role: 'prestataire', categorie: 'hotel', statutPrestataire: 'en_attente', isBlocked: false, createdAt: '2026-07-15' },
        { _id: 'prest-lilas', nom: 'Centre Lilas Beauté', email: 'lilas@wakti.tn', telephone: '71888999', role: 'prestataire', categorie: 'centre de beaute', statutPrestataire: 'en_attente', isBlocked: false, createdAt: '2026-07-20' },
        { _id: 'client-nour', nom: 'Nour Ben Ali', email: 'nour@client.tn', telephone: '98111222', role: 'client', isBlocked: false, createdAt: '2026-07-24' },
        { _id: 'client-yassine', nom: 'Yassine Kefi', email: 'yassine@client.tn', telephone: '98333444', role: 'client', isBlocked: true, createdAt: '2026-07-23' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.email !== 'nadaatouil00@gmail.com') {
      navigate('/');
    } else {
      fetchAdminData();
    }
  }, [user, navigate]);

  const handleValidatePrestataire = async (providerId) => {
    setActionSuccess('');
    setError('');
    try {
      const response = await fetch(`/admin/prestataires/${providerId}/valider`, {
        method: 'POST'
      });
      if (response.ok) {
        setActionSuccess('Le prestataire a été validé avec succès !');
        fetchAdminData();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la validation');
      }
    } catch (err) {
      // Local fallback
      setUsersList(prev => prev.map(u => u._id === providerId ? { ...u, statutPrestataire: 'valide' } : u));
      setActionSuccess('Prestataire validé (simulation hors-ligne).');
      setStats(prev => ({ 
        ...prev, 
        pendingPrestataires: Math.max(0, prev.pendingPrestataires - 1) 
      }));
    }
  };

  const handleBlockUser = async (targetUserId) => {
    setActionSuccess('');
    setError('');
    try {
      const response = await fetch(`/admin/utilisateurs/${targetUserId}/bloquer`, {
        method: 'POST'
      });
      if (response.ok) {
        setActionSuccess('L’utilisateur a été bloqué avec succès !');
        fetchAdminData();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors du blocage');
      }
    } catch (err) {
      // Local fallback
      setUsersList(prev => prev.map(u => u._id === targetUserId ? { ...u, isBlocked: true } : u));
      setActionSuccess('Utilisateur bloqué (simulation hors-ligne).');
    }
  };

  const handleUnblockUser = async (targetUserId) => {
    setActionSuccess('');
    setError('');
    try {
      const response = await fetch(`/admin/utilisateurs/${targetUserId}/debloquer`, {
        method: 'POST'
      });
      if (response.ok) {
        setActionSuccess('L’utilisateur a été débloqué avec succès !');
        fetchAdminData();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors du déblocage');
      }
    } catch (err) {
      // Local fallback
      setUsersList(prev => prev.map(u => u._id === targetUserId ? { ...u, isBlocked: false } : u));
      setActionSuccess('Utilisateur débloqué (simulation hors-ligne).');
    }
  };

  const handleGenerateReport = async () => {
    setActionSuccess('');
    setError('');
    try {
      const response = await fetch('/admin/rapport');
      if (response.ok) {
        const data = await response.json();
        // Trigger file download
        const jsonStr = JSON.stringify(data.report, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wakti-rapport-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setActionSuccess('Rapport d\'activité exporté avec succès !');
      } else {
        throw new Error('Erreur de génération');
      }
    } catch (err) {
      // Offline fallback
      const mockReport = {
        stats,
        totalUsers: usersList.length,
        exportedAt: new Date()
      };
      const jsonStr = JSON.stringify(mockReport, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wakti-rapport-simulation.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setActionSuccess('Rapport d\'activité exporté (simulation hors-ligne).');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '16px' }}>Chargement du panneau d'administration...</p>
      </div>
    );
  }

  // Categories lists
  const prestataires = usersList.filter(u => u.role === 'prestataire');
  const clients = usersList.filter(u => u.role === 'client');

  // Filtering users list
  const filteredUsers = usersList.filter(u => {
    // 1. Search term
    const matchesSearch = 
      u.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.telephone && u.telephone.includes(searchTerm));
    
    // 2. Role filter
    let matchesRole = true;
    if (roleFilter === 'client') matchesRole = u.role === 'client';
    else if (roleFilter === 'prestataire') matchesRole = u.role === 'prestataire';
    else if (roleFilter === 'blocked') matchesRole = u.isBlocked === true;

    return matchesSearch && matchesRole;
  });

  // Filtering validation pros list
  const filteredPros = prestataires.filter(p => {
    const matchesSearch = 
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    let matchesValidation = true;
    if (validationFilter === 'pending') matchesValidation = p.statutPrestataire === 'en_attente';
    else if (validationFilter === 'validated') matchesValidation = p.statutPrestataire === 'valide';

    return matchesSearch && matchesValidation;
  });

  // Category Configuration for beautiful rendering
  const categoryConfigs = {
    sante: { label: 'Santé / Médecine', color: 'rgb(37, 99, 235)', bg: 'rgba(59, 130, 246, 0.1)', icon: Heart },
    beaute: { label: 'Esthétique / Beauté', color: 'rgb(219, 39, 119)', bg: 'rgba(236, 72, 153, 0.1)', icon: Award },
    restaurant: { label: 'Restauration / Restaurant', color: 'rgb(5, 150, 105)', bg: 'rgba(16, 185, 129, 0.1)', icon: Utensils },
    hotel: { label: 'Hébergement / Hôtel', color: 'rgb(217, 119, 6)', bg: 'rgba(245, 158, 11, 0.1)', icon: Hotel },
    autre: { label: 'Autres Services', color: 'rgb(107, 114, 128)', bg: 'rgba(156, 163, 175, 0.1)', icon: HelpCircle }
  };

  const reservationsParCategorie = stats.reservationsParCategorie || {
    sante: 0,
    beaute: 0,
    restaurant: 0,
    hotel: 0,
    autre: 0
  };

  const totalCategoryReservations = Object.values(reservationsParCategorie).reduce((a, b) => a + b, 0) || stats.reservations || 1;

  // Calculate percentage helper
  const getPercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  return (
    <div className="container animate-fade-in" style={{ textAlign: 'left', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.03) 0%, rgba(15, 23, 42, 0.07) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 6px 0', background: 'linear-gradient(135deg, var(--text-main), var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Espace Super Administration Wakti 👑
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Supervisez les inscriptions, validez les prestataires professionnels et analysez les volumes de réservation.
          </p>
        </div>
        
        {/* Quick actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleGenerateReport} 
            className="btn btn-secondary animate-hover"
            style={{ padding: '12px 20px', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}
          >
            <FileText size={18} />
            Exporter Rapport JSON
          </button>
          <button 
            onClick={fetchAdminData} 
            className="btn btn-secondary animate-hover"
            style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Rafraîchir les données"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Responsive Grid Layout */}
      <div className="admin-layout">
        <style>{`
          .admin-layout {
            display: grid;
            grid-template-columns: 260px 1fr;
            gap: 32px;
          }
          .admin-sidebar {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .sidebar-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 14px 18px;
            border: none;
            background: transparent;
            border-radius: var(--radius-md);
            color: var(--text-muted);
            font-weight: 600;
            font-size: 0.95rem;
            text-align: left;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .sidebar-btn:hover {
            background-color: var(--surface);
            color: var(--text);
          }
          .sidebar-btn.active {
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(79, 70, 229, 0.08));
            color: var(--primary);
            box-shadow: inset 0 0 0 1px rgba(124, 58, 237, 0.15);
            font-weight: 700;
          }
          .admin-table {
            width: 100%;
            border-collapse: collapse;
          }
          .admin-table th, .admin-table td {
            padding: 14px 16px;
            text-align: left;
            border-bottom: 1px solid var(--border);
          }
          .admin-table th {
            font-weight: 700;
            background-color: var(--bg);
            font-size: 0.8rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .admin-table td {
            font-size: 0.9rem;
          }
          .admin-table tr:hover {
            background-color: rgba(124, 58, 237, 0.01);
          }
          @media (max-width: 900px) {
            .admin-layout {
              grid-template-columns: 1fr !important;
              gap: 20px;
            }
            .admin-sidebar {
              flex-direction: row !important;
              overflow-x: auto;
              padding-bottom: 8px;
              border-bottom: 1px solid var(--border);
            }
            .sidebar-btn {
              white-space: nowrap;
              width: auto;
            }
          }
        `}</style>

        {/* Sidebar Menu */}
        <aside className="admin-sidebar">
          <button 
            onClick={() => { setActiveTab('overview'); setSearchTerm(''); }}
            className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LayoutDashboard size={18} />
              Vue d'ensemble
            </div>
          </button>

          <button 
            onClick={() => { setActiveTab('prestataires'); setSearchTerm(''); }}
            className={`sidebar-btn ${activeTab === 'prestataires' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={18} />
              Validation Pros
            </div>
            {stats.pendingPrestataires > 0 && (
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--danger)', color: '#fff', fontWeight: 700 }}>
                {stats.pendingPrestataires}
              </span>
            )}
          </button>

          <button 
            onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
            className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={18} />
              Base Utilisateurs
            </div>
          </button>

          <button 
            onClick={() => { setActiveTab('stats-categories'); setSearchTerm(''); }}
            className={`sidebar-btn ${activeTab === 'stats-categories' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BarChart3 size={18} />
              Analyses & Graphiques
            </div>
          </button>
        </aside>

        {/* Main Content Pane */}
        <main className="admin-content-pane">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {[
                  { title: 'Utilisateurs inscrits', value: stats.users, detail: `${clients.length} Clients | ${prestataires.length} Pros`, color: 'var(--primary)', bg: 'rgba(124, 58, 237, 0.1)', icon: Users },
                  { title: 'Réservations Globales', value: stats.reservations, detail: 'Toutes catégories', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: Calendar },
                  { title: 'Prestations enregistrées', value: stats.services, detail: 'Services répertoriés', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: Award },
                  { title: 'Avis Laissés', value: stats.avis, detail: 'Évaluations clients', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', icon: MessageSquare }
                ].map((stat, idx) => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={idx} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'var(--surface)' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: stat.bg,
                        color: stat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <StatIcon size={24} />
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {stat.title}
                        </p>
                        <h3 style={{ margin: '0 0 2px 0', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {stat.value}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.detail}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Validation Alert Box */}
              {stats.pendingPrestataires > 0 && (
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ color: '#f59e0b', display: 'flex' }}>
                      <AlertTriangle size={32} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Validation requise ({stats.pendingPrestataires} pro en attente)
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        De nouveaux prestataires tunisiens attendent votre validation administrative pour apparaître dans les recherches.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('prestataires')} 
                    className="btn btn-primary animate-hover" 
                    style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    Valider maintenant
                  </button>
                </div>
              )}

              {/* Mini visual summary of categories */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }} className="dashboard-layout">
                <style>{`
                  @media (max-width: 1024px) {
                    .dashboard-layout {
                      grid-template-columns: 1fr !important;
                    }
                  }
                `}</style>
                
                {/* Bookings category chart preview */}
                <div className="card" style={{ padding: '28px', backgroundColor: 'var(--surface)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
                    Volume de Réservations par Secteur
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {Object.entries(reservationsParCategorie).map(([key, count]) => {
                      const cfg = categoryConfigs[key] || categoryConfigs.autre;
                      const pct = getPercentage(count, totalCategoryReservations);
                      return (
                        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                            <span style={{ color: 'var(--text-main)' }}>{cfg.label}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: cfg.color, borderRadius: '4px' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit & security controls */}
                <div className="card" style={{ padding: '28px', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={18} style={{ color: '#10b981' }} />
                      Ressources & Sécurité
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                      En tant qu'administrateur de Wakti, vous pouvez contrôler l'intégrité de la plateforme. Vous pouvez bannir des clients abusifs, auditer les avis des utilisateurs ou modifier les clés d'API.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Comptes bloqués</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--danger)' }}>
                          {usersList.filter(u => u.isBlocked).length}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Taux d'activation pros</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {getPercentage(prestataires.filter(p => p.statutPrestataire === 'valide').length, prestataires.length)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('users')} 
                    className="btn btn-secondary" 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '24px', fontSize: '0.85rem' }}
                  >
                    Gérer les utilisateurs <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: VALIDATION PROS */}
          {activeTab === 'prestataires' && (
            <div className="card animate-fade-in" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />
                  Validation des Prestataires ({filteredPros.length})
                </h2>
                
                {/* Filters */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select 
                    value={validationFilter} 
                    onChange={(e) => setValidationFilter(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente uniquement</option>
                    <option value="validated">Validés uniquement</option>
                  </select>
                </div>
              </div>

              {/* Table search bar */}
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Rechercher un prestataire par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '44px', width: '100%' }}
                />
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Prestataire</th>
                      <th>Catégorie</th>
                      <th>Email / Tél</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPros.map(p => (
                      <tr key={p._id || p.id}>
                        <td>
                          <strong style={{ display: 'block', fontSize: '0.95rem' }}>{p.nom}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {p._id || p.id}</span>
                        </td>
                        <td style={{ textTransform: 'capitalize', fontWeight: 600 }}>{p.categorie}</td>
                        <td>
                          <span style={{ display: 'block', fontSize: '0.85rem' }}>{p.email}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.telephone || 'Aucun'}</span>
                        </td>
                        <td>
                          {p.statutPrestataire === 'valide' || p.isValidatedPrestataire ? (
                            <span style={{ padding: '6px 10px', borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'rgb(5, 150, 105)', fontSize: '0.75rem', fontWeight: 700 }}>
                              Actif / Validé
                            </span>
                          ) : (
                            <span style={{ padding: '6px 10px', borderRadius: '20px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'rgb(217, 119, 6)', fontSize: '0.75rem', fontWeight: 700 }}>
                              En attente
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {!(p.statutPrestataire === 'valide' || p.isValidatedPrestataire) && (
                              <button
                                onClick={() => handleValidatePrestataire(p._id || p.id)}
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                              >
                                Activer
                              </button>
                            )}
                            {p.isBlocked ? (
                              <button
                                onClick={() => handleUnblockUser(p._id || p.id)}
                                className="btn btn-secondary"
                                style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--success)' }}
                              >
                                Débloquer
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlockUser(p._id || p.id)}
                                className="btn"
                                style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--danger)', fontWeight: 600 }}
                              >
                                Bloquer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPros.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          Aucun prestataire ne correspond à votre recherche ou filtre.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: USER MANAGEMENT DATABASE */}
          {activeTab === 'users' && (
            <div className="card animate-fade-in" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Users size={22} style={{ color: 'var(--primary)' }} />
                  Base de Données Utilisateurs ({filteredUsers.length})
                </h2>
                
                {/* Filters */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    <option value="all">Tous les rôles</option>
                    <option value="client">Clients uniquement</option>
                    <option value="prestataire">Prestataires uniquement</option>
                    <option value="blocked">Utilisateurs bloqués</option>
                  </select>
                </div>
              </div>

              {/* Search bar */}
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Rechercher par nom, email ou numéro de téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '44px', width: '100%' }}
                />
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Rôle</th>
                      <th>Email & Tél</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u._id || u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: u.role === 'admin' ? '#0f172a' : u.role === 'prestataire' ? 'var(--primary-light)' : 'var(--border)',
                              color: u.role === 'admin' ? '#fff' : 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem'
                            }}>
                              {u.nom.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.9rem' }}>{u.nom}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Créé le : {u.createdAt ? u.createdAt.substring(0, 10) : 'Récemment'}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: u.role === 'admin' ? '#f1f5f9' : u.role === 'prestataire' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                            color: u.role === 'admin' ? '#334155' : u.role === 'prestataire' ? 'var(--primary)' : 'rgb(37, 99, 235)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span style={{ display: 'block', fontSize: '0.85rem' }}>{u.email}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.telephone || 'Aucun'}</span>
                        </td>
                        <td>
                          {u.isBlocked ? (
                            <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'rgb(220, 38, 38)', fontSize: '0.75rem', fontWeight: 700 }}>
                              Bloqué
                            </span>
                          ) : (
                            <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'rgb(5, 150, 105)', fontSize: '0.75rem', fontWeight: 700 }}>
                              Actif
                            </span>
                          )}
                        </td>
                        <td>
                          {u.role !== 'admin' && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {u.isBlocked ? (
                                <button
                                  onClick={() => handleUnblockUser(u._id || u.id)}
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--success)' }}
                                >
                                  Débloquer
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleBlockUser(u._id || u.id)}
                                  className="btn"
                                  style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--danger)', fontWeight: 600 }}
                                >
                                  Bloquer
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          Aucun utilisateur trouvé correspondant à votre recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'stats-categories' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* Detailed Category statistics */}
              <div className="card" style={{ padding: '32px', backgroundColor: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(124, 58, 237, 0.1)', color: 'var(--primary)' }}>
                    <BarChart3 size={20} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Répartition Détaillée des Activités</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px' }}>
                  Représentation visuelle des parts de marché et réservation par secteur de la plateforme Wakti en Tunisie.
                </p>

                {/* Progress bars list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {Object.entries(reservationsParCategorie).map(([key, count]) => {
                    const cfg = categoryConfigs[key] || categoryConfigs.autre;
                    const IconComponent = cfg.icon;
                    const pct = getPercentage(count, totalCategoryReservations);
                    
                    return (
                      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center' }}>
                              <IconComponent size={18} />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{cfg.label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{count} réservation(s)</span>
                            <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: cfg.bg, color: cfg.color, fontSize: '0.75rem', fontWeight: 700 }}>
                              {pct}%
                            </span>
                          </div>
                        </div>
                        {/* Custom progress bar */}
                        <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: cfg.color, borderRadius: '5px', transition: 'width 0.8s ease' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Audit report insights list */}
              <div className="card" style={{ padding: '28px', borderLeft: '4px solid var(--primary)', backgroundColor: 'var(--surface)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                  Indicateurs de Croissance et Recommandations
                </h3>
                <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                  <li style={{ marginBottom: '8px' }}>
                    Le ratio clients / prestataires est de <strong>{clients.length}:{prestataires.length}</strong>. La plateforme dispose d'une bonne offre de services par rapport à la demande.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    Le taux moyen de validation des nouveaux professionnels est de <strong>{getPercentage(prestataires.filter(p => p.statutPrestataire === 'valide').length, prestataires.length)}%</strong>. Un taux élevé indique une réactivité de validation rapide.
                  </li>
                  <li>
                    <strong>Action recommandée :</strong> Relancez par e-mail les {stats.pendingPrestataires} prestataires en attente pour récupérer leurs pièces justificatives et finaliser leur inscription.
                  </li>
                </ul>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
