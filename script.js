(() => {
  "use strict";

  const SPINS_PER_PLAYER = 4;
  const BOARD_KEY = "nexora-glc-wheel-board";
  const LETTERS = ["A", "B", "C", "D"];
  const DIFF_POINTS = { easy: 5, medium: 10, hard: 15 };
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SECTIONS = [
    { id: "decode", title: "Decode the Industry", short: "DECODE", tagline: "What am I looking at?", domain: "All", skill: "Visual recognition", icon: "▣", color: "#12c8b0", color2: "#0a6e78" },
    { id: "company", title: "Crack the Company", short: "COMPANY", tagline: "Who am I?", domain: "Management / Business", skill: "Deduction", icon: "◈", color: "#e0c48a", color2: "#9a6d28" },
    { id: "draw", title: "Draw the Business", short: "DRAW", tagline: "Can you communicate it?", domain: "All", skill: "Communication", icon: "✎", color: "#f472b6", color2: "#9d2463" },
    { id: "tool", title: "Identify the Tool", short: "TOOL", tagline: "What does this organisation use?", domain: "IT / HR / Operations", skill: "Recognition", icon: "◉", color: "#7aa2ff", color2: "#2a4ea8" },
    { id: "glitch", title: "Spot the Business Glitch", short: "GLITCH", tagline: "What's going wrong?", domain: "Management / Operations", skill: "Problem solving", icon: "⚡", color: "#ff8fa3", color2: "#b03a52" },
    { id: "logic", title: "Crack the Logic", short: "LOGIC", tagline: "Can you solve it?", domain: "Operations / Supply Chain", skill: "Analytical thinking", icon: "∑", color: "#5ee9a4", color2: "#1b7a4a" },
    { id: "rapid", title: "5 in 10", short: "5 IN 10", tagline: "How fast can you think?", domain: "HR / Management", skill: "Recall + pressure", icon: "⚡", color: "#ffb020", color2: "#b45a00" },
    { id: "bonus", title: "Manager's Bonus", short: "BONUS", tagline: "What would YOU do?", domain: "All", skill: "Decision-making", icon: "★", color: "#c084fc", color2: "#6d28d9" }
  ];

  const SVG = {
    barcode: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#0b1224"/><rect x="40" y="40" width="400" height="180" rx="16" fill="#f4f7ff"/><g fill="#111827">${[12,8,4,10,6,14,4,8,16,6,10,4,12,8,5,14,7,9,4,11,6,13,5,8].map((w,i,a)=>{const x=60+a.slice(0,i).reduce((s,n)=>s+n+3,0);return `<rect x="${x}" y="62" width="${w}" height="110"/>`;}).join("")}</g><text x="240" y="198" text-anchor="middle" font-size="18" fill="#111827" font-family="monospace">4 901234 567890</text></svg>`,
    laptop: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#07111f"/><rect x="86" y="38" width="308" height="168" rx="14" fill="#1c2438"/><rect x="102" y="52" width="276" height="140" rx="6" fill="#0b1b2e"/><path d="M70 210h340l18 18H52z" fill="#9aa7c2"/><circle cx="240" cy="46" r="3" fill="#4ee0c5"/><rect x="130" y="72" width="120" height="10" rx="3" fill="#4ee0c5"/><rect x="130" y="92" width="210" height="8" rx="3" fill="#35506e"/><rect x="130" y="110" width="180" height="8" rx="3" fill="#35506e"/><rect x="130" y="138" width="70" height="28" rx="6" fill="#7aa2ff"/></svg>`,
    factory: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#0a1628"/><rect x="0" y="188" width="480" height="72" fill="#12203a"/><path d="M40 188 V110 l40-28 40 28 v78z" fill="#243656"/><rect x="150" y="96" width="210" height="92" fill="#2b3f63"/><path d="M150 96 l30-22 h150 l30 22" fill="#3c567e"/><rect x="380" y="70" width="22" height="118" fill="#4a6288"/><rect x="412" y="48" width="18" height="140" fill="#4a6288"/><circle cx="391" cy="48" r="10" fill="#7d8aa6" opacity=".5"/><rect x="172" y="118" width="28" height="28" fill="#e0c48a"/><rect x="214" y="118" width="28" height="28" fill="#7aa2ff"/><rect x="256" y="118" width="28" height="28" fill="#e0c48a"/><rect x="298" y="118" width="28" height="28" fill="#7aa2ff"/></svg>`,
    truck: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#081525"/><rect x="0" y="176" width="480" height="84" fill="#13233d"/><rect x="48" y="88" width="230" height="100" rx="8" fill="#4ee0c5"/><rect x="278" y="108" width="110" height="80" rx="8" fill="#7aa2ff"/><path d="M388 128 h42 l22 36 v24 h-64z" fill="#dbe7ff"/><circle cx="120" cy="196" r="22" fill="#1a1f2e" stroke="#e0c48a" stroke-width="6"/><circle cx="340" cy="196" r="22" fill="#1a1f2e" stroke="#e0c48a" stroke-width="6"/><rect x="70" y="104" width="50" height="36" fill="#0b1b2e"/></svg>`,
    erp: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#0b1020"/><rect x="24" y="24" width="432" height="212" rx="14" fill="#121a32"/><text x="44" y="54" fill="#4ee0c5" font-size="16" font-family="sans-serif">ENTERPRISE SUITE</text>${[["Finance","#7aa2ff"],["HR","#f472b6"],["Supply","#e0c48a"],["Production","#5ee9a4"]].map((m,i)=>`<rect x="${44+i*104}" y="78" width="92" height="120" rx="10" fill="#1b2748"/><text x="${90+i*104}" y="140" text-anchor="middle" fill="${m[1]}" font-size="13" font-family="sans-serif">${m[0]}</text>`).join("")}</svg>`,
    warehouse: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#0a1324"/><path d="M40 200 L240 70 L440 200 Z" fill="#1d314f"/><rect x="70" y="148" width="340" height="72" fill="#243e63"/><rect x="210" y="168" width="60" height="52" fill="#0b1020"/><rect x="96" y="168" width="36" height="28" fill="#e0c48a"/><rect x="140" y="156" width="36" height="40" fill="#7aa2ff"/><rect x="320" y="160" width="36" height="36" fill="#4ee0c5"/><rect x="364" y="148" width="36" height="48" fill="#f472b6"/></svg>`,
    assembly: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#071018"/><rect x="20" y="168" width="440" height="18" fill="#4ee0c5"/><g fill="#7aa2ff">${[0,1,2,3,4].map(i=>`<rect x="${50+i*80}" y="148" width="46" height="20" rx="4"/>`).join("")}</g><path d="M300 70 h20 v50 h40 v16 h-74z" fill="#e0c48a"/><circle cx="360" cy="92" r="16" fill="#ff8fa3"/><rect x="70" y="90" width="90" height="50" fill="#1b2a44"/><circle cx="115" cy="115" r="14" fill="#5ee9a4"/></svg>`,
    recruit: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#0c1022"/><rect x="20" y="20" width="440" height="220" rx="12" fill="#151c33"/><text x="40" y="50" fill="#f4f7ff" font-size="16" font-family="sans-serif">Talent pipeline</text>${["Applied","Screen","Interview","Offer"].map((t,i)=>`<rect x="${36+i*108}" y="72" width="96" height="148" rx="10" fill="#1d2746"/><text x="${84+i*108}" y="96" text-anchor="middle" fill="#e0c48a" font-size="11" font-family="sans-serif">${t}</text><rect x="${48+i*108}" y="112" width="72" height="36" rx="6" fill="#2a3a62"/><rect x="${48+i*108}" y="156" width="72" height="36" rx="6" fill="#2a3a62"/>`).join("")}</svg>`,
    twin: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#050814"/><rect x="30" y="150" width="180" height="60" fill="#2b3f63"/><path d="M30 150 l40-30 h100 l40 30" fill="#3c567e"/><g fill="none" stroke="#4ee0c5" stroke-width="2" opacity=".9"><rect x="250" y="150" width="180" height="60"/><path d="M250 150 l40-30 h100 l40 30"/><line x1="210" y1="140" x2="250" y2="140" stroke-dasharray="6 4"/></g><circle cx="340" cy="100" r="18" fill="none" stroke="#7aa2ff"/><path d="M340 82 v-18" stroke="#7aa2ff"/></svg>`,
    pdm: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#0a101c"/><rect x="50" y="70" width="150" height="110" rx="12" fill="#243656"/><circle cx="125" cy="125" r="28" fill="#1b2740" stroke="#4ee0c5" stroke-width="6"/><path d="M240 190 L268 120 300 150 340 70 380 110 430 48" fill="none" stroke="#ff8fa3" stroke-width="5"/><circle cx="430" cy="48" r="8" fill="#ff8fa3"/><text x="250" y="44" fill="#ff8fa3" font-size="14" font-family="sans-serif">FAILURE RISK ↑</text></svg>`,
    jit: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#08111f"/><rect x="300" y="70" width="140" height="110" fill="#1d314f"/><path d="M300 70 l30-22 h80 l30 22" fill="#3c567e"/><rect x="20" y="128" width="90" height="44" fill="#4ee0c5"/><rect x="118" y="128" width="90" height="44" fill="#7aa2ff"/><rect x="216" y="128" width="70" height="44" fill="#e0c48a"/><text x="40" y="90" fill="#f4f7ff" font-size="14" font-family="sans-serif">Inbound every 2 days</text><rect x="328" y="120" width="50" height="28" fill="#12203a"/><text x="318" y="200" fill="#a8b4cc" font-size="12" font-family="sans-serif">Almost empty dock</text></svg>`,
    forecast: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#0b1020"/><line x1="50" y1="210" x2="440" y2="210" stroke="#35506e"/><line x1="50" y1="40" x2="50" y2="210" stroke="#35506e"/><path d="M50 170 L120 150 L190 155 L260 120 L320 130" fill="none" stroke="#7aa2ff" stroke-width="4"/><path d="M320 130 L380 90 L440 70" fill="none" stroke="#e0c48a" stroke-width="4" stroke-dasharray="8 6"/><text x="330" y="60" fill="#e0c48a" font-size="13" font-family="sans-serif">Projected demand</text></svg>`,
    interview: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#10182c"/><circle cx="150" cy="110" r="36" fill="#e0c48a"/><rect x="116" y="150" width="68" height="70" rx="20" fill="#4ee0c5"/><circle cx="320" cy="118" r="28" fill="#7aa2ff"/><rect x="292" y="150" width="56" height="58" rx="16" fill="#c084fc"/><rect x="40" y="210" width="400" height="16" fill="#1c2744"/></svg>`,
    cloud: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#071527"/><ellipse cx="240" cy="120" rx="110" ry="58" fill="#7aa2ff"/><ellipse cx="180" cy="130" rx="70" ry="42" fill="#9bb6ff"/><ellipse cx="310" cy="128" rx="74" ry="44" fill="#5f8cff"/><rect x="210" y="168" width="60" height="40" fill="#4ee0c5"/><rect x="140" y="208" width="200" height="10" fill="#1a2a44"/></svg>`,
    cnc: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#0c1018"/><rect x="70" y="50" width="340" height="160" rx="10" fill="#1a2233"/><rect x="90" y="70" width="180" height="120" fill="#0b1524"/><rect x="290" y="78" width="96" height="70" fill="#243656"/><rect x="160" y="100" width="70" height="14" fill="#4ee0c5"/><circle cx="195" cy="150" r="16" fill="#e0c48a"/><rect x="186" y="70" width="8" height="40" fill="#ff8fa3"/></svg>`,
    ship: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#071320"/><rect x="0" y="170" width="480" height="90" fill="#12324a"/><path d="M40 170 L420 170 L380 210 L70 210 Z" fill="#c9d6ea"/><rect x="90" y="110" width="50" height="60" fill="#e0c48a"/><rect x="150" y="96" width="50" height="74" fill="#7aa2ff"/><rect x="210" y="84" width="50" height="86" fill="#4ee0c5"/><rect x="270" y="100" width="50" height="70" fill="#f472b6"/></svg>`,
    rfid: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="260" fill="#0a1020"/><rect x="90" y="70" width="180" height="120" rx="12" fill="#e8eefc"/><rect x="108" y="88" width="110" height="14" fill="#111"/><rect x="108" y="112" width="80" height="10" fill="#333"/><circle cx="340" cy="130" r="16" fill="#4ee0c5"/><path d="M360 130 a28 28 0 0 1 28 0" fill="none" stroke="#4ee0c5" stroke-width="4"/><path d="M372 130 a44 44 0 0 1 44 0" fill="none" stroke="#4ee0c5" stroke-width="4"/></svg>`
  };

  const DECODE = [
    { difficulty: "easy", domain: "Operations", answer: "Barcode", aliases: ["barcode", "bar code", "upc", "ean"], options: ["Barcode", "QR factory", "Ledger", "Firewall"], scene: SVG.barcode },
    { difficulty: "easy", domain: "IT", answer: "Laptop", aliases: ["laptop", "notebook", "computer"], options: ["Laptop", "Server rack", "CNC mill", "Badge printer"], scene: SVG.laptop },
    { difficulty: "easy", domain: "Manufacturing", answer: "Factory", aliases: ["factory", "plant", "manufacturing plant"], options: ["Factory", "Call centre", "Retail store", "Campus"], scene: SVG.factory },
    { difficulty: "easy", domain: "Supply Chain", answer: "Delivery truck", aliases: ["delivery truck", "truck", "logistics truck", "lorry"], options: ["Delivery truck", "Forklift only", "AGV", "Crane"], scene: SVG.truck },
    { difficulty: "easy", domain: "HR", answer: "Interview", aliases: ["interview", "job interview"], options: ["Interview", "Payroll run", "Night shift", "Audit"], scene: SVG.interview },
    { difficulty: "easy", domain: "IT", answer: "Cloud", aliases: ["cloud", "cloud computing"], options: ["Cloud", "On-prem only", "Paper archive", "Fax hub"], scene: SVG.cloud },
    { difficulty: "easy", domain: "Supply Chain", answer: "Container ship", aliases: ["container ship", "cargo ship", "ship"], options: ["Container ship", "Passenger ferry", "Oil rig", "Subway"], scene: SVG.ship },
    { difficulty: "medium", domain: "IT", answer: "ERP", aliases: ["erp", "enterprise resource planning", "enterprise suite"], options: ["ERP", "Personal notes app", "Social network", "Game engine"], scene: SVG.erp },
    { difficulty: "medium", domain: "Operations", answer: "Warehouse", aliases: ["warehouse", "distribution centre", "dc", "godown"], options: ["Warehouse", "Showroom", "Classroom", "Studio"], scene: SVG.warehouse },
    { difficulty: "medium", domain: "Manufacturing", answer: "Assembly line", aliases: ["assembly line", "production line", "line"], options: ["Assembly line", "Open-plan office", "Lab bench", "Retail aisle"], scene: SVG.assembly },
    { difficulty: "medium", domain: "HR", answer: "Recruitment dashboard", aliases: ["recruitment dashboard", "hiring pipeline", "talent pipeline", "ats"], options: ["Recruitment dashboard", "Factory SCADA", "Bank ledger", "Weather map"], scene: SVG.recruit },
    { difficulty: "medium", domain: "Manufacturing", answer: "CNC machine", aliases: ["cnc", "cnc machine", "machine tool"], options: ["CNC machine", "3D billboard", "ATM", "Printer farm"], scene: SVG.cnc },
    { difficulty: "medium", domain: "Supply Chain", answer: "RFID / barcode scan", aliases: ["rfid", "barcode scan", "scan", "tag"], options: ["RFID tag", "Wi-Fi router", "ID selfie", "Stamp"], scene: SVG.rfid },
    { difficulty: "hard", domain: "Manufacturing", answer: "Digital twin", aliases: ["digital twin", "virtual replica", "twin"], options: ["Digital twin", "Org chart", "Payslip", "Mood board"], scene: SVG.twin },
    { difficulty: "hard", domain: "Manufacturing", answer: "Predictive maintenance", aliases: ["predictive maintenance", "pdm", "condition monitoring"], options: ["Predictive maintenance", "Annual picnic plan", "Brand refresh", "Cold calling"], scene: SVG.pdm },
    { difficulty: "hard", domain: "Manufacturing", answer: "Just-in-time manufacturing", aliases: ["just in time", "jit", "lean inbound"], options: ["Just-in-time flow", "Mass stockpile", "Random overtime", "Price dumping"], scene: SVG.jit },
    { difficulty: "hard", domain: "Supply Chain", answer: "Demand forecasting", aliases: ["demand forecasting", "forecast", "demand plan"], options: ["Demand forecasting", "Exit interview", "Color matching", "Badge design"], scene: SVG.forecast }
  ];

  const COMPANIES = [
    { answer: "SAP", aliases: ["sap"], clues: ["We provide software organisations use to manage business processes.", "Our name is almost synonymous with enterprise resource planning.", "Corporate IT departments mention us in the same breath as finance, MM and HCM modules."] },
    { answer: "Accenture", aliases: ["accenture"], clues: ["We are a global professional services firm, not a product OEM.", "Strategy, consulting, technology and operations sit under one brand.", "Our name used to include 'Andersen' in a previous life."] },
    { answer: "Salesforce", aliases: ["salesforce"], clues: ["We helped popularise software-as-a-service for customer teams.", "Sales, service and marketing clouds live in our universe.", "A tiny cloud icon and the word 'customer' follow us everywhere."] },
    { answer: "Amazon", aliases: ["amazon", "aws"], clues: ["We began by selling books. We now sell almost everything, plus cloud.", "Fulfilment centres and two-day expectations are part of our folklore.", "One of the world's largest cloud platforms shares our parent."] },
    { answer: "Microsoft", aliases: ["microsoft", "msft"], clues: ["Offices around the world run on our productivity suite.", "Cloud, OS and collaboration tools all sit in our house.", "Excel, Azure and Teams are three of our most recognised faces."] },
    { answer: "Toyota", aliases: ["toyota"], clues: ["A carmaker whose production system became a global management school.", "Waste reduction and flow are associated with our name.", "Lean, kanban and jidoka travelled from our shops to MBA classrooms."] },
    { answer: "Tata Motors", aliases: ["tata motors", "tatamotors"], clues: ["We are an Indian automotive manufacturer in a larger conglomerate family.", "Commercial vehicles and passenger cars both carry our badge.", "Jaguar Land Rover sits in our group alongside domestic brands."] },
    { answer: "Ather", aliases: ["ather", "ather energy"], clues: ["We make electric scooters, not diesel trucks.", "Charging networks and a software-heavy dashboard are part of the pitch.", "Our home market is India and our name starts with A."] },
    { answer: "Bajaj Auto", aliases: ["bajaj", "bajaj auto"], clues: ["Two-wheelers and three-wheelers made us a household name in India.", "Pulsar is one of our best-known motorcycle lines.", "We compete hard in commuter and export markets, not in heavy trucks."] },
    { answer: "Deloitte", aliases: ["deloitte"], clues: ["We are one of the 'Big Four' professional services firms.", "Audit, tax, consulting and advisory sit under our umbrella.", "A green dot in our identity is hard to miss."] },
    { answer: "IBM", aliases: ["ibm"], clues: ["We have been in business technology for more than a century.", "Consulting, hybrid cloud and research labs share our three-letter name.", "Big Blue is the nickname people still use."] },
    { answer: "Infosys", aliases: ["infosys"], clues: ["We are an Indian IT services giant born in Pune, scaled from Bengaluru.", "Global clients hire us to build, run and transform systems.", "Our campus and training machine are famous in the industry."] },
    { answer: "Siemens", aliases: ["siemens"], clues: ["We sit at the intersection of industry, infrastructure and technology.", "Factory automation and digital industry platforms carry our badge.", "The company is German and more than 170 years old."] },
    { answer: "Unilever", aliases: ["unilever"], clues: ["Consumer goods, not enterprise software, are our core.", "Soaps, foods and home care brands live in our house.", "A U-shaped logo and a huge global supply network define us."] }
  ];

  const DRAW_WORDS = {
    easy: ["Teamwork", "Interview", "Factory", "Truck", "Laptop", "Meeting"],
    medium: ["Recruitment", "Inventory", "Quality Control", "Supply Chain", "Customer Service", "Warehouse"],
    hard: ["Just-in-Time", "Digital Transformation", "Predictive Maintenance", "Demand Forecasting", "Lean Manufacturing", "Performance Management"]
  };

  const TOOLS = [
    { answer: "GitHub", aliases: ["github"], domain: "IT", cls: "ui-github", html: toolGithub },
    { answer: "Jira", aliases: ["jira"], domain: "IT", cls: "ui-jira", html: toolJira },
    { answer: "Microsoft Teams", aliases: ["teams", "microsoft teams", "ms teams"], domain: "IT", cls: "ui-teams", html: toolTeams },
    { answer: "Workday", aliases: ["workday"], domain: "HR", cls: "ui-workday", html: toolWorkday },
    { answer: "SAP", aliases: ["sap"], domain: "Operations", cls: "ui-sap", html: toolSap },
    { answer: "Microsoft Excel", aliases: ["excel", "microsoft excel"], domain: "Management", cls: "ui-excel", html: toolExcel },
    { answer: "Power BI", aliases: ["power bi", "powerbi"], domain: "Management", cls: "ui-powerbi", html: toolPowerbi },
    { answer: "AWS", aliases: ["aws", "amazon web services"], domain: "IT", cls: "ui-aws", html: toolAws },
    { answer: "Microsoft Azure", aliases: ["azure", "microsoft azure"], domain: "IT", cls: "ui-azure", html: toolAzure },
    { answer: "LinkedIn", aliases: ["linkedin"], domain: "HR", cls: "ui-linkedin", html: toolLinkedin },
    { answer: "Tableau", aliases: ["tableau"], domain: "Operations", cls: "ui-tableau", html: toolTableau },
    { answer: "ServiceNow", aliases: ["servicenow", "service now"], domain: "Operations", cls: "ui-servicenow", html: toolNow },
    { answer: "Notion", aliases: ["notion"], domain: "Management", cls: "ui-notion", html: toolNotion },
    { answer: "Oracle", aliases: ["oracle"], domain: "Operations", cls: "ui-oracle", html: toolOracle },
    { answer: "SAP SuccessFactors", aliases: ["successfactors", "sap successfactors"], domain: "HR", cls: "ui-sf", html: toolSf },
    { answer: "PowerPoint", aliases: ["powerpoint", "ppt", "microsoft powerpoint"], domain: "Management", cls: "ui-ppt", html: toolPpt }
  ];

  function toolGithub() {
    return `<div class="ui-shell ui-github"><div class="ui-top"><span class="mark"></span> github.com/nexora/glc · Issues · Pull requests</div><div class="ui-body"><div class="ui-row"><div class="ui-card"></div><div class="ui-card"></div></div><div class="ui-row"><div class="ui-col">README.md<br><span class="chip">main</span></div><div class="ui-col">12 open issues</div></div></div></div>`;
  }
  function toolJira() {
    return `<div class="ui-shell ui-jira"><div class="ui-top">NEXORA board · Sprint 14</div><div class="ui-body"><div class="ui-row"><div class="ui-col">TO DO<br><span class="chip">GLC-12</span></div><div class="ui-col">IN PROGRESS<br><span class="chip">GLC-09</span></div><div class="ui-col">DONE<br><span class="chip">GLC-04</span></div></div></div></div>`;
  }
  function toolTeams() {
    return `<div class="ui-shell ui-teams"><div class="side"></div><div><div class="ui-top">Teams · GLC 4.0 Ops</div><div class="ui-body"><div class="ui-card">Daily standup — 09:30</div><div class="ui-card">Chat · Files · Calendar</div></div></div></div>`;
  }
  function toolWorkday() {
    return `<div class="ui-shell ui-workday"><div class="ui-top">Workday · Home</div><div class="ui-body"><div class="hero"></div><div class="ui-row"><div class="ui-card">Time off</div><div class="ui-card">Pay</div><div class="ui-card">Goals</div></div></div></div>`;
  }
  function toolSap() {
    return `<div class="ui-shell ui-sap"><div class="ui-top">SAP Fiori Launchpad</div><div class="ui-body"><div class="ui-row"><div class="mod">MM</div><div class="mod">SD</div><div class="mod">FI</div><div class="mod">PP</div></div><div class="ui-card">Purchase order 4500012231</div></div></div>`;
  }
  function toolExcel() {
    return `<div class="ui-shell ui-excel"><div class="ui-top">Book1 - Excel</div><div class="ui-body"><table>${[1,2,3,4,5].map((r)=>`<tr><td>${r}</td><td></td><td></td><td></td><td></td><td></td></tr>`).join("")}</table></div></div>`;
  }
  function toolPowerbi() {
    return `<div class="ui-shell ui-powerbi"><div class="ui-top">Power BI · Operations dashboard</div><div class="ui-body"><div class="chart"></div><div class="ui-row"><div class="ui-card">OTD 94%</div><div class="ui-card">Yield 98.1%</div></div></div></div>`;
  }
  function toolAws() {
    return `<div class="ui-shell ui-aws"><div class="ui-top">AWS Management Console</div><div class="ui-body"><div class="ui-row"><div class="cube"></div><div class="ui-col">EC2 · S3 · IAM<br><span class="chip">ap-south-1</span></div></div></div></div>`;
  }
  function toolAzure() {
    return `<div class="ui-shell ui-azure"><div class="ui-top">Microsoft Azure | Portal</div><div class="ui-body"><div class="ui-row"><div class="ui-card">Resource groups</div><div class="ui-card">Virtual machines</div><div class="ui-card">App services</div></div></div></div>`;
  }
  function toolLinkedin() {
    return `<div class="ui-shell ui-linkedin"><div class="ui-top">in LinkedIn</div><div class="ui-body"><div class="ui-row"><div class="avatar"></div><div class="ui-col">Hiring: Operations Analyst · NEXORA<br><span class="chip">Easy Apply</span></div></div></div></div>`;
  }
  function toolTableau() {
    return `<div class="ui-shell ui-tableau"><div class="ui-top">Tableau · Supply insights</div><div class="ui-body"><div class="ui-row"><div class="ui-col">Maps</div><div class="ui-col">Bars</div><div class="ui-col">Filters</div></div></div></div>`;
  }
  function toolNow() {
    return `<div class="ui-shell ui-servicenow"><div class="ui-top">ServiceNow · Incident</div><div class="ui-body"><div class="ui-card">INC0012847 · Laptop not connecting</div><div class="ui-card">Assignment group: IT Support</div></div></div>`;
  }
  function toolNotion() {
    return `<div class="ui-shell ui-notion"><div class="ui-top">Untitled — Notion</div><div class="ui-body"><div class="ui-card">/ heading 1 · GLC 4.0 runbook</div><div class="ui-card">☐ Brief volunteers &nbsp; ☐ Reset wheel</div></div></div>`;
  }
  function toolOracle() {
    return `<div class="ui-shell ui-oracle"><div class="ui-top">Oracle Cloud · Fusion</div><div class="ui-body"><div class="ui-row"><div class="ui-card">Financials</div><div class="ui-card">SCM</div><div class="ui-card">HCM</div></div></div></div>`;
  }
  function toolSf() {
    return `<div class="ui-shell ui-sf"><div class="ui-top">SAP SuccessFactors · Employee file</div><div class="ui-body"><div class="ui-card">Goals 2026</div><div class="ui-card">Performance · 360 feedback</div></div></div>`;
  }
  function toolPpt() {
    return `<div class="ui-shell ui-ppt"><div class="ui-top">PowerPoint · Slideshow</div><div class="ui-body"><div class="slide"></div></div></div>`;
  }

  const GLITCHES = [
    { difficulty: "easy", domain: "Supply Chain", prompt: "A company increases inventory dramatically even though demand has fallen and the warehouse is already full.", options: ["Excess inventory / poor planning", "A clever hedge against inflation", "Proof that demand will rebound", "A quality improvement"], answer: 0 },
    { difficulty: "easy", domain: "HR", prompt: "A company evaluates every employee solely on hours spent at a desk.", options: ["Presence is not a performance measure", "Longer hours always mean better output", "Desks are the real KPI", "This eliminates bias completely"], answer: 0 },
    { difficulty: "easy", domain: "Manufacturing", prompt: "A factory inspects quality only after the entire batch is finished.", options: ["Defects are found too late", "This is the fastest path to zero defects", "Inspection timing does not matter", "It reduces rework automatically"], answer: 0 },
    { difficulty: "medium", domain: "Operations", prompt: "A company removes all safety stock to minimise inventory cost.", options: ["Stockout and disruption risk jumps", "Lead times become irrelevant", "Suppliers will always be on time", "Quality automatically improves"], answer: 0 },
    { difficulty: "medium", domain: "Management", prompt: "A manager sets a stretch revenue target, then cuts the team that generates the revenue.", options: ["Goal and resource are misaligned", "Smaller teams always earn more", "Targets replace capability", "This is standard lean practice"], answer: 0 },
    { difficulty: "medium", domain: "IT", prompt: "A firm moves every system to the cloud in one weekend with no rollback plan.", options: ["Uncontrolled cutover risk", "Cloud removes the need for plans", "Weekends are inherently safe", "Rollback is only for factories"], answer: 0 },
    { difficulty: "hard", domain: "Supply Chain", prompt: "Purchasing awards every contract to the cheapest bidder, including the sole source of a critical part.", options: ["Price-only sourcing ignores risk", "The cheapest source is always strategic", "Sole source means zero risk", "Critical parts should have one vendor"], answer: 0 },
    { difficulty: "hard", domain: "HR", prompt: "Leadership announces a 'fail fast' culture, then quietly punishes the first public miss.", options: ["Stated culture and incentives conflict", "Punishment speeds learning", "Fail fast only applies to vendors", "This builds psychological safety"], answer: 0 },
    { difficulty: "hard", domain: "Manufacturing", prompt: "A line is running overtime every day, so the plant adds more WIP to 'keep people busy' while a bottleneck machine waits on parts.", options: ["More WIP hides the real constraint", "Busy people prove the bottleneck is fixed", "Overtime always means understaffing only", "WIP is a substitute for flow"], answer: 0 }
  ];

  const LOGIC = [
    { difficulty: "easy", domain: "Supply Chain", question: "A shipment takes 2 days manufacturing + 1 day processing + 3 days transportation. What is total lead time?", stats: [["Manufacturing", "2 days"], ["Processing", "1 day"], ["Transport", "3 days"]], options: ["6 days", "5 days", "3 days", "12 days"], answer: 0 },
    { difficulty: "easy", domain: "Operations", question: "A warehouse receives 100 units and ships 65. How many remain?", stats: [["Received", "100"], ["Shipped", "65"]], options: ["35 units", "65 units", "165 units", "25 units"], answer: 0 },
    { difficulty: "easy", domain: "Manufacturing", question: "A line produces 50 units/hour. How many in 6 hours?", stats: [["Rate", "50 / hour"], ["Time", "6 hours"]], options: ["300 units", "56 units", "250 units", "500 units"], answer: 0 },
    { difficulty: "medium", domain: "Management", question: "Supplier A is ₹100/unit with 2-day delivery. Supplier B is ₹90/unit with 7-day delivery. The factory needs material in 3 days. Who do you choose?", stats: [["Supplier A", "₹100 · 2 days"], ["Supplier B", "₹90 · 7 days"], ["Need by", "3 days"]], options: ["Supplier A — time is the constraint", "Supplier B — cheaper always wins", "Wait for a third quote", "Split 50/50 this week"], answer: 0 },
    { difficulty: "medium", domain: "Operations", question: "You sell 10 units a day and the supplier delivers every 5 days. How many units should each replenishment cover if you want to avoid stockouts (no extras)?", stats: [["Daily sales", "10"], ["Replenish every", "5 days"]], options: ["50 units", "10 units", "5 units", "15 units"], answer: 0 },
    { difficulty: "medium", domain: "Manufacturing", question: "Two machines: A makes 40/hour, B makes 25/hour, and every unit must go through both. What is the line's hourly output?", stats: [["Machine A", "40 / hour"], ["Machine B", "25 / hour"], ["Flow", "A then B"]], options: ["25 — B is the bottleneck", "40 — use the faster machine", "65 — add them", "15 — subtract them"], answer: 0 },
    { difficulty: "hard", domain: "Supply Chain", question: "Your factory is holding ₹50 lakh of unused components. A supplier can deliver every two days. What is the most useful first move?", stats: [["Idle inventory", "₹50 lakh"], ["Supplier cadence", "every 2 days"]], options: ["Shrink the buffer and order to actual use", "Double the warehouse", "Ban the supplier", "Raise list prices immediately"], answer: 0 },
    { difficulty: "hard", domain: "Operations", question: "Fill rate is 70% even though the warehouse looks full. Which diagnosis is strongest?", stats: [["Fill rate", "70%"], ["Warehouse", "visibly full"]], options: ["You may be holding the wrong mix", "Full shelves always mean high service", "Fill rate cannot fall if space is used", "Hire more pickers first, no data needed"], answer: 0 }
  ];

  const RAPID = [
    { domain: "HR", prompt: "Name 5 HR functions.", hint: "Volunteer taps how many were valid." },
    { domain: "IT", prompt: "Name 5 cloud platforms or cloud tools." },
    { domain: "Manufacturing", prompt: "Name 5 automobile manufacturers." },
    { domain: "Operations", prompt: "Name 5 business KPIs." },
    { domain: "Supply Chain", prompt: "Name 5 logistics activities." },
    { domain: "Management", prompt: "Name 5 leadership qualities." }
  ];

  const BONUS = [
    {
      type: "judge",
      domain: "HR",
      prompt: "Two candidates. A: highly experienced, average team skills. B: less experienced, excellent collaboration and learning. You need someone for a highly collaborative team. Who do you choose — and why?",
      options: ["Candidate A — experience first", "Candidate B — collaboration first", "Trial both on a paid assignment", "Re-open the role"]
    },
    {
      type: "mcq",
      domain: "Manufacturing",
      prompt: "Your production line keeps stopping because one machine fails. What do you do?",
      options: ["Increase inventory", "Preventive maintenance", "Hire more workers", "Increase production targets"],
      best: 1
    },
    {
      type: "judge",
      domain: "Supply Chain",
      prompt: "Your cheapest supplier is unreliable. A second supplier costs more but is highly reliable. What would you do?",
      options: ["Dual source / risk-weighted split", "Stay with cheapest only", "Switch 100% to expensive immediately", "Ignore it until a stockout"]
    },
    {
      type: "mcq",
      domain: "Operations",
      prompt: "Orders are late. Marketing wants more SKUs. The plant is already overloaded. First move?",
      options: ["Add SKUs this week", "Protect the constraint and freeze complexity", "Cut all safety stock", "Double overtime forever"],
      best: 1
    },
    {
      type: "judge",
      domain: "IT",
      prompt: "A critical dashboard is wrong during a live leadership review. Do you ship a silent patch, halt the meeting, or present with a caveat?",
      options: ["Halt and correct with a caveat", "Silent patch, say nothing", "Bluff with confidence", "Delete the dashboard"]
    },
    {
      type: "mcq",
      domain: "Management",
      prompt: "A high performer is missing team rituals and other people are covering. Best first conversation?",
      options: ["Public call-out in standup", "Private conversation on impact and expectations", "Immediate PIP email", "Ignore it — output is high"],
      best: 1
    }
  ];

  const TIERS = [
    { min: 50, id: "master", name: "NEXORA MASTER", prize: "Jackpot / special prize / leaderboard entry", title: "You didn't quiz. You operated." },
    { min: 30, id: "pro", name: "BUSINESS PRO", prize: "Premium NEXORA merchandise", title: "Sharp reads. Clean calls." },
    { min: 20, id: "strategist", name: "BUSINESS STRATEGIST", prize: "Keychain / pop socket / equivalent", title: "You can sit in the room." },
    { min: 10, id: "explorer", name: "BUSINESS EXPLORER", prize: "Sticker / small merchandise", title: "You're in the ecosystem now." },
    { min: 0, id: "rookie", name: "BUSINESS ROOKIE", prize: "Participation reward", title: "First spin. Next time, lead it." }
  ];

  const audio = createAudio();
  const fx = createFx();

  const state = {
    locked: false,
    spinning: false,
    muted: false,
    name: "",
    score: 0,
    spin: 0,
    rotation: 0,
    usedSections: [],
    log: [],
    round: null,
    timer: null,
    draw: null
  };

  const els = {
    screens: [...document.querySelectorAll(".screen")],
    hud: document.getElementById("hud-line"),
    mute: document.getElementById("btn-mute"),
    fullscreen: document.getElementById("btn-fullscreen"),
    form: document.getElementById("entry-form"),
    name: document.getElementById("player-name"),
    board: document.getElementById("board-list"),
    wheelKicker: document.getElementById("wheel-kicker"),
    wheelTitle: document.getElementById("wheel-title"),
    scoreChip: document.getElementById("score-chip"),
    canvas: document.getElementById("wheel-canvas"),
    spin: document.getElementById("btn-spin"),
    hubLabel: document.getElementById("hub-label"),
    wheelHint: document.getElementById("wheel-hint"),
    challengeEyebrow: document.getElementById("challenge-eyebrow"),
    challengeTitle: document.getElementById("challenge-title"),
    challengeTag: document.getElementById("challenge-tagline"),
    diffPill: document.getElementById("diff-pill"),
    domainPill: document.getElementById("domain-pill"),
    timerPill: document.getElementById("timer-pill"),
    body: document.getElementById("challenge-body"),
    status: document.getElementById("challenge-status"),
    roundEyebrow: document.getElementById("round-eyebrow"),
    roundTitle: document.getElementById("round-title"),
    roundCopy: document.getElementById("round-copy"),
    roundTotal: document.getElementById("round-total"),
    nextRound: document.getElementById("btn-next-round"),
    tierKicker: document.getElementById("tier-kicker"),
    resultTitle: document.getElementById("result-title"),
    resultCopy: document.getElementById("result-copy"),
    finalScore: document.getElementById("final-score"),
    prizeLine: document.getElementById("prize-line"),
    roundLog: document.getElementById("round-log"),
    share: document.getElementById("btn-share"),
    nextPlayer: document.getElementById("btn-next-player"),
    shareFeedback: document.getElementById("share-feedback")
  };

  const ctx = els.canvas.getContext("2d");

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function weightedDifficulty() {
    const r = Math.random();
    if (r < 0.42) return "easy";
    if (r < 0.78) return "medium";
    return "hard";
  }

  function fromPool(pool, difficulty) {
    const match = pool.filter((item) => item.difficulty === difficulty);
    return pick(match.length ? match : pool);
  }

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function matches(guess, aliases, answer) {
    const n = normalize(guess);
    if (!n) return false;
    const all = [answer, ...(aliases || [])].map(normalize);
    return all.some((alias) => n === alias || n.includes(alias) || alias.includes(n));
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, REDUCED ? Math.min(ms, 80) : ms));
  }

  function haptic(pattern) {
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }

  function showScreen(id) {
    els.screens.forEach((screen) => {
      const active = screen.id === id;
      screen.classList.toggle("is-active", active);
      screen.hidden = !active;
      screen.setAttribute("aria-hidden", active ? "false" : "true");
    });
    const heading = document.querySelector(`#${id} h1, #${id} h2`);
    if (heading) heading.focus?.();
    window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
    if (id === "screen-wheel") {
      window.requestAnimationFrame(() => {
        sizeCanvas();
        drawWheel(state.rotation);
      });
    }
  }

  function readBoard() {
    try {
      const raw = JSON.parse(window.localStorage.getItem(BOARD_KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }

  function writeBoard(rows) {
    try {
      window.localStorage.setItem(BOARD_KEY, JSON.stringify(rows.slice(0, 12)));
    } catch {
      /* stall devices may block storage */
    }
  }

  function renderBoard() {
    const rows = readBoard().sort((a, b) => b.score - a.score).slice(0, 8);
    if (!rows.length) {
      els.board.innerHTML = `<p class="board-empty">No runs yet. Be the first name on the GLC 4.0 board.</p>`;
      return;
    }
    els.board.innerHTML = "";
    rows.forEach((row, i) => {
      const li = document.createElement("li");
      const left = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = `${i + 1}. ${row.name}`;
      left.append(strong, document.createTextNode(` · ${row.tier}`));
      const right = document.createElement("span");
      right.textContent = `${row.score} pts`;
      li.append(left, right);
      els.board.appendChild(li);
    });
  }

  function sizeCanvas() {
    const rect = els.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const size = Math.max(280, Math.floor(rect.width || 520));
    els.canvas.width = size * dpr;
    els.canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawWheel(state.rotation);
  }

  function drawWheel(rotationDeg) {
    const size = els.canvas.getBoundingClientRect().width || 520;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 6;
    const arc = (Math.PI * 2) / SECTIONS.length;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotationDeg * Math.PI) / 180);

    SECTIONS.forEach((section, i) => {
      const start = -Math.PI / 2 + i * arc;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, start, start + arc);
      const grad = ctx.createRadialGradient(0, 0, r * 0.12, 0, 0, r);
      grad.addColorStop(0, section.color);
      grad.addColorStop(1, section.color2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(5,8,20,0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.rotate(start + arc / 2);
      ctx.fillStyle = "#fff";
      ctx.font = `700 ${Math.max(11, size * 0.028)}px Outfit, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(section.icon, r * 0.42, 0);
      ctx.font = `800 ${Math.max(10, size * 0.032)}px Syne, sans-serif`;
      ctx.fillText(section.short, r * 0.68, 0);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "#070b16";
    ctx.fill();
    ctx.strokeStyle = "rgba(224,196,138,0.55)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  function indexFromRotation(deg) {
    const normalized = ((360 - (deg % 360)) % 360 + 360) % 360;
    return Math.floor(normalized / 45) % SECTIONS.length;
  }

  function unusedIndex() {
    const available = SECTIONS.map((_, i) => i).filter((i) => !state.usedSections.includes(SECTIONS[i].id));
    const pool = available.length ? available : SECTIONS.map((_, i) => i);
    return pick(pool);
  }

  function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
  }

  function spinWheel() {
    if (state.locked || state.spinning) return;
    audio.unlock();
    audio.click();
    haptic(12);
    state.spinning = true;
    els.spin.disabled = true;
    els.spin.classList.remove("is-armed");
    els.hubLabel.textContent = "…";
    const index = unusedIndex();
    const from = state.rotation;
    const currentMod = ((from % 360) + 360) % 360;
    const desiredMod = (((-index * 45 - 22.5) % 360) + 360) % 360;
    let delta = (desiredMod - currentMod + 360) % 360;
    delta += (5 + Math.floor(Math.random() * 3)) * 360;
    delta += (Math.random() - 0.5) * 14;
    const duration = REDUCED ? 200 : 4200 + Math.random() * 900;
    const start = performance.now();
    let lastTick = -1;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      state.rotation = from + delta * eased;
      drawWheel(state.rotation);
      const seg = Math.floor((((360 - (state.rotation % 360)) % 360) / 6));
      if (seg !== lastTick) {
        lastTick = seg;
        audio.tick(0.05 + (1 - t) * 0.08);
        if (t > 0.15 && t < 0.95) haptic(4);
      }
      if (t < 1) {
        window.requestAnimationFrame(tick);
        return;
      }
      state.rotation = from + delta;
      drawWheel(state.rotation);
      const landed = indexFromRotation(state.rotation);
      finishSpin(SECTIONS[landed]);
    };
    window.requestAnimationFrame(tick);
  }

  async function finishSpin(section) {
    audio.land();
    haptic([18, 40, 28]);
    els.hubLabel.textContent = section.short;
    els.wheelHint.textContent = `${section.title} — ${section.tagline}`;
    state.usedSections.push(section.id);
    await wait(720);
    state.spinning = false;
    startChallenge(section);
  }

  function startChallenge(section) {
    const difficulty = section.id === "rapid" ? "medium" : section.id === "bonus" ? "hard" : weightedDifficulty();
    const points = section.id === "rapid" ? 10 : DIFF_POINTS[difficulty];
    state.round = { section, difficulty, points, awarded: 0 };
    els.challengeEyebrow.textContent = `0${SECTIONS.findIndex((s) => s.id === section.id) + 1} · ${section.short}`;
    els.challengeTitle.textContent = section.title;
    els.challengeTag.textContent = section.tagline;
    els.diffPill.textContent = section.id === "rapid"
      ? "10 seconds · 10 / 5 / 0"
      : section.id === "company"
        ? "Clue race · 15 / 10 / 5"
        : section.id === "bonus"
          ? "20 seconds · judgement"
          : `${difficulty[0].toUpperCase()}${difficulty.slice(1)} · ${points} pts`;
    els.domainPill.textContent = `${section.domain} · ${section.skill}`;
    els.timerPill.hidden = true;
    els.status.textContent = "";
    els.status.classList.remove("is-bad");
    els.body.innerHTML = "";
    showScreen("screen-challenge");
    const runners = {
      decode: runDecode,
      company: runCompany,
      draw: runDraw,
      tool: runTool,
      glitch: runGlitch,
      logic: runLogic,
      rapid: runRapid,
      bonus: runBonus
    };
    runners[section.id]();
  }

  function choiceGrid(options, onPick) {
    const wrap = document.createElement("div");
    wrap.className = "choices";
    wrap.setAttribute("role", "group");
    options.forEach((label, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      const key = document.createElement("span");
      key.className = "choice-key";
      key.textContent = LETTERS[i];
      const text = document.createElement("span");
      text.textContent = label;
      btn.append(key, text);
      btn.addEventListener("click", () => onPick(i, btn, wrap));
      wrap.appendChild(btn);
    });
    return wrap;
  }

  function lockChoices(wrap, picked, correct) {
    [...wrap.querySelectorAll(".choice")].forEach((btn, i) => {
      btn.disabled = true;
      if (i === picked) btn.classList.add("is-selected");
      if (typeof correct === "number") {
        if (i === correct) btn.classList.add("is-correct");
        if (i === picked && i !== correct) btn.classList.add("is-wrong");
        if (i !== picked && i !== correct) btn.classList.add("is-dimmed");
      }
    });
  }

  function award(points, copy, ok) {
    if (!state.round || state.round.settled) return;
    state.round.settled = true;
    stopTimer();
    document.querySelectorAll("#challenge-body button, #challenge-body input, #challenge-body textarea").forEach((node) => {
      node.disabled = true;
    });
    state.round.awarded = points;
    state.score += points;
    if (ok) {
      audio.correct();
      haptic([10, 30, 16]);
      els.status.classList.remove("is-bad");
    } else {
      audio.wrong();
      haptic([40, 40, 40]);
      els.status.classList.add("is-bad");
    }
    els.status.textContent = copy;
    window.setTimeout(() => showRound(copy), 900);
  }

  function showRound(copy) {
    const gained = state.round.awarded;
    els.roundEyebrow.textContent = state.round.section.title;
    els.roundTitle.textContent = gained ? `+${gained}` : "0";
    els.roundCopy.textContent = copy;
    els.roundTotal.textContent = `Total ${state.score} pts · Spin ${state.spin} of ${SPINS_PER_PLAYER}`;
    state.log.push({ title: state.round.section.title, points: gained });
    showScreen("screen-round");
    if (gained >= 10) fx.burst(80);
    els.nextRound.focus();
  }

  function continueAfterRound() {
    if (state.spin >= SPINS_PER_PLAYER) {
      finishPlayer();
      return;
    }
    els.spin.disabled = false;
    els.spin.classList.add("is-armed");
    els.hubLabel.textContent = "SPIN";
    updateWheelHud();
    showScreen("screen-wheel");
    els.spin.focus();
  }

  function updateWheelHud() {
    els.wheelKicker.textContent = `Round ${state.spin + 1} of ${SPINS_PER_PLAYER}`;
    els.wheelTitle.textContent = state.spin === 0 ? "Tap the hub. Let the industry decide." : "Spin again. Different function. Same pressure.";
    els.scoreChip.textContent = `${state.score} pts`;
    els.hud.textContent = `${state.name || "Player"} · ${state.score} pts · ${state.spin}/${SPINS_PER_PLAYER}`;
    els.wheelHint.textContent = "One spin. One challenge. No textbook questions.";
  }

  function runDecode() {
    const item = fromPool(DECODE, state.round.difficulty);
    state.round.item = item;
    const frame = document.createElement("div");
    frame.className = "scene-frame";
    frame.innerHTML = item.scene;
    const options = shuffleLabels(item.options, item.answer);
    els.body.append(frame, choiceGrid(options, (i, btn, wrap) => {
      if (state.locked) return;
      state.locked = true;
      const ok = options[i] === item.answer;
      lockChoices(wrap, i, options.indexOf(item.answer));
      award(ok ? state.round.points : 0, ok ? `Yes — ${item.answer}.` : `It was ${item.answer}.`, ok);
      state.locked = false;
    }));
  }

  function shuffleLabels(options, answer) {
    const unique = [...new Set(options)];
    if (!unique.includes(answer)) unique[0] = answer;
    return shuffle(unique).slice(0, 4);
  }

  function runCompany() {
    const item = pick(COMPANIES);
    state.round.item = item;
    state.round.clue = 0;
    const decoys = shuffle(COMPANIES.filter((c) => c.answer !== item.answer)).slice(0, 3).map((c) => c.answer);
    const stack = document.createElement("div");
    stack.className = "clue-stack";
    item.clues.forEach((text, i) => {
      const card = document.createElement("article");
      card.className = `clue-card ${i === 0 ? "is-live" : "is-hidden"}`;
      card.dataset.clue = String(i);
      const idx = document.createElement("p");
      idx.className = "clue-index";
      idx.textContent = `CLUE ${i + 1}`;
      const p = document.createElement("p");
      p.textContent = text;
      card.append(idx, p);
      stack.appendChild(card);
    });
    const row = document.createElement("div");
    row.className = "guess-row";
    const input = document.createElement("input");
    input.placeholder = "Name the company";
    input.setAttribute("aria-label", "Company guess");
    const guessBtn = document.createElement("button");
    guessBtn.className = "cta cta-primary";
    guessBtn.type = "button";
    guessBtn.textContent = "That's my guess";
    const nextBtn = document.createElement("button");
    nextBtn.className = "cta cta-ghost";
    nextBtn.type = "button";
    nextBtn.textContent = "Need another clue";
    row.append(input, guessBtn, nextBtn);
    els.body.append(stack, row);

    const reveal = () => {
      const i = state.round.clue;
      stack.querySelectorAll(".clue-card").forEach((card, idx) => {
        card.classList.toggle("is-live", idx === i);
        card.classList.toggle("is-hidden", idx > i);
      });
      if (i >= 2) nextBtn.disabled = true;
    };

    const failForward = () => {
      if (state.round.clue < 2) {
        state.round.clue += 1;
        audio.wrong();
        haptic(20);
        reveal();
        els.status.textContent = "Not yet. Next clue.";
        els.status.classList.add("is-bad");
        return false;
      }
      row.remove();
      const options = shuffle([item.answer, ...decoys]);
      els.body.appendChild(choiceGrid(options, (idx, btn, wrap) => {
        const ok = options[idx] === item.answer;
        lockChoices(wrap, idx, options.indexOf(item.answer));
        award(ok ? 5 : 0, ok ? `${item.answer} — last-clue save.` : `It was ${item.answer}.`, ok);
      }));
      return true;
    };

    guessBtn.addEventListener("click", () => {
      if (matches(input.value, item.aliases, item.answer)) {
        const map = [15, 10, 5];
        award(map[state.round.clue], `${item.answer} after clue ${state.round.clue + 1}.`, true);
        guessBtn.disabled = true;
        nextBtn.disabled = true;
        return;
      }
      failForward();
    });
    nextBtn.addEventListener("click", failForward);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") guessBtn.click();
    });
  }

  function runDraw() {
    const word = pick(DRAW_WORDS[state.round.difficulty]);
    const wrap = document.createElement("div");
    wrap.className = "draw-wrap";
    const prompt = document.createElement("p");
    prompt.className = "draw-word";
    prompt.textContent = `Draw: ${word}`;
    const canvas = document.createElement("canvas");
    canvas.className = "sketch";
    const tools = document.createElement("div");
    tools.className = "cta-row";
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "cta cta-ghost";
    clearBtn.textContent = "Clear";
    const yes = document.createElement("button");
    yes.type = "button";
    yes.className = "cta cta-primary";
    yes.textContent = "They guessed it";
    const no = document.createElement("button");
    no.type = "button";
    no.className = "cta cta-reset";
    no.textContent = "Time / miss";
    tools.append(clearBtn, yes, no);
    wrap.append(prompt, canvas, tools);
    els.body.appendChild(wrap);
    setupDraw(canvas, clearBtn);
    const settle = (ok) => {
      yes.disabled = true;
      no.disabled = true;
      award(ok ? state.round.points : 0, ok ? `The room got “${word}”.` : `It was “${word}”.`, ok);
    };
    startTimer(45, () => settle(false));
    yes.addEventListener("click", () => settle(true));
    no.addEventListener("click", () => settle(false));
  }

  function setupDraw(canvas, clearBtn) {
    const g = canvas.getContext("2d");
    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineCap = "round";
      g.lineJoin = "round";
      g.strokeStyle = "#4ee0c5";
      g.lineWidth = 4;
    };
    fit();
    let drawing = false;
    const pos = (event) => {
      const rect = canvas.getBoundingClientRect();
      const src = event.touches ? event.touches[0] : event;
      return { x: src.clientX - rect.left, y: src.clientY - rect.top };
    };
    const start = (event) => {
      event.preventDefault();
      drawing = true;
      const p = pos(event);
      g.beginPath();
      g.moveTo(p.x, p.y);
      haptic(3);
    };
    const move = (event) => {
      if (!drawing) return;
      event.preventDefault();
      const p = pos(event);
      g.lineTo(p.x, p.y);
      g.stroke();
    };
    const end = () => { drawing = false; };
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);
    clearBtn.addEventListener("click", () => {
      const rect = canvas.getBoundingClientRect();
      g.clearRect(0, 0, rect.width, rect.height);
    });
    state.draw = { canvas, fit };
  }

  function runTool() {
    const item = pick(TOOLS);
    const blur = state.round.difficulty === "hard" ? "blur-hard" : state.round.difficulty === "medium" ? "blur-medium" : "blur-easy";
    const stage = document.createElement("div");
    stage.className = "tool-stage";
    const inner = document.createElement("div");
    inner.className = `tool-blur ${blur}`;
    inner.innerHTML = item.html();
    stage.appendChild(inner);
    const options = shuffleLabels([item.answer, ...shuffle(TOOLS.filter((t) => t.answer !== item.answer)).slice(0, 3).map((t) => t.answer)], item.answer);
    els.body.append(stage, choiceGrid(options, (i, btn, wrap) => {
      const ok = options[i] === item.answer;
      lockChoices(wrap, i, options.indexOf(item.answer));
      inner.classList.remove("blur-easy", "blur-medium", "blur-hard");
      award(ok ? state.round.points : 0, ok ? `${item.answer}.` : `It was ${item.answer}.`, ok);
    }));
  }

  function runGlitch() {
    const item = fromPool(GLITCHES, state.round.difficulty);
    const card = document.createElement("p");
    card.className = "glitch-card";
    card.textContent = item.prompt;
    const options = item.options;
    els.body.append(card, choiceGrid(options, (i, btn, wrap) => {
      const ok = i === item.answer;
      lockChoices(wrap, i, item.answer);
      award(ok ? state.round.points : 0, ok ? "You caught the glitch." : `Strongest read: ${options[item.answer]}`, ok);
    }));
  }

  function runLogic() {
    const item = fromPool(LOGIC, state.round.difficulty);
    const board = document.createElement("div");
    board.className = "logic-board";
    const q = document.createElement("p");
    q.textContent = item.question;
    board.appendChild(q);
    item.stats.forEach(([k, v]) => {
      const row = document.createElement("div");
      row.className = "logic-stat";
      const left = document.createElement("span");
      left.textContent = k;
      const right = document.createElement("b");
      right.textContent = v;
      row.append(left, right);
      board.appendChild(row);
    });
    els.body.append(board, choiceGrid(item.options, (i, btn, wrap) => {
      const ok = i === item.answer;
      lockChoices(wrap, i, item.answer);
      award(ok ? state.round.points : 0, ok ? "Clean call." : `Best call: ${item.options[item.answer]}`, ok);
    }));
  }

  function runRapid() {
    const item = pick(RAPID);
    const prompt = document.createElement("p");
    prompt.className = "rapid-prompt";
    prompt.textContent = item.prompt;
    const hint = document.createElement("p");
    hint.className = "lede";
    hint.textContent = "Player speaks. When time ends, volunteer taps how many answers were valid.";
    const counts = document.createElement("div");
    counts.className = "count-row";
    counts.hidden = true;
    [0, 1, 2, 3, 4, 5].forEach((n) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "count-btn";
      btn.textContent = String(n);
      btn.addEventListener("click", () => {
        const pts = n >= 5 ? 10 : n === 4 ? 5 : 0;
        award(pts, n >= 5 ? "Five. Under pressure." : n === 4 ? "Four — half credit." : "Need five to score.", n >= 4);
      });
      counts.appendChild(btn);
    });
    els.body.append(prompt, hint, counts);
    startTimer(10, () => {
      counts.hidden = false;
      els.status.textContent = "How many were valid?";
      audio.land();
    });
  }

  function runBonus() {
    const item = pick(BONUS);
    const card = document.createElement("p");
    card.className = "scenario";
    card.textContent = item.prompt;
    els.body.appendChild(card);
    startTimer(20, () => {
      els.status.textContent = "Time. Lock a decision.";
      audio.tick(0.1);
    });
    if (item.type === "mcq") {
      els.body.appendChild(choiceGrid(item.options, (i, btn, wrap) => {
        stopTimer();
        const ok = i === item.best;
        lockChoices(wrap, i, item.best);
        award(ok ? 15 : 5, ok ? "That's the operator's move." : `Strongest move: ${item.options[item.best]}`, ok);
      }));
      return;
    }
    const why = document.createElement("textarea");
    why.className = "why-box";
    why.placeholder = "20 seconds — decide, then defend it in one line.";
    els.body.appendChild(why);
    els.body.appendChild(choiceGrid(item.options, (i, btn, wrap) => {
      lockChoices(wrap, i, i);
      wrap.querySelectorAll(".choice").forEach((c) => { c.disabled = true; });
    }));
    const judge = document.createElement("div");
    judge.className = "cta-row";
    [["Decision only · 5", 5, false], ["Reasonable why · 10", 10, true], ["Strong reasoning · 15", 15, true]].forEach(([label, pts, ok]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = pts === 15 ? "cta cta-primary" : "cta cta-ghost";
      btn.textContent = label;
      btn.addEventListener("click", () => {
        stopTimer();
        award(pts, `${pts} for judgement.`, ok);
      });
      judge.appendChild(btn);
    });
    els.body.appendChild(judge);
  }

  function startTimer(seconds, onEnd) {
    stopTimer();
    els.timerPill.hidden = false;
    let left = seconds;
    els.timerPill.textContent = String(left);
    els.timerPill.classList.toggle("is-hot", left <= 5);
    state.timer = window.setInterval(() => {
      left -= 1;
      els.timerPill.textContent = String(Math.max(0, left));
      els.timerPill.classList.toggle("is-hot", left <= 5);
      if (left <= 5 && left > 0) {
        audio.tick(0.09);
        haptic(8);
      }
      if (left <= 0) {
        stopTimer();
        onEnd?.();
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timer) {
      window.clearInterval(state.timer);
      state.timer = null;
    }
  }

  function tierFor(score) {
    return TIERS.find((tier) => score >= tier.min);
  }

  function finishPlayer() {
    stopTimer();
    const tier = tierFor(state.score);
    els.tierKicker.textContent = tier.name;
    els.resultTitle.textContent = tier.title;
    els.resultCopy.textContent = `${state.name || "This participant"} ran four live business challenges at NEXORA · GLC 4.0.`;
    els.finalScore.textContent = String(state.score);
    els.prizeLine.textContent = tier.prize;
    els.roundLog.innerHTML = "";
    state.log.forEach((row) => {
      const li = document.createElement("li");
      const a = document.createElement("span");
      a.textContent = row.title;
      const b = document.createElement("span");
      b.textContent = `+${row.points}`;
      li.append(a, b);
      els.roundLog.appendChild(li);
    });
    const board = readBoard();
    board.unshift({ name: state.name || "Anonymous", score: state.score, tier: tier.name, at: Date.now() });
    writeBoard(board);
    showScreen("screen-result");
    audio.fanfare(state.score);
    if (state.score >= 30) fx.burst(140);
    if (state.score >= 50) fx.burst(220);
    haptic([20, 40, 20, 40, 60]);
  }

  function shareText() {
    const tier = tierFor(state.score);
    return [
      `NEXORA Business & Tech Spin Wheel`,
      `${state.name || "I"} scored ${state.score} — ${tier.name}`,
      `Spin. Think. Solve. Lead.`,
      `Global Leadership Conference 4.0 · NEXORA — IT Club, TAPMI Bengaluru`
    ].join("\n");
  }

  async function shareResult() {
    const text = shareText();
    els.shareFeedback.textContent = "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "NEXORA GLC 4.0", text });
        els.shareFeedback.textContent = "Shared.";
        return;
      }
    } catch (error) {
      if (error && error.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(text);
      els.shareFeedback.textContent = "Copied to clipboard.";
    } catch {
      els.shareFeedback.textContent = "Copy the score from the screen — sharing is unavailable here.";
    }
  }

  function resetPlayer(toLanding) {
    stopTimer();
    state.locked = false;
    state.spinning = false;
    state.score = 0;
    state.spin = 0;
    state.rotation = 0;
    state.usedSections = [];
    state.log = [];
    state.round = null;
    els.status.textContent = "";
    els.shareFeedback.textContent = "";
    els.spin.disabled = false;
    els.hubLabel.textContent = "SPIN";
    drawWheel(0);
    if (toLanding) {
      state.name = "";
      els.name.value = "";
      renderBoard();
      els.hud.textContent = "Spin. Think. Solve. Lead.";
      showScreen("screen-landing");
      els.name.focus();
      return;
    }
    updateWheelHud();
    els.spin.classList.add("is-armed");
    showScreen("screen-wheel");
  }

  function startPlayer(event) {
    event.preventDefault();
    audio.unlock();
    state.name = els.name.value.trim().slice(0, 28);
    resetPlayer(false);
    audio.click();
    haptic(10);
  }

  function bind() {
    els.form.addEventListener("submit", startPlayer);
    els.spin.addEventListener("click", () => {
      if (state.spinning || els.spin.disabled) return;
      state.spin += 1;
      updateWheelHud();
      spinWheel();
    });
    els.nextRound.addEventListener("click", continueAfterRound);
    els.share.addEventListener("click", shareResult);
    els.nextPlayer.addEventListener("click", () => resetPlayer(true));
    els.mute.addEventListener("click", () => {
      state.muted = !state.muted;
      audio.setMuted(state.muted);
      els.mute.textContent = state.muted ? "🔇" : "🔊";
      els.mute.setAttribute("aria-pressed", state.muted ? "true" : "false");
    });
    els.fullscreen.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch {
        /* ignore */
      }
    });
    document.addEventListener("keydown", (event) => {
      const challengeOpen = document.getElementById("screen-challenge").classList.contains("is-active");
      if (!challengeOpen) return;
      const map = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
      if (event.key in map) {
        const buttons = document.querySelectorAll("#challenge-body .choice");
        const target = buttons[map[event.key]];
        if (target && !target.disabled) target.click();
      }
    });
    window.addEventListener("resize", () => {
      sizeCanvas();
      if (state.draw) state.draw.fit();
    });
  }

  function createAudio() {
    let ctx = null;
    let muted = false;
    const unlock = () => {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
    };
    const tone = (freq, dur, type, gain, slide) => {
      if (muted || !ctx) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, ctx.currentTime + dur);
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur + 0.02);
    };
    return {
      unlock,
      setMuted: (value) => { muted = value; },
      click: () => tone(520, 0.08, "triangle", 0.05),
      tick: (gain) => tone(1800, 0.03, "square", gain || 0.04),
      land: () => { tone(220, 0.18, "sine", 0.08, 140); tone(440, 0.22, "triangle", 0.06); },
      correct: () => { tone(523, 0.12, "sine", 0.07); tone(659, 0.14, "sine", 0.06); tone(784, 0.2, "sine", 0.06); },
      wrong: () => tone(140, 0.28, "sawtooth", 0.05, 80),
      fanfare: (score) => {
        tone(392, 0.16, "triangle", 0.06);
        window.setTimeout(() => tone(494, 0.16, "triangle", 0.06), 120);
        window.setTimeout(() => tone(score >= 30 ? 784 : 587, 0.32, "triangle", 0.07), 240);
      }
    };
  }

  function createFx() {
    const canvas = document.getElementById("fx-canvas");
    const g = canvas.getContext("2d");
    let bits = [];
    let raf = 0;
    const resize = () => {
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      g.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    };
    window.addEventListener("resize", resize);
    resize();
    const loop = () => {
      g.clearRect(0, 0, window.innerWidth, window.innerHeight);
      bits = bits.filter((b) => b.life > 0);
      bits.forEach((b) => {
        b.life -= 1;
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.12;
        g.globalAlpha = Math.max(0, b.life / b.max);
        g.fillStyle = b.color;
        g.fillRect(b.x, b.y, b.s, b.s);
      });
      g.globalAlpha = 1;
      if (bits.length) raf = window.requestAnimationFrame(loop);
      else raf = 0;
    };
    return {
      burst(n) {
        const colors = ["#4ee0c5", "#e0c48a", "#7aa2ff", "#f472b6", "#fff"];
        for (let i = 0; i < n; i += 1) {
          bits.push({
            x: window.innerWidth * (0.3 + Math.random() * 0.4),
            y: window.innerHeight * 0.2,
            vx: (Math.random() - 0.5) * 9,
            vy: Math.random() * -7 - 2,
            s: 4 + Math.random() * 5,
            color: colors[i % colors.length],
            life: 70 + Math.random() * 30,
            max: 100
          });
        }
        if (!raf) raf = window.requestAnimationFrame(loop);
      }
    };
  }

  function init() {
    bind();
    renderBoard();
    sizeCanvas();
    els.spin.classList.add("is-armed");
    showScreen("screen-landing");
  }

  window.addEventListener("error", () => {
    if (els.status) els.status.textContent = "Something glitched. Use Next participant to restart.";
  });

  init();
})();
