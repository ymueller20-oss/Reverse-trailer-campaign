/* Rückwärts-Modell: vom Ziel-Einspiel zur nötigen Reichweite und zum Budget.
   Alle Parameter sind Faustwerte, keine Messwerte. */
(function (root) {
  function compute(p, shares) {
    const admissions = p.gross / p.ticket;                 // Besucher gesamt (Mio.)
    const openAdm = admissions * p.opening;                // Besucher im Opening
    const legsAdm = admissions - openAdm;                  // Besucher danach
    const diPool = openAdm / p.conv;                       // Menschen mit "Definite Interest"
    const reach = diPool / p.diRate;                       // erreichte Menschen
    const impressions = reach * p.freq;                    // Kontakte gesamt (Mio.)
    const paid = impressions / 1000 * p.cpm;               // Paid-Media-Kosten (Mio.)
    const paidShare = shares[4] / 100;
    const pa = paid / paidShare;                           // Gesamt-P&A (Mio.)
    const total = p.budget + pa;
    const breakEven = total / p.rental;                    // nötiges Einspiel für Kino-Break-even
    const byLevel = shares.map(s => pa * s / 100);
    // Sensitivität: Trailer/Creative verbessert Definite-Interest-Rate um 20 %
    const paidBetter = impressions / 1.2 / 1000 * p.cpm;
    const saving = paid - paidBetter;
    return {
      admissions, openAdm, legsAdm, diPool, reach, impressions, paid, pa, total,
      breakEven, byLevel, saving,
      multiplier: 1 / p.opening,
      paRatio: p.budget > 0 ? pa / p.budget : NaN,
      studioShare: p.gross * p.rental,
      net: p.gross * p.rental - total
    };
  }
  const api = { compute };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Calc = api;
})(typeof window !== 'undefined' ? window : globalThis);
