(function () {
  'use strict';

  var WA_CONFIRM_NUMBER = '573136389010';
  var WA_AYUDA_NUMBER = '573206297449';
  var WEDDING_DATE = new Date('2026-12-06T12:00:00-05:00').getTime();

  var PALM_PATH = '<path d="M12 21c0-4-1-8 .5-12"></path><path d="M12.5 9c-3-1.4-6-1.2-9 .8"></path><path d="M12.5 9c3-1.4 6-1.2 9 .8"></path><path d="M12.5 9c-2-2.8-5-4-8.2-3.8"></path><path d="M12.5 9c2-2.8 5-4 8.2-3.8"></path><path d="M12.5 9c0-2 .3-4 1.4-5.8"></path>';

  var PALMS = [
    { top: '9%',  left: '6%',  size: 46, color: 'rgba(107,83,32,.30)', duration: 11,   delay: 0 },
    { top: '20%', left: '80%', size: 58, color: 'rgba(224,138,106,.26)', duration: 14,   delay: 1.4 },
    { top: '38%', left: '12%', size: 40, color: 'rgba(107,83,32,.28)', duration: 10,   delay: .7 },
    { top: '33%', left: '60%', size: 52, color: 'rgba(107,83,32,.24)', duration: 13,   delay: 2.1 },
    { top: '58%', left: '4%',  size: 54, color: 'rgba(224,138,106,.24)', duration: 12,   delay: .4 },
    { top: '64%', left: '82%', size: 44, color: 'rgba(107,83,32,.28)', duration: 11.5, delay: 1.9 },
    { top: '76%', left: '34%', size: 48, color: 'rgba(107,83,32,.26)', duration: 13.5, delay: 1 },
    { top: '84%', left: '66%', size: 42, color: 'rgba(224,138,106,.22)', duration: 12.5, delay: 2.6 },
    { top: '4%',  left: '46%', size: 38, color: 'rgba(107,83,32,.22)', duration: 10.5, delay: 1.5 },
    { top: '50%', left: '42%', size: 44, color: 'rgba(107,83,32,.18)', duration: 15,   delay: 3 },
    { top: '90%', left: '14%', size: 46, color: 'rgba(107,83,32,.24)', duration: 12,   delay: 2.3 },
    { top: '14%', left: '92%', size: 40, color: 'rgba(224,138,106,.22)', duration: 13,   delay: 1.7 }
  ];

  var GALLERIES = {
    mujer: ['assets/mujer-1.jpeg', 'assets/mujer-2.jpeg', 'assets/mujer-3.jpeg'],
    hombre: ['assets/hombre-1.jpeg', 'assets/hombre-2.jpeg', 'assets/hombre-3.jpeg']
  };
  var GALLERY_TITLES = { mujer: 'Inspiración · Ellas', hombre: 'Inspiración · Ellos' };

  function renderPalms() {
    var host = document.getElementById('palms');
    var html = PALMS.map(function (p) {
      return '<span class="palms__item" style="top:' + p.top + ';left:' + p.left +
        ';width:' + p.size + 'px;height:' + p.size + 'px;color:' + p.color +
        ';animation-duration:' + p.duration + 's;animation-delay:' + p.delay + 's">' +
        '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">' + PALM_PATH + '</svg>' +
        '</span>';
    }).join('');
    host.innerHTML = html;
  }

  function getGuestName() {
    var raw = new URLSearchParams(window.location.search).get('invitado');
    if (!raw) return '';
    try {
      var n = decodeURIComponent(raw).trim().replace(/[_+]/g, ' ');
      var small = { 'y': 1, 'e': 1, 'de': 1, 'del': 1, 'la': 1, 'las': 1, 'los': 1 };
      return n.replace(/\S+/g, function (w) {
        var lw = w.toLowerCase();
        if (small[lw]) return lw;
        return lw.charAt(0).toUpperCase() + lw.slice(1);
      });
    } catch (e) {
      return '';
    }
  }

  // Excepciones: nombres cuyo género NO sigue la regla "termina en 'a' = mujer".
  // Agrega aquí los que hagan falta, en minúscula. Ej: 'andrea': 'm', 'nicolas': 'm'.
  var GENDER_OVERRIDES = {
    'jose': 'm', 'josue': 'm', 'noa': 'm', 'elias': 'm', 'lucas': 'm', 'matias': 'm',
    'tobias': 'm', 'nicolas': 'm', 'andres': 'm',
    'beatriz': 'f', 'isabel': 'f', 'carmen': 'f', 'raquel': 'f', 'ines': 'f',
    'mercedes': 'f', 'dolores': 'f', 'pilar': 'f', 'soledad': 'f'
  };

  function genderOfFirstName(word) {
    var w = (word || '').toLowerCase();
    if (GENDER_OVERRIDES[w]) return GENDER_OVERRIDES[w];
    return /a$/.test(w) ? 'f' : 'm';
  }

  // Devuelve la palabra de saludo y el texto "Estás/Están invitad_" según el nombre.
  function getWelcomeInfo(name) {
    if (!name) return { welcome: 'Bienvenid@', invited: 'Estás invitad@' };
    // Separar en personas por conectores: "y", "e", "&", ","
    var people = name.split(/\s+y\s+|\s+e\s+|\s*&\s*|\s*,\s*/i).filter(Boolean);
    if (people.length > 1) {
      var allFemale = people.every(function (p) {
        return genderOfFirstName(p.trim().split(/\s+/)[0]) === 'f';
      });
      return allFemale
        ? { welcome: 'Bienvenidas', invited: 'Están invitadas' }
        : { welcome: 'Bienvenidos', invited: 'Están invitados' };
    }
    var g = genderOfFirstName(name.split(/\s+/)[0]);
    return g === 'f'
      ? { welcome: 'Bienvenida', invited: 'Estás invitada' }
      : { welcome: 'Bienvenido', invited: 'Estás invitado' };
  }

  function initGuestName() {
    var name = getGuestName();
    var info = getWelcomeInfo(name);
    document.getElementById('greeting').textContent = (name || 'Bienvenid@') + ' 🤍';
    document.getElementById('splash-name').textContent = name || 'Bienvenid@';
    document.getElementById('splash-invited').textContent = info.invited;

    var confirmText = '¡Hola! ' + (name ? 'Soy ' + name + '. ' : '') +
      'Quiero confirmar mi asistencia a la boda de Javier Andrés y Mariana. 🤍';
    document.getElementById('wa-confirm').href =
      'https://wa.me/' + WA_CONFIRM_NUMBER + '?text=' + encodeURIComponent(confirmText);
  }

  function initAyudaLink() {
    var ayudaText = 'Hola, voy a asistir a la Boda de Javier Andrés y Mariana. Ayúdame con los tiquetes de lancha (ida y regreso) y con el hospedaje por favor.';
    document.getElementById('wa-ayuda').href =
      'https://wa.me/' + WA_AYUDA_NUMBER + '?text=' + encodeURIComponent(ayudaText);
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tickCountdown() {
    var diff = Math.max(0, WEDDING_DATE - Date.now());
    var s = Math.floor(diff / 1000);
    document.getElementById('cd-dias').textContent = String(Math.floor(s / 86400));
    document.getElementById('cd-horas').textContent = pad(Math.floor((s % 86400) / 3600));
    document.getElementById('cd-min').textContent = pad(Math.floor((s % 3600) / 60));
    document.getElementById('cd-seg').textContent = pad(s % 60);
  }

  function initCountdown() {
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }

  function initSplash() {
    var splash = document.getElementById('splash');
    var envelope = document.getElementById('envelope-btn');
    document.body.classList.add('is-locked');
    function open() {
      splash.classList.add('is-opened');
      document.body.classList.remove('is-locked');
    }
    splash.addEventListener('click', open);
    envelope.addEventListener('click', open);
  }

  function initGallery() {
    var modal = document.getElementById('gallery');
    var titleEl = document.getElementById('gallery-title');
    var imgEl = document.getElementById('gallery-img');
    var posEl = document.getElementById('gallery-pos');
    var stage = modal.querySelector('.gallery__stage');
    var state = { type: null, idx: 0 };

    function render() {
      var arr = GALLERIES[state.type] || [];
      titleEl.textContent = GALLERY_TITLES[state.type] || '';
      imgEl.src = arr[state.idx] || '';
      posEl.textContent = arr.length ? (state.idx + 1) + ' / ' + arr.length : '';
    }

    function open(type) {
      state.type = type;
      state.idx = 0;
      render();
      modal.hidden = false;
    }

    function close() { modal.hidden = true; }

    function step(delta) {
      var arr = GALLERIES[state.type] || [];
      if (!arr.length) return;
      state.idx = (state.idx + delta + arr.length) % arr.length;
      render();
    }

    document.querySelectorAll('[data-gallery]').forEach(function (btn) {
      btn.addEventListener('click', function () { open(btn.getAttribute('data-gallery')); });
    });

    document.getElementById('gallery-prev').addEventListener('click', function (e) {
      e.stopPropagation();
      step(-1);
    });
    document.getElementById('gallery-next').addEventListener('click', function (e) {
      e.stopPropagation();
      step(1);
    });
    document.getElementById('gallery-close').addEventListener('click', close);
    modal.addEventListener('click', close);
    stage.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderPalms();
    initGuestName();
    initAyudaLink();
    initCountdown();
    initSplash();
    initGallery();
  });
})();
