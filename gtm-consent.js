/* Consentimento básico: o contêiner só é baixado depois do aceite explícito. */
(() => {
  const CONTAINER_ID = 'GTM-KP6BMDSS';
  const CLARITY_ID = 'ypvkeny2jq';
  const CONSENT_KEY = 'fr_gtm_consent_v1';
  const LEAD_KEY = 'fr_lead_success_v1';
  const MAX_CONSENT_AGE = 180 * 24 * 60 * 60 * 1000;
  const MAX_LEAD_AGE = 10 * 60 * 1000;
  const allowedSlugs = new Set(['bueno', 'dgn', 'lina']);
  window.dataLayer = window.dataLayer || [];

  function readConsent() {
    try {
      const choice = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      if (choice && ['accepted', 'rejected'].includes(choice.value) &&
          Number.isFinite(choice.at) && Date.now() - choice.at < MAX_CONSENT_AGE) {
        return choice.value;
      }
      localStorage.removeItem(CONSENT_KEY);
    } catch { /* Navegador pode bloquear armazenamento. */ }
    return null;
  }

  function saveConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, at: Date.now() })); }
    catch { /* A escolha continua válida nesta visita. */ }
  }

  function queueConsent(action, granted) {
    const status = granted ? 'granted' : 'denied';
    function gtag() { window.dataLayer.push(arguments); }
    gtag('consent', action, {
      analytics_storage: status,
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
    });
  }

  function readConfirmedLead() {
    try {
      const lead = JSON.parse(sessionStorage.getItem(LEAD_KEY) || 'null');
      if (!lead) return null;
      if (!allowedSlugs.has(lead.slug) || !Number.isFinite(lead.at) ||
          Date.now() - lead.at < 0 || Date.now() - lead.at > MAX_LEAD_AGE) {
        sessionStorage.removeItem(LEAD_KEY);
        return null;
      }
      if (lead.path !== location.pathname) return null;
      sessionStorage.removeItem(LEAD_KEY);
      return { event: 'formSubmit', empreendimento: lead.slug, origem: 'lp_fr' };
    } catch { return null; }
  }

  const pendingLead = readConfirmedLead();
  let containerLoaded = false;
  let choice = readConsent();

  function loadContainer() {
    if (containerLoaded) return;
    containerLoaded = true;
    // Antes do gtm.js: estado concedido e evento de inicialização.
    queueConsent('default', true);
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    if (pendingLead) window.dataLayer.push(pendingLead);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${CONTAINER_ID}`;
    document.head.appendChild(script);
    loadClarity();
  }

  // Clarity só nas três LPs; carregado como arquivo externo para respeitar a CSP.
  function loadClarity() {
    if (!allowedSlugs.has(location.pathname.split('/')[1])) return;
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    document.head.appendChild(script);
  }

  if (choice === 'accepted') loadContainer();

  function renderBanner() {
    const panel = document.createElement('section');
    panel.className = 'fr-consent';
    panel.setAttribute('aria-label', 'Preferências de cookies');
    panel.innerHTML = `
      <div class="fr-consent__copy">
        <strong>Medição e publicidade</strong>
        <p>Com sua autorização, carregamos o Google Tag Manager e o Microsoft Clarity para medir visitas, navegação e resultados das campanhas. O contêiner inclui serviços de análise e publicidade. Você pode mudar sua escolha a qualquer momento. <a href="../politica-de-cookies/">Veja a política de cookies</a>.</p>
      </div>
      <div class="fr-consent__actions">
        <button type="button" data-consent="rejected">Rejeitar opcionais</button>
        <button type="button" data-consent="accepted">Aceitar medição e publicidade</button>
      </div>`;
    document.body.appendChild(panel);
    panel.querySelectorAll('[data-consent]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = button.dataset.consent;
        saveConsent(next);
        choice = next;
        panel.hidden = true;
        if (containerLoaded) {
          // Revogar consentimento exige descarregar as tags já executadas.
          queueConsent('update', next === 'accepted');
          if (next === 'rejected') location.reload();
        } else if (next === 'accepted') {
          loadContainer();
        }
      });
    });
    document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
      button.addEventListener('click', () => {
        panel.hidden = false;
        panel.querySelector('button').focus();
      });
    });
    panel.hidden = choice !== null;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBanner, { once: true });
  } else {
    renderBanner();
  }
})();
