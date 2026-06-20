import React, { useState } from 'react';
import { Lead, Booking, OutgoingEmailLog, QuoteCalculated } from './types';
import { INITIAL_LEADS, INITIAL_BOOKINGS } from './data';
import Scheduler from './components/Scheduler';
import AdminDashboard from './components/AdminDashboard';
import SmeSolutions from './components/SmeSolutions';
import ServiceModal from './components/ServiceModal';
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

  // Service Modal state
  const [activeServiceModal, setActiveServiceModal] = useState<string | null>(null);

  // Handler to set selected need from SmeSolutions
  const handleSelectSmeNeed = (serviceName: string, needsStr: string) => {
    setFormService(serviceName);
    setFormNeeds(needsStr);
  };
  const [diagnosticLeadCreated, setDiagnosticLeadCreated] = useState<Lead | null>(null);

  // States for the 2-Pillar Interlocking Corporate Hub
  const [activePillarTab, setActivePillarTab] = useState<'financial' | 'marketing' | 'synergy'>('financial');

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
      
      {/* Main TopNavBar */}
      <nav id="nav-primary" className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-border-subtle shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-4 flex justify-between items-center">
          <a href="#" className="font-heading font-extrabold text-2xl text-deep-navy tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-muted-gold rounded-sm block" />
            Specifinance
          </a>

          {/* Desktop Nav menus - Simulador removed */}
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

          <div className="flex gap-2.5 items-center">
             {/* Elegant, discrete Lock button to access backoffice / CRM safely */}
             <button 
                onClick={() => {
                  setAdminMode(!adminMode);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                  adminMode 
                    ? 'bg-deep-navy text-white border-deep-navy hover:bg-black opacity-100' 
                    : 'text-slate-300 hover:text-deep-navy hover:bg-slate-50 border-transparent hover:border-slate-200 opacity-20 hover:opacity-100'
                }`}
                id="nav-crm-toggle-lock"
             >
               <Lock className="w-3.5 h-3.5" />
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
              <a href="#metodologia" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-charcoal-text block py-1.5 border-b border-slate-100">
                Metodología
              </a>
              <a href="#resultados" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-charcoal-text block py-1.5 border-b border-slate-100">
                Resultados
              </a>
              <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-charcoal-text block py-1.5 border-b border-slate-100">
                Contacto
              </a>
              
              {/* Subtle mobile portal unlock link */}
              <button
                onClick={() => {
                  setAdminMode(!adminMode);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-left py-2 text-indigo-700 font-bold flex items-center gap-1.5 text-xs uppercase"
              >
                <Lock className="w-3.5 h-3.5" />
                {adminMode ? 'Ver Landing Page' : 'Acceso Socios (CRM)'}
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
                  Actuamos como la dirección financiera externa de tu empresa, alineando las decisiones comerciales, financieras y de crecimiento para maximizar la rentabilidad y el impacto de cada inversión.
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
                  Transformamos datos financieros y comerciales en estrategias de crecimiento medibles y rentables
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

          {/* Value Connection Block - Visual & High Impact */}
          <section id="que-hacemos" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <span className="inline-block py-1 px-3 bg-indigo-50 border border-indigo-100 rounded text-indigo-700 font-sans text-[11px] tracking-widest uppercase font-semibold">
                    🎯 El Enlace que le Faltaba a tu Negocio
                  </span>
                  
                  <h2 className="font-heading font-extrabold text-3.5xl md:text-5xl text-deep-navy leading-tight tracking-tight">
                    La única firma que unifica <span className="text-indigo-650">Finanzas, Marketing y Datos</span>.
                  </h2>
                  
                  <p className="text-charcoal-text text-sm md:text-base leading-relaxed">
                    Las agencias de marketing suelen quemar capital sin calcular márgenes, y los contadores tradicionales solo registran pérdidas cuando ya ocurrieron. Nosotros unificamos ambas fuerzas bajo un modelo integrado con retorno medible.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 group">
                    <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-white/50 rounded-xl border border-indigo-100 flex flex-col gap-1.5 transition-all hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200 duration-300">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-indigo-100 p-1.5 rounded-md">
                          <TrendingUp className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Crecimiento Real</span>
                      </div>
                      <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-deep-navy to-indigo-600 leading-none drop-shadow-sm transition-all">+24%</span>
                      <span className="text-xs font-bold text-slate-800 font-sans tracking-tight uppercase">Incremento del EBITDA</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-1 border-t border-indigo-50 pt-2">
                        Mejora promedio en rentabilidad tras optimizar estructuras de costos e inversión comercial.
                      </p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-green-50/50 to-white/50 rounded-xl border border-green-100 flex flex-col gap-1.5 transition-all hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg hover:border-green-200 duration-300">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-green-100 p-1.5 rounded-md">
                          <BarChart3 className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Visibilidad Total</span>
                      </div>
                      <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-400 leading-none drop-shadow-sm transition-all">100%</span>
                      <span className="text-xs font-bold text-slate-800 font-sans tracking-tight uppercase">Decisiones Data-Driven</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-1 border-t border-green-50 pt-2">
                        Cero conjeturas. Sustentamos el crecimiento integrando tableros de control y flujo de caja diario.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid Visual Cards: High Converting Delivery */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-surface-gray hover:bg-white p-5 rounded-2xl border border-border-subtle transition-all duration-300 hover:shadow-md flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 border border-indigo-100">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-deep-navy">1. Diagnóstico de Fugas y Margen Real</h4>
                      <p className="text-charcoal-text text-xs mt-1 leading-relaxed">
                        Auditoría profunda e identificación precisa de los canales y clientes que de verdad generan rentabilidad, cortando fugas de capital de forma inmediata.
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface-gray hover:bg-white p-5 rounded-2xl border border-border-subtle transition-all duration-300 hover:shadow-md flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0 border border-orange-100">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-deep-navy">2. Diseño de Estrategias y Unit Economics</h4>
                      <p className="text-charcoal-text text-xs mt-1 leading-relaxed">
                        Sincronizamos tus presupuestos publicitarios con el coste contable de tu operación, garantizando que cada peso invertido en pauta traiga un retorno positivo a caja.
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface-gray hover:bg-white p-5 rounded-2xl border border-border-subtle transition-all duration-300 hover:shadow-md flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0 border border-green-100">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-deep-navy">3. Co-Ejecución Semanal y Dashboards</h4>
                      <p className="text-charcoal-text text-xs mt-1 leading-relaxed">
                        No entregamos un PDF teórico para archivar. Montamos tableros de control interactivos y trabajamos junto a ti para asegurar el cumplimiento exacto de las metas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Specifinance vs Traditional Differential Table - Optimized Comparison */}
          <section className="py-20 bg-deep-navy text-white border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
              <div className="text-center space-y-3">
                <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white">
                  ¿Por qué las empresas eligen a <span className="text-muted-gold font-bold">Specifinance</span>?
                </h2>
                <p className="text-white/60 text-xs tracking-wider uppercase font-mono max-w-lg mx-auto">
                  La diferencia radical de trabajar con un partner de crecimiento estratégico versus resolver las cosas a ciegas.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Traditional Side (Condensed Red) */}
                <div className="bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-2xl space-y-5 transition-all hover:bg-white/[0.04]">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                      <X className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold tracking-wider text-slate-350 uppercase">El Camino Común e Ineficiente</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white/90">Informes contables estáticos retrospectivos</h4>
                      <p className="text-[11px] text-white/50 leading-relaxed">Te dicen cuánto dinero perdiste el mes pasado, pero no cómo prevenir pérdidas hoy ni dónde invertir mañana.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white/90 font-sans">Agencias de marketing desconectadas</h4>
                      <p className="text-[11px] text-white/50 leading-relaxed">Persiguen "likes" y vistas vanidosas sin comprender los unit economics del producto ni el flujo libre de caja real.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white/90">Decisiones intuitivas sin base contable</h4>
                      <p className="text-[11px] text-white/50 leading-relaxed">Contrataciones de personal o aumentos de inventarios basados en corazonadas, arriesgando innecesariamente el capital.</p>
                    </div>
                  </div>
                </div>

                {/* Specifinance Side (Green Glow & Clear Impact) */}
                <div className="bg-white/[0.06] border-2 border-indigo-500/30 p-6 md:p-8 rounded-2xl space-y-5 relative overflow-hidden transition-all hover:border-indigo-400">
                  <div className="absolute top-0 right-0 bg-growth-green text-deep-navy font-mono text-[9px] px-3 py-1 uppercase font-bold tracking-widest rounded-bl">
                    Socio de Crecimiento
                  </div>

                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-8 h-8 rounded-full bg-growth-green/20 flex items-center justify-center text-growth-green">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold tracking-wider text-growth-green uppercase">El Modelo Specifinance de Élite</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">Tableros Interactivos y Control Diario</h4>
                      <p className="text-[11px] text-white/70 leading-relaxed">Visualiza tu EBITDA, margen bruto y caja libre operativo en tiempo real. Decisiones ágiles respaldadas 100% por números vivos.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">Sinergias entre Margen y Presupuesto de Pauta</h4>
                      <p className="text-[11px] text-white/70 leading-relaxed">Alineamos tus campañas publicitarias digitales para vender solo las unidades de negocio que generan mayor rentabilidad neta.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">Dirección Financiera Estratégica (CFO Externo)</h4>
                      <p className="text-[11px] text-white/70 leading-relaxed">Accede a la mesa de control de un director financiero calificado para planificar impuestos, deudas y liquidez a tu escala.</p>
                    </div>
                  </div>
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
                
                {/* 1. FINANCIAL PILLAR - Synthesized & Visual */}
                {activePillarTab === 'financial' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left: Leadership & Core Scope */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="flex gap-4 items-center p-4 bg-white rounded-xl border border-border-subtle shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg border border-indigo-200">
                          JS
                        </div>
                        <div>
                          <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase">
                            CFO de la Firma
                          </span>
                          <h4 className="font-heading font-extrabold text-base text-deep-navy">
                            Juan Suarez
                          </h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                          Especialidades y Control de Caja:
                        </h4>
                        <p className="text-charcoal-text text-xs leading-relaxed">
                          Blindamos la liquidez y controlamos egresos ocultos para que el negocio siga operando con márgenes sólidos y saludables.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="bg-white p-2.5 rounded border border-border-subtle text-left">
                            <span className="text-[11px] font-bold text-deep-navy block">📊 EBITDA Sólido</span>
                            <span className="text-[9.5px] text-slate-500">Recortes inmediatos de ineficiencias de planta.</span>
                          </div>
                          <div className="bg-white p-2.5 rounded border border-border-subtle text-left">
                            <span className="text-[11px] font-bold text-deep-navy block">💸 Caja Semanal</span>
                            <span className="text-[9.5px] text-slate-500">Control absoluto de flujos de efectivo futuros.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Dual Card Visual comparison Before / After */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Antes: Red alert cards */}
                      <div className="bg-red-50/50 border border-red-100 p-5 rounded-xl space-y-3">
                        <span className="inline-block px-2 py-0.5 bg-red-1050/10 text-red-700 text-[9px] font-bold uppercase rounded">
                          Gestión Tradicional
                        </span>
                        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                          <li className="flex gap-1.5 items-start">
                            <span className="text-red-500 font-extrabold shrink-0">✕</span>
                            <span>Solo ves los resultados a mes vencido cuando el problema ya ocurrió.</span>
                          </li>
                          <li className="flex gap-1.5 items-start">
                            <span className="text-red-500 font-extrabold shrink-0">✕</span>
                            <span>Contabilidad fiscal básica sin visión estratégica comercial.</span>
                          </li>
                          <li className="flex gap-1.5 items-start">
                            <span className="text-red-500 font-extrabold shrink-0">✕</span>
                            <span>Incertidumbre en caja y dependencia constante de préstamos.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Después: Specifinance card */}
                      <div className="bg-indigo-50/55 border border-indigo-100 p-5 rounded-xl space-y-3">
                        <span className="inline-block px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-bold uppercase rounded shadow-sm">
                          Con Specifinance
                        </span>
                        <ul className="space-y-2 text-xs text-deep-navy leading-relaxed">
                          <li className="flex gap-1.5 items-start">
                            <span className="text-growth-green font-extrabold shrink-0">✓</span>
                            <span><strong>Dashboards Diarios:</strong> Decisiones instantáneas con datos en vivo.</span>
                          </li>
                          <li className="flex gap-1.5 items-start">
                            <span className="text-growth-green font-extrabold shrink-0">✓</span>
                            <span><strong>CFO de Élite:</strong> Gerencia activa continua sin salarios pesados de planta.</span>
                          </li>
                          <li className="flex gap-1.5 items-start">
                            <span className="text-growth-green font-extrabold shrink-0">✓</span>
                            <span><strong>Previsibilidad:</strong> Saber de antemano el flujo de caja a 30 y 90 días.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. MARKETING & GROWTH PILLAR - Synthesized & Visual */}
                {activePillarTab === 'marketing' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left: Leadership & Core Scope */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="flex gap-4 items-center p-4 bg-white rounded-xl border border-border-subtle shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-pink-1050/10 flex items-center justify-center text-pink-600 font-bold text-lg border border-pink-200">
                          SG
                        </div>
                        <div>
                          <span className="text-[9px] bg-pink-50 border border-pink-100 text-pink-700 px-2 py-0.5 rounded font-bold uppercase">
                            Growth Director
                          </span>
                          <h4 className="font-heading font-extrabold text-base text-deep-navy">
                            Samuel Galeano
                          </h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-pink-900 uppercase tracking-wider">
                          Nuestra Maquinaria de Ventas:
                        </h4>
                        <p className="text-charcoal-text text-xs leading-relaxed">
                          Invertimos capital en pauta digital solo cuando el CFO ha comprobado que el margen comercial de cada producto es altamente rentable para tu PyME.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="bg-white p-2.5 rounded border border-border-subtle text-left">
                            <span className="text-[11px] font-bold text-deep-navy block">🎨 Identidad Premium</span>
                            <span className="text-[9.5px] text-slate-500">Posicionamiento de alto ticket B2B.</span>
                          </div>
                          <div className="bg-white p-2.5 rounded border border-border-subtle text-left">
                            <span className="text-[11px] font-bold text-deep-navy block">📈 Pauta por Datos</span>
                            <span className="text-[9.5px] text-slate-500">Inyección enfocada al retorno total (ROMI).</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Dual Card Visual comparison Before / After */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Antes: Red alert cards */}
                      <div className="bg-red-50/50 border border-red-100 p-5 rounded-xl space-y-3">
                        <span className="inline-block px-2 py-0.5 bg-red-1050/10 text-red-700 text-[9px] font-bold uppercase rounded">
                          Marketing Común
                        </span>
                        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                          <li className="flex gap-1.5 items-start">
                            <span className="text-red-500 font-extrabold shrink-0">✕</span>
                            <span>Métricas vanidosas de likes o vistas que no traen dinero real al banco.</span>
                          </li>
                          <li className="flex gap-1.5 items-start">
                            <span className="text-red-500 font-extrabold shrink-0">✕</span>
                            <span>Invertir en pauta a ciegas sin calcular el coste de adquisición (CAC).</span>
                          </li>
                          <li className="flex gap-1.5 items-start">
                            <span className="text-red-500 font-extrabold shrink-0">✕</span>
                            <span>Poco valor percibido, lo que te obliga a bajar precios para competir.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Después: Specifinance card */}
                      <div className="bg-pink-50/40 border border-pink-100 p-5 rounded-xl space-y-3">
                        <span className="inline-block px-2 py-0.5 bg-pink-600 text-white text-[9px] font-bold uppercase rounded shadow-sm">
                          Con Specifinance
                        </span>
                        <ul className="space-y-2 text-xs text-deep-navy leading-relaxed">
                          <li className="flex gap-1.5 items-start">
                            <span className="text-growth-green font-extrabold shrink-0">✓</span>
                            <span><strong>Pauta Científica:</strong> Invertimos pauta sobre lo que realmente deja margen contable.</span>
                          </li>
                          <li className="flex gap-1.5 items-start">
                            <span className="text-growth-green font-extrabold shrink-0">✓</span>
                            <span><strong>Posicionamiento B2B:</strong> LinkedIn y branding de élite para ganar estatus corporativo.</span>
                          </li>
                          <li className="flex gap-1.5 items-start">
                            <span className="text-growth-green font-extrabold shrink-0">✓</span>
                            <span><strong>Métrica Única:</strong> Evaluamos el costo por lead calificado y el EBITDA final de ventas.</span>
                          </li>
                        </ul>
                      </div>
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
                <div className="bg-white p-8 rounded-xl border border-border-subtle flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100">
                  <div className="space-y-4">
                    <span className="inline-block px-2.5 py-1 text-[9px] bg-indigo-600 text-white rounded font-mono font-bold tracking-widest uppercase shadow-sm">
                      MÁS SOLICITADO
                    </span>
                    <h3 className="font-heading font-bold text-xl text-deep-navy">
                      Full Growth Partner
                    </h3>
                    <p className="text-charcoal-text text-xs leading-relaxed pb-2">
                      Actuamos como el aliado estratégico de crecimiento de tu empresa, integrando dirección financiera, análisis de datos y estrategia comercial para que cada inversión, campaña y decisión de expansión contribuya a resultados medibles, rentables y sostenibles.
                    </p>
                    <ul className="space-y-2 text-xs text-charcoal-text">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> CFO Externo y Growth Partner en un solo equipo.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Estrategia financiera, comercial y de marketing alineada.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Dashboards y seguimiento de KPIs clave.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Soporte para crecimiento, inversión y expansión.
                      </li>
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button 
                      onClick={() => setActiveServiceModal('full-partner')}
                      className="w-full text-center py-2.5 bg-deep-navy text-white hover:bg-indigo-900 shadow-sm transition-all text-xs font-semibold uppercase tracking-wider rounded"
                    >
                      Saber más e Iniciar Diagnóstico
                    </button>
                  </div>
                </div>

                {/* Unit 2 */}
                <div className="bg-white p-8 rounded-xl border border-border-subtle flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100">
                  <div className="space-y-4">
                    <span className="inline-block px-2.5 py-1 text-[9px] bg-slate-100 text-deep-navy rounded font-mono font-bold tracking-widest uppercase">
                      DIRECCIÓN ESTRUCTURAL
                    </span>
                    <h3 className="font-heading font-bold text-xl text-deep-navy">
                      CFO as a Service
                    </h3>
                    <p className="text-charcoal-text text-xs leading-relaxed pb-2">
                      Actuamos como el CFO externo de tu empresa, proporcionando planeación financiera, proyecciones estratégicas y acompañamiento continuo para mejorar la rentabilidad, optimizar el flujo de caja y respaldar decisiones de crecimiento con información confiable.
                    </p>
                    <ul className="space-y-2 text-xs text-charcoal-text">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Planeación financiera estratégica.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Proyecciones y modelación de escenarios.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Control de flujo de caja y liquidez.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Análisis de rentabilidad y desempeño.
                      </li>
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button 
                      onClick={() => setActiveServiceModal('cfo-service')}
                      className="w-full text-center py-2.5 bg-slate-50 border border-border-subtle text-deep-navy hover:bg-slate-100 hover:border-slate-300 shadow-sm transition-all text-xs font-semibold uppercase tracking-wider rounded"
                    >
                      Saber más e Iniciar Diagnóstico
                    </button>
                  </div>
                </div>

                {/* Unit 3 */}
                <div className="bg-white p-8 rounded-xl border border-border-subtle flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100">
                  <div className="space-y-4">
                    <span className="inline-block px-2.5 py-1 text-[9px] bg-slate-100 text-deep-navy rounded font-mono font-bold tracking-widest uppercase">
                      DATOS Y OPTIMIZACIÓN
                    </span>
                    <h3 className="font-heading font-bold text-xl text-deep-navy">
                      Data-Driven Growth
                    </h3>
                    <p className="text-charcoal-text text-xs leading-relaxed pb-2">
                      Diseñamos estrategias de crecimiento respaldadas por datos, analizando el desempeño comercial y de marketing para identificar oportunidades de optimización, adquisición de clientes y mejora del retorno sobre la inversión en publicidad.
                    </p>
                    <ul className="space-y-2 text-xs text-charcoal-text">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Planeación estratégica de marketing y crecimiento.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Optimización de inversión publicitaria y demanda.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Análisis de datos comerciales y de clientes.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-growth-green flex-shrink-0" /> Medición de indicadores de retorno de inversión.
                      </li>
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button 
                      onClick={() => setActiveServiceModal('data-driven')}
                      className="w-full text-center py-2.5 bg-slate-50 border border-border-subtle text-deep-navy hover:bg-slate-100 hover:border-slate-300 shadow-sm transition-all text-xs font-semibold uppercase tracking-wider rounded"
                    >
                      Saber más e Iniciar Diagnóstico
                    </button>
                  </div>
                </div>

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
                  
                  <div className="text-center space-y-4 group">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 text-indigo-700 font-bold text-center flex items-center justify-center mx-auto text-lg font-mono shadow-[0_0_15px_rgba(79,70,229,0.1)] group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                      01
                    </div>
                    <h4 className="font-heading font-extrabold text-base text-deep-navy tracking-tight group-hover:text-indigo-700 transition-colors">
                      Fase 1: Diagnóstico Estratégico
                    </h4>
                    <p className="text-charcoal-text text-xs leading-relaxed px-2">
                      Análisis financiero profundo, revisión de costos, flujo de caja, márgenes reales, modelo comercial y estructura de crecimiento para identificar áreas de mejora inmediata.
                    </p>
                  </div>

                  <div className="text-center space-y-4 group">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 text-indigo-700 font-bold text-center flex items-center justify-center mx-auto text-lg font-mono shadow-[0_0_15px_rgba(79,70,229,0.1)] group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                      02
                    </div>
                    <h4 className="font-heading font-extrabold text-base text-deep-navy tracking-tight group-hover:text-indigo-700 transition-colors">
                      Fase 2: Dirección Estructurada
                    </h4>
                    <p className="text-charcoal-text text-xs leading-relaxed px-2">
                      Implementación de proyecciones financieras precisas, presupuestación estratégica, control total de liquidez y diseño de indicadores clave (KPIs) para una toma de decisiones informada.
                    </p>
                  </div>

                  <div className="text-center space-y-4 group">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 text-indigo-700 font-bold text-center flex items-center justify-center mx-auto text-lg font-mono shadow-[0_0_15px_rgba(79,70,229,0.1)] group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                      03
                    </div>
                    <h4 className="font-heading font-extrabold text-base text-deep-navy tracking-tight group-hover:text-indigo-700 transition-colors">
                      Fase 3: Optimización y Ejecución
                    </h4>
                    <p className="text-charcoal-text text-xs leading-relaxed px-2">
                      Evaluación de inversión comercial, análisis de rentabilidad por canal, modelación de escenarios y ejecución táctica (Rebranding, Pauta, LinkedIn B2B) para disparar el flujo de caja.
                    </p>
                  </div>

                  <div className="text-center space-y-4 group">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 text-indigo-700 font-bold text-center flex items-center justify-center mx-auto text-lg font-mono shadow-[0_0_15px_rgba(79,70,229,0.1)] group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                      04
                    </div>
                    <h4 className="font-heading font-extrabold text-base text-deep-navy tracking-tight group-hover:text-indigo-700 transition-colors">
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
                      <span className="text-charcoal-text">Planeación Financiera</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1 font-mono">
                        ↑ Estructurada
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
                      <span className="text-charcoal-text">Rentabilidad Empresarial</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1 font-mono">
                        ↑ Optimizada
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-charcoal-text">Capacidad de Crecimiento</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1 font-mono">
                        ↑ Escalada
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal-text">Valor Empresarial</span>
                      <span className="text-growth-green font-semibold flex items-center gap-1 font-mono">
                        ↑ Potenciado
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

          {/* Dedicated practical solutions for small/medium enterprises (PyMEs) */}
          <SmeSolutions onSelectSmeNeed={handleSelectSmeNeed} />

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

      {/* Service Detail Modal */}
      <ServiceModal 
        isOpen={activeServiceModal !== null}
        serviceId={activeServiceModal}
        onClose={() => setActiveServiceModal(null)}
        onSelectService={(serviceName, serviceId) => {
          setFormService(serviceName);
          setServiceOfInterest(serviceId);
        }}
      />

    </div>
  );
}
