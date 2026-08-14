# Waris (وارث) — Islamic Inheritance & Property Paperwork Navigator

> **Production-Ready Client-Side Single-Page Web Application for Pakistani Families**  
> Sunni (Hanafi) Fara'iz Inheritance Engine • Province-Wise Property Mutation (Intiqal) & NADRA Navigator

---

## 🌟 Overview & Purpose

**Waris** (وارث) helps Pakistani families navigate two critical tasks following a bereavement:
1. **Islamic Inheritance Calculator (Fara'iz - فرائض)**: Calculates exact Quranic fixed shares (Zawu al-Fara'id), residuary distributions (Asabah), blocking exclusions (Hujub), proportional denominator expansion (Awl), and surplus returns (Radd) under classical Sunni/Hanafi jurisprudence.
2. **Pakistani Property Mutation Navigator (انتقالِ وراثت)**: A comprehensive, province-by-province roadmap covering real-world procedures across **Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Islamabad Capital Territory (ICT), and Azad Kashmir / Gilgit-Baltistan**, alongside NADRA Succession Certificates (Act 2021) and movable financial asset devolution.

---

## 🚀 Quick Start & Local Execution

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# 1. Clone or navigate to the repository
cd waris-app

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# App will launch at http://localhost:5173/
```

### Running Unit Tests
```bash
# Run the Vitest test suite covering all Hanafi edge cases
npm test
# or
npx vitest run
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🕋 Islamic Inheritance (Hanafi Fara'iz) Rules Implemented

The calculation engine (`src/utils/inheritanceCalculator.js`) implements the standard Sunni (Hanafi) rules:

### 1. Estate Liabilities (Huqooq al-Tarkah)
Prior to distribution, the gross estate is reduced by:
1. **Burial & Funeral Expenses** (*Tajheez o Takfeen*)
2. **Debts & Liabilities** (*Duyoon*)
3. **Bequest / Will** (*Wasiyyah* - strictly capped at a maximum of 1/3 of the net remaining after debts, made only to non-heirs)
$$\text{Net Distributable Estate} = \text{Gross Estate} - \text{Funeral} - \text{Debts} - \text{Wasiyyah}$$

### 2. Primary Fixed Sharers (*Zawu al-Fara'id*)
- **Wife / Wives**:
  - Receives **1/8 (12.5%)** if deceased has surviving children (shared equally among up to 4 wives).
  - Receives **1/4 (25%)** if deceased has no surviving children.
- **Husband**:
  - Receives **1/4 (25%)** if deceased has surviving children.
  - Receives **1/2 (50%)** if deceased has no surviving children.
- **Mother**:
  - Receives **1/6 (16.67%)** if deceased has surviving children OR 2+ surviving siblings.
  - Receives **1/3 (33.33%)** if no children and fewer than two siblings.
  - *Gharawayn / Umariyatan Special Case*: When only Spouse + Father + Mother survive, Mother receives **1/3 of the remainder** after spouse share so the Father receives double her share.
- **Father**:
  - Receives **1/6** fixed share with male children (sons).
  - Receives **1/6 + Residue (Asabah)** with female children only (daughters).
  - Inherits entirely as primary **Residuary (Asabah)** when no children exist.
- **Daughters (without Sons)**:
  - **1/2** for a single daughter.
  - **2/3** shared equally among 2 or more daughters.
- **Grandparents & Siblings**:
  - True Grandfather replaces Father if father is deceased.
  - Grandmothers receive **1/6** (shared if both paternal and maternal are eligible).
  - Full / Paternal / Maternal siblings follow standard Quranic shares (Surah An-Nisa 4:12, 4:176).

### 3. Residuaries (*Asabah*)
- **Sons & Daughters (*Asabah bi-Ghayriha*)**:
  - Inherit the remaining residue after Quranic fixed shares.
  - Distributed at a **2:1 ratio** (2 portions per son, 1 portion per daughter) per Surah An-Nisa 4:11 (*Li-dh-dhakari mithlu hazzil unthayayn*).

### 4. Exclusion / Blocking Rules (*Hujub al-Hirman*)
- **Father** blocks Paternal Grandfather and all Brothers & Sisters.
- **Mother** blocks all Grandmothers.
- **Sons** block all Grandchildren and Brothers & Sisters.
- **Full Brothers** block Paternal Brothers & Sisters.

### 5. Awl (Proportional Denominator Expansion)
- When the sum of fixed Quranic shares exceeds 100% (e.g. Husband 1/2 + 2 Sisters 2/3 = 7/6, or the Minbariyyah case = 27/24), the base denominator is expanded to the sum of numerators, proportionally reducing every heir's share fairly without depriving anyone.

### 6. Radd (Surplus Return)
- When the sum of fixed shares is less than 100% and no residuary heir exists, the leftover residue is returned proportionally to the Quranic sharers.

---

## 🏛️ Pakistani Property Paperwork & Mutation Navigator

Detailed, real-world provincial roadmaps and administrative requirements:

| Province / Region | Land Administration Authority | Primary Mechanism |
| :--- | :--- | :--- |
| **Punjab** | Punjab Land Records Authority (PLRA) / Arazi Record Centers (ARC) | Computerized Fard Baraye Wirasat & Digital Mutation |
| **Sindh** | Board of Revenue Sindh (Mukhtiarkar & Tapedar) / e-Zameen | Village Form VII & Musheer-Nama Sanction |
| **Khyber Pakhtunkhwa** | BoR KPK Service Delivery Centers (SDC) | Computerized Fard & Halqa Patwari Verification |
| **Balochistan** | District Revenue Administration (Tehsildar & Patwari) | Misal-e-Haqiat, Shajra Nasab & Jalsa-e-Aam |
| **Islamabad (ICT)** | CDA Estate Management-II & ICT Revenue Department | CDA Transfer by Inheritance & NADRA Facilitation |
| **AJK & Gilgit-Baltistan** | Tehsil Settlement & Revenue Offices / Civil Courts | Misal-e-Bandobast & Court Succession Decrees |

### Movable Assets vs Immovable Property
- Real-estate mutation (Intiqal) transfers title to land/plots, but **does not** release bank accounts, vehicles, prize bonds, or CDC stocks.
- Under the **Letters of Administration & Succession Certificates Act 2021** and **Succession Act 1925**, a formal Succession Certificate is required for movable financial assets.

---

## 🧪 Verified Automated Test Cases

The test suite in `src/utils/__tests__/inheritanceCalculator.test.js` covers 8 classical scenarios with 100% pass rate:
1. **Scenario 1**: Wife + 2 Sons + 1 Daughter (Standard Family)
2. **Scenario 2**: Husband + Mother + Father (Umariyatan / Gharawayn)
3. **Scenario 3**: Wife + 1 Daughter + 1 Full Brother (Daughter 1/2, Brother 3/8)
4. **Scenario 4**: Wife + 2 Daughters + Mother + Father (Minbariyyah Awl to 27)
5. **Scenario 5**: Husband + Mother + 2 Full Sisters (Awl to 8)
6. **Scenario 6**: Mother + 1 Daughter (Radd Case: Mother 1/4, Daughter 3/4)
7. **Scenario 7**: Grandfather & Siblings Blocking
8. **Scenario 8**: Net Estate Deductions (Gross - Funeral - Debts - Wasiyyah)

---

## 🌐 Deploying to Vercel / Netlify / GitHub Pages

### Deploying to Vercel
```bash
npx vercel
# Follow the prompts and select 'dist' as the output directory
```

### Deploying to Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### Deploying to GitHub Pages
```bash
npm install -D gh-pages
# Add "predeploy": "npm run build", "deploy": "gh-pages -d dist" to package.json
npm run deploy
```

---

## ⚖️ Legal & Religious Disclaimer

> **Important**: This application provides calculations based on standard Sunni (Hanafi) Fara'iz principles and Pakistani statutory mutation practices for informational and educational purposes. It does not constitute a formal religious decree (*Fatwa*) or a judicial court ruling. For contested estates, minor heirs, or complex family structures, always consult a qualified Islamic Mufti and an advocate of the High Court.
