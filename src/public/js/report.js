import { apiFetch } from './utils.js';

export const updateOrdersView = async () => {
  const pedidosList = document.getElementById('pedidosList');
  if (!pedidosList) return;
  pedidosList.innerHTML = '<div class="text-center text-muted py-3"><div class="spinner-border spinner-border-sm me-2"></div>Carregando...</div>';
  try {
    const res = await apiFetch('/luizao/orders');
    if (!res.ok) throw new Error();
    const orders = await res.json();

    if (!Array.isArray(orders) || orders.length === 0) {
      pedidosList.innerHTML = '<p class="text-muted m-0">Nenhum pedido registrado.</p>';
      return;
    }

    pedidosList.innerHTML = orders.map(order => `
      <div class="mb-3 p-3 border rounded-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <strong>${order.code || 'Pedido #' + order.id}</strong>
            <div class="text-muted small">${order.createdAt ? new Date(order.createdAt).toLocaleString('pt-BR') : ''}</div>
          </div>
          <span class="badge bg-${order.status === 'OPEN' ? 'warning text-dark' : 'success'}">${order.status}</span>
        </div>
        ${(order.items || []).length > 0
          ? order.items.map(i => `<div class="text-muted small">${i.quantity}x ${i.itemName} — R$ ${Number(i.amount || 0).toFixed(2).replace('.', ',')}</div>`).join('')
          : '<div class="text-muted small">—</div>'
        }
      </div>`).join('');
  } catch {
    pedidosList.innerHTML = '<p class="text-danger m-0">Erro ao carregar pedidos.</p>';
  }
};

export const updateReportsView = async () => {
  const reportsContainer = document.getElementById('reportsContainer');
  if (!reportsContainer) return;
  reportsContainer.innerHTML = '<div class="text-center text-muted py-3"><div class="spinner-border spinner-border-sm me-2"></div>Carregando...</div>';
  try {
    const [resOrders, resSales] = await Promise.all([
      apiFetch('/luizao/orders'),
      apiFetch('/luizao/sales')
    ]);
    const orders = resOrders.ok ? await resOrders.json() : [];
    const sales = resSales.ok ? await resSales.json() : [];

    const totalOrders = Array.isArray(orders) ? orders.length : 0;
    const totalRevenue = Array.isArray(sales) ? sales.reduce((sum, s) => sum + Number(s.amount || 0), 0) : 0;
    const totalItems = Array.isArray(orders) ? orders.reduce((sum, o) => sum + (o.items || []).reduce((c, i) => c + Number(i.quantity || 0), 0), 0) : 0;

    reportsContainer.innerHTML = `
      <div class="row g-3">
        <div class="col-md-4">
          <div class="p-3 border rounded-3 text-center">
            <h5 class="text-muted">Total de Pedidos</h5>
            <p class="fs-2 fw-bold mb-0">${totalOrders}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-3 border rounded-3 text-center">
            <h5 class="text-muted">Receita</h5>
            <p class="fs-2 fw-bold mb-0">R$ ${totalRevenue.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-3 border rounded-3 text-center">
            <h5 class="text-muted">Itens Vendidos</h5>
            <p class="fs-2 fw-bold mb-0">${totalItems}</p>
          </div>
        </div>
      </div>`;
  } catch {
    reportsContainer.innerHTML = '<p class="text-danger m-0">Erro ao carregar relatórios.</p>';
  }
};

export const updateEstoqueView = async () => {
  const estoqueList = document.getElementById('estoqueList');
  if (!estoqueList) return;
  estoqueList.innerHTML = '<div class="text-center text-muted py-3"><div class="spinner-border spinner-border-sm me-2"></div>Carregando...</div>';
  try {
    const res = await apiFetch('/luizao/products');
    if (!res.ok) throw new Error();
    const products = await res.json();

    if (!Array.isArray(products) || products.length === 0) {
      estoqueList.innerHTML = '<p class="text-muted m-0">Nenhum ingrediente cadastrado.</p>';
      return;
    }

    estoqueList.innerHTML = `
      <div class="row row-cols-1 row-cols-md-2 g-3">
        ${products.map(p => {
          const qty = Number(p.quantityStock ?? 0);
          const minQty = Number(p.minimumStock ?? 0);
          const baixo = qty <= minQty;
          return `
            <div class="col">
              <div class="p-3 border rounded-3 ${baixo ? 'border-danger' : ''}">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>${p.name}</strong>
                    <div class="text-muted small">Mínimo: ${minQty}</div>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold fs-5 ${baixo ? 'text-danger' : ''}">${qty}</div>
                    <small class="text-muted">unidades</small>
                  </div>
                </div>
                <div class="mt-2">
                  <span class="badge ${p.status === 'ATIVO' ? 'bg-success' : 'bg-secondary'}">${p.status}</span>
                  ${baixo ? '<span class="badge bg-danger ms-1">Estoque baixo</span>' : ''}
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  } catch {
    estoqueList.innerHTML = '<p class="text-danger m-0">Erro ao carregar estoque.</p>';
  }
};