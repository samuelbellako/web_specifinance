import React, { useState, useEffect } from 'react';
import { SERVICIOS_METADATA } from '../data';
import { QuoteCalculated } from '../types';
import { Calculator, DollarSign, Users, Sparkles, ArrowRight, CheckCircle2, TrendingUp, ShieldAlert } from 'lucide-react';

interface CotizadorProps {
  onQuoteApplied?: (quote: QuoteCalculated) => void;
}

export default function Cotizador({ onQuoteApplied }: CotizadorProps) {
  const [selectedServiceId, setSelectedServiceId] = useState('full-growth');
  const [monthlyRevenue, setMonthlyRevenue] = useState(45000);
  const [teamSize, setTeamSize] = useState(25);
  const [complexity, setComplexity] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [marketingSpend, setMarketingSpend] = useState(8000);

  const [quote, setQuote] = useState<QuoteCalculated | null>(null);

  useEffect(() => {
    const service = SERVICIOS_METADATA.find(s => s.id === selectedServiceId) || SERVICIOS_METADATA[0];
    
    // Formula for estimating customized retainer based on company parameters
    let basePrice = service.basePrice;
    
    // Revenue multiplier: larger companies require higher attention/reporting detail
    const revenueFactor = monthlyRevenue > 100000 ? 1.4 : monthlyRevenue > 50000 ? 1.15 : 0.95;
    
    // Team size factor
    const teamFactor = teamSize > 100 ? 1.3 : teamSize > 40 ? 1.15 : 1.0;
    
    // Complexity factor
    const complexityMultiplier = complexity === 'Alta' ? 1.25 : complexity === 'Media' ? 1.0 : 0.85;
    
    // Marketing spend factor (mainly for growth unit)
    const marketingFactor = selectedServiceId === 'data-driven' && marketingSpend > 20000 ? 1.2 : 1.0;
    
    const estimatedPrice = Math.round(basePrice * revenueFactor * teamFactor * complexityMultiplier * marketingFactor);
    
    // Estimate logical performance gains
    // Higher complexity + higher revenue = higher potential waste to prune
    let baseEbitdaPct = 2.4; // standard base ebitda increase of +2.4% as per landing page
    if (complexity === 'Alta') baseEbitdaPct += 1.1;
    if (monthlyRevenue > 80000) baseEbitdaPct += 0.8;
    if (selectedServiceId === 'full-growth') baseEbitdaPct += 0.5;
    
    const potentialEbitdaGain = parseFloat(baseEbitdaPct.toFixed(1));
    const estimatedSavings = Math.round((monthlyRevenue * (potentialEbitdaGain / 100)) * 12);

    setQuote({
      serviceId: selectedServiceId,
      serviceName: service.name,
      monthlyRevenue,
      complexity,
      teamSize,
      estimatedPrice,
      potentialEbitdaGain,
      estimatedSavings
    });
  }, [selectedServiceId, monthlyRevenue, teamSize, complexity, marketingSpend]);

  const handleApply = () => {
    if (quote && onQuoteApplied) {
      onQuoteApplied(quote);
    }
  };

  const activeService = SERVICIOS_METADATA.find(s => s.id === selectedServiceId) || SERVICIOS_METADATA[0];

  return (
    <div className="bg-white rounded-xl border border-border-subtle overflow-hidden boutique-shadow transition-all duration-300">
      <div className="bg-deep-navy p-6 md:p-8 text-white relative">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Calculator className="w-24 h-24" />
        </div>
        <span className="inline-block py-1 px-3 bg-white/10 rounded text-muted-gold font-sans text-xs tracking-wider uppercase font-semibold mb-3">
          Herramienta Interactiva
        </span>
        <h3 className="text-2xl md:text-3xl font-heading font-medium tracking-tight">
          Cotizador Estratégico de Valor
        </h3>
        <p className="text-white/70 text-sm mt-2 max-w-xl">
          Ajuste las variables de su negocio para simular al instante el costo de servicio y proyectar la optimización EBITDA anual estimada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border-subtle">
        {/* Sliders and Toggles: columns 7 */}
        <div className="p-6 md:p-8 lg:col-span-7 space-y-6">
          
          {/* Service Selector pills */}
          <div>
            <label className="block text-xs font-sans font-semibold text-charcoal-text uppercase tracking-wider mb-3">
              1. Seleccione la Unidad de Servicio
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SERVICIOS_METADATA.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  type="button"
                  className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                    selectedServiceId === service.id
                      ? 'border-deep-navy bg-deep-navy/5 ring-1 ring-deep-navy'
                      : 'border-border-subtle bg-white hover:border-charcoal-text'
                  }`}
                  id={`btn-service-${service.id}`}
                >
                  <span className="text-[10px] font-semibold text-muted-gold uppercase tracking-wider block mb-1">
                    {service.tag}
                  </span>
                  <span className="text-sm font-heading font-semibold text-deep-navy block leading-tight">
                    {service.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-border-subtle" />

          {/* Silder 1: Monthly Billing */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-charcoal-text uppercase tracking-wider">
                2. Facturación Mensual Estimada (USD)
              </label>
              <span className="font-mono text-sm font-semibold text-deep-navy bg-surface-gray px-2.5 py-1 rounded">
                ${monthlyRevenue.toLocaleString()} USD
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-charcoal-text font-mono">$10K</span>
              <input
                type="range"
                min="10000"
                max="300000"
                step="5000"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full h-2 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-deep-navy focus:outline-none"
                id="input-monthly-revenue"
              />
              <span className="text-xs text-charcoal-text font-mono">$300K+</span>
            </div>
            <p className="text-[11px] text-charcoal-text italic">
              El costo e impacto EBITDA escala proporcionalmente con el volumen transaccional de su compañía.
            </p>
          </div>

          {/* Slider 2: Team Members */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-charcoal-text uppercase tracking-wider">
                3. Tamaño del Equipo de Trabajo
              </label>
              <span className="font-mono text-sm font-semibold text-deep-navy bg-surface-gray px-2.5 py-1 rounded">
                {teamSize} colaboradores
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-charcoal-text font-mono">1</span>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-deep-navy focus:outline-none"
                id="input-team-size"
              />
              <span className="text-xs text-charcoal-text font-mono">200+</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Complexity Select Option */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-charcoal-text uppercase tracking-wider">
                Complejidad Contable/Operativa
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Baja', 'Media', 'Alta'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setComplexity(level)}
                    className={`py-2 text-xs font-medium rounded border cursor-pointer text-center ${
                      complexity === level
                        ? 'border-deep-navy bg-deep-navy text-white'
                        : 'border-border-subtle hover:border-charcoal-text bg-white'
                    }`}
                    id={`btn-complexity-${level}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider/Input: Marketing spend if Full Growth or Data unit */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-charcoal-text uppercase tracking-wider">
                Inversión en Pauta Digital / Mes
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-charcoal-text text-xs font-mono">$</span>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={marketingSpend}
                  onChange={(e) => setMarketingSpend(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-1.5 text-xs text-deep-navy border border-border-subtle rounded focus:border-deep-navy focus:ring-0 font-mono"
                  id="input-marketing-spend"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Math / Results Panel: columns 5 */}
        <div className="p-6 md:p-8 lg:col-span-5 bg-surface-gray flex flex-col justify-between">
          <div className="space-y-6">
            <h4 className="text-xs font-semibold tracking-wider text-charcoal-text uppercase">
              Resultado de la Estimación
            </h4>

            {quote && (
              <div className="space-y-4">
                {/* Proposed Cost */}
                <div className="bg-white p-4 border border-border-subtle rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 translate-x-2 -translate-y-2 w-12 h-12 bg-muted-gold/10 rounded-full blur-sm" />
                  <span className="text-[11px] font-semibold text-charcoal-text uppercase tracking-wider block">
                    Inversión Mensual Estimada
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-heading font-bold text-deep-navy">
                      ${quote.estimatedPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-charcoal-text">USD / mes</span>
                  </div>
                  <p className="text-[10px] text-charcoal-text mt-2 italic">
                    *Honorario fijo por asesoría boutique contínua. Sin costos ocultos.
                  </p>
                </div>

                {/* Return on Investment block */}
                <div className="bg-deep-navy text-white p-4 rounded-lg relative">
                  <div className="flex gap-3">
                    <div className="p-2 bg-white/10 rounded-lg text-growth-green self-start">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-white/60 tracking-wider uppercase font-semibold">
                        Impacto Estimado en EBITDA
                      </span>
                      <p className="text-2xl font-semibold text-growth-green mt-0.5">
                        +{quote.potentialEbitdaGain}%
                      </p>
                      <p className="text-[11px] text-white/80 mt-1">
                        Equivale a ahorrar o liberar un aproximado de{' '}
                        <strong className="text-white font-mono">
                          ${quote.estimatedSavings.toLocaleString()} USD
                        </strong>{' '}
                        anuales mediante optimización.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendation statement */}
                <div className="bg-slate-50 p-3 rounded border border-border-subtle">
                  <div className="flex gap-2 items-start">
                    <Sparkles className="w-4 h-4 text-muted-gold flex-shrink-0 mt-0.5" />
                    <div className="text-[12px] text-charcoal-text">
                      <span className="font-semibold text-deep-navy block">
                        Recomendación del Consultor:
                      </span>
                      Por su nivel de facturación y equipo de {quote.teamSize} personas, la estrategia{' '}
                      <strong className="text-deep-navy">{activeService.name}</strong> es idónea para robustecer su estructura y blindar márgenes.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6">
            <button
              onClick={handleApply}
              type="button"
              className="w-full bg-deep-navy text-white hover:bg-black py-3 px-4 rounded font-heading font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              id="btn-apply-quote"
            >
              Aplicar Cotización al Formulario
              <ArrowRight className="w-4 h-4 text-growth-green" />
            </button>
            <p className="text-center text-[10px] text-charcoal-text mt-2">
              Se pre-completará su solicitud de diagnóstico con los datos cotizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
