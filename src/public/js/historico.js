import { apiRequest, formatCurrency, getUser } from './utils.js';

export async function initHistorico() {
  const container = document.getElementById('historicoList');
  container.innerHTML = '<div class="text-center text-muted py-4"><div class="spinner-border spinner-border-sm"></div> Carregando...</div>';

  const user = getUser();
  const url = user ? `/luizao/sales?fkUser=${user.id}` : '/luizao/sales';

  try {
    const res = await apiRequest(url);
    const sales = await res.json();

    if (!sales.length) {
      container.innerHTML = '<p class="text-muted text-center py-4">Nenhuma venda registrada.</p>';
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Total</th>
              <th>Usuário ID</th>
            </tr>
          </thead>
          <tbody>
            ${sales.map(s => `
              <tr>
                <td class="fw-semibold text-muted">${s.id}</td>
                <td class="text-success fw-bold">${formatCurrency(s.amount)}</td>
                <td class="text-muted">${s.fkUser}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  } catch (err) {
    if (err.message !== 'Não autenticado') {
      container.innerHTML = '<p class="text-danger">Erro ao carregar histórico.</p>';
    }
  }
}
