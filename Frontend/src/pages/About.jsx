import React from 'react';
import { Clock, ShieldCheck, CheckCircle2, Star, Calendar } from 'lucide-react';

const About = () => {
  return (
    <div className="container animate-fade-in" style={{ textAlign: 'left' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>À propos de Wakti</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Optimisez votre temps précieux grâce à notre solution de réservation intelligente en Tunisie.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '48px', alignItems: 'center', marginBottom: '60px' }} className="grid-2">
        <style>{`
          @media (max-width: 900px) {
            .grid-2 {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
          }
          .about-card {
            border: 1px solid var(--border);
            padding: 24px;
            border-radius: var(--radius-md);
            background-color: var(--surface);
            transition: transform var(--transition-fast);
          }
          .about-card:hover {
            transform: translateY(-4px);
          }
        `}</style>

        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>Notre Mission</h2>
          <p style={{ lineHeight: '1.7', marginBottom: '16px' }}>
            Dans un monde où chaque minute compte, <strong>Wakti</strong> ("Mon Temps") a été créée avec une ambition simple : redonner aux Tunisiens le contrôle de leur temps de vie quotidien. Fini le stress de l'attente au téléphone, les files d'attente interminables chez le médecin ou l'impossibilité de choisir précisément sa table de restaurant.
          </p>
          <p style={{ lineHeight: '1.7', marginBottom: '16px' }}>
            Nous connectons les meilleurs professionnels de Tunisie (médecins, restaurateurs, hôteliers, salons de beauté, et plus) avec des clients désireux de planifier précisément et efficacement leur journée.
          </p>
          <p style={{ lineHeight: '1.7' }}>
            Avec notre technologie intelligente et notre assistant AI, réserver une prestation spécifique (comme une table précise en terrasse ou une suite junior avec vue mer) devient un jeu d'enfant.
          </p>
        </div>

        <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid hsla(var(--primary-hsl), 0.2)' }}>
          <Clock size={64} style={{ color: 'var(--primary)', marginBottom: '16px', display: 'inline-block' }} />
          <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>Gain de Temps Garanti</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Nos utilisateurs économisent en moyenne <strong>3 heures par semaine</strong> en centralisant et en automatisant la gestion de leurs rendez-vous et de leurs réservations.
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '24px', textAlign: 'center' }}>Pourquoi choisir Wakti ?</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '60px' }} className="grid-3">
        <style>{`
          @media (max-width: 900px) {
            .grid-3 {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        <div className="about-card">
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <Calendar size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Réservations Spécifiques</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Ne réservez pas seulement un service : choisissez le numéro de table de votre restaurant, la vue exacte de votre chambre d’hôtel, ou l’horaire exact de votre consultation médicale.
          </p>
        </div>

        <div className="about-card">
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <ShieldCheck size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Professionnels Vérifiés</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Notre équipe d’administration vérifie chaque prestataire enregistré. Vous n'avez accès qu'à des professionnels compétents, fiables et recommandés par de vrais clients.
          </p>
        </div>

        <div className="about-card">
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <Star size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Assistant Chatbot AI</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Notre chatbot intelligent connecté à MongoDB analyse votre demande pour vous conseiller instantanément le meilleur professionnel ou le plus proche de votre emplacement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
