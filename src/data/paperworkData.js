/**
 * Waris - Pakistani Property Paperwork, Inheritance Mutation (Intiqal), & Succession Navigator
 *
 * Detailed province-wise administrative procedures, legal requirements, and office directories.
 */

export const provinces = [
  {
    id: 'punjab',
    nameEn: 'Punjab',
    nameUr: 'پنجاب',
    taglineEn: 'PLRA Arazi Record Centers (ARC), LDA, DHA & NADRA Centers',
    taglineUr: 'پنجاب لینڈ ریکارڈز اتھارٹی (اراضی ریکارڈ سینٹر)، ایل ڈی اے اور نادرا سینٹرز',
  },
  {
    id: 'sindh',
    nameEn: 'Sindh',
    nameUr: 'سندھ',
    taglineEn: 'e-Service Centers, Mukhtiarkar / Tapedar, KDA, SBCA & DHA Karachi',
    taglineUr: 'ای سروس سینٹرز، مختار کار / تپیدار، کے ڈی اے اور ڈی ایچ اے کراچی',
  },
  {
    id: 'kpk',
    nameEn: 'Khyber Pakhtunkhwa (KPK)',
    nameUr: 'خیبر پختونخوا',
    taglineEn: 'Service Delivery Centers (SDC), BoR KPK, PDA & Revenue Halqas',
    taglineUr: 'سروس ڈیلیوری سینٹرز (ایس ڈی سی)، بورڈ آف ریونیو اور پی ڈی اے',
  },
  {
    id: 'balochistan',
    nameEn: 'Balochistan',
    nameUr: 'بلوچستان',
    taglineEn: 'Tehsildar / Revenue Courts, Misal-e-Haqiat, Patwari Halqa & QDA/GDA',
    taglineUr: 'تحصیلدار، مثلِ حقیقت، پٹواری حلقہ اور کیو ڈی اے/جی ڈی اے',
  },
  {
    id: 'ict',
    nameEn: 'Islamabad (ICT)',
    nameUr: 'اسلام آباد',
    taglineEn: 'CDA Estate Management-II, ICT Revenue Office & NADRA Succession Facilitation',
    taglineUr: 'سی ڈی اے اسٹیٹ مینجمنٹ، آئی سی ٹی ریونیو اور نادرا جانشینی مرکز',
  },
  {
    id: 'ajk_gb',
    nameEn: 'Azad Kashmir & Gilgit-Baltistan',
    nameUr: 'آزاد کشمیر اور گلگت بلتستان',
    taglineEn: 'Tehsil Revenue Offices, Settlement Records & District Courts',
    taglineUr: 'تحصیل مال گزاری دفاتر، بندوبست ریکارڈ اور ضلعی عدالتیں',
  },
];

export const commonChecklistItems = [
  {
    id: 'doc_death_cert',
    nameEn: 'Computerized Death Certificate (NADRA / Union Council)',
    nameUr: 'کمپیوٹرائزڈ ڈیتھ سرٹیفکیٹ (نادرا / یونین کونسل)',
    importance: 'Mandatory / بنیادی ضرورت',
    descriptionEn:
      'Issued by the local Union Council or Cantonment Board, linked directly to NADRA. Essential before initiating any succession or property transfer.',
    descriptionUr:
      'متعلقہ یونین کونسل یا کنٹونمنٹ بورڈ سے حاصل کردہ کمپیوٹرائزڈ سرٹیفکیٹ جو نادرا کے ساتھ منسلک ہوتا ہے۔',
  },
  {
    id: 'doc_cnics',
    nameEn: 'Valid CNICs / NICOPs of All Legal Heirs & Deceased',
    nameUr: 'تمام قانونی ورثاء اور متوفی کے قومی شناختی کارڈز',
    importance: 'Mandatory / بنیادی ضرورت',
    descriptionEn:
      'Original CNICs and attested photocopies of all surviving legal heirs. Deceased CNIC must be cancelled at NADRA to receive Death Registration Certificate (DRC).',
    descriptionUr:
      'تمام حیات شرعی ورثاء کے تصدیق شدہ شناختی کارڈز اور متوفی کا شناختی کارڈ جو نادرا سے کینسل کروانا ضروری ہے۔',
  },
  {
    id: 'doc_frc',
    nameEn: 'Family Registration Certificate (FRC - By Birth / Marriage)',
    nameUr: 'فیملی رجسٹریشن سرٹیفکیٹ (FRC)',
    importance: 'Mandatory / بنیادی ضرورت',
    descriptionEn:
      'Issued by NADRA showing genealogical tree of the deceased (parents, spouse, sons, daughters, siblings) proving legal heirship.',
    descriptionUr:
      'نادرا سے جاری شدہ خاندانی شجرہ جس میں متوفی کے تمام خونی و ازدوانی رشتے (والدین، شریک حیات، بچے) درج ہوتے ہیں۔',
  },
  {
    id: 'doc_title_deeds',
    nameEn: 'Original Property Documents (Fard / Registry / Allotment Letter)',
    nameUr: 'جائیداد کے اصل ملکیتی کاغذات (فرد، رجسٹری، الاٹمنٹ لیٹر)',
    importance: 'Mandatory / بنیادی ضرورت',
    descriptionEn:
      'Original registered Sale Deed (Baye-Nama), Computerized Fard Malkiat, Transfer Letter, or Society Allotment Order.',
    descriptionUr:
      'اصل بیع نامہ (رجسٹری)، فرد ملکیت برائے ریکارڈ، الاٹمنٹ لیٹر یا ہاؤسنگ سوسائٹی کا ٹرانسفر لیٹر۔',
  },
  {
    id: 'doc_tax_clearance',
    nameEn: 'No-Encumbrance & Property Tax Clearance Certificate (NOC)',
    nameUr: 'این او سی اور پراپرٹی ٹیکس کلیئرنس سرٹیفکیٹ',
    importance: 'Required for Transfer / منتقلی کے لیے لازمی',
    descriptionEn:
      'Receipts of paid Excise & Taxation property taxes, non-encumbrance certificate showing no active mortgage/stay order, and utility clearance.',
    descriptionUr:
      'ایکسائز اینڈ ٹیکسیشن اور لوکل گورنمنٹ کے تمام واجب الادا پراپرٹی ٹیکس، یوٹیلیٹی بلز اور بغیر کسی عدالتی اسٹے کی تصدیق۔',
  },
  {
    id: 'doc_power_of_attorney',
    nameEn: 'Power of Attorney (PoA) - If any heir is Overseas / Out of City',
    nameUr: 'مختار نامہ عام/خاص (بیرون ملک یا غیر حاضر ورثاء کے لیے)',
    importance: 'Conditional / بوقت ضرورت',
    descriptionEn:
      'If an heir resides abroad, a Special/General Power of Attorney attested by the Pakistani Embassy/High Commission and MOFA (Ministry of Foreign Affairs, Pakistan).',
    descriptionUr:
      'اگر کوئی وارث بیرون ملک ہو تو پاکستانی سفارت خانہ اور وزارت خارجہ (MOFA) سے تصدیق شدہ مختار نامہ۔',
  },
];

export const provinceProcedures = {
  punjab: {
    titleEn: 'Punjab Property Devolution & Mutation Guide',
    titleUr: 'پنجاب میں وراثت کی منتقلی اور انتقال کا طریقہ کار',
    summaryEn:
      'In Punjab, agricultural and rural computerized land is transferred via Punjab Land Records Authority (PLRA) Arazi Record Centers (ARC). Urban housing schemes (LDA, DHA, Bahria) require society-specific transfer procedures alongside NADRA Succession Certificates.',
    summaryUr:
      'پنجاب میں دیہی اور زرعی کمپیوٹرائزڈ اراضی کا انتقال پنجاب لینڈ ریکارڈز اتھارٹی (PLRA) کے اراضی ریکارڈ سینٹر سے ہوتا ہے۔ شہری اسکیموں (ایل ڈی اے، ڈی ایچ اے) کے لیے نادرا جانشینی سرٹیفکیٹ اور سوسائٹی کا مخصوص پروسیس درکار ہے۔',
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Union Council: Computerized Death Certificate',
        titleUr: 'مرحلہ 1: یونین کونسل سے کمپیوٹرائزڈ ڈیتھ سرٹیفکیٹ',
        officeEn: 'Concerned Union Council / Cantonment Board Office',
        officeUr: 'متعلقہ یونین کونسل یا کنٹونمنٹ بورڈ',
        timelineEn: '2 - 5 working days',
        timelineUr: '2 سے 5 یوم',
        detailsEn:
          'Report the demise with gravedigger receipt (Qabristan parchi) and hospital death slip. Receive the computerized NADRA-linked death certificate.',
        detailsUr:
          'ہسپتال کی ڈیتھ سلپ اور قبرستان کی رسید کے ساتھ یونین کونسل میں اندراج کروا کر کمپیوٹرائزڈ ڈیتھ سرٹیفکیٹ حاصل کریں۔',
        tipsEn: 'Verify correct spelling of name and CNIC numbers on the spot.',
        tipsUr: 'نام اور شناختی کارڈ نمبر کا اندراج موقع پر ہی چیک کریں۔',
      },
      {
        stepNumber: 2,
        titleEn: 'NADRA: CNIC Cancellation & FRC Issuance',
        titleUr: 'مرحلہ 2: نادرا سے شناختی کارڈ منسوخی اور ایف آر سی',
        officeEn: 'NADRA Mega Center / Executive Center',
        officeUr: 'نادرا میگا / ایگزیکٹو سینٹر',
        timelineEn: 'Same day to 3 working days',
        timelineUr: '1 سے 3 یوم',
        detailsEn:
          'Submit the original CNIC of deceased for cancellation. Obtain the Death Registration Certificate (DRC) and apply for Family Registration Certificate (FRC - by Birth).',
        detailsUr:
          'متوفی کا شناختی کارڈ منسوخ کروا کر ڈیتھ رجسٹریشن سرٹیفکیٹ اور ایف آر سی (خاندانی شجرہ) حاصل کریں۔',
        tipsEn: 'FRC is vital because revenue officers cross-check every legal heir against NADRA database.',
        tipsUr: 'ایف آر سی سب سے بنیادی دستاویز ہے جس کے ذریعے پٹواری اور ریونیو آفیسر ورثاء کی تصدیق کرتے ہیں۔',
      },
      {
        stepNumber: 3,
        titleEn: 'NADRA Succession Facilitation Center: Succession Certificate & Letter of Administration',
        titleUr: 'مرحلہ 3: نادرا جانشینی سینٹر سے سرٹیفکیٹ آف سکسیشن اور لیٹر آف ایڈمنسٹریشن',
        officeEn: 'NADRA Succession Facilitation Center (Under Punjab Succession Act 2021)',
        officeUr: 'نادرا جانشینی سہولت مرکز',
        timelineEn: '15 - 20 working days (includes 14-day public newspaper notice)',
        timelineUr: '15 سے 20 یوم (اخبار میں 14 روزہ اشتہار سمیت)',
        detailsEn:
          'Apply for Letter of Administration (for immovable real estate) and Succession Certificate (for bank accounts, prize bonds, vehicles). All legal heirs provide biometric verification. A public notice is published in 2 national dailies.',
        detailsUr:
          'جائیداد غیر منقولہ کے لیے لیٹر آف ایڈمنسٹریشن اور منقولہ (بینک اکاؤنٹس، گاڑیاں) کے لیے سکسیشن سرٹیفکیٹ کی درخواست دیں۔ تمام ورثاء کا بائیومیٹرک ہوگا۔',
        tipsEn:
          'Overseas heirs can verify biometrics at Pakistani embassies or via NADRA online portal.',
        tipsUr: 'بیرون ملک مقیم ورثاء سفارت خانے یا نادرا آن لائن پورٹل سے بائیومیٹرک تصدیق کر سکتے ہیں۔',
      },
      {
        stepNumber: 4,
        titleEn: 'Arazi Record Center (PLRA): Intiqal-e-Wirasat (Inheritance Mutation)',
        titleUr: 'مرحلہ 4: اراضی ریکارڈ سینٹر (PLRA) سے انتقالِ وراثت',
        officeEn: 'Tehsil Arazi Record Center (ARC) / Deh / Halqa Patwari',
        officeUr: 'اراضی ریکارڈ سینٹر (تحصیل دفتر)',
        timelineEn: '7 - 14 working days',
        timelineUr: '7 سے 14 یوم',
        detailsEn:
          'Book an appointment at ARC. Present FRC, Death Certificate, Title Deeds, and NADRA Letter of Administration. The Revenue Officer (Tehsildar / Assistant Director Land Records - ADLR) verifies the pedigree tree (Shajra Nasab) and sanctions the mutation in the computerized land database.',
        detailsUr:
          'اراضی ریکارڈ سینٹر میں ایف آر سی، نادرا سرٹیفکیٹ اور سابقہ فرد پیش کریں۔ تحصیلدار / اے ڈی ایل آر شرعی حصوں کے مطابق اراضی تمام ورثاء کے نام منتقل کر کے نیا فرد جاری کرے گا۔',
        tipsEn: 'Obtain updated "Fard Malkiat" with each heir’s fractional share and Khewat/Khasra number.',
        tipsUr: 'انتقال کے بعد تمام ورثاء کے مشترکہ یا انفرادی کھاتہ دارانہ حقوق پر مشتمل کمپیوٹرائزڈ فرد ملکیت حاصل کریں۔',
      },
      {
        stepNumber: 5,
        titleEn: 'Housing Authority / Private Society Transfer (If Applicable)',
        titleUr: 'مرحلہ 5: ہاؤسنگ اتھارٹی / سوسائٹی میں منتقلی (اگر مکان/پلاٹ سوسائٹی میں ہو)',
        officeEn: 'LDA / DHA Lahore, Rawalpindi, Multan / Housing Society Office',
        officeUr: 'ایل ڈی اے / ڈی ایچ اے یا سوسائٹی ٹرانسفر ڈائریکٹوریٹ',
        timelineEn: '15 - 30 working days',
        timelineUr: '15 سے 30 یوم',
        detailsEn:
          'Submit Succession Certificate, Original Allotment/Transfer Letter, Indemnity Bonds on Stamp Paper, Publication in Newspapers, and NOC for utility dues. Society issues new Transfer Letter in heirs’ names.',
        detailsUr:
          'سوسائٹی کے ٹرانسفر ڈیپارٹمنٹ میں سکسیشن سرٹیفکیٹ، ضمانتی مچلکے (Indemnity Bond)، اخباری اشتہار اور این او سی جمع کروا کر نیا ٹرانسفر لیٹر جاری کروائیں۔',
        tipsEn: 'Ensure transfer fees and stamp duties are calculated per government rates.',
        tipsUr: 'حکومتی ٹیکس اور سوسائٹی ٹرانسفر فیس کے چالان کا حساب پہلے معلوم کر لیں۔',
      },
    ],
  },
  sindh: {
    titleEn: 'Sindh Property Devolution & Mutation Guide',
    titleUr: 'سندھ میں وراثت کی منتقلی اور انتقال کا طریقہ کار',
    summaryEn:
      'In Sindh, rural agricultural land is handled by the Revenue Department through the Tapedar, Supervising Tapedar, and Mukhtiarkar (Form VII / Deh Form). Urban properties in Karachi/Hyderabad are transferred via KDA, SBCA, Sub-Registrar, or DHA Karachi.',
    summaryUr:
      'سندھ میں زرعی اراضی کا انتقال تپیدار، سپروائزنگ تپیدار اور مختیار کار (فارم VII) کے ذریعے ہوتا ہے، جبکہ کراچی و حیدرآباد کے شہری پلاٹس اور فلیٹس کی منتقلی کے ڈی اے، سب رجسٹرار اور ڈی ایچ اے کراچی کے ذریعے ہوتی ہے۔',
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Union Council / Cantonment: Computerized Death Certificate',
        titleUr: 'مرحلہ 1: یونین کونسل سے ڈیتھ سرٹیفکیٹ',
        officeEn: 'Local Union Council / Cantonment Board Office',
        officeUr: 'مقامی یونین کمیٹی / کنٹونمنٹ بورڈ',
        timelineEn: '3 - 7 working days',
        timelineUr: '3 سے 7 یوم',
        detailsEn:
          'Register death at local UC with hospital report and cemetery verification to obtain computerized certificate.',
        detailsUr: 'قبرستان اور ہسپتال کی رسید پیش کر کے کمپیوٹرائزڈ ڈیتھ سرٹیفکیٹ حاصل کریں۔',
        tipsEn: 'Ensure deceased parents names and spouse details match CNIC.',
        tipsUr: 'تمام کوائف کی نادرا ریکارڈ سے مطابقت لازمی چیک کریں۔',
      },
      {
        stepNumber: 2,
        titleEn: 'NADRA Center: CNIC Cancellation & FRC',
        titleUr: 'مرحلہ 2: نادرا سے شناختی کارڈ منسوخی اور ایف آر سی',
        officeEn: 'NADRA Mega Center Karachi / Hyderabad / Sukkur',
        officeUr: 'نادرا میگا سینٹر',
        timelineEn: '1 - 3 working days',
        timelineUr: '1 سے 3 یوم',
        detailsEn:
          'Cancel deceased CNIC/NICOP and apply for FRC (Family Registration Certificate) by birth and marriage.',
        detailsUr: 'متوفی کا شناختی کارڈ کینسل کروا کر مکمل ایف آر سی فیملی سرٹیفکیٹ لیں۔',
        tipsEn: 'FRC is legally required by Mukhtiarkar and Sub-Registrar offices.',
        tipsUr: 'مختار کار اور سب رجسٹرار دفاتر کے لیے ایف آر سی بنیادی دستاویز ہے۔',
      },
      {
        stepNumber: 3,
        titleEn: 'NADRA Succession Facilitation Center (Sindh Act 2021) or Civil Court',
        titleUr: 'مرحلہ 3: نادرا جانشینی سینٹر یا سول کورٹ سے سرٹیفکیٹ',
        officeEn: 'NADRA Succession Center / Senior Civil Judge Court',
        officeUr: 'نادرا جانشینی سینٹر / سول کورٹ',
        timelineEn: '15 - 25 working days (NADRA) or 2 - 4 months (Court)',
        timelineUr: '15 سے 25 یوم (نادرا) یا 2 سے 4 ماہ (عدالت)',
        detailsEn:
          'If there is no family dispute, apply at NADRA Succession Center for Letters of Administration & Succession Certificate. If minor heirs or litigation exist, file petition in District/High Court.',
        detailsUr:
          'اگر کوئی تنازعہ نہ ہو تو نادرا جانشینی سینٹر سے 15 دن میں سرٹیفکیٹ مل جاتا ہے۔ نابالغ بچوں یا تنازعے کی صورت میں عدالت سے رجوع کریں۔',
        tipsEn: 'Biometric verification of all legal heirs is mandatory.',
        tipsUr: 'تمام قانونی ورثاء کی فنگر پرنٹ بائیومیٹرک تصدیق ضروری ہے۔',
      },
      {
        stepNumber: 4,
        titleEn: 'Revenue Office (Tapedar / Mukhtiarkar) - Form VII / Deh Record',
        titleUr: 'مرحلہ 4: تپیدار و مختیار کار دفتر (فارم VII اور دیہہ ریکارڈ)',
        officeEn: 'Mukhtiarkar Revenue Office (Taluka / District Level)',
        officeUr: 'مختار کار ریونیو آفس (تعلقہ سطح)',
        timelineEn: '15 - 30 working days',
        timelineUr: '15 سے 30 یوم',
        detailsEn:
          'Submit mutation application to the Tapedar/Mukhtiarkar. A "Musheer-Nama" (panchnama of local respectables) and pedigree tree are recorded. The Mukhtiarkar sanctions the mutation into "Village Form VII" (Record of Rights).',
        detailsUr:
          'تپیدار اور مختیار کار کو درخواست دیں۔ مشیر نامہ اور شجرہ نسب تیار ہونے کے بعد فارم VII میں تمام ورثاء کا شرعی اندراج ہوگا۔',
        tipsEn: 'Verify entries in the Sindh e-Zameen portal if the deh is digitized.',
        tipsUr: 'اگر علاقہ سندھ ای-زمین پورٹل پر ڈیجیٹلائزڈ ہو تو آن لائن تصدیق کریں۔',
      },
      {
        stepNumber: 5,
        titleEn: 'Urban Housing / Sub-Registrar Office Transfer (Karachi/Hyderabad)',
        titleUr: 'مرحلہ 5: کے ڈی اے، ڈی ایچ اے یا سب رجسٹرار دفتر سے شہری جائیداد کی منتقلی',
        officeEn: 'KDA / SBCA / DHA Karachi / Concerned Sub-Registrar',
        officeUr: 'کے ڈی اے / ڈی ایچ اے کراچی / سب رجسٹرار',
        timelineEn: '20 - 45 working days',
        timelineUr: '20 سے 45 یوم',
        detailsEn:
          'For registered sale deeds (Baye-Nama), register an Inheritance Deed / Declaration at the Sub-Registrar office. For KDA/DHA lease plots, submit succession documents to the Land/Transfer department.',
        detailsUr:
          'رجسٹرڈ دستاویزات کے لیے سب رجسٹرار دفتر میں وراثت کا اندراج کروائیں یا سوسائٹی کے دفتر میں لیز ٹرانسفر کروائیں۔',
        tipsEn: 'Ensure all municipal taxes, ground rents, and utility bills are paid.',
        tipsUr: 'تمام بلدیاتی ٹیکس اور گراؤنڈ رینٹ کے بقایا جات کلیئر رکھیں۔',
      },
    ],
  },
  kpk: {
    titleEn: 'KPK Property Devolution & Mutation Guide',
    titleUr: 'خیبر پختونخوا میں وراثت کے انتقال کا طریقہ کار',
    summaryEn:
      'In Khyber Pakhtunkhwa, computerized land records are administered through Board of Revenue Service Delivery Centers (SDCs). Rural and uncomputerized areas follow the Patwari Halqa / Tehsildar channel with Jalsa-e-Aam.',
    summaryUr:
      'خیبر پختونخوا میں کمپیوٹرائزڈ اراضی کے معاملات سروس ڈیلیوری سینٹرز (ایس ڈی سی) اور غیر کمپیوٹرائزڈ علاقوں میں پٹواری حلقہ اور تحصیلدار کے ذریعے طے پاتے ہیں۔',
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Union Council: Computerized Death Certificate',
        titleUr: 'مرحلہ 1: یونین کونسل سے ڈیتھ سرٹیفکیٹ',
        officeEn: 'Concerned Union Council KPK',
        officeUr: 'متعلقہ یونین کونسل',
        timelineEn: '2 - 5 working days',
        timelineUr: '2 سے 5 یوم',
        detailsEn: 'Obtain NADRA computerized death certificate from the local village/neighborhood council.',
        detailsUr: 'متعلقہ ویلج یا نیبرہوڈ کونسل سے کمپیوٹرائزڈ ڈیتھ سرٹیفکیٹ لیں۔',
        tipsEn: 'Check accuracy of CNIC and parentage.',
        tipsUr: 'شناختی کارڈ اور ولدیت کی تصدیق کریں۔',
      },
      {
        stepNumber: 2,
        titleEn: 'NADRA Center: CNIC Cancellation & FRC',
        titleUr: 'مرحلہ 2: نادرا سے شناختی کارڈ منسوخی اور ایف آر سی',
        officeEn: 'NADRA Mega Center Peshawar / Abbottabad / Mardan / Swat',
        officeUr: 'نادرا میگا سینٹر',
        timelineEn: '1 - 3 working days',
        timelineUr: '1 سے 3 یوم',
        detailsEn: 'Cancel deceased CNIC and get Family Registration Certificate (FRC).',
        detailsUr: 'متوفی کا کارڈ منسوخ کروا کر ایف آر سی سرٹیفکیٹ حاصل کریں۔',
        tipsEn: 'Ensure all surviving sons, daughters, and spouse are listed.',
        tipsUr: 'تمام حیات اولاد اور بیوہ کا نام ایف آر سی میں شامل ہونا لازمی ہے۔',
      },
      {
        stepNumber: 3,
        titleEn: 'NADRA Succession Facilitation Center (KPK Act 2021)',
        titleUr: 'مرحلہ 3: نادرا جانشینی سینٹر سے سرٹیفکیٹ',
        officeEn: 'NADRA Succession Facilitation Center KPK',
        officeUr: 'نادرا جانشینی سینٹر',
        timelineEn: '15 - 20 working days',
        timelineUr: '15 سے 20 یوم',
        detailsEn:
          'Apply for Letter of Administration and Succession Certificate. Biometric verification of heirs is completed with public advertisement.',
        detailsUr:
          'لیٹر آف ایڈمنسٹریشن اور جانشینی سرٹیفکیٹ کی درخواست دیں۔ تمام ورثاء کا بائیومیٹرک ہوگا۔',
        tipsEn: 'Fast-track mechanism without court visits if no legal disputes exist.',
        tipsUr: 'بغیر کسی عدالتی چکر کے 15 دن میں قانونی سرٹیفکیٹ جاری ہوتا ہے۔',
      },
      {
        stepNumber: 4,
        titleEn: 'Service Delivery Center (SDC) / Tehsildar - Intiqal Wirasat',
        titleUr: 'مرحلہ 4: سروس ڈیلیوری سینٹر (SDC) / تحصیلدار سے انتقالِ وراثت',
        officeEn: 'Tehsil Service Delivery Center (SDC) / Halqa Patwari',
        officeUr: 'سروس ڈیلیوری سینٹر / پٹواری حلقہ',
        timelineEn: '7 - 14 working days',
        timelineUr: '7 سے 14 یوم',
        detailsEn:
          'Present FRC and title deeds at SDC. Revenue Officer (Tehsildar / Revenue Assistant) verifies the Pedigree Tree (Shajra Nasab) and confirms Islamic shares in the computerized registry.',
        detailsUr:
          'ایس ڈی سی میں کاغذات جمع کروا کر تحصیلدار سے تصدیق کروائیں اور کمپیوٹرائزڈ فرد وراثت حاصل کریں۔',
        tipsEn: 'Take updated Computerized Fard in all heirs names.',
        tipsUr: 'تمام ورثاء کے ناموں پر نیا کمپیوٹرائزڈ فرد ملکیت لیں۔',
      },
      {
        stepNumber: 5,
        titleEn: 'Development Authority Transfer (PDA Peshawar / GDA Swat)',
        titleUr: 'مرحلہ 5: ڈویلپمنٹ اتھارٹی (پی ڈی اے پشاور وغیرہ) میں ٹرانسفر',
        officeEn: 'Peshawar Development Authority (PDA) / Urban Housing Directorate',
        officeUr: 'پشاور ڈویلپمنٹ اتھارٹی (PDA)',
        timelineEn: '15 - 30 working days',
        timelineUr: '15 سے 30 یوم',
        detailsEn:
          'For urban plots in Hayatabad, Regi Model Town, or new schemes, submit succession documents for official transfer letter.',
        detailsUr: 'شہری پلاٹس کے لیے پی ڈی اے یا سوسائٹی کے دفتر سے نیا ٹرانسفر لیٹر جاری کروائیں۔',
        tipsEn: 'Confirm non-dues certificate (NDC) from the society before applying.',
        tipsUr: 'سوسائٹی سے نان ڈیوز سرٹیفکیٹ (NDC) پہلے حاصل کریں۔',
      },
    ],
  },
  balochistan: {
    titleEn: 'Balochistan Property Devolution & Mutation Guide',
    titleUr: 'بلوچستان میں وراثت اور انتقال اراضی کا طریقہ کار',
    summaryEn:
      'In Balochistan, property devolution follows traditional Revenue Record (Misal-e-Haqiat / Register Haqdaran-e-Zameen) managed by the Tehsildar and Patwari Halqa, with Public Announcement (Jalsa-e-Aam) and QDA/GDA for urban schemes.',
    summaryUr:
      'بلوچستان میں اراضی کا انتقال پٹواری حلقہ اور تحصیلدار کی نگرانی میں مثلِ حقیقت اور جلسہ عام کے روایتی طریقہ کار کے تحت ہوتا ہے، جبکہ کوئٹہ و گوادر میں کیو ڈی اے اور جی ڈی اے مجاز ہیں۔',
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Union Council / Municipal Corporation: Death Certificate',
        titleUr: 'مرحلہ 1: یونین کونسل سے ڈیتھ سرٹیفکیٹ',
        officeEn: 'Concerned Union Council / Quetta Municipal Corporation (QMC)',
        officeUr: 'یونین کونسل / کوئٹہ میونسپل کارپوریشن',
        timelineEn: '3 - 7 working days',
        timelineUr: '3 سے 7 یوم',
        detailsEn: 'Register demise and receive computerized death certificate.',
        detailsUr: 'میونسپل کمیٹی یا یونین کونسل سے ڈیتھ سرٹیفکیٹ حاصل کریں۔',
        tipsEn: 'Verify all personal details carefully.',
        tipsUr: 'شناختی کوائف کی درستگی چیک کریں۔',
      },
      {
        stepNumber: 2,
        titleEn: 'NADRA Mega Center Quetta: CNIC Cancellation & FRC',
        titleUr: 'مرحلہ 2: نادرا سے شناختی کارڈ منسوخی اور ایف آر سی',
        officeEn: 'NADRA Mega Center Quetta / District NADRA Office',
        officeUr: 'نادرا میگا سینٹر کوئٹہ',
        timelineEn: '2 - 4 working days',
        timelineUr: '2 سے 4 یوم',
        detailsEn: 'Submit deceased CNIC for cancellation and obtain FRC.',
        detailsUr: 'متوفی کا کارڈ کینسل کروا کر ایف آر سی سرٹیفکیٹ لیں۔',
        tipsEn: 'FRC serves as proof of pedigree for revenue authorities.',
        tipsUr: 'ایف آر سی شجرہ نسب کی تصدیق کا اہم ثبوت ہے۔',
      },
      {
        stepNumber: 3,
        titleEn: 'Succession Certificate (Civil Court / NADRA)',
        titleUr: 'مرحلہ 3: سکسیشن سرٹیفکیٹ (سول کورٹ / نادرا)',
        officeEn: 'Senior Civil Judge Court / NADRA Succession Center',
        officeUr: 'سینئر سول جج عدالت / نادرا سینٹر',
        timelineEn: '20 - 45 working days',
        timelineUr: '20 سے 45 یوم',
        detailsEn:
          'Obtain Succession Certificate and Letter of Administration for immovable assets, bank balances, and vehicles.',
        detailsUr: 'بینک اکاؤنٹس، گاڑیوں اور جائیداد کے لیے سکسیشن سرٹیفکیٹ حاصل کریں۔',
        tipsEn: 'Court decree is widely recognized across all tribal and settled districts.',
        tipsUr: 'عدالتی ڈگری تمام اضلاع میں مستند مانی جاتی ہے۔',
      },
      {
        stepNumber: 4,
        titleEn: 'Tehsildar & Patwari Halqa: Shajra-e-Nasab & Jalsa-e-Aam',
        titleUr: 'مرحلہ 4: تحصیلدار اور پٹواری حلقہ (شجرہ نسب اور جلسہ عام)',
        officeEn: 'Tehsil Revenue Court / Halqa Patwari',
        officeUr: 'تحصیل ریونیو کورٹ / پٹواری',
        timelineEn: '15 - 30 working days',
        timelineUr: '15 سے 30 یوم',
        detailsEn:
          'Patwari prepares the pedigree tree (Shajra Nasab) and enters mutation in Register Haqdaran. Tehsildar announces Jalsa-e-Aam in the mauza to sanction the inheritance mutation in public presence.',
        detailsUr:
          'پٹواری شجرہ نسب تیار کر کے رجسٹر میں اندراج کرتا ہے اور تحصیلدار جلسہ عام میں سرعام تصدیق کر کے انتقال منظور کرتا ہے۔',
        tipsEn: 'Ensure all local tribal elders/witnesses are present for verification.',
        tipsUr: 'علاقائی معززین اور گواہان کی موجودگی یقینی بنائیں۔',
      },
      {
        stepNumber: 5,
        titleEn: 'Urban Housing Schemes (QDA Quetta / GDA Gwadar)',
        titleUr: 'مرحلہ 5: شہری ہاؤسنگ اسکیمیں (کیو ڈی اے کوئٹہ / جی ڈی اے گوادر)',
        officeEn: 'Quetta Development Authority (QDA) / Gwadar Development Authority (GDA)',
        officeUr: 'کیو ڈی اے کوئٹہ / جی ڈی اے گوادر',
        timelineEn: '20 - 40 working days',
        timelineUr: '20 سے 40 یوم',
        detailsEn: 'Submit court/NADRA succession documents for plot transfer letters.',
        detailsUr: 'پلاٹس اور مکانات کی منتقلی کے لیے اتھارٹی میں کاغذات جمع کروائیں۔',
        tipsEn: 'Check non-encumbrance status and outstanding dues.',
        tipsUr: 'پراپرٹی پر کسی تنازعے یا بقایا جات کا نہ ہونا یقینی بنائیں۔',
      },
    ],
  },
  ict: {
    titleEn: 'Islamabad Capital Territory (ICT) Devolution & Transfer Guide',
    titleUr: 'وفاقی دارالحکومت اسلام آباد میں وراثت کی منتقلی کا طریقہ کار',
    summaryEn:
      'In Islamabad, urban sectors (E, F, G, H, I, D series) are governed directly by the Capital Development Authority (CDA Estate Management-II). Rural sectors and mauzas fall under the ICT District Administration / Tehsildar.',
    summaryUr:
      'اسلام آباد کے تمام شہری سیکٹرز میں جائیداد کی وراثت سی ڈی اے (اسٹیٹ مینجمنٹ ڈائریکٹوریٹ) کے تحت اور دیہی علاقوں میں آئی سی ٹی ریونیو ڈیپارٹمنٹ اور تحصیلدار کے تحت ہوتی ہے۔',
    steps: [
      {
        stepNumber: 1,
        titleEn: 'ICT / CDA Directorate of Health: Computerized Death Certificate',
        titleUr: 'مرحلہ 1: کمپیوٹرائزڈ ڈیتھ سرٹیفکیٹ',
        officeEn: 'CDA Health Services / Union Council ICT / Cantonment',
        officeUr: 'سی ڈی اے ہیلتھ سروسز / متعلقہ یونین کونسل',
        timelineEn: '2 - 5 working days',
        timelineUr: '2 سے 5 یوم',
        detailsEn: 'Obtain computerized death certificate linked with NADRA.',
        detailsUr: 'سی ڈی اے یا متعلقہ یونین کونسل سے کمپیوٹرائزڈ ڈیتھ سرٹیفکیٹ لیں۔',
        tipsEn: 'Keep extra attested copies for CDA and banks.',
        tipsUr: 'سی ڈی اے اور بینکوں کے لیے متعدد تصدیق شدہ کاپیاں محفوظ رکھیں۔',
      },
      {
        stepNumber: 2,
        titleEn: 'NADRA Mega Center (Blue Area / G-10): CNIC Cancellation & FRC',
        titleUr: 'مرحلہ 2: نادرا میگا سینٹر اسلام آباد سے منسوخی اور ایف آر سی',
        officeEn: 'NADRA Mega Center Blue Area / G-10 / Pak Secretariat',
        officeUr: 'نادرا میگا سینٹر (بلیو ایریا / G-10)',
        timelineEn: '1 - 3 working days',
        timelineUr: '1 سے 3 یوم',
        detailsEn: 'Obtain DRC and complete Family Registration Certificate (FRC).',
        detailsUr: 'متوفی کا شناختی کارڈ کینسل کروا کر مکمل خاندانی ایف آر سی حاصل کریں۔',
        tipsEn: 'CDA strictly requires FRC with complete tree.',
        tipsUr: 'سی ڈی اے ٹرانسفر کے لیے مکمل ایف آر سی لازمی مانگتا ہے۔',
      },
      {
        stepNumber: 3,
        titleEn: 'NADRA Succession Facilitation Center Islamabad (ICT Act 2021)',
        titleUr: 'مرحلہ 3: نادرا جانشینی مرکز اسلام آباد سے سرٹیفکیٹ',
        officeEn: 'NADRA Succession Facilitation Center (Mauve Area / Blue Area)',
        officeUr: 'نادرا جانشینی سہولت مرکز اسلام آباد',
        timelineEn: '15 - 20 working days',
        timelineUr: '15 سے 20 یوم',
        detailsEn:
          'Apply for Letter of Administration (Immovable CDA Property) and Succession Certificate (Movable Assets). Includes public notice in 2 leading dailies (1 English, 1 Urdu).',
        detailsUr:
          'سی ڈی اے پراپرٹی کے لیے لیٹر آف ایڈمنسٹریشن حاصل کریں۔ دو قومی اخبارات میں 14 روزہ عوامی اشتہار شائع ہوگا۔',
        tipsEn: 'Digital certificate with QR code accepted across all CDA directorates.',
        tipsUr: 'کیو آر کوڈ والا ڈیجیٹل سرٹیفکیٹ سی ڈی اے فوری تسلیم کرتا ہے۔',
      },
      {
        stepNumber: 4,
        titleEn: 'CDA Estate Management-II: Transfer by Inheritance',
        titleUr: 'مرحلہ 4: سی ڈی اے اسٹیٹ مینجمنٹ سے وراثتی ٹرانسفر',
        officeEn: 'CDA One Window Operation / Estate Management Directorate II (G-7/4)',
        officeUr: 'سی ڈی اے ون ونڈو آپریشن / اسٹیٹ مینجمنٹ ڈائریکٹوریٹ',
        timelineEn: '20 - 30 working days',
        timelineUr: '20 سے 30 یوم',
        detailsEn:
          'Submit application at CDA One Window along with NADRA Succession Certificate, Original Allotment/Transfer Letter, Indemnity Bonds on Rs. 100 Stamp Paper, and CDA Public Notice. CDA conducts scrutiny and issues revised Allotment/Transfer Letter in heirs names.',
        detailsUr:
          'سی ڈی اے ون ونڈو پر نادرا سرٹیفکیٹ، اصل الاٹمنٹ لیٹر، مچلکے اور اشتہار جمع کروائیں۔ تصدیق کے بعد ورثاء کے نام نیا الاٹمنٹ لیٹر جاری ہوگا۔',
        tipsEn: 'Obtain Property Tax NOC and Water/Sewerage clearance from CDA beforehand.',
        tipsUr: 'سی ڈی اے سے واٹر اور پراپرٹی ٹیکس این او سی پہلے سے حاصل کر لیں۔',
      },
      {
        stepNumber: 5,
        titleEn: 'ICT Rural Revenue Office (For Rural Sectors & Mauzas)',
        titleUr: 'مرحلہ 5: آئی سی ٹی ریونیو دفتر (دیہی سیکٹرز اور دیہات کے لیے)',
        officeEn: 'Deputy Commissioner ICT Office (G-11/4) / Tehsildar ICT',
        officeUr: 'ڈپٹی کمشنر آئی سی ٹی / تحصیلدار دفتر',
        timelineEn: '15 - 25 working days',
        timelineUr: '15 سے 25 یوم',
        detailsEn: 'For rural land, Patwari and Tehsildar sanction mutation in revenue records.',
        detailsUr: 'دیہی اراضی کا انتقال تحصیلدار آئی سی ٹی کے پاس درج ہوگا۔',
        tipsEn: 'Verify computerized Khasra records at ICT revenue web portal.',
        tipsUr: 'آن لائن پورٹل پر خسرہ نمبر اور کھاتہ چیک کریں۔',
      },
    ],
  },
  ajk_gb: {
    titleEn: 'Azad Kashmir & Gilgit-Baltistan Devolution Guide',
    titleUr: 'آزاد کشمیر اور گلگت بلتستان میں وراثت کا طریقہ کار',
    summaryEn:
      'In AJK & GB, inheritance transfers are administered through local Tehsil Settlement & Revenue Offices under the Land Revenue Act, supported by District Civil Courts for succession certificates.',
    summaryUr:
      'آزاد کشمیر اور گلگت بلتستان میں اراضی کا انتقال مقامی تحصیل بندوبست اور مال گزاری دفاتر میں لینڈ ریونیو ایکٹ اور ضلعی عدالتوں کے ذریعے ہوتا ہے۔',
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Union Council: Computerized Death Certificate',
        titleUr: 'مرحلہ 1: یونین کونسل سے ڈیتھ سرٹیفکیٹ',
        officeEn: 'Concerned Union Council / Municipal Committee',
        officeUr: 'مقامی یونین کونسل',
        timelineEn: '2 - 5 working days',
        timelineUr: '2 سے 5 یوم',
        detailsEn: 'Obtain computerized death certificate from local administration.',
        detailsUr: 'مقامی کونسل سے ڈیتھ سرٹیفکیٹ حاصل کریں۔',
        tipsEn: 'Ensure accurate parentage details.',
        tipsUr: 'کوائف کی درستگی چیک کریں۔',
      },
      {
        stepNumber: 2,
        titleEn: 'NADRA Center: CNIC Cancellation & FRC',
        titleUr: 'مرحلہ 2: نادرا سے شناختی کارڈ منسوخی اور ایف آر سی',
        officeEn: 'NADRA Center Muzaffarabad / Mirpur / Gilgit / Skardu',
        officeUr: 'نادرا سینٹر',
        timelineEn: '1 - 3 working days',
        timelineUr: '1 سے 3 یوم',
        detailsEn: 'Cancel deceased CNIC and receive FRC with complete family tree.',
        detailsUr: 'شناختی کارڈ کینسل کروا کر فیملی رجسٹریشن سرٹیفکیٹ لیں۔',
        tipsEn: 'Crucial for establishing shares before revenue officers.',
        tipsUr: 'ریونیو افسران کے سامنے ورثاء کے تعین کے لیے ضروری ہے۔',
      },
      {
        stepNumber: 3,
        titleEn: 'District Court / Senior Civil Judge: Succession Certificate',
        titleUr: 'مرحلہ 3: ضلعی عدالت سے سکسیشن سرٹیفکیٹ',
        officeEn: 'District Court / Senior Civil Judge',
        officeUr: 'ضلعی عدالت / سینئر سول جج',
        timelineEn: '30 - 60 working days',
        timelineUr: '30 سے 60 یوم',
        detailsEn:
          'File succession petition for movable & immovable property. Court issues public proclamation and awards succession decree according to Shariah shares.',
        detailsUr:
          'عدالت میں درخواست دائر کریں، عدالتی اشتہار کے بعد شرعی حصوں کے مطابق ڈگری جاری کی جائے گی۔',
        tipsEn: 'Ensure all legal heirs are represented.',
        tipsUr: 'تمام قانونی ورثاء کی حاضری یا وکالت نامہ ضروری ہے۔',
      },
      {
        stepNumber: 4,
        titleEn: 'Tehsil Revenue Office: Mutation Sanction (Intiqal Wirasat)',
        titleUr: 'مرحلہ 4: تحصیل مال گزاری دفتر سے انتقالِ وراثت',
        officeEn: 'Tehsildar / Naib Tehsildar / Halqa Patwari Office',
        officeUr: 'تحصیلدار / پٹواری دفتر',
        timelineEn: '15 - 30 working days',
        timelineUr: '15 سے 30 یوم',
        detailsEn:
          'Revenue Officer sanctions mutation into settlement records (Misal-e-Bandobast) and updates Misal Haqdaran.',
        detailsUr: 'ریونیو آفیسر مثلِ بندوبست میں انتقال درج کر کے نیا فرد جاری کرتا ہے۔',
        tipsEn: 'Obtain attested copy of sanctioned mutation (Parcha Intiqal).',
        tipsUr: 'منظور شدہ انتقال کی مصدقہ نقل (پرچہ انتقال) حاصل کریں۔',
      },
    ],
  },
};

export const movableAssetsGuide = {
  titleEn: 'Special Guide: Movable Assets (Banks, Vehicles, Prize Bonds & Stocks)',
  titleUr: 'منقولہ جائیداد کی منتقلی (بینک اکاؤنٹس، گاڑیاں، پرائز بانڈز اور شیئرز)',
  descriptionEn:
    'Important Legal Note: Real-estate land mutation (Intiqal) transfers title to immovable property, but DOES NOT automatically release bank accounts, vehicles, stocks, or government prize bonds. Under Pakistani Law (Succession Act 1925 / NADRA Succession Act 2021), a separate "Succession Certificate" is mandatory for movable financial assets.',
  descriptionUr:
    'اہم قانونی نکتہ: اراضی کا انتقال صرف زمین یا مکان کی منتقلی کے لیے ہوتا ہے۔ بینک اکاؤنٹس، گاڑیاں، قومی بچت اسکیمیں اور پرائز بانڈز حاصل کرنے کے لیے نادرا یا سول کورٹ سے علیحدہ "سکسیشن سرٹیفکیٹ" حاصل کرنا قانونی طور پر لازمی ہے۔',
  categories: [
    {
      nameEn: 'Bank Accounts & Locker Contents',
      nameUr: 'بینک اکاؤنٹس اور لاکرز',
      requirementsEn:
        'Submit original NADRA Succession Certificate / Court Order, Death Certificate, CNICs of all heirs, and Request Form to the deceased branch manager.',
      requirementsUr:
        'بینک مینیجر کو نادرا جانشینی سرٹیفکیٹ، ڈیتھ سرٹیفکیٹ اور تمام ورثاء کے شناختی کارڈز جمع کروائیں، رقم ورثاء کے اکاؤنٹس میں منتقل ہوگی۔',
    },
    {
      nameEn: 'Automobiles & Vehicles (Excise & Taxation)',
      nameUr: 'گاڑیاں اور موٹر سائیکل (ایکسائز ڈیپارٹمنٹ)',
      requirementsEn:
        'Apply for transfer by inheritance at District Excise & Taxation Office. Submit Succession Certificate, Original Smart Card / Registration Book, Physical vehicle inspection, and Biometrics.',
      requirementsUr:
        'ایکسائز اینڈ ٹیکسیشن دفتر میں سکسیشن سرٹیفکیٹ، اصل رجسٹریشن بک، گاڑی کا معائنہ اور ورثاء کا بائیومیٹرک پیش کریں۔',
    },
    {
      nameEn: 'National Savings (Qaumi Bachat) & Prize Bonds',
      nameUr: 'قومی بچت اسکیمیں اور پرائز بانڈز',
      requirementsEn:
        'Submit Succession Certificate to the National Savings Center or State Bank of Pakistan (SBP BSC) to redeem certificates/bonds.',
      requirementsUr:
        'قومی بچت مرکز یا اسٹیٹ بینک میں سکسیشن سرٹیفکیٹ پیش کر کے رقم حاصل کریں۔',
    },
    {
      nameEn: 'Stocks, Shares & CDC Accounts (PSX)',
      nameUr: 'اسٹاک مارکیٹ، شیئرز اور سی ڈی سی اکاؤنٹ',
      requirementsEn:
        'Central Depository Company (CDC) requires NADRA Succession Certificate, Transmission Form, and indemnity bond to transfer shares to heirs sub-accounts.',
      requirementsUr:
        'سی ڈی سی (CDC) میں ٹرانسمیشن فارم اور سکسیشن سرٹیفکیٹ جمع کروا کر شیئرز ورثاء کے اکاؤنٹس میں منتقل کروائیں۔',
    },
  ],
};
