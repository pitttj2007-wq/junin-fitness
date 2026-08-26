document.getElementById('year').textContent = new Date().getFullYear();

// ---- Menú móvil ----
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const mobileNav = document.getElementById('mobileNav');

function openNav() {
  mobileNav.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
}
function closeNav() {
  mobileNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle?.addEventListener('click', openNav);
navClose?.addEventListener('click', closeNav);
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

// ---- Horario abierto/cerrado en tiempo real ----
(function () {
  const statusEl = document.getElementById('hoursStatus');
  const textEl = document.getElementById('hoursStatusText');
  if (!statusEl || !textEl) return;

  const OPEN_HOUR = 8;
  const CLOSE_HOUR = 21;
  const TZ = 'America/Argentina/Buenos_Aires';

  // Horario del estudio en Buenos Aires, sin importar la zona horaria de quien visita el sitio
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).formatToParts(new Date());

  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const get = (type) => parts.find(p => p.type === type)?.value;
  const day = weekdayMap[get('weekday')];
  const hour = Number(get('hour')) + Number(get('minute')) / 60;
  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && hour >= OPEN_HOUR && hour < CLOSE_HOUR;

  statusEl.classList.add(isOpen ? 'open' : 'closed');

  if (isOpen) {
    textEl.textContent = `Abierto ahora · cierra a las ${CLOSE_HOUR}:00`;
  } else if (isWeekday && hour < OPEN_HOUR) {
    textEl.textContent = `Cerrado ahora · abre hoy a las ${OPEN_HOUR}:00`;
  } else {
    textEl.textContent = 'Cerrado ahora · abre el próximo día hábil a las 8:00';
  }

  const rows = document.querySelectorAll('.hours-table tr[data-day]');
  rows.forEach(row => {
    if (Number(row.dataset.day) === day) row.classList.add('today');
  });
})();

// ---- Scroll reveal ----
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => observer.observe(el));
})();

// ---- Compartir ----
document.getElementById('shareBtn')?.addEventListener('click', async () => {
  const shareData = {
    title: 'Junín Fitness',
    text: 'Pilates, entrenamiento funcional y rehabilitación con Diego Leiras en Recoleta.',
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copiado al portapapeles');
    }
  } catch (err) {
    // usuario canceló el share o el navegador no soporta clipboard; no hacemos nada
  }
});
