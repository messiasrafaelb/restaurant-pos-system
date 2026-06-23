import { getToken, getUser, isAdmin, iniciarRelogio, apiFetch } from './utils.js';
import { loadProductCards, menuButtons, showScreen, setActiveMenu, applyFilters, clearCart } from './order.js';
import { renderPaymentSummary, completeOrder } from './sales.js';
import { updateOrdersView, updateReportsView, updateEstoqueView } from './report.js';
import { initProdutos, loadItens, loadIngredientes } from './admin-products.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ── Verificação de autenticação de segurança ──────────────────────────
  if (!getToken()) {
    window.location.href = '/cadastro';
    return;
  }

  const user = getUser();
  const topbarNome = document.getElementById('topbarNome');
  const topbarRole = document.getElementById('topbarRole');
  if (topbarNome) topbarNome.textContent = user.name || 'Operador';
  if (topbarRole) topbarRole.textContent = user.role || '';

  // Ocultar menus exclusivos administrativos para operadores padrão
  if (!isAdmin()) {
    document.querySelectorAll('.admin-only').forEach(el => el.classList.add('d-none'));
  }

  // Listener do botão de logout
  document.getElementById('btnLogout')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/cadastro';
  });

  // ── Inicializadores Globais dos Módulos ────────────────────────────────
  iniciarRelogio();
  loadProductCards(); // Inicializa o catálogo do PDV
  initProdutos();     // Configura regras administrativas

  // ── Controle do Fluxo de Caixa / Navegação Lateral ────────────────────
  menuButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const screenId = e.currentTarget.getAttribute('data-tela');
      if (!screenId) return;
      showScreen(screenId);
      setActiveMenu(screenId);
      
      if (screenId === 'tela-pedidos')    updateOrdersView();
      if (screenId === 'tela-relatorios') updateReportsView();
      if (screenId === 'tela-estoque')    updateEstoqueView();
      if (screenId === 'tela-produtos' && isAdmin()) {
        loadItens();
        loadIngredientes();
      }
    });
  });

  // Filtros de Categorias e Inputs
  const categoryBtns = document.querySelectorAll('.category-btn');
  const searchInput = document.getElementById('searchInput');

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (searchInput) searchInput.value = '';
      applyFilters();
    });
  });

  searchInput?.addEventListener('keyup', applyFilters);

  // ── Fluxo Operacional de Fechamento de Venda ─────────────────────────
  const finalizarBtn = document.getElementById('finalizarPedido');
  const paymentMethodBtns = document.querySelectorAll('.payment-method-btn[data-method]');
  const cardTypeBtns = document.querySelectorAll('.card-type-btn[data-card-type]');
  const finalizarCartao = document.getElementById('finalizarCartao');
  
  let pendingPaymentCode = null;
  let selectedCardType = null;

  finalizarBtn?.addEventListener('click', () => {
    // Executa a função e guarda a resposta (true ou false)
    const carrinhoValido = renderPaymentSummary(); 

    // Se o carrinho estiver vazio (retornou false), para a execução AQUI e não muda de tela
    if (!carrinhoValido) {
      // Caso queira dar um feedback visual direto na tela de vendas, você pode adicionar um alert aqui
      return; 
    }

    // Só chega aqui se o carrinho possuir itens!
    showScreen('tela-dinheiro');
    setActiveMenu('');
  });

  paymentMethodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const method = btn.dataset.method;
      if (method === 'Cartão') {
        pendingPaymentCode = method;
        selectedCardType = null;
        if (finalizarCartao) finalizarCartao.disabled = true;
        cardTypeBtns.forEach(b => {
          b.classList.remove('active', 'btn-primary');
          b.classList.add('btn-outline-primary');
        });
        showScreen('tela-cartao');
        setActiveMenu('');
        return;
      }
      completeOrder(method);
    });
  });

  cardTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCardType = btn.dataset.cardType;
      cardTypeBtns.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline-primary');
      });
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-primary');
      if (finalizarCartao) finalizarCartao.disabled = false;
    });
  });

  finalizarCartao?.addEventListener('click', () => {
    if (!selectedCardType) return;
    completeOrder(`Cartão - ${selectedCardType}`);
    pendingPaymentCode = null;
    selectedCardType = null;
  });

  // Voltar / Cancelar ações no Checkout
  document.getElementById('voltarMetodo')?.addEventListener('click', () => { showScreen('tela-dinheiro'); setActiveMenu(''); });
  document.getElementById('voltarVenda')?.addEventListener('click', () => { showScreen('tela-venda'); setActiveMenu('tela-venda'); });
  document.getElementById('limparPedido')?.addEventListener('click', clearCart);

  document.getElementById('cancelarPagamento')?.addEventListener('click', () => {
    clearCart();
    showScreen('tela-venda');
    setActiveMenu('tela-venda');
  });

  document.getElementById('cancelarCartao')?.addEventListener('click', () => {
    clearCart();
    pendingPaymentCode = null;
    selectedCardType = null;
    showScreen('tela-venda');
    setActiveMenu('tela-venda');
  });
});