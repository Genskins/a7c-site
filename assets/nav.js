(function () {
  function init() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    /* ---- inject hamburger button ---- */
    const btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-label', 'Menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);

    /* ---- build full-screen drawer ---- */
    const drawer = document.createElement('div');
    drawer.className = 'nav-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Menu de navegação');
    drawer.setAttribute('aria-hidden', 'true');

    /* clone nav links */
    const origLinks = nav.querySelector('.nav-links');
    if (origLinks) {
      const ul = origLinks.cloneNode(true);
      ul.className = 'drawer-links';
      drawer.appendChild(ul);
    }

    /* lang placeholder — synced from main .lang via MutationObserver */
    const drawerLang = document.createElement('div');
    drawerLang.className = 'drawer-lang';
    drawer.appendChild(drawerLang);

    /* insert drawer right after <header> */
    nav.insertAdjacentElement('afterend', drawer);

    /* ---- open / close ---- */
    function open() {
      document.documentElement.classList.add('nav-open');
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      document.documentElement.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      document.documentElement.classList.contains('nav-open') ? close() : open();
    });

    /* close on link click inside drawer */
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) close();
    });

    /* close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    /* ---- sync lang selector into drawer ---- */
    const mainLang = nav.querySelector('.lang');
    function syncLang() {
      if (!mainLang) return;
      /* rebuild buttons, delegate clicks back to main buttons */
      const mainBtns = mainLang.querySelectorAll('button, .sep');
      drawerLang.innerHTML = '';
      mainBtns.forEach(function (node) {
        if (node.classList.contains('sep')) {
          const sep = document.createElement('span');
          sep.className = 'sep';
          sep.textContent = node.textContent;
          drawerLang.appendChild(sep);
        } else {
          const b = document.createElement('button');
          b.textContent = node.textContent;
          if (node.classList.contains('is-active')) b.classList.add('is-active');
          b.addEventListener('click', function () { node.click(); close(); });
          drawerLang.appendChild(b);
        }
      });
    }

    if (mainLang) {
      const obs = new MutationObserver(syncLang);
      obs.observe(mainLang, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }
    /* also sync after i18n fires */
    document.addEventListener('a7c:lang', syncLang);
    window.addEventListener('load', syncLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
