/**
 * Waris - Islamic Inheritance Calculation Engine (Fara'iz - Sunni / Hanafi Jurisprudence)
 *
 * Implements classical Hanafi inheritance principles with:
 * - Zawu al-Fara'id (Quranic Fixed Sharers)
 * - Asabah (Residuaries: bi-nafsihi, bi-ghayrihi, ma'a ghayrihi)
 * - Hujub (Rules of Exclusion / Blocking)
 * - Awl (Proportional Reduction / Denominator Expansion)
 * - Radd (Return of Surplus to Quranic Sharers)
 * - Umariyatan / Gharawayn (Spouse + Parents special cases)
 * - Net Estate deductions (Funeral costs, Debts, Wasiyyah)
 */

// Helper to compute Greatest Common Divisor
export function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

// Helper to compute Least Common Multiple
export function lcm(a, b) {
  return Math.abs(Math.round(a * b)) / gcd(a, b);
}

// Helper to format fraction nicely
export function formatFraction(numerator, denominator) {
  if (numerator === 0) return '0';
  const divisor = gcd(numerator, denominator);
  const num = Math.round(numerator / divisor);
  const den = Math.round(denominator / divisor);
  if (den === 1) return `${num}`;
  return `${num}/${den}`;
}

// Format Pakistani Rupees with Lacs / Crores helpers
export function formatPKR(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rs. 0';
  const num = Math.round(amount);
  return 'Rs. ' + num.toLocaleString('en-PK');
}

export function formatPKRWords(amount, lang = 'en') {
  if (!amount || amount <= 0) return '';
  if (amount >= 10000000) {
    const crores = (amount / 10000000).toFixed(2);
    return lang === 'ur' ? `${crores} کروڑ روپے` : `${crores} Crore PKR`;
  }
  if (amount >= 100000) {
    const lacs = (amount / 100000).toFixed(2);
    return lang === 'ur' ? `${lacs} لاکھ روپے` : `${lacs} Lakh PKR`;
  }
  if (amount >= 1000) {
    const thousands = (amount / 1000).toFixed(1);
    return lang === 'ur' ? `${thousands} ہزار روپے` : `${thousands} Thousand PKR`;
  }
  return lang === 'ur' ? `${amount} روپے` : `${amount} PKR`;
}

/**
 * Main Calculation Function
 *
 * @param {Object} input
 * @param {string} input.deceasedGender - 'male' | 'female'
 * @param {number} [input.wivesCount=0] - 0 to 4 (if deceased is male)
 * @param {boolean} [input.husband=false] - (if deceased is female)
 * @param {number} [input.sonsCount=0]
 * @param {number} [input.daughtersCount=0]
 * @param {boolean} [input.fatherAlive=false]
 * @param {boolean} [input.motherAlive=false]
 * @param {boolean} [input.paternalGrandfatherAlive=false]
 * @param {boolean} [input.paternalGrandmotherAlive=false]
 * @param {boolean} [input.maternalGrandmotherAlive=false]
 * @param {number} [input.fullBrothersCount=0]
 * @param {number} [input.fullSistersCount=0]
 * @param {number} [input.paternalBrothersCount=0]
 * @param {number} [input.paternalSistersCount=0]
 * @param {number} [input.maternalBrothersCount=0]
 * @param {number} [input.maternalSistersCount=0]
 * @param {number} [input.grossEstate=0] - Total estate in PKR
 * @param {number} [input.funeralExpenses=0] - PKR
 * @param {number} [input.debts=0] - PKR
 * @param {number} [input.wasiyyah=0] - PKR (max 1/3 after debts)
 *
 * @returns {Object} Detailed calculation results with audit trail
 */
export function calculateInheritance(input) {
  const {
    deceasedGender = 'male',
    wivesCount = 0,
    husband = false,
    sonsCount = 0,
    daughtersCount = 0,
    fatherAlive = false,
    motherAlive = false,
    paternalGrandfatherAlive = false,
    paternalGrandmotherAlive = false,
    maternalGrandmotherAlive = false,
    fullBrothersCount = 0,
    fullSistersCount = 0,
    paternalBrothersCount = 0,
    paternalSistersCount = 0,
    maternalBrothersCount = 0,
    maternalSistersCount = 0,
    grossEstate = 0,
    funeralExpenses = 0,
    debts = 0,
    wasiyyah = 0,
  } = input;

  const auditSteps = [];
  const blockedHeirs = [];

  // --- Step 0: Estate Calculation ---
  const validGross = Math.max(0, Number(grossEstate) || 0);
  const validFuneral = Math.max(0, Number(funeralExpenses) || 0);
  const validDebts = Math.max(0, Number(debts) || 0);

  const afterLiabilities = Math.max(0, validGross - validFuneral - validDebts);
  const maxWasiyyahAllowed = afterLiabilities / 3;
  const validWasiyyah = Math.min(Math.max(0, Number(wasiyyah) || 0), maxWasiyyahAllowed);
  const netEstate = Math.max(0, afterLiabilities - validWasiyyah);

  auditSteps.push({
    title: 'Estate Deductions (ترکہ اور حقوقِ ترکہ)',
    descEn: `Gross Estate: Rs. ${validGross.toLocaleString()} | Funeral: Rs. ${validFuneral.toLocaleString()} | Debts: Rs. ${validDebts.toLocaleString()} | Wasiyyah (Bequest): Rs. ${validWasiyyah.toLocaleString()} -> Net Distributable Estate: Rs. ${netEstate.toLocaleString()}`,
    descUr: `کل ترکہ: ${validGross.toLocaleString()} روپے | تجہیز و تکفین: ${validFuneral.toLocaleString()} روپے | قرضہ جات: ${validDebts.toLocaleString()} روپے | وصیت: ${validWasiyyah.toLocaleString()} روپے -> خالص تقسیم کے قابل ترکہ: ${netEstate.toLocaleString()} روپے`,
  });

  // --- Step 1: Analyze Family Hierarchy & Descendants ---
  const hasChildren = sonsCount > 0 || daughtersCount > 0;
  const hasSons = sonsCount > 0;
  const hasDaughtersOnly = !hasSons && daughtersCount > 0;
  const totalSiblings =
    fullBrothersCount +
    fullSistersCount +
    paternalBrothersCount +
    paternalSistersCount +
    maternalBrothersCount +
    maternalSistersCount;

  // --- Step 2: Determine Blocking (Hujub) ---
  // Grandfather blocked if Father alive
  const effectiveGrandfather = !fatherAlive && paternalGrandfatherAlive;
  if (paternalGrandfatherAlive && fatherAlive) {
    blockedHeirs.push({
      key: 'paternalGrandfather',
      nameEn: 'Paternal Grandfather (Dada)',
      nameUr: 'دادا',
      reasonEn: 'Excluded (Mahjoob) because the Father is alive.',
      reasonUr: 'والد کی موجودگی کی وجہ سے دادا محروم (حجب حرمان) ہیں۔',
    });
  }

  // Grandmothers: blocked by Mother; Paternal Grandmother also blocked by Father
  let effectiveMaternalGrandmother = !motherAlive && maternalGrandmotherAlive;
  let effectivePaternalGrandmother = !motherAlive && !fatherAlive && paternalGrandmotherAlive;

  if (maternalGrandmotherAlive && motherAlive) {
    blockedHeirs.push({
      key: 'maternalGrandmother',
      nameEn: 'Maternal Grandmother (Nani)',
      nameUr: 'نانی',
      reasonEn: 'Excluded because Mother is alive.',
      reasonUr: 'والدہ کی موجودگی کی وجہ سے نانی محروم ہیں۔',
    });
  }
  if (paternalGrandmotherAlive && (motherAlive || fatherAlive)) {
    blockedHeirs.push({
      key: 'paternalGrandmother',
      nameEn: 'Paternal Grandmother (Dadi)',
      nameUr: 'دادی',
      reasonEn: motherAlive
        ? 'Excluded because Mother is alive.'
        : 'Excluded because Father is alive.',
      reasonUr: motherAlive
        ? 'والدہ کی موجودگی کی وجہ سے دادی محروم ہیں۔'
        : 'والد کی موجودگی کی وجہ سے دادی محروم ہیں۔',
    });
  }

  // Siblings Blocking:
  // All siblings blocked by Father or Son (or Grandfather in standard Hanafi ruling)
  const isSiblingsBlockedByAscendantOrDescendant = fatherAlive || hasSons || effectiveGrandfather;

  let effectiveFullBrothers = isSiblingsBlockedByAscendantOrDescendant ? 0 : fullBrothersCount;
  let effectiveFullSisters = isSiblingsBlockedByAscendantOrDescendant ? 0 : fullSistersCount;

  if (isSiblingsBlockedByAscendantOrDescendant && (fullBrothersCount > 0 || fullSistersCount > 0)) {
    const reason = fatherAlive
      ? 'Father is alive'
      : hasSons
      ? 'Deceased has surviving son(s)'
      : 'Grandfather is alive';
    blockedHeirs.push({
      key: 'fullSiblings',
      nameEn: 'Full Brothers & Sisters (Haqiqi Bhai/Behn)',
      nameUr: 'حقیقی بھائی اور بہنیں',
      reasonEn: `Excluded because ${reason}.`,
      reasonUr: `${fatherAlive ? 'والد' : hasSons ? 'بیٹے' : 'دادا'} کی موجودگی کی وجہ سے حقیقی بہن بھائی محروم ہیں۔`,
    });
  }

  // Paternal Siblings blocked if Full Brother is present or full sister is asabah ma'a ghayriha
  const isPaternalBlockedByFullBrothers = effectiveFullBrothers > 0;
  let effectivePaternalBrothers =
    isSiblingsBlockedByAscendantOrDescendant || isPaternalBlockedByFullBrothers
      ? 0
      : paternalBrothersCount;
  let effectivePaternalSisters =
    isSiblingsBlockedByAscendantOrDescendant || isPaternalBlockedByFullBrothers
      ? 0
      : paternalSistersCount;

  if (
    !isSiblingsBlockedByAscendantOrDescendant &&
    isPaternalBlockedByFullBrothers &&
    (paternalBrothersCount > 0 || paternalSistersCount > 0)
  ) {
    blockedHeirs.push({
      key: 'paternalSiblings',
      nameEn: 'Paternal Siblings (Allati Bhai/Behn)',
      nameUr: 'علاتی بہن بھائی (سوتیلے باپ شریک)',
      reasonEn: 'Excluded by Full Brother(s).',
      reasonUr: 'حقیقی بھائی کی موجودگی کی وجہ سے علاتی بہن بھائی محروم ہیں۔',
    });
  }

  // Maternal Siblings: Blocked by any child (male or female), father, or grandfather
  const isMaternalBlocked = hasChildren || fatherAlive || effectiveGrandfather;
  let effectiveMaternalBrothers = isMaternalBlocked ? 0 : maternalBrothersCount;
  let effectiveMaternalSisters = isMaternalBlocked ? 0 : maternalSistersCount;

  if (isMaternalBlocked && (maternalBrothersCount > 0 || maternalSistersCount > 0)) {
    blockedHeirs.push({
      key: 'maternalSiblings',
      nameEn: 'Maternal Siblings (Akhyafi Bhai/Behn)',
      nameUr: 'اخیافی بہن بھائی (ماں شریک)',
      reasonEn: 'Excluded by children, father, or grandfather.',
      reasonUr: 'اولاد، والد یا دادا کی موجودگی کی وجہ سے اخیافی بہن بھائی محروم ہیں۔',
    });
  }

  // --- Step 3: Fixed Shares Allocation (Zawu al-Fara'id) ---
  const fixedShares = [];

  // 1. Spouses
  if (deceasedGender === 'male' && wivesCount > 0) {
    const num = 1;
    const den = hasChildren ? 8 : 4;
    fixedShares.push({
      key: 'wife',
      count: wivesCount,
      nameEn: wivesCount === 1 ? 'Wife (Bewah)' : `Wives (${wivesCount})`,
      nameUr: wivesCount === 1 ? 'بیوہ' : `بیویاں (${wivesCount})`,
      relationEn: 'Spouse',
      relationUr: 'زوجہ',
      num,
      den,
      ruleEn: hasChildren
        ? 'Wife receives 1/8 share because deceased has surviving children (Surah An-Nisa 4:12).'
        : 'Wife receives 1/4 share because deceased has no surviving children (Surah An-Nisa 4:12).',
      ruleUr: hasChildren
        ? 'اولاد کی موجودگی کی وجہ سے بیوہ کا مقررہ حصہ 1/8 ہے (سورۃ النساء 4:12)۔'
        : 'اولاد نہ ہونے کی وجہ سے بیوہ کا مقررہ حصہ 1/4 ہے (سورۃ النساء 4:12)۔',
      quranRef: 'Surah An-Nisa (4:12)',
      type: 'fard',
    });
  } else if (deceasedGender === 'female' && husband) {
    const num = 1;
    const den = hasChildren ? 4 : 2;
    fixedShares.push({
      key: 'husband',
      count: 1,
      nameEn: 'Husband (Shohar)',
      nameUr: 'شوہر',
      relationEn: 'Spouse',
      relationUr: 'شوہر',
      num,
      den,
      ruleEn: hasChildren
        ? 'Husband receives 1/4 share because deceased has surviving children (Surah An-Nisa 4:12).'
        : 'Husband receives 1/2 share because deceased has no surviving children (Surah An-Nisa 4:12).',
      ruleUr: hasChildren
        ? 'اولاد کی موجودگی کی وجہ سے شوہر کا مقررہ حصہ 1/4 ہے (سورۃ النساء 4:12)۔'
        : 'اولاد نہ ہونے کی وجہ سے شوہر کا مقررہ حصہ 1/2 ہے (سورۃ النساء 4:12)۔',
      quranRef: 'Surah An-Nisa (4:12)',
      type: 'fard',
    });
  }

  // 2. Mother
  // Check Umariyatan (Gharawayn): Spouse + Father + Mother alive, NO children, NO multiple siblings (<2)
  const isUmariyatan =
    motherAlive &&
    fatherAlive &&
    !hasChildren &&
    totalSiblings < 2 &&
    ((deceasedGender === 'male' && wivesCount > 0) || (deceasedGender === 'female' && husband));

  if (motherAlive) {
    if (isUmariyatan) {
      const num = 1;
      const den = deceasedGender === 'female' ? 6 : 4;
      fixedShares.push({
        key: 'mother',
        count: 1,
        nameEn: 'Mother (Walidah)',
        nameUr: 'والدہ',
        relationEn: 'Parent',
        relationUr: 'ماں',
        num,
        den,
        ruleEn: `Gharawayn / Umariyatan Special Case: Mother receives 1/3 of the residue after spouse share (${
          deceasedGender === 'female' ? '1/6 of total' : '1/4 of total'
        }) as decreed by Umar ibn al-Khattab (R.A.) and consensus of jurists so father receives double the mother's share.`,
        ruleUr: `مسئلہ غراوین (عمریتین): حضرت عمر فاروقؓ کے فیصلے اور اجماع صحابہ کے مطابق شریکِ حیات کا حصہ نکالنے کے بعد باقی ماندہ کا 1/3 والدہ کو ملے گا (${
          deceasedGender === 'female' ? 'کل ترکے کا 1/6' : 'کل ترکے کا 1/4'
        })۔`,
        quranRef: 'Ijma of Sahaba / Umariyatan',
        type: 'fard',
      });
    } else {
      const num = 1;
      const den = hasChildren || totalSiblings >= 2 ? 6 : 3;
      fixedShares.push({
        key: 'mother',
        count: 1,
        nameEn: 'Mother (Walidah)',
        nameUr: 'والدہ',
        relationEn: 'Parent',
        relationUr: 'ماں',
        num,
        den,
        ruleEn:
          den === 6
            ? 'Mother receives 1/6 share due to presence of children or multiple siblings (Surah An-Nisa 4:11).'
            : 'Mother receives 1/3 share as there are no children and fewer than two siblings (Surah An-Nisa 4:11).',
        ruleUr:
          den === 6
            ? 'اولاد یا دو یا دو سے زائد بہن بھائیوں کی موجودگی کی وجہ سے والدہ کا حصہ 1/6 ہے (سورۃ النساء 4:11)۔'
            : 'اولاد نہ ہونے اور بہن بھائی دو سے کم ہونے پر والدہ کا مقررہ حصہ 1/3 ہے (سورۃ النساء 4:11)۔',
        quranRef: 'Surah An-Nisa (4:11)',
        type: 'fard',
      });
    }
  }

  // 3. Father (Fixed share portion if children exist)
  if (fatherAlive) {
    if (hasSons) {
      fixedShares.push({
        key: 'father',
        count: 1,
        nameEn: 'Father (Walid)',
        nameUr: 'والد',
        relationEn: 'Parent',
        relationUr: 'باپ',
        num: 1,
        den: 6,
        ruleEn: 'Father receives 1/6 fixed share because deceased left surviving son(s) (Surah An-Nisa 4:11).',
        ruleUr: 'بیٹے کی موجودگی میں والد کا مقررہ حصہ 1/6 ہے (سورۃ النساء 4:11)۔',
        quranRef: 'Surah An-Nisa (4:11)',
        type: 'fard',
      });
    } else if (hasDaughtersOnly) {
      fixedShares.push({
        key: 'father_fard',
        count: 1,
        nameEn: 'Father (Walid - Fixed Share)',
        nameUr: 'والد (فرض/مقررہ حصہ)',
        relationEn: 'Parent',
        relationUr: 'باپ',
        num: 1,
        den: 6,
        ruleEn: 'Father receives 1/6 fixed share with daughters, and is also entitled to any leftover residue (Surah An-Nisa 4:11).',
        ruleUr: 'صرف بیٹیوں کی موجودگی میں والد کا مقررہ فرض 1/6 ہے اور باقی بچ جانے والا ترکہ بھی بطور عصبہ والد کو ملے گا۔',
        quranRef: 'Surah An-Nisa (4:11)',
        type: 'fard_and_asabah',
      });
    }
  }

  // 4. Paternal Grandfather (if father deceased)
  if (effectiveGrandfather) {
    if (hasSons) {
      fixedShares.push({
        key: 'grandfather',
        count: 1,
        nameEn: 'Paternal Grandfather (Dada)',
        nameUr: 'دادا',
        relationEn: 'Ascendant',
        relationUr: 'دادا',
        num: 1,
        den: 6,
        ruleEn: 'Grandfather receives 1/6 fixed share replacing deceased father in presence of sons.',
        ruleUr: 'والد کی وفات اور بیٹے کی موجودگی میں دادا کا حصہ 1/6 ہے۔',
        quranRef: 'Hanafi Jurisprudence (Qiyas on Father)',
        type: 'fard',
      });
    } else if (hasDaughtersOnly) {
      fixedShares.push({
        key: 'grandfather_fard',
        count: 1,
        nameEn: 'Paternal Grandfather (Dada - Fixed Share)',
        nameUr: 'دادا (فرض/مقررہ حصہ)',
        relationEn: 'Ascendant',
        relationUr: 'دادا',
        num: 1,
        den: 6,
        ruleEn: 'Grandfather receives 1/6 fixed share with daughters plus residue as Asabah.',
        ruleUr: 'بیٹیوں کی موجودگی میں دادا کو 1/6 فرض اور باقی ماندہ بطور عصبہ ملے گا۔',
        quranRef: 'Hanafi Jurisprudence',
        type: 'fard_and_asabah',
      });
    }
  }

  // 5. Grandmothers (if eligible)
  if (effectiveMaternalGrandmother && effectivePaternalGrandmother) {
    fixedShares.push({
      key: 'grandmothers',
      count: 2,
      nameEn: 'Grandmothers (Dadi & Nani)',
      nameUr: 'دادی اور نانی (مشترکہ)',
      relationEn: 'Grandmothers',
      relationUr: 'جدات صحیحہ',
      num: 1,
      den: 6,
      ruleEn: 'Maternal and Paternal Grandmothers share 1/6 equally (1/12 each) in the absence of mother and father.',
      ruleUr: 'والدہ اور والد کی غیر موجودگی میں دادی اور نانی مشترکہ طور پر 1/6 (فی کس 1/12) پاتی ہیں۔',
      quranRef: 'Hadith (Sunan Abi Dawud)',
      type: 'fard',
    });
  } else if (effectiveMaternalGrandmother) {
    fixedShares.push({
      key: 'maternalGrandmother',
      count: 1,
      nameEn: 'Maternal Grandmother (Nani)',
      nameUr: 'نانی',
      relationEn: 'Grandmother',
      relationUr: 'نانی',
      num: 1,
      den: 6,
      ruleEn: 'Maternal Grandmother receives 1/6 share in the absence of mother.',
      ruleUr: 'والدہ کی غیر موجودگی میں نانی کا حصہ 1/6 ہے۔',
      quranRef: 'Hadith (Sunan Abi Dawud)',
      type: 'fard',
    });
  } else if (effectivePaternalGrandmother) {
    fixedShares.push({
      key: 'paternalGrandmother',
      count: 1,
      nameEn: 'Paternal Grandmother (Dadi)',
      nameUr: 'دادی',
      relationEn: 'Grandmother',
      relationUr: 'دادی',
      num: 1,
      den: 6,
      ruleEn: 'Paternal Grandmother receives 1/6 share in the absence of mother and father.',
      ruleUr: 'والدہ اور والد کی غیر موجودگی میں دادی کا حصہ 1/6 ہے۔',
      quranRef: 'Hadith (Sunan Abi Dawud)',
      type: 'fard',
    });
  }

  // 6. Daughters (when NO sons exist)
  if (hasDaughtersOnly) {
    if (daughtersCount === 1) {
      fixedShares.push({
        key: 'daughters',
        count: 1,
        nameEn: 'Daughter (Beti)',
        nameUr: 'اکلوتی بیٹی',
        relationEn: 'Child',
        relationUr: 'بیٹی',
        num: 1,
        den: 2,
        ruleEn: 'Single daughter receives 1/2 fixed share when there are no sons (Surah An-Nisa 4:11).',
        ruleUr: 'بیٹا نہ ہونے کی صورت میں اکیلی بیٹی کا مقررہ حصہ 1/2 (نصف) ہے (سورۃ النساء 4:11)۔',
        quranRef: 'Surah An-Nisa (4:11)',
        type: 'fard',
      });
    } else {
      fixedShares.push({
        key: 'daughters',
        count: daughtersCount,
        nameEn: `Daughters (${daughtersCount} Betiyan)`,
        nameUr: `بیٹیاں (${daughtersCount})`,
        relationEn: 'Children',
        relationUr: 'بنات',
        num: 2,
        den: 3,
        ruleEn: `Two or more daughters share 2/3 equally (${formatFraction(2, 3 * daughtersCount)} each) when there are no sons (Surah An-Nisa 4:11).`,
        ruleUr: `بیٹا نہ ہونے کی صورت میں دو یا دو سے زائد بیٹیاں مشترکہ طور پر 2/3 حصہ برابر تقسیم کرتی ہیں (سورۃ النساء 4:11)۔`,
        quranRef: 'Surah An-Nisa (4:11)',
        type: 'fard',
      });
    }
  }

  // 7. Full Sisters (when no children, no father, no grandfather, and no full brothers)
  const isFullSisterAsabahWithDaughter =
    hasDaughtersOnly &&
    !hasSons &&
    !fatherAlive &&
    !effectiveGrandfather &&
    effectiveFullBrothers === 0 &&
    effectiveFullSisters > 0;

  if (
    !hasChildren &&
    !fatherAlive &&
    !effectiveGrandfather &&
    effectiveFullBrothers === 0 &&
    effectiveFullSisters > 0
  ) {
    if (effectiveFullSisters === 1) {
      fixedShares.push({
        key: 'fullSisters',
        count: 1,
        nameEn: 'Full Sister (Haqiqi Behn)',
        nameUr: 'حقیقی بہن',
        relationEn: 'Sibling',
        relationUr: 'حقیقی بہن',
        num: 1,
        den: 2,
        ruleEn: 'Single full sister receives 1/2 fixed share when no children, father, or brothers exist (Surah An-Nisa 4:176).',
        ruleUr: 'اولاد، باپ اور بھائی نہ ہونے پر اکیلی حقیقی بہن کا مقررہ حصہ 1/2 ہے (سورۃ النساء 4:176)۔',
        quranRef: 'Surah An-Nisa (4:176)',
        type: 'fard',
      });
    } else {
      fixedShares.push({
        key: 'fullSisters',
        count: effectiveFullSisters,
        nameEn: `Full Sisters (${effectiveFullSisters})`,
        nameUr: `حقیقی بہنیں (${effectiveFullSisters})`,
        relationEn: 'Siblings',
        relationUr: 'حقیقی بہنیں',
        num: 2,
        den: 3,
        ruleEn: 'Multiple full sisters share 2/3 equally when no children, father, or brothers exist (Surah An-Nisa 4:176).',
        ruleUr: 'اولاد، باپ اور بھائی نہ ہونے پر دو یا زائد حقیقی بہنیں 2/3 حصہ برابر تقسیم کرتی ہیں (سورۃ النساء 4:176)۔',
        quranRef: 'Surah An-Nisa (4:176)',
        type: 'fard',
      });
    }
  }

  // 8. Paternal Sisters (Takmilat al-Thuluthayn or 1/2 or 2/3)
  if (
    !hasChildren &&
    !fatherAlive &&
    !effectiveGrandfather &&
    effectiveFullBrothers === 0 &&
    effectivePaternalBrothers === 0 &&
    effectivePaternalSisters > 0
  ) {
    if (effectiveFullSisters === 1) {
      fixedShares.push({
        key: 'paternalSisters',
        count: effectivePaternalSisters,
        nameEn: `Paternal Sister(s) (${effectivePaternalSisters})`,
        nameUr: `علاتی بہنیں (${effectivePaternalSisters})`,
        relationEn: 'Paternal Sibling',
        relationUr: 'علاتی بہن',
        num: 1,
        den: 6,
        ruleEn: 'Paternal sister(s) receive 1/6 to complete two-thirds (Takmilat ath-Thuluthayn) alongside one full sister.',
        ruleUr: 'ایک حقیقی بہن کے ساتھ علاتی بہن کو تکمیل ثلثین (دو تہائی پورا کرنے) کے لیے 1/6 حصہ ملتا ہے۔',
        quranRef: 'Hanafi Jurisprudence (Takmilat al-Thuluthayn)',
        type: 'fard',
      });
    } else if (effectiveFullSisters === 0) {
      if (effectivePaternalSisters === 1) {
        fixedShares.push({
          key: 'paternalSisters',
          count: 1,
          nameEn: 'Paternal Sister (Allati Behn)',
          nameUr: 'علاتی بہن',
          relationEn: 'Paternal Sibling',
          relationUr: 'علاتی بہن',
          num: 1,
          den: 2,
          ruleEn: 'Single paternal sister receives 1/2 fixed share in absence of full siblings, father, and children.',
          ruleUr: 'حقیقی بہن بھائی، باپ اور اولاد نہ ہونے پر اکیلی علاتی بہن کا حصہ 1/2 ہے۔',
          quranRef: 'Surah An-Nisa (4:176)',
          type: 'fard',
        });
      } else {
        fixedShares.push({
          key: 'paternalSisters',
          count: effectivePaternalSisters,
          nameEn: `Paternal Sisters (${effectivePaternalSisters})`,
          nameUr: `علاتی بہنیں (${effectivePaternalSisters})`,
          relationEn: 'Paternal Siblings',
          relationUr: 'علاتی بہنیں',
          num: 2,
          den: 3,
          ruleEn: 'Multiple paternal sisters share 2/3 equally in absence of full siblings, father, and children.',
          ruleUr: 'حقیقی بہن بھائی، باپ اور اولاد نہ ہونے پر علاتی بہنیں 2/3 حصہ برابر تقسیم کرتی ہیں۔',
          quranRef: 'Surah An-Nisa (4:176)',
          type: 'fard',
        });
      }
    }
  }

  // 9. Maternal Siblings (Akhyafi)
  const totalMaternal = effectiveMaternalBrothers + effectiveMaternalSisters;
  if (totalMaternal > 0 && !isMaternalBlocked) {
    if (totalMaternal === 1) {
      const isBrother = effectiveMaternalBrothers === 1;
      fixedShares.push({
        key: 'maternalSibling',
        count: 1,
        nameEn: isBrother ? 'Maternal Brother (Akhyafi Bhai)' : 'Maternal Sister (Akhyafi Behn)',
        nameUr: isBrother ? 'اخیافی بھائی (ماں شریک)' : 'اخیافی بہن (ماں شریک)',
        relationEn: 'Maternal Sibling',
        relationUr: 'اخیافی بہن/بھائی',
        num: 1,
        den: 6,
        ruleEn: 'Single maternal sibling receives 1/6 share (Surah An-Nisa 4:12).',
        ruleUr: 'اکیلا اخیافی بہن یا بھائی 1/6 حصہ پاتا ہے (سورۃ النساء 4:12)۔',
        quranRef: 'Surah An-Nisa (4:12)',
        type: 'fard',
      });
    } else {
      fixedShares.push({
        key: 'maternalSiblings',
        count: totalMaternal,
        nameEn: `Maternal Siblings (${totalMaternal})`,
        nameUr: `اخیافی بہن بھائی (${totalMaternal})`,
        relationEn: 'Maternal Siblings',
        relationUr: 'اخیافی بہن بھائی',
        num: 1,
        den: 3,
        ruleEn: 'Multiple maternal siblings share 1/3 equally among male and female (Surah An-Nisa 4:12).',
        ruleUr: 'دو یا زائد اخیافی بہن بھائی مرد و عورت کی تمیز کے بغیر 1/3 حصہ برابر تقسیم کرتے ہیں (سورۃ النساء 4:12)۔',
        quranRef: 'Surah An-Nisa (4:12)',
        type: 'fard',
      });
    }
  }

  // --- Step 4: Calculate Common Denominator (Asl al-Mas'ala) & Sum of Fixed Shares ---
  let commonDen = 1;
  fixedShares.forEach((s) => {
    commonDen = lcm(commonDen, s.den);
  });

  let sumFixedNumerators = 0;
  fixedShares.forEach((s) => {
    s.scaledNum = s.num * (commonDen / s.den);
    sumFixedNumerators += s.scaledNum;
  });

  const sumFraction = sumFixedNumerators / commonDen;

  // --- Step 5: Check for Residuaries (Asabah) ---
  let residuaryGroup = null;

  // Priority 1: Sons & Daughters (Asabah bi-Ghayriha)
  if (hasSons) {
    const sonWeight = 2;
    const daughterWeight = 1;
    const totalWeights = sonsCount * sonWeight + daughtersCount * daughterWeight;
    residuaryGroup = {
      type: 'children_asabah',
      nameEn: daughtersCount > 0 ? 'Sons & Daughters' : `Sons (${sonsCount})`,
      nameUr: daughtersCount > 0 ? 'بیٹے اور بیٹیاں' : `بیٹے (${sonsCount})`,
      sonsCount,
      daughtersCount,
      totalWeights,
      ruleEn:
        daughtersCount > 0
          ? 'Children inherit remaining residue as Residuaries (Asabah bi-Ghayriha) with 2:1 son-to-daughter ratio (Surah An-Nisa 4:11).'
          : 'Son(s) inherit the entire remaining residue as primary agnatic heir(s) (Asabah bi-Nafsihi).',
      ruleUr:
        daughtersCount > 0
          ? 'بیٹے اور بیٹیاں باقی ترکہ بطور عصبہ بالغیر 2:1 کے تناسب سے پاتے ہیں (سورۃ النساء 4:11)۔'
          : 'بیٹے باقی تمام ترکہ بطور عصبہ بالنفس برابر تقسیم کرتے ہیں۔',
      quranRef: 'Surah An-Nisa (4:11)',
    };
  }
  // Priority 2: Father as pure Asabah (if no children) or for surplus
  else if (fatherAlive) {
    residuaryGroup = {
      type: 'father_asabah',
      nameEn: 'Father (Walid - Residue)',
      nameUr: 'والد (عصبہ / باقی ترکہ)',
      count: 1,
      ruleEn: hasDaughtersOnly
        ? 'Father takes all remaining residue as Asabah after fixed shares of daughters and spouse/mother.'
        : 'Father inherits all remaining residue as prime Asabah after spouse and mother fixed shares.',
      ruleUr: hasDaughtersOnly
        ? 'بیٹیوں اور دیگر کے مقررہ حصوں کے بعد باقی سارا ترکہ والد کو بطور عصبہ ملے گا۔'
        : 'شریک حیات اور والدہ کے مقررہ حصے کے بعد باقی تمام ترکہ والد بطور عصبہ بالنفس پاتے ہیں۔',
      quranRef: 'Hadith (Sahih Bukhari 6732)',
    };
  }
  // Priority 3: Grandfather as Asabah (if father dead & no sons)
  else if (effectiveGrandfather) {
    residuaryGroup = {
      type: 'grandfather_asabah',
      nameEn: 'Paternal Grandfather (Dada - Residue)',
      nameUr: 'دادا (عصبہ / باقی ترکہ)',
      count: 1,
      ruleEn: 'Grandfather takes remaining residue as Asabah replacing deceased father.',
      ruleUr: 'والد کی غیر موجودگی میں دادا باقی تمام ترکہ بطور عصبہ حاصل کرتے ہیں۔',
      quranRef: 'Hanafi Jurisprudence',
    };
  }
  // Priority 4: Full Brothers & Sisters (Asabah bi-Nafsihi or bi-Ghayriha)
  else if (effectiveFullBrothers > 0) {
    const totalWeights = effectiveFullBrothers * 2 + effectiveFullSisters * 1;
    residuaryGroup = {
      type: 'full_siblings_asabah',
      nameEn:
        effectiveFullSisters > 0
          ? 'Full Brothers & Sisters'
          : `Full Brothers (${effectiveFullBrothers})`,
      nameUr:
        effectiveFullSisters > 0
          ? 'حقیقی بھائی اور بہنیں'
          : `حقیقی بھائی (${effectiveFullBrothers})`,
      effectiveFullBrothers,
      effectiveFullSisters,
      totalWeights,
      ruleEn:
        effectiveFullSisters > 0
          ? 'Full siblings inherit residue together with 2:1 brother-to-sister ratio (Surah An-Nisa 4:176).'
          : 'Full brother(s) inherit remaining residue as Asabah bi-Nafsihi.',
      ruleUr:
        effectiveFullSisters > 0
          ? 'حقیقی بہن بھائی باقی ترکہ 2:1 کے تناسب سے تقسیم کرتے ہیں (سورۃ النساء 4:176)۔'
          : 'حقیقی بھائی باقی تمام ترکہ بطور عصبہ بالنفس پاتے ہیں۔',
      quranRef: 'Surah An-Nisa (4:176)',
    };
  }
  // Priority 5: Full Sisters as Asabah ma'a Ghayriha (with daughters)
  else if (isFullSisterAsabahWithDaughter) {
    residuaryGroup = {
      type: 'full_sisters_with_daughters_asabah',
      nameEn: `Full Sister(s) (${effectiveFullSisters} Asabah with Daughters)`,
      nameUr: `حقیقی بہنیں (${effectiveFullSisters} - مع الغیر عصبہ)`,
      count: effectiveFullSisters,
      ruleEn:
        'Full sisters inherit the remaining residue as Residuaries with daughters (Asabah ma`a Ghayriha) according to Hadith: "Make sisters with daughters residuaries".',
      ruleUr:
        'حدیث نبویؐ "اجْعَلُوا الأَخَوَاتِ مَعَ الْبَنَاتِ عَصَبَةً" کے تحت حقیقی بہنیں بیٹیوں کے ساتھ باقی ترکے کی عصبہ بنتی ہیں۔',
      quranRef: 'Hadith (Sahih Bukhari 6742)',
    };
  }
  // Priority 6: Paternal Brothers & Sisters
  else if (effectivePaternalBrothers > 0) {
    const totalWeights = effectivePaternalBrothers * 2 + effectivePaternalSisters * 1;
    residuaryGroup = {
      type: 'paternal_siblings_asabah',
      nameEn:
        effectivePaternalSisters > 0
          ? 'Paternal Brothers & Sisters'
          : `Paternal Brothers (${effectivePaternalBrothers})`,
      nameUr:
        effectivePaternalSisters > 0
          ? 'علاتی بھائی اور بہنیں'
          : `علاتی بھائی (${effectivePaternalBrothers})`,
      effectivePaternalBrothers,
      effectivePaternalSisters,
      totalWeights,
      ruleEn: 'Paternal siblings inherit residue with 2:1 ratio in absence of full siblings.',
      ruleUr: 'حقیقی بہن بھائیوں کی عدم موجودگی میں علاتی بہن بھائی 2:1 کے تناسب سے عصبہ بنتے ہیں۔',
      quranRef: 'Surah An-Nisa (4:176)',
    };
  }

  // --- Step 6: Case Classification: Awl, Standard Residue, or Radd ---
  let status = 'normal';
  const heirsList = [];

  // Case A: AWL (Deficit: Sum of fixed shares > 1)
  if (sumFraction > 1.000001) {
    status = 'awl';
    const originalBase = commonDen;
    const awlBase = sumFixedNumerators;

    auditSteps.push({
      title: 'عول (Awl - Proportional Reduction)',
      descEn: `The sum of Quranic fixed shares (${sumFixedNumerators}/${originalBase} = ${(sumFraction * 100).toFixed(2)}%) exceeds 100%. In accordance with Islamic jurisprudence established by Umar (R.A.) and consensus, the base denominator is increased from ${originalBase} to ${awlBase}. Each heir's portion is proportionally adjusted so that shares equal exactly 100%.`,
      descUr: `مقررہ حصوں کا مجموعہ (${sumFixedNumerators}/${originalBase} = ${(sumFraction * 100).toFixed(2)}%) 100 فیصد سے تجاوز کر گیا۔ اجماع صحابہ کے تحت اصل مسئلہ کو ${originalBase} سے بڑھا کر ${awlBase} کر دیا گیا، تاکہ تمام ورثاء کا حصہ تناسب کے ساتھ برقرار رہے اور کسی کی حق تلفی نہ ہو۔`,
    });

    fixedShares.forEach((s) => {
      const portionFraction = s.scaledNum / awlBase;
      const totalPkr = netEstate * portionFraction;
      const perIndividualPkr = s.count > 0 ? totalPkr / s.count : totalPkr;
      const perIndividualFraction = formatFraction(s.scaledNum, awlBase * s.count);

      heirsList.push({
        id: s.key,
        nameEn: s.nameEn,
        nameUr: s.nameUr,
        relationEn: s.relationEn,
        relationUr: s.relationUr,
        count: s.count,
        category: 'Quranic Fixed Sharer (Zawu al-Fara`id)',
        categoryUr: 'ذوی الفروض (مقررہ حصہ دار)',
        fractionFormatted: formatFraction(s.scaledNum, awlBase),
        rawFraction: portionFraction,
        percentage: (portionFraction * 100).toFixed(2),
        totalPkr: Math.round(totalPkr),
        perIndividualPkr: Math.round(perIndividualPkr),
        perIndividualFraction,
        perIndividualPercentage: ((portionFraction / s.count) * 100).toFixed(2),
        ruleEn: `${s.ruleEn} (Adjusted by Awl from ${s.num}/${s.den} to ${formatFraction(s.scaledNum, awlBase)})`,
        ruleUr: `${s.ruleUr} (عول کے تحت حصہ ${s.num}/${s.den} سے تبدیل ہو کر ${formatFraction(s.scaledNum, awlBase)} ہوا)`,
        quranRef: s.quranRef,
      });
    });
  }
  // Case B: Normal with Residue (Sum <= 1 and Residuary exists)
  else if (residuaryGroup !== null) {
    status = 'normal';
    const remainingFraction = Math.max(0, 1 - sumFraction);
    const remainingPkr = netEstate * remainingFraction;

    auditSteps.push({
      title: 'توزیع عصبہ (Residuary Distribution)',
      descEn: `Fixed shares total: ${sumFixedNumerators}/${commonDen} (${(sumFraction * 100).toFixed(2)}%). Remaining residue: ${formatFraction(Math.round(remainingFraction * commonDen), commonDen)} (${(remainingFraction * 100).toFixed(2)}% or Rs. ${Math.round(remainingPkr).toLocaleString()}) distributed to Residuaries (${residuaryGroup.nameEn}).`,
      descUr: `مقررہ حصوں کا مجموعہ: ${sumFixedNumerators}/${commonDen} (${(sumFraction * 100).toFixed(2)}%)۔ باقی ماندہ ترکہ: ${formatFraction(Math.round(remainingFraction * commonDen), commonDen)} (${(remainingFraction * 100).toFixed(2)}% یا ${Math.round(remainingPkr).toLocaleString()} روپے) بطور عصبہ (${residuaryGroup.nameUr}) کو دیا گیا۔`,
    });

    // Add fixed sharers
    fixedShares.forEach((s) => {
      const portionFraction = s.scaledNum / commonDen;
      const totalPkr = netEstate * portionFraction;
      const perIndividualPkr = s.count > 0 ? totalPkr / s.count : totalPkr;

      heirsList.push({
        id: s.key,
        nameEn: s.nameEn,
        nameUr: s.nameUr,
        relationEn: s.relationEn,
        relationUr: s.relationUr,
        count: s.count,
        category: 'Quranic Fixed Sharer (Zawu al-Fara`id)',
        categoryUr: 'ذوی الفروض (مقررہ حصہ دار)',
        fractionFormatted: formatFraction(s.num, s.den),
        rawFraction: portionFraction,
        percentage: (portionFraction * 100).toFixed(2),
        totalPkr: Math.round(totalPkr),
        perIndividualPkr: Math.round(perIndividualPkr),
        perIndividualFraction: formatFraction(s.num, s.den * s.count),
        perIndividualPercentage: ((portionFraction / s.count) * 100).toFixed(2),
        ruleEn: s.ruleEn,
        ruleUr: s.ruleUr,
        quranRef: s.quranRef,
      });
    });

    // Distribute residue according to residuary group
    if (residuaryGroup.type === 'children_asabah') {
      const { sonsCount, daughtersCount, totalWeights } = residuaryGroup;
      const singleUnitFraction = remainingFraction / totalWeights;

      if (sonsCount > 0) {
        const sonsTotalFraction = singleUnitFraction * 2 * sonsCount;
        const sonsTotalPkr = netEstate * sonsTotalFraction;
        const perSonPkr = sonsTotalPkr / sonsCount;
        const perSonFraction = singleUnitFraction * 2;

        heirsList.push({
          id: 'sons',
          nameEn: sonsCount === 1 ? 'Son (Beta)' : `Sons (${sonsCount})`,
          nameUr: sonsCount === 1 ? 'بیٹا' : `بیٹے (${sonsCount})`,
          relationEn: 'Child / Primary Heir',
          relationUr: 'فرزند / صلبی اولاد',
          count: sonsCount,
          category: 'Residuary (Asabah bi-Nafsihi / bi-Ghayrihi)',
          categoryUr: 'عصبہ بالنفس / بالغیر',
          fractionFormatted: formatFraction(Math.round(sonsTotalFraction * 100000), 100000),
          rawFraction: sonsTotalFraction,
          percentage: (sonsTotalFraction * 100).toFixed(2),
          totalPkr: Math.round(sonsTotalPkr),
          perIndividualPkr: Math.round(perSonPkr),
          perIndividualFraction: formatFraction(Math.round(perSonFraction * 100000), 100000),
          perIndividualPercentage: ((sonsTotalFraction / sonsCount) * 100).toFixed(2),
          ruleEn: residuaryGroup.ruleEn,
          ruleUr: residuaryGroup.ruleUr,
          quranRef: residuaryGroup.quranRef,
        });
      }

      if (daughtersCount > 0) {
        const daughtersTotalFraction = singleUnitFraction * 1 * daughtersCount;
        const daughtersTotalPkr = netEstate * daughtersTotalFraction;
        const perDaughterPkr = daughtersTotalPkr / daughtersCount;
        const perDaughterFraction = singleUnitFraction * 1;

        heirsList.push({
          id: 'daughters_asabah',
          nameEn: daughtersCount === 1 ? 'Daughter (Beti - with Son)' : `Daughters (${daughtersCount} - with Sons)`,
          nameUr: daughtersCount === 1 ? 'بیٹی (مع بیٹا)' : `بیٹیاں (${daughtersCount} - مع بیٹے)`,
          relationEn: 'Child',
          relationUr: 'بیٹی',
          count: daughtersCount,
          category: 'Residuary by Brother (Asabah bi-Ghayriha)',
          categoryUr: 'عصبہ بالغیر (بھائی کی وجہ سے)',
          fractionFormatted: formatFraction(Math.round(daughtersTotalFraction * 100000), 100000),
          rawFraction: daughtersTotalFraction,
          percentage: (daughtersTotalFraction * 100).toFixed(2),
          totalPkr: Math.round(daughtersTotalPkr),
          perIndividualPkr: Math.round(perDaughterPkr),
          perIndividualFraction: formatFraction(Math.round(perDaughterFraction * 100000), 100000),
          perIndividualPercentage: ((daughtersTotalFraction / daughtersCount) * 100).toFixed(2),
          ruleEn: 'Daughters inherit alongside brothers at half the brother share (Surah An-Nisa 4:11).',
          ruleUr: 'بیٹیاں بھائیوں کے ساتھ عصبہ بالغیر بن کر آدھا حصہ پاتی ہیں (سورۃ النساء 4:11)۔',
          quranRef: 'Surah An-Nisa (4:11)',
        });
      }
    } else if (residuaryGroup.type === 'father_asabah') {
      const fatherResiduePkr = remainingPkr;
      if (hasDaughtersOnly) {
        const fardEntry = heirsList.find((h) => h.id === 'father_fard');
        if (fardEntry) {
          const totalFatherFraction = fardEntry.rawFraction + remainingFraction;
          const totalFatherPkr = fardEntry.totalPkr + fatherResiduePkr;
          fardEntry.nameEn = 'Father (Walid - Fixed + Residue)';
          fardEntry.nameUr = 'والد (فرض + عصبہ)';
          fardEntry.fractionFormatted = formatFraction(
            Math.round(totalFatherFraction * commonDen),
            commonDen
          );
          fardEntry.rawFraction = totalFatherFraction;
          fardEntry.percentage = (totalFatherFraction * 100).toFixed(2);
          fardEntry.totalPkr = Math.round(totalFatherPkr);
          fardEntry.perIndividualPkr = Math.round(totalFatherPkr);
          fardEntry.ruleEn = `Father receives 1/6 fixed share (Rs. ${fardEntry.totalPkr.toLocaleString()}) PLUS remaining residue of Rs. ${Math.round(
            fatherResiduePkr
          ).toLocaleString()} as Asabah.`;
          fardEntry.ruleUr = `والد کو 1/6 مقررہ حصہ اور باقی ماندہ ${Math.round(
            fatherResiduePkr
          ).toLocaleString()} روپے بطور عصبہ ملے۔`;
        }
      } else {
        heirsList.push({
          id: 'father_pure_asabah',
          nameEn: 'Father (Walid)',
          nameUr: 'والد',
          relationEn: 'Parent',
          relationUr: 'والد',
          count: 1,
          category: 'Primary Residuary (Asabah bi-Nafsihi)',
          categoryUr: 'عصبہ بالنفس',
          fractionFormatted: formatFraction(Math.round(remainingFraction * commonDen), commonDen),
          rawFraction: remainingFraction,
          percentage: (remainingFraction * 100).toFixed(2),
          totalPkr: Math.round(remainingPkr),
          perIndividualPkr: Math.round(remainingPkr),
          perIndividualFraction: formatFraction(Math.round(remainingFraction * commonDen), commonDen),
          perIndividualPercentage: (remainingFraction * 100).toFixed(2),
          ruleEn: residuaryGroup.ruleEn,
          ruleUr: residuaryGroup.ruleUr,
          quranRef: residuaryGroup.quranRef,
        });
      }
    } else if (residuaryGroup.type === 'grandfather_asabah') {
      if (hasDaughtersOnly) {
        const fardEntry = heirsList.find((h) => h.id === 'grandfather_fard');
        if (fardEntry) {
          const totalFraction = fardEntry.rawFraction + remainingFraction;
          const totalPkr = fardEntry.totalPkr + remainingPkr;
          fardEntry.nameEn = 'Paternal Grandfather (Dada - Fixed + Residue)';
          fardEntry.nameUr = 'دادا (فرض + عصبہ)';
          fardEntry.fractionFormatted = formatFraction(
            Math.round(totalFraction * commonDen),
            commonDen
          );
          fardEntry.rawFraction = totalFraction;
          fardEntry.percentage = (totalFraction * 100).toFixed(2);
          fardEntry.totalPkr = Math.round(totalPkr);
          fardEntry.perIndividualPkr = Math.round(totalPkr);
        }
      } else {
        heirsList.push({
          id: 'grandfather_pure_asabah',
          nameEn: 'Paternal Grandfather (Dada)',
          nameUr: 'دادا',
          relationEn: 'Ascendant',
          relationUr: 'دادا',
          count: 1,
          category: 'Residuary (Asabah)',
          categoryUr: 'عصبہ',
          fractionFormatted: formatFraction(Math.round(remainingFraction * commonDen), commonDen),
          rawFraction: remainingFraction,
          percentage: (remainingFraction * 100).toFixed(2),
          totalPkr: Math.round(remainingPkr),
          perIndividualPkr: Math.round(remainingPkr),
          perIndividualFraction: formatFraction(Math.round(remainingFraction * commonDen), commonDen),
          perIndividualPercentage: (remainingFraction * 100).toFixed(2),
          ruleEn: residuaryGroup.ruleEn,
          ruleUr: residuaryGroup.ruleUr,
          quranRef: residuaryGroup.quranRef,
        });
      }
    } else if (residuaryGroup.type === 'full_siblings_asabah') {
      const { effectiveFullBrothers, effectiveFullSisters, totalWeights } = residuaryGroup;
      const singleUnitFraction = remainingFraction / totalWeights;

      if (effectiveFullBrothers > 0) {
        const broTotalFraction = singleUnitFraction * 2 * effectiveFullBrothers;
        const broTotalPkr = netEstate * broTotalFraction;
        heirsList.push({
          id: 'fullBrothers',
          nameEn:
            effectiveFullBrothers === 1 ? 'Full Brother (Haqiqi Bhai)' : `Full Brothers (${effectiveFullBrothers})`,
          nameUr:
            effectiveFullBrothers === 1 ? 'حقیقی بھائی' : `حقیقی بھائی (${effectiveFullBrothers})`,
          relationEn: 'Sibling',
          relationUr: 'حقیقی بھائی',
          count: effectiveFullBrothers,
          category: 'Residuary (Asabah bi-Nafsihi)',
          categoryUr: 'عصبہ بالنفس',
          fractionFormatted: formatFraction(Math.round(broTotalFraction * 100000), 100000),
          rawFraction: broTotalFraction,
          percentage: (broTotalFraction * 100).toFixed(2),
          totalPkr: Math.round(broTotalPkr),
          perIndividualPkr: Math.round(broTotalPkr / effectiveFullBrothers),
          perIndividualFraction: formatFraction(
            Math.round(singleUnitFraction * 2 * 100000),
            100000
          ),
          perIndividualPercentage: ((broTotalFraction / effectiveFullBrothers) * 100).toFixed(2),
          ruleEn: residuaryGroup.ruleEn,
          ruleUr: residuaryGroup.ruleUr,
          quranRef: residuaryGroup.quranRef,
        });
      }

      if (effectiveFullSisters > 0) {
        const sisTotalFraction = singleUnitFraction * 1 * effectiveFullSisters;
        const sisTotalPkr = netEstate * sisTotalFraction;
        heirsList.push({
          id: 'fullSisters_asabah',
          nameEn:
            effectiveFullSisters === 1 ? 'Full Sister (Haqiqi Behn - with Brother)' : `Full Sisters (${effectiveFullSisters})`,
          nameUr:
            effectiveFullSisters === 1 ? 'حقیقی بہن (مع بھائی)' : `حقیقی بہنیں (${effectiveFullSisters})`,
          relationEn: 'Sibling',
          relationUr: 'حقیقی بہن',
          count: effectiveFullSisters,
          category: 'Residuary by Brother (Asabah bi-Ghayriha)',
          categoryUr: 'عصبہ بالغیر',
          fractionFormatted: formatFraction(Math.round(sisTotalFraction * 100000), 100000),
          rawFraction: sisTotalFraction,
          percentage: (sisTotalFraction * 100).toFixed(2),
          totalPkr: Math.round(sisTotalPkr),
          perIndividualPkr: Math.round(sisTotalPkr / effectiveFullSisters),
          perIndividualFraction: formatFraction(
            Math.round(singleUnitFraction * 1 * 100000),
            100000
          ),
          perIndividualPercentage: ((sisTotalFraction / effectiveFullSisters) * 100).toFixed(2),
          ruleEn: 'Sisters inherit as residuaries with brothers at 2:1 ratio (Surah An-Nisa 4:176).',
          ruleUr: 'بہنیں بھائیوں کے ساتھ 2:1 کے تناسب سے عصبہ بنتی ہیں (سورۃ النساء 4:176)۔',
          quranRef: 'Surah An-Nisa (4:176)',
        });
      }
    } else if (residuaryGroup.type === 'full_sisters_with_daughters_asabah') {
      const sisTotalFraction = remainingFraction;
      const sisTotalPkr = remainingPkr;
      heirsList.push({
        id: 'fullSisters_with_daughters',
        nameEn:
          residuaryGroup.count === 1
            ? 'Full Sister (Haqiqi Behn - Asabah ma`a Ghayriha)'
            : `Full Sisters (${residuaryGroup.count})`,
        nameUr:
          residuaryGroup.count === 1
            ? 'حقیقی بہن (عصبہ مع الغیر)'
            : `حقیقی بہنیں (${residuaryGroup.count})`,
        relationEn: 'Sibling',
        relationUr: 'حقیقی بہن',
        count: residuaryGroup.count,
        category: 'Residuary with Daughters (Asabah ma`a Ghayriha)',
        categoryUr: 'عصبہ مع الغیر',
        fractionFormatted: formatFraction(Math.round(sisTotalFraction * 100000), 100000),
        rawFraction: sisTotalFraction,
        percentage: (sisTotalFraction * 100).toFixed(2),
        totalPkr: Math.round(sisTotalPkr),
        perIndividualPkr: Math.round(sisTotalPkr / residuaryGroup.count),
        perIndividualFraction: formatFraction(
          Math.round((sisTotalFraction / residuaryGroup.count) * 100000),
          100000
        ),
        perIndividualPercentage: ((sisTotalFraction / residuaryGroup.count) * 100).toFixed(2),
        ruleEn: residuaryGroup.ruleEn,
        ruleUr: residuaryGroup.ruleUr,
        quranRef: residuaryGroup.quranRef,
      });
    } else if (residuaryGroup.type === 'paternal_siblings_asabah') {
      const { effectivePaternalBrothers, effectivePaternalSisters, totalWeights } = residuaryGroup;
      const singleUnitFraction = remainingFraction / totalWeights;

      if (effectivePaternalBrothers > 0) {
        const broTotalFraction = singleUnitFraction * 2 * effectivePaternalBrothers;
        const broTotalPkr = netEstate * broTotalFraction;
        heirsList.push({
          id: 'paternalBrothers',
          nameEn:
            effectivePaternalBrothers === 1 ? 'Paternal Brother' : `Paternal Brothers (${effectivePaternalBrothers})`,
          nameUr:
            effectivePaternalBrothers === 1 ? 'علاتی بھائی' : `علاتی بھائی (${effectivePaternalBrothers})`,
          relationEn: 'Paternal Sibling',
          relationUr: 'علاتی بھائی',
          count: effectivePaternalBrothers,
          category: 'Residuary (Asabah)',
          categoryUr: 'عصبہ',
          fractionFormatted: formatFraction(Math.round(broTotalFraction * 100000), 100000),
          rawFraction: broTotalFraction,
          percentage: (broTotalFraction * 100).toFixed(2),
          totalPkr: Math.round(broTotalPkr),
          perIndividualPkr: Math.round(broTotalPkr / effectivePaternalBrothers),
          perIndividualFraction: formatFraction(
            Math.round(singleUnitFraction * 2 * 100000),
            100000
          ),
          perIndividualPercentage: ((broTotalFraction / effectivePaternalBrothers) * 100).toFixed(2),
          ruleEn: residuaryGroup.ruleEn,
          ruleUr: residuaryGroup.ruleUr,
          quranRef: residuaryGroup.quranRef,
        });
      }

      if (effectivePaternalSisters > 0) {
        const sisTotalFraction = singleUnitFraction * 1 * effectivePaternalSisters;
        const sisTotalPkr = netEstate * sisTotalFraction;
        heirsList.push({
          id: 'paternalSisters_asabah',
          nameEn:
            effectivePaternalSisters === 1 ? 'Paternal Sister' : `Paternal Sisters (${effectivePaternalSisters})`,
          nameUr:
            effectivePaternalSisters === 1 ? 'علاتی بہن' : `علاتی بہنیں (${effectivePaternalSisters})`,
          relationEn: 'Paternal Sibling',
          relationUr: 'علاتی بہن',
          count: effectivePaternalSisters,
          category: 'Residuary (Asabah)',
          categoryUr: 'عصبہ',
          fractionFormatted: formatFraction(Math.round(sisTotalFraction * 100000), 100000),
          rawFraction: sisTotalFraction,
          percentage: (sisTotalFraction * 100).toFixed(2),
          totalPkr: Math.round(sisTotalPkr),
          perIndividualPkr: Math.round(sisTotalPkr / effectivePaternalSisters),
          perIndividualFraction: formatFraction(
            Math.round(singleUnitFraction * 1 * 100000),
            100000
          ),
          perIndividualPercentage: ((sisTotalFraction / effectivePaternalSisters) * 100).toFixed(2),
          ruleEn: 'Paternal sisters inherit as residuaries with paternal brothers at 2:1 ratio.',
          ruleUr: 'علاتی بہنیں علاتی بھائیوں کے ساتھ 2:1 کے تناسب سے عصبہ بنتی ہیں۔',
          quranRef: 'Surah An-Nisa (4:176)',
        });
      }
    }
  }
  // Case C: RADD (Surplus Return: Sum of fixed shares < 1 and NO Residuaries exist)
  else {
    status = 'radd';
    const spouseShare = fixedShares.find((s) => s.key === 'wife' || s.key === 'husband');
    const nonSpouseShares = fixedShares.filter((s) => s.key !== 'wife' && s.key !== 'husband');

    if (spouseShare && nonSpouseShares.length > 0) {
      const spousePortion = spouseShare.num / spouseShare.den;
      const spousePkr = netEstate * spousePortion;
      heirsList.push({
        id: spouseShare.key,
        nameEn: spouseShare.nameEn,
        nameUr: spouseShare.nameUr,
        relationEn: spouseShare.relationEn,
        relationUr: spouseShare.relationUr,
        count: spouseShare.count,
        category: 'Quranic Fixed Sharer (Zawu al-Fara`id)',
        categoryUr: 'ذوی الفروض (مقررہ حصہ دار)',
        fractionFormatted: formatFraction(spouseShare.num, spouseShare.den),
        rawFraction: spousePortion,
        percentage: (spousePortion * 100).toFixed(2),
        totalPkr: Math.round(spousePkr),
        perIndividualPkr: Math.round(spousePkr / spouseShare.count),
        perIndividualFraction: formatFraction(spouseShare.num, spouseShare.den * spouseShare.count),
        perIndividualPercentage: ((spousePortion / spouseShare.count) * 100).toFixed(2),
        ruleEn: `${spouseShare.ruleEn} (Spouse receives fixed share; surplus is returned to non-spouse sharers by Radd).`,
        ruleUr: `${spouseShare.ruleUr} (شریکِ حیات کو مقررہ حصہ ملتا ہے جبکہ باقی بچ جانے والا ترکہ دیگر ورثاء پر رد کیا جاتا ہے)۔`,
        quranRef: spouseShare.quranRef,
      });

      const remainderForRadd = 1 - spousePortion;
      let nonSpouseSumNum = 0;
      let nonSpouseLcm = 1;
      nonSpouseShares.forEach((s) => {
        nonSpouseLcm = lcm(nonSpouseLcm, s.den);
      });
      nonSpouseShares.forEach((s) => {
        nonSpouseSumNum += s.num * (nonSpouseLcm / s.den);
      });

      auditSteps.push({
        title: 'رد مع شریکِ حیات (Radd with Spouse)',
        descEn: `No residuary heir exists. Spouse receives fixed share (${spouseShare.num}/${spouseShare.den}). The remaining ${formatFraction(
          Math.round(remainderForRadd * spouseShare.den),
          spouseShare.den
        )} is returned proportionally via Radd (رد) among remaining sharers according to Hanafi law and Pakistani courts.`,
        descUr: `کوئی عصبہ موجود نہیں ہے۔ شریک حیات کو مقررہ حصہ (${spouseShare.num}/${spouseShare.den}) دیا گیا، اور باقی ماندہ ترکہ دیگر ورثاء میں رد کے اصول کے تحت تقسیم کیا گیا۔`,
      });

      nonSpouseShares.forEach((s) => {
        const weightInNonSpouse = (s.num * (nonSpouseLcm / s.den)) / nonSpouseSumNum;
        const finalPortion = remainderForRadd * weightInNonSpouse;
        const totalPkr = netEstate * finalPortion;
        const perIndividualPkr = totalPkr / s.count;

        heirsList.push({
          id: s.key,
          nameEn: s.nameEn,
          nameUr: s.nameUr,
          relationEn: s.relationEn,
          relationUr: s.relationUr,
          count: s.count,
          category: 'Fixed Sharer + Radd (فرض مع الرد)',
          categoryUr: 'فرض مع الرد',
          fractionFormatted: formatFraction(Math.round(finalPortion * 100000), 100000),
          rawFraction: finalPortion,
          percentage: (finalPortion * 100).toFixed(2),
          totalPkr: Math.round(totalPkr),
          perIndividualPkr: Math.round(perIndividualPkr),
          perIndividualFraction: formatFraction(
            Math.round((finalPortion / s.count) * 100000),
            100000
          ),
          perIndividualPercentage: ((finalPortion / s.count) * 100).toFixed(2),
          ruleEn: `${s.ruleEn} (Increased from original share via Radd return).`,
          ruleUr: `${s.ruleUr} (رد کے اصول کے تحت حصہ بڑھایا گیا)۔`,
          quranRef: s.quranRef,
        });
      });
    } else {
      auditSteps.push({
        title: 'رد (Radd - Proportional Surplus Redistribution)',
        descEn: `Total fixed shares equal ${sumFixedNumerators}/${commonDen} (${(sumFraction * 100).toFixed(2)}%) and no residuary heir exists. In classical Hanafi jurisprudence, the remaining surplus is returned proportionally to all Quranic sharers so they receive 100% of the estate.`,
        descUr: `مقررہ حصوں کا مجموعہ ${sumFixedNumerators}/${commonDen} (${(sumFraction * 100).toFixed(2)}%) ہے اور کوئی عصبہ موجود نہیں ہے۔ رد کے تحت تمام ورثاء میں ان کے مقررہ حصوں کے تناسب سے 100 فیصد ترکہ تقسیم کیا گیا۔`,
      });

      fixedShares.forEach((s) => {
        const portionFraction = s.scaledNum / sumFixedNumerators;
        const totalPkr = netEstate * portionFraction;
        const perIndividualPkr = totalPkr / s.count;

        heirsList.push({
          id: s.key,
          nameEn: s.nameEn,
          nameUr: s.nameUr,
          relationEn: s.relationEn,
          relationUr: s.relationUr,
          count: s.count,
          category: 'Fixed Sharer + Radd (فرض مع الرد)',
          categoryUr: 'فرض مع الرد',
          fractionFormatted: formatFraction(s.scaledNum, sumFixedNumerators),
          rawFraction: portionFraction,
          percentage: (portionFraction * 100).toFixed(2),
          totalPkr: Math.round(totalPkr),
          perIndividualPkr: Math.round(perIndividualPkr),
          perIndividualFraction: formatFraction(s.scaledNum, sumFixedNumerators * s.count),
          perIndividualPercentage: ((portionFraction / s.count) * 100).toFixed(2),
          ruleEn: `${s.ruleEn} (Increased via Radd return).`,
          ruleUr: `${s.ruleUr} (رد کے اصول کے تحت حصہ بڑھایا گیا)۔`,
          quranRef: s.quranRef,
        });
      });
    }
  }

  const totalHeirsCount = heirsList.reduce((acc, h) => acc + (h.count || 1), 0);

  return {
    netEstate,
    grossEstate: validGross,
    funeralExpenses: validFuneral,
    debts: validDebts,
    wasiyyah: validWasiyyah,
    status,
    totalHeirsCount,
    heirsList,
    blockedHeirs,
    auditSteps,
  };
}
