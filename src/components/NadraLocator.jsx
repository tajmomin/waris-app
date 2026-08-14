import React, { useState } from 'react';
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
  Circle,
  ArrowRight,
  Route,
  Layers,
  FileCheck2,
  Landmark,
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
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'uc' | 'mega' | 'succession' | 'revenue'
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [locationError, setLocationError] = useState('');
  const [activeStepTab, setActiveStepTab] = useState(1); // 1: UC -> 2: Mega -> 3: Succession -> 4: Revenue
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStepCompleted = (stepNum) => {
    setCompletedSteps((prev) => {
      const updated = { ...prev, [stepNum]: !prev[stepNum] };
      if (updated[stepNum] && stepNum < 4) {
        setActiveStepTab(stepNum + 1);
      }
      return updated;
    });
  };

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
        setSelectedCity('all');
      },
      (err) => {
        setLocationStatus('error');
        if (err.code === 1) {
          setLocationError(
            lang === 'ur'
              ? 'لوکیشن کی اجازت نہیں دی گئی۔ برائے مہربانی براؤزر پرمیشن چیک کریں یا نیچے سے اپنا شہر منتخب فرمائیں۔'
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

  // Calculate distance for all centers
  const centersWithDistance = nadraCenters.map((center) => {
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
  });

  // Filter centers based on city and search query
  const filteredByCityAndSearch = centersWithDistance.filter((center) => {
    if (selectedCity !== 'all' && center.city !== selectedCity) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = center.nameEn.toLowerCase().includes(q) || center.nameUr.includes(q);
      const matchAddr = center.addressEn.toLowerCase().includes(q) || center.addressUr.includes(q);
      const matchCity = center.city.toLowerCase().includes(q);
      const matchServices = center.services.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchAddr && !matchCity && !matchServices) {
        return false;
      }
    }
    return true;
  });

  // Find the single closest verified office for each of the 4 sequential stops
  const closestUcOffice = [...filteredByCityAndSearch]
    .filter((c) => c.type === 'uc')
    .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999))[0];

  const closestMegaCenter = [...filteredByCityAndSearch]
    .filter((c) => c.type === 'mega')
    .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999))[0];

  const closestSuccessionCenter = [...filteredByCityAndSearch]
    .filter((c) => c.type === 'succession' || c.type === 'executive')
    .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999))[0];

  const closestRevenueCenter = [...filteredByCityAndSearch]
    .filter((c) => c.type === 'revenue')
    .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999))[0];

  // Full listing filtered by type as well
  const filteredCenters = filteredByCityAndSearch
    .filter((center) => {
      if (selectedType !== 'all' && center.type !== selectedType) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return 0;
    });

  // Roadmap Steps Definition
  const journeySteps = [
    {
      stepNum: 1,
      titleEn: '1st Stop: Nearest Union Council / Cantonment Office',
      titleUr: 'پہلی منزل: قریبی یونین کونسل یا کنٹونمنٹ دفتر',
      targetEn: 'Obtain NADRA Computerized Death Certificate',
      targetUr: 'کمپیوٹرائزڈ ڈیتھ سرٹیفکیٹ کا حصول',
      descEn:
        'First essential stop: Report the demise at your local Union Council or Cantonment Board. Submit the graveyard burial slip and hospital death certificate to receive the official NADRA-linked Computerized Death Certificate.',
      descUr:
        'پہلا بنیادی قدم: ہسپتال کی رپورٹ اور قبرستان کی پرچی کے ساتھ قریبی یونین کونسل یا کنٹونمنٹ بورڈ میں اندراج کروا کر نادرا سے منسلک کمپیوٹرائزڈ ڈیتھ سرٹیفکیٹ حاصل کریں۔',
      timelineEn: '2 - 5 working days',
      timelineUr: '2 سے 5 یوم',
      docsNeededEn: ['Graveyard burial slip (Qabristan Parchi)', 'Hospital death report / Medical certificate', 'Original & copies of applicant CNIC'],
      docsNeededUr: ['قبرستان کی تدفین پرچی', 'ہسپتال کی ڈیتھ رپورٹ / میڈیکل سرٹیفکیٹ', 'درخواست گزار کا شناختی کارڈ بمع نقول'],
      closestOffice: closestUcOffice,
      searchQuery: `Union Council Office near ${
        selectedCity !== 'all' ? selectedCity : 'my location'
      }`,
    },
    {
      stepNum: 2,
      titleEn: '2nd Stop: Nearest NADRA Mega Center (24/7)',
      titleUr: 'دوسری منزل: قریبی نادرا میگا سینٹر (24/7)',
      targetEn: 'CNIC Cancellation & Family Registration Certificate (FRC)',
      targetUr: 'شناختی کارڈ منسوخی اور ایف آر سی (خاندانی شجرہ)',
      descEn:
        'Second stop: Cancel the deceased’s CNIC/NICOP and obtain the Death Registration Certificate (DRC). Apply for the Family Registration Certificate (FRC - by birth & marriage) which officially lists all legal heirs.',
      descUr:
        'دوسرا قدم: نادرا میگا سینٹر میں متوفی کا شناختی کارڈ منسوخ کروائیں اور فیملی رجسٹریشن سرٹیفکیٹ (FRC) حاصل کریں جس میں تمام شرعی ورثاء کے نام درج ہوتے ہیں۔',
      timelineEn: '1 - 3 working days (Mega Centers open 24/7)',
      timelineUr: '1 سے 3 یوم (میگا سینٹرز 24 گھنٹے کھلے ہیں)',
      docsNeededEn: ['Original CNIC of deceased (will be cancelled with corner cut)', 'Computerized Death Certificate from Step 1', 'Original CNICs / CRC of all surviving heirs'],
      docsNeededUr: ['متوفی کا اصل شناختی کارڈ (کارنر کٹ کر کے منسوخ ہوگا)', 'کمپیوٹرائزڈ ڈیتھ سرٹیفکیٹ (مرحلہ 1 سے حاصل شدہ)', 'تمام شرعی ورثاء کے اصل شناختی کارڈز / ب فارم'],
      closestOffice: closestMegaCenter,
      searchQuery: 'NADRA Mega Center',
    },
    {
      stepNum: 3,
      titleEn: '3rd Stop: Nearest NADRA Succession Facilitation Center',
      titleUr: 'تیسری منزل: قریبی نادرا جانشینی سہولت مرکز',
      targetEn: 'Succession Certificate & Letter of Administration (Act 2021)',
      targetUr: 'جانشینی سرٹیفکیٹ اور لیٹر آف ایڈمنسٹریشن',
      descEn:
        'Third stop: Apply under the Succession Act 2021. All legal heirs provide biometric fingerprint verification. NADRA publishes a 14-day public notice in national newspapers, then issues digital QR-coded certificates for movable and immovable property.',
      descUr:
        'تیسرا قدم: نادرا جانشینی مرکز میں درخواست دیں۔ تمام ورثاء کا بائیومیٹرک فنگر پرنٹ ہوگا۔ اخبار میں 14 روزہ اشتہار کے بعد کیو آر کوڈ والا ڈیجیٹل سرٹیفکیٹ جاری ہوگا۔',
      timelineEn: '15 - 20 working days',
      timelineUr: '15 سے 20 یوم',
      docsNeededEn: ['FRC & DRC from Step 2', 'Property Registry / Allotment Letters / Bank Statements', 'Physical presence of all legal heirs for biometrics (or Power of Attorney)'],
      docsNeededUr: ['ایف آر سی اور ڈی آر سی (مرحلہ 2 سے)', 'جائیداد کی رجسٹری / الاٹمنٹ لیٹر / بینک اسٹیٹمنٹ', 'تمام ورثاء کی بائیومیٹرک فنگر پرنٹ حاضری'],
      closestOffice: closestSuccessionCenter,
      searchQuery: 'NADRA Succession Facilitation Center',
    },
    {
      stepNum: 4,
      titleEn: '4th Stop: Nearest Tehsil Arazi Record Center (ARC) / Land Revenue Office',
      titleUr: 'چوتھی منزل: قریبی تحصیل اراضی ریکارڈ سینٹر (ARC) / ریونیو دفتر',
      targetEn: 'Intiqal-e-Wirasat (Final Property Mutation & Updated Fard)',
      targetUr: 'انتقالِ وراثت اور نیا کمپیوٹرائزڈ فرد ملکیت',
      descEn:
        'Final stop: Present the NADRA Succession Certificate & FRC at the Tehsil Arazi Record Center (PLRA) / CDA One-Window / KDA Civic Center / Mukhtiarkar Tapedar Dera. The Revenue Officer sanctions the mutation and updates the land registry in all legal heirs’ names.',
      descUr:
        'آخری مرحلہ: نادرا جانشینی سرٹیفکیٹ اور ایف آر سی اراضی ریکارڈ سینٹر / سی ڈی اے / کے ڈی اے / مختار کار دفتر میں پیش کریں۔ ریونیو آفیسر شرعی حصوں کے مطابق جائیداد ورثاء کے نام منتقل کر کے نیا فرد جاری کرے گا۔',
      timelineEn: '7 - 14 working days',
      timelineUr: '7 سے 14 یوم',
      docsNeededEn: ['NADRA Succession Certificate & Letter of Administration', 'Original Property Documents (Registry / Fard / Allotment Letter)', 'Original CNICs of all legal heirs & FRC'],
      docsNeededUr: ['نادرا جانشینی سرٹیفکیٹ و لیٹر آف ایڈمنسٹریشن', 'اصل فردِ ملکیت / بیع نامہ رجسٹری / الاٹمنٹ لیٹر', 'تمام ورثاء کے اصل شناختی کارڈز اور ایف آر سی'],
      closestOffice: closestRevenueCenter,
      searchQuery: 'Arazi Record Center PLRA',
    },
  ];

  const currentJourneyStep = journeySteps.find((s) => s.stepNum === activeStepTab) || journeySteps[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel-emerald p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-glow relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5 text-gold-400" />
                <span>
                  {lang === 'ur'
                    ? 'مکمل 4 مراحلی روڈ میپ و قریبی سرکاری دفاتر'
                    : '4-Step Sequential Roadmap & Nearest Government Offices'}
                </span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              {lang === 'ur'
                ? 'یونین کونسل سے لے کر اراضی ریکارڈ سینٹر تک — قریبی ترین دفاتر'
                : 'From Union Council to Arazi Record Center — Nearest Offices Pinned'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ur'
                ? 'سب سے پہلے یونین کونسل، پھر نادرا میگا سینٹر، پھر جانشینی مرکز، اور آخر میں تحصیل اراضی ریکارڈ سینٹر (ARC) یا مختار کار دفتر۔ آپ کی موجودہ پوزیشن کے مطابق ہر مرحلے کا قریبی ترین دفتر نمایاں کر دیا گیا ہے۔'
                : 'Follow the 4 real-world steps in exact order: (1) Union Council $\\rightarrow$ (2) NADRA Mega Center $\\rightarrow$ (3) NADRA Succession Center $\\rightarrow$ (4) Tehsil Arazi Record Center (ARC) / Mukhtiarkar. Your nearest verified office for each stop is highlighted below.'}
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
                    : 'Locating nearest offices...'
                  : lang === 'ur'
                  ? 'میری لوکیشن سے تمام دفاتر کا فاصلہ نکالیں (GPS)'
                  : 'Find Nearest Offices to Me (GPS)'}
              </span>
            </button>

            {locationStatus === 'success' && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ur'
                    ? 'تمام دفاتر کے فاصلے آپ کی لوکیشن سے حساب کیے گئے ہیں'
                    : 'Distances computed from your exact GPS coordinates'}
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

      {/* 4-Step Interactive Progression Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>
              {lang === 'ur' ? 'قانونی کارروائی کی لازمی ترتیب:' : 'Official Sequence of Operations:'}
            </span>
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">
            {Object.values(completedSteps).filter(Boolean).length} / 4{' '}
            {lang === 'ur' ? 'مراحل مکمل' : 'steps completed'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {journeySteps.map((step) => {
            const isSelected = activeStepTab === step.stepNum;
            const isDone = !!completedSteps[step.stepNum];

            return (
              <button
                type="button"
                key={step.stepNum}
                onClick={() => setActiveStepTab(step.stepNum)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-2 relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-400 shadow-glow'
                    : isDone
                    ? 'bg-slate-900/90 border-emerald-500/40 text-slate-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : step.stepNum}
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {lang === 'ur'
                        ? `مرحلہ ${step.stepNum}`
                        : `Step ${step.stepNum}`}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      {lang === 'ur' ? 'زیرِ نظر' : 'Active'}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-100 line-clamp-1">
                    {lang === 'ur' ? step.targetUr : step.targetEn}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {lang === 'ur' ? step.timelineUr : step.timelineEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Highlight & Nearest Office Spotlight */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border-2 border-emerald-500/30 shadow-glow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
              {currentJourneyStep.stepNum}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
                  {lang === 'ur'
                    ? `قانونی مرحلہ نمبر ${currentJourneyStep.stepNum}`
                    : `Actionable Step ${currentJourneyStep.stepNum} of 4`}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                  {lang === 'ur' ? currentJourneyStep.timelineUr : currentJourneyStep.timelineEn}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-100 mt-0.5">
                {lang === 'ur' ? currentJourneyStep.titleUr : currentJourneyStep.titleEn}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleStepCompleted(currentJourneyStep.stepNum)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              completedSteps[currentJourneyStep.stepNum]
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            {completedSteps[currentJourneyStep.stepNum] ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : (
              <Circle className="w-4 h-4 text-slate-400" />
            )}
            <span>
              {completedSteps[currentJourneyStep.stepNum]
                ? lang === 'ur'
                  ? 'یہ مرحلہ مکمل ہو گیا ہے ✓'
                  : 'Marked as Completed ✓'
                : lang === 'ur'
                ? 'مرحلہ مکمل مارک کریں'
                : 'Mark Step as Completed'}
            </span>
          </button>
        </div>

        {/* Step Details & Required Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ur' ? currentJourneyStep.descUr : currentJourneyStep.descEn}
            </p>

            {/* Checklist of what to take with you */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                <span>
                  {lang === 'ur'
                    ? 'ساتھ لے جانے والی لازمی دستاویزات:'
                    : 'Mandatory Documents to take with you:'}
                </span>
              </span>
              <ul className="space-y-1.5 pt-1">
                {(lang === 'ur'
                  ? currentJourneyStep.docsNeededUr
                  : currentJourneyStep.docsNeededEn
                ).map((doc, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pinned Closest Office Spotlight Card */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>
                  {lang === 'ur'
                    ? 'آپ کے لیے تجویز کردہ قریبی ترین سرکاری دفتر:'
                    : 'Recommended Nearest Office for this Step:'}
                </span>
              </span>
            </div>

            {currentJourneyStep.closestOffice ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-gold-500/40 shadow-glow-gold space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold border border-gold-500/30 uppercase tracking-wider">
                    {currentJourneyStep.closestOffice.type === 'uc'
                      ? lang === 'ur'
                        ? 'یونین کونسل / بلدیاتی دفتر'
                        : 'Union Council / Municipal Office'
                      : currentJourneyStep.closestOffice.type === 'mega'
                      ? lang === 'ur'
                        ? 'نادرا میگا سینٹر (24/7)'
                        : 'NADRA Mega Center'
                      : currentJourneyStep.closestOffice.type === 'succession'
                      ? lang === 'ur'
                        ? 'نادرا جانشینی مرکز'
                        : 'NADRA Succession Center'
                      : lang === 'ur'
                      ? 'اراضی ریکارڈ سینٹر (PLRA / KDA)'
                      : 'Arazi Record Center (PLRA)'}
                  </span>

                  {currentJourneyStep.closestOffice.distance !== null && (
                    <span className="text-xs font-extrabold text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30">
                      📍 {currentJourneyStep.closestOffice.distance} km away
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-100">
                  {lang === 'ur'
                    ? currentJourneyStep.closestOffice.nameUr
                    : currentJourneyStep.closestOffice.nameEn}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'ur'
                      ? currentJourneyStep.closestOffice.addressUr
                      : currentJourneyStep.closestOffice.addressEn}
                  </span>
                </p>

                <div className="text-[11px] space-y-1 text-slate-400 pt-1 border-t border-slate-800">
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    <span>
                      {lang === 'ur'
                        ? currentJourneyStep.closestOffice.timingUr
                        : currentJourneyStep.closestOffice.timingEn}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentJourneyStep.closestOffice.helpline}</span>
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    currentJourneyStep.closestOffice.googleQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition"
                >
                  <span>{lang === 'ur' ? 'گوگل میپس پر راستہ دیکھیں' : 'Get Directions on Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 uppercase tracking-wider">
                  {lang === 'ur' ? 'مقامی بلدیاتی ادارہ' : 'Local Municipality'}
                </span>

                <h4 className="text-sm font-bold text-slate-100">
                  {lang === 'ur'
                    ? 'متعلقہ یونین کونسل / کنٹونمنٹ بورڈ'
                    : 'Concerned Union Council / Cantonment Directorate'}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ur'
                    ? 'ڈیتھ سرٹیفکیٹ کا اندراج اس یونین کونسل کے دائرہ اختیار میں ہوتا ہے جہاں متوفی کی رہائش تھی یا جہاں تدفین عمل میں آئی۔'
                    : 'Death registration must be initiated at the specific Union Council office corresponding to the deceased’s residential ward or cemetery jurisdiction.'}
                </p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    currentJourneyStep.searchQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <span>
                    {lang === 'ur'
                      ? 'قریبی یونین کونسل گوگل میپس پر تلاش کریں'
                      : 'Find Nearest Union Council on Google Maps'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Directory Explorer */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'ur'
                  ? 'تمام یونین کونسلز، نادرا سینٹرز و اراضی ریکارڈ دفاتر (ARCs)'
                  : 'Directory of Union Councils, NADRA Centers & Arazi Record Centers (ARCs)'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ur'
                ? 'شہر اور دفتر کی قسم کے مطابق فلٹر کر کے معلومات دیکھیں'
                : 'Browse by city and government facility type across Pakistan'}
            </p>
          </div>

          <span className="text-xs font-bold text-slate-400">
            {filteredCenters.length} {lang === 'ur' ? 'مراکز' : 'Centers'}
          </span>
        </div>

        {/* City & Search Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4 space-y-1">
            <label className="block text-[11px] font-bold text-slate-300">
              {lang === 'ur' ? 'شہر منتخب کریں:' : 'City / District:'}
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

          <div className="sm:col-span-8 space-y-1">
            <label className="block text-[11px] font-bold text-slate-300">
              {lang === 'ur' ? 'تلاش کریں:' : 'Search locality, Tehsil, or office:'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'ur'
                    ? 'مثلاً: Town Hall, Katchery, Arazi Record Center, Clifton, Johar Town, Blue Area'
                    : 'e.g. Town Hall, Katchery, Arazi Record Center, Clifton, Johar Town, Blue Area...'
                }
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedType === 'all'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {lang === 'ur' ? 'تمام دفاتر (All)' : 'All Offices'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('uc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              selectedType === 'uc'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? 'یونین کونسلز و کنٹونمنٹ بورڈز (UCs)' : 'Union Councils & Cantonments (UCs)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('succession')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              selectedType === 'succession'
                ? 'bg-gold-600 text-white shadow-glow-gold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-gold-300" />
            <span>{lang === 'ur' ? 'نادرا جانشینی مراکز (Succession Act 2021)' : 'NADRA Succession Centers'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('mega')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              selectedType === 'mega'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? '24/7 میگا سینٹرز' : '24/7 Mega Centers'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('revenue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              selectedType === 'revenue'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? 'تحصیل اراضی ریکارڈ سینٹرز (ARC / PLRA)' : 'Arazi Record Centers (ARC / PLRA / KDA)'}</span>
          </button>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                center.type === 'uc'
                  ? 'border-amber-500/30 bg-slate-900/90 hover:border-amber-400'
                  : center.type === 'succession'
                  ? 'border-gold-500/30 bg-slate-900/90 hover:border-gold-400'
                  : center.type === 'revenue'
                  ? 'border-indigo-500/30 bg-slate-900/90 hover:border-indigo-400'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      center.type === 'uc'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : center.type === 'succession'
                        ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                        : center.type === 'mega'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}
                  >
                    {center.type === 'uc'
                      ? lang === 'ur'
                        ? 'یونین کونسل / بلدیہ'
                        : 'Union Council / Municipal'
                      : center.type === 'succession'
                      ? lang === 'ur'
                        ? 'جانشینی مرکز (Act 2021)'
                        : 'Succession Center (Act 2021)'
                      : center.type === 'mega'
                      ? '24/7 Mega Center'
                      : lang === 'ur'
                      ? 'اراضی ریکارڈ سینٹر (ARC / PLRA)'
                      : 'Arazi Record Center (ARC)'}
                  </span>

                  {center.distance !== null && (
                    <span className="text-xs font-extrabold text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 shrink-0">
                      📍 {center.distance} km
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-100">
                  {lang === 'ur' ? center.nameUr : center.nameEn}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{lang === 'ur' ? center.addressUr : center.addressEn}</span>
                </p>

                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    <span>{lang === 'ur' ? center.timingUr : center.timingEn}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{center.helpline}</span>
                  </p>
                </div>

                {/* Service Tags */}
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
                  <span>{lang === 'ur' ? 'گوگل میپس پر دیکھیں' : 'Directions on Maps'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
