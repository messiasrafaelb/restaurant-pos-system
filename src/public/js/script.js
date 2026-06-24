import { getToken, getUser, clearAuth, apiRequest, iniciarRelogio } from './utils.js';
import { initAuth } from './auth.js';
import { initVenda, showTela } from './venda.js';
import { initHistorico } from './historico.js';
import { initClientes } from './clientes.js';
import { initProdutos } from './produtos.js';

const authSection = document.getElementById('auth-section');
const appSection  = document.getElementById('app-section');

function showApp() {
  const user = getUser();

  document.body.className = 'app-mode';
  authSection.classList.add('d-none');
  appSection.classList.remove('d-none');

  // Topbar
  const nome = document.getElementById('topbarNome');
  const role = document.getElementById('topbarRole');
  if (nome) nome.textContent = user?.name || '—';
  if (role) role.textContent = user?.role || '';

  // Visibilidade de itens admin
  const isAdmin = user?.role === 'ADMIN';
  console.log(isAdmin);
  document.querySelectorAll('.admin-only').forEach(el => {
    el.classList.toggle('d-none', !isAdmin);
  });

  iniciarRelogio();

  // Inicializa tela de venda (sempre carregada ao entrar)
  initVenda();
  
  // CORREÇÃO DO BUG VISUAL: Reseta o botão de pagamento ao iniciar a tela de venda
  const btnConfirmar = document.getElementById('btnConfirmarPagamento');
  if (btnConfirmar) {
    btnConfirmar.innerHTML = 'Confirmar Pagamento';
    btnConfirmar.disabled = false;
  }

  // Navegação sidebar
  document.querySelectorAll('.menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.menu-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tela = btn.dataset.tela;
      showTela(tela);

      if (tela === 'tela-historico') initHistorico();
      if (tela === 'tela-clientes')  initClientes();
      if (tela === 'tela-produtos')  initProdutos();
    });
  });

  // Logout
  document.getElementById('btnLogout')?.addEventListener('click', async () => {
    try { await apiRequest('/luizao/auth/logout', { method: 'POST' }); } catch { /* token já inválido */ }
    clearAuth();
    showLogin();
  });

  window.addEventListener('unauthorized', showLogin, { once: true });
}

function showLogin() {
  document.body.className = 'auth-mode';
  appSection.classList.add('d-none');
  authSection.classList.remove('d-none');
  // Limpar formulários ao retornar para login
  document.getElementById('formLogin')?.reset();
  document.getElementById('formCadastro')?.reset();
}

// Bootstrap: se já tem token vai direto para o app, senão mostra login
if (getToken()) {
  showApp();
} else {
  initAuth(showApp);
}