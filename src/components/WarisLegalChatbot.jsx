import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Scale,
  Maximize2,
  Minimize2,
  RefreshCcw,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Settings,
  Key,
  ExternalLink,
} from 'lucide-react';
import { formatPKR } from '../utils/inheritanceCalculator';

// Comprehensive Internal Legal Knowledge Base & Sharia Engine
function getInstantLegalResponse(query, results, formData, lang) {
  const q = query.toLowerCase().trim();
  const isUr = lang === 'ur';

  // 1. Shia / Ja'fari Fiqh Inheritance (فقہ جعفریہ)
  if (
    q.includes('shia') ||
    q.includes('jafari') ||
    q.includes("ja'fari") ||
    q.includes('shiah') ||
    q.includes('شیعہ') ||
    q.includes('جعفریہ') ||
    q.includes('اہل تشیع')
  ) {
    if (isUr) {
      return `🏛️ **فقہ جعفریہ (Shia Law of Inheritance) کے بنیادی اصول:**\n\n1. **ورثاء کے 3 طبقات (Classes):**\n   • **طبقہ اول:** والدین اور اولاد (اور اولاد نہ ہونے کی صورت میں پوتے پوتیاں)۔\n   • **طبقہ دوم:** دادا دادی، نانا نانی، اور تمام بھائی بہن۔\n   • **طبقہ سوم:** چچا، پھوپھی، ماموں، خالہ اور ان کی اولاد۔\n\n2. **قربت کا اصول (نزدیکی رشتہ دار کی ترجیح):** طبقہ اول کا ایک بھی وارث (مثلاً صرف ایک بیٹی) موجود ہو تو وہ طبقہ دوم اور سوم (بھائی، چچا وغیرہ) کو مکمل طور پر وراثت سے خارج کر دیتی ہے۔\n\n3. **عول اور عصبہ کا فرق:** فقہ جعفریہ میں روایتی سنی عصبہ (Residuary) اور عول (Awl) تسلیم نہیں کیا جاتا۔ اگر بیٹی اکیلی ہو تو بقیہ تمام ترکہ بھی 'رد' کے ذریعے اسی کو ملتا ہے۔\n\n4. **بیوہ کا حصہ:** اولاد ہونے پر 1/8 اور نہ ہونے پر 1/4۔ روایتی فقہ میں بے اولاد بیوہ منقولہ جائیداد اور عمارت کی قیمت سے حصہ پاتی ہے، اصل زرعی زمین سے نہیں۔`;
    } else {
      return `🏛️ **Shia (Ja'fari) Inheritance Jurisprudence Explained:**\n\n1. **Three Hierarchical Classes of Heirs:**\n   • **Class I:** Parents and direct Children (and grandchildren if children are predeceased).\n   • **Class II:** Grandparents (all) and Siblings (and their descendants).\n   • **Class III:** Paternal & Maternal Uncles and Aunts (and their descendants).\n\n2. **Rule of Proximate Exclusion:** Any surviving heir in Class I **completely excludes all heirs in Classes II and III**. For instance, a single daughter inherits the entire estate (her fixed share + remainder via Radd) and **completely blocks the deceased's brothers and paternal uncles** (unlike Sunni law where brothers inherit as Asaba).\n\n3. **Rejection of Sunni Awl & Asaba:** Shia jurisprudence does not recognize the classical Sunni residuary doctrine (Asabah) for distant agnatic relatives when immediate descendants exist.\n\n4. **Widow’s Share:** Receives 1/8 (with children) or 1/4 (without children). Under classical Ja'fari rules, a childless widow inherits from movable property and the valuation of buildings/trees, but not the physical corpus of agricultural land.`;
    }
  }

  // 2. Current Active Case / Calculation details
  if (
    q.includes('my case') ||
    q.includes('my calculation') ||
    q.includes('my share') ||
    q.includes('who gets what') ||
    q.includes('breakdown') ||
    q.includes('میرے کیس') ||
    q.includes('حصہ') ||
    q.includes('تقسیم') ||
    q.includes('حساب')
  ) {
    if (results && results.heirsList && results.heirsList.length > 0) {
      if (isUr) {
        return `📊 **آپ کے موجودہ کیس کا مکمل خلاصہ:**\n\n• **کل خالص ترکہ:** ${formatPKR(results.netEstate)}\n• **حیثیت:** ${results.status === 'awl' ? 'عول (کمی کا تناسب)' : results.status === 'radd' ? 'رد (اضافی رقم کی واپسی)' : 'عام تقسیم (عادل)'}\n\n**ورثاء کے حصے:**\n${results.heirsList
          .map(
            (h) =>
              `• **${h.nameUr || h.nameEn}:** ${h.fractionFormatted} (${h.percentage.toFixed(2)}%) — ${formatPKR(h.shareAmount)}`
          )
          .join('\n')}\n\nتمام حصے قرآنی آیات اور پاکستانی جانشینی قوانین کے مطابق حساب کیے گئے ہیں۔`;
      } else {
        return `📊 **Active Estate Calculation Summary:**\n\n• **Net Distributable Estate:** ${formatPKR(results.netEstate)}\n• **Distribution Status:** ${results.status.toUpperCase()} (${results.statusDescriptionEn || 'Standard Division'})\n\n**Heirs & Shares Breakdown:**\n${results.heirsList
          .map(
            (h) =>
              `• **${h.nameEn} (${h.nameUr}):** ${h.fractionFormatted} (${h.percentage.toFixed(2)}%) — ${formatPKR(h.shareAmount)}`
          )
          .join('\n')}\n\nAll shares are calculated in accordance with Quranic Fara'iz principles and Pakistani succession regulations.`;
      }
    } else {
      return isUr
        ? 'براہ کرم پہلے بائیں جانب موجود فارم میں فیملی کے افراد اور جائیداد کی مالیت درج فرمائیں تاکہ میں آپ کے کیس کا مکمل تجزیہ فراہم کر سکوں۔'
        : 'Please enter your family members and estate assets in the calculator first, and I will provide a detailed legal breakdown of your specific case.';
    }
  }

  // 3. Aaq-Nama / Disowning child (عاق نامہ)
  if (
    q.includes('aaq') ||
    q.includes('disown') ||
    q.includes('newspaper') ||
    q.includes('عاق') ||
    q.includes('لاوارث') ||
    q.includes('بے دخل')
  ) {
    if (isUr) {
      return `⚖️ **عاق نامہ اور قانونی حیثیت (پاکستانی قانون و شریعت):**\n\n1. **کوئی قانونی حیثیت نہیں:** اخبار میں اشتہار دے کر یا اسٹامپ پیپر پر عاق نامہ لکھوانے سے کسی جائز وارث (بیٹا، بیٹی وغیرہ) کو وراثت سے محروم نہیں کیا جا سکتا۔\n2. **سپریم کورٹ آف پاکستان کا فیصلہ:** سپریم کورٹ کے متفقہ فیصلوں کے مطابق والدین کو اپنی زندگی کے بعد متروکہ جائیداد میں سے کسی شرعی وارث کو بے دخل کرنے کا کوئی اختیار حاصل نہیں۔\n3. **شریعت کا حکم:** وراثت کے احکام اللہ تعالیٰ کے مقرر کردہ ہیں (فرائض)، انسان اپنی مرضی سے کسی کو محروم نہیں کر سکتا۔`;
    } else {
      return `⚖️ **Legal Validity of 'Aaq-Nama' (Disowning an Heir):**\n\n1. **Zero Legal Effect:** Under both Islamic Law (Sharia) and Pakistani Civil Law, a father/mother **cannot** disinherit their legitimate children through newspaper notices, affidavits, or 'Aaq-Nama'.\n2. **Supreme Court Precedent:** The Supreme Court of Pakistan has repeatedly ruled that a parent has no legal power to deprive legal heirs of their Allah-ordained shares (Fara'iz).\n3. **Upon Death:** When the individual passes away, all biological and legal heirs receive their designated shares automatically regardless of any prior disownment declaration.`;
    }
  }

  // 4. Section 498-A PPC / Female Inheritance Deprivation (خواتین کے حقوق)
  if (
    q.includes('498') ||
    q.includes('female') ||
    q.includes('women') ||
    q.includes('sister') ||
    q.includes('daughter') ||
    q.includes('محروم') ||
    q.includes('بہن') ||
    q.includes('عورت') ||
    q.includes('حقوق نسواں')
  ) {
    if (isUr) {
      return `🛡️ **دفعہ 498-اے مجموعہ ضابطہ تعزیرات پاکستان (PPC):**\n\n• **سنگین جرم:** کسی بھی خاتون (ماں، بہن، بیٹی، بیوہ) کو دھوکے، دباؤ یا حیلے بہانے سے وراثت سے محروم کرنا سنگین قابل دست اندازی پولیس جرم ہے۔\n• **سزا:** **5 سے 10 سال قید بامشقت** اور **10 لاکھ روپے تک جرمانہ**۔\n• **کوئی دستبرداری تسلیم نہیں:** سپریم کورٹ کے حکم کے مطابق زبانی یا دباؤ کے تحت لیے گئے دستبرداری نامے (Relinquishment deeds) کالعدم تصور ہوتے ہیں۔`;
    } else {
      return `🛡️ **Section 498-A Pakistan Penal Code (Protection of Women's Inheritance):**\n\n• **Criminal Offense:** Depriving any female heir (widow, daughter, sister, mother) of her lawful inheritance through deceit, coercion, or fraud is a non-bailable criminal offense.\n• **Penalties:** Mandatory **5 to 10 years rigorous imprisonment** and a fine of up to **PKR 1,000,000**.\n• **Supreme Court Rulings:** The Supreme Court has ruled that 'relinquishment' of shares by sisters/daughters without consideration is presumed coercive and void in law.`;
    }
  }

  // 5. NADRA Succession Certificate (نادرا جانشینی سرٹیفکیٹ)
  if (
    q.includes('nadra') ||
    q.includes('succession certificate') ||
    q.includes('letter of administration') ||
    q.includes('نادرا') ||
    q.includes('سرٹیفکیٹ') ||
    q.includes('جانشینی')
  ) {
    if (isUr) {
      return `📜 **نادرا جانشینی سرٹیفکیٹ حاصل کرنے کا 5 مرحلہ وار طریقہ:**\n\n1. **درخواست:** کوئی بھی ایک وارث نادرا رجسٹریشن سینٹر یا جانشینی سہولت کاؤنٹر پر متوفی کا شناختی کارڈ اور ڈیتھ سرٹیفکیٹ لے کر جائے۔\n2. **فیملی ٹری:** نادرا ڈیٹا بیس سے تمام قانونی ورثاء کی تصدیق کی جاتی ہے۔\n3. **عوامی اشتہار:** نادرا 14 دن کے لیے 2 قومی اخبارات میں اشتہار جاری کرتا ہے۔\n4. **بائیو میٹرک تصدیق:** تمام ورثاء نادرا سینٹر جا کر یا بیرون ملک مقیم ورثاء موبائل ایپ کے ذریعے انگوٹھے کے نشان کی تصدیق کرتے ہیں۔\n5. **اجراء:** 15 سے 20 دنوں کے اندر سرٹیفکیٹ جاری کر دیا جاتا ہے۔`;
    } else {
      return `📜 **NADRA Digital Succession Certificate (5 Simple Steps):**\n\n1. **Application:** Any single heir visits a NADRA Succession Facilitation Center with the deceased's CNIC and official Union Council Death Certificate.\n2. **Family Tree Verification:** NADRA generates the FRC (Family Registration Certificate) identifying all legal heirs.\n3. **Public Notice:** A 14-day mandatory public notice is published in 2 major national newspapers.\n4. **Biometric Verification:** All heirs verify biometrics in-person or via NADRA's overseas digital verification portal.\n5. **Issuance:** Digital tamper-proof Succession Certificate & Letter of Administration is issued within **15 business days**.`;
    }
  }

  // 6. Predeceased Child / Orphaned Grandchild (یتیم پوتا پوتی)
  if (
    q.includes('grandchild') ||
    q.includes('orphaned') ||
    q.includes('predeceased') ||
    q.includes('section 4') ||
    q.includes('mflo') ||
    q.includes('پوتا') ||
    q.includes('پوتی') ||
    q.includes('یتیم')
  ) {
    if (isUr) {
      return `🏛️ **یتیم پوتے/پوتی کا حق وراثت (پاکستانی قانون بمقابلہ روایتی فقہ):**\n\n• **پاکستانی قانون (دفعہ 4، مسلم فیملی لاز آرڈیننس 1961):** اگر متوفی کی زندگی میں اس کا کوئی بیٹا یا بیٹی وفات پا چکے ہوں، تو ان کے بچے (یتیم پوتا/پوتی/نواسا/نواسی) اپنے متوفی والدین کا مکمل حصہ حاصل کرتے ہیں۔\n• **روایتی فقہ (حجَبِ حرمان):** کلاسیکی فقہ میں زندہ بیٹا ہونے کی صورت میں پوتا محروم ہو جاتا ہے، جس کی تلافی کے لیے دادا پر 1/3 حصے تک وصیت واجب کی جاتی ہے۔\n• **وارث ایپ کی خصوصیت:** وارث ایپ دونوں قوانین (پاکستانی قانون اور روایتی فقہ) کے مابین تقابلی جائزہ فراہم کرتی ہے۔`;
    } else {
      return `🏛️ **Orphaned Grandchildren & Section 4 MFLO 1961:**\n\n• **Pakistani Statutory Law (Section 4, Muslim Family Laws Ordinance 1961):** If a child dies before the deceased grandparent, that deceased child's children (grandchildren) step into the shoes of their parent and inherit the exact share their parent would have received.\n• **Classical Fiqh Perspective:** Under classical Hanafi jurisprudence, a living son completely blocks (Hajb Hirman) grandchildren, where scholars recommend the grandfather leave an obligatory bequest (Wasiyyah Wajibah) up to 1/3rd.\n• **Waris App Support:** Our engine calculates both legal tracks so you have complete statutory and Sharia clarity.`;
    }
  }

  // 7. Wasiyyah / Will Limits (وصیت کی شرعی حد)
  if (
    q.includes('wasiyyah') ||
    q.includes('will') ||
    q.includes('bequest') ||
    q.includes('one third') ||
    q.includes('1/3') ||
    q.includes('وصیت')
  ) {
    if (isUr) {
      return `📑 **اسلام میں وصیت (Wasiyyah) کے بنیادی اصول:**\n\n1. **زیادہ سے زیادہ 1/3 حصہ:** کوئی بھی شخص اپنے خالص ترکے کے ایک تہائی (1/3rd) سے زیادہ وصیت نہیں کر سکتا۔\n2. **وارث کے حق میں وصیت نہیں:** حدیث نبوی ﷺ کے مطابق *"وارث کے لیے کوئی وصیت نہیں"* (لا وصية لوارث)۔ یعنی جن کا حصہ قرآن میں مقرر ہے، ان کے لیے الگ سے وصیت باقی ورثاء کی متفقہ اجازت کے بغیر نافذ نہیں ہو سکتی۔\n3. **وصیت کی ادائیگی:** وصیت ترکے کی تقسیم سے پہلے اور قرض کی ادائیگی کے بعد نافذ کی جاتی ہے۔`;
    } else {
      return `📑 **Islamic Testamentary Will (Wasiyyah) Rules:**\n\n1. **Maximum 1/3rd Limit:** A Muslim cannot bequeath more than **one-third (33.3%)** of their net estate to non-heirs or charities.\n2. **No Will for an Existing Heir:** According to the Hadith: *"There is no bequest for an heir"* (La Wasiyyata li-Warith). An existing Quranic heir cannot receive an extra bequest unless all other heirs consent after the testator's demise.\n3. **Order of Execution:** Bequests (Wasiyyah) are deducted **after** funeral expenses and debts are cleared, but **before** the remaining estate is distributed to the heirs.`;
    }
  }

  // 8. Debts & Funeral Priority (قرض اور تجہیز و تکفین)
  if (
    q.includes('debt') ||
    q.includes('funeral') ||
    q.includes('priority') ||
    q.includes('mehr') ||
    q.includes('مہر') ||
    q.includes('قرض') ||
    q.includes('جنازہ') ||
    q.includes('کفن')
  ) {
    if (isUr) {
      return `⚖️ **ترکے سے ادائیگیوں کی شرعی ترتیب (ترجیحات):**\n\n1. **تجہیز و تکفین:** کفن دفن کے جائز اخراجات سب سے پہلے ادا کیے جائیں گے۔\n2. **قرض کی ادائیگی (دیون):** متوفی کے تمام مالی قرضے اور بیوہ کا غیر ادا شدہ حق مہر (Mehr-e-Muwajjal) فوراً ادا کیا جائے گا۔\n3. **جائز وصیت:** اگر کوئی وصیت ہو تو بقیہ رقم کے 1/3rd تک نافذ ہوگی۔\n4. **تقسیم ترکہ:** بقیہ خالص رقم تمام شرعی ورثاء میں تقسیم کی جائے گی۔`;
    } else {
      return `⚖️ **Priority of Deductions from the Estate (Tarikah):**\n\n1. **Funeral & Burial (Tajheez-o-Takfeen):** Reasonable burial expenses without extravagance.\n2. **Debts & Unpaid Dower (Dayn & Mahr):** All financial debts owed to people, financial institutions, and the widow's unpaid prompt/deferred Mahr.\n3. **Valid Bequests (Wasiyyah):** Up to 1/3rd of the remaining estate.\n4. **Distribution of Tarikah:** The remaining net estate is partitioned among the designated Quranic & residuary heirs.`;
    }
  }

  // 9. Land Mutation / Patwari / PLRA (زمین کا انتقال / اراضی ریکارڈ سینٹر)
  if (
    q.includes('land') ||
    q.includes('mutation') ||
    q.includes('intiqal') ||
    q.includes('plra') ||
    q.includes('patwari') ||
    q.includes('زمین') ||
    q.includes('انتقال') ||
    q.includes('پٹواری') ||
    q.includes('اراضی')
  ) {
    if (isUr) {
      return `🏡 **زرعی و رہائشی اراضی کا انتقالِ وراثت (Intiqal-e-Wirasat):**\n\n1. **لازمی دستاویزات:** نادرا جانشینی سرٹیفکیٹ یا سول کورٹ کی ڈگری، ڈیتھ سرٹیفکیٹ، اور اراضی کی فرد ملکیت۔\n2. **اراضی ریکارڈ سینٹر (PLRA / Zameen):** متعلقہ تحصیل کے اراضی سینٹر جا کر وراثت کے انتقال کی درخواست جمع کروائیں۔\n3. **تمام ورثاء کا اندراج:** ریونیو قوانین کے تحت پٹواری/ریونیو آفیسر تمام قانونی ورثاء کے ناموں پر فرد ملکیت جاری کرنے کا پابند ہے۔ کسی ایک وارث کے نام پر پوری جائیداد منتقل نہیں ہو سکتی۔`;
    } else {
      return `🏡 **Inheritance Mutation for Real Estate (Intiqal-e-Wirasat):**\n\n1. **Required Documents:** NADRA Succession Certificate or Civil Court Succession decree, Death certificate, and property Fard/Registry.\n2. **Arazi Record Center (PLRA / Revenue Dept):** Submit the application at the local Tehsil Land Record Center.\n3. **Proportional Record of Rights:** The Tehsildar is legally mandated to update the mutation register (Intiqal) reflecting each heir's exact fractional ownership in the revenue record.`;
    }
  }

  // 10. Awl & Radd (عول اور رد)
  if (
    q.includes('awl') ||
    q.includes('radd') ||
    q.includes('عول') ||
    q.includes('رد') ||
    q.includes('deficit') ||
    q.includes('surplus')
  ) {
    if (isUr) {
      return `📐 **عول (Awl) اور رد (Radd) کے اصول:**\n\n• **عول (Awl - کمی کا تناسب):** جب تمام مقررہ حصوں کا مجموعہ 1 سے بڑھ جائے (مثلاً 1/8 + 2/3 + 1/6 + 1/6 = 27/24)، تو تمام ورثاء کے حصوں میں متناسب کمی کی جاتی ہے تاکہ کسی ایک وارث پر سارا بوجھ نہ پڑے۔\n• **رد (Radd - بچی ہوئی رقم کی واپسی):** جب مقررہ حصے دینے کے بعد ترکہ بچ جائے اور کوئی عصبہ (Residuary) موجود نہ ہو، تو بچا ہوا حصہ ذوی الفروض ورثاء میں ان کے تناسب سے دوبارہ تقسیم کر دیا جاتا ہے۔`;
    } else {
      return `📐 **Awl (Proportional Reduction) and Radd (Return of Surplus):**\n\n• **Awl (Deficit):** When the sum of all Quranic fixed shares exceeds 100% (e.g., 1/8 + 2/3 + 1/6 + 1/6 = 27/24), the base denominator is increased to proportionately reduce all shares fairly.\n• **Radd (Surplus):** When fixed shares total less than 100% and there are no residuary heirs (Asaba), the leftover surplus is proportionately redistributed back to the Quranic sharers (Zawil Furood).`;
    }
  }

  // 11. Precise Word-Boundary Greeting Match (Only triggers on actual standalone greetings)
  if (/\b(hi|hello|hey|salam|slam|aoa|as-salamu|assalam)\b/i.test(q)) {
    if (isUr) {
      return `وعلیکم السلام! میں **وارث اے آئی** ہوں — اسلامی وراثت (فرائض) اور پاکستانی جانشینی قوانین کا مستند قانونی معاون۔\n\nآپ مجھ سے درج ذیل موضوعات پر بلا جھجھک رہنمائی حاصل کر سکتے ہیں:\n• فقہ حنفی و فقہ جعفریہ (Shia Law) میں وراثت کی تقسیم\n• نادرا جانشینی سرٹیفکیٹ کا طریقہ کار\n• خواتین کے حقوق (دفعہ 498-اے)\n• عاق نامہ اور اراضی کے انتقال کے ضوابط\n\nآپ کیا جاننا چاہتے ہیں؟`;
    } else {
      return `Wa Alaykum As-salam! I am **Waris AI** — your specialized Shariah & Pakistani Succession Law counsel.\n\nI can assist you with:\n• Sunni (Hanafi) & Shia (Ja'fari) fractional share calculations\n• Step-by-step NADRA Digital Succession roadmap\n• Section 498-A PPC protections for women\n• Real Estate Mutation (Intiqal) & Court Affidavit procedures\n\nHow can I help you with your succession case today?`;
    }
  }

  // 12. General Guidance
  if (isUr) {
    return `⚖️ **وارث قانونی و شرعی رہنمائی:**\n\nآپ کے سوال کے تناظر میں:\n\n1. **شرعی اصول:** تمام شرعی ورثاء کے حقوق قرآن مجید کی سورۃ النساء (آیات 11، 12، 176) اور متعلقہ فقہی اصولوں کے تحت محفوظ ہیں۔\n2. **لازمی اخراجات:** ترکے کی تقسیم سے قبل تجہیز و تکفین، تمام واجب الادا قرضے (بشمول حق مہر)، اور جائز وصیت (زیادہ سے زیادہ 1/3) وضع کرنا لازمی ہے۔\n3. **قانونی کارروائی:** غیر متنازعہ جانشینی کے لیے نادرا جانشینی ایکٹ 2021 اور متنازعہ معاملات میں سول کورٹ (Succession Act 1925) سے رجوع کیا جاتا ہے۔\n\nمزید مخصوص رہنمائی کے لیے اوپر دیے گئے فوری بٹنز استعمال کریں یا سوال تفصیل سے لکھیں۔`;
  } else {
    return `⚖️ **Legal & Shariah Analysis:**\n\nUnder Islamic Jurisprudence (Fara'iz) and Pakistani statutory laws (Letters of Administration and Succession Certificates Act 2021 & Succession Act 1925):\n\n1. **Quranic Entitlements:** Every designated heir's share is established by divine decree (Surah An-Nisa 4:11, 4:12, 4:176) and codified under Pakistani law.\n2. **Mandatory Deductions:** Before distribution, all funeral costs, outstanding debts (including unpaid dower/Mahr), and valid bequests (up to 1/3rd) must be settled.\n3. **Official Title Transfer:** Succession is finalized via a digital NADRA Succession Certificate (uncontested) or a Civil Court succession decree (contested).\n\nPlease ask any specific question or click the quick topic buttons above for instant statutory guidance.`;
  }
}

// Rich Markdown & Typography Formatter for Messages
function renderFormattedContent(text, isUser) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Split by **bold** markdown tags
        const parts = line.split(/(\*\*.*?\*\*)/g);

        return (
          <p key={lineIdx} className="leading-relaxed">
            {parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                const inner = part.slice(2, -2);
                return (
                  <strong
                    key={partIdx}
                    className={
                      isUser
                        ? 'font-bold text-white underline decoration-emerald-300/40'
                        : 'font-bold text-emerald-300'
                    }
                  >
                    {inner}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function WarisLegalChatbot({ formData, results, lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('waris_gemini_api_key') || '');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text:
        lang === 'ur'
          ? 'السلام علیکم! میں وارث اے آئی قانونی اور شرعی مشیر ہوں۔ آپ اسلامی وراثت (سنی/شیعہ)، نادرا جانشینی سرٹیفکیٹ یا اراضی کے انتقال سے متعلق کوئی بھی سوال پوچھ سکتے ہیں۔'
          : 'As-salamu alaykum! I am Waris AI — an AI Legal & Shariah Counsel. Ask me any question about Sunni & Shia inheritance, NADRA succession, women’s rights, or land mutation.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleOpen = () => {
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 220);
  };

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('waris_gemini_api_key', newKey);
    setShowSettings(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Generative AI Processing Call
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let aiResponse = null;

      const activeEstateContext =
        results && results.heirsList && results.heirsList.length > 0
          ? `Active User Estate: Net PKR ${results.netEstate}, Heirs: ${results.heirsList
              .map((h) => `${h.nameEn} (${h.fractionFormatted})`)
              .join(', ')}.`
          : 'No calculation entered yet.';

      const systemPrompt = `You are Waris AI, a world-class certified Pakistani succession lawyer and Islamic jurisprudence scholar (expert in both Sunni Hanafi Fara'iz and Shia Ja'fari inheritance, NADRA Succession Act 2021, Section 498-A PPC, and PLRA Land Revenue laws).
Current Context: ${activeEstateContext}
Language: ${lang === 'ur' ? 'Urdu' : 'English'}.
Instructions: Respond accurately, empathetically, and concisely in 1-3 well-formatted paragraphs with bullet points. Use bold text for key terms.`;

      // 1. If User has configured a Google Gemini API Key
      if (apiKey && apiKey.trim().length > 10) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
              apiKey.trim()
            )}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      { text: `${systemPrompt}\n\nUser Question: ${query}` }
                    ]
                  }
                ]
              })
            }
          );
          if (geminiRes.ok) {
            const data = await geminiRes.json();
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
              aiResponse = data.candidates[0].content.parts[0].text;
            }
          }
        } catch (geminiErr) {
          console.warn('Gemini direct API call error:', geminiErr);
        }
      }

      // 2. If no response yet, use the Domain Legal Knowledge Engine
      if (!aiResponse) {
        aiResponse = getInstantLegalResponse(query, results, formData, lang);
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: aiResponse.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: getInstantLegalResponse(query, results, formData, lang),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 no-print font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && !isClosing && (
        <button
          type="button"
          onClick={handleOpen}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-2xl border border-emerald-400/40 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fade-in-scale animate-pulse-glow"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
          </div>
          <span className="hidden sm:inline tracking-wide">
            {lang === 'ur' ? 'وارث اے آئی قانونی مشیر' : 'Waris AI Legal Counsel'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
        </button>
      )}

      {/* Modern Chat Window */}
      {(isOpen || isClosing) && (
        <div
          className={`flex flex-col bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isClosing ? 'animate-chatbot-exit pointer-events-none' : 'animate-chatbot-enter'
          } ${
            isExpanded
              ? 'fixed inset-3 sm:inset-8 z-50 rounded-2xl shadow-emerald-950/40'
              : 'w-[92vw] sm:w-[440px] h-[560px] max-h-[85vh]'
          }`}
        >
          {/* Clean Header */}
          <div className="p-3.5 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 transition-transform duration-300 hover:rotate-6">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{lang === 'ur' ? 'وارث اے آئی قانونی مشیر' : 'Waris AI Legal Counsel'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {apiKey ? 'GEMINI LLM' : 'SHARIA AI'}
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  {lang === 'ur' ? 'سنی و شیعہ وراثت اور پاکستانی قوانین' : 'Sunni & Shia Fara\'iz & Succession Law'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-colors duration-200 ${
                  showSettings ? 'bg-emerald-950 text-emerald-300' : 'hover:bg-slate-800 hover:text-white'
                }`}
                title="AI Settings & Gemini API Key"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors duration-200"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-rose-950 hover:text-rose-300 transition-colors duration-200"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Settings / Gemini API Key Drawer */}
          {showSettings && (
            <div className="p-3 bg-slate-950/95 border-b border-slate-800 animate-fade-in-up text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Google Gemini 1.5/2.0 Flash Integration</span>
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                >
                  Get free key <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-[10.5px] text-slate-300">
                Paste any free Google Gemini API key to enable unlimited, real-time generative reasoning:
              </p>
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Key className="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveApiKey(apiKey)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Quick Suggestion Chips */}
          <div className="p-2 bg-slate-950/70 border-b border-slate-800/80 overflow-x-auto flex items-center gap-1.5 no-scrollbar text-[10.5px]">
            <button
              onClick={() => handleSendMessage('What are the rules of inheritance under Shia (Ja\'fari) law compared to Sunni law?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700/60 shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              🏛️ Shia (Ja'fari) Rules
            </button>
            <button
              onClick={() => handleSendMessage('Can a father disown a child through newspaper Aaq-Nama under Pakistani law?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700/60 shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              ⚖️ Aaq-Nama Validity
            </button>
            <button
              onClick={() => handleSendMessage('What is Section 498-A PPC for female inheritance in Pakistan?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700/60 shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              👩 Section 498A PPC
            </button>
            <button
              onClick={() => handleSendMessage('How do I apply for a NADRA Succession Certificate step by step?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700/60 shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              📜 NADRA Steps
            </button>
            <button
              onClick={() => handleSendMessage('What is the breakdown of my current case?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              📊 My Case Summary
            </button>
          </div>

          {/* Stream of Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 animate-message-pop ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-sm">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed text-xs shadow-md transition-all duration-200 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-tr-none'
                      : 'bg-slate-800/95 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-black/20'
                  }`}
                >
                  {renderFormattedContent(msg.text, msg.sender === 'user')}
                  <span className="text-[9px] text-slate-400 block text-right mt-1.5 opacity-70">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2 animate-message-pop">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{lang === 'ur' ? 'قانونی تجزیہ تیار ہو رہا ہے...' : 'Analyzing case & generating legal guidance...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={lang === 'ur' ? 'کوئی بھی سوال لکھیں (مثلاً: شیعہ وراثت، عاق نامہ، نادرا)...' : 'Ask any question (e.g., Shia inheritance, Aaq-Nama, NADRA)...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors duration-200"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
