/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});
/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});
/* ===== NETWORK CANVAS ANIMATION ===== */
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
let nodes = [], animFrame;
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
function createNodes(count) {
  nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1
    });
  }
}
createNodes(60);
function drawNetwork() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
  });
  nodes.forEach((a, i) => {
    nodes.slice(i + 1).forEach(b => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 140) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(56,189,248,${0.15 * (1 - d / 140)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });
  });
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56,189,248,0.5)';
    ctx.fill();
  });
  animFrame = requestAnimationFrame(drawNetwork);
}
drawNetwork();
/* ===== REVEAL ON SCROLL ===== */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));
/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = Math.ceil(target / 60);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(interval);
  }, 25);
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);
/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
/* ===== CONTACT FORM → N8N WEBHOOK ===== */
const WEBHOOK_URL = 'https://freddyparada.app.n8n.cloud/webhook/27981f93-d017-4f9f-91f2-51329f963a27';
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const payload = {
      nombre:   document.getElementById('nombre').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      email:    document.getElementById('email').value.trim(),
      barrio:   document.getElementById('barrio').value.trim(),
      interes:  document.getElementById('interes').value,
      mensaje:  document.getElementById('mensaje').value.trim(),
      fecha:    new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      origen:   window.location.href
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        formSuccess.textContent = '✅ ¡Solicitud enviada! Te contactaremos pronto.';
        formSuccess.style.color = '#22c55e';
      } else {
        formSuccess.textContent = '⚠️ Solicitud recibida, pero hubo un problema. Contáctanos por WhatsApp.';
        formSuccess.style.color = '#f59e0b';
      }
    } catch (err) {
      console.error('Error al enviar al webhook:', err);
      formSuccess.textContent = '❌ Error de conexión. Por favor escríbenos por WhatsApp.';
      formSuccess.style.color = '#ef4444';
    }

    formSuccess.style.display = 'block';
    submitBtn.textContent = '✓ Enviado';
    submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

    setTimeout(() => {
      contactForm.reset();
      formSuccess.style.display = 'none';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar solicitud';
      submitBtn.style.background = '';
    }, 5000);
  });
}
/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) a.style.color = '#38bdf8';
  });
});

/* ===== MAPA INTERACTIVO LEAFLET ===== */
document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('realMap');
  if (mapElement) {
    // Inicializar mapa centrado en Tibú
    const map = L.map('realMap').setView([8.638, -72.735], 13);

    // Añadir capa de mapa oscura (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Zona de Fibra Óptica (90% - casco urbano)
    const fibraCircle = L.circle([8.638, -72.735], {
      color: '#38bdf8',
      fillColor: '#38bdf8',
      fillOpacity: 0.15,
      weight: 2,
      radius: 2000 // 2km de radio cubriendo la mayor parte
    }).addTo(map);
    fibraCircle.bindPopup('<b>Fibra Óptica</b><br>Cobertura principal (90%)<br>Casco Urbano de Tibú');

    // Zona de Radioenlace (10% - zona inferior derecha/sureste)
    const radioCircle = L.circle([8.618, -72.710], {
      color: '#f97316', 
      fillColor: '#f97316',
      fillOpacity: 0.2,
      weight: 2,
      radius: 900 // 900m de radio
    }).addTo(map);
    radioCircle.bindPopup('<b>Radioenlace</b><br>Cobertura secundaria (10%)<br>Zona Sureste y rural');
    
    // Marcador Central ETELCOMT
    const marker = L.circleMarker([8.638, -72.735], {
      color: '#fff',
      fillColor: '#38bdf8',
      fillOpacity: 1,
      weight: 2,
      radius: 6
    }).addTo(map);
    marker.bindPopup('<b>ETELCOMT Central</b><br>Sede Principal').openPopup();
  }
});