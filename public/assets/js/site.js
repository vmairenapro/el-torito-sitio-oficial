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
  const clientsRibbon = document.querySelector('#clients-ribbon');
  const clientButtons = [...document.querySelectorAll('[data-client-direction]')];
  if (clientsRibbon && clientButtons.length === 2) {
    const logos = [...clientsRibbon.children];
    for (let copy = 0; copy < 2; copy++) {
      logos.forEach((logo) => {
        const duplicate = logo.cloneNode(true);
        duplicate.setAttribute('aria-hidden', 'true');
        duplicate.querySelector('img').alt = '';
        clientsRibbon.append(duplicate);
      });
    }

    let cycleWidth = 0;
    let hovered = false;
    let focused = false;
    let pauseUntil = 0;
    let lastFrame = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const measure = () => {
      cycleWidth = clientsRibbon.children[logos.length].offsetLeft - logos[0].offsetLeft;
      clientsRibbon.scrollLeft = cycleWidth;
    };
    const wrap = () => {
      if (!cycleWidth) return;
      if (clientsRibbon.scrollLeft >= cycleWidth * 2) clientsRibbon.scrollLeft -= cycleWidth;
      if (clientsRibbon.scrollLeft < cycleWidth) clientsRibbon.scrollLeft += cycleWidth;
    };
    const animate = (time) => {
      const elapsed = Math.min(time - (lastFrame || time), 64);
      lastFrame = time;
      if (!reducedMotion.matches && !document.hidden && !hovered && !focused && time >= pauseUntil) {
        clientsRibbon.scrollLeft += elapsed * 0.045;
      }
      wrap();
      requestAnimationFrame(animate);
    };
    clientButtons.forEach((button) => button.addEventListener('click', () => {
      pauseUntil = performance.now() + 4000;
      clientsRibbon.scrollLeft += Number(button.dataset.clientDirection) * Math.max(240, clientsRibbon.clientWidth * 0.55);
      wrap();
    }));
    clientsRibbon.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') hovered = true; });
    clientsRibbon.addEventListener('pointerleave', () => { hovered = false; });
    clientsRibbon.addEventListener('pointerdown', () => { pauseUntil = performance.now() + 4000; });
    const clientsSection = clientsRibbon.closest('.clients-section');
    clientsSection.addEventListener('focusin', () => { focused = true; });
    clientsSection.addEventListener('focusout', (event) => {
      if (!clientsSection.contains(event.relatedTarget)) focused = false;
    });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure, { once: true });
    measure();
    requestAnimationFrame(animate);
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
