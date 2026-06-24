export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
}

export function setAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function apiRequest(url, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    clearAuth();
    window.dispatchEvent(new Event('unauthorized'));
    throw new Error('Não autenticado');
  }

  return res;
}

export function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function showAlert(containerId, message, type = 'danger') {
  const box = document.getElementById(containerId);
  if (!box) return;
  box.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mb-0" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  setTimeout(() => {
    const el = box.querySelector('.alert');
    if (el) bootstrap.Alert.getOrCreateInstance(el)?.close();
  }, 4000);
}

export function iniciarRelogio() {
  const tick = () => {
    const now = new Date();
    const d = document.getElementById('dataAtual');
    const h = document.getElementById('horaAtual');
    if (d) d.textContent = now.toLocaleDateString('pt-BR');
    if (h) h.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  tick();
  setInterval(tick, 1000);
}
