import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, MessageSquare, Star, Trash2, Send, Bot, Clock, 
  AlertTriangle, ShieldCheck, LayoutDashboard, User, MapPin, 
  Phone, Mail, Camera, ChevronRight, CheckCircle2, Award, Sparkles, LogOut
} from 'lucide-react';

const ClientDashboard = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in or not a client
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'prestataire') {
      navigate('/provider-dashboard');
    }
  }, [user]);

  // Tab State: 'overview', 'appointments', 'assistant', 'profile'
  const [activeTab, setActiveTab] = useState('overview');
  
  // Services & Reservations state
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Chatbot state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState(user?.chatbotHistory || []);
  const [chatLoading, setChatLoading] = useState(false);

  // Review state
  const [reviewServiceId, setReviewServiceId] = useState(null);
  const [rating, setRating] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Profile edit state
  const [editNom, setEditNom] = useState(user?.nom || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [profileImgError, setProfileImgError] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    setProfileImgError(false);
  }, [user?.profilePicture]);

  // File selection change helper
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  // Mock reservations fallback
  const mockReservations = [
    {
      _id: 'mock-res-1',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      statut: 'en_attente',
      prixTotal: 15,
      service: { nom: 'Table 2 (4 personnes - En terrasse)', categorie: 'restaurant' },
      prestataire: { nom: 'Restaurant El Amel', adresse: 'Port El Kantaoui, Sousse' }
    },
    {
      _id: 'mock-res-2',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      statut: 'complete',
      prixTotal: 60,
      service: { _id: 'service-beaute-id', nom: 'Massage Californien Relaxant', categorie: 'centre de beaute' },
      prestataire: { nom: 'Nirvana Spa & Beauté', adresse: 'Avenue Hédi Nouira, Ennasr 2, Tunis' }
    }
  ];

  const fetchHistory = async () => {
    if (!user?._id) return;
    try {
      const response = await fetch(`/users/${user._id}/historique`);
      if (response.ok) {
        const data = await response.json();
        if (data.reservations && data.reservations.length > 0) {
          setReservations(data.reservations);
        } else {
          setReservations(mockReservations);
        }
        if (data.chatbotHistory) {
          setChatHistory(data.chatbotHistory);
        }
      } else {
        setReservations(mockReservations);
      }
    } catch (err) {
      console.warn('Backend history retrieval failed, using mock data');
      setReservations(mockReservations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // Cancel reservation
  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;

    try {
      const response = await fetch(`/users/${user._id}/annulerReservation/${reservationId}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'annulation');
      }

      alert('Rendez-vous annulé avec succès.');
      fetchHistory();
    } catch (err) {
      alert(err.message || 'Impossible d\'annuler la réservation.');
    }
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewServiceId) return;

    setReviewLoading(true);
    setReviewSuccess('');
    setReviewError('');

    try {
      const response = await fetch(`/users/${user._id}/laisserAvis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: rating,
          commentaire,
          service: reviewServiceId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission de l\'avis');
      }

      setReviewSuccess('Merci ! Votre avis a été enregistré.');
      setCommentaire('');
      setReviewServiceId(null);
      fetchHistory();
    } catch (err) {
      setReviewError(err.message || 'Impossible de laisser l\'avis.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Submit chat message to Bot
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatLoading(true);

    setChatHistory(prev => [...prev, { message: userMsg, response: 'Le bot est en train d\'analyser votre message...', createdAt: new Date() }]);

    try {
      const response = await fetch(`/users/${user._id}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();

      if (response.ok && data.result) {
        setChatHistory(prev => {
          const list = [...prev];
          list[list.length - 1] = data.result;
          return list;
        });
        
        if (user) {
          const updatedUser = { ...user, chatbotHistory: [...(user.chatbotHistory || []), data.result] };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } else {
        throw new Error('Erreur de communication avec le chatbot');
      }
    } catch (err) {
      setChatHistory(prev => {
        const list = [...prev];
        list[list.length - 1] = { message: userMsg, response: 'Erreur: Le service chatbot est actuellement indisponible.', createdAt: new Date() };
        return list;
      });
    } finally {
      setChatLoading(false);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editNom.trim()) {
      setEditError('Le nom est requis.');
      return;
    }

    setEditLoading(true);
    setEditError('');
    setEditSuccess('');

    try {
      const formData = new FormData();
      formData.append('nom', editNom.trim());
      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }

      const response = await fetch(`/users/${user._id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erreur lors de la mise à jour du profil.');
      }

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setEditSuccess('Votre profil a été mis à jour avec succès !');
      setSelectedFile(null);
      setFilePreview(null);
    } catch (err) {
      setEditError(err.message || 'Impossible de mettre à jour le profil.');
    } finally {
      setEditLoading(false);
    }
  };

  // Helpers
  const getStatusBadge = (status) => {
    switch (status) {
      case 'complete':
        return <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'rgb(5, 150, 105)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>Complété</span>;
      case 'annule':
        return <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'rgb(220, 38, 38)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>Annulé</span>;
      default:
        return <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'rgb(217, 119, 6)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>En attente</span>;
    }
  };

  // Next upcoming reservation card calculation
  const upcomingReservations = reservations.filter(r => r.statut === 'en_attente' && new Date(r.date) > new Date());
  upcomingReservations.sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextReservation = upcomingReservations.length > 0 ? upcomingReservations[0] : null;

  if (!user) return null;

  return (
    <div className="container animate-fade-in" style={{ textAlign: 'left', paddingBottom: '60px' }}>
      
      {/* Premium Dashboard Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(79, 70, 229, 0.08) 100%)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--primary-light)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '2.25rem',
            fontWeight: 800,
            flexShrink: 0
          }}>
            {user.profilePicture && !profileImgError ? (
              <img 
                src={user.profilePicture} 
                alt={user.nom} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={() => setProfileImgError(true)}
              />
            ) : (
              user.nom.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 6px 0', background: 'linear-gradient(135deg, var(--text-main), var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ravi de vous revoir, {user.nom} ! 👋
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Gérez vos rendez-vous et réservez de nouvelles prestations sur votre plateforme Wakti.
            </p>
          </div>
        </div>
        
        {/* Quick action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navigate('/search')} 
            className="btn btn-primary animate-hover"
            style={{ padding: '12px 24px', fontSize: '0.95rem', fontWeight: 600 }}
          >
            Réserver un service
          </button>
          <button 
            onClick={logout} 
            className="btn btn-secondary" 
            style={{ padding: '12px 18px', gap: '6px', fontSize: '0.95rem', fontWeight: 600 }}
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Tabs Navigation Selector */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        marginBottom: '32px',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'overview', label: 'Mon Aperçu', icon: LayoutDashboard },
          { id: 'appointments', label: 'Mes Rendez-vous', icon: Calendar },
          { id: 'assistant', label: 'Wakti Assistant AI', icon: Bot },
          { id: 'profile', label: 'Mon Profil', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="animate-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 20px',
                border: 'none',
                background: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.95rem',
                borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENTS */}
      <div className="tab-contents">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {[
                { title: 'Total Réservations', value: reservations.length, label: 'Historique complet', color: 'var(--primary)', icon: Calendar },
                { title: 'RDV Actifs', value: reservations.filter(r => r.statut === 'en_attente').length, label: 'À honorer', color: '#f59e0b', icon: Clock },
                { title: 'Prestations Honorées', value: reservations.filter(r => r.statut === 'complete').length, label: 'Complétées avec succès', color: '#10b981', icon: CheckCircle2 },
                { title: 'Avis Laissés', value: reservations.filter(r => r.statut === 'complete' && r.avis).length, label: 'Partages d\'expérience', color: '#ec4899', icon: Star }
              ].map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div key={idx} className="card" style={{ padding: '24px', backgroundColor: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: `${stat.color}15`,
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
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Reservation & Discovery section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="dashboard-layout">
              <style>{`
                @media (max-width: 900px) {
                  .dashboard-layout {
                    grid-template-columns: 1fr !important;
                  }
                }
              `}</style>

              {/* Next upcoming appointment */}
              <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border)', background: 'linear-gradient(to bottom, var(--surface) 0%, rgba(124, 58, 237, 0.02) 100%)' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={20} style={{ color: 'var(--primary)' }} />
                    Prochain Rendez-vous
                  </h3>
                  
                  {nextReservation ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '1rem', display: 'inline-block', width: 'fit-content' }}>
                        {new Date(nextReservation.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginTop: '4px', opacity: 0.9 }}>
                          ⏰ à {new Date(nextReservation.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div style={{ textAlign: 'left' }}>
                        <strong style={{ fontSize: '1.15rem', display: 'block', color: 'var(--text-main)', marginBottom: '4px' }}>
                          {nextReservation.service?.nom}
                        </strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                          Avec : <strong>{nextReservation.prestataire?.nom}</strong>
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} style={{ color: 'var(--primary)' }} />
                          {nextReservation.prestataire?.adresse}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '30px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <Calendar size={40} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Aucun rendez-vous à venir.</p>
                      <button onClick={() => navigate('/search')} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        Prendre un rendez-vous
                      </button>
                    </div>
                  )}
                </div>
                
                {nextReservation && (
                  <button 
                    onClick={() => setActiveTab('appointments')} 
                    className="btn btn-secondary" 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '24px', fontSize: '0.85rem', padding: '10px' }}
                  >
                    Gérer ce rendez-vous <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {/* Discovery & Support widget */}
              <div className="card" style={{ padding: '28px', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sparkles size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Besoin d'aide ou de conseils ?</h3>
                </div>
                
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Notre intelligence artificielle est programmée pour répondre à toutes vos interrogations sur les prestataires de Tunisie, vous guider pour vos réservations ou vous trouver le médecin le plus proche.
                </p>

                <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border)' }}>
                  <Bot size={24} style={{ color: 'var(--primary)' }} />
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <span style={{ display: 'block', fontWeight: 700, color: 'var(--text-main)' }}>Assistant intelligent Wakti</span>
                    "Bonjour ! Je suis là pour vous aider à trouver votre médecin, un resto..."
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('assistant')} 
                  className="btn btn-primary" 
                  style={{ width: 'fit-content', padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  Discuter avec l'assistant AI
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} style={{ color: 'var(--primary)' }} />
              Historique de mes rendez-vous
            </h3>

            {/* Review form display overlay if active */}
            {reviewServiceId && (
              <div style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--primary)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '28px',
                boxShadow: 'var(--shadow-md)'
              }} className="animate-fade-in">
                <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 700 }}>Laisser une évaluation</h4>
                
                {reviewSuccess && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '10px' }}>{reviewSuccess}</p>}
                {reviewError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '10px' }}>{reviewError}</p>}

                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Note</label>
                    <div style={{ display: 'flex', gap: '8px', color: '#fbbf24', fontSize: '1.5rem', cursor: 'pointer' }}>
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', padding: 0 }}
                        >
                          <Star size={28} fill={starVal <= rating ? 'currentColor' : 'none'} stroke="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Commentaire</label>
                    <textarea
                      className="form-input"
                      rows="3"
                      placeholder="Comment s'est passée votre visite ?"
                      value={commentaire}
                      onChange={(e) => setCommentaire(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={reviewLoading} className="btn btn-primary" style={{ padding: '10px 20px' }}>
                      {reviewLoading ? 'Envoi...' : 'Soumettre mon avis'}
                    </button>
                    <button type="button" onClick={() => setReviewServiceId(null)} className="btn btn-secondary" style={{ padding: '10px 20px' }}>
                      Fermer
                    </button>
                  </div>
                </form>
              </div>
            )}

            {reservations.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Prestation</th>
                      <th>Professionnel</th>
                      <th>Date & Heure</th>
                      <th>Tarif</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => {
                      const resDate = new Date(res.date);
                      const isPast = resDate < new Date();
                      
                      return (
                        <tr key={res._id || res.id} className="animate-hover">
                          <td>
                            <strong style={{ display: 'block', fontSize: '0.95rem' }}>{res.service?.nom || 'Prestation'}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                              {res.service?.categorie || 'Service'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{res.prestataire?.nom || 'Prestataire'}</span>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              📍 {res.prestataire?.adresse || 'Cabinet'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 500 }}>
                              {resDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <Clock size={12} />
                              {resDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{res.prixTotal} DT</td>
                          <td>{getStatusBadge(res.statut)}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {res.statut === 'en_attente' && !isPast && (
                                <button
                                  onClick={() => handleCancelReservation(res._id || res.id)}
                                  className="btn-icon animate-hover"
                                  title="Annuler le rendez-vous"
                                  style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', width: '36px', height: '36px', borderRadius: '50%' }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                              {isPast && res.statut !== 'annule' && (
                                <button
                                  onClick={() => setReviewServiceId(res.service?._id || res.service)}
                                  className="btn btn-secondary animate-hover"
                                  style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '4px', borderRadius: '8px' }}
                                >
                                  <Star size={12} fill="currentColor" />
                                  Évaluer
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 10px' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Vous n'avez pas encore effectué de réservation.</p>
                <button onClick={() => navigate('/search')} className="btn btn-primary">
                  Réserver mon premier service
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. ASSISTANT AI TAB */}
        {activeTab === 'assistant' && (
          <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', height: '550px' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px', margin: 0 }}>
              <Bot size={22} style={{ color: 'var(--primary)' }} />
              Assistant Virtuel Wakti AI
            </h3>
            
            {/* Chat Box */}
            <div className="chat-box" style={{ flexGrow: 1, marginBottom: '20px', borderRadius: '12px' }}>
              <div className="chat-bubble-bot">
                Bonjour <strong>{user.nom}</strong> ! Je suis votre conseiller personnel Wakti. Comment puis-je vous aider dans vos démarches aujourd'hui ? 
                <div style={{ marginTop: '8px', fontSize: '0.8rem', opacity: 0.9, fontStyle: 'italic' }}>
                  Exemples : "Je cherche un médecin des yeux à Tunis", "Recommander une table à Sousse", "Comment se passe la réservation par mail ?"
                </div>
              </div>

              {chatHistory.map((chat, idx) => (
                <React.Fragment key={idx}>
                  <div className="chat-bubble-user">{chat.message}</div>
                  <div className="chat-bubble-bot">{chat.response}</div>
                </React.Fragment>
              ))}

              {chatLoading && (
                <div style={{ display: 'flex', gap: '6px', padding: '12px 18px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', width: 'fit-content' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', animation: 'bounce 0.6s infinite alternate' }}></span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', animation: 'bounce 0.6s infinite alternate 0.2s' }}></span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', animation: 'bounce 0.6s infinite alternate 0.4s' }}></span>
                </div>
              )}
            </div>

            {/* Quick chips suggested prompts */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
              {[
                "Ophtalmologue à Tunis",
                "Restaurant à Sousse",
                "Comment réserver sur Wakti ?"
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setChatMessage(chip);
                  }}
                  className="btn btn-secondary animate-hover"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px', whiteSpace: 'nowrap' }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Form submit input */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Écrivez votre message ou votre question ici..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                style={{ padding: '12px 16px', borderRadius: '10px' }}
                disabled={chatLoading}
              />
              <button 
                type="submit" 
                className="btn btn-primary animate-hover" 
                style={{ padding: '12px 20px', borderRadius: '10px' }} 
                disabled={chatLoading}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

        {/* 4. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px' }} className="dashboard-layout">
            
            {/* Left side: Avatar picture selector */}
            <div className="card" style={{ padding: '28px', textAlign: 'center', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '20px', fontWeight: 700 }}>Avatar</h3>
              
              <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 24px auto' }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid var(--primary-light)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '3.5rem',
                  fontWeight: 800
                }}>
                  {filePreview ? (
                    <img src={filePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : user.profilePicture && !profileImgError ? (
                    <img src={user.profilePicture} alt={user.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setProfileImgError(true)} />
                  ) : (
                    user.nom.charAt(0).toUpperCase()
                  )}
                </div>
                
                {/* Upload overlay label */}
                <label 
                  htmlFor="profile-upload"
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-md)',
                    border: '3px solid var(--surface)'
                  }}
                  title="Télécharger une photo de profil"
                >
                  <Camera size={16} />
                </label>
                <input 
                  type="file" 
                  id="profile-upload" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>Photo de profil</span>
                PNG, JPG ou JPEG. Recommandé : Image carrée d'au moins 200x200 pixels.
              </div>
            </div>

            {/* Right side: User information editor */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                Informations du compte
              </h3>
              
              {editError && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.05)', marginBottom: '16px', fontWeight: 600 }}>{editError}</div>}
              {editSuccess && <div style={{ color: 'var(--success)', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.05)', marginBottom: '16px', fontWeight: 600 }}>{editSuccess}</div>}

              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="dashboard-layout">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nom complet</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editNom}
                      onChange={(e) => setEditNom(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Numéro de téléphone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={user.telephone || ''}
                      disabled
                      style={{ backgroundColor: 'var(--surface-dark)', opacity: 0.8, cursor: 'not-allowed' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Pour modifier votre téléphone, veuillez contacter l'administration.</span>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Adresse email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={user.email}
                    disabled
                    style={{ backgroundColor: 'var(--surface-dark)', opacity: 0.8, cursor: 'not-allowed' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>L'adresse email ne peut pas être modifiée car elle sert d'identifiant unique.</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="btn btn-primary animate-hover"
                    style={{ padding: '12px 24px', fontSize: '0.95rem', fontWeight: 600 }}
                  >
                    {editLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '12px 20px', fontSize: '0.95rem' }}
                    >
                      Annuler l'image
                    </button>
                  )}
                </div>
              </form>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default ClientDashboard;
