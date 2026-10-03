import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Stethoscope, Scissors, Utensils, Shield, Clock, Award, ArrowRight, Hotel, Heart } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import heroImg from '../assets/wakti_hero.jpg';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock services fallback in case backend is empty
  const mockServices = [
    {
      _id: 'mock-1',
      nom: 'Consultation Cardiologie & ECG',
      description: 'Examen cardiologique complet avec électrocardiogramme de contrôle par le Dr. Elyes Gharbi.',
      prix: 100,
      categorie: 'medecin',
      prestataire: { nom: 'Dr. Elyes Gharbi', adresse: 'Centre Médical Les Berges du Lac 2, Tunis', note: 4.9 }
    },
    {
      _id: 'mock-2',
      nom: 'Massage Californien Relaxant',
      description: 'Détente absolue aux huiles essentielles de jasmin pour chasser la fatigue et le stress.',
      prix: 60,
      categorie: 'centre de beaute',
      prestataire: { nom: 'Nirvana Spa & Beauté', adresse: 'Avenue Hédi Nouira, Ennasr 2, Tunis', note: 4.8 }
    },
    {
      _id: 'mock-3',
      nom: 'Table 1 (2 personnes - Près de la fenêtre)',
      description: 'Réservez une table intime face au port de plaisance pour un dîner inoubliable.',
      prix: 10,
      categorie: 'restaurant',
      prestataire: { nom: 'Restaurant El Amel', adresse: 'Port El Kantaoui, Sousse', note: 4.6 }
    },
    {
      _id: 'mock-9',
      nom: 'Suite Junior (Vue Patio Tunisien)',
      description: 'Suite traditionnelle de 35m² décorée d’arabesques avec grand lit double et salle de bain en marbre.',
      prix: 280,
      categorie: 'hotel',
      prestataire: { nom: 'Dar El Jeld Hotel & Spa', adresse: 'Rue Dar El Jeld, La Médina, Tunis', note: 4.9 }
    },
    {
      _id: 'mock-4',
      nom: 'Bilan Cardiologique & Scanner',
      description: 'Bilan médical de pointe complet comprenant scanner oculaire et examens cardiaques.',
      prix: 180,
      categorie: 'clinique',
      prestataire: { nom: 'Clinique Carthagene', adresse: 'Centre Urbain Nord, Tunis', note: 4.8 }
    },
    {
      _id: 'mock-6',
      nom: 'Injection Intramusculaire à domicile',
      description: 'Administration de traitement injectable à domicile par une infirmière diplômée d’État.',
      prix: 15,
      categorie: 'infirmiere',
      prestataire: { nom: 'Cabinet de Soins Leila', adresse: 'Avenue Hédi Nouira, Ennasr 2, Tunis', note: 4.9 }
    }
  ];

  useEffect(() => {
    const fetchPopularServices = async () => {
      try {
        const response = await fetch('/services');
        if (response.ok) {
          const data = await response.json();
          if (data.services && data.services.length > 0) {
            // Keep doctors, tables, suites that represent different providers
            setServices(data.services.slice(0, 4));
          } else {
            setServices(mockServices.slice(0, 4));
          }
        } else {
          setServices(mockServices.slice(0, 4));
        }
      } catch (err) {
        console.warn('Backend connection failed, loading mock services', err);
        setServices(mockServices.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchPopularServices();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`);
  };

  const handleCategoryClick = (catName) => {
    navigate(`/search?category=${encodeURIComponent(catName)}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section-full" style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        marginTop: '-40px',
        borderRadius: '0',
        padding: '100px 24px',
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '80px',
        minHeight: 'calc(100vh - 70px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Cinematic Background Image Video-like Simulation */}
        <div className="hero-bg-media" style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>

        {/* Floating Light Particles */}
        <div className="bokeh-particles">
          <div className="bokeh-bubble bubble-1"></div>
          <div className="bokeh-bubble bubble-2"></div>
          <div className="bokeh-bubble bubble-3"></div>
          <div className="bokeh-bubble bubble-4"></div>
        </div>

        {/* Celestial Orrery Animated Layer */}
        <div className="glyph-field">
          <div className="glyph-container glyph-1">
            <div className="glyph-part part-1"></div>
            <div className="glyph-part part-2"></div>
            <div className="glyph-part part-3"></div>
          </div>
          <div className="glyph-container glyph-2">
            <div className="glyph-part part-1"></div>
            <div className="glyph-part part-2"></div>
          </div>
          <div className="glyph-container glyph-3">
            <div className="glyph-part part-1"></div>
            <div className="glyph-part part-2"></div>
            <div className="glyph-part part-3"></div>
          </div>
        </div>

        <div className="orrery-field">
          <div className="orbit orbit-1"><div className="planet"></div></div>
          <div className="orbit orbit-2"><div className="planet"></div></div>
          <div className="orbit orbit-3"><div className="planet"></div></div>
          <div className="orbit orbit-4"><div className="planet"></div></div>
        </div>

        <div style={{ maxWidth: '800px', zIndex: 2, position: 'relative' }}>
          <h1 style={{
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            fontSize: '3.25rem',
            fontWeight: 800,
            marginBottom: '40px',
            lineHeight: '1.25',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.75)'
          }}>
            {t('heroTitle_1')}<br />
            {t('heroTitle_2')} <span style={{ color: '#c084fc', WebkitTextFillColor: '#c084fc' }}>Wakti</span>.
          </h1>

          {/* Search Bar Form */}
          <form onSubmit={handleSearchSubmit} className="search-wrapper glass" style={{ width: '100%', margin: '0 auto', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}>
            <div className="search-input-group" style={{ borderRight: '1px solid #cbd5e1' }}>
              <Search size={20} style={{ color: '#64748b' }} />
              <input
                type="text"
                placeholder={t('heroPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ color: '#0f172a' }}
              />
            </div>
            <div className="search-input-group" style={{ borderRight: 'none' }}>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ color: '#0f172a' }}>
                <option value="">{t('allCategories')}</option>
                <option value="medecin">{t('doctors')}</option>
                <option value="centre de beaute">{t('beauty')}</option>
                <option value="restaurant">{t('restaurants')}</option>
                <option value="hotel">{t('hotels')}</option>
                <option value="clinique">{t('clinics')}</option>
                <option value="infirmiere">{t('infirmiere')}</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              {t('searchBtn')}
            </button>
          </form>
        </div>
      </section>

      <div className="container">
        {/* Categories Section */}
        <section className="categories-container" style={{ marginBottom: '80px', marginTop: '40px' }}>
          <h2 className="section-title" style={{ textAlign: 'center', width: '100%' }}>{t('browseByCategory')}</h2>
          <p style={{ textAlign: 'center', marginBottom: '40px', marginTop: '-20px' }}>{t('categorySubtitle')}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="categories-grid">
            <style>{`
              @media (max-width: 900px) {
                .categories-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                }
              }
              @media (max-width: 600px) {
                .categories-grid {
                  grid-template-columns: 1fr !important;
                }
              }
              .category-img {
                transition: transform var(--transition-normal) !important;
              }
              .card-hover:hover .category-img {
                transform: scale(1.08) !important;
              }
            `}</style>
            
            {/* Medecin */}
            <div className="card card-hover" onClick={() => handleCategoryClick('medecin')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80" alt={t('doctors')} className="category-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(20, 184, 166, 0.95)', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Stethoscope size={18} />
                </div>
              </div>
              <div style={{ padding: '20px', textAlign: 'left', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700 }}>{t('doctors')}</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{t('doctorsDesc')}</p>
              </div>
            </div>

            {/* Beaute */}
            <div className="card card-hover" onClick={() => handleCategoryClick('centre de beaute')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80" alt={t('beauty')} className="category-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(236, 72, 153, 0.95)', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scissors size={18} />
                </div>
              </div>
              <div style={{ padding: '20px', textAlign: 'left', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700 }}>{t('beauty')}</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{t('beautyDesc')}</p>
              </div>
            </div>

            {/* Resto */}
            <div className="card card-hover" onClick={() => handleCategoryClick('restaurant')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" alt={t('restaurants')} className="category-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(249, 115, 22, 0.95)', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Utensils size={18} />
                </div>
              </div>
              <div style={{ padding: '20px', textAlign: 'left', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700 }}>{t('restaurants')}</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{t('restaurantsDesc')}</p>
              </div>
            </div>

            {/* Hotel */}
            <div className="card card-hover" onClick={() => handleCategoryClick('hotel')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" alt={t('hotels')} className="category-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(99, 102, 241, 0.95)', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Hotel size={18} />
                </div>
              </div>
              <div style={{ padding: '20px', textAlign: 'left', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700 }}>{t('hotels')}</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{t('hotelsDesc')}</p>
              </div>
            </div>

            {/* Clinique */}
            <div className="card card-hover" onClick={() => handleCategoryClick('clinique')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80" alt={t('clinics')} className="category-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(71, 85, 105, 0.95)', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} />
                </div>
              </div>
              <div style={{ padding: '20px', textAlign: 'left', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700 }}>{t('clinics')}</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{t('clinicsDesc')}</p>
              </div>
            </div>



            {/* Infirmiere */}
            <div className="card card-hover" onClick={() => handleCategoryClick('infirmiere')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80" alt={t('infirmiere')} className="category-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(239, 68, 68, 0.95)', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={18} />
                </div>
              </div>
              <div style={{ padding: '20px', textAlign: 'left', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700 }}>{t('infirmiere')}</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{t('infirmiereDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '40px 24px', marginBottom: '80px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '300px', textAlign: 'left' }}>
            <Clock size={36} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t('trust_title_1')}</h4>
              <p style={{ fontSize: '0.85rem' }}>{t('trust_desc_1')}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '300px', textAlign: 'left' }}>
            <Award size={36} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t('trust_title_2')}</h4>
              <p style={{ fontSize: '0.85rem' }}>{t('trust_desc_2')}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '300px', textAlign: 'left' }}>
            <Shield size={36} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t('trust_title_3')}</h4>
              <p style={{ fontSize: '0.85rem' }}>{t('trust_desc_3')}</p>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{t('featuredServices')}</h2>
            <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>
              {t('viewAll')}
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ marginTop: '16px' }}>{t('loading')}</p>
            </div>
          ) : (
            <div className="grid-4">
              {services.map((service) => (
                <ServiceCard key={service._id || service.id} service={service} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
