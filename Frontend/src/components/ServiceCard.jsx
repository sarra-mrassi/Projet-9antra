import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Stethoscope, Scissors, Utensils, Calendar, Dumbbell, Car, Wrench, Camera, Hotel } from 'lucide-react';

export const getCategoryStyles = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('medecin') || cat.includes('clinique') || cat.includes('sante')) {
    return {
      bg: 'rgba(20, 184, 166, 0.12)',
      color: 'rgb(13, 148, 136)',
      icon: Stethoscope,
      label: 'Santé & Clinique'
    };
  }
  if (cat.includes('beaute') || cat.includes('coiffure') || cat.includes('centre de beaute')) {
    return {
      bg: 'rgba(236, 72, 153, 0.12)',
      color: 'rgb(219, 39, 119)',
      icon: Scissors,
      label: 'Beauté & Bien-être'
    };
  }
  if (cat.includes('resto') || cat.includes('restaurant') || cat.includes('nourriture')) {
    return {
      bg: 'rgba(249, 115, 22, 0.12)',
      color: 'rgb(234, 88, 12)',
      icon: Utensils,
      label: 'Restauration'
    };
  }
  if (cat.includes('sport') || cat.includes('fitness') || cat.includes('coach')) {
    return {
      bg: 'rgba(16, 185, 129, 0.12)',
      color: 'rgb(5, 150, 105)',
      icon: Dumbbell,
      label: 'Sport & Fitness'
    };
  }
  if (cat.includes('auto') || cat.includes('lavage') || cat.includes('mecanicien')) {
    return {
      bg: 'rgba(59, 130, 246, 0.12)',
      color: 'rgb(37, 99, 235)',
      icon: Car,
      label: 'Services Auto'
    };
  }
  if (cat.includes('artisan') || cat.includes('maison') || cat.includes('plombier') || cat.includes('electricien')) {
    return {
      bg: 'rgba(245, 158, 11, 0.12)',
      color: 'rgb(217, 119, 6)',
      icon: Wrench,
      label: 'Artisans & Maison'
    };
  }
  if (cat.includes('loisir') || cat.includes('evenement') || cat.includes('photo')) {
    return {
      bg: 'rgba(244, 63, 94, 0.12)',
      color: 'rgb(225, 29, 72)',
      icon: Camera,
      label: 'Loisirs & Photos'
    };
  }
  if (cat.includes('hotel') || cat.includes('chambre') || cat.includes('sejour')) {
    return {
      bg: 'rgba(99, 102, 241, 0.12)',
      color: 'rgb(79, 70, 229)',
      icon: Hotel,
      label: 'Hôtels & Séjours'
    };
  }
  return {
    bg: 'rgba(148, 163, 184, 0.12)',
    color: 'rgb(71, 85, 105)',
    icon: Calendar,
    label: category || 'Service'
  };
};

const ServiceCard = ({ service }) => {
  const styles = getCategoryStyles(service.categorie);
  const IconComponent = styles.icon;

  // Prestataire info
  const providerName = service.prestataire?.nom || 'Prestataire Indépendant';
  const providerAddress = service.prestataire?.adresse || 'Adresse non spécifiée';
  const providerRating = service.prestataire?.note || 4.5;

  return (
    <div className="card card-hover animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{
          backgroundColor: styles.bg,
          color: styles.color,
          padding: '6px 12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          <IconComponent size={14} />
          {styles.label}
        </div>
        <div className="stars">
          <Star size={16} fill="currentColor" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginLeft: '4px' }}>
            {providerRating.toFixed(1)}
          </span>
        </div>
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', textAlign: 'left', fontWeight: '700' }}>
        {service.nom}
      </h3>
      
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', textAlign: 'left' }}>
        Par <strong>{providerName}</strong>
      </p>

      <p style={{
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        marginBottom: '20px',
        textAlign: 'left',
        flexGrow: 1,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: '1.4'
      }}>
        {service.description || "Aucune description fournie pour ce service. Profitez d'une prestation de qualité dispensée par un professionnel expérimenté."}
      </p>

      {providerAddress && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
          <MapPin size={14} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{providerAddress}</span>
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border)',
        paddingTop: '16px',
        marginTop: 'auto'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textAlign: 'left' }}>À partir de</span>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>{service.prix} DT</span>
        </div>
        <Link to={`/service/${service._id || service.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          Réserver
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
