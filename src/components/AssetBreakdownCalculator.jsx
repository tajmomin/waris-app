import React, { useState } from 'react';
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
} from 'lucide-react';
import { formatPKR } from '../utils/inheritanceCalculator';

export default function AssetBreakdownCalculator({ results, lang }) {
  const [assets, setAssets] = useState([
    {
      id: '1',
      category: 'property', // 'property' | 'agri' | 'gold' | 'bank' | 'vehicle'
      titleEn: 'Residential House (1 Kanal - DHA Lahore)',
      titleUr: 'رہائشی مکان (1 کنال - ڈی ایچ اے لاہور)',
      unitType: 'Kanal',
      unitQuantity: 1, // 1 Kanal = 20 Marlas
      unitConversion: 20, // 20 Marlas
      estimatedPkr: 45000000,
    },
    {
      id: '2',
      category: 'agri',
      titleEn: 'Agricultural Land (Tehsil Depalpur / Okara)',
      titleUr: 'زرعی اراضی (تحصیل دیپالپور)',
      unitType: 'Acres',
      unitQuantity: 4, // 4 Acres = 32 Kanals
      unitConversion: 32, // 32 Kanals
      estimatedPkr: 16000000,
    },
    {
      id: '3',
      category: 'gold',
      titleEn: 'Gold Jewelry (Zewar)',
      titleUr: 'طلائی زیورات (سونا)',
      unitType: 'Tolas',
      unitQuantity: 18,
      unitConversion: 18,
      estimatedPkr: 4500000,
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('property');
  const [newQty, setNewQty] = useState('');
  const [newUnit, setNewUnit] = useState('Marlas');
  const [newVal, setNewVal] = useState('');

  if (!results || !results.heirsList) return null;
  const { heirsList } = results;

  const totalAssetValue = assets.reduce((sum, a) => sum + (Number(a.estimatedPkr) || 0), 0);

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAsset = {
      id: Date.now().toString(),
      category: newCategory,
      titleEn: newTitle,
      titleUr: newTitle,
      unitType: newUnit,
      unitQuantity: Number(newQty) || 1,
      estimatedPkr: Number(newVal) || 0,
    };

    setAssets([...assets, newAsset]);
    setNewTitle('');
    setNewQty('');
    setNewVal('');
  };

  const handleRemoveAsset = (id) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold border border-gold-500/30 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'جائیداد و اثاثہ جات تقسیم کار' : 'Physical Asset & Property Divider'}</span>
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-100 mt-1">
            {lang === 'ur'
              ? 'مکان، زرعی اراضی، سونا اور گاڑیوں کی شرعی تقسیم'
              : 'Divide Plots, Agricultural Land, Gold & Vehicles by Legal Shares'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ur'
              ? 'اپنے مکانات، پلاٹس اور زیورات درج کریں اور دیکھیں کہ ہر وارث کو کتنا رقبہ اور حصہ ملتا ہے۔'
              : 'Enter individual houses, agricultural Kanals/Acres, and gold to calculate exact physical and monetary allocations per heir.'}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">
            {lang === 'ur' ? 'اثاثہ جات کی کل مالیت:' : 'Total Assets Value:'}
          </span>
          <span className="text-base font-extrabold text-emerald-400">
            {formatPKR(totalAssetValue)}
          </span>
        </div>
      </div>

      {/* Add New Asset Form */}
      <form onSubmit={handleAddAsset} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'ur' ? 'نیا اثاثہ شامل کریں:' : 'Add a New Real-World Asset:'}</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder={lang === 'ur' ? 'مثلاً: 10 مرلہ مکان / 5 ایکڑ زرعی زمین' : 'e.g. 10 Marla House / 5 Acres Agri Land'}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="property">{lang === 'ur' ? 'رہائشی/کمرشل پلاٹ' : 'Plot / House'}</option>
              <option value="agri">{lang === 'ur' ? 'زرعی اراضی' : 'Agri Land'}</option>
              <option value="gold">{lang === 'ur' ? 'سونا / زیورات' : 'Gold / Jewelry'}</option>
              <option value="bank">{lang === 'ur' ? 'بینک اکاؤنٹ' : 'Bank Balance'}</option>
              <option value="vehicle">{lang === 'ur' ? 'گاڑی / سواری' : 'Vehicle'}</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <input
              type="number"
              placeholder={lang === 'ur' ? 'مقدار (مثلاً 10)' : 'Qty (e.g. 10)'}
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="Marlas">Marlas (مرلے)</option>
              <option value="Kanals">Kanals (کنال)</option>
              <option value="Acres">Acres (ایکڑ / قلعے)</option>
              <option value="Sq. Yards">Sq. Yards (گز)</option>
              <option value="Tolas">Tolas (تولے)</option>
              <option value="Units">Units (تعداد)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <input
              type="number"
              placeholder={lang === 'ur' ? 'مالیت (PKR)' : 'Value (PKR)'}
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? 'شامل کریں' : 'Add Asset'}</span>
          </button>
        </div>
      </form>

      {/* Assets & Individual Heir Shares Grid */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-300">
          {lang === 'ur' ? 'اثاثہ وار شرعی تقسیم کا نقشہ:' : 'Per-Asset Legal Heir Allocation:'}
        </h4>

        <div className="space-y-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
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
                    <h5 className="text-xs font-bold text-slate-100">
                      {lang === 'ur' ? asset.titleUr : asset.titleEn}
                    </h5>
                    <span className="text-[10px] text-slate-400">
                      {asset.unitQuantity} {asset.unitType} • {formatPKR(asset.estimatedPkr)}
                    </span>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
                {heirsList.map((heir) => {
                  const heirPhysicalShare = (asset.unitQuantity * heir.rawFraction).toFixed(2);
                  const heirPkrShare = asset.estimatedPkr * heir.rawFraction;

                  return (
                    <div key={heir.id} className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 truncate">
                          {lang === 'ur' ? heir.nameUr : heir.nameEn}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold shrink-0">
                          {heir.percentage}%
                        </span>
                      </div>
                      <p className="text-slate-300 font-bold mt-1">
                        {heirPhysicalShare} {asset.unitType}
                      </p>
                      <p className="text-[9.5px] text-gold-400">
                        {formatPKR(heirPkrShare)}
                      </p>
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
