import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp, Info } from 'lucide-react';

export const AppreciationSimulator = () => {
  const { t } = useLanguage();
  const [years, setYears] = useState(10);
  const [investment, setInvestment] = useState(350000); // USD default

  const calculateMetrics = () => {
    let growthMultiplier = 1;
    let rentalMultiplier = 1;

    if (years === 5) {
      growthMultiplier = 1.85; // +85%
      rentalMultiplier = 0.42; // cumulative rental returns
    } else if (years === 10) {
      growthMultiplier = 3.45; // +245%
      rentalMultiplier = 0.95; // cumulative rental returns
    } else {
      // 20 years
      growthMultiplier = 7.90; // +690%
      rentalMultiplier = 2.20; // cumulative rental returns
    }

    const projectedAssetValue = Math.round(investment * growthMultiplier);
    const capitalAppreciation = projectedAssetValue - investment;
    const rentalRevenue = Math.round(investment * rentalMultiplier);
    const totalReturn = capitalAppreciation + rentalRevenue;

    return {
      projectedAssetValue,
      capitalAppreciation,
      rentalRevenue,
      totalReturn
    };
  };

  const metrics = calculateMetrics();

  return (
    <section id="plusvalia" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#153A26]/10 text-[#153A26] text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-[#C59A47]" />
            <span>{t.simulator.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1E14] tracking-tight">
            {t.simulator.title}
          </h2>
          <p className="text-sm sm:text-base text-[#5C6B62] mt-2">
            {t.simulator.subtitle}
          </p>
        </div>

        {/* Apple-style Interactive Card */}
        <div className="max-w-4xl mx-auto bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 border border-[#DFD5C4] shadow-luxury">
          {/* Segmented Time Control (5, 10, 20 Years) */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 rounded-2xl bg-white border border-[#DFD5C4] shadow-sm">
              <button
                type="button"
                onClick={() => setYears(5)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  years === 5
                    ? 'bg-[#153A26] text-[#E3B86C] shadow-sm'
                    : 'text-[#5C6B62] hover:text-[#0B1E14]'
                }`}
              >
                {t.simulator.period5}
              </button>
              <button
                type="button"
                onClick={() => setYears(10)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  years === 10
                    ? 'bg-[#153A26] text-[#E3B86C] shadow-sm'
                    : 'text-[#5C6B62] hover:text-[#0B1E14]'
                }`}
              >
                {t.simulator.period10}
              </button>
              <button
                type="button"
                onClick={() => setYears(20)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  years === 20
                    ? 'bg-[#153A26] text-[#E3B86C] shadow-sm'
                    : 'text-[#5C6B62] hover:text-[#0B1E14]'
                }`}
              >
                {t.simulator.period20}
              </button>
            </div>
          </div>

          {/* Investment Amount Slider */}
          <div className="mb-10 bg-white p-6 rounded-2xl border border-[#DFD5C4]/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C6B62]">
                {t.simulator.sliderLabel}
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1E14]">
                ${investment.toLocaleString()} USD
              </span>
            </div>

            <input
              type="range"
              min="100000"
              max="2000000"
              step="50000"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full h-2.5 bg-[#EFE7DA] rounded-lg appearance-none cursor-pointer accent-[#153A26]"
            />

            <div className="flex justify-between text-[11px] text-[#5C6B62] font-semibold mt-2">
              <span>$100,000 USD</span>
              <span>$1,000,000 USD</span>
              <span>$2,000,000 USD</span>
            </div>
          </div>

          {/* Results Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-[#DFD5C4] text-center shadow-sm">
              <span className="text-xs font-semibold text-[#5C6B62] block mb-1">
                {t.simulator.projectedValue}
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#153A26]">
                ${metrics.projectedAssetValue.toLocaleString()} USD
              </p>
              <span className="text-[10px] text-[#25D366] font-bold mt-1 inline-block">
                +{Math.round(((metrics.projectedAssetValue - investment) / investment) * 100)}% {t.simulator.estimatedValuePill}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#DFD5C4] text-center shadow-sm">
              <span className="text-xs font-semibold text-[#5C6B62] block mb-1">
                {t.simulator.capitalAppreciation}
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#C59A47]">
                +${metrics.capitalAppreciation.toLocaleString()} USD
              </p>
              <span className="text-[10px] text-[#5C6B62] mt-1 inline-block">
                {t.simulator.capitalGainLabel}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#DFD5C4] text-center shadow-sm">
              <span className="text-xs font-semibold text-[#5C6B62] block mb-1">
                {t.simulator.estimatedRentalIncome}
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1E14]">
                +${metrics.rentalRevenue.toLocaleString()} USD
              </p>
              <span className="text-[10px] text-[#5C6B62] mt-1 inline-block">
                {t.simulator.cumulativeRentalLabel}
              </span>
            </div>
          </div>

          {/* Visual Bar Comparison */}
          <div className="mb-6 p-5 bg-white rounded-2xl border border-[#DFD5C4]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-[#0B1E14] mb-2 gap-1">
              <span>{t.simulator.growthSimulated} ({years} {t.simulator.yearsWord})</span>
              <span className="text-[#153A26]">{t.simulator.totalEstimatedReturn}: ${(metrics.totalReturn + investment).toLocaleString()} USD</span>
            </div>
            <div className="h-6 w-full rounded-full bg-[#EFE7DA] overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${Math.round((investment / (metrics.totalReturn + investment)) * 100)}%` }}
                className="bg-[#0B1E14] h-full flex items-center justify-center text-[10px] text-white font-bold"
                title={t.simulator.tipInitial}
              >
                {t.simulator.barBase}
              </div>
              <div
                style={{ width: `${Math.round((metrics.capitalAppreciation / (metrics.totalReturn + investment)) * 100)}%` }}
                className="bg-[#C59A47] h-full flex items-center justify-center text-[10px] text-[#0B1E14] font-bold"
                title={t.simulator.tipAppreciation}
              >
                {t.simulator.barAppreciation}
              </div>
              <div
                style={{ width: `${Math.round((metrics.rentalRevenue / (metrics.totalReturn + investment)) * 100)}%` }}
                className="bg-[#25D366] h-full flex items-center justify-center text-[10px] text-white font-bold"
                title={t.simulator.tipRentals}
              >
                {t.simulator.barRentals}
              </div>
            </div>
          </div>

          {/* Small text disclaimer (Simulación no exacta) */}
          <div className="p-4 rounded-2xl bg-white/70 border border-[#DFD5C4] flex items-start gap-2.5 text-[11px] text-[#5C6B62] leading-relaxed">
            <Info className="w-4 h-4 text-[#C59A47] shrink-0 mt-0.5" />
            <p>{t.simulator.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
