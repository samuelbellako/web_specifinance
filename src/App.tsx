import React, { useState } from 'react';
import { Lead, Booking, OutgoingEmailLog, QuoteCalculated } from './types';
import { INITIAL_LEADS, INITIAL_BOOKINGS } from './data';
import Cotizador from './components/Cotizador';
import Scheduler from './components/Scheduler';
import AdminDashboard from './components/AdminDashboard';
import { 
  TrendingUp, BarChart3, Receipt, Users, ShieldCheck, Mail, Phone, MapPin, 
  ArrowRight, Sparkles, CheckCircle2, ChevronRight, X, Play, Settings, 
  Layers, Lock, Database, UserCheck, Check, MessageSquare, Menu, Clock
} from 'lucide-react';

export default function App() {
  // Database States
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [emailLogs, setEmailLogs] = useState<OutgoingEmailLog[]>([]);

  // Toggle Admin backoffice view vs standard public landing page
  const [adminMode, setAdminMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Admin Authentication states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');

  // Selected Service in landing page (for easy syncing with Cotizador)
  const [serviceOfInterest, setServiceOfInterest] = useState('full-growth');

  // Multi-Form / Input states for public diagnostic request
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formSize, setFormSize] = useState('11 - 50 empleados');
  const [formService, setFormService] = useState('Full Growth Partner');
  const [formNeeds, setFormNeeds] = useState('');
  const [formAgreed, setFormAgreed] = useState(false);

  // Success indicator for the main contact form
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [diagnosticLeadCreated, setDiagnosticLeadCreated] = useState<Lead | null>(null);

  // States for the 2-Pillar Interlocking Corporate Hub
  const [activePillarTab, setActivePillarTab] = useState<'financial' | 'marketing' | 'synergy'>('financial');
  const [pillarFinRevenue, setPillarFinRevenue] = useState(60000);
  const [pillarFinEbitda, setPillarFinEbitda] = useState(12);
  const [pillarMktSpend, setPillarMktSpend] = useState(5000);
  const [pillarMktCpl, setPillarMktCpl] = useState(25);
  const [pillarMktConversion, setPillarMktConversion] = useState(3.5);
  const [pillarMktAov, setPillarMktAov] = useState(1200);

  // Handles updating lead states inside CRM
  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead)
    );
  };

  // Direct append of leads
  const handleAddLead = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
  };

  // Direct append of bookings
  const handleAddBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  // Append outbound Resend email log
  const handleSendEmailLog = (log: OutgoingEmailLog) => {
    setEmailLogs(prev => [log, ...prev]);
  };

  // Custom live calculation apply handler (autofills form with estimated rates!)
  const handleQuoteApplied = (quote: QuoteCalculated) => {
    setFormService(quote.serviceName);
    setFormSize(
      quote.teamSize > 100 ? '+200 empleados' :
      quote.teamSize > 40 ? '51 - 200 empleados' :
      quote.teamSize > 10 ? '11 - 50 empleados' : '1 - 10 empleados'
    );
    setFormNeeds(
      prev => {
        const addon = `[Plan Est. Cotizado: ${quote.serviceName} | Estimado Retenedor: $${quote.estimatedPrice.toLocaleString()} USD | EBITDA Proyectado: +${quote.potentialEbitdaGain}%]`;
        if (prev.includes('[Plan Est. Cotizado')) return prev;
        return prev ? `${prev}\n\n${addon}` : addon;
      }
    );
    
    // Smooth scroll immediately down to diagnostic section so user can submit it
    const formSection = document.getElementById('contacto');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit main Public Contact/Diagnostic Form
  const handleSubmitDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAgreed) {
      alert('Debe aceptar la política de tratamiento de datos personales.');
      return;
    }

    // Determine estimated quote based on selected unit
    let priceEstimate = 2200;
    let roiEstimate = 24;
    if (formService.includes('CFO')) {
      priceEstimate = 1800;
      roiEstimate = 18;
    } else if (formService.includes('Data')) {
      priceEstimate = 1500;
      roiEstimate = 35;
    } else if (formService.includes('Full')) {
      priceEstimate = 3200;
      roiEstimate = 28;
    }

    const newLeadId = `lead-pub-${Date.now()}`;
    const newLead: Lead = {
      id: newLeadId,
      fullName: formName,
      role: formRole || 'Personal / No aplica',
      companyName: formCompany || 'Uso Personal / Proyecto',
      email: formEmail,
      phone: formPhone,
      city: formCity || 'No especificada',
      companySize: formSize,
      serviceOfInterest: formService,
      needsDescription: formNeeds || 'Diagnóstico de rentabilidad estándar.',
      status: 'Nuevo',
      createdAt: new Date().toISOString(),
      quotedPrice: priceEstimate,
      estimatedRoi: roiEstimate
    };

    // Add directly to CRM state
    handleAddLead(newLead);
    setDiagnosticLeadCreated(newLead);
    setFormSubmitted(true);
  };

  // Handle Admin Auth Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.trim().toLowerCase() === 'specifinance@gmail.com' && adminPassword === 'money') {
      setIsAdminAuthenticated(true);
      setAdminAuthError('');
    } else {
      setAdminAuthError('Usuario o clave incorrectos. Acceso denegado.');
    }
  };

  // Reset Public Diagnostic Form to let user create another
  const resetPublicForm = () => {
    setFormName('');
    setFormRole('');
    setFormCompany('');
    setFormEmail('');
    setFormPhone('');
    setFormCity('');
    setFormNeeds('');
    setFormSubmitted(false);
    setDiagnosticLeadCreated(null);
  };

  return (
    <div className="min-h-screen bg-background-soft text-deep-navy selection:bg-muted-gold/30">
      
      {/* Premium Notification bar */}
      <div className="bg-deep-navy text-white text-[11px] font-sans font-medium py-2 px-4 shadow-inner text-center flex flex-col md:flex-row items-center justify-center gap-3">
        <span>
          🚀 <strong className="text-indigo-400 uppercase">Consola de Simulación Activa:</strong> Evaluador del sistema.
        </span>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => {
              setAdminMode(!adminMode);
              setMobileMenuOpen(false);
            }}
            className="bg-muted-gold hover:bg-indigo-700 text-white px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider transition-colors cursor-pointer"
            id="toggle-admin-bar"
          >
            {adminMode ? '💻 Regresar a Landing Page' : '📊 Entrar a Consola CRM (Backoffice)'}
          </button>
        </div>
      </div>

      {/* Main TopNavBar */}
      <nav id="nav-primary" className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-border-subtle shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <a href="#" className="font-heading font-extrabold text-2xl text-deep-navy tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-muted-gold rounded-sm block" />
            Specifinance
          </a>

          {/* Desktop Nav menus */}
          {!adminMode && (
            <div className="hidden md:flex gap-8 items-center">
              <a href="#inicio" className="text-xs font-semibold uppercase tracking-wider text-deep-navy border-b-2 border-deep-navy pb-1">
                Inicio
              </a>
              <a href="#que-hacemos" className="text-xs font-semibold uppercase tracking-wider text-charcoal-text hover:text-deep-navy transition-colors">
                Qué hacemos
              </a>
              <a href="#servicios" className="text-xs font-semibold uppercase tracking-wider text-charcoal-text hover:text-deep-navy transition-colors">
                Servicios
              </a>
              <a href="#cotizador" className="text-xs font-semibold uppercase tracking-wider text-charcoal-text hover:text-deep-navy transition-colors">
                Simulador
              </a>
              <a href="#metodologia" className="text-xs font-semibold uppercase tracking-wider text-charcoal-text hover:text-deep-navy transition-colors">
                Metodología
              </a>
              <a href="#resultados" className="text-xs font-semibold uppercase tracking-wider text-charcoal-text hover:text-deep-navy transition-colors">
                Resultados
              </a>
              <a href="#contacto" className="text-xs font-semibold uppercase tracking-wider text-charcoal-text hover:text-deep-navy transition-colors">
                Contacto
              </a>
            </div>
          )}

          <div className="flex gap-2 items-center">
            {/* Toggle bar inside nav */}
            <button
               onClick={() => {
                 setAdminMode(!adminMode);
                 setMobileMenuOpen(false);
               }}
               className={`hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider border px-3 py-1.5 rounded transition-all cursor-pointer items-center gap-1 ${
                 adminMode ? 'border-deep-navy bg-deep-navy text-white hover:bg-black' : 'border-border-subtle text-charcoal-text hover:border-deep-navy'
               }`}
               id="nav-crm-toggle"
            >
              <Database className="w-3.5 h-3.5" />
              {adminMode ? 'Ver Web' : 'Backoffice CRM'}
            </button>

            <a 
              href="#contacto"
              className="bg-deep-navy text-white hover:bg-black px-5 py-2 rounded font-sans text-xs tracking-wider uppercase font-semibold transition-colors shadow-sm"
              id="cta-diagnostic-nav"
            >
              Solicitar diagnóstico
            </a>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button" 
              className="md:hidden text-deep-navy p-1"
              id="btn-mobile-menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border-subtle px-6 py-4 space-y-4 shadow-lg absolute w-full left-0">
            <div className="flex flex-col gap-3 text-sm">
              <a href="#que-hacemos" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-charcoal-text block py-1.5 border-b border-slate-100">
                Qué hacemos
              </a>
              <a href="#servicios" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-charcoal-text block py-1.5 border-b border-slate-100">
                Servicios
              </a>
              <a href="#cotizador" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-charcoal-text block py-1.5 border-b border-slate-100 font-bold text-deep-navy">
                🔄 Simulador Financiero Est.
              </a>
              <a href="#metodologia" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-charcoal-text block py-1.5 border-b border-slate-100">
                Metodología
              </a>
              <a href="#resultados" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-charcoal-text block py-1.5 border-b border-slate-100">
                Resultados
              </a>
              <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-charcoal-text block py-1.5 ">
                Contacto
              </a>
              <button
                onClick={() => {
                  setAdminMode(!adminMode);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-slate-100 text-deep-navy font-bold py-2 px-3 text-xs uppercase tracking-wider rounded text-center border border-border-subtle"
              >
                {adminMode ? '💻 Volver a Página Web' : '📊 Ir a CRM de Clientes'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ADMIN CONTEXT DASHBOARD */}
      {adminMode ? (
        !isAdminAuthenticated ? (
          <main className="max-w-md mx-auto px-6 py-16">
            <div className="bg-white rounded-2xl border border-border-subtle p-8 shadow-xl space-y-6">
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-700 shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-deep-navy">
                  Acceso Restringido CRM
                </h2>
                <p className="text-charcoal-text text-xs leading-relaxed px-4">
                  Consola Administrativa de Socios de <strong>Specifinance S.A.S</strong>
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-charcoal-text uppercase tracking-wider mb-1.5 font-sans">
                    Usuario / Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => {
                      setAdminEmail(e.target.value);
                      if (adminAuthError) setAdminAuthError('');
                    }}
                    placeholder="ej: specifinance@gmail.com"
                    className="w-full px-3.5 py-2 text-xs border border-border-subtle rounded-lg bg-surface-gray/50 focus:bg-white focus:border-deep-navy focus:ring-1 focus:ring-deep-navy text-deep-navy outline-none"
                    id="admin-login-email-input"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-charcoal-text uppercase tracking-wider mb-1.5 font-sans">
                    Clave de Acceso
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (adminAuthError) setAdminAuthError('');
                    }}
                    placeholder="Ingrese contraseña de socio"
                    className="w-full px-3.5 py-2 text-xs border border-border-subtle rounded-lg bg-surface-gray/50 focus:bg-white focus:border-deep-navy focus:ring-1 focus:ring-deep-navy text-deep-navy outline-none animate-none"
                    id="admin-login-password-input"
                  />
                </div>

                {adminAuthError && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-2 text-red-800 text-xs leading-snug">
                    <X className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
                    <span>{adminAuthError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-deep-navy hover:bg-black text-white py-2.5 rounded-lg font-heading font-medium text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
                  id="admin-login-submit"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Verificar Credenciales
                </button>
              </form>

              <div className="pt-4 border-t border-border-subtle text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAdminMode(false);
                    setAdminAuthError('');
                  }}
                  className="text-indigo-650 hover:text-indigo-800 font-semibold text-xs text-center"
                >
                  ← Volver a la Landing Page Pública
                </button>
              </div>

            </div>
          </main>
        ) : (
          <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded text-xs text-blue-900 leading-normal mb-2 flex justify-between items-start gap-3">
              <div className="flex gap-3 items-start">
                <Database className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Consola Backoffice Simulada Operativa:</strong>
                  Aquí operan las solicitudes ingresadas desde la web en tiempo real. Puede utilizar los filtros de lead para encontrar datos, actualizar su estado (e.g. "Reunión Agendada"), formular respuestas utilizando plantillas estructuradas, simular la integración de correos a través de <strong>Resend API</strong> y visualizar los logs de comunicación.
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAdminAuthenticated(false);
                  setAdminMode(false);
                  setAdminEmail('');
                  setAdminPassword('');
                }}
                className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider flex-shrink-0 cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>

            <AdminDashboard 
              leads={leads}
              bookings={bookings}
              emailLogs={emailLogs}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onAddLead={handleAddLead}
              onAddBooking={handleAddBooking}
              onSendEmail={handleSendEmailLog}
            />
          </main>
        )
      ) : (
        /* PUBLIC LANDING PORTAL */
        <div>
          {/* Hero Section */}
          <header id="inicio" className="relative overflow-hidden pt-12 pb-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="space-y-6">
                <span className="inline-flex py-1 px-3 bg-white/70 border border-border-subtle rounded text-deep-navy font-sans text-[11px] tracking-widest uppercase font-semibold">
                  📈 Consultoría Boutique de Estrategia
                </span>
                
                <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-deep-navy leading-tight tracking-tight">
                  Dirección financiera y crecimiento corporativo basados en datos.
                </h1>
                
                <p className="text-charcoal-text text-base md:text-lg max-w-xl leading-relaxed">
                  En <strong className="text-deep-navy">Specifinance</strong> ayudamos a pequeñas y medianas empresas a tomar mejores decisiones financieras, optimizar su rentabilidad y ejecutar estrategias de crecimiento respaldadas por datos reales.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a 
                    href="https://calendly.com/specifinance/consultoria" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-deep-navy text-white hover:bg-black text-center px-8 py-3.5 rounded font-heading font-medium text-sm transition-colors shadow-lg"
                  >
                    Agenda una reunión gratuita para tu consultoría
                  </a>
                  <a 
                    href="#metodologia" 
                    className="border border-deep-navy text-deep-navy hover:bg-deep-navy/5 text-center px-8 py-3.5 rounded font-heading font-medium text-sm transition-colors"
                  >
                    Ver Metodología de Trabajo
                  </a>
                </div>
              </div>

              {/* Graphic dashboard preview */}
              <div className="relative">
                <div className="bg-white rounded-xl boutique-shadow border border-border-subtle p-3 overflow-hidden">
                  <img 
                    alt="Financial Dashboard" 
                    className="w-full h-auto rounded-lg shadow-sm" 
                    referrerPolicy="no-referrer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX6w3wgJQFvvKPXhF0dxFHuPKeW4h5fgZIUt3ePTxgo10HZ1NjjchwE_gv_OeP_H4-Ch9WC_yHkWa0alJeb4uxwI1HlzY9hUOpvqcPuESXvYHQkgMRn_R8kE9ETw0exq4689SErSRxlJo2B0y_NuRyZ_4MQ9rk8h110-IECkBgqStgaVr3FGWNds3SOYD6VctfN1W-dQih2w_ypPXz2HStz_lVm6nX-jnSBNwKoGrQf51Owv3thEc5HUmDIld4lCXZB8yPuXCYs5o" 
                  />
                </div>
                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-deep-navy text-white p-5 rounded-lg shadow-xl max-w-xs hidden md:block border border-white/10">
                  <p className="font-heading text-lg font-bold leading-snug">
                    Finanzas + Marketing + Datos = <span className="text-growth-green font-extrabold">Crecimiento rentable</span>
                  </p>
                  <p className="text-white/60 text-[11px] mt-1.5 font-mono">
                    Auditoría Boutique Real con Retorno de Inversión.
                  </p>
                </div>
              </div>

            </div>
          </header>

          {/* Core Corporate Dilemma Block */}
          <section className="bg-surface-gray py-20 border-y border-border-subtle">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <h2 className="font-heading font-extrabold text-2xl md:text-3xl lg:text-4xl text-deep-navy leading-tight">
                  Muchas empresas crecen sin saber realmente qué está impulsando o frenando sus resultados.
                </h2>
                <div className="w-12 h-1 bg-muted-gold mx-auto rounded" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white p-6 rounded-lg border border-border-subtle space-y-3 shadow-sm hover:border-deep-navy transition-all">
                  <span className="w-10 h-10 rounded-full bg-slate-100 text-deep-navy flex items-center justify-center font-bold text-center">
                    01
                  </span>
                  <h3 className="font-heading font-bold text-sm text-deep-navy uppercase tracking-wider">
                    Opacidad en Rentabilidad
                  </h3>
                  <p className="text-charcoal-text text-xs leading-relaxed">
                    Desconocimiento de la rentabilidad real por producto, cliente o unidad de negocio. No todo lo que factura deja dinero.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-border-subtle space-y-3 shadow-sm hover:border-deep-navy transition-all">
                  <span className="w-10 h-10 rounded-full bg-slate-100 text-deep-navy flex items-center justify-center font-bold text-center">
                    02
                  </span>
                  <h3 className="font-heading font-bold text-sm text-deep-navy uppercase tracking-wider">
                    Marketing sin Retorno
                  </h3>
                  <p className="text-charcoal-text text-xs leading-relaxed">
                    Inversión publicitaria sin una medición clara del retorno sobre la inversión de marketing publicitario (ROMI) real.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-border-subtle space-y-3 shadow-sm hover:border-deep-navy transition-all">
                  <span className="w-10 h-10 rounded-full bg-slate-100 text-deep-navy flex items-center justify-center font-bold text-center">
                    03
                  </span>
                  <h3 className="font-heading font-bold text-sm text-deep-navy uppercase tracking-wider">
                    Costos Ocultos de Planta
                  </h3>
                  <p className="text-charcoal-text text-xs leading-relaxed">
                    Fuga constante de capital en procesos ineficientes y costos operativos de personal o logística no identificados.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-border-subtle space-y-3 shadow-sm hover:border-deep-navy transition-all">
                  <span className="w-10 h-10 rounded-full bg-slate-100 text-deep-navy flex items-center justify-center font-bold text-center">
                    04
                  </span>
                  <h3 className="font-heading font-bold text-sm text-deep-navy uppercase tracking-wider">
                    Intuición vs Datos
                  </h3>
                  <p className="text-charcoal-text text-xs leading-relaxed">
                    Decisiones de contratación, inventario y expansión basadas en sensaciones o el "feeling" empresarial.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* Value Connection Block */}
          <section id="que-hacemos" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              
              <div className="space-y-8">
                <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-deep-navy leading-tight tracking-tight">
                  Somos la conexión operativa entre la dirección financiera y el crecimiento de su empresa.
                </h2>

                <div className="space-y-6">
                  
                  <div className="flex gap-4 items-start">
                    <span className="p-2 bg-slate-100 rounded-lg text-deep-navy">
                      <TrendingUp className="w-5 h-5 text-muted-gold" />
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-base text-deep-navy">
                        Audi-Diagnosticamos en Profundidad
                      </h4>
                      <p className="text-charcoal-text text-sm mt-1 leading-relaxed">
                        Auditoría profunda de estados financieros, márgenes de distribución y procesos comerciales para encontrar el origen exacto de las pérdidas o la ineficiencia.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="p-2 bg-slate-100 rounded-lg text-deep-navy">
                      <BarChart3 className="w-5 h-5 text-muted-gold" />
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-base text-deep-navy">
                        Diseñamos Estrategias de Unidad
                      </h4>
                      <p className="text-charcoal-text text-sm mt-1 leading-relaxed">
                        Evaluamos y creamos el roadmap financiero y comercial enfocado en maximizar el flujo de caja operativo de la compañía y el EBITDA.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="p-2 bg-slate-100 rounded-lg text-deep-navy">
                      <UserCheck className="w-5 h-5 text-muted-gold" />
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-base text-deep-navy">
                        Acompañamos Ejecuciones Reales
                      </h4>
                      <p className="text-charcoal-text text-sm mt-1 leading-relaxed">
                        No entregamos un PDF teórico para archivar. Trabajamos hombro a hombro con la gerencia general de forma semanal para asegurar que cada recomendación se implemente con éxito.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Graphic presentation board */}
              <div className="relative">
                <img 
                  alt="Estrategia Corporativa" 
                  className="rounded-2xl boutique-shadow w-full object-cover max-h-[480px]" 
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGSRRl3wHUG4Y-caU7d5POTX2hx0UBv7REt8DSHwyV7jstZwMCK57GWQbJ-Zz7-ctNh_UuDacGa5AN_JggwhHQ7f5JEujLHy7OG2lkUSlxZ4Qt8F6jUhClWCN_rdmVWEHKl7Ey8lgzLl5NplFFRDkaW1cX619YvmanZ9No-VCJbpPacBusO0y0-2AE85hAXA9H_gqfQXWyNVI6it6rTCUZBKuOnQiWk98iHzh3ro_WGMORFmuFLH446rhKLP7me-lPg0jj9QlV87Y" 
                />
              </div>

            </div>
          </section>

          {/* Specifinance vs Traditional Differential Table */}
          <section className="py-20 bg-deep-navy text-white border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
              <div className="text-center space-y-3">
                <h2 className="font-heading font-extrabold text-3xl md:text-4xl">
                  No entregamos solo diagnósticos.{' '}
                  <span className="text-muted-gold underline decoration-growth-green">Construimos soluciones.</span>
                </h2>
                <p className="text-white/60 text-xs tracking-wider uppercase font-mono max-w-lg mx-auto">
                  La diferencia radical de trabajar con un socio experto en lugar de una consultora contable común.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                
                {/* Traditional */}
                <div className="p-8 md:p-12 hover:bg-white/5 bg-white/[0.02] border-b lg:border-b-0 lg:border-r border-white/10 space-y-8">
                  <h3 className="font-heading font-bold text-lg text-white/50 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    Consultoría Financiera Tradicional
                  </h3>
                  <ul className="space-y-5 text-xs text-white/70 leading-relaxed md:text-sm">
                    <li className="flex gap-3 items-start">
                      <span className="text-red-500 text-lg font-bold flex-shrink-0 mt-0.5">•</span>
                      Informes estáticos en PowerPoint o PDF pesados que terminan archivados en un cajón.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-red-500 text-lg font-bold flex-shrink-0 mt-0.5">•</span>
                      Enfoque puramente tributario o fiscal sin una visión integrada de negocio y comercial.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-red-500 text-lg font-bold flex-shrink-0 mt-0.5">•</span>
                      Desconexión radical entre la inversión publicitaria de marketing y los números consolidados de caja.
                    </li>
                  </ul>
                </div>

                {/* Specifinance */}
                <div className="p-8 md:p-12 bg-white/[0.08] relative space-y-8">
                  <span className="absolute top-4 right-4 bg-growth-green text-white font-mono text-[9px] px-2.5 py-0.5 rounded uppercase font-bold tracking-widest">
                    El Diferencial
                  </span>
                  
                  <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-growth-green" />
                    Specifinance Boutique Business Model
                  </h3>

                  <ul className="space-y-5 text-xs text-white/90 leading-relaxed md:text-sm">
                    <li className="flex gap-3 items-start">
                      <span className="text-growth-green text-lg font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>
                        <strong className="text-white">Partner Estratégico Real:</strong> Formamos parte de su mesa directiva de toma de decisiones y ejecutamos los cambios junto a su equipo contable interno.
                      </span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-growth-green text-lg font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>
                        <strong className="text-white">Tableros Bi Interactivos:</strong> Creamos y automatizamos un dashboard unificado en tiempo real para visualizar ingresos, margen de contribución y EBITDA de forma interactiva.
                      </span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-growth-green text-lg font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>
                        <strong className="text-white">Estructuración Integrada:</strong> Alineamos el presupuesto publicitario con los unit economics del negocio para garantizar un ROMI óptimo.
                      </span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </section>

          {/* TWO PILLARS CORPORATE INTERACTION SECTION */}
          <section className="py-24 bg-white border-b border-border-subtle" id="ejes-especializacion">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-flex py-1 px-3 bg-indigo-50 border border-indigo-100 rounded text-indigo-700 font-sans text-[11px] tracking-widest uppercase font-semibold">
                    🔑 Estructura Organizacional de Alto Valor
                  </span>
                  <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-deep-navy leading-tight tracking-tight">
                    Dirección Profesional Independiente. <span className="text-indigo-600">Sinergia Financiera Absoluta.</span>
                  </h2>
                  <p className="text-charcoal-text text-sm md:text-base max-w-3xl leading-relaxed">
                    Specifinance es una firma boutique que no improvisa. Operamos bajo dos ejes estratégicos fundamentales independientes en su desarrollo técnico, pero sincronizados de forma operativa para que cada centavo invertido comercialmente esté respaldado por un diagnóstico financiero real.
                  </p>
                </div>
                
                <div className="lg:col-span-4 flex lg:justify-end">
                  <div className="bg-slate-100 p-1 rounded-xl flex gap-1 w-full lg:w-auto" id="pillar-tabs">
                    <button
                      onClick={() => setActivePillarTab('financial')}
                      className={`flex-1 lg:flex-initial text-center py-2.5 px-5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                        activePillarTab === 'financial'
                          ? 'bg-deep-navy text-white shadow-md'
                          : 'text-charcoal-text hover:text-deep-navy hover:bg-slate-50'
                      }`}
                    >
                      💼 Eje Financiero
                    </button>
                    <button
                      onClick={() => setActivePillarTab('marketing')}
                      className={`flex-1 lg:flex-initial text-center py-2.5 px-5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                        activePillarTab === 'marketing'
                          ? 'bg-deep-navy text-white shadow-md'
                          : 'text-charcoal-text hover:text-deep-navy hover:bg-slate-50'
                      }`}
                    >
                      📢 Eje Marketing
                    </button>
                    <button
                      onClick={() => setActivePillarTab('synergy')}
                      className={`flex-1 lg:flex-initial text-center py-2.5 px-5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                        activePillarTab === 'synergy'
                          ? 'bg-deep-navy text-white shadow-md'
                          : 'text-charcoal-text hover:text-deep-navy hover:bg-slate-50'
                      }`}
                    >
                      🔗 Ciclo de Sinergia
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTIVE TAB CONTENT CONTAINER */}
              <div className="bg-surface-gray rounded-2xl border border-border-subtle p-6 md:p-10 transition-all duration-500 hover:shadow-md">
                
                {/* 1. FINANCIAL PILLAR */}
                {activePillarTab === 'financial' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left: Metadata & Leadership */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center p-5 bg-white rounded-xl border border-border-subtle">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-2xl flex-shrink-0 border-2 border-indigo-200 shadow-sm font-sans">
                          JS
                        </div>
                        <div>
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold font-sans tracking-wide">
                            DIRECTOR PROFESIONAL DE ÁREA
                          </span>
                          <h4 className="font-heading font-extrabold text-lg text-deep-navy" id="financial-director-name">
                            Dr. Juan Suarez, Director Financiero
                          </h4>
                          <p className="text-charcoal-text text-xs" id="financial-director-bio">
                            Director con dirección en portafolios, análisis financiero y cartera. Asociado especializado en el crecimiento estratégico y equilibrio financiero en PyMEs nacionales e internacionales.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-heading font-extrabold text-indigo-900 text-sm tracking-wide uppercase">
                          Enfoque Técnico y Entregables del Área:
                        </h4>
                        
                        <p className="text-charcoal-text text-sm leading-relaxed">
                          Este eje se enfoca en blindar la viabilidad y rentabilidad a largo plazo. No se trata simplemente de contabilizar transacciones; el Director Financiero diseña la estructura presupuestaria que evita fugas de capital y optimiza el retorno del negocio.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="bg-white p-3 rounded border border-border-subtle">
                            <span className="text-xs font-bold text-deep-navy block">📊 EBITDA Ajustado</span>
                            <span className="text-[11px] text-charcoal-text italic">Optimización de costos fijos y diseño del margen bruto real.</span>
                          </div>
                          <div className="bg-white p-3 rounded border border-border-subtle">
                            <span className="text-xs font-bold text-deep-navy block">💸 Flujo de Caja Libre</span>
                            <span className="text-[11px] text-charcoal-text italic">Proyecciones de liquidez y control semanal de tesorería.</span>
                          </div>
                          <div className="bg-white p-3 rounded border border-border-subtle">
                            <span className="text-xs font-bold text-deep-navy block">🎯 Punto de Equilibrio</span>
                            <span className="text-[11px] text-charcoal-text italic">Cálculo dinámico del nivel de ventas mínimo de supervivencia.</span>
                          </div>
                          <div className="bg-white p-3 rounded border border-border-subtle">
                            <span className="text-xs font-bold text-deep-navy block">📈 Múltiplos Sectoriales</span>
                            <span className="text-[11px] text-charcoal-text italic">Valoración constante orientada a levantar capital o estructurar deuda.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Interactive simulation widget */}
                    <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-xl border border-border-subtle shadow-md space-y-6">
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-mono tracking-wider rounded font-bold uppercase mb-1">
                          Mini-Simulador Financiero
                        </span>
                        <h3 className="font-heading font-extrabold text-xl text-deep-navy">
                          Impacto en EBITDA y Liquidez
                        </h3>
                        <p className="text-charcoal-text text-xs">
                          Mueva los rangos para evaluar cómo una mejora quirúrgica de Specifinance (estimada conservadoramente en 3.8%) libera capital dormido.
                        </p>
                      </div>

                      <hr className="border-slate-100" />

                      {/* Slider: Monthly sales */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-charcoal-text uppercase">Venta Mensual de la Compañía</span>
                          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">${pillarFinRevenue.toLocaleString()} USD</span>
                        </div>
                        <input
                          type="range"
                          min="15000"
                          max="250000"
                          step="5000"
                          value={pillarFinRevenue}
                          onChange={(e) => setPillarFinRevenue(Number(e.target.value))}
                          className="w-full accent-deep-navy"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>$15,000 USD / mes</span>
                          <span>$250,000 USD / mes</span>
                        </div>
                      </div>

                      {/* Slider: current EBITDA */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-charcoal-text uppercase">Margen EBITDA Actual</span>
                          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{pillarFinEbitda}%</span>
                        </div>
                        <input
                          type="range"
                          min="3"
                          max="35"
                          step="1"
                          value={pillarFinEbitda}
                          onChange={(e) => setPillarFinEbitda(Number(e.target.value))}
                          className="w-full accent-deep-navy"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>3% (Bajo)</span>
                          <span>35% (Élite)</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-center divide-x divide-slate-200">
                          <div>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">EBITDA Anual Actual</span>
                            <span className="text-sm font-semibold text-slate-600 font-mono">
                              ${Math.round((pillarFinRevenue * 12) * (pillarFinEbitda / 100)).toLocaleString()} USD
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-widest block">EBITDA Optimizado (+3.8%)</span>
                            <span className="text-sm font-bold text-indigo-800 font-mono">
                              ${Math.round((pillarFinRevenue * 12) * ((pillarFinEbitda + 3.8) / 100)).toLocaleString()} USD
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                          <span className="text-xs text-charcoal-text font-semibold">Caja Anual Unlocked:</span>
                          <span className="text-base font-bold text-growth-green font-mono">
                            +${Math.round((pillarFinRevenue * 12) * 0.038).toLocaleString()} USD / año
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-relaxed text-center italic">
                        Esta caja liberada representa capital libre directo reintegrado al presupuesto sin requerir crédito bancario o diluciones de equity.
                      </p>

                    </div>
                  </div>
                )}

                {/* 2. MARKETING & GROWTH PILLAR */}
                {activePillarTab === 'marketing' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left: Metadata & Leadership */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center p-5 bg-white rounded-xl border border-border-subtle">
                        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-extrabold text-2xl flex-shrink-0 border-2 border-pink-200 shadow-sm font-sans">
                          SG
                        </div>
                        <div>
                          <span className="text-[10px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded font-bold font-sans tracking-wide">
                            DIRECTOR PROFESIONAL DE ÁREA
                          </span>
                          <h4 className="font-heading font-extrabold text-lg text-deep-navy" id="marketing-director-name">
                            Dr. Samuel Galeano, Director de Marketing
                          </h4>
                          <p className="text-charcoal-text text-xs leading-relaxed" id="marketing-director-bio">
                            Especialista en marketing cuantitativo y arquitecto de automatizaciones digitales a escala. Experto en el diseño y despliegue de estrategias de crecimiento de marca, transformando datos financieros e indicadores de negocio en sistemas automatizados de adquisición con alta rentabilidad de pauta.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-heading font-extrabold text-indigo-900 text-sm tracking-wide uppercase">
                          Enfoque y Enfoques de Intervención del Sector:
                        </h4>
                        
                        <p className="text-charcoal-text text-sm leading-relaxed">
                          La inversión publicitaria es un generador de retornos, no un gasto. El área de Marketing estructura la táctica de adquisición basándose en la rentabilidad real de los productos, alineando la imagen de la marca para cobrar tarifas premium e incrementando la tracción comercial sistemáticamente.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="bg-white p-3 rounded border border-border-subtle">
                            <span className="text-xs font-bold text-deep-navy block">🎨 Identidad y Rebranding Digital</span>
                            <span className="text-[11px] text-charcoal-text italic">Mejora sustancial en la percepción del valor para justificar mejores precios.</span>
                          </div>
                          <div className="bg-white p-3 rounded border border-border-subtle">
                            <span className="text-xs font-bold text-deep-navy block">📣 Pauta y Aumento de Ventas</span>
                            <span className="text-[11px] text-charcoal-text italic">Inyección omnicanal enfocada a la captación de leads listos para comprar.</span>
                          </div>
                          <div className="bg-white p-3 rounded border border-border-subtle">
                            <span className="text-xs font-bold text-deep-navy block">💼 Estrategias LinkedIn B2B</span>
                            <span className="text-[11px] text-charcoal-text italic">Posicionamiento directivo para cerrar contratos comerciales de alto ticket.</span>
                          </div>
                          <div className="bg-white p-3 rounded border border-border-subtle">
                            <span className="text-xs font-bold text-deep-navy block">⚡ CAC / LTV Matrix</span>
                            <span className="text-[11px] text-charcoal-text italic">Auditoría minuciosa de canales para invertir solo donde haya conversión ágil.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Interactive simulation widget */}
                    <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-xl border border-border-subtle shadow-md space-y-5">
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-pink-50 text-pink-700 text-[10px] font-mono tracking-wider rounded font-bold uppercase mb-1">
                          Simulador de Retorno de Pauta
                        </span>
                        <h3 className="font-heading font-extrabold text-xl text-deep-navy">
                          Matriz CAC vs LTV y ROMI
                        </h3>
                        <p className="text-charcoal-text text-xs">
                          Alimente las variables de su presupuesto y conversión para medir la salud de adquisición de clientes y proyectar resultados comerciales.
                        </p>
                      </div>

                      <hr className="border-slate-100" />

                      <div className="grid grid-cols-2 gap-4">
                        {/* Monthly Spend */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-charcoal-text uppercase block">Inversión Mensual (USD)</label>
                          <input
                            type="number"
                            className="w-full p-2 border border-border-subtle rounded font-mono text-xs text-deep-navy"
                            value={pillarMktSpend}
                            onChange={(e) => setPillarMktSpend(Math.max(1, Number(e.target.value)))}
                          />
                        </div>
                        {/* Cost Per Lead */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-charcoal-text uppercase block">Costo Por Lead (CPL)</label>
                          <input
                            type="number"
                            className="w-full p-2 border border-border-subtle rounded font-mono text-xs text-deep-navy"
                            value={pillarMktCpl}
                            onChange={(e) => setPillarMktCpl(Math.max(0.1, Number(e.target.value)))}
                          />
                        </div>
                        {/* Conversion Rate */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-charcoal-text uppercase block">Tasa de Conversión (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            className="w-full p-2 border border-border-subtle rounded font-mono text-xs text-deep-navy"
                            value={pillarMktConversion}
                            onChange={(e) => setPillarMktConversion(Math.max(0.1, Number(e.target.value)))}
                          />
                        </div>
                        {/* LTV */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-charcoal-text uppercase block">Valor Promedio de Venta (LTV)</label>
                          <input
                            type="number"
                            className="w-full p-2 border border-border-subtle rounded font-mono text-xs text-deep-navy"
                            value={pillarMktAov}
                            onChange={(e) => setPillarMktAov(Math.max(1, Number(e.target.value)))}
                          />
                        </div>
                      </div>

                      {/* Calculations output */}
                      {(() => {
                        const leads = Math.round(pillarMktSpend / pillarMktCpl);
                        const clients = (pillarMktSpend / pillarMktCpl) * (pillarMktConversion / 100);
                        const cac = clients > 0 ? (pillarMktSpend / clients) : 0;
                        const ltvCacRatio = cac > 0 ? (pillarMktAov / cac) : 0;
                        const pipeGenerated = clients * pillarMktAov;
                        const romi = pillarMktSpend > 0 ? ((pipeGenerated - pillarMktSpend) / pillarMktSpend) * 100 : 0;

                        let ratioLabel = "Peligroso ⚠️";
                        let ratioBg = "bg-red-50 text-red-700 border-red-100";
                        if (ltvCacRatio >= 3 && ltvCacRatio < 5) {
                          ratioLabel = "Saludable ✅";
                          ratioBg = "bg-green-50 text-green-700 border-green-100";
                        } else if (ltvCacRatio >= 5) {
                          ratioLabel = "Excelente Rango Élite 💎";
                          ratioBg = "bg-indigo-50 text-indigo-700 border-indigo-100";
                        }

                        return (
                          <div className="space-y-3 pt-2">
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                                <span className="text-[9px] text-slate-400 uppercase font-bold block">Leads Generados</span>
                                <span className="text-xs font-semibold text-deep-navy font-mono">{leads}</span>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                                <span className="text-[9px] text-slate-400 uppercase font-bold block">Clientes Nuevos</span>
                                <span className="text-xs font-semibold text-deep-navy font-mono">{clients.toFixed(1)}</span>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                                <span className="text-[9px] text-slate-400 uppercase font-bold block">CAC Proyectado</span>
                                <span className="text-xs font-semibold text-deep-navy font-mono">${Math.round(cac).toLocaleString()} USD</span>
                              </div>
                            </div>

                            <div className={`p-3.5 rounded-lg border text-xs flex justify-between items-center ${ratioBg}`}>
                              <div>
                                <span className="font-bold block uppercase text-[10px]">Ratio LTV / CAC:</span>
                                <p className="text-[11px] mt-0.5">La relación de valor de vida vs. costo de adquisición es de {ltvCacRatio.toFixed(1)}x.</p>
                              </div>
                              <span className="font-bold text-xs uppercase px-2 py-1 rounded bg-white/50">{ratioLabel}</span>
                            </div>

                            <div className="p-3 bg-deep-navy text-white rounded flex justify-between items-center">
                              <span className="text-xs font-semibold">Valor Pipeline / Ventas Totales:</span>
                              <span className="text-sm font-bold text-growth-green font-mono">${Math.round(pipeGenerated).toLocaleString()} USD</span>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                              <span className="text-charcoal-text font-semibold">ROMI Proyectado de Inversión:</span>
                              <span className="text-indigo-600 font-extrabold font-mono">{romi.toFixed(0)}%</span>
                            </div>
                          </div>
                        );
                      })()}

                    </div>
                  </div>
                )}

                {/* 3. SYNERGY CYCLE */}
                {activePillarTab === 'synergy' && (
                  <div className="space-y-8">
                    
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                      <span className="text-[10px] bg-green-50 text-green-700 font-mono tracking-widest px-3 py-1 rounded uppercase font-bold">
                        Bucle Virtuoso: SF Growth Framework
                      </span>
                      <h3 className="font-heading font-extrabold text-2xl text-deep-navy">
                        ¿Cómo trabajan de la mano Finanzas y Marketing?
                      </h3>
                      <p className="text-charcoal-text text-xs leading-relaxed">
                        A diferencia de contratar una agencia de marketing común que "quema plata" para buscar likes ficticios, o una firma contable tradicional que solo entrega un balance histórico frío para archivar, Specifinance unifica ambos mundos logrando que se retroalimenten constantemente:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative pt-4">
                      
                      {/* Step 1 */}
                      <div className="bg-white p-5 rounded-xl border border-border-subtle relative hover:border-indigo-500 transition-all">
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-700">1</div>
                        <TrendingUp className="w-8 h-8 text-indigo-600 mb-3" />
                        <h4 className="font-heading font-bold text-sm text-deep-navy">1. Diagnóstico Financiero</h4>
                        <p className="text-charcoal-text text-xs mt-2 leading-relaxed">
                          El Director Financiero audita la estructura de costos y márgenes brutos. Detecta qué líneas de negocio entregan la rentabilidad real más elevada y en cuáles hay pérdidas operativas ocultas.
                        </p>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-white p-5 rounded-xl border border-border-subtle relative hover:border-indigo-500 transition-all">
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-700">2</div>
                        <BarChart3 className="w-8 h-8 text-indigo-600 mb-3" />
                        <h4 className="font-heading font-bold text-sm text-deep-navy">2. Redistribución de Caja</h4>
                        <p className="text-charcoal-text text-xs mt-2 leading-relaxed">
                          La tesorería restringe y corta presupuestos en canales ineficientes o líneas de bajo margen para liberar flujo de caja líquido. Ese presupuesto se transfiere directamente a crecimiento.
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className="bg-white p-5 rounded-xl border border-border-subtle relative hover:border-indigo-500 transition-all">
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-700">3</div>
                        <CheckCircle2 className="w-8 h-8 text-indigo-600 mb-3" />
                        <h4 className="font-heading font-bold text-sm text-deep-navy">3. Ejecución Comercial</h4>
                        <p className="text-charcoal-text text-xs mt-2 leading-relaxed">
                          La Directora de Marketing diseña tácticas de captación (Rebranding, Pauta Directa, B2B LinkedIn) apuntando exclusivamente a las líneas con mejor retorno financiero. La pauta va a lo seguro.
                        </p>
                      </div>

                      {/* Step 4 */}
                      <div className="bg-white p-5 rounded-xl border border-border-subtle relative hover:border-indigo-500 transition-all">
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-700">4</div>
                        <Sparkles className="w-8 h-8 text-indigo-600 mb-3" />
                        <h4 className="font-heading font-bold text-sm text-deep-navy">4. Re-Inyección de Retorno</h4>
                        <p className="text-charcoal-text text-xs mt-2 leading-relaxed">
                          La facturación de alto margen entra directamente a nutrir el capital circulante de la compañía, elevando el valor de la empresa en múltiplos sectoriales, preparándola para rondas o deudas.
                        </p>
                      </div>

                    </div>

                    <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg text-center max-w-xl mx-auto">
                      <p className="text-xs text-indigo-950 font-medium">
                        💼 <strong>Principio Rector de Specifinance:</strong> "Se invierte en pauta comercial solo para captar clientes con márgenes previamente validados y costeados por el CFO."
                      </p>
                    </div>

                  </div>
                )}
                
              </div>

            </div>
          </section>

          {/* Financial Units Services list */}
          <section id="servicios" className="py-24 bg-surface-gray border-b border-border-subtle">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] font-semibold text-muted-gold uppercase tracking-widest block font-mono">
                  Portafolio de Soluciones
                </span>
                <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-deep-navy">
                  Nuestras Unidades de Servicio
                </h2>
                <p className="text-charcoal-text text-xs leading-relaxed max-w-md mx-auto">
                  Seleccione el formato que mejor se alinee a su escala operativa actual para ver o simular su presupuesto.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Unit 1 */}
                <div className="bg-white p-8 rounded-xl border border-border-subtle flex flex-col justify-between hover:shadow-lg transition-all">
                  <div className="space-y-4">
                    <span className="inline-block px-2.5 py-1 text-[9px] bg-deep-navy text-white rounded font-mono font-bold tracking-widest uppercase">
                      MÁS SOLICITADO
                    </span>
                    <h3 className="font-heading font-bold text-xl text-deep-navy">
                      Full Growth Partner
                    </h3>
                    <p className="text-charcoal-text text-xs leading-relaxed">
                      Estrategia general en la que tomamos la dirección financiera y el alineamiento de marketing publicitario bajo una única consola analítica de datos comerciales.
                    </p>
                    <ul className="space-y-2 text-xs text-charcoal-text pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> CFO + Asesor Comercial semanal
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Optimización integrada CAC / LTV
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Reportes de rentabilidad semanales
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <a 
                      href="#cotizador" 
                      onClick={() => setServiceOfInterest('full-growth')}
                      className="w-full inline-block text-center py-2.5 border border-deep-navy text-deep-navy hover:bg-deep-navy hover:text-white transition-all text-xs font-semibold uppercase tracking-wider rounded"
                    >
                      Saber más y Cotizar
                    </a>
                  </div>
                </div>

                {/* Unit 2 */}
                <div className="bg-white p-8 rounded-xl border border-border-subtle flex flex-col justify-between hover:shadow-lg transition-all">
                  <div className="space-y-4">
                    <span className="inline-block px-2.5 py-1 text-[9px] bg-slate-100 text-deep-navy rounded font-mono font-bold tracking-widest uppercase">
                      DIRECCIÓN ESTRUCTURAL
                    </span>
                    <h3 className="font-heading font-bold text-xl text-deep-navy">
                      CFO as a Service
                    </h3>
                    <p className="text-charcoal-text text-xs leading-relaxed">
                      Dirección y gerencia financiera externa para PyMEs. Control exhaustivo de caja, planeación estratégica de impuestos locales, y re-estructuración crediticia.
                    </p>
                    <ul className="space-y-2 text-xs text-charcoal-text pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Control presupuestal mensual
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Auditoría de tesorería y balances
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Planeación tributaria corporativa
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <a 
                      href="#cotizador" 
                      onClick={() => setServiceOfInterest('cfo-service')}
                      className="w-full inline-block text-center py-2.5 border border-deep-navy text-deep-navy hover:bg-deep-navy hover:text-white transition-all text-xs font-semibold uppercase tracking-wider rounded"
                    >
                      Saber más y Cotizar
                    </a>
                  </div>
                </div>

                {/* Unit 3 */}
                <div className="bg-white p-8 rounded-xl border border-border-subtle flex flex-col justify-between hover:shadow-lg transition-all">
                  <div className="space-y-4">
                    <span className="inline-block px-2.5 py-1 text-[9px] bg-slate-100 text-deep-navy rounded font-mono font-bold tracking-widest uppercase">
                      DATOS Y OPTIMIZACIÓN
                    </span>
                    <h3 className="font-heading font-bold text-xl text-deep-navy">
                      Data-Driven Growth
                    </h3>
                    <p className="text-charcoal-text text-xs leading-relaxed">
                      Modelamos escenarios complejos de escalamiento internacional, analizando a fondo los unit economics del negocio por cohortes de retención de clientes.
                    </p>
                    <ul className="space-y-2 text-xs text-charcoal-text pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Análisis profundo de cohortes
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Proyecciones con simulación Monte Carlo
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Estructura analítica de incentivos
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <a 
                      href="#cotizador" 
                      onClick={() => setServiceOfInterest('data-driven')}
                      className="w-full inline-block text-center py-2.5 border border-deep-navy text-deep-navy hover:bg-deep-navy hover:text-white transition-all text-xs font-semibold uppercase tracking-wider rounded"
                    >
                      Saber más y Cotizar
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Interactive Cotizador section */}
          <section id="cotizador" className="py-24 bg-white border-b border-border-subtle">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
              <div className="text-center max-w-xl mx-auto space-y-3">
                <span className="text-[10px] font-semibold text-deep-navy bg-slate-100 px-3 py-1 rounded font-mono tracking-widest uppercase">
                  SIMULACIÓN DE CONSULTORÍA
                </span>
                <h2 className="font-heading font-extrabold text-3xl text-deep-navy">
                  Calcule el Costo e Impacto de su Servicio
                </h2>
                <p className="text-charcoal-text text-xs">
                  Modifique las variables en el cotizador interactivo. Al finalizar, haga clic en "Aplicar Cotización" para pre-cargar los datos en su diagnóstico corporativo formal.
                </p>
              </div>

              <div className="max-w-5xl mx-auto">
                <Cotizador onQuoteApplied={handleQuoteApplied} />
              </div>
            </div>
          </section>

          {/* SF Growth Framework */}
          <section id="metodologia" className="py-24 bg-white border-b border-border-subtle">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
              <div className="text-center space-y-3">
                <h2 className="font-heading font-extrabold text-3xl text-deep-navy">
                  SF Growth Framework
                </h2>
                <p className="text-charcoal-text text-xs max-w-sm mx-auto">
                  La hoja de ruta estructurada y lógica que garantiza la mitigación de fugas y el escalamiento exitoso de toda PyME.
                </p>
              </div>

              <div className="relative">
                {/* Horizontal timeline line */}
                <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-border-subtle z-0" />
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                  
                  <div className="text-center space-y-4">
                    <span className="w-12 h-12 rounded-full border-2 border-indigo-650 bg-white text-indigo-700 font-bold text-center flex items-center justify-center mx-auto text-sm font-mono shadow-sm">
                      01
                    </span>
                    <h4 className="font-heading font-extrabold text-base text-deep-navy tracking-tight">
                      Fase 1: Diagnóstico Estratégico
                    </h4>
                    <p className="text-charcoal-text text-xs leading-relaxed px-2">
                      Análisis financiero profundo, revisión de costos, flujo de caja, márgenes reales, modelo comercial y estructura de crecimiento para identificar áreas de mejora inmediata.
                    </p>
                  </div>

                  <div className="text-center space-y-4">
                    <span className="w-12 h-12 rounded-full border-2 border-indigo-650 bg-white text-indigo-700 font-bold text-center flex items-center justify-center mx-auto text-sm font-mono shadow-sm">
                      02
                    </span>
                    <h4 className="font-heading font-extrabold text-base text-deep-navy tracking-tight">
                      Fase 2: Dirección Estructurada
                    </h4>
                    <p className="text-charcoal-text text-xs leading-relaxed px-2">
                      Implementación de proyecciones financieras precisas, presupuestación estratégica, control total de liquidez y diseño de indicadores clave (KPIs) para una toma de decisiones informada.
                    </p>
                  </div>

                  <div className="text-center space-y-4">
                    <span className="w-12 h-12 rounded-full border-2 border-indigo-650 bg-white text-indigo-700 font-bold text-center flex items-center justify-center mx-auto text-sm font-mono shadow-sm">
                      03
                    </span>
                    <h4 className="font-heading font-extrabold text-base text-deep-navy tracking-tight">
                      Fase 3: Optimización y Ejecución
                    </h4>
                    <p className="text-charcoal-text text-xs leading-relaxed px-2">
                      Evaluación de inversión comercial, análisis de rentabilidad por canal, modelación de escenarios y ejecución táctica (Rebranding, Pauta, LinkedIn B2B) para disparar el flujo de caja.
                    </p>
                  </div>

                  <div className="text-center space-y-4">
                    <span className="w-12 h-12 rounded-full border-2 border-indigo-650 bg-white text-indigo-700 font-bold text-center flex items-center justify-center mx-auto text-sm font-mono shadow-sm">
                      04
                    </span>
                    <h4 className="font-heading font-extrabold text-base text-deep-navy tracking-tight">
                      Fase 4: Acompañamiento Continuo
                    </h4>
                    <p className="text-charcoal-text text-xs leading-relaxed px-2">
                      Comités periódicos de dirección estratégica, ajustes basados en resultados reales de marketing y finanzas, y monitoreo constante para asegurar rentabilidad a largo plazo.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* Interactive Metrics Grid indicators */}
          <section id="resultados" className="py-24 bg-surface-gray border-b border-border-subtle">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-subtle pb-8">
                <div>
                  <h2 className="font-heading font-extrabold text-3xl text-deep-navy">
                    Los indicadores que realmente importan.
                  </h2>
                  <p className="text-charcoal-text text-sm mt-1">
                    No medimos métricas de vanidad. Medimos impacto directo en el bolsillo y valoración de la compañía.
                  </p>
                </div>
                <div className="bg-white px-5 py-3 rounded-lg border border-border-subtle flex-shrink-0 flex items-center gap-3.5 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-growth-green" />
                  <div>
                    <span className="text-[10px] text-charcoal-text font-semibold uppercase tracking-wider block">
                      Impacto Promedio Logrado
                    </span>
                    <span className="text-lg font-heading font-bold text-deep-navy">
                      +24% EBITDA
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Card Group 1 */}
                <div className="bg-white p-6 rounded-lg border border-border-subtle space-y-6">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-deep-navy border-b border-slate-100 pb-3 block">
                    1. Financieros clave
                  </h4>
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-charcoal-text">EBITDA Trimestral</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1 font-mono">
                        ↑ Crítico
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-charcoal-text">Margen de Contribución por Categoría</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1 font-mono">
                        ↑ Elevado
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal-text">Flujo de Caja Libre Operativo</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1 font-mono">
                        ↑ Resguardado
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Group 2 */}
                <div className="bg-white p-6 rounded-lg border border-border-subtle space-y-6">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-deep-navy border-b border-slate-100 pb-3 block">
                    2. Comerciales de Unit Economics
                  </h4>
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-charcoal-text">CAC (Costo Adquisición Cliente)</span>
                      <span className="text-red-500 font-semibold flex items-center gap-1 font-mono">
                        ↓ Optimizado
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-charcoal-text">LTV (Life Time Value de usuario)</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1 font-mono">
                        ↑ Escalado
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-mono">
                      <span className="text-charcoal-text sans-serif text-xs">Tasa de Conversión General</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1">
                        ↑ Incrementado
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Group 3 */}
                <div className="bg-white p-6 rounded-lg border border-border-subtle space-y-6">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-deep-navy border-b border-slate-100 pb-3 block">
                    3. Estratégicos globales
                  </h4>
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-charcoal-text">ROMI de Publicidad</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1 font-mono">
                        ↑ Auditado
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-charcoal-text">CAGR (Tasa de Crecimiento Anual)</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1 font-mono">
                        ↑ Consolidado
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal-text">Múltiplo de Valoración de Empresa</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1 font-mono">
                        ↑ Máximizado
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* STRATEGIC ROADMAP, GOVERNANCE & TECH VISION */}
          <section className="py-24 bg-slate-900 text-white border-b border-white/10" id="roadmap-gobernanza">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
              
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 rounded text-[10px] font-mono tracking-widest uppercase font-semibold">
                  📈 Plan de Desarrollo y Robustez Institucional
                </span>
                <h2 className="font-heading font-extrabold text-3xl md:text-5xl">
                  Gobernanza de Élite y <span className="text-indigo-400">Roadmap de Expansión Corporativa</span>
                </h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  Consolidamos nuestra práctica no solo como asesores externos, sino como un elemento tecnológico permanente para la toma de decisiones empresariales. Nuestro roadmap a 5 años detalla nuestra visión de escala en tecnología y auditoría contable.
                </p>
              </div>

              {/* Grid block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* 5-Year Roadmap: columns 7 */}
                <div className="lg:col-span-7 space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
                  <h3 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
                    <span className="w-2 h-5 bg-indigo-500 rounded-sm block" />
                    Roadmap Estratégico de Specifinance (5 Años)
                  </h3>
                  
                  <div className="space-y-6 pt-4 relative before:absolute before:top-2 before:bottom-2 before:left-3 before:w-0.5 before:bg-white/10">
                    
                    {/* Year 1 */}
                    <div className="flex gap-4 items-start relative pl-8">
                      <div className="absolute left-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-4 border-slate-900 z-10" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-400 uppercase font-mono bg-indigo-500/10 px-2 py-0.5 rounded">Año 1</span>
                          <h4 className="font-heading font-bold text-sm text-white">Consolidación de Cartera & Metodología</h4>
                        </div>
                        <p className="text-white/60 text-xs mt-1 leading-relaxed">
                          Focalización en PyMEs de alto potencial, calibrando el framework integral de sinergia entre pauta digital y optimización de caja local.
                        </p>
                      </div>
                    </div>

                    {/* Year 2 */}
                    <div className="flex gap-4 items-start relative pl-8">
                      <div className="absolute left-1.5 w-3.5 h-3.5 rounded-full bg-slate-650 border-4 border-slate-900 z-10" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase font-mono bg-white/5 px-2 py-0.5 rounded">Año 2</span>
                          <h4 className="font-heading font-bold text-sm text-white">Procesos Operativos & Protocolos</h4>
                        </div>
                        <p className="text-white/60 text-xs mt-1 leading-relaxed">
                          Estandarización de auditorías y automatización de la documentación clave para marketing. Vinculación estructurada de analistas junior.
                        </p>
                      </div>
                    </div>

                    {/* Year 3 */}
                    <div className="flex gap-4 items-start relative pl-8">
                      <div className="absolute left-1.5 w-3.5 h-3.5 rounded-full bg-slate-650 border-4 border-slate-900 z-10" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase font-mono bg-white/5 px-2 py-0.5 rounded">Año 3</span>
                          <h4 className="font-heading font-bold text-sm text-white font-sans">Expansión Segmento Mediano</h4>
                        </div>
                        <p className="text-white/60 text-xs mt-1 leading-relaxed">
                          Aceleración en medianas empresas de alta facturación que requieren modelos contables de mayor complejidad y robustecimiento directivo.
                        </p>
                      </div>
                    </div>

                    {/* Year 4 */}
                    <div className="flex gap-4 items-start relative pl-8">
                      <div className="absolute left-1.5 w-3.5 h-3.5 rounded-full bg-slate-650 border-4 border-slate-900 z-10" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase font-mono bg-white/5 px-2 py-0.5 rounded">Año 4</span>
                          <h4 className="font-heading font-bold text-sm text-white">Plataforma Tecnológica Interna</h4>
                        </div>
                        <p className="text-white/60 text-xs mt-1 leading-relaxed">
                          Desarrollo y testeo de la plataforma de visualización de datos financieros y de marketing integrada en una sola consola automatizada.
                        </p>
                      </div>
                    </div>

                    {/* Year 5 */}
                    <div className="flex gap-4 items-start relative pl-8">
                      <div className="absolute left-1.5 w-3.5 h-3.5 rounded-full bg-slate-650 border-4 border-slate-900 z-10" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase font-mono bg-white/5 px-2 py-0.5 rounded">Año 5</span>
                          <h4 className="font-heading font-bold text-sm text-indigo-400">Lanzamiento Mundial de Solución Propietaria</h4>
                        </div>
                        <p className="text-white/60 text-xs mt-1 leading-relaxed">
                          Lanzamiento de nuestra solución SaaS propietaria, consolidando a Specifinance como referente en consultoría tecnológica y financiera en Colombia.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Governance & Tech Vision: columns 5 */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Governance block */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4">
                    <h3 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
                      🛡️ Estructura de Gobernanza
                    </h3>
                    <p className="text-white/70 text-xs leading-relaxed">
                      Operamos bajo políticas rígidas de compliance y calidad que aseguran transparencia corporativa en cada acción de asesoría:
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="p-3 bg-white/5 rounded border border-white/10">
                        <span className="text-xs font-bold text-white block">📅 Comité Estratégico Trimestral</span>
                        <p className="text-[11px] text-white/60 mt-0.5">Juntas formales de control de desviaciones de EBITDA y reprogramación financiera comercial.</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded border border-white/10">
                        <span className="text-xs font-bold text-white block">📖 Manual Operativo Estandarizado</span>
                        <p className="text-[11px] text-white/60 mt-0.5">Garantía absoluta de procesos y políticas para cada flujo de tesorería auditado.</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded border border-white/10">
                        <span className="text-xs font-bold text-white block">⚡ Protocolo de Calidad Analítica</span>
                        <p className="text-[11px] text-white/60 mt-0.5">Doble validación técnica de informes predictivos antes del comité de dirección semanal.</p>
                      </div>
                    </div>
                  </div>

                  {/* Tech Vision block */}
                  <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 md:p-8 space-y-4">
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono tracking-widest px-2 py-0.5 rounded font-bold uppercase">
                      Visión Escalable
                    </span>
                    <h3 className="font-heading font-extrabold text-base text-white">
                      Escalabilidad Tecnológica Integrada
                    </h3>
                    <ul className="space-y-3 text-xs text-white/80">
                      <li className="flex items-center gap-2">
                        <span className="text-growth-green font-bold">✓</span> Integración nativa de datos financieros y de marketing.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-growth-green font-bold">✓</span> Consola central interactiva en tiempo real para clientes.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-growth-green font-bold">✓</span> Modelos deductivos y proyectivos de liquidez inteligentes.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-growth-green font-bold">✓</span> Benchmarking automatizado de sectores productivos.
                      </li>
                    </ul>
                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* "Who is Specifinance for" with professional image */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              
              <div className="order-2 lg:order-1">
                <img 
                  alt="Equipo Directivo Reunido" 
                  className="rounded-2xl boutique-shadow w-full object-cover max-h-[480px]" 
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkd4mYmQn6x39TzpTohCPdBd1XGg5tP8xLbl6SBHyrbodTVM7XUiA0CBXslFXxGCm_-qoZLu_8mwAyEnWRA0XCrFSbvkfJUZQjv2529DcpIG7QPbmURkv3kjOx4LiWVPug1xdEv8h6MxUc9z7euRQQxoKJZvoxFo-zdyUpdipSbSSjyjlrfYK-7SRQxUZkCNYqWAOo_jKS-lkwrzJP3f2sTuHXPWyWg9P2UsznX4pDfmsSMy4Brgtc6sJ6NJi_VGl5QhwTeSd8KdQ" 
                />
              </div>

              <div className="order-1 lg:order-2 space-y-6">
                <h2 className="font-heading font-extrabold text-3xl text-deep-navy">
                  ¿Es Specifinance el aliado boutique idóneo para su compañía?
                </h2>
                <p className="text-charcoal-text text-sm leading-relaxed">
                  Trabajamos de forma exclusiva con fundadores de compañías de nivel scale-up o PyMEs establecidas encaminadas a la excelencia corporativa.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-growth-green flex-shrink-0" />
                    <span className="text-xs font-semibold text-deep-navy">PyMEs en fase de aceleración acelerada (Scale-ups).</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-growth-green flex-shrink-0" />
                    <span className="text-xs font-semibold text-deep-navy">Empresas con necesidad de profesionalizar su control de tesorería.</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-growth-green flex-shrink-0" />
                    <span className="text-xs font-semibold text-deep-navy">Gerencias que desean abandonar decisiones basadas puramente en corazonadas.</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-growth-green flex-shrink-0" />
                    <span className="text-xs font-semibold text-deep-navy">Compañías con facturación recurrente superior a USD $200k anuales.</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* COMBINED FORM & REAL SCHEDULER */}
          <section id="contacto" className="py-24 bg-deep-navy text-white relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left description details */}
              <div className="lg:col-span-5 space-y-6">
                <span className="inline-block py-1 px-3 bg-white/10 rounded text-muted-gold font-mono text-[10px] uppercase font-bold tracking-widest">
                  Canal Directo de Auditoría
                </span>
                
                <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white">
                  Inicie su diagnóstico hoy.
                </h2>
                
                <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                  Complete el panel de solicitud de diagnóstico para registrar sus datos financieros en nuestra base de datos.
                </p>

                <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                  Una vez enviado,{' '}
                  <strong className="text-growth-green text-xs">se activará inmediatamente el módulo de reserva rápida</strong>{' '}
                  a la derecha para confirmar el dÍa y la hora exacta de su llamada sincrónica con un especialista.
                </p>

                <div className="border border-white/10 bg-white/5 p-4 rounded space-y-4">
                  <h4 className="text-xs font-heading font-bold text-muted-gold uppercase tracking-wider">
                    ¿Qué analizamos sin costo?
                  </h4>
                  <ul className="space-y-2 text-xs text-white/80">
                    <li className="flex gap-2">✓ Alianzas bancarias y estructura crediticia actual.</li>
                    <li className="flex gap-2">✓ Margen y EBITDA modelado por lÍnea comercial.</li>
                    <li className="flex gap-2">✓ Costo publicitario vs ingresos de caja reales.</li>
                  </ul>
                </div>
              </div>

              {/* Right column Form + Scheduler */}
              <div className="lg:col-span-7">
                
                {/* If submitted public form, display the Scheduler picker next! */}
                {formSubmitted && diagnosticLeadCreated ? (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Status diagnostic registered successfully */}
                    <div className="bg-white/10 border border-growth-green/55 p-6 rounded-xl space-y-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-growth-green/20 text-growth-green flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-heading font-bold text-base text-white">
                          ¡Diagnóstico Registrado en Base de Datos!
                        </h4>
                        <p className="text-white/80 text-xs max-w-sm mx-auto">
                          Estimado(a) <span className="font-bold underline text-muted-gold">{formName}</span>, registramos exitosamente su perfil {formCompany ? <>para <strong className="text-white">{formCompany}</strong></> : <>como contacto independiente / proyecto personal</>}.
                        </p>
                      </div>

                      <div className="text-[11px] text-white/60 bg-black/20 p-2.5 rounded font-mono text-left max-w-xs mx-auto">
                        ID Registro: {diagnosticLeadCreated.id} <br />
                        Plan de Interés: {diagnosticLeadCreated.serviceOfInterest} <br />
                        Asignación: En Espera de Agenda
                      </div>

                      <button
                        onClick={resetPublicForm}
                        className="text-[11px] text-muted-gold hover:underline"
                      >
                        ← Volver a cargar un nuevo formulario
                      </button>
                    </div>

                    {/* Show interactive time slot scheduler customized with their form values */}
                    <div className="bg-white text-deep-navy rounded-xl overflow-hidden shadow-2xl">
                      <div className="bg-slate-100 p-4 border-b border-border-subtle flex items-center gap-2">
                        <Clock className="w-4 h-4 text-deep-navy" />
                        <span className="text-xs font-bold text-deep-navy uppercase">
                          SEGUNDO PASO: Reserve su bloque horario
                        </span>
                      </div>
                      <Scheduler 
                        onBookingSuccess={(booking) => {
                          // Change the lead status automatically inside the state database when successfully agendado
                          handleUpdateLeadStatus(diagnosticLeadCreated.id, 'Reunión Agendada');
                        }}
                        preselectedService={diagnosticLeadCreated.serviceOfInterest}
                        preselectedCompanyName={diagnosticLeadCreated.companyName}
                        preselectedClientName={diagnosticLeadCreated.fullName}
                        preselectedEmail={diagnosticLeadCreated.email}
                      />
                    </div>

                  </div>
                ) : (
                  
                  /* STANDARD PUBLIC DIAGNOSTIC REGISTERS FORM */
                  <form onSubmit={handleSubmitDiagnostic} className="bg-white text-deep-navy p-6 md:p-10 rounded-xl space-y-6 shadow-2xl border border-border-subtle">
                    
                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
                      <h3 className="font-heading font-extrabold text-lg text-deep-navy">
                        Solicitud de Diagnóstico Financiero
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          // Bypass / quick fill for testing!
                          setFormName('Sofía Restrepo');
                          setFormRole('Directora de Crecimiento');
                          setFormCompany('Restrepo & Co. SAS');
                          setFormEmail('sofia@restrepoco.com');
                          setFormPhone('+57 301 999 8888');
                          setFormCity('Bogotá - Textil');
                          setFormNeeds('Problemas graves de control presupuestal mensual y fugas operativas.');
                        }}
                        className="text-[10px] text-deep-navy hover:underline italic"
                        title="Rellenar campos con datos ficticios válidos"
                      >
                        [Autorellenar Test]
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-text uppercase tracking-wider">
                          Nombre Completo
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ej: Sofía Restrepo"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full px-3 py-2 border border-border-subtle rounded focus:border-deep-navy text-xs focus:ring-0"
                          id="form-full-name"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-text uppercase tracking-wider">
                          Cargo u Ocupación (Opcional)
                        </label>
                        <input 
                          type="text" 
                          placeholder="Ej: Director, Consultor, Independiente"
                          value={formRole}
                          onChange={(e) => setFormRole(e.target.value)}
                          className="w-full px-3 py-2 border border-border-subtle rounded focus:border-deep-navy text-xs focus:ring-0 shadow-sm"
                          id="form-role"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-text uppercase tracking-wider">
                          Empresa o Proyecto (Opcional)
                        </label>
                        <input 
                          type="text" 
                          placeholder="Ej: Proyecto Personal, Nombre de Empresa"
                          value={formCompany}
                          onChange={(e) => setFormCompany(e.target.value)}
                          className="w-full px-3 py-2 border border-border-subtle rounded focus:border-deep-navy text-xs focus:ring-0 shadow-sm"
                          id="form-company"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-text uppercase tracking-wider flex justify-between">
                          <span>Correo de Contacto</span>
                          <span className="text-[10px] text-indigo-600 font-bold lowercase normal-case">personal o corporativo</span>
                        </label>
                        <input 
                          type="email" 
                          required
                          placeholder="ejemplo@correo.com"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-border-subtle rounded focus:border-deep-navy text-xs focus:ring-0"
                          id="form-email"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-text uppercase tracking-wider flex justify-between">
                          <span>Teléfono / Celular</span>
                          <span className="text-[10px] text-indigo-600 font-bold lowercase normal-case flex-shrink-0 ml-1">móvil o whatsapp</span>
                        </label>
                        <input 
                          type="tel" 
                          required
                          placeholder="+57 301 000 0000"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          className="w-full px-3 py-2 border border-border-subtle rounded focus:border-deep-navy text-xs focus:ring-0"
                          id="form-phone"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-text uppercase tracking-wider">
                          Ciudad y Sector (Opcional)
                        </label>
                        <input 
                          type="text" 
                          placeholder="Ej: Bogotá - Alimentos, o Remoto"
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          className="w-full px-3 py-2 border border-border-subtle rounded focus:border-deep-navy text-xs focus:ring-0"
                          id="form-city"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-text uppercase tracking-wider">
                          Tamaño de la Empresa / Proyecto
                        </label>
                        <select 
                          value={formSize}
                          onChange={(e) => setFormSize(e.target.value)}
                          className="w-full px-3 py-2 border border-border-subtle rounded text-xs bg-white"
                          id="form-size"
                        >
                          <option>Independiente / No aplica</option>
                          <option>1 - 10 empleados</option>
                          <option>11 - 50 empleados</option>
                          <option>51 - 200 empleados</option>
                          <option>+200 empleados</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-text uppercase tracking-wider">
                          Unidad de Interés de Specifinance
                        </label>
                        <select 
                          value={formService}
                          onChange={(e) => setFormService(e.target.value)}
                          className="w-full px-3 py-2 border border-border-subtle rounded text-xs bg-white"
                          id="form-interest"
                        >
                          <option value="Full Growth Partner">Full Growth Partner (Completo)</option>
                          <option value="CFO as a Service">CFO as a Service (Contabilidad/Caja)</option>
                          <option value="Data-Driven Growth">Data-Driven Growth (Modelación)</option>
                        </select>
                      </div>

                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal-text uppercase tracking-wider">
                        ¿Cuál es su principal necesidad financiera o comercial de crecimiento hoy?
                      </label>
                      <textarea 
                        rows={3}
                        placeholder="Cuéntenos llanamente los cuellos de botella de su negocio..."
                        value={formNeeds}
                        onChange={(e) => setFormNeeds(e.target.value)}
                        className="w-full px-3 py-2 border border-border-subtle rounded focus:border-deep-navy text-xs focus:ring-0 font-sans"
                        id="form-needs"
                      />
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                      <input 
                        type="checkbox" 
                        required
                        checked={formAgreed}
                        onChange={(e) => setFormAgreed(e.target.checked)}
                        className="mt-0.5" 
                        id="form-agree-checkbox"
                      />
                      <span className="text-[11px] text-charcoal-text leading-tight">
                        Acepto los términos y condiciones de la política de tratamiento de datos personales de Specifinance.
                      </span>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-deep-navy text-white hover:bg-black font-heading font-medium text-sm py-3.5 px-4 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                      id="form-btn-submit"
                    >
                      Enviar Solicitud de Diagnóstico
                      <ArrowRight className="w-4 h-4 text-growth-green" />
                    </button>

                  </form>
                )}

              </div>
            </div>
          </section>
        </div>
      )}

      {/* Corporate Footing */}
      <footer className="bg-deep-navy text-white/90 pt-16 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 font-sans">
          
          <div className="space-y-4 col-span-1 md:col-span-1">
            <h4 className="font-heading font-extrabold text-xl text-white tracking-tight">
              Specifinance
            </h4>
            <p className="text-white/60 text-xs leading-relaxed">
              Financial precision for modern growth. Consultoría Boutique de elite para organizaciones que exigen control absoluto de márgenes respaldados por datos.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <h5 className="font-heading font-bold text-white uppercase tracking-widest text-[10px]">
              Estructura Corporativa
            </h5>
            <ul className="space-y-2 text-white/50">
              <li><a href="#que-hacemos" className="hover:text-growth-green transition-colors">Qué hacemos</a></li>
              <li><a href="#servicios" className="hover:text-growth-green transition-colors">Unidades de Servicio</a></li>
              <li><a href="#metodologia" className="hover:text-growth-green transition-colors">SF Growth Framework</a></li>
              <li><a href="#resultados" className="hover:text-growth-green transition-colors">Indicadores Clave</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h5 className="font-heading font-bold text-white uppercase tracking-widest text-[10px]">
              Términos Legales
            </h5>
            <ul className="space-y-2 text-white/50">
              <li><a href="#contacto" className="hover:text-growth-green transition-colors">Tratamiento de Datos</a></li>
              <li><a href="#contacto" className="hover:text-growth-green transition-colors">Aviso de Privacidad</a></li>
              <li><a href="#contacto" className="hover:text-growth-green transition-colors">Términos del Servicio</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h5 className="font-heading font-bold text-white uppercase tracking-widest text-[10px]">
              Contacto y Sede.
            </h5>
            <ul className="space-y-2 text-white/50">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-growth-green" /> info@specifinance.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-growth-green" /> +57 (601) 321-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-growth-green" /> Bogotá D.C., Colombia
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/40">
          <span>
            © 2026 Specifinance. Todos los derechos reservados. Consultoría Boutique de Excelencia.
          </span>
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => {
                setAdminMode(!adminMode);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-muted-gold hover:underline"
            >
              Toggle Admin Backoffice Panel
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
