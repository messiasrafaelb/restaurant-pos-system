import { apiRequest, formatCurrency, showAlert } from './utils.js';

let produtosInitialized = false;

export async function initProdutos() {
  await loadProdutos();
  if (produtosInitialized) return;
  produtosInitialized = true;

  document.getElementById('formNovoProduto').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveProduto();
  });
}

async function loadProdutos() {
  const tbody = document.getElementById('produtosTableBody');
  tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Carregando...</td></tr>';

  try {
    const res = await apiRequest('/luizao/products');
    const products = await res.json();

    if (!products.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum produto cadastrado.</td></tr>';
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td class="text-muted">${p.id}</td>
        <td class="fw-semibold">${p.name}</td>
        <td class="text-success fw-bold">${formatCurrency(p.price)}</td>
        <td>${p.unitMeasure || '—'}</td>
      </tr>
    `).join('');
  } catch (err) {
    if (err.message !== 'Não autenticado') {
      tbody.innerHTML = '<tr><td colspan="4" class="text-danger text-center">Erro ao carregar produtos.</td></tr>';
    }
  }
}

async function saveProduto() {
  const name = document.getElementById('produtoNome').value.trim();
  const price = document.getElementById('produtoPreco').value;
  const unitMeasure = document.getElementById('produtoUnidade').value.trim();

  try {
    const res = await apiRequest('/luizao/products', {
      method: 'POST',
      body: JSON.stringify({ name, price: Number(price), unitMeasure: unitMeasure || null })
    });
    const data = await res.json();

    if (!res.ok) {
      showAlert('produtoAlertBox', data.message || 'Erro ao cadastrar produto.');
      return;
    }

    showAlert('produtoAlertBox', 'Produto cadastrado com sucesso!', 'success');
    document.getElementById('formNovoProduto').reset();
    await loadProdutos();
  } catch (err) {
    if (err.message !== 'Não autenticado') {
      showAlert('produtoAlertBox', 'Erro de conexão.');
    }
  }
}
