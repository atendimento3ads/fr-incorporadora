document.querySelectorAll('form.form-card').forEach((form) => {
  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton.disabled || !form.reportValidity()) return;

    const fields = new FormData(form);
    const payload = new URLSearchParams();
    for (const name of ['nome', 'email', 'telefone', 'empreendimento']) {
      payload.set(name, String(fields.get(name) || '').trim());
    }
    payload.set('interesse', fields.getAll('interesse').join(', '));
    payload.set('lgpd', fields.get('lgpd') === 'sim' ? 'sim' : 'nao');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    submitButton.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = '';
    status.textContent = 'Enviando seus dados…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: payload,
        credentials: 'omit',
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('O webhook não confirmou o recebimento.');

      form.reset();
      status.dataset.state = 'success';
      status.textContent = 'Dados enviados com sucesso. Nossa equipe entrará em contato em breve.';
      window.location.assign(form.dataset.obrigado);
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Não foi possível confirmar o envio. Tente novamente ou use a outra forma de contato abaixo.';
    } finally {
      clearTimeout(timeout);
      submitButton.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
});
