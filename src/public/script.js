// ─── Auth helpers ────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    return {};
  }
}

function isAdmin() {
  return getUser().role === 'ADMIN';
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) }
  });
  return res;
}

// ─── Alert helpers ────────────────────────────────────────────────────────────

function showAlert(containerId, message, type = 'danger') {
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

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) {
    window.location.href = '/cadastro';
    return;
  }

  const user = getUser();
  const topbarNome = document.getElementById('topbarNome');
  const topbarRole = document.getElementById('topbarRole');
  if (topbarNome) topbarNome.textContent = user.name || 'Operador';
  if (topbarRole) topbarRole.textContent = user.role || '';

  // Hide admin-only menu items for non-admins
  if (!isAdmin()) {
    document.querySelectorAll('.admin-only').forEach(el => el.classList.add('d-none'));
  }

  document.getElementById('btnLogout')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/cadastro';
  });

  initPOS();
  initProdutos();
});

// ─── POS (Venda) ──────────────────────────────────────────────────────────────

function initPOS() {
  const screens = document.querySelectorAll('.item-tela');
  const menuButtons = document.querySelectorAll('.menu-item[data-tela]');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const productCards = Array.from(document.querySelectorAll('.product-card'));
  const searchInput = document.getElementById('searchInput');
  const addButtons = document.querySelectorAll('.add-btn');
  const finalizarButton = document.getElementById('finalizarPedido');
  const paymentSummary = document.getElementById('paymentSummary');
  const paymentMessage = document.getElementById('paymentMessage');
  const paymentMethodButtons = document.querySelectorAll('.payment-method-btn[data-method]');
  const cardTypeButtons = document.querySelectorAll('.card-type-btn[data-card-type]');
  const voltarVenda = document.getElementById('voltarVenda');
  const voltarMetodo = document.getElementById('voltarMetodo');
  const cancelarPagamento = document.getElementById('cancelarPagamento');
  const cancelarCartao = document.getElementById('cancelarCartao');
  const finalizarCartao = document.getElementById('finalizarCartao');
  const pedidosList = document.getElementById('pedidosList');
  const reportsContainer = document.getElementById('reportsContainer');
  const estoqueList = document.getElementById('estoqueList');
  const pedidoAtual = document.getElementById('pedidoAtual');
  const subtotal = document.getElementById('subtotal');
  const limparPedido = document.getElementById('limparPedido');

  let carrinho = [];
  let currentCategory = 'lanche';
  let orders = [];
  let pendingPaymentMethod = null;
  let selectedCardType = null;

  const showScreen = (screenId) => {
    screens.forEach(s => s.classList.add('d-none'));
    const target = document.getElementById(screenId);
    if (target) target.classList.remove('d-none');
  };

  const setActiveMenu = (screenId) => {
    menuButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tela') === screenId);
    });
  };

  const renderCarrinho = () => {
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

    subtotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    return total;
  };

  const applyFilters = () => {
    const searchText = searchInput.value.trim().toLowerCase();
    productCards.forEach(card => {
      const category = card.dataset.category || '';
      const name = card.dataset.nome.toLowerCase();
      const matchesCategory = currentCategory ? category === currentCategory : true;
      const matchesSearch = searchText ? name.includes(searchText) : true;
      card.closest('[class*="col"]').classList.toggle('d-none', !(matchesCategory && matchesSearch));
    });
  };

  const updateOrdersView = () => {
    if (!pedidosList) return;
    if (orders.length === 0) {
      pedidosList.innerHTML = '<p class="text-muted m-0">Nenhum pedido concluído ainda.</p>';
      return;
    }
    pedidosList.innerHTML = orders.map(order => `
      <div class="mb-3 p-3 border rounded-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <strong>Pedido #${order.id}</strong>
            <div class="text-muted">${order.date}</div>
          </div>
          <span class="badge bg-success">${order.method}</span>
        </div>
        <div class="mb-2">Total: <strong>R$ ${order.total.toFixed(2).replace('.', ',')}</strong></div>
        <div>${order.items.map(i => `<div>${i.quantidade}x ${i.nome}</div>`).join('')}</div>
      </div>`).join('');
  };

  const updateReportsView = () => {
    if (!reportsContainer) return;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const itemsSold = orders.reduce((sum, o) => sum + o.items.reduce((c, i) => c + i.quantidade, 0), 0);
    reportsContainer.innerHTML = `
      <div class="row g-3">
        <div class="col-md-4">
          <div class="p-3 border rounded-3">
            <h5>Total de Pedidos</h5>
            <p class="fs-3 mb-0">${totalOrders}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-3 border rounded-3">
            <h5>Receita</h5>
            <p class="fs-3 mb-0">R$ ${totalRevenue.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-3 border rounded-3">
            <h5>Itens Vendidos</h5>
            <p class="fs-3 mb-0">${itemsSold}</p>
          </div>
        </div>
      </div>`;
  };

  const updateEstoqueView = () => {
    if (!estoqueList) return;
    estoqueList.innerHTML = `
      <div class="row row-cols-1 row-cols-md-2 g-3">
        ${productCards.map(card => {
          const imgUrl = card.getAttribute('data-img') || '/img/logo.png';
          return `
          <div class="col">
            <div class="p-3 border rounded-3">
              <div class="d-flex align-items-center gap-3">
                <img src="${imgUrl}" alt="${card.dataset.nome}" width="70" style="object-fit:contain;">
                <div>
                  <strong>${card.dataset.nome}</strong>
                  <div class="text-muted">Categoria: ${card.dataset.category}</div>
                </div>
              </div>
              <div class="mt-3">Estoque: <strong>${card.dataset.stock || '0'}</strong></div>
            </div>
          </div>`;
        }).join('')}
      </div>`;
  };

  const clearCart = () => {
    carrinho = [];
    pendingPaymentMethod = null;
    selectedCardType = null;
    renderCarrinho();
  };

  const completeOrder = (method) => {
    const total = renderCarrinho();
    if (carrinho.length === 0) return;

    const order = {
      id: orders.length + 1,
      method,
      total,
      items: carrinho.map(i => ({ nome: i.nome, quantidade: i.quantidade })),
      date: new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
    };
    orders.unshift(order);
    clearCart();
    updateOrdersView();
    updateReportsView();
    if (paymentMessage) paymentMessage.textContent = `Pagamento com ${method} confirmado! Pedido #${order.id} registrado.`;
    showScreen('tela-pedidos');
    setActiveMenu('tela-pedidos');
  };

  const renderPaymentSummary = () => {
    const total = renderCarrinho();
    if (!paymentSummary) return;
    if (carrinho.length === 0) {
      paymentSummary.innerHTML = '<p class="text-muted m-0">Adicione itens ao pedido antes de finalizar.</p>';
      return;
    }
    paymentSummary.innerHTML = `
      <div class="mb-3">
        <h5>Subtotal</h5>
        <p class="fs-4">R$ ${total.toFixed(2).replace('.', ',')}</p>
      </div>
      <p class="text-muted mb-0">Escolha um método de pagamento abaixo.</p>`;
    if (paymentMessage) paymentMessage.textContent = '';
  };

  // Menu navigation
  menuButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const screenId = e.currentTarget.getAttribute('data-tela');
      if (!screenId) return;
      showScreen(screenId);
      setActiveMenu(screenId);
      if (screenId === 'tela-pedidos') updateOrdersView();
      if (screenId === 'tela-relatorios') updateReportsView();
      if (screenId === 'tela-estoque') updateEstoqueView();
      if (screenId === 'tela-produtos' && isAdmin()) {
        window.loadItens?.();
        window.loadIngredientes?.();
      }
    });
  });

  // Category filter
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category || '';
      applyFilters();
    });
  });

  searchInput?.addEventListener('keyup', applyFilters);

  // Add to cart
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const nome = card.dataset.nome;
      const preco = Number(card.dataset.preco);
      const img = card.getAttribute('data-img') || '/img/logo.png';
      const existing = carrinho.find(i => i.nome === nome);
      if (existing) {
        existing.quantidade += 1;
      } else {
        carrinho.push({ nome, preco, img, quantidade: 1 });
      }
      renderCarrinho();
    });
  });

  // Finalizar
  finalizarButton?.addEventListener('click', () => {
    renderPaymentSummary();
    showScreen('tela-dinheiro');
    setActiveMenu('');
  });

  // Métodos de pagamento
  paymentMethodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const method = btn.dataset.method;
      if (method === 'Cartão') {
        pendingPaymentMethod = method;
        selectedCardType = null;
        if (finalizarCartao) finalizarCartao.disabled = true;
        cardTypeButtons.forEach(b => b.classList.remove('active', 'btn-primary'));
        cardTypeButtons.forEach(b => b.classList.add('btn-outline-primary'));
        showScreen('tela-cartao');
        setActiveMenu('');
        return;
      }
      completeOrder(method);
    });
  });

  // Seleção de tipo de cartão (não finaliza de imediato)
  cardTypeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCardType = btn.dataset.cardType;
      cardTypeButtons.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline-primary');
      });
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-primary');
      if (finalizarCartao) finalizarCartao.disabled = false;
    });
  });

  // Finalizar pagamento com cartão
  finalizarCartao?.addEventListener('click', () => {
    if (!selectedCardType || !pendingPaymentMethod) return;
    completeOrder(`${pendingPaymentMethod} - ${selectedCardType}`);
    pendingPaymentMethod = null;
    selectedCardType = null;
  });

  // Voltar / Cancelar
  voltarMetodo?.addEventListener('click', () => {
    showScreen('tela-dinheiro');
    setActiveMenu('');
  });

  voltarVenda?.addEventListener('click', () => {
    showScreen('tela-venda');
    setActiveMenu('tela-venda');
  });

  cancelarPagamento?.addEventListener('click', () => {
    clearCart();
    if (paymentMessage) paymentMessage.textContent = '';
    showScreen('tela-venda');
    setActiveMenu('tela-venda');
  });

  cancelarCartao?.addEventListener('click', () => {
    clearCart();
    pendingPaymentMethod = null;
    selectedCardType = null;
    showScreen('tela-venda');
    setActiveMenu('tela-venda');
  });

  limparPedido?.addEventListener('click', () => {
    clearCart();
  });

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

  applyFilters();
}

// ─── Gestão de Produtos (Admin) ───────────────────────────────────────────────

function initProdutos() {
  if (!isAdmin()) return;

  let currentItemId = null;
  let allIngredientes = [];

  // ── Itens do Menu ─────────────────────────────────────────────────────────

  async function loadItens() {
    const tbody = document.getElementById('itensTableBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Carregando...</td></tr>';
    try {
      const res = await apiFetch('/luizao/items');
      const itens = await res.json();
      if (!Array.isArray(itens) || itens.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum item cadastrado.</td></tr>';
        return;
      }
      tbody.innerHTML = itens.map(item => `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.description || '—'}</td>
          <td>R$ ${Number(item.price).toFixed(2).replace('.', ',')}</td>
          <td>
            <span class="badge ${item.status === 'ATIVO' ? 'bg-success' : 'bg-secondary'}">
              ${item.status}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-outline-info me-1" onclick="window.produtosAdmin.abrirIngredientes(${item.id}, '${item.name.replace(/'/g, "\\'")}')">
              <i class="bi bi-list-ul"></i> Ingredientes
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="window.produtosAdmin.deletarItem(${item.id})">
              <i class="bi bi-trash"></i> Inativar
            </button>
          </td>
        </tr>`).join('');
    } catch {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Erro ao carregar itens.</td></tr>';
    }
  }

  document.getElementById('formNovoItem')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      name: document.getElementById('itemNome').value.trim(),
      description: document.getElementById('itemDescricao').value.trim(),
      price: Number(document.getElementById('itemPreco').value)
    };
    try {
      const res = await apiFetch('/luizao/items', { method: 'POST', body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { showAlert('itemAlertBox', data.message || 'Erro ao salvar item'); return; }
      showAlert('itemAlertBox', 'Item salvo com sucesso!', 'success');
      e.target.reset();
      loadItens();
    } catch {
      showAlert('itemAlertBox', 'Erro de conexão');
    }
  });

  async function deletarItem(id) {
    if (!confirm('Inativar este item do menu?')) return;
    try {
      const res = await apiFetch(`/luizao/items/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { showAlert('itemAlertBox', data.message || 'Erro ao inativar'); return; }
      showAlert('itemAlertBox', 'Item inativado.', 'warning');
      loadItens();
    } catch {
      showAlert('itemAlertBox', 'Erro de conexão');
    }
  }

  // ── Ingredientes ──────────────────────────────────────────────────────────

  async function loadIngredientes() {
    const tbody = document.getElementById('ingredientesTableBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Carregando...</td></tr>';
    try {
      const res = await apiFetch('/luizao/products');
      const ings = await res.json();
      allIngredientes = Array.isArray(ings) ? ings : [];
      if (allIngredientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum ingrediente cadastrado.</td></tr>';
        return;
      }
      tbody.innerHTML = allIngredientes.map(ing => `
        <tr>
          <td>${ing.id}</td>
          <td>${ing.name}</td>
          <td>${ing.minimumStock ?? 0}</td>
          <td>${ing.quantityStock ?? 0}</td>
          <td>
            <span class="badge ${ing.status === 'ATIVO' ? 'bg-success' : 'bg-secondary'}">
              ${ing.status}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-outline-danger" onclick="window.produtosAdmin.deletarIngrediente(${ing.id})">
              <i class="bi bi-trash"></i> Inativar
            </button>
          </td>
        </tr>`).join('');
    } catch {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Erro ao carregar ingredientes.</td></tr>';
    }
  }

  document.getElementById('formNovoIngrediente')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      name: document.getElementById('ingNome').value.trim(),
      minimum_stock: Number(document.getElementById('ingEstoqueMin').value),
      quantity_stock: Number(document.getElementById('ingEstoqueAtual').value)
    };
    try {
      const res = await apiFetch('/luizao/products', { method: 'POST', body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { showAlert('ingAlertBox', data.message || 'Erro ao salvar ingrediente'); return; }
      showAlert('ingAlertBox', 'Ingrediente salvo com sucesso!', 'success');
      e.target.reset();
      loadIngredientes();
    } catch {
      showAlert('ingAlertBox', 'Erro de conexão');
    }
  });

  async function deletarIngrediente(id) {
    if (!confirm('Inativar este ingrediente?')) return;
    try {
      const res = await apiFetch(`/luizao/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { showAlert('ingAlertBox', data.message || 'Erro ao inativar'); return; }
      showAlert('ingAlertBox', 'Ingrediente inativado.', 'warning');
      loadIngredientes();
    } catch {
      showAlert('ingAlertBox', 'Erro de conexão');
    }
  }

  // ── Modal de Ingredientes por Item ────────────────────────────────────────

  async function abrirIngredientes(itemId, itemName) {
    currentItemId = itemId;
    document.getElementById('modalItemNome').textContent = `Item: ${itemName}`;
    const container = document.getElementById('ingredientesCheckboxes');
    container.innerHTML = '<div class="text-center text-muted">Carregando...</div>';

    const modal = new bootstrap.Modal(document.getElementById('modalIngredientes'));
    modal.show();

    try {
      const [resItem, resIng] = await Promise.all([
        apiFetch(`/luizao/items/${itemId}`),
        apiFetch('/luizao/products')
      ]);
      const itemData = await resItem.json();
      const ingredientes = await resIng.json();

      const associados = Array.isArray(itemData.products)
        ? itemData.products.map(p => ({ id: p.id, quantity: p.usedQuantity || 1 }))
        : [];

      if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhum ingrediente disponível. Cadastre primeiro.</p>';
        return;
      }

      container.innerHTML = ingredientes
        .filter(i => i.status === 'ATIVO')
        .map(ing => {
          const assoc = associados.find(a => a.id === ing.id);
          const checked = assoc ? 'checked' : '';
          const qty = assoc ? assoc.quantity : 1;
          return `
            <div class="d-flex align-items-center gap-3 mb-2 p-2 border rounded">
              <input type="checkbox" class="form-check-input ing-check" id="ing-${ing.id}"
                data-id="${ing.id}" ${checked}>
              <label class="form-check-label flex-grow-1" for="ing-${ing.id}">${ing.name}</label>
              <div class="d-flex align-items-center gap-1">
                <label class="text-muted small">Qtd:</label>
                <input type="number" class="form-control form-control-sm ing-qty" style="width:70px"
                  data-id="${ing.id}" value="${qty}" min="1">
              </div>
            </div>`;
        }).join('');
    } catch {
      container.innerHTML = '<p class="text-danger">Erro ao carregar ingredientes.</p>';
    }
  }

  document.getElementById('btnSalvarIngredientes')?.addEventListener('click', async () => {
    if (!currentItemId) return;
    const checks = document.querySelectorAll('.ing-check:checked');
    const products = Array.from(checks).map(cb => ({
      productId: Number(cb.dataset.id),
      quantity: Number(document.querySelector(`.ing-qty[data-id="${cb.dataset.id}"]`)?.value || 1)
    }));

    try {
      const res = await apiFetch(`/luizao/items/${currentItemId}/products`, {
        method: 'PUT',
        body: JSON.stringify({ products })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Erro ao salvar'); return; }
      bootstrap.Modal.getInstance(document.getElementById('modalIngredientes'))?.hide();
      showAlert('itemAlertBox', 'Ingredientes associados com sucesso!', 'success');
      loadItens();
    } catch {
      alert('Erro de conexão');
    }
  });

  // Expose para onclick inline e para menu navigation
  window.produtosAdmin = { deletarItem, deletarIngrediente, abrirIngredientes };
  window.loadItens = loadItens;
  window.loadIngredientes = loadIngredientes;
}

// ─── Relógio ──────────────────────────────────────────────────────────────────

function atualizarRelogio() {
  const agora = new Date();
  const el1 = document.getElementById('dataAtual');
  const el2 = document.getElementById('horaAtual');
  if (el1) el1.textContent = agora.toLocaleDateString('pt-BR');
  if (el2) el2.textContent = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);
