/**
 * DEMO inquiry form — validates in the browser and shows an honest
 * "not sent" confirmation. Makes no network request of any kind.
 */
type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PH_MOBILE = /^(?:\+?63|0)9\d{9}$/;

export function initForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-demo-form]');
  if (!form) return;

  const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const summaryList = summary.querySelector('ul')!;
  const success = document.querySelector<HTMLElement>('[data-form-success]')!;
  const planRow = form.querySelector<HTMLElement>('[data-plan-row]')!;
  const planSelect = form.querySelector<HTMLSelectElement>('#f-plan')!;
  const message = form.querySelector<HTMLTextAreaElement>('#f-message')!;
  const counter = form.querySelector<HTMLElement>('[data-counter]')!;
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  submit.disabled = false;

  const typeRadios = [...form.querySelectorAll<HTMLInputElement>('input[name="type"]')];
  const syncType = () => {
    const isMember = typeRadios.find((r) => r.checked)?.value === 'membership';
    planRow.hidden = !isMember;
    planSelect.disabled = !isMember;
  };
  typeRadios.forEach((r) => r.addEventListener('change', syncType));
  syncType();

  const max = Number(message.maxLength) || 500;
  const updateCounter = () => (counter.textContent = `${message.value.length} / ${max}`);
  message.addEventListener('input', updateCounter);
  updateCounter();

  const rules: Record<string, (v: string) => string> = {
    name: (v) => (v.trim().length < 2 ? 'Enter your full name.' : ''),
    email: (v) => (!v.trim() ? 'Enter your email address.' : !EMAIL.test(v.trim()) ? 'Enter a valid email address, like name@example.com.' : ''),
    phone: (v) => (v.trim() && !PH_MOBILE.test(v.replace(/[\s-]/g, '')) ? 'Enter a PH mobile number like 0917 123 4567, or leave it blank.' : ''),
    message: (v) => (v.trim().length < 10 ? 'Write a message of at least 10 characters.' : ''),
  };

  const setError = (field: Field, msg: string) => {
    const err = form.querySelector<HTMLElement>(`#${field.id}-error`);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    field.closest('.field')?.classList.toggle('has-error', !!msg);
    if (err) err.textContent = msg;
  };

  const validate = (field: Field) => {
    const rule = rules[field.name];
    if (!rule) return '';
    const msg = rule(field.value);
    setError(field, msg);
    return msg;
  };

  Object.keys(rules).forEach((name) => {
    const field = form.elements.namedItem(name) as Field | null;
    if (!field) return;
    field.addEventListener('blur', () => { if (field.value || field.getAttribute('aria-invalid')) validate(field); });
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors: { id: string; label: string; msg: string }[] = [];
    Object.keys(rules).forEach((name) => {
      const field = form.elements.namedItem(name) as Field | null;
      if (!field) return;
      const msg = validate(field);
      if (msg) errors.push({ id: field.id, label: form.querySelector(`label[for="${field.id}"]`)?.textContent?.replace('*', '').trim() ?? name, msg });
    });

    summaryList.innerHTML = '';
    if (errors.length) {
      errors.forEach((er) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${er.id}`;
        a.textContent = er.msg;
        a.addEventListener('click', (ev) => { ev.preventDefault(); form.querySelector<HTMLElement>(`#${er.id}`)?.focus(); });
        li.append(a);
        summaryList.append(li);
      });
      summary.hidden = false;
      summary.focus();
      return;
    }

    summary.hidden = true;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim().split(/\s+/)[0];
    const email = String(data.get('email') ?? '').trim();
    success.querySelector('[data-success-name]')!.textContent = name;
    success.querySelector('[data-success-email]')!.textContent = email;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  success.querySelector('[data-form-reset]')?.addEventListener('click', () => {
    form.reset();
    form.querySelectorAll<Field>('[aria-invalid]').forEach((f) => setError(f, ''));
    syncType();
    updateCounter();
    success.hidden = true;
    form.hidden = false;
    form.querySelector<HTMLInputElement>('#f-name')?.focus();
  });

  /* "Inquire about this plan" buttons pre-fill the form */
  document.querySelectorAll<HTMLAnchorElement>('a[data-plan]').forEach((a) => {
    a.addEventListener('click', () => {
      const member = typeRadios.find((r) => r.value === 'membership');
      if (member) member.checked = true;
      syncType();
      planSelect.value = a.dataset.plan!;
      if (!form.hidden) window.setTimeout(() => form.querySelector<HTMLInputElement>('#f-name')?.focus({ preventScroll: true }), 450);
    });
  });
}

/** Click-to-copy HEX swatches */
export function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy!;
      const live = document.querySelector<HTMLElement>('[data-copy-status]');
      try {
        await navigator.clipboard.writeText(value);
        btn.dataset.copied = 'true';
        if (live) live.textContent = `${value} copied to clipboard`;
        window.setTimeout(() => delete btn.dataset.copied, 1600);
      } catch {
        if (live) live.textContent = `Copy not available. The value is ${value}.`;
      }
    });
  });
}
