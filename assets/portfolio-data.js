/* ============================================================
   A7C — DADOS DO PORTFÓLIO
   Apenas empresas do portfólio, de frente para o público.
   (Sem estruturas jurídicas, holdings ou trusts.)
   Campos de texto por idioma: pt · it · en · es
   cat:   tech | crypto | ai | realestate | financial | artfun
   status: impl | ativo | saida | exit
   geo:   na (Am. Norte) | sa (Am. Sul) | asia
   ============================================================ */
window.A7C_PORTFOLIO = [
  {
    id: "ane3",
    name: "ANE3+",
    year: 2024, decade: "2020s",
    cat: "ai", status: "impl", geo: "sa",
    place: { pt: "São Paulo · Brasil", it: "San Paolo · Brasile", en: "São Paulo · Brazil", es: "São Paulo · Brasil" },
    sector: { pt: "Inteligência aplicada", it: "Intelligenza applicata", en: "Applied intelligence", es: "Inteligencia aplicada" },
    desc: {
      pt: "Startup de IA aplicada a decisões de investimento — leitura de risco, oportunidade e timing em tempo real.",
      it: "Startup di IA applicata alle decisioni di investimento — lettura di rischio, opportunità e timing in tempo reale.",
      en: "Applied-AI startup for investment decisions — reading risk, opportunity and timing in real time.",
      es: "Startup de IA aplicada a decisiones de inversión — lectura de riesgo, oportunidad y timing en tiempo real."
    }
  },
  {
    id: "jjunior",
    name: "JJUNIOR Uberaba",
    year: 2023, decade: "2020s",
    cat: "realestate", status: "impl", geo: "sa",
    place: { pt: "Uberaba, MG · Brasil", it: "Uberaba, MG · Brasile", en: "Uberaba, MG · Brazil", es: "Uberaba, MG · Brasil" },
    sector: { pt: "Desenvolvimento imobiliário", it: "Sviluppo immobiliare", en: "Real estate development", es: "Desarrollo inmobiliario" },
    desc: {
      pt: "Desenvolvimento de dois empreendimentos âncora — Morada do Verde e Pier 99 — em Uberaba.",
      it: "Sviluppo di due progetti àncora — Morada do Verde e Pier 99 — a Uberaba.",
      en: "Development of two anchor projects — Morada do Verde and Pier 99 — in Uberaba.",
      es: "Desarrollo de dos proyectos ancla — Morada do Verde y Pier 99 — en Uberaba."
    }
  },
  {
    id: "titanpark",
    name: "Titan Park Uberaba",
    year: 2022, decade: "2020s",
    cat: "artfun", status: "impl", geo: "sa",
    place: { pt: "Uberaba, MG · Brasil", it: "Uberaba, MG · Brasile", en: "Uberaba, MG · Brazil", es: "Uberaba, MG · Brasil" },
    sector: { pt: "Entretenimento & cultura", it: "Intrattenimento & cultura", en: "Entertainment & culture", es: "Entretenimiento & cultura" },
    desc: {
      pt: "Parque temático de dinossauros sobre sítio paleontológico reconhecido pela UNESCO.",
      it: "Parco a tema dinosauri su un sito paleontologico riconosciuto dall'UNESCO.",
      en: "Dinosaur theme park on a paleontological site recognized by UNESCO.",
      es: "Parque temático de dinosaurios sobre un sitio paleontológico reconocido por la UNESCO."
    }
  },
  {
    id: "spotx",
    name: "SpotX Hotel",
    year: 2019, decade: "2010s",
    cat: "realestate", status: "ativo", geo: "na",
    place: { pt: "Orlando, FL · EUA", it: "Orlando, FL · USA", en: "Orlando, FL · USA", es: "Orlando, FL · EE.UU." },
    sector: { pt: "Hospitalidade", it: "Ospitalità", en: "Hospitality", es: "Hospitalidad" },
    desc: {
      pt: "Ativo hoteleiro em Orlando, no coração do mercado turístico da Flórida.",
      it: "Asset alberghiero a Orlando, nel cuore del mercato turistico della Florida.",
      en: "Hotel asset in Orlando, at the heart of Florida's tourism market.",
      es: "Activo hotelero en Orlando, en el corazón del mercado turístico de Florida."
    }
  },
  {
    id: "ipvive",
    name: "IpVive",
    year: 2017, decade: "2010s",
    cat: "tech", status: "ativo", geo: "na",
    place: { pt: "Silicon Valley, CA · EUA", it: "Silicon Valley, CA · USA", en: "Silicon Valley, CA · USA", es: "Silicon Valley, CA · EE.UU." },
    sector: { pt: "Telecom & software", it: "Telecom & software", en: "Telecom & software", es: "Telecom & software" },
    desc: {
      pt: "Plataforma de telecom e software nascida no Vale do Silício.",
      it: "Piattaforma di telecom e software nata nella Silicon Valley.",
      en: "Telecom and software platform born in Silicon Valley.",
      es: "Plataforma de telecom y software nacida en Silicon Valley."
    }
  },
  {
    id: "ekopar",
    name: "Ekopar Construtora",
    year: 2014, decade: "2010s",
    cat: "realestate", status: "ativo", geo: "sa",
    place: { pt: "São Caetano, SP · Brasil", it: "São Caetano, SP · Brasile", en: "São Caetano, SP · Brazil", es: "São Caetano, SP · Brasil" },
    sector: { pt: "Construção & retrofit", it: "Costruzione & retrofit", en: "Construction & retrofit", es: "Construcción & retrofit" },
    desc: {
      pt: "Construtora focada em desenvolvimento e retrofit no ABC paulista.",
      it: "Impresa di costruzioni focalizzata su sviluppo e retrofit nella grande San Paolo.",
      en: "Construction firm focused on development and retrofit in greater São Paulo.",
      es: "Constructora enfocada en desarrollo y retrofit en el Gran São Paulo."
    }
  },
  {
    id: "spfidc",
    name: "SP Banco FIDC",
    year: 2008, decade: "2000s",
    cat: "financial", status: "exit", geo: "sa", exitYear: 2016,
    place: { pt: "Brasil", it: "Brasile", en: "Brazil", es: "Brasil" },
    sector: { pt: "Crédito estruturado", it: "Credito strutturato", en: "Structured credit", es: "Crédito estructurado" },
    desc: {
      pt: "Fundo de direitos creditórios estruturado para crédito a empresas no Brasil.",
      it: "Fondo di crediti strutturato per il credito alle imprese in Brasile.",
      en: "Receivables fund structured for corporate credit in Brazil.",
      es: "Fondo de derechos creditorios estructurado para crédito a empresas en Brasil."
    },
    exit: {
      pt: "Exit encerrado em 2016, após ciclo completo de estruturação e desinvestimento.",
      it: "Exit concluso nel 2016, dopo un ciclo completo di strutturazione e disinvestimento.",
      en: "Exit closed in 2016, after a full cycle of structuring and divestment.",
      es: "Exit cerrado en 2016, tras un ciclo completo de estructuración y desinversión."
    }
  },
  {
    id: "go2next",
    name: "Go2next",
    year: 2004, decade: "2000s",
    cat: "tech", status: "exit", geo: "asia", exitYear: 2013,
    place: { pt: "Tóquio · Japão", it: "Tokyo · Giappone", en: "Tokyo · Japan", es: "Tokio · Japón" },
    sector: { pt: "Telecom", it: "Telecom", en: "Telecom", es: "Telecom" },
    desc: {
      pt: "Operação de tecnologia no Japão, hoje parte do grupo Ricoh.",
      it: "Operazione tecnologica in Giappone, oggi parte del gruppo Ricoh.",
      en: "Technology operation in Japan, today part of the Ricoh group.",
      es: "Operación tecnológica en Japón, hoy parte del grupo Ricoh."
    },
    exit: {
      pt: "Adquirida pela Ricoh em 2013 — exit estratégico para um grupo global.",
      it: "Acquisita da Ricoh nel 2013 — un exit strategico verso un gruppo globale.",
      en: "Acquired by Ricoh in 2013 — a strategic exit to a global group.",
      es: "Adquirida por Ricoh en 2013 — un exit estratégico hacia un grupo global."
    }
  }
];

/* Taxonomia de filtros. Rótulos de categoria são nomes de marca
   (mesmos em todos os idiomas); status/geografia usam i18n. */
window.A7C_PF_META = {
  categories: [
    { id: "tech",       label: "Tech / Software" },
    { id: "crypto",     label: "Crypto & Web3" },
    { id: "ai",         label: "AI" },
    { id: "realestate", label: "Real Estate" },
    { id: "financial",  label: "Financial" },
    { id: "artfun",     label: "Art & Fun" }
  ],
  statuses: [
    { id: "impl",  key: "st.impl" },
    { id: "ativo", key: "st.ativo" },
    { id: "saida", key: "st.saida" },
    { id: "exit",  key: "st.exit" }
  ],
  geos: [
    { id: "na",   key: "geo.na" },
    { id: "sa",   key: "geo.sa" },
    { id: "asia", key: "geo.asia" }
  ],
  decades: ["2020s", "2010s", "2000s"]
};
