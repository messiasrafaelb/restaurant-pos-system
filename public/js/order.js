$(document).ready(function () {
    const $pedidosList = $('#pedidosList');

    function renderPedidoComponent(order) {
        const dataFormatada = order.createdAt ? new Date(order.createdAt).toLocaleString('pt-BR') : '';
        const badgeClass = order.status === 'OPEN' ? 'bg-warning text-dark' : 'bg-success';

        const itensHtml = (order.items || []).length > 0
            ? order.items.map(i => `
          <div class="text-muted small">
            <i class="bi bi-arrow-right-short"></i> ${i.quantity}x ${i.itemName} — R$ ${Number(i.amount || 0).toFixed(2).replace('.', ',')}
          </div>
        `).join('')
            : '<div class="text-muted small">— Nenhum item —</div>';

        return `
      <div class="card mb-3 shadow-sm border-0">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h6 class="fw-bold mb-0 text-dark">${order.code || 'Pedido #' + order.id}</h6>
              <small class="text-muted">${dataFormatada}</small>
            </div>
            <span class="badge ${badgeClass}">${order.status}</span>
          </div>
          <div class="bg-light p-2 rounded">
            ${itensHtml}
          </div>
        </div>
      </div>`;
    }

    async function updateOrdersView() {
        if (!$pedidosList.length) return;

        $pedidosList.html(`
      <div class="text-center text-muted py-3">
        <div class="spinner-border spinner-border-sm text-primary me-2"></div>Carregando histórico...
      </div>`
        );

        try {
            const res = await apiFetch('/luizao/orders');
            if (!res.ok) throw new Error();
            const orders = await res.json();

            if (!Array.isArray(orders) || orders.length === 0) {
                $pedidosList.html('<p class="text-muted m-0 text-center py-4">Nenhum pedido registrado no sistema.</p>');
                return;
            }

            $pedidosList.empty().append(orders.map(renderPedidoComponent).join(''));
        } catch (err) {
            $pedidosList.html('<p class="text-danger m-0 text-center py-4">⚠️ Erro ao carregar o histórico de pedidos.</p>');
        }
    }

    $('[data-tela="tela-pedidos"]').click(function () {
        updateOrdersView();
    });
});