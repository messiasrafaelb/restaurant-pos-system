import { apiFetch, isAdmin, showAlert } from './utils.js';

let currentItemId = null;
let allIngredientes = [];

export async function loadItens() {
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
          <span class="badge ${item.status === 'ATIVO' ? 'bg-success' : 'bg-secondary'}">${item.status}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-info me-1"
            onclick="window.produtosAdmin.abrirIngredientes(${item.id}, '${(item.name || '').replace(/'/g, "\\'")}')">
            <i class="bi bi-list-ul"></i> Ingredientes
          </button>
          <button class="btn btn-sm btn-outline-danger"
            onclick="window.produtosAdmin.deletarItem(${item.id})">
            <i class="bi bi-trash"></i> Inativar
          </button>
        </td>
      </tr>`).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Erro ao carregar itens.</td></tr>';
  }
}

export async function deletarItem(id) {
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

export async function loadIngredientes() {
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
          <span class="badge ${ing.status === 'ATIVO' ? 'bg-success' : 'bg-secondary'}">${ing.status}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-danger"
            onclick="window.produtosAdmin.deletarIngrediente(${ing.id})">
            <i class="bi bi-trash"></i> Inativar
          </button>
        </td>
      </tr>`).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Erro ao carregar ingredientes.</td></tr>';
  }
}

export async function deletarIngrediente(id) {
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

export async function abrirIngredientes(itemId, itemName) {
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

export function initProdutos() {
  if (!isAdmin()) return;

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
      showAlert('itemAlertBox', 'Item saved successfully!', 'success');
      e.target.reset();
      loadItens();
    } catch {
      showAlert('itemAlertBox', 'Erro de conexão');
    }
  });

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

  // Expõe no escopo global apenas as funções invocadas via onclick inline no HTML
  window.produtosAdmin = { deletarItem, deletarIngrediente, abrirIngredientes };
}