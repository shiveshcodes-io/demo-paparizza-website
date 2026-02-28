// NAV SCROLL
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

// HAMBURGER
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});
// close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});

// MENU FILTER
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    menuItems.forEach(item => {
      item.classList.toggle('hidden', item.dataset.cat !== cat);
    });
  });
});

// INTERSECTION OBSERVER
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// STAGGERED CARD ANIMATIONS
const staggerGroups = document.querySelectorAll('.reviews-grid, .menu-grid, .gallery-grid');
staggerGroups.forEach(group => {
  const kids = Array.from(group.children);
  kids.forEach(child => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(20px)';
    child.style.transition = 'opacity 0.5s, transform 0.5s';
  });
  const groupObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        kids.forEach((child, i) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * 80);
        });
        groupObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  groupObs.observe(group);
});

// WHATSAPP RESERVATION
// Change this number to the restaurant's WhatsApp number (country code + number, no spaces or +)
const WHATSAPP_NUMBER = '+911234567890';

function resetBtn(btn) {
  btn.style.background = '';
  btn.disabled = false;
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.535 5.862L.057 23.43a.75.75 0 00.921.921l5.568-1.478A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.892 0-3.663-.525-5.176-1.436l-.371-.22-3.305.877.877-3.305-.22-.371A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg> Send via WhatsApp';
}

function handleReservation(btn) {
  const name = document.getElementById('res-name').value.trim();
  const email = document.getElementById('res-email').value.trim();
  const phone = document.getElementById('res-phone').value.trim();
  const guests = document.getElementById('res-guests').value;
  const date = document.getElementById('res-date').value;
  const time = document.getElementById('res-time').value;
  const special = document.getElementById('res-special').value.trim();

  if (!name || !email || !phone || !date || !time) {
    btn.style.background = '#c0392b';
    btn.textContent = 'Please fill all required fields';
    setTimeout(() => resetBtn(btn), 2500);
    return;
  }

  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const msg = [
    'New Table Reservation - Paparizza',
    '',
    'Name: ' + name,
    'Email: ' + email,
    'Phone: ' + phone,
    'Guests: ' + guests,
    'Date: ' + formattedDate,
    'Time: ' + time,
    special ? 'Special Requests: ' + special : '',
    '',
    'Sent via Paparizza website'
  ].filter(l => l !== undefined).join('\n');

  const waURL = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);

  btn.style.background = '#25D366';
  btn.textContent = 'Opening WhatsApp...';
  btn.disabled = true;

  setTimeout(() => {
    window.open(waURL, '_blank');
    setTimeout(() => resetBtn(btn), 1500);
  }, 700);
}

// ACTIVE NAV LINK ON SCROLL
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? 'var(--crimson)' : '';
  });
});