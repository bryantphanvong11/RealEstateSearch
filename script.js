/* ═══════════════════════════════════════════════════════════════════════
   Renton WA Home Finder 2026 — JavaScript
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Neighborhood Data ─────────────────────────────────────────────────── */
const NEIGHBORHOODS = [
  {
    name: "Downtown / Central Renton",
    zip: "98057",
    sfhMedian: 602500,
    condoMedian: 330000,
    priceRange: "$280K – $700K",
    desc: "Urban core with walkable shops, transit access, and the most affordable entry point in Renton.",
    features: ["affordable", "commute", "nearSeattle", "transit"],
    schoolRating: 3,
    crime: "moderate",
    dom: 13,
    lakefront: false,
    nearSeattle: true,
    highlight: "Lowest entry prices in Renton — ideal for first-time buyers"
  },
  {
    name: "Highlands / Sunset",
    zip: "98056",
    sfhMedian: 625000,
    condoMedian: null,
    priceRange: "$550K – $720K",
    desc: "Established neighborhood with community feel, solid schools, and easy I-405 access.",
    features: ["affordable", "schools", "commute", "quiet", "safety"],
    schoolRating: 4,
    crime: "low",
    dom: 20,
    lakefront: false,
    nearSeattle: false,
    highlight: "Family-friendly with improving schools and strong community"
  },
  {
    name: "North Renton",
    zip: "98056",
    sfhMedian: 630000,
    condoMedian: null,
    priceRange: "$560K – $700K",
    desc: "Quiet residential area with direct highway access and proximity to Gene Coulon Park.",
    features: ["affordable", "commute", "nearSeattle", "quiet", "nature"],
    schoolRating: 3,
    crime: "low",
    dom: 18,
    lakefront: false,
    nearSeattle: true,
    highlight: "Close to Gene Coulon Park and quick I-405 access"
  },
  {
    name: "Talbot Hill",
    zip: "98055",
    sfhMedian: 680000,
    condoMedian: null,
    priceRange: "$600K – $780K",
    desc: "Elevated neighborhood with sweeping valley and mountain views and tree-lined streets.",
    features: ["views", "quiet", "safety", "nature"],
    schoolRating: 4,
    crime: "low",
    dom: 22,
    lakefront: false,
    nearSeattle: false,
    highlight: "Panoramic mountain and valley views"
  },
  {
    name: "Benson Hill",
    zip: "98058",
    sfhMedian: 700000,
    condoMedian: null,
    priceRange: "$620K – $820K",
    desc: "Fast-growing enclave with newer construction, great schools, and a safe environment.",
    features: ["schools", "safety", "quiet", "nature"],
    schoolRating: 5,
    crime: "veryLow",
    dom: 25,
    lakefront: false,
    nearSeattle: false,
    highlight: "Top-rated schools + newer homes"
  },
  {
    name: "Cedar River",
    zip: "98058",
    sfhMedian: 727000,
    condoMedian: null,
    priceRange: "$650K – $850K",
    desc: "Scenic natural setting along the Cedar River trail system with outdoor recreation.",
    features: ["nature", "quiet", "views", "safety", "trails"],
    schoolRating: 4,
    crime: "veryLow",
    dom: 28,
    lakefront: false,
    nearSeattle: false,
    highlight: "Outdoor recreation and natural beauty"
  },
  {
    name: "West Hill",
    zip: "98055",
    sfhMedian: 735000,
    condoMedian: null,
    priceRange: "$650K – $850K",
    desc: "Elevated community with city views, diverse culture, and convenient SeaTac access.",
    features: ["views", "commute", "nearSeattle", "community"],
    schoolRating: 3,
    crime: "low",
    dom: 24,
    lakefront: false,
    nearSeattle: true,
    highlight: "City views + quick access to SeaTac & I-5"
  },
  {
    name: "East Renton / Fairwood",
    zip: "98059",
    sfhMedian: 850000,
    condoMedian: null,
    priceRange: "$750K – $1.1M",
    desc: "Sought-after suburban corridor with Hazen & Liberty HS, newer builds, and quiet cul-de-sacs.",
    features: ["schools", "safety", "quiet", "nature", "views"],
    schoolRating: 8,
    crime: "veryLow",
    dom: 33,
    lakefront: false,
    nearSeattle: false,
    highlight: "Liberty & Hazen HS — best schools in Renton"
  },
  {
    name: "Kennydale (Lower / Lake)",
    zip: "98056",
    sfhMedian: 1320000,
    condoMedian: null,
    priceRange: "$900K – $3M+",
    desc: "Renton's most prestigious neighborhood — steps from Lake Washington with luxury homes and Gene Coulon Park.",
    features: ["lakefront", "views", "schools", "safety", "nearSeattle", "nature"],
    schoolRating: 8,
    crime: "veryLow",
    dom: 30,
    lakefront: true,
    nearSeattle: true,
    highlight: "Lake Washington access · Gene Coulon Park · Olympic Mountain views"
  }
];


/* ── Storage Key ───────────────────────────────────────────────────────── */
const STORAGE_KEY = "renton_hf_apps";


/* ══════════════════════════════════════════════════════════════════════════
   SECTION 1 — UI Helpers
   ══════════════════════════════════════════════════════════════════════════ */

/** Format a number as a dollar string, e.g. 120000 → "$120,000" */
const fmt = v => "$" + Math.round(v).toLocaleString();

/** Sync a range slider's label to its current value */
function updateRange(inputId, outputId, formatter) {
  const value = document.getElementById(inputId).value;
  document.getElementById(outputId).textContent = formatter(value);
}

/** Select exactly one radio option in a group */
function selectRadio(clickedEl, groupId) {
  document.querySelectorAll("#" + groupId + " .option-btn").forEach(btn => {
    btn.classList.remove("selected");
  });
  clickedEl.classList.add("selected");
}

/** Toggle a checkbox-style option button on/off */
function toggleCheck(el) {
  el.classList.toggle("selected");
}

/** Return the data-val of the selected radio in a group */
function getRadioVal(groupId) {
  const selected = document.querySelector("#" + groupId + " .option-btn.selected");
  return selected ? selected.dataset.val : null;
}

/** Return an array of data-val for all checked buttons in a group */
function getChecked(groupId) {
  return Array.from(
    document.querySelectorAll("#" + groupId + " .option-btn.selected")
  ).map(el => el.dataset.val);
}

/** Reset a radio group so only the button with defaultVal is selected */
function resetRadio(groupId, defaultVal) {
  document.querySelectorAll("#" + groupId + " .option-btn").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.val === defaultVal);
  });
}


/* ══════════════════════════════════════════════════════════════════════════
   SECTION 2 — Step Navigation
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Show a specific wizard step (1, 2, or 3).
 * Visibility is driven entirely by style.display so that previously set
 * inline styles never block a step from reappearing.
 */
function goStep(n) {
  [1, 2, 3].forEach(i => {
    document.getElementById("step" + i).style.display = (i === n) ? "block" : "none";

    const dot = document.getElementById("ps" + i);
    dot.classList.remove("active", "done");
    if (i < n)  dot.classList.add("done");
    if (i === n) dot.classList.add("active");
  });

  document.getElementById("progressWrap").style.display = "block";
  document.getElementById("savedPanel").style.display   = "none";
  document.getElementById("results").style.display      = "none";

  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* ══════════════════════════════════════════════════════════════════════════
   SECTION 3 — localStorage Persistence
   ══════════════════════════════════════════════════════════════════════════ */

/** Load all saved applications from localStorage */
function loadApps() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

/** Prepend a new application record; cap history at 10 entries */
function saveApp(app) {
  try {
    const apps = loadApps();
    apps.unshift(app);
    if (apps.length > 10) apps.splice(10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {
    // localStorage may be unavailable (private browsing, quota exceeded)
  }
}

/** Remove a single application by its id */
function deleteApp(id) {
  try {
    const apps = loadApps().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    renderSavedPanel();
  } catch (e) {}
}

/** Delete every saved application after user confirmation */
function clearAllSaved() {
  if (confirm("Delete all saved applications?")) {
    localStorage.removeItem(STORAGE_KEY);
    document.getElementById("savedPanel").style.display = "none";
    startFresh();
  }
}

/** Return a human-readable label for a credit score number */
function creditLabel(v) {
  if (v >= 760) return "Excellent";
  if (v >= 720) return "Very Good";
  if (v >= 680) return "Good";
  if (v >= 640) return "Fair";
  if (v >= 620) return "Min Conv.";
  if (v >= 580) return "FHA";
  return "Below 580";
}


/* ══════════════════════════════════════════════════════════════════════════
   SECTION 4 — Saved Applications Panel
   ══════════════════════════════════════════════════════════════════════════ */

/** Render the saved-applications list into #savedList */
function renderSavedPanel() {
  const apps = loadApps();
  const list = document.getElementById("savedList");

  if (!apps.length) {
    list.innerHTML = '<div class="no-saved">No saved applications yet.</div>';
    return;
  }

  list.innerHTML = apps.map(a => `
    <div class="saved-item fade-in">
      <div>
        <div class="saved-item-meta">${a.date} · ${a.occupation} · ${a.firstTime ? "First-time buyer" : "Prior owner"}</div>
        <div class="saved-item-title">
          ${fmt(a.annualIncome)}/yr income · ${fmt(a.downPayment)} down · Credit: ${creditLabel(a.credit)}
        </div>
        <div class="saved-item-sub">
          Max home: <strong>${fmt(a.maxHome)}</strong> ·
          Est. ${fmt(a.monthlyPayment)}/mo ·
          Top match: ${a.topNeighborhood}
        </div>
      </div>
      <div class="saved-item-actions">
        <button class="btn btn-primary btn-sm" onclick="loadApp('${a.id}')">Load ↗</button>
        <button class="badge-del" onclick="deleteApp('${a.id}')">Remove</button>
      </div>
    </div>
  `).join("");
}

/**
 * Called when the user clicks "Start Over" from the results page.
 * If there are saved sessions, show the panel; otherwise go straight to step 1.
 */
function showRestartOptions() {
  document.getElementById("results").style.display      = "none";
  document.getElementById("progressWrap").style.display = "none";
  [1, 2, 3].forEach(i => document.getElementById("step" + i).style.display = "none");

  const apps = loadApps();
  if (apps.length > 0) {
    renderSavedPanel();
    document.getElementById("savedPanel").style.display = "block";
  } else {
    startFresh();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Reset all form fields to defaults and go to step 1 */
function startFresh() {
  // Sliders
  document.getElementById("income").value = 120000;
  document.getElementById("debts").value  = 500;
  document.getElementById("down").value   = 80000;
  updateRange("income", "incomeVal", fmt);
  updateRange("debts",  "debtsVal",  fmt);
  updateRange("down",   "downVal",   fmt);

  // Selects
  document.getElementById("credit").value     = 680;
  document.getElementById("employment").value = "w2";
  document.getElementById("occupation").value = "other";
  document.getElementById("household").value  = 2;

  // Radio groups
  resetRadio("propType",  "sfh");
  resetRadio("beds",      "2");
  resetRadio("firstTime", "yes");
  resetRadio("timeline",  "asap");

  // Checkboxes — clear all
  document.querySelectorAll("#priorities .option-btn").forEach(btn => {
    btn.classList.remove("selected");
  });

  document.getElementById("savedPanel").style.display = "none";
  goStep(1);
}

/** Load a previously saved application into the form, then jump to results */
function loadApp(id) {
  const app = loadApps().find(a => a.id === id);
  if (!app) return;

  // Restore sliders
  document.getElementById("income").value = app.annualIncome;
  document.getElementById("debts").value  = app.monthlyDebts;
  document.getElementById("down").value   = app.downPayment;
  updateRange("income", "incomeVal", fmt);
  updateRange("debts",  "debtsVal",  fmt);
  updateRange("down",   "downVal",   fmt);

  // Restore selects
  document.getElementById("credit").value     = app.credit;
  document.getElementById("employment").value = app.employment;
  document.getElementById("occupation").value = app.occupation;
  document.getElementById("household").value  = app.household;

  // Restore radio groups
  resetRadio("propType",  app.propType);
  resetRadio("beds",      app.beds);
  resetRadio("firstTime", app.firstTime ? "yes" : "no");
  resetRadio("timeline",  app.timeline);

  // Restore checkboxes
  document.querySelectorAll("#priorities .option-btn").forEach(btn => {
    btn.classList.toggle("selected", app.priorities.includes(btn.dataset.val));
  });

  document.getElementById("savedPanel").style.display = "none";

  // Jump straight to results with the loaded data
  showResultsFromData(app);
}


/* ══════════════════════════════════════════════════════════════════════════
   SECTION 5 — Financial Calculations
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Return the estimated 30-year fixed mortgage rate for a given credit score.
 * Rates are approximate 2026 market estimates.
 */
function getMortgageRate(credit) {
  if (credit >= 760) return 0.0625;
  if (credit >= 720) return 0.0650;
  if (credit >= 680) return 0.0675;
  if (credit >= 640) return 0.0700;
  if (credit >= 620) return 0.0725;
  if (credit >= 580) return 0.0775;
  return 0.0900;
}

/**
 * Standard mortgage payment formula (Principal & Interest only).
 * @param {number} principal - Loan amount in dollars
 * @param {number} annualRate - Decimal annual rate (e.g. 0.065)
 * @param {number} years - Loan term in years (default 30)
 */
function calcMonthlyPI(principal, annualRate, years = 30) {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

/**
 * Binary-search for the maximum home price where total PITI (Principal,
 * Interest, Taxes, Insurance) equals the user's maximum allowable payment
 * under the 28% front-end and 43% back-end DTI rules.
 */
function calcMaxHome(annualIncome, monthlyDebts, credit, downPayment) {
  const mi = annualIncome / 12;
  const rate = getMortgageRate(credit);
  const maxFrontEnd = mi * 0.28;                         // 28% rule
  const maxBackEnd  = mi * 0.43 - monthlyDebts;          // 43% rule less existing debts
  const maxPayment  = Math.max(0, Math.min(maxFrontEnd, maxBackEnd));

  // King County effective property tax: 0.84%/yr
  // Homeowner's insurance estimate: 0.60%/yr
  // Monthly combined: (homePrice × 0.0144) / 12
  let lo = 0, hi = 5_000_000;
  for (let i = 0; i < 60; i++) {
    const mid  = (lo + hi) / 2;
    const loan = Math.max(0, mid - downPayment);
    const piti = calcMonthlyPI(loan, rate) + (mid * 0.0144 / 12);
    if (piti < maxPayment) lo = mid; else hi = mid;
  }
  return Math.round((lo + hi) / 2);
}

/**
 * Return a full monthly cost breakdown for a specific home price.
 * @returns {{ pmt, tax, ins, pmi, total, loan }}
 */
function calcBreakdown(homePrice, downPayment, annualRate) {
  const loan = Math.max(0, homePrice - downPayment);
  const p    = calcMonthlyPI(loan, annualRate);
  const tax  = homePrice * 0.0084 / 12;                 // King County 0.84%
  const ins  = homePrice * 0.006  / 12;                 // ~0.60% homeowner's insurance
  const pmi  = (downPayment / homePrice < 0.20)
    ? loan * 0.0085 / 12                                 // PMI if < 20% down
    : 0;
  return { pmt: p, tax, ins, pmi, total: p + tax + ins + pmi, loan };
}

/**
 * Score a neighborhood 1–99 based on budget fit and priority alignment.
 * Higher score = better match for this user's profile.
 */
function scoreNeighborhood(nh, maxHome, downPayment, priorities, propType, credit) {
  let score = 0;
  const targetPrice = (propType === "condo" && nh.condoMedian) ? nh.condoMedian : nh.sfhMedian;
  const ratio = maxHome / targetPrice;

  // Budget fit (up to 38 pts)
  if      (ratio >= 1.2)  score += 38;
  else if (ratio >= 1.0)  score += 32;
  else if (ratio >= 0.85) score += 20;
  else if (ratio >= 0.70) score += 10;
  else                    score +=  2;

  // Priority match (up to 40 pts)
  const featureMatch = {
    schools:    nh.schoolRating >= 5,
    affordable: targetPrice <= 700_000,
    lakefront:  nh.lakefront,
    commute:    nh.features.includes("commute"),
    nearSeattle: nh.nearSeattle,
    quiet:      nh.features.includes("quiet") || nh.features.includes("safety"),
    views:      nh.features.includes("views"),
    safety:     nh.crime === "veryLow" || nh.crime === "low",
    nature:     nh.features.includes("nature") || nh.features.includes("trails"),
  };
  const hits = priorities.filter(p => featureMatch[p]).length;
  score += Math.round((hits / Math.max(priorities.length, 1)) * 40);

  // Loan type bonus / penalty (up to +20 pts)
  const isJumbo = (targetPrice - downPayment) > 806_500;
  if (isJumbo && credit < 700)   score -= 10;
  else if (!isJumbo && credit >= 620) score += 12;
  else if (!isJumbo)             score +=  5;

  if      (credit >= 760) score += 8;
  else if (credit >= 720) score += 5;

  return Math.min(99, Math.max(1, score));
}


/* ══════════════════════════════════════════════════════════════════════════
   SECTION 6 — Results Rendering
   ══════════════════════════════════════════════════════════════════════════ */

/** Collect form values and hand off to showResultsFromData */
function showResults() {
  const data = {
    annualIncome: parseInt(document.getElementById("income").value),
    monthlyDebts: parseInt(document.getElementById("debts").value),
    downPayment:  parseInt(document.getElementById("down").value),
    credit:       parseInt(document.getElementById("credit").value),
    employment:   document.getElementById("employment").value,
    propType:     getRadioVal("propType")  || "sfh",
    beds:         getRadioVal("beds")      || "2",
    priorities:   getChecked("priorities"),
    occupation:   document.getElementById("occupation").value,
    household:    parseInt(document.getElementById("household").value),
    firstTime:    getRadioVal("firstTime") === "yes",
    timeline:     getRadioVal("timeline")  || "asap",
  };
  showResultsFromData(data);
}

/**
 * Build and render the full results page from a data object.
 * Works for both fresh submissions and loaded saved applications.
 */
function showResultsFromData(data) {
  const {
    annualIncome, monthlyDebts, downPayment, credit, employment,
    propType, beds, priorities, occupation, household, firstTime, timeline
  } = data;

  const mi      = annualIncome / 12;
  const maxHome = data.maxHome || calcMaxHome(annualIncome, monthlyDebts, credit, downPayment);
  const rate    = getMortgageRate(credit);
  const bd      = calcBreakdown(maxHome, downPayment, rate);
  const dti     = (monthlyDebts + bd.total) / mi;
  const downPct = downPayment / maxHome * 100;
  const isJumbo = (maxHome - downPayment) > 806_500;

  // Score and sort neighborhoods
  const scored = NEIGHBORHOODS
    .map(nh => ({
      ...nh,
      score: scoreNeighborhood(nh, maxHome, downPayment, priorities, propType, credit),
      targetPrice: (propType === "condo" && nh.condoMedian) ? nh.condoMedian : nh.sfhMedian,
    }))
    .sort((a, b) => b.score - a.score);

  // ── Persist new application (only if not a loaded one) ──
  if (!data.id) {
    const now     = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
    saveApp({
      id:              "app_" + Date.now(),
      date:            dateStr,
      annualIncome, monthlyDebts, downPayment, credit, employment,
      propType, beds, priorities, occupation, household, firstTime, timeline,
      maxHome,
      monthlyPayment:  Math.round(bd.total),
      dtiPct:          Math.round(dti * 100),
      topNeighborhood: scored[0].name,
    });
    document.getElementById("appLabel").textContent = "Saved · " + dateStr;
  } else {
    document.getElementById("appLabel").textContent = "Loaded · " + data.date;
  }

  // ── Build eligibility checks ──
  const frontDTI = bd.total / mi;
  const eligChecks = [
    {
      pass: frontDTI <= 0.28,
      warn: frontDTI > 0.28 && frontDTI <= 0.31,
      icon: frontDTI <= 0.28 ? "✓" : frontDTI <= 0.31 ? "!" : "✗",
      text: "Housing Cost Ratio",
      detail: Math.round(frontDTI * 100) + "% of income (target: ≤28%)",
    },
    {
      pass: dti <= 0.43,
      warn: dti > 0.36 && dti <= 0.43,
      icon: dti <= 0.36 ? "✓" : dti <= 0.43 ? "!" : "✗",
      text: "Total Debt-to-Income",
      detail: Math.round(dti * 100) + "% (conventional limit: 43%)",
    },
    {
      pass: credit >= 680,
      warn: credit >= 620 && credit < 680,
      icon: credit >= 680 ? "✓" : credit >= 620 ? "!" : "✗",
      text: "Credit Score",
      detail: credit >= 760 ? "Excellent — best available rates"
            : credit >= 720 ? "Very good — strong approval odds"
            : credit >= 680 ? "Good — conventional loan eligible"
            : credit >= 640 ? "Fair — higher rate, limited programs"
            : credit >= 620 ? "Minimum conventional threshold"
            : credit >= 580 ? "FHA loans available (3.5% down)"
            : "Limited options — hard money or 10%+ FHA",
    },
    {
      pass: downPct >= 20,
      warn: downPct >= 3.5 && downPct < 20,
      icon: downPct >= 20 ? "✓" : downPct >= 3.5 ? "!" : "✗",
      text: "Down Payment",
      detail: Math.round(downPct) + "% of max price" + (downPct < 20 ? " — PMI required" : " — no PMI needed"),
    },
    {
      pass: !isJumbo || credit >= 700,
      warn: isJumbo && credit >= 700 && credit < 740,
      icon: (!isJumbo || credit >= 700) ? "✓" : "!",
      text: isJumbo ? "Jumbo Loan Required" : "Conventional Loan",
      detail: isJumbo
        ? "Loan >" + fmt(806500) + " — requires 700+ credit & 10–20% down"
        : "Loan within conforming limits (" + fmt(806500) + ")",
    },
  ];

  // ── Switch view: hide wizard, show results ──
  [1, 2, 3].forEach(i => document.getElementById("step" + i).style.display = "none");
  document.getElementById("progressWrap").style.display = "none";
  document.getElementById("savedPanel").style.display   = "none";
  document.getElementById("results").style.display      = "block";

  // ── Summary metric cards ──
  const dtiClass = dti <= 0.36 ? "green" : dti <= 0.43 ? "amber" : "red";
  document.getElementById("summaryCards").innerHTML = `
    <div class="s-card green">
      <div class="s-label">Max Home Price</div>
      <div class="s-val">${fmt(maxHome)}</div>
      <div class="s-sub">Based on 28% front-end DTI</div>
    </div>
    <div class="s-card">
      <div class="s-label">Est. Monthly Payment</div>
      <div class="s-val">${fmt(bd.total)}</div>
      <div class="s-sub">At max budget · ${Math.round(rate * 10000) / 100}% rate</div>
    </div>
    <div class="s-card ${dtiClass}">
      <div class="s-label">Back-End DTI</div>
      <div class="s-val">${Math.round(dti * 100)}%</div>
      <div class="s-sub">All debts / gross income</div>
    </div>
    <div class="s-card">
      <div class="s-label">Loan Amount</div>
      <div class="s-val">${fmt(bd.loan)}</div>
      <div class="s-sub">${isJumbo ? "Jumbo loan" : "Conforming loan"}</div>
    </div>
    <div class="s-card">
      <div class="s-label">Down Payment</div>
      <div class="s-val">${Math.round(downPct)}%</div>
      <div class="s-sub">${fmt(downPayment)} saved</div>
    </div>`;

  // ── Eligibility items ──
  document.getElementById("eligItems").innerHTML = eligChecks.map(e => `
    <div class="elig-item ${e.pass ? "pass" : e.warn ? "warn" : "fail"}">
      <div class="elig-icon">${e.icon}</div>
      <div class="elig-text">${e.text}<small>${e.detail}</small></div>
    </div>`).join("");

  // ── Monthly breakdown ──
  document.getElementById("affordRows").innerHTML = `
    <div class="afford-row">
      <span class="label">Principal &amp; Interest</span>
      <span class="val">${fmt(bd.pmt)}/mo</span>
    </div>
    <div class="afford-row">
      <span class="label">Property Tax (King County 0.84%)</span>
      <span class="val">${fmt(bd.tax)}/mo</span>
    </div>
    <div class="afford-row">
      <span class="label">Homeowner's Insurance (~0.6%)</span>
      <span class="val">${fmt(bd.ins)}/mo</span>
    </div>
    ${bd.pmi > 0 ? `
    <div class="afford-row">
      <span class="label">PMI (&lt; 20% down · ~0.85%)</span>
      <span class="val">${fmt(bd.pmi)}/mo</span>
    </div>` : ""}
    <div class="afford-row">
      <span class="label">Existing Monthly Debts</span>
      <span class="val">${fmt(monthlyDebts)}/mo</span>
    </div>
    <div class="afford-row total">
      <span class="label">Total Monthly Obligation</span>
      <span class="val">${fmt(bd.total + monthlyDebts)}/mo</span>
    </div>`;

  // ── Neighborhood cards ──
  document.getElementById("nhCards").innerHTML = scored.map((nh, i) => {
    const isTop       = i < 2;
    const nhBd        = calcBreakdown(nh.targetPrice, downPayment, rate);
    const canAfford   = nh.targetPrice <= maxHome * 1.05;
    const stretch     = nh.targetPrice > maxHome * 1.05 && nh.targetPrice <= maxHome * 1.25;
    const scoreBgClass = nh.score >= 70 ? "" : nh.score >= 45 ? "amber-bg" : "red-bg";

    const statusTag = canAfford
      ? `<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:#EBF5EE;color:var(--success);font-weight:600">Within Budget</span>`
      : stretch
      ? `<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:#FEF6E4;color:var(--warn);font-weight:600">Slight Stretch</span>`
      : `<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:#FEF0EE;color:var(--danger);font-weight:600">Above Budget</span>`;

    const fm = {
      schools:    nh.schoolRating >= 5,
      affordable: nh.targetPrice <= 700_000,
      lakefront:  nh.lakefront,
      commute:    nh.features.includes("commute"),
      nearSeattle: nh.nearSeattle,
      quiet:      nh.features.includes("quiet") || nh.features.includes("safety"),
      views:      nh.features.includes("views"),
      safety:     nh.crime === "veryLow" || nh.crime === "low",
      nature:     nh.features.includes("nature") || nh.features.includes("trails"),
    };

    const allTags = nh.features.map(f =>
      `<span class="tag ${(priorities.includes(f) || fm[f]) ? "match" : ""}">${f}</span>`
    ).join("");

    return `
    <div class="nh-card ${isTop ? "top-match" : ""} fade-in">
      <div style="padding:6px 16px;background:${isTop ? "var(--forest)" : "var(--cream-dark)"};display:flex;align-items:center;gap:8px">
        <span style="font-size:${isTop ? "10" : "11"}px;font-weight:${isTop ? "700" : "400"};
                     text-transform:${isTop ? "uppercase" : "none"};
                     letter-spacing:${isTop ? "0.08em" : "normal"};
                     color:${isTop ? "var(--gold-light)" : "var(--text-muted)"}">
          ${isTop ? "★ Top Match #" + (i + 1) : "Match #" + (i + 1)}
        </span>${statusTag}
      </div>
      <div class="nh-card-inner">
        <div class="nh-score-col ${scoreBgClass}">
          <div class="nh-score">${nh.score}</div>
          <div class="nh-score-label">Score</div>
        </div>
        <div class="nh-body">
          <div class="nh-top">
            <div>
              <span class="nh-name">${nh.name}</span>
              <span class="nh-zip">(${nh.zip})</span>
            </div>
            <div style="text-align:right">
              <div class="nh-price">${fmt(nh.targetPrice)}</div>
              <div class="nh-price-range">${nh.priceRange}</div>
            </div>
          </div>
          <p class="nh-desc">${nh.desc}</p>
          <div class="nh-tags">${allTags}</div>
          <div class="nh-highlight">★ ${nh.highlight}</div>
        </div>
        <div class="nh-actions">
          <div class="nh-mortgage">
            <div class="mo-label">Est. monthly</div>
            <div class="mo">${fmt(nhBd.total)}</div>
          </div>
          <div style="font-size:11px;color:var(--text-muted);text-align:center;line-height:1.4">
            ${nh.dom} days<br>avg on market
          </div>
          <div style="font-size:11px;color:var(--text-muted);text-align:center">
            Schools: ${nh.schoolRating}/10
          </div>
        </div>
      </div>
    </div>`;
  }).join("");

  // ── Personalized tips ──
  const tips = [];
  if (credit < 680)
    tips.push({ t: "Boost your credit score", d: "Paying down revolving credit card balances below 30% utilization can raise your score 20–40 points in 2–3 months, unlocking significantly better mortgage rates." });
  if (downPct < 20)
    tips.push({ t: "Consider a larger down payment", d: "Reaching 20% down eliminates PMI (saving " + fmt(bd.pmi * 12) + "/year) and improves your approval odds with conventional lenders." });
  if (firstTime)
    tips.push({ t: "First-time buyer programs", d: "Washington State Housing Finance Commission (WSHFC) offers down payment assistance and lower-rate loans specifically for first-time buyers in King County." });
  if (occupation === "gov" || occupation === "education")
    tips.push({ t: "Special loan programs", d: "Government employees and educators may qualify for HUD Good Neighbor Next Door, USDA, or VA loan programs with reduced rates or minimal down payments." });

  tips.push({ t: "Best time to buy in Renton", d: "August–December typically sees lower competition and more inventory. If your timeline is flexible, waiting for fall could mean fewer bidding wars." });

  if (maxHome > 806_500)
    tips.push({ t: "Jumbo loan considerations", d: "Your max price may require a jumbo loan. Lenders typically require 700+ credit, 10–20% down, and 6–12 months of reserves. Shop multiple lenders for best rates." });

  document.getElementById("tipsCard").innerHTML = `
    <div style="font-family:'Playfair Display',serif;font-size:18px;font-weight:500;margin-bottom:14px;color:var(--gold-light)">
      Personalized Recommendations
    </div>
    <div class="tips-list">
      ${tips.slice(0, 4).map(t => `
        <div class="tip-item">
          <span class="tip-dot">→</span>
          <div><strong style="color:rgba(255,255,255,0.95)">${t.t}:</strong> ${t.d}</div>
        </div>`).join("")}
    </div>`;

  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* ══════════════════════════════════════════════════════════════════════════
   SECTION 7 — Initialisation
   ══════════════════════════════════════════════════════════════════════════ */

// Sync slider labels on first load and show step 1
updateRange("income", "incomeVal", fmt);
updateRange("debts",  "debtsVal",  fmt);
updateRange("down",   "downVal",   fmt);
goStep(1);