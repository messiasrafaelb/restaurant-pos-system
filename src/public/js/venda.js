import { apiRequest, formatCurrency, getUser, showAlert } from './utils.js';

let cart = [];
let paymentMethodsLoaded = false;
let vendaInitialized = false;

export async function initVenda() {
  await Promise.all([loadProducts(), loadPaymentMethods()]);
  if (vendaInitialized) return;
  vendaInitialized = true;

  document.getElementById('searchInput').addEventListener('input', filterProducts);
  document.getElementById('limparPedido').addEventListener('click', clearCart);
  document.getElementById('finalizarPedido').addEventListener('click', goToPayment);
  document.getElementById('voltarVenda').addEventListener('click', () => showTela('tela-venda'));
  document.getElementById('cancelarPagamento').addEventListener('click', () => {
    clearCart();
    showTela('tela-venda');
  });
  document.getElementById('btnConfirmarPagamento').addEventListener('click', completeSale);
}

async function loadProducts() {
  const grid = document.getElementById('productsGrid');

  try {
    const res = await apiRequest('/luizao/products');
    const products = await res.json();

    if (!products.length) {
      grid.innerHTML = '<div class="col-12 text-center text-muted py-5">Nenhum produto cadastrado.</div>';
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="col-6 col-md-4 col-lg-3 product-card-wrapper" data-name="${p.name.toLowerCase()}">
        <div class="product-card text-center p-3" style="cursor:pointer"
             data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
          <div class="mb-2"><i class="bi bi-bag fs-2 text-warning"></i></div>
          <h6 class="fw-bold mb-1">${p.name}</h6>
          <span class="badge bg-success">${formatCurrency(p.price)}</span>
          ${p.unitMeasure ? `<div class="text-muted small mt-1">${p.unitMeasure}</div>` : ''}
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => addToCart({
        id: Number(card.dataset.id),
        name: card.dataset.name,
        price: Number(card.dataset.price)
      }));
    });
  } catch (err) {
    if (err.message !== 'Não autenticado') {
      grid.innerHTML = '<div class="col-12 text-center text-danger py-5">Erro ao carregar produtos.</div>';
    }
  }
}

async function loadPaymentMethods() {
  if (paymentMethodsLoaded) return;

  try {
    const res = await apiRequest('/luizao/payment-methods');
    const methods = await res.json();
    const container = document.getElementById('paymentMethodsBtns');

    if (!methods.length) {
      container.innerHTML = '<p class="text-muted">Nenhum método de pagamento cadastrado.</p>';
      return;
    }

    container.innerHTML = methods.map(pm => `
      <button type="button" class="btn btn-outline-success payment-method-btn" data-id="${pm.id}">
        <i class="bi bi-cash me-1"></i>${pm.name}
      </button>
    `).join('');

    container.querySelectorAll('.payment-method-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.payment-method-btn').forEach(b => {
          b.classList.remove('active', 'btn-success');
          b.classList.add('btn-outline-success');
        });
        btn.classList.add('active', 'btn-success');
        btn.classList.remove('btn-outline-success');
        document.getElementById('btnConfirmarPagamento').disabled = false;
      });
    });

    paymentMethodsLoaded = true;
  } catch (err) {
    if (err.message !== 'Não autenticado') {
      document.getElementById('paymentMethodsBtns').innerHTML =
        '<p class="text-danger">Erro ao carregar métodos de pagamento.</p>';
    }
  }
}

function filterProducts() {
  const term = document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('.product-card-wrapper').forEach(w => {
    w.style.display = (w.dataset.name || '').includes(term) ? '' : 'none';
  });
}

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function renderCart() {
  const container = document.getElementById('pedidoAtual');
  const subtotalEl = document.getElementById('subtotal');
  const btnFinalizar = document.getElementById('finalizarPedido');

  if (!cart.length) {
    container.innerHTML = '<p class="text-muted text-center py-4">Nenhum item adicionado.</p>';
    subtotalEl.textContent = formatCurrency(0);
    btnFinalizar.disabled = true;
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  container.innerHTML = cart.map(item => `
    <div class="order-item d-flex justify-content-between align-items-center">
      <div>
        <div class="fw-semibold">${item.name}</div>
        <small class="text-muted">${formatCurrency(item.price)} cada</small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="qty-btn btn btn-sm btn-outline-secondary" data-id="${item.id}" data-delta="-1">−</button>
        <span class="fw-bold">${item.quantity}</span>
        <button class="qty-btn btn btn-sm btn-outline-secondary" data-id="${item.id}" data-delta="1">+</button>
        <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.id}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.qty-btn').forEach(btn =>
    btn.addEventListener('click', () => changeQuantity(Number(btn.dataset.id), Number(btn.dataset.delta)))
  );
  container.querySelectorAll('.remove-btn').forEach(btn =>
    btn.addEventListener('click', () => { cart = cart.filter(i => i.id !== Number(btn.dataset.id)); renderCart(); })
  );

  subtotalEl.textContent = formatCurrency(total);
  btnFinalizar.disabled = false;
}

function goToPayment() {
  if (!cart.length) return;

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  document.getElementById('paymentSummary').innerHTML = `
    <h5 class="fw-bold mb-3">Resumo do Pedido</h5>
    ${cart.map(i => `
      <div class="d-flex justify-content-between text-muted mb-1">
        <span>${i.name} × ${i.quantity}</span>
        <span>${formatCurrency(i.price * i.quantity)}</span>
      </div>
    `).join('')}
    <hr>
    <div class="d-flex justify-content-between fw-bold fs-5">
      <span>Total</span>
      <span class="text-success">${formatCurrency(total)}</span>
    </div>`;

  // Resetar seleção de método
  document.querySelectorAll('.payment-method-btn').forEach(b => {
    b.classList.remove('active', 'btn-success');
    b.classList.add('btn-outline-success');
  });
  document.getElementById('btnConfirmarPagamento').disabled = true;
  document.getElementById('paymentAlertBox').innerHTML = '';

  showTela('tela-pagamento');
}

async function completeSale() {
  const selectedBtn = document.querySelector('.payment-method-btn.active');
  if (!selectedBtn) return;

  const fkPaymentMethod = Number(selectedBtn.dataset.id);
  const user = getUser();
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const btn = document.getElementById('btnConfirmarPagamento');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Processando...';

  try {
    const res = await apiRequest('/luizao/sales', {
      method: 'POST',
      body: JSON.stringify({
        amount: total,
        fkUser: user.id,
        fkPaymentMethod,
        products: cart.map(i => ({ id: i.id, quantity: i.quantity, price: i.price }))
      })
    });

    if (!res.ok) {
      const err = await res.json();
      showAlert('paymentAlertBox', err.message || 'Erro ao registrar venda.');
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Confirmar Pagamento';
      return;
    }

    showAlert('paymentAlertBox', 'Venda registrada com sucesso!', 'success');
    clearCart();
    
    // CORREÇÃO: Reseta o botão de volta para o texto original antes de mudar de tela
    btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Confirmar Pagamento';
    
    setTimeout(() => showTela('tela-venda'), 1500);
  } catch (err) {
    if (err.message !== 'Não autenticado') {
      showAlert('paymentAlertBox', 'Erro de conexão.');
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Confirmar Pagamento';
    }
  }
}

export function showTela(id) {
  document.querySelectorAll('.item-tela').forEach(t => t.classList.add('d-none'));
  document.getElementById(id)?.classList.remove('d-none');
}