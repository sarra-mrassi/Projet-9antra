import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Calendar, User, LogOut, Menu, X, Briefcase, UserCheck, Sun, Moon, Globe } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, language, setLanguage, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin-dashboard';
    if (user?.role === 'prestataire') return '/provider-dashboard';
    return '/client-dashboard';
  };

  return (
    <header className="header glass">
      <div className="logo-container" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M4 11L7.5 15L11.5 8" stroke="url(#logo-grad-header)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.5 11L15 15L20 7" stroke="url(#logo-grad-header)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="logo-grad-header" x1="4" y1="7" x2="20" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
          Wakti
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="nav-links" style={{ display: 'none' }}>
        {/* We use inline styles or classes depending on media query */}
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .nav-links-desktop {
            display: flex !important;
            align-items: center;
            gap: 28px;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        .header {
          transition: background-color 0.3s;
        }
      `}</style>

      <div className="nav-links-desktop" style={{ display: 'none' }}>
        <NavLink to="/" className={({ active }) => `nav-link ${active ? 'active' : ''}`} end>
          {t('home')}
        </NavLink>
        <NavLink to="/search" className={({ active }) => `nav-link ${active ? 'active' : ''}`}>
          {t('search')}
        </NavLink>
        <NavLink to="/about" className={({ active }) => `nav-link ${active ? 'active' : ''}`}>
          {t('about')}
        </NavLink>
        {user && (
          <NavLink to={getDashboardLink()} className={({ active }) => `nav-link ${active ? 'active' : ''}`}>
            {t('mySpace')}
          </NavLink>
        )}
      </div>

      <div className="auth-buttons nav-links-desktop" style={{ display: 'none', alignItems: 'center', gap: '20px' }}>
        {/* Controls Container: Theme + Language */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '8px' }}>
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="btn-icon" 
            style={{ 
              border: 'none', 
              background: 'var(--surface)', 
              color: 'var(--text-main)',
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border)',
              transition: 'all 0.2s ease'
            }}
            title={theme === 'light' ? t('themeDark') : t('themeLight')}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={16} style={{ color: 'var(--text-muted)' }} />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>
          </div>
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {t('hello')}, <strong style={{ color: 'var(--text-main)' }}>{user.nom}</strong> 
              <span style={{ marginLeft: '6px', marginRight: '6px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'capitalize' }}>
                {user.role}
              </span>
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', gap: '6px' }}>
              <LogOut size={16} />
              {t('logout')}
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              {t('login')}
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px' }}>
              {t('register')}
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="btn-icon mobile-menu-btn" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{ border: 'none', background: 'transparent' }}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="glass animate-fade-in" style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          gap: '20px',
          borderBottom: '1px solid var(--border)',
          zIndex: 999,
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Mobile Theme & Language Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '8px' }}>
            <button 
              onClick={toggleTheme}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'light' ? t('themeDark') : t('themeLight')}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} style={{ color: 'var(--text-muted)' }} />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-main)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>

          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('home')}</Link>
          <Link to="/search" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('search')}</Link>
          <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('about')}</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                {t('mySpace')} ({user.nom})
              </Link>
              <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
                <LogOut size={18} />
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>
                {t('login')}
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>
                {t('register')}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
