// ─── Auth helpers ────────────────────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    return {};
  }
}

export function isAdmin() {
  return getUser().role === 'ADMIN';
}

export function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) }
  });
  return res;
}

// ─── Alert helpers ────────────────────────────────────────────────────────────
export function showAlert(containerId, message, type = 'danger') {
  const box = document.getElementById(containerId);
  if (!box) return;
  box.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show py-2" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  setTimeout(() => {
    const alert = box.querySelector('.alert');
    if (alert) bootstrap.Alert.getOrCreateInstance(alert).close();
  }, 4000);
}

// ─── Relógio ──────────────────────────────────────────────────────────────────
export function iniciarRelogio() {
  const atualizarRelogio = () => {
    const agora = new Date();
    const el1 = document.getElementById('dataAtual');
    const el2 = document.getElementById('horaAtual');
    if (el1) el1.textContent = agora.toLocaleDateString('pt-BR');
    if (el2) el2.textContent = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);
}