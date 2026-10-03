import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, Lock, MapPin, Briefcase, Image, ShieldAlert, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { t } = useApp();
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [role, setRole] = useState('client'); // 'client' or 'prestataire'
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [mdp, setMdp] = useState('');
  const [confirmMdp, setConfirmMdp] = useState('');
  
  // Provider specific states
  const [categorie, setCategorie] = useState('medecin');
  const [adresse, setAdresse] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showMdp, setShowMdp] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!nom || !email || !telephone || !mdp || !confirmMdp) {
      setError('Veuillez remplir tous les champs requis.');
      return;
    }

    if (mdp !== confirmMdp) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (mdp.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }

    // Password pattern check matching backend regex /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!regex.test(mdp)) {
      setError('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.');
      return;
    }

    setLoading(true);

    try {
      let payload;
      
      // If profile picture is selected, use FormData, otherwise JSON
      if (role === 'prestataire' && profilePicture) {
        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('email', email);
        formData.append('telephone', telephone);
        formData.append('mdp', mdp);
        formData.append('role', role);
        formData.append('categorie', categorie);
        formData.append('adresse', adresse);
        formData.append('profilePicture', profilePicture);
        payload = formData;
      } else {
        payload = {
          nom,
          email,
          telephone,
          mdp,
          role,
          ...(role === 'prestataire' ? { categorie, adresse } : {})
        };
      }

      await register(payload);
      setSuccess(true);
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)', padding: '40px 20px' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '36px', boxShadow: 'var(--shadow-lg)' }}>
        
        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={64} style={{ color: 'var(--success)', marginBottom: '20px' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>Inscription réussie !</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '16px', gap: '8px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M4 11L7.5 15L11.5 8" stroke="url(#logo-grad-reg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.5 11L15 15L20 7" stroke="url(#logo-grad-reg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="logo-grad-reg" x1="4" y1="7" x2="20" y2="15" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </svg>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
                  Wakti
                </span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Créer un compte</h2>
              <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Rejoignez notre réseau de réservation en Tunisie</p>
            </div>

            {/* Role Toggle Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '4px', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
              <button
                type="button"
                className="btn"
                onClick={() => setRole('client')}
                style={{
                  border: 'none',
                  backgroundColor: role === 'client' ? 'var(--surface)' : 'transparent',
                  color: role === 'client' ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: role === 'client' ? 'var(--shadow-sm)' : 'none',
                  borderRadius: '8px',
                  padding: '10px 0',
                  fontWeight: role === 'client' ? 700 : 500,
                  fontSize: '0.9rem'
                }}
              >
                Client
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setRole('prestataire')}
                style={{
                  border: 'none',
                  backgroundColor: role === 'prestataire' ? 'var(--surface)' : 'transparent',
                  color: role === 'prestataire' ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: role === 'prestataire' ? 'var(--shadow-sm)' : 'none',
                  borderRadius: '8px',
                  padding: '10px 0',
                  fontWeight: role === 'prestataire' ? 700 : 500,
                  fontSize: '0.9rem'
                }}
              >
                Prestataire
              </button>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px', textAlign: 'left' }}>
                <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Full Name */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Nom complet</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Mohamed Ben Ali"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Adresse email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="mohamed@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Téléphone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Ex: 98 765 432"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={showMdp ? 'text' : 'password'}
                    className="form-input"
                    placeholder="•••••••• (Majuscule, minuscule, chiffre)"
                    value={mdp}
                    onChange={(e) => setMdp(e.target.value)}
                    style={{ paddingLeft: '48px', paddingRight: '48px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowMdp(!showMdp)}
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}
                  >
                    {showMdp ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Confirmer le mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={showMdp ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmMdp}
                    onChange={(e) => setConfirmMdp(e.target.value)}
                    style={{ paddingLeft: '48px', paddingRight: '48px' }}
                    required
                  />
                </div>
              </div>

              {/* Prestataire Specific Fields */}
              {role === 'prestataire' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Informations Professionnelles</h3>
                  
                  {/* Category Selection */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Catégorie d'activité</label>
                    <div style={{ position: 'relative' }}>
                      <Briefcase size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <select
                        className="form-input form-select"
                        value={categorie}
                        onChange={(e) => setCategorie(e.target.value)}
                        style={{ paddingLeft: '48px' }}
                        required
                      >
                        <option value="medecin">{t('doctors')}</option>
                        <option value="centre de beaute">{t('beauty')}</option>
                        <option value="restaurant">{t('restaurants')}</option>
                        <option value="clinique">{t('clinics')}</option>
                        <option value="infirmiere">{t('infirmiere')}</option>
                        <option value="hotel">{t('hotels')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Professional Address */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Adresse professionnelle</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: Bureau 4, Av. Hédi Nouira, Tunis"
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                        style={{ paddingLeft: '48px' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Photo de profil / Logo (Optionnel)</label>
                    <div style={{ position: 'relative' }}>
                      <Image size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="file"
                        accept="image/*"
                        className="form-input"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                        style={{ paddingLeft: '48px', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '1rem', marginTop: '12px' }}
              >
                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Vous possédez déjà un compte ?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Se connecter
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
