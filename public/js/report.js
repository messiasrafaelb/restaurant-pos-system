$(document).ready(function () {
    const $reportsContainer = $('#reportsContainer');

    function renderDashboardComponent(totalOrders, totalRevenue, totalItems) {
        return `
      <div class="row g-3">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center p-3 bg-white">
            <h6 class="text-muted fw-bold">Total de Pedidos</h6>
            <p class="fs-2 fw-black text-primary mb-0">${totalOrders}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center p-3 bg-white">
            <h6 class="text-muted fw-bold">Receita Bruta</h6>
            <p class="fs-2 fw-black text-success mb-0">R$ ${totalRevenue.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center p-3 bg-white">
            <h6 class="text-muted fw-bold">Unidades Vendidas</h6>
            <p class="fs-2 fw-black text-warning mb-0">${totalItems}</p>
          </div>
        </div>
      </div>`;
    }

    async function updateReportsView() {
        if (!$reportsContainer.length) return;

        $reportsContainer.html('<div class="text-center text-muted py-5"><div class="spinner-border text-primary"></div></div>');

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

            $reportsContainer.empty().append(renderDashboardComponent(totalOrders, totalRevenue, totalItems));
        } catch (err) {
            $reportsContainer.html('<div class="alert alert-danger">Falha ao computar os relatórios gerenciais.</div>');
        }
    }

    $('[data-tela="tela-relatorios"]').click(function () {
        updateReportsView();
    });
});