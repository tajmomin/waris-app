import { describe, it, expect } from 'vitest';
import { calculateInheritance, formatFraction } from '../inheritanceCalculator.js';

describe('Waris - Islamic Inheritance Calculator (Sunni/Hanafi)', () => {
  it('Scenario 1: Wife + 2 Sons + 1 Daughter (Standard Family)', () => {
    const result = calculateInheritance({
      deceasedGender: 'male',
      wivesCount: 1,
      sonsCount: 2,
      daughtersCount: 1,
      grossEstate: 10000000, // 1 Crore PKR
    });

    expect(result.status).toBe('normal');
    expect(result.totalHeirsCount).toBe(4);

    const wife = result.heirsList.find((h) => h.id === 'wife');
    const sons = result.heirsList.find((h) => h.id === 'sons');
    const daughters = result.heirsList.find((h) => h.id === 'daughters_asabah');

    expect(wife).toBeDefined();
    expect(wife.fractionFormatted).toBe('1/8');
    expect(wife.totalPkr).toBe(1250000); // 12.5% of 10M

    expect(sons).toBeDefined();
    expect(sons.count).toBe(2);
    // Residue = 7/8. Total weights = 2 sons * 2 + 1 daughter * 1 = 5.
    // 2 sons share 4/5 * 7/8 = 28/40 = 7/10 = 70%. Each son gets 35%.
    expect(Number(sons.percentage)).toBeCloseTo(70, 1);
    expect(sons.totalPkr).toBe(7000000);
    expect(sons.perIndividualPkr).toBe(3500000);

    expect(daughters).toBeDefined();
    expect(daughters.count).toBe(1);
    // Daughter share = 1/5 * 7/8 = 7/40 = 17.5%.
    expect(Number(daughters.percentage)).toBeCloseTo(17.5, 1);
    expect(daughters.totalPkr).toBe(1750000);

    const totalPct = result.heirsList.reduce((acc, h) => acc + Number(h.percentage), 0);
    expect(totalPct).toBeCloseTo(100, 1);
  });

  it('Scenario 2: Husband + Mother + Father (Umariyatan / Gharawayn)', () => {
    const result = calculateInheritance({
      deceasedGender: 'female',
      husband: true,
      motherAlive: true,
      fatherAlive: true,
      grossEstate: 6000000,
    });

    expect(result.status).toBe('normal');
    const husband = result.heirsList.find((h) => h.id === 'husband');
    const mother = result.heirsList.find((h) => h.id === 'mother');
    const father = result.heirsList.find((h) => h.id === 'father_pure_asabah');

    // Husband: 1/2 = 50%
    expect(husband.fractionFormatted).toBe('1/2');
    expect(husband.totalPkr).toBe(3000000);

    // Mother: 1/3 of remainder (1/3 of 1/2 = 1/6) = 16.67%
    expect(mother.fractionFormatted).toBe('1/6');
    expect(mother.totalPkr).toBe(1000000);

    // Father: Residue (2/6 = 1/3) = 33.33%
    expect(father.fractionFormatted).toBe('1/3');
    expect(father.totalPkr).toBe(2000000);

    const totalPkr = result.heirsList.reduce((acc, h) => acc + h.totalPkr, 0);
    expect(totalPkr).toBe(6000000);
  });

  it('Scenario 3: Wife + 1 Daughter + 1 Full Brother', () => {
    const result = calculateInheritance({
      deceasedGender: 'male',
      wivesCount: 1,
      daughtersCount: 1,
      fullBrothersCount: 1,
      grossEstate: 8000000,
    });

    expect(result.status).toBe('normal');
    const wife = result.heirsList.find((h) => h.id === 'wife');
    const daughter = result.heirsList.find((h) => h.id === 'daughters');
    const brother = result.heirsList.find((h) => h.id === 'fullBrothers');

    // Wife: 1/8 (1,000,000)
    expect(wife.fractionFormatted).toBe('1/8');
    expect(wife.totalPkr).toBe(1000000);

    // Daughter: 1/2 = 4/8 (4,000,000)
    expect(daughter.fractionFormatted).toBe('1/2');
    expect(daughter.totalPkr).toBe(4000000);

    // Full Brother (Asabah): 3/8 (3,000,000)
    expect(brother.fractionFormatted).toBe('3/8');
    expect(brother.totalPkr).toBe(3000000);

    const totalPct = result.heirsList.reduce((acc, h) => acc + Number(h.percentage), 0);
    expect(totalPct).toBeCloseTo(100, 1);
  });

  it('Scenario 4: Wife + 2 Daughters + Mother + Father (Minbariyyah - Awl to 27)', () => {
    const result = calculateInheritance({
      deceasedGender: 'male',
      wivesCount: 1,
      daughtersCount: 2,
      motherAlive: true,
      fatherAlive: true,
      grossEstate: 27000000,
    });

    expect(result.status).toBe('awl');
    const wife = result.heirsList.find((h) => h.id === 'wife');
    const daughters = result.heirsList.find((h) => h.id === 'daughters');
    const mother = result.heirsList.find((h) => h.id === 'mother');
    const father = result.heirsList.find((h) => h.id === 'father_fard');

    // Original: 3/24 (Wife) + 16/24 (Daughters) + 4/24 (Mother) + 4/24 (Father) = 27/24
    // Awl denominator becomes 27
    expect(wife.fractionFormatted).toBe('1/9'); // 3/27 = 1/9
    expect(wife.totalPkr).toBe(3000000);

    expect(daughters.fractionFormatted).toBe('16/27');
    expect(daughters.totalPkr).toBe(16000000);

    expect(mother.fractionFormatted).toBe('4/27');
    expect(mother.totalPkr).toBe(4000000);

    expect(father.fractionFormatted).toBe('4/27');
    expect(father.totalPkr).toBe(4000000);

    const totalPkr = result.heirsList.reduce((acc, h) => acc + h.totalPkr, 0);
    expect(totalPkr).toBe(27000000);
  });

  it('Scenario 5: Husband + Mother + 2 Full Sisters (Classic Awl to 8)', () => {
    const result = calculateInheritance({
      deceasedGender: 'female',
      husband: true,
      motherAlive: true,
      fullSistersCount: 2,
      grossEstate: 8000000,
    });

    expect(result.status).toBe('awl');
    const husband = result.heirsList.find((h) => h.id === 'husband');
    const mother = result.heirsList.find((h) => h.id === 'mother');
    const sisters = result.heirsList.find((h) => h.id === 'fullSisters');

    // Husband: 3/8
    expect(husband.fractionFormatted).toBe('3/8');
    expect(husband.totalPkr).toBe(3000000);

    // Mother: 1/8 (since >= 2 siblings exist, mother original share was 1/6 = 1/6 of 6 -> 1/8 in Awl)
    expect(mother.fractionFormatted).toBe('1/8');
    expect(mother.totalPkr).toBe(1000000);

    // 2 Sisters: 4/8 = 1/2
    expect(sisters.fractionFormatted).toBe('1/2');
    expect(sisters.totalPkr).toBe(4000000);

    const totalPkr = result.heirsList.reduce((acc, h) => acc + h.totalPkr, 0);
    expect(totalPkr).toBe(8000000);
  });

  it('Scenario 6: Mother + 1 Daughter (Radd Case)', () => {
    const result = calculateInheritance({
      deceasedGender: 'male',
      motherAlive: true,
      daughtersCount: 1,
      grossEstate: 4000000,
    });

    expect(result.status).toBe('radd');
    const mother = result.heirsList.find((h) => h.id === 'mother');
    const daughter = result.heirsList.find((h) => h.id === 'daughters');

    // Mother: original 1/6 (1 portion), Daughter: original 1/2 = 3/6 (3 portions).
    // Sum = 4 portions. Mother gets 1/4 (25%), Daughter gets 3/4 (75%).
    expect(mother.fractionFormatted).toBe('1/4');
    expect(mother.totalPkr).toBe(1000000);

    expect(daughter.fractionFormatted).toBe('3/4');
    expect(daughter.totalPkr).toBe(3000000);
  });

  it('Scenario 7: Blocking (Father blocks grandfather and siblings)', () => {
    const result = calculateInheritance({
      deceasedGender: 'male',
      wivesCount: 1,
      fatherAlive: true,
      motherAlive: true,
      paternalGrandfatherAlive: true,
      fullBrothersCount: 2,
      fullSistersCount: 1,
      sonsCount: 1,
    });

    // Grandfather and siblings must be in blockedHeirs
    expect(result.blockedHeirs.length).toBeGreaterThanOrEqual(2);
    const blockedGrandfather = result.blockedHeirs.find((b) => b.key === 'paternalGrandfather');
    const blockedSiblings = result.blockedHeirs.find((b) => b.key === 'fullSiblings');

    expect(blockedGrandfather).toBeDefined();
    expect(blockedSiblings).toBeDefined();
  });

  it('Scenario 8: Net Estate Deductions Calculation', () => {
    const result = calculateInheritance({
      deceasedGender: 'male',
      wivesCount: 1,
      sonsCount: 1,
      grossEstate: 10000000,
      funeralExpenses: 100000,
      debts: 900000,
      wasiyyah: 1000000,
    });

    // Gross (10M) - Funeral (100k) - Debts (900k) = 9M
    // Wasiyyah (1M) <= 1/3 of 9M (3M) -> Net Estate = 8M PKR
    expect(result.netEstate).toBe(8000000);

    const wife = result.heirsList.find((h) => h.id === 'wife');
    const son = result.heirsList.find((h) => h.id === 'sons');

    // Wife: 1/8 of 8M = 1M
    expect(wife.totalPkr).toBe(1000000);
    // Son: 7/8 of 8M = 7M
    expect(son.totalPkr).toBe(7000000);
  });
});
