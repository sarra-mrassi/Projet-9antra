import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, Filter, MapPin, SlidersHorizontal, Stethoscope, Scissors, Utensils, Shield, Sparkles, Hotel, Heart } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { useApp } from '../context/AppContext';

const Search = () => {
  const { t } = useApp();
  const location = useLocation();
  
  // Parse URL query params
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      query: params.get('query') || '',
      category: params.get('category') || ''
    };
  };

  const urlParams = getQueryParams();
  const [searchTerm, setSearchTerm] = useState(urlParams.query);
  const [selectedCategory, setSelectedCategory] = useState(urlParams.category);
  const [priceLimit, setPriceLimit] = useState(250);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');

  // Reset specialty filter when category changes
  useEffect(() => {
    setSelectedSpecialty('');
  }, [selectedCategory]);

  // Mock data fallback
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

  // Sync state with URL params changes
  useEffect(() => {
    const params = getQueryParams();
    setSearchTerm(params.query);
    setSelectedCategory(params.category);
  }, [location.search]);

  // Fetch from backend
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch('/services');
        if (response.ok) {
          const data = await response.json();
          if (data.services && data.services.length > 0) {
            setServices(data.services);
          } else {
            setServices(mockServices);
          }
        } else {
          setServices(mockServices);
        }
      } catch (err) {
        console.warn('Failed to load services from backend, using fallbacks');
        setServices(mockServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle local filtering
  useEffect(() => {
    let result = [...services];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(s => s.categorie?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by keyword (service name, description, category, or provider name)
    if (searchTerm) {
      const keyword = searchTerm.toLowerCase();
      result = result.filter(
        s => s.nom?.toLowerCase().includes(keyword) || 
             s.description?.toLowerCase().includes(keyword) ||
             s.categorie?.toLowerCase().includes(keyword) ||
             s.prestataire?.nom?.toLowerCase().includes(keyword)
      );
    }

    // Filter by governorate (location)
    if (selectedGovernorate) {
      result = result.filter(s => 
        s.prestataire?.adresse?.toLowerCase().includes(selectedGovernorate.toLowerCase())
      );
    }

    // Filter by specialty (doctors only)
    if (selectedCategory === 'medecin' && selectedSpecialty) {
      const spec = selectedSpecialty.toLowerCase();
      result = result.filter(s => 
        s.nom?.toLowerCase().includes(spec) || 
        s.description?.toLowerCase().includes(spec) ||
        s.prestataire?.nom?.toLowerCase().includes(spec)
      );
    }

    // Filter by price
    result = result.filter(s => s.prix <= priceLimit);

    setFilteredServices(result);
  }, [searchTerm, selectedCategory, priceLimit, selectedGovernorate, selectedSpecialty, services]);

  const categories = [
    { id: '', label: t('allCategories'), icon: Sparkles },
    { id: 'medecin', label: t('doctors'), icon: Stethoscope },
    { id: 'centre de beaute', label: t('beauty'), icon: Scissors },
    { id: 'restaurant', label: t('restaurants'), icon: Utensils },
    { id: 'clinique', label: t('clinics'), icon: Shield },
    { id: 'infirmiere', label: t('infirmiere'), icon: Heart },
    { id: 'hotel', label: t('hotels'), icon: Hotel }
  ];

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '32px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '8px' }}>Explorer nos services</h1>
        <p>Découvrez les prestataires disponibles et planifiez votre rendez-vous en ligne sur Wakti.</p>
      </div>

      {/* Main Grid: Sidebar + Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }} className="search-layout">
        <style>{`
          @media (max-width: 900px) {
            .search-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* Sidebar Filters */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Category Filter */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <Filter size={18} style={{ color: 'var(--primary)' }} />
              Catégories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {categories.map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="btn"
                    style={{
                      justifyContent: 'flex-start',
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                      color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? '700' : '500',
                      border: 'none',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={16} style={{ flexShrink: 0, color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Filter */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <SlidersHorizontal size={18} style={{ color: 'var(--primary)' }} />
              Budget Maximum
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>10 DT</span>
                <span style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 800 }}>{priceLimit} DT</span>
                <span>300 DT</span>
              </div>
            </div>
          </div>

          {/* Governorates Filter */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <MapPin size={18} style={{ color: 'var(--primary)' }} />
              Gouvernorat
            </h3>
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="">Tous les gouvernorats</option>
              <option value="ariana">Ariana</option>
              <option value="beja">Béja</option>
              <option value="ben arous">Ben Arous</option>
              <option value="bizerte">Bizerte</option>
              <option value="gabes">Gabès</option>
              <option value="gafsa">Gafsa</option>
              <option value="jendouba">Jendouba</option>
              <option value="kairouan">Kairouan</option>
              <option value="kasserine">Kasserine</option>
              <option value="kebili">Kébili</option>
              <option value="kef">Le Kef</option>
              <option value="mahdia">Mahdia</option>
              <option value="manouba">La Manouba</option>
              <option value="medenine">Médenine</option>
              <option value="monastir">Monastir</option>
              <option value="nabeul">Nabeul</option>
              <option value="sfax">Sfax</option>
              <option value="sidi bouzid">Sidi Bouzid</option>
              <option value="siliana">Siliana</option>
              <option value="sousse">Sousse</option>
              <option value="tataouine">Tataouine</option>
              <option value="tozeur">Tozeur</option>
              <option value="tunis">Tunis</option>
              <option value="zaghouan">Zaghouan</option>
            </select>
          </div>

          {/* Specialty Filter (Only visible if category is medecin) */}
          {selectedCategory === 'medecin' && (
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <Stethoscope size={18} style={{ color: 'var(--primary)' }} />
                Spécialité
              </h3>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="">Toutes les spécialités</option>
                <option value="ophtalmologue">Ophtalmologue</option>
                <option value="cardiologue">Cardiologue</option>
                <option value="pédiatre">Pédiatre</option>
                <option value="dermatologue">Dermatologue</option>
                <option value="dentiste">Dentiste</option>
                <option value="gynécologue">Gynécologue</option>
              </select>
            </div>
          )}
        </aside>

        {/* Results Area */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Search Input Box */}
          <div className="glass" style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SearchIcon size={20} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Rechercher par service, mot-clé ou prestataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '1rem',
                color: 'var(--text-main)',
                padding: '12px 0'
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 700 }}
              >
                Vider
              </button>
            )}
          </div>

          {/* Service Listing */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '5px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Recherche de prestations disponibles...</p>
            </div>
          ) : filteredServices.length > 0 ? (
            <div>
              <p style={{ textAlign: 'left', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Nous avons trouvé <strong>{filteredServices.length}</strong> service{filteredServices.length > 1 ? 's' : ''} correspondant à vos critères.
              </p>
              <div className="grid-3">
                {filteredServices.map(service => (
                  <ServiceCard key={service._id || service.id} service={service} />
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: 'var(--surface)' }}>
              <h3 style={{ marginBottom: '12px', fontSize: '1.35rem' }}>Aucun service trouvé</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
                Essayez de modifier vos filtres, de vider la recherche textuelle ou de sélectionner une autre catégorie.
              </p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); setPriceLimit(250); setSelectedGovernorate(''); setSelectedSpecialty(''); }} className="btn btn-primary">
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
