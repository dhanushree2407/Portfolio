import './style.css';

const photoInput = document.querySelector('#photo-input');
const photoImg = document.querySelector('[data-photo]');
const photoPlaceholder = document.querySelector('[data-placeholder]');

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  if (photoImg.src.startsWith('blob:')) URL.revokeObjectURL(photoImg.src);
  photoImg.src = URL.createObjectURL(file);
  photoImg.hidden = false;
  photoPlaceholder.hidden = true;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const skill = entry.target;
      skill.querySelector('.bar-fill').style.width = `${skill.dataset.level}%`;
      skillObserver.unobserve(skill);
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
document.querySelectorAll('.skill').forEach((el) => skillObserver.observe(el));

const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  let valid = true;

  form.querySelectorAll('input, textarea').forEach((field) => {
    const filled = field.value.trim() !== '';
    const emailOk = field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    const fieldValid = filled && emailOk;
    field.classList.toggle('invalid', !fieldValid);
    if (!fieldValid) valid = false;
  });

  status.className = 'form-status';
  if (!valid) {
    status.classList.add('error');
    status.textContent = 'Please fill in every field with a valid email address.';
    return;
  }

  status.classList.add('success');
  status.textContent = 'Thanks for your message! I will get back to you soon.';
  form.reset();
});

document.querySelector('#year').textContent = new Date().getFullYear();
