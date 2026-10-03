import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldAlert, CheckCircle, Key, Lock, Eye, EyeOff } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  // Steps: 1 = Email, 2 = Verification Code, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newMdp, setNewMdp] = useState('');
  const [confirmMdp, setConfirmMdp] = useState('');
  
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send Reset Code
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/users/forgot-password/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du code.');
      }

      setStep(2); // Go to verification code step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Reset Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code) {
      setError('Veuillez saisir le code reçu par e-mail.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/users/forgot-password/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Code de validation invalide.');
      }

      setStep(3); // Go to new password step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newMdp || !confirmMdp) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (newMdp !== confirmMdp) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    // Password strength check
    if (newMdp.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    
    const hasLetter = /[a-zA-Z]/.test(newMdp);
    const hasNumber = /\d/.test(newMdp);
    if (!hasLetter || !hasNumber) {
      setError('Le mot de passe doit contenir au moins une lettre et un chiffre.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/users/forgot-password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newMdp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la modification du mot de passe.');
      }

      setStep(4); // Success step
    } catch (err) {
      setError(err.message);
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
              <path d="M4 11L7.5 15L11.5 8" stroke="url(#logo-grad-forgot)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.5 11L15 15L20 7" stroke="url(#logo-grad-forgot)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="logo-grad-forgot" x1="4" y1="7" x2="20" y2="15" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
              Wakti
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Mot de passe oublié</h2>
          
          {step === 1 && <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Saisissez votre e-mail pour recevoir un code de sécurité</p>}
          {step === 2 && <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Saisissez le code de validation envoyé à :<br/><strong>{email}</strong></p>}
          {step === 3 && <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Choisissez un nouveau mot de passe fort et sécurisé</p>}
          {step === 4 && <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Votre mot de passe a été réinitialisé avec succès</p>}
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: ENTER EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Adresse email du compte</label>
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

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '1rem', marginTop: '8px' }}
            >
              {loading ? 'Envoi du code...' : (
                <>
                  <Key size={18} />
                  Envoyer le code par e-mail
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: 600 }}>
                <ArrowLeft size={14} />
                Retour à la connexion
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: ENTER CODE */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Code de validation (4 chiffres)</label>
              <input
                type="text"
                maxLength="4"
                className="form-input"
                placeholder="1234"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', fontWeight: 800 }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '1rem', marginTop: '8px' }}
            >
              {loading ? 'Vérification...' : 'Confirmer le code'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ArrowLeft size={14} /> Modifier l'e-mail
              </button>
              <button
                type="button"
                onClick={handleSendCode}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Renvoyer le code
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={newMdp}
                  onChange={(e) => setNewMdp(e.target.value)}
                  style={{ paddingLeft: '48px', paddingRight: '48px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}
                >
                  {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Confirmer le nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmMdp}
                  onChange={(e) => setConfirmMdp(e.target.value)}
                  style={{ paddingLeft: '48px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '1rem', marginTop: '8px' }}
            >
              {loading ? 'Mise à jour...' : 'Enregistrer le mot de passe'}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS SCREEN */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--success)' }}>
              <CheckCircle size={48} />
            </div>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px' }}>
              Votre mot de passe a été réinitialisé avec succès !
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '1rem' }}>
              <ArrowLeft size={18} />
              Se connecter maintenant
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
