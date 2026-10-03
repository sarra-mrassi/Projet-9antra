import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Star, MapPin, Calendar, Clock, ChevronRight, CheckCircle, ShieldAlert, Phone, Info } from 'lucide-react';
import { getCategoryStyles } from '../components/ServiceCard';

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom booking states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Restaurant / Hotel specific states
  const [itemsList, setItemsList] = useState([]); // List of tables or rooms
  const [selectedItemId, setSelectedItemId] = useState(''); // ID of selected table/room
  
  // Booking submissions states
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Wizard steps & SMS verification states
  const [bookingStep, setBookingStep] = useState(1); // 1: Date/Heure, 2: Verification, 3: Confirmation, 4: Success
  const [phoneNumber, setPhoneNumber] = useState('');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [sentCode, setSentCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [smsSimulationAlert, setSmsSimulationAlert] = useState('');

  // Review states
  const [reviews, setReviews] = useState([
    { nom: 'Kamel M.', note: 5, commentaire: 'Prestation impeccable et professionnelle. Je recommande vivement.' },
    { nom: 'Sarah B.', note: 4, commentaire: 'Très bon accueil et explications claires. Je suis très satisfaite.' }
  ]);
  const [reviewNote, setReviewNote] = useState(5);
  const [reviewCommentaire, setReviewCommentaire] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Fallback Mock Services
  const mockServices = [
    {
      _id: 'mock-1',
      nom: 'Consultation Ophtalmologie',
      description: 'Bilan complet de la vue, examen du fond d’œil et prescription lunettes/lentilles. Le Dr. Salma Touil est ophtalmologue diplômée de la Faculté de Médecine de Tunis, forte de 12 ans d’expérience.',
      prix: 75,
      categorie: 'medecin',
      prestataire: {
        _id: 'prest-salma',
        nom: 'Dr. Salma Touil',
        adresse: 'Avenue Habib Bourguiba, Tunis',
        note: 4.8,
        telephone: '+216 71 900 100'
      }
    },
    {
      _id: 'mock-2',
      nom: 'Soin du Visage & Massage Spa',
      description: 'Détente absolue avec un massage relaxant aux huiles essentielles de jasmin et un soin hydratant complet du visage.',
      prix: 65,
      categorie: 'centre de beaute',
      prestataire: {
        _id: 'prest-nirvana',
        nom: 'Nirvana Spa & Beauté',
        adresse: 'Avenue Hédi Nouira, Ennasr 2, Tunis',
        note: 4.8,
        telephone: '+216 70 800 900'
      }
    },
    {
      _id: 'mock-3',
      nom: 'Table 1 (2 personnes - Près de la fenêtre)',
      description: 'Réservez une table romantique face au port de plaisance. Parfait pour les couples.',
      prix: 0,
      categorie: 'restaurant',
      prestataire: {
        _id: 'prest-amel',
        nom: 'Restaurant El Amel',
        adresse: 'Port El Kantaoui, Sousse',
        note: 4.6,
        telephone: '+216 73 222 333'
      }
    },
    {
      _id: 'mock-9',
      nom: 'Suite Junior (Vue sur Patio Tunisien)',
      description: 'Suite traditionnelle de 35m² décorée d’arabesques, grand lit king size, salle de bain en marbre et vue sur le patio.',
      prix: 280,
      categorie: 'hotel',
      prestataire: {
        _id: 'prest-jeld',
        nom: 'Dar El Jeld Hotel & Spa',
        adresse: 'Rue Dar El Jeld, La Médina, Tunis',
        note: 4.9,
        telephone: '+216 71 560 916'
      }
    }
  ];

  // Mock list of tables for a restaurant
  const mockTables = [
    { _id: 't-1', nom: 'Table 1 (2 personnes - Près de la fenêtre)', prix: 0, description: 'Table calme en bordure vitrée.' },
    { _id: 't-2', nom: 'Table 2 (4 personnes - En terrasse)', prix: 0, description: 'Table en plein air sous pergola.' },
    { _id: 't-3', nom: 'Table 3 (6 personnes - Salon Privé)', prix: 15, description: 'Espace clos climatisé.' }
  ];

  // Mock list of rooms for an hotel
  const mockRooms = [
    { _id: 'c-1', nom: 'Suite Junior (Vue sur Patio)', prix: 280, description: 'Lit King-size, douche italienne et salon traditionnel.' },
    { _id: 'c-2', nom: 'Suite Royale (Vue Medina)', prix: 450, description: 'Terrasse privée, jacuzzi, vue panoramique.' },
    { _id: 'c-3', nom: 'Chambre Single (Vue Jardin)', prix: 120, description: 'Lit simple, tout confort, calme absolu.' }
  ];

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/services/${id}`);
        if (response.ok) {
          const data = await response.json();
          setService(data.service);
          
          // Once service is loaded, if it's a restaurant or hotel,
          // fetch other items (tables/rooms) from the same provider.
          const providerId = data.service.prestataire?._id || data.service.prestataire;
          const cat = data.service.categorie;
          
          const listResponse = await fetch('/services');
          if (listResponse.ok) {
            const listData = await listResponse.json();
            const filtered = listData.services?.filter(
              s => (s.prestataire?._id === providerId || s.prestataire === providerId) && s.categorie === cat
            );
            
            if (filtered && filtered.length > 0) {
              setItemsList(filtered);
              setSelectedItemId(data.service._id); // Select current item by default
            } else {
              setItemsList(cat === 'restaurant' ? mockTables : cat === 'hotel' ? mockRooms : []);
            }
          } else {
            setItemsList(cat === 'restaurant' ? mockTables : cat === 'hotel' ? mockRooms : []);
          }
        } else {
          // Check mocks
          const mock = mockServices.find(s => s._id === id || s.id === id);
          if (mock) {
            setService(mock);
            const cat = mock.categorie;
            setItemsList(cat === 'restaurant' ? mockTables : cat === 'hotel' ? mockRooms : []);
            setSelectedItemId(mock._id);
          } else {
            setError('Service introuvable');
          }
        }
      } catch (err) {
        const mock = mockServices.find(s => s._id === id || s.id === id);
        if (mock) {
          setService(mock);
          const cat = mock.categorie;
          setItemsList(cat === 'restaurant' ? mockTables : cat === 'hotel' ? mockRooms : []);
          setSelectedItemId(mock._id);
        } else {
          setError('Erreur de connexion');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // Handle booking form steps
  const goToVerificationStep = (e) => {
    e?.preventDefault();
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (user.role !== 'client') {
      setBookingError('Seuls les clients peuvent faire une réservation.');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setBookingError('Veuillez sélectionner la date et l’heure.');
      return;
    }

    setBookingError('');
    setBookingStep(2);
  };

  const sendSmsCode = async (e) => {
    e?.preventDefault();
    if (!phoneNumber || phoneNumber.replace(/\s+/g, '').length < 8) {
      setBookingError('Veuillez saisir un numéro de téléphone tunisien valide (8 chiffres).');
      return;
    }
    if (!clientEmail || !clientEmail.includes('@')) {
      setBookingError('Veuillez saisir une adresse email valide.');
      return;
    }

    setSubmitting(true);
    setBookingError('');
    setSmsSimulationAlert('');

    try {
      const response = await fetch('/reservations/send-sms-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telephone: phoneNumber, email: clientEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l’envoi du code.');
      }

      setSmsSimulationAlert(`Un code de validation de 4 chiffres a été envoyé à votre adresse email : ${clientEmail}. Veuillez le saisir ci-dessous.`);

      setBookingStep(3);
    } catch (err) {
      setBookingError(err.message || 'Impossible d’envoyer le code de validation.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmCodeAndBook = async (e) => {
    e?.preventDefault();
    setSubmitting(true);
    setBookingError('');

    try {
      // 1. Verify code on the backend
      const verifyResponse = await fetch('/reservations/verify-sms-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telephone: phoneNumber, code: enteredCode }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Code de confirmation incorrect.');
      }

      // 2. Code is valid, proceed with booking
      const selectedItemObj = itemsList.find(i => i._id === selectedItemId || i.id === selectedItemId) || service;
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);

      const payload = {
        date: dateTime.toISOString(),
        statut: 'en_attente',
        prixTotal: selectedItemObj.prix,
        service: selectedItemObj._id || selectedItemObj.id,
        prestataire: service.prestataire?._id || service.prestataire || 'prest-salma',
        telephoneClient: phoneNumber
      };

      const response = await fetch(`/users/${user._id}/faireReservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du traitement de la réservation.');
      }

      setBookingSuccess(true);
      setBookingStep(4);
    } catch (err) {
      setBookingError(err.message || 'Impossible de valider la réservation.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

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
          note: reviewNote,
          commentaire: reviewCommentaire,
          service: service._id || service.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la publication de l’avis');
      }

      setReviewSuccess('Votre avis a été publié avec succès !');
      setReviews(prev => [{ nom: user.nom, note: reviewNote, commentaire: reviewCommentaire }, ...prev]);
      setReviewCommentaire('');
    } catch (err) {
      // Offline fallback
      setReviews(prev => [{ nom: user.nom, note: reviewNote, commentaire: reviewCommentaire }, ...prev]);
      setReviewSuccess('Avis ajouté localement.');
      setReviewCommentaire('');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '5px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '20px' }}>Chargement...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="card animate-fade-in" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <ShieldAlert size={48} style={{ color: 'var(--danger)', marginBottom: '16px' }} />
        <h2>Service introuvable</h2>
        <p style={{ marginBottom: '24px' }}>Le prestataire n'existe pas ou la connexion a échoué.</p>
        <Link to="/search" className="btn btn-primary">Retour aux services</Link>
      </div>
    );
  }

  const catStyles = getCategoryStyles(service.categorie);
  const CatIcon = catStyles.icon;
  const provider = service.prestataire || {};
  const isRestaurant = service.categorie === 'restaurant';
  const isHotel = service.categorie === 'hotel';
  const isMedecin = service.categorie === 'medecin' || service.categorie === 'clinique';

  // Determine pricing dynamically from selection
  const currentSelectedItem = itemsList.find(i => i._id === selectedItemId || i.id === selectedItemId) || service;
  const currentPrice = currentSelectedItem.prix;

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="container animate-fade-in" style={{ textAlign: 'left' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <Link to="/">Accueil</Link>
        <ChevronRight size={14} />
        <Link to="/search">Services</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{provider.nom || service.nom}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '32px' }} className="detail-layout">
        <style>{`
          @media (max-width: 900px) {
            .detail-layout {
              grid-template-columns: 1fr !important;
            }
          }
          .time-slot-btn {
            border: 1px solid var(--border);
            background-color: var(--surface);
            padding: 10px;
            border-radius: var(--radius-sm);
            text-align: center;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          .time-slot-btn:hover {
            border-color: var(--primary);
            background-color: var(--primary-light);
          }
          .time-slot-btn.selected {
            background-color: var(--primary);
            color: white;
            border-color: var(--primary);
          }
          .choice-card {
            border: 2px solid var(--border);
            border-radius: var(--radius-md);
            padding: 14px;
            cursor: pointer;
            transition: all var(--transition-fast);
            text-align: left;
            background-color: var(--surface);
          }
          .choice-card:hover {
            border-color: var(--primary);
            background-color: var(--primary-light);
          }
          .choice-card.selected {
            border-color: var(--primary);
            background-color: var(--primary-light);
            box-shadow: var(--shadow-sm);
          }
        `}</style>

        {/* Left Side: Info, Table list/Room list, and Reviews */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Main Info Card */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{
                  backgroundColor: catStyles.bg,
                  color: catStyles.color,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '12px'
                }}>
                  <CatIcon size={12} />
                  {catStyles.label}
                </span>
                
                {/* Dynamically adjust title */}
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '8px' }}>
                  {isMedecin ? `${provider.nom}` : provider.nom || service.nom}
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {isMedecin && <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Médecin Spécialiste</span>}
                  <div className="stars">
                    <Star size={16} fill="currentColor" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, marginLeft: '4px' }}>{(provider.note || 4.5).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              {!isRestaurant && (
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
                    {isHotel ? 'Par nuit' : 'Tarif de consultation'}
                  </span>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {currentPrice} DT
                  </span>
                </div>
              )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>À propos</h3>
            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {service.description || "Aucune description détaillée n'est disponible pour ce prestataire."}
            </p>

            {/* Provider contact details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} className="grid-2">
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Adresse</h4>
                  <p style={{ fontSize: '0.8rem' }}>{provider.adresse || 'Tunisie'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Téléphone</h4>
                  <p style={{ fontSize: '0.8rem' }}>{provider.telephone || '+216 71 000 000'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Tables or Hotel Rooms List Selector */}
          {(isRestaurant || isHotel) && itemsList.length > 0 && (
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                {isRestaurant ? '1. Sélectionnez votre Table' : '1. Sélectionnez votre Chambre'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                {isRestaurant 
                  ? 'Choisissez le numéro et la disposition de la table selon vos préférences.'
                  : 'Choisissez le type de chambre selon le confort, la vue et le montant par nuit.'
                }
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itemsList.map(item => {
                  const isSelected = selectedItemId === item._id || selectedItemId === item.id;
                  return (
                    <div
                      key={item._id || item.id}
                      className={`choice-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedItemId(item._id || item.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.95rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                          {item.nom}
                        </strong>
                        {item.prix > 0 && (
                          <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                            {item.prix} DT
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        {item.description || 'Description standard.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews List & Add Review Form */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Avis clients ({reviews.length})</h3>
            
            {/* Reviews history */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {reviews.map((rev, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{rev.nom}</strong>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={12} fill={star <= rev.note ? 'currentColor' : 'none'} style={{ color: star <= rev.note ? '#fbbf24' : 'var(--border)' }} />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-main)' }}>{rev.commentaire}</p>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>Donner votre avis</h4>
              
              {reviewSuccess && <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontSize: '0.85rem', marginBottom: '12px' }}>{reviewSuccess}</div>}
              {reviewError && <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '12px' }}>{reviewError}</div>}

              {user ? (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Note</label>
                    <div style={{ display: 'flex', gap: '6px', color: '#fbbf24' }}>
                      {[1, 2, 3, 4, 5].map(starVal => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setReviewNote(starVal)}
                          style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', padding: 0 }}
                        >
                          <Star size={24} fill={starVal <= reviewNote ? 'currentColor' : 'none'} stroke="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Votre avis / Commentaire</label>
                    <textarea
                      className="form-input"
                      rows="3"
                      placeholder="Comment s'est passée votre consultation, repas ou séjour ?"
                      value={reviewCommentaire}
                      onChange={(e) => setReviewCommentaire(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" disabled={reviewLoading} className="btn btn-primary" style={{ width: 'fit-content', padding: '10px 24px' }}>
                    {reviewLoading ? 'Publication...' : 'Publier mon avis'}
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <Info size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.9rem' }}>
                    Vous devez être <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>connecté</Link> pour laisser un avis sur ce prestataire.
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Side: Booking Panel */}
        <aside>
          <div className="card" style={{ position: 'sticky', top: '94px', padding: '28px', boxShadow: 'var(--shadow-lg)', border: '1px solid hsla(var(--primary-hsl), 0.15)' }}>
            {/* Stepper Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', height: '3px', backgroundColor: 'var(--border)', zIndex: 0 }}></div>
              <div style={{ position: 'absolute', top: '15px', left: '15px', width: `${((bookingStep - 1) / 3) * 90}%`, height: '3px', backgroundColor: bookingStep === 4 ? 'var(--success)' : 'var(--primary)', zIndex: 0, transition: 'all 0.3s ease' }}></div>
              
              {/* Step 1 Indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: bookingStep >= 1 ? 'var(--primary)' : 'var(--surface)', color: bookingStep >= 1 ? 'white' : 'var(--text-muted)', border: `2px solid ${bookingStep >= 1 ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  1
                </div>
                <span style={{ fontSize: '0.7rem', marginTop: '6px', fontWeight: bookingStep === 1 ? '700' : '500', color: bookingStep === 1 ? 'var(--primary)' : 'var(--text-muted)' }}>Date/Heure</span>
              </div>

              {/* Step 2 Indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: bookingStep >= 2 ? 'var(--primary)' : 'var(--surface)', color: bookingStep >= 2 ? 'white' : 'var(--text-muted)', border: `2px solid ${bookingStep >= 2 ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  2
                </div>
                <span style={{ fontSize: '0.7rem', marginTop: '6px', fontWeight: bookingStep === 2 ? '700' : '500', color: bookingStep === 2 ? 'var(--primary)' : 'var(--text-muted)' }}>Vérification</span>
              </div>

              {/* Step 3 Indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: bookingStep >= 3 ? 'var(--primary)' : 'var(--surface)', color: bookingStep >= 3 ? 'white' : 'var(--text-muted)', border: `2px solid ${bookingStep >= 3 ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  3
                </div>
                <span style={{ fontSize: '0.7rem', marginTop: '6px', fontWeight: bookingStep === 3 ? '700' : '500', color: bookingStep === 3 ? 'var(--primary)' : 'var(--text-muted)' }}>Confirmation</span>
              </div>

              {/* Step 4 Indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: bookingStep >= 4 ? 'var(--success)' : 'var(--surface)', color: bookingStep >= 4 ? 'white' : 'var(--text-muted)', border: `2px solid ${bookingStep >= 4 ? 'var(--success)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  4
                </div>
                <span style={{ fontSize: '0.7rem', marginTop: '6px', fontWeight: bookingStep === 4 ? '700' : '500', color: bookingStep >= 4 ? 'var(--success)' : 'var(--text-muted)' }}>Succès</span>
              </div>
            </div>

            {bookingError && (
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
                {bookingError}
              </div>
            )}

            {/* Step 1: Choose Date & Time */}
            {bookingStep === 1 && (
              <form onSubmit={goToVerificationStep} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', margin: 0 }}>
                  <Calendar size={20} style={{ color: 'var(--primary)' }} />
                  {isRestaurant ? 'Planifier une table' : isHotel ? 'Réserver une chambre' : 'Prendre RDV'}
                </h3>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">1. Choisissez une date</label>
                  <input
                    type="date"
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                {selectedDate && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {isRestaurant ? '2. Choisissez l\'heure' : isHotel ? '2. Heure de check-in' : '2. Choisissez l\'heure'}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
                      {timeSlots.map(time => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            className={`time-slot-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                      <span>Prestation :</span>
                      <span style={{ fontWeight: 600, textAlign: 'right' }}>{currentSelectedItem.nom}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Planifié le :</span>
                      <span style={{ fontWeight: 600 }}>{selectedDate} à {selectedTime}</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px dashed var(--border)', margin: '6px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800 }}>
                      <span>Montant total :</span>
                      <span style={{ color: 'var(--primary)' }}>
                        {currentPrice === 0 ? 'Gratuit' : `${currentPrice} DT`}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '1rem' }}
                >
                  Continuer vers la vérification
                </button>
              </form>
            )}

            {/* Step 2: Verification (Enter Phone & Email) */}
            {bookingStep === 2 && (
              <form onSubmit={sendSmsCode} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', margin: 0 }}>
                  <Phone size={20} style={{ color: 'var(--primary)' }} />
                  Informations de contact
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Saisissez votre numéro de téléphone et votre adresse e-mail. Un code de validation à 4 chiffres vous sera envoyé par e-mail.
                </p>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Numéro de téléphone tunisien</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ padding: '10px 12px', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      +216
                    </span>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Ex: 98123456"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      maxLength={8}
                      required
                      style={{ flexGrow: 1 }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Adresse e-mail de réception du code</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Ex: nom@domaine.tn"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setBookingStep(1)}
                    style={{ flex: 1, justifyContent: 'center', border: '1px solid var(--border)' }}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 2, justifyContent: 'center' }}
                  >
                    Envoyer sur le mail
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Confirmation (Enter Verification Code) */}
            {bookingStep === 3 && (
              <form onSubmit={confirmCodeAndBook} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', margin: 0 }}>
                  <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
                  Confirmation du code
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Veuillez renseigner le code d'activation reçu par e-mail à l'adresse <strong>{clientEmail}</strong>.
                </p>

                {smsSimulationAlert && (
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={16} />
                    <span>{smsSimulationAlert}</span>
                  </div>
                )}

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Code de confirmation (4 chiffres)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Saisir le code"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    required
                    style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '8px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setBookingStep(2)}
                    style={{ flex: 1, justifyContent: 'center', border: '1px solid var(--border)' }}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ flex: 2, justifyContent: 'center' }}
                  >
                    {submitting ? 'Validation...' : 'Confirmer & Réserver'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Success Screen */}
            {bookingStep === 4 && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', marginBottom: '16px' }}>
                  <CheckCircle size={48} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>Réservation Réussie !</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '24px', color: 'var(--text-muted)' }}>
                  Votre réservation pour <strong>{currentSelectedItem.nom}</strong> le <strong>{new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> à <strong>{selectedTime}</strong> a été enregistrée avec succès.
                </p>
                <Link to="/client-dashboard" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Mon espace client
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ServiceDetail;
