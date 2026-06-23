import { apiFetch } from './utils.js';

export let carrinho = [];

export const screens = document.querySelectorAll('.item-tela');
export const menuButtons = document.querySelectorAll('.menu-item[data-tela]');
const searchInput = document.getElementById('searchInput');
const pedidoAtual = document.getElementById('pedidoAtual');
const subtotalEl = document.getElementById('subtotal');

export const showScreen = (screenId) => {
  screens.forEach(s => s.classList.add('d-none'));
  document.getElementById(screenId)?.classList.remove('d-none');
};

export const setActiveMenu = (screenId) => {
  menuButtons.forEach(btn =>
    btn.classList.toggle('active', btn.getAttribute('data-tela') === screenId)
  );
};

export function clearCart() {
  carrinho = [];
  renderCarrinho();
}

export function renderCarrinho() {
  if (!pedidoAtual) return 0;
  pedidoAtual.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco * item.quantidade;
    pedidoAtual.innerHTML += `
      <div class="order-item">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img src="${item.img}" style="width:50px;height:50px;object-fit:contain;" alt="${item.nome}">
            <div class="ms-3">
              <div class="fw-bold">${item.nome}</div>
              <small class="text-muted">R$ ${item.preco.toFixed(2).replace('.', ',')}</small>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button class="qty-btn" onclick="window.app.diminuir(${index})">-</button>
            <strong>${item.quantidade}</strong>
            <button class="qty-btn" onclick="window.app.aumentar(${index})">+</button>
          </div>
        </div>
      </div>`;
  });

  if (subtotalEl) subtotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  return total;
}

export const applyFilters = () => {
  const searchText = searchInput?.value.trim().toLowerCase() || '';
  document.querySelectorAll('#productsGrid .product-card').forEach(card => {
    const name = (card.dataset.nome || '').toLowerCase();
    const visible = !searchText || name.includes(searchText);
    card.closest('[class*="col"]').classList.toggle('d-none', !visible);
  });
};

const attachCardListeners = () => {
  document.querySelectorAll('#productsGrid .add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const itemId = Number(card.dataset.itemId);
      const nome = card.dataset.nome;
      const preco = Number(card.dataset.preco);
      const img = card.dataset.img || '/img/logo.png';

      const existing = carrinho.find(i => i.itemId === itemId);
      if (existing) {
        existing.quantidade += 1;
      } else {
        carrinho.push({ itemId, nome, preco, img, quantidade: 1 });
      }
      renderCarrinho();
    });
  });
};

export async function loadProductCards() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  try {
    const res = await apiFetch('/luizao/items?status=ATIVO');
    if (!res.ok) throw new Error('Falha ao carregar itens');
    const items = await res.json();

    if (!Array.isArray(items) || items.length === 0) {
      grid.innerHTML = '<div class="col-12 text-center text-muted py-5">Nenhum produto disponível. Cadastre itens no painel de Produtos.</div>';
      return;
    }

    grid.innerHTML = items.map(item => `
      <div class="col-lg-4 col-md-6">
        <div class="product-card"
          data-item-id="${item.id}"
          data-nome="${(item.name || '').replace(/"/g, '&quot;')}"
          data-preco="${item.price}"
          data-img="/img/logo.png">
          <div class="imagem">
            <img src="/img/logo.png" alt="${item.name}">
          </div>
          <div class="product-title">${item.name}</div>
          <div class="product-description">${item.description || ''}</div>
          <div class="d-flex justify-content-between align-items-center mt-4">
            <div class="price">R$ ${Number(item.price).toFixed(2).replace('.', ',')}</div>
            <button class="add-btn">+</button>
          </div>
        </div>
      </div>`).join('');

    attachCardListeners();
    applyFilters();
  } catch {
    grid.innerHTML = '<div class="col-12 text-center text-danger py-5">Erro ao carregar produtos. Verifique a conexão.</div>';
  }
}

// Expõe controles globais de quantidade requeridos pelo HTML inline
window.app = {
  aumentar: (index) => {
    if (!carrinho[index]) return;
    carrinho[index].quantidade += 1;
    renderCarrinho();
  },
  diminuir: (index) => {
    if (!carrinho[index]) return;
    carrinho[index].quantidade -= 1;
    if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
    renderCarrinho();
  }
};