import React, { useState, useEffect } from 'react';
import {
  Building2,
  Coins,
  Car,
  Landmark,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Calculator,
  ArrowRight,
  Scale,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { formatPKR } from '../utils/inheritanceCalculator';

// Benchmark market rates in Pakistan (August 2026)
export const PAKISTAN_MARKET_RATES = {
  gold_24k_tola: 275000,
  gold_22k_tola: 252000,
  gold_24k_gram: 23577,
  silver_tola: 3050,
  property_marla_avg: 2500000, // 25 Lacs per Marla average urban
  property_kanal_avg: 50000000, // 5 Crore per Kanal urban
  property_sqyard_avg: 120000, // 1.2 Lacs per Sq. Yard (Karachi)
  agri_acre_avg: 4000000, // 40 Lacs per Acre
  agri_kanal_avg: 500000, // 5 Lacs per Kanal agri
  vehicle_avg: 4000000, // 40 Lacs average sedan
};

export default function AssetBreakdownCalculator({ results, lang }) {
  const [assets, setAssets] = useState([
    {
      id: '1',
      category: 'property',
      titleEn: 'Residential House (1 Kanal - DHA)',
      titleUr: 'رہائشی مکان (1 کنال - ڈی ایچ اے)',
      unitType: 'Kanals',
      unitQuantity: 1,
      estimatedPkr: 50000000,
      autoPriced: true,
    },
    {
      id: '2',
      category: 'agri',
      titleEn: 'Agricultural Land (4 Acres - Punjab)',
      titleUr: 'زرعی اراضی (4 ایکڑ / قلعے)',
      unitType: 'Acres',
      unitQuantity: 4,
      estimatedPkr: 16000000,
      autoPriced: true,
    },
    {
      id: '3',
      category: 'gold',
      titleEn: '24K Gold Jewelry (50 Tolas)',
      titleUr: 'طلائی زیورات 24 قیراط (50 تولے)',
      unitType: 'Tolas',
      unitQuantity: 50,
      estimatedPkr: 13750000,
      autoPriced: true,
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('gold');
  const [newQty, setNewQty] = useState('50');
  const [newUnit, setNewUnit] = useState('Tolas');
  const [newVal, setNewVal] = useState('13750000');
  const [goldKarat, setGoldKarat] = useState('24k'); // '24k' | '22k'
  const [useAutoRate, setUseAutoRate] = useState(true);

  // Helper to compute automatic valuation based on category and quantity
  const calculateBenchmarkValue = (category, qty, unit, karat = '24k') => {
    const q = Number(qty) || 0;
    if (q <= 0) return 0;

    if (category === 'gold') {
      if (unit === 'Tolas') {
        const rate = karat === '24k' ? PAKISTAN_MARKET_RATES.gold_24k_tola : PAKISTAN_MARKET_RATES.gold_22k_tola;
        return q * rate;
      }
      if (unit === 'Grams') {
        return q * PAKISTAN_MARKET_RATES.gold_24k_gram;
      }
    } else if (category === 'silver') {
      return q * PAKISTAN_MARKET_RATES.silver_tola;
    } else if (category === 'property') {
      if (unit === 'Marlas') return q * PAKISTAN_MARKET_RATES.property_marla_avg;
      if (unit === 'Kanals') return q * PAKISTAN_MARKET_RATES.property_kanal_avg;
      if (unit === 'Sq. Yards') return q * PAKISTAN_MARKET_RATES.property_sqyard_avg;
      if (unit === 'Units') return q * 30000000;
    } else if (category === 'agri') {
      if (unit === 'Acres') return q * PAKISTAN_MARKET_RATES.agri_acre_avg;
      if (unit === 'Kanals') return q * PAKISTAN_MARKET_RATES.agri_kanal_avg;
      if (unit === 'Marlas') return q * (PAKISTAN_MARKET_RATES.agri_kanal_avg / 20);
    } else if (category === 'vehicle') {
      return q * PAKISTAN_MARKET_RATES.vehicle_avg;
    }
    return 0;
  };

  // Whenever category, qty, unit, or gold karat changes, update estimated value if auto-rate is active
  useEffect(() => {
    if (useAutoRate) {
      const benchmark = calculateBenchmarkValue(newCategory, newQty, newUnit, goldKarat);
      if (benchmark > 0) {
        setNewVal(benchmark.toString());
      }
    }
  }, [newCategory, newQty, newUnit, goldKarat, useAutoRate]);

  // Adjust unit types when category changes
  const handleCategoryChange = (cat) => {
    setNewCategory(cat);
    if (cat === 'gold') {
      setNewUnit('Tolas');
      if (!newTitle || newTitle.includes('House') || newTitle.includes('Land')) {
        setNewTitle('Gold Jewelry / Biscuits');
      }
    } else if (cat === 'property') {
      setNewUnit('Marlas');
      setNewTitle('Residential House / Plot');
    } else if (cat === 'agri') {
      setNewUnit('Acres');
      setNewTitle('Agricultural Farm Land');
    } else if (cat === 'vehicle') {
      setNewUnit('Units');
      setNewTitle('Motor Vehicle (Car/Jeep)');
    } else if (cat === 'bank') {
      setNewUnit('PKR');
      setNewTitle('Bank Deposit / Prize Bonds');
    }
  };

  if (!results || !results.heirsList) return null;
  const { heirsList } = results;

  const totalAssetValue = assets.reduce((sum, a) => sum + (Number(a.estimatedPkr) || 0), 0);

  const handleAddAsset = (e) => {
    e.preventDefault();
    const finalTitle = newTitle.trim() || `${newQty} ${newUnit} ${newCategory.toUpperCase()}`;
    let finalVal = Number(newVal);

    // If value is 0 or empty, compute benchmark automatically
    if (!finalVal || finalVal <= 0) {
      finalVal = calculateBenchmarkValue(newCategory, newQty, newUnit, goldKarat);
    }

    const newAsset = {
      id: Date.now().toString(),
      category: newCategory,
      titleEn: finalTitle,
      titleUr: finalTitle,
      unitType: newUnit,
      unitQuantity: Number(newQty) || 1,
      estimatedPkr: finalVal,
      autoPriced: useAutoRate,
    };

    setAssets([...assets, newAsset]);
    setNewTitle('');
    setNewQty('1');
    setNewVal('');
  };

  const handleRemoveAsset = (id) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Header with Live Valuation Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold border border-gold-500/30 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-gold-400" />
              <span>{lang === 'ur' ? 'لائیو مارکیٹ ریٹ و اثاثہ جات تقسیم کار' : 'Live Market Valuation & Property Divider'}</span>
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-100 mt-1">
            {lang === 'ur'
              ? 'موجودہ ملکی مارکیٹ ریٹ کے مطابق سونا، مکان اور اراضی کی تقسیم'
              : 'Auto-Calculate Real-World Asset Worth & Divide by Islamic Shares'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ur'
              ? 'سونے کے موجودہ صرافہ ریٹ (2,75,000 روپے فی تولہ) اور رئیل اسٹیٹ اوسط پر مبنی خودکار مالی تخمینہ۔'
              : 'Auto-values Gold based on Karachi Sarafa Jewelers rates (Rs. 275,000/Tola) and real estate benchmarks per Marla/Acre.'}
          </p>
        </div>

        <div className="text-left sm:text-right bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-md shrink-0">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
            {lang === 'ur' ? 'اثاثہ جات کی کل مالیت:' : 'Total Assets Value:'}
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-400">
            {formatPKR(totalAssetValue)}
          </span>
        </div>
      </div>

      {/* Live Market Rates Benchmark Ticker Bar */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-gold-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gold-400 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? 'مارکیٹ ریٹس:' : 'Pakistan Benchmarks:'}</span>
          </span>
          <span className="text-slate-300">
            24K Gold: <strong className="text-gold-300">Rs. 275,000 / Tola</strong>
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">
            22K Gold: <strong className="text-gold-300">Rs. 252,000 / Tola</strong>
          </span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-slate-300 hidden md:inline">
            Urban Land Avg: <strong className="text-emerald-300">Rs. 25 Lac / Marla</strong>
          </span>
          <span className="text-slate-500 hidden lg:inline">•</span>
          <span className="text-slate-300 hidden lg:inline">
            Agri Land Avg: <strong className="text-teal-300">Rs. 40 Lac / Acre</strong>
          </span>
        </div>

        <span className="text-[10px] text-slate-400 font-semibold">
          ✓ {lang === 'ur' ? 'آٹو کیلکولیشن فعال ہے' : 'Auto-pricing enabled'}
        </span>
      </div>

      {/* Add New Asset Form */}
      <form onSubmit={handleAddAsset} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ur' ? 'نیا اثاثہ درج کریں:' : 'Add Real-World Asset (Auto-Valued):'}</span>
          </span>

          {newCategory === 'gold' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px]">{lang === 'ur' ? 'قیراط:' : 'Karat:'}</span>
              <button
                type="button"
                onClick={() => setGoldKarat('24k')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                  goldKarat === '24k'
                    ? 'bg-gold-500 text-slate-950 border-gold-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                24K (Pure)
              </button>
              <button
                type="button"
                onClick={() => setGoldKarat('22k')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                  goldKarat === '22k'
                    ? 'bg-gold-500 text-slate-950 border-gold-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                22K (Jewelry)
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Asset Title */}
          <div className="sm:col-span-4">
            <label className="block text-[10px] text-slate-400 font-bold mb-1">
              {lang === 'ur' ? 'اثاثہ کا نام / تفصیل:' : 'Asset Title / Description:'}
            </label>
            <input
              type="text"
              placeholder={lang === 'ur' ? 'مثلاً: 50 تولہ سونا / 10 مرلہ مکان' : 'e.g. 50 Tola Gold / 1 Kanal House'}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] text-slate-400 font-bold mb-1">
              {lang === 'ur' ? 'قسم:' : 'Category:'}
            </label>
            <select
              value={newCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="gold">{lang === 'ur' ? 'سونا (Gold)' : 'Gold'}</option>
              <option value="property">{lang === 'ur' ? 'رہائشی مکان / پلاٹ' : 'House / Plot'}</option>
              <option value="agri">{lang === 'ur' ? 'زرعی اراضی' : 'Agri Land'}</option>
              <option value="vehicle">{lang === 'ur' ? 'گاڑی / سواری' : 'Vehicle'}</option>
              <option value="bank">{lang === 'ur' ? 'بینک اکاؤنٹ' : 'Bank Balance'}</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] text-slate-400 font-bold mb-1">
              {lang === 'ur' ? 'مقدار / رقبہ:' : 'Quantity / Area:'}
            </label>
            <input
              type="number"
              placeholder="Qty"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          {/* Unit Type */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] text-slate-400 font-bold mb-1">
              {lang === 'ur' ? 'پیمائش کا یونٹ:' : 'Unit:'}
            </label>
            <select
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {newCategory === 'gold' && (
                <>
                  <option value="Tolas">Tolas (تولے)</option>
                  <option value="Grams">Grams (گرام)</option>
                </>
              )}
              {newCategory === 'property' && (
                <>
                  <option value="Marlas">Marlas (مرلے)</option>
                  <option value="Kanals">Kanals (کنال)</option>
                  <option value="Sq. Yards">Sq. Yards (گز)</option>
                  <option value="Units">Units (مکان)</option>
                </>
              )}
              {newCategory === 'agri' && (
                <>
                  <option value="Acres">Acres (ایکڑ / قلعے)</option>
                  <option value="Kanals">Kanals (کنال)</option>
                  <option value="Marlas">Marlas (مرلے)</option>
                </>
              )}
              {newCategory === 'vehicle' && (
                <option value="Units">Units (گاڑیاں)</option>
              )}
              {newCategory === 'bank' && (
                <option value="PKR">PKR (روپے)</option>
              )}
            </select>
          </div>

          {/* Calculated Valuation in PKR */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] text-emerald-400 font-bold mb-1">
              {lang === 'ur' ? 'تخمینی مالیت (PKR):' : 'Valuation (PKR):'}
            </label>
            <input
              type="number"
              placeholder="Auto-calculated"
              value={newVal}
              onChange={(e) => {
                setNewVal(e.target.value);
                setUseAutoRate(false);
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
          <span className="text-[11px] text-slate-400">
            {lang === 'ur'
              ? `تخمینہ: ${formatPKR(Number(newVal) || 0)}`
              : `Estimated Worth: ${formatPKR(Number(newVal) || 0)}`}
          </span>

          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? 'شامل کریں اور تقسیم کریں' : 'Add & Divide Asset'}</span>
          </button>
        </div>
      </form>

      {/* Assets & Individual Heir Shares Grid */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>{lang === 'ur' ? 'اثاثہ وار شرعی تقسیم اور مالی حصہ:' : 'Per-Asset Physical Land & Monetary Allocation:'}</span>
        </h4>

        <div className="space-y-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                    {asset.category === 'property' ? (
                      <Building2 className="w-4 h-4" />
                    ) : asset.category === 'agri' ? (
                      <Scale className="w-4 h-4 text-teal-400" />
                    ) : asset.category === 'gold' ? (
                      <Coins className="w-4 h-4 text-gold-400" />
                    ) : (
                      <Car className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-extrabold text-slate-100">
                      {lang === 'ur' ? asset.titleUr : asset.titleEn}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-200">
                        {asset.unitQuantity} {asset.unitType}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-emerald-400">
                        {formatPKR(asset.estimatedPkr)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveAsset(asset.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition"
                  title="Remove Asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Individual Shares for this Asset */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-800/80">
                {heirsList.map((heir) => {
                  const heirPhysicalShare = (asset.unitQuantity * heir.rawFraction).toFixed(2);
                  const heirPkrShare = asset.estimatedPkr * heir.rawFraction;

                  return (
                    <div key={heir.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 truncate">
                          {lang === 'ur' ? heir.nameUr : heir.nameEn}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold shrink-0">
                          {heir.percentage}%
                        </span>
                      </div>
                      
                      <p className="text-slate-100 font-extrabold">
                        {heirPhysicalShare} {asset.unitType}
                      </p>
                      
                      <p className="text-[10px] font-bold text-gold-400">
                        {formatPKR(heirPkrShare)}
                      </p>

                      {heir.count > 1 && (
                        <p className="text-[9px] text-slate-500">
                          {lang === 'ur'
                            ? `فی کس: ${formatPKR(heirPkrShare / heir.count)}`
                            : `Per person: ${formatPKR(heirPkrShare / heir.count)}`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
