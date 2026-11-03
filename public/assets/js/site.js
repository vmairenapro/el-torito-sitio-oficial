(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
      }
    });
  }
  const form = document.querySelector('#contact-form');
  if (form) {
    const config = window.EL_TORITO_CONFIG || {};
    const status = document.querySelector('#form-status');
    if (config.formEndpoint && config.privacyApproved) {
      form.action = config.formEndpoint;
      form.querySelector('fieldset').disabled = false;
      status.textContent = 'Tus datos se enviarán al equipo de contacto mediante FormSubmit.';
    } else {
      status.textContent = 'El formulario se activará cuando esté aprobado el aviso de privacidad. Mientras tanto, escríbenos por WhatsApp o correo.';
    }
  }
})();
