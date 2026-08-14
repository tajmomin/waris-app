import { describe, it, expect } from 'vitest';
import { calculateInheritance, formatFraction } from '../inheritanceCalculator.js';

describe('Waris - Islamic Inheritance Calculator (Sunni/Hanafi)', () => {
  it('Scenario 1: Wife + 2 Sons + 1 Daughter (Standard Family)', () => {
    const result = calculateInheritance({
      deceasedGender: 'male',
      wivesCount: 1,
      sonsCount: 2,
      daughtersCount: 1,
      grossEstate: 10000000,
    });

    expect(result.status).toBe('normal');
    expect(result.totalHeirsCount).toBe(4);

    const wife = result.heirsList.find((h) => h.id === 'wife');
    const sons = result.heirsList.find((h) => h.id === 'sons');
    const daughters = result.heirsList.find((h) => h.id === 'daughters_asabah');

    expect(wife.fractionFormatted).toBe('1/8');
    expect(wife.totalPkr).toBe(1250000);

    expect(sons.fractionFormatted).toBe('7/10'); // 28/40 = 7/10 = 70%
    expect(sons.perIndividualFraction).toBe('7/20'); // 35% each
    expect(sons.totalPkr).toBe(7000000);

    expect(daughters.fractionFormatted).toBe('7/40'); // 17.5%
    expect(daughters.perIndividualFraction).toBe('7/40');
    expect(daughters.totalPkr).toBe(1750000);
  });

  it('Scenario 1b (User Screenshot): Husband + Father + Maternal Grandmother + 2 Sons + 2 Daughters', () => {
    const result = calculateInheritance({
      deceasedGender: 'female',
      husband: true,
      fatherAlive: true,
      maternalGrandmotherAlive: true,
      sonsCount: 2,
      daughtersCount: 2,
      grossEstate: 50000000,
      funeralExpenses: 50000,
    });

    expect(result.status).toBe('normal');
    expect(result.totalHeirsCount).toBe(7);

    const husband = result.heirsList.find((h) => h.id === 'husband');
    const father = result.heirsList.find((h) => h.id === 'father');
    const nani = result.heirsList.find((h) => h.id === 'maternalGrandmother');
    const sons = result.heirsList.find((h) => h.id === 'sons');
    const daughters = result.heirsList.find((h) => h.id === 'daughters_asabah');

    expect(husband.fractionFormatted).toBe('1/4');
    expect(father.fractionFormatted).toBe('1/6');
    expect(nani.fractionFormatted).toBe('1/6');

    // Residue = 1 - (1/4 + 1/6 + 1/6) = 1 - 7/12 = 5/12.
    // 2 sons share 4/6 of 5/12 = 20/72 = 5/18! (No ugly 13889/50000!)
    expect(sons.fractionFormatted).toBe('5/18');
    expect(sons.perIndividualFraction).toBe('5/36');

    // 2 daughters share 2/6 of 5/12 = 10/72 = 5/36! (No ugly 13889/100000!)
    expect(daughters.fractionFormatted).toBe('5/36');
    expect(daughters.perIndividualFraction).toBe('5/72');
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

    expect(husband.fractionFormatted).toBe('1/2');
    expect(mother.fractionFormatted).toBe('1/6');
    expect(father.fractionFormatted).toBe('1/3');
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

    expect(wife.fractionFormatted).toBe('1/8');
    expect(daughter.fractionFormatted).toBe('1/2');
    expect(brother.fractionFormatted).toBe('3/8');
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

    expect(wife.fractionFormatted).toBe('1/9'); // 3/27 = 1/9
    expect(daughters.fractionFormatted).toBe('16/27');
    expect(mother.fractionFormatted).toBe('4/27');
    expect(father.fractionFormatted).toBe('4/27');
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

    expect(husband.fractionFormatted).toBe('3/8');
    expect(mother.fractionFormatted).toBe('1/8');
    expect(sisters.fractionFormatted).toBe('1/2');
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

    expect(mother.fractionFormatted).toBe('1/4');
    expect(daughter.fractionFormatted).toBe('3/4');
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

    expect(result.blockedHeirs.length).toBeGreaterThanOrEqual(2);
    const blockedGrandfather = result.blockedHeirs.find((b) => b.key === 'paternalGrandfather');
    const blockedSiblings = result.blockedHeirs.find((b) => b.key === 'fullSiblings');

    expect(blockedGrandfather).toBeDefined();
    expect(blockedSiblings).toBeDefined();
  });
});
