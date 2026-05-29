/* ============================================================
   A7C — PORTFÓLIO: filtros + grid + detalhe
   Renderiza a partir de window.A7C_PORTFOLIO / A7C_PF_META.
   Reage à troca de idioma (evento 'a7c:lang').
   ============================================================ */
(function () {
  const DATA = window.A7C_PORTFOLIO || [];
  const META = window.A7C_PF_META || {};

  function lang() {
    return (window.A7C_I18N && (window.A7C_I18N.lang || window.A7C_I18N.current())) || "pt";
  }
  function t(key) {
    const d = (window.A7C_I18N && window.A7C_I18N.dict[lang()]) || {};
    return d[key] != null ? d[key] : key;
  }
  function field(obj) {
    if (!obj) return "";
    return obj[lang()] != null ? obj[lang()] : obj.pt;
  }

  const catLabel = (id) => (META.categories.find((c) => c.id === id) || {}).label || id;

  // estado de filtros — Set por grupo; vazio = todos
  const filters = { cat: new Set(), status: new Set(), geo: new Set(), decade: new Set() };

  const els = {};
  let openId = null;

  function statusKey(id) {
    return ({ impl: "st.impl", ativo: "st.ativo", saida: "st.saida", exit: "st.exit" })[id];
  }

  /* ---------- Barra de filtros ---------- */
  function buildFilters() {
    const wrap = els.filters;
    wrap.innerHTML = "";

    const groups = [
      { key: "cat",    label: t("port.f.cat"),    items: META.categories.map((c) => ({ v: c.id, t: c.label })) },
      { key: "status", label: t("port.f.status"), items: META.statuses.map((s) => ({ v: s.id, t: t(s.key) })) },
      { key: "geo",    label: t("port.f.geo"),    items: META.geos.map((g) => ({ v: g.id, t: t(g.key) })) },
      { key: "decade", label: t("port.f.decade"), items: META.decades.map((d) => ({ v: d, t: d })) }
    ];

    groups.forEach((g) => {
      const row = document.createElement("div");
      row.className = "fgroup";

      const lab = document.createElement("span");
      lab.className = "fgroup-label";
      lab.textContent = g.label;
      row.appendChild(lab);

      const chips = document.createElement("div");
      chips.className = "fchips";
      g.items.forEach((it) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip";
        b.textContent = it.t;
        b.setAttribute("aria-pressed", filters[g.key].has(it.v) ? "true" : "false");
        if (filters[g.key].has(it.v)) b.classList.add("is-on");
        b.addEventListener("click", () => {
          if (filters[g.key].has(it.v)) filters[g.key].delete(it.v);
          else filters[g.key].add(it.v);
          render();
        });
        chips.appendChild(b);
      });
      row.appendChild(chips);
      wrap.appendChild(row);
    });

    // botão limpar
    const anyOn = Object.values(filters).some((s) => s.size > 0);
    els.clear.textContent = "↺  " + t("port.f.clear");
    els.clear.style.display = anyOn ? "inline-flex" : "none";
  }

  /* ---------- Filtragem + ordenação ---------- */
  function selected() {
    let list = DATA.filter((c) => {
      if (filters.cat.size && !filters.cat.has(c.cat)) return false;
      if (filters.status.size && !filters.status.has(c.status)) return false;
      if (filters.geo.size && !filters.geo.has(c.geo)) return false;
      if (filters.decade.size && !filters.decade.has(c.decade)) return false;
      return true;
    });
    list.sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));
    return list;
  }

  /* ---------- Grid ---------- */
  function cardEl(c) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "pcard reveal in";
    card.dataset.id = c.id;

    card.innerHTML =
      '<div class="pcard-top">' +
        '<span class="pcat">' + catLabel(c.cat) + '</span>' +
        '<span class="pyear">' + c.year + '</span>' +
      '</div>' +
      '<h3 class="pname">' + c.name + '</h3>' +
      '<p class="pdesc">' + field(c.desc) + '</p>' +
      '<div class="pmeta">' +
        '<span class="pstatus"><i class="glyph st-' + c.status + '"></i>' + t(statusKey(c.status)) + '</span>' +
        '<span class="pgeo">' + field(c.place) + '</span>' +
      '</div>' +
      (c.exit ? '<span class="pexit-tag">' + t("card.exit") + ' · ' + c.exitYear + '</span>' : '');

    card.addEventListener("click", () => openModal(c.id));
    return card;
  }

  function render() {
    buildFilters();
    const list = selected();
    els.grid.innerHTML = "";
    list.forEach((c) => els.grid.appendChild(cardEl(c)));

    els.count.textContent = list.length + " " + t("port.count");
    els.empty.textContent = t("port.empty");
    els.empty.style.display = list.length ? "none" : "block";
  }

  /* ---------- Modal de detalhe ---------- */
  function row(label, value) {
    return '<div class="drow"><span class="dlabel">' + label + '</span><span class="dvalue">' + value + '</span></div>';
  }
  function fillModal(c) {
    els.mBody.innerHTML =
      '<span class="m-cat">' + catLabel(c.cat) + '</span>' +
      '<h2 class="m-name">' + c.name + '</h2>' +
      '<div class="m-year">' + c.year + (c.exit ? ' → ' + c.exitYear : '') + '</div>' +
      '<p class="m-desc">' + field(c.desc) + '</p>' +
      '<div class="m-rows">' +
        row(t("card.sector"), field(c.sector)) +
        row(t("card.status"), '<span class="pstatus"><i class="glyph st-' + c.status + '"></i>' + t(statusKey(c.status)) + '</span>') +
        row(t("card.geo"), field(c.place)) +
      '</div>' +
      (c.exit ? '<div class="m-exit"><span class="m-exit-k">' + t("card.exit") + '</span><p>' + field(c.exit) + '</p></div>' : '');
  }
  function openModal(id) {
    const c = DATA.find((x) => x.id === id);
    if (!c) return;
    openId = id;
    fillModal(c);
    els.modal.classList.add("open");
    els.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    openId = null;
    els.modal.classList.remove("open");
    els.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    els.filters = document.getElementById("filters");
    els.clear = document.getElementById("clearFilters");
    els.grid = document.getElementById("grid");
    els.count = document.getElementById("count");
    els.empty = document.getElementById("empty");
    els.modal = document.getElementById("modal");
    els.mBody = document.getElementById("modalBody");

    els.clear.addEventListener("click", () => {
      Object.values(filters).forEach((s) => s.clear());
      render();
    });
    els.modal.addEventListener("click", (e) => {
      if (e.target === els.modal || e.target.closest("[data-close]")) closeModal();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && openId) closeModal(); });

    document.addEventListener("a7c:lang", () => {
      render();
      if (openId) { const c = DATA.find((x) => x.id === openId); if (c) fillModal(c); }
    });

    render();
  });
})();
