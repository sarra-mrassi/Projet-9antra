import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '8px', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M4 11L7.5 15L11.5 8" stroke="url(#logo-grad-footer)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.5 11L15 15L20 7" stroke="url(#logo-grad-footer)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="logo-grad-footer" x1="4" y1="7" x2="20" y2="15" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            Wakti
          </span>
        </div>
        <p style={{ maxWidth: '500px', fontSize: '0.9rem', marginBottom: '16px' }}>
          La plateforme tout-en-un pour réserver vos rendez-vous de santé, beauté, restauration, et bien plus encore, en quelques clics.
        </p>
        <div className="footer-links">
          <Link to="/" className="footer-link">Accueil</Link>
          <Link to="/search" className="footer-link">Rechercher</Link>
          <Link to="/about" className="footer-link">À propos</Link>
          <a href="#" className="footer-link">Mentions légales</a>
          <a href="#" className="footer-link">Contact</a>
        </div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Wakti. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
