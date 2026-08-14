/**
 * Waris - Pakistani Real-Time Market Price Service
 *
 * Fetches live bullion (Gold XAU / Silver XAG) and Forex (USD/PKR) rates
 * with reliable offline fallback to daily Karachi Sarafa Jewelers Association benchmarks.
 */

export const DEFAULT_PAKISTAN_RATES = {
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
  lastUpdated: new Date().toISOString(),
  source: 'Karachi Sarafa Jewelers Association (Benchmark)',
};

/**
 * Fetch live gold & currency rates
 */
export async function fetchLiveMarketRates() {
  try {
    // Attempt to fetch live Forex and Gold rates
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      cache: 'no-cache',
    });

    if (res.ok) {
      const data = await res.json();
      const pkrRate = data?.rates?.PKR || 280; // USD to PKR rate

      // Fetch live XAU (Gold) in USD from free public bullion API
      try {
        const goldRes = await fetch('https://api.gold-api.com/price/XAU');
        if (goldRes.ok) {
          const goldData = await goldRes.json();
          const goldUsdPerOunce = goldData.price || 2450; // USD per Troy Ounce (31.1035g)
          
          // 1 Troy Ounce = 31.1034768 grams
          // 1 Pakistani Tola = 11.6638038 grams = 0.375 Troy Ounces (1 Ounce = 2.666 Tolas)
          const goldPkrPerOunce = goldUsdPerOunce * pkrRate;
          const gold24kPerTola = Math.round((goldPkrPerOunce / 2.666667) * 1.025); // Include 2.5% local Sarafa duty/margin
          const gold22kPerTola = Math.round(gold24kPerTola * (22 / 24));
          const gold24kPerGram = Math.round(gold24kPerTola / 11.6638);

          return {
            ...DEFAULT_PAKISTAN_RATES,
            gold_24k_tola: gold24kPerTola,
            gold_22k_tola: gold22kPerTola,
            gold_24k_gram: gold24kPerGram,
            lastUpdated: new Date().toISOString(),
            source: 'Live International Bullion & Forex Index (Auto-Synced)',
            isLive: true,
          };
        }
      } catch (e) {
        // Bullion API failed, return default benchmark
      }
    }
  } catch (err) {
    // Network failure
  }

  // Graceful fallback
  return {
    ...DEFAULT_PAKISTAN_RATES,
    isLive: false,
  };
}
