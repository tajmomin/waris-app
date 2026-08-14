import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Building2,
  Clock,
  Phone,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Compass,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  nadraCenters,
  pakistaniCities,
  calculateDistanceKm,
} from '../data/nadraCentersData';
import { translations } from '../translations/translations';

export default function NadraLocator({ lang }) {
  const t = translations[lang];
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'succession' | 'mega' | 'revenue'
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [locationError, setLocationError] = useState('');

  // Handle GPS location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError(
        lang === 'ur'
          ? 'آپ کے براؤزر میں جیو لوکیشن کی سہولت موجود نہیں ہے۔'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setLocationStatus('loading');
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        setLocationStatus('success');
        setSelectedCity('all'); // Clear city filter to show purely sorted by distance
      },
      (err) => {
        setLocationStatus('error');
        if (err.code === 1) {
          setLocationError(
            lang === 'ur'
              ? 'لوکیشن کی اجازت نہیں دی گئی۔ برائے مہربانی براؤزر پرمیشن چیک کریں یا شہر منتخب کریں۔'
              : 'Location permission denied. Please enable GPS in browser or choose your city below.'
          );
        } else {
          setLocationError(
            lang === 'ur'
              ? 'موجودہ پوزیشن معلوم نہ ہو سکی۔ براہِ کرم اپنا شہر منتخب فرمائیں۔'
              : 'Could not fetch GPS coordinates. Please select your city manually.'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Filter and sort centers by distance or city
  const filteredCenters = nadraCenters
    .map((center) => {
      let distance = null;
      if (userLocation) {
        distance = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          center.lat,
          center.lng
        );
      }
      return {
        ...center,
        distance,
      };
    })
    .filter((center) => {
      // City filter
      if (selectedCity !== 'all' && center.city !== selectedCity) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all' && center.type !== selectedType) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName =
          center.nameEn.toLowerCase().includes(q) || center.nameUr.includes(q);
        const matchAddr =
          center.addressEn.toLowerCase().includes(q) || center.addressUr.includes(q);
        const matchCity = center.city.toLowerCase().includes(q);
        const matchServices = center.services.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchAddr && !matchCity && !matchServices) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by distance if user location is active
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      // Otherwise sort succession centers first
      if (a.type === 'succession' && b.type !== 'succession') return -1;
      if (b.type === 'succession' && a.type !== 'succession') return 1;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel-emerald p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-glow relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-gold-400" />
                <span>{lang === 'ur' ? 'جیو لوکیٹر و ایڈریس ڈائریکٹری' : 'Geo-Locator & Directory'}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              {lang === 'ur'
                ? 'قریبی نادرا جانشینی سینٹرز اور اراضی ریکارڈ دفاتر'
                : 'Find Nearest NADRA Succession Centers & Land Offices'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ur'
                ? 'اپنے شہر یا موجودہ پوزیشن کی بنیاد پر قریبی نادرا جانشینی مراکز (Succession Centers)، 24 گھنٹے میگا سینٹرز اور اراضی ریکارڈ دفاتر کے پتے، اوقاتِ کار اور گوگل میپس نیویگیشن معلوم کریں۔'
                : 'Locate certified NADRA Succession Facilitation Centers (for Letters of Administration & Succession Certificates under the 2021 Act), 24/7 Mega Centers, and Arazi Record Centers near you.'}
            </p>
          </div>

          {/* Detect Location Button */}
          <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={locationStatus === 'loading'}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-glow flex items-center gap-2 transition transform active:scale-95 disabled:opacity-50"
            >
              <Navigation
                className={`w-4 h-4 text-white ${
                  locationStatus === 'loading' ? 'animate-spin' : ''
                }`}
              />
              <span>
                {locationStatus === 'loading'
                  ? lang === 'ur'
                    ? 'لوکیشن معلوم ہو رہی ہے...'
                    : 'Locating nearest centers...'
                  : lang === 'ur'
                  ? 'میری موجودہ لوکیشن سے تلاش کریں (GPS)'
                  : 'Find Nearest to My Location (GPS)'}
              </span>
            </button>

            {locationStatus === 'success' && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ur'
                    ? 'آپ کے فاصلے کے حساب سے ترتیب شدہ'
                    : 'Sorted by shortest distance from you'}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Location Error Notice */}
        {locationStatus === 'error' && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}
      </div>

      {/* Controls & Filters Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* City Selector */}
          <div className="sm:col-span-4 space-y-1">
            <label className="block text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span>{lang === 'ur' ? 'شہر منتخب کریں:' : 'Select City / District:'}</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setUserLocation(null);
                setLocationStatus('idle');
              }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {pakistaniCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {lang === 'ur' ? city.nameUr : city.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="sm:col-span-8 space-y-1">
            <label className="block text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'ur' ? 'علاقہ، روڈ یا سروس تلاش کریں:' : 'Search locality, road, or service:'}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'ur'
                    ? 'مثلاً: Clifton, Johar Town, Blue Area, FRC, Succession'
                    : 'e.g. Clifton, Johar Town, Blue Area, Hayatabad, Succession...'
                }
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Center Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 mr-1">
            {lang === 'ur' ? 'دفتر کی قسم:' : 'Filter Type:'}
          </span>
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              selectedType === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {lang === 'ur' ? 'تمام مراکز' : 'All Centers'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('succession')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              selectedType === 'succession'
                ? 'bg-gold-600 text-white shadow-glow-gold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-gold-300" />
            <span>{lang === 'ur' ? 'نادرا جانشینی مراکز (Succession Act 2021)' : 'NADRA Succession Centers (Act 2021)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('mega')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              selectedType === 'mega'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{lang === 'ur' ? '24/7 میگا سینٹرز' : '24/7 Mega Centers'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('revenue')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              selectedType === 'revenue'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>{lang === 'ur' ? 'اراضی ریکارڈ و ریونیو دفاتر' : 'Land Records / PLRA / KDA'}</span>
          </button>
        </div>
      </div>

      {/* Centers Listing Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400">
            {lang === 'ur'
              ? `${filteredCenters.length} تصدیق شدہ سرکاری مراکز دستیاب ہیں`
              : `Found ${filteredCenters.length} verified facilitation centers`}
          </span>
          {userLocation && (
            <span className="text-[11px] text-emerald-400 font-semibold">
              📍 {lang === 'ur' ? 'قریب ترین مرکز سب سے اوپر ہے' : 'Sorted: Closest first'}
            </span>
          )}
        </div>

        {filteredCenters.length === 0 ? (
          <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center space-y-2">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">
              {lang === 'ur' ? 'کوئی مرکز نہیں ملا' : 'No Centers Found matching criteria'}
            </p>
            <p className="text-xs text-slate-500">
              {lang === 'ur'
                ? 'برائے مہربانی فلٹرز یا تلاش کے الفاظ تبدیل کر کے دوبارہ کوشش کریں۔'
                : 'Try clearing the search query or selecting "All Pakistan".'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                className={`glass-panel p-5 rounded-2xl border transition flex flex-col justify-between gap-4 ${
                  center.type === 'succession'
                    ? 'border-gold-500/30 bg-slate-900/90 hover:border-gold-400'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header: Type Badge & Distance */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          center.type === 'succession'
                            ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                            : center.type === 'mega'
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        }`}
                      >
                        {center.type === 'succession'
                          ? lang === 'ur'
                            ? 'جانشینی سہولت مرکز'
                            : 'Succession Center (Act 2021)'
                          : center.type === 'mega'
                          ? lang === 'ur'
                            ? 'میگا سینٹر (24/7)'
                            : 'NADRA Mega Center'
                          : lang === 'ur'
                          ? 'اراضی ریکارڈ / ریونیو'
                          : 'Land Revenue Center'}
                      </span>

                      {center.is24_7 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                          24/7 Open
                        </span>
                      )}
                    </div>

                    {center.distance !== null && (
                      <span className="text-xs font-extrabold text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 shrink-0">
                        📍 {center.distance} km
                      </span>
                    )}
                  </div>

                  {/* Center Name */}
                  <h3 className="text-sm font-extrabold text-slate-100">
                    {lang === 'ur' ? center.nameUr : center.nameEn}
                  </h3>

                  {/* Address */}
                  <p className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{lang === 'ur' ? center.addressUr : center.addressEn}</span>
                  </p>

                  {/* Timing & Helpline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{lang === 'ur' ? center.timingUr : center.timingEn}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{center.helpline}</span>
                    </div>
                  </div>

                  {/* Services Chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {center.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/80"
                      >
                        ✓ {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions: Open in Google Maps */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    {center.city} • {center.province.toUpperCase()}
                  </span>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      center.googleQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{lang === 'ur' ? 'گوگل میپس پر راستہ دیکھیں' : 'Directions on Google Maps'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
