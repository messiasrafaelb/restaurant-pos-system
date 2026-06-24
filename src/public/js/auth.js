import { setAuth, showAlert } from './utils.js';

export function initAuth(onLogin) {
  document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginSenha').value;

    try {
      const res = await fetch('/luizao/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        showAlert('authAlertBox', data.message || 'E-mail ou senha inválidos.');
        return;
      }

      setAuth(data.token, data.user);
      onLogin();
    } catch {
      showAlert('authAlertBox', 'Erro de conexão com o servidor.');
    }
  });

  document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('cadNome').value.trim();
    const email = document.getElementById('cadEmail').value.trim();
    const password = document.getElementById('cadSenha').value;

    try {
      const res = await fetch('/luizao/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        showAlert('authAlertBox', data.message || 'Erro ao criar conta.');
        return;
      }

      showAlert('authAlertBox', 'Conta criada! Faça login para continuar.', 'success');
      document.getElementById('formCadastro').reset();
      bootstrap.Tab.getOrCreateInstance(document.getElementById('tab-login')).show();
    } catch {
      showAlert('authAlertBox', 'Erro de conexão com o servidor.');
    }
  });
}
