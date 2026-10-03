import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShieldAlert, LogIn, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMdp, setShowMdp] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !mdp) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email, mdp);
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(decodeURIComponent(redirectUrl));
      } else {
        // Default dashboard routing
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (user.role === 'prestataire') {
          navigate('/provider-dashboard');
        } else {
          navigate('/client-dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '20px' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '36px', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '16px', gap: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <path d="M4 11L7.5 15L11.5 8" stroke="url(#logo-grad-login)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.5 11L15 15L20 7" stroke="url(#logo-grad-login)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="logo-grad-login" x1="4" y1="7" x2="20" y2="15" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
              Wakti
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Ravis de vous revoir</h2>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Connectez-vous pour gérer vos réservations</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email input */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Adresse email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showMdp ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
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

          {/* Remember me and Forgot password mock */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
              Se souvenir de moi
            </label>
            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: 600 }}>Mot de passe oublié ?</Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '1rem', marginTop: '8px' }}
          >
            {loading ? 'Connexion en cours...' : (
              <>
                <LogIn size={18} />
                Se connecter
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Vous n'avez pas de compte ?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            S'inscrire gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
