$(document).ready(function () {
    if (!isAdmin()) return;

    let currentItemId = null;

    function renderItemTableRow(item) {
        return `
      <tr data-id="${item.id}">
        <td>${item.id}</td>
        <td class="fw-bold">${item.name}</td>
        <td>${item.description || '—'}</td>
        <td>R$ ${Number(item.price).toFixed(2).replace('.', ',')}</td>
        <td><span class="badge ${item.status === 'ATIVO' ? 'bg-success' : 'bg-secondary'}">${item.status}</span></td>
        <td>
          <button class="btn btn-xs btn-outline-info btn-modal-ingredientes" data-id="${item.id}" data-name="${item.name}">
            ⚙️ Ingredientes
          </button>
          <button class="btn btn-xs btn-outline-danger btn-inativar-item" data-id="${item.id}">
            🗑️ Inativar
          </button>
        </td>
      </tr>`;
    }

    async function loadItens() {
        const $tbody = $('#itensTableBody');
        if (!$tbody.length) return;

        $tbody.html('<tr><td colspan="6" class="text-center text-muted">Buscando itens...</td></tr>');
        try {
            const res = await apiFetch('/luizao/items');
            const itens = await res.json();

            if (!Array.isArray(itens) || itens.length === 0) {
                $tbody.html('<tr><td colspan="6" class="text-center text-muted">Nenhum item cadastrado no cardápio.</td></tr>');
                return;
            }
            $tbody.empty().append(itens.map(renderItemTableRow).join(''));
        } catch {
            $tbody.html('<tr><td colspan="6" class="text-center text-danger">Erro ao carregar tabela de itens.</td></tr>');
        }
    }

    $('#formNovoItem').submit(async function (e) {
        e.preventDefault();
        const body = {
            name: $('#itemNome').val().trim(),
            description: $('#itemDescricao').val().trim(),
            price: Number($('#itemPreco').val())
        };

        try {
            const res = await apiFetch('/luizao/items', { method: 'POST', body: JSON.stringify(body) });
            if (!res.ok) {
                const data = await res.json();
                showAlert('itemAlertBox', data.message || 'Erro ao salvar item');
                return;
            }
            showAlert('itemAlertBox', 'Item cadastrado com sucesso!', 'success');
            this.reset();
            loadItens();
        } catch {
            showAlert('itemAlertBox', 'Falha na conexão.');
        }
    });

    $('#itensTableBody').on('click', '.btn-inativar-item', async function () {
        const id = $(this).data('id');
        if (!confirm('Deseja realmente inativar este produto do menu?')) return;

        try {
            const res = await apiFetch(`/luizao/items/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            showAlert('itemAlertBox', 'Status do item alterado.', 'warning');
            loadItens();
        } catch {
            showAlert('itemAlertBox', 'Erro ao alterar status do item.');
        }
    });

    function renderIngredienteRow(ing) {
        const qty = Number(ing.quantityStock ?? 0);
        const min = Number(ing.minimumStock ?? 0);
        const baixo = qty <= min;

        return `
      <tr class="${baixo ? 'table-danger' : ''}">
        <td>${ing.id}</td>
        <td class="fw-bold">${ing.name}</td>
        <td>${min}</td>
        <td class="${baixo ? 'text-danger fw-bold' : ''}">${qty}</td>
        <td><span class="badge ${ing.status === 'ATIVO' ? 'bg-success' : 'bg-secondary'}">${ing.status}</span></td>
        <td>
          <button class="btn btn-xs btn-outline-danger btn-inativar-ing" data-id="${ing.id}">🗑️ Inativar</button>
        </td>
      </tr>`;
    }

    async function loadIngredientes() {
        const $tbody = $('#ingredientesTableBody');
        if (!$tbody.length) return;

        $tbody.html('<tr><td colspan="6" class="text-center text-muted">Carregando insumos...</td></tr>');
        try {
            const res = await apiFetch('/luizao/products');
            const ings = await res.json();

            if (!Array.isArray(ings) || ings.length === 0) {
                $tbody.html('<tr><td colspan="6" class="text-center text-muted">Nenhum insumo no estoque.</td></tr>');
                return;
            }
            $tbody.empty().append(ings.map(renderIngredienteRow).join(''));
        } catch {
            $tbody.html('<tr><td colspan="6" class="text-center text-danger">Erro ao carregar estoque.</td></tr>');
        }
    }

    $('#formNovoIngrediente').submit(async function (e) {
        e.preventDefault();
        const body = {
            name: $('#ingNome').val().trim(),
            minimum_stock: Number($('#ingEstoqueMin').val()),
            quantity_stock: Number($('#ingEstoqueAtual').val())
        };

        try {
            const res = await apiFetch('/luizao/products', { method: 'POST', body: JSON.stringify(body) });
            if (!res.ok) {
                const data = await res.json();
                showAlert('ingAlertBox', data.message || 'Erro ao cadastrar ingrediente');
                return;
            }
            showAlert('ingAlertBox', 'Ingrediente adicionado com sucesso!', 'success');
            this.reset();
            loadIngredientes();
        } catch {
            showAlert('ingAlertBox', 'Falha na conexão.');
        }
    });

    $('#ingredientesTableBody').on('click', '.btn-inativar-ing', async function () {
        const id = $(this).data('id');
        if (!confirm('Inativar este ingrediente do estoque?')) return;

        try {
            const res = await apiFetch(`/luizao/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            showAlert('ingAlertBox', 'Insumo inativado.', 'warning');
            loadIngredientes();
        } catch {
            showAlert('ingAlertBox', 'Erro ao inativar insumo.');
        }
    });

    $('#itensTableBody').on('click', '.btn-modal-ingredientes', async function () {
        currentItemId = $(this).data('id');
        const itemName = $(this).data('name');

        $('#modalItemNome').text(`Item: ${itemName}`);
        const $container = $('#ingredientesCheckboxes');
        $container.html('<div class="text-center py-3"><div class="spinner-border spinner-border-sm text-primary"></div></div>');

        const modal = new bootstrap.Modal(document.getElementById('modalIngredientes'));
        modal.show();

        try {
            const [resItem, resIng] = await Promise.all([
                apiFetch(`/luizao/items/${currentItemId}`),
                apiFetch('/luizao/products')
            ]);
            const itemData = await resItem.json();
            const ingredientes = await resIng.json();

            const associados = Array.isArray(itemData.products)
                ? itemData.products.map(p => ({ id: p.id, quantity: p.usedQuantity || 1 }))
                : [];

            if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
                $container.html('<p class="text-muted text-center">Nenhum ingrediente ativo no estoque.</p>');
                return;
            }

            $container.empty().append(
                ingredientes.filter(i => i.status === 'ATIVO').map(ing => {
                    const assoc = associados.find(a => a.id === ing.id);
                    const checked = assoc ? 'checked' : '';
                    const qty = assoc ? assoc.quantity : 1;

                    return `
            <div class="d-flex align-items-center gap-3 mb-2 p-2 border rounded bg-light">
              <input type="checkbox" class="form-check-input ing-check" id="ing-${ing.id}" data-id="${ing.id}" ${checked}>
              <label class="form-check-label flex-grow-1 fw-bold text-secondary" for="ing-${ing.id}">${ing.name}</label>
              <div class="d-flex align-items-center gap-1">
                <span class="small text-muted">Qtd:</span>
                <input type="number" class="form-control form-control-sm ing-qty" style="width:65px" data-id="${ing.id}" value="${qty}" min="1">
              </div>
            </div>`;
                }).join('')
            );
        } catch {
            $container.html('<p class="text-danger">Erro de comunicação ao cruzar dados.</p>');
        }
    });

    $('#btnSalvarIngredientes').click(async function () {
        if (!currentItemId) return;
        const $checks = $('.ing-check:checked');
        const products = Array.from($checks).map(cb => ({
            productId: Number($(cb).data('id')),
            quantity: Number($(`.ing-qty[data-id="${$(cb).data('id')}"]`).val() || 1)
        }));

        try {
            const res = await apiFetch(`/luizao/items/${currentItemId}/products`, {
                method: 'PUT',
                body: JSON.stringify({ products })
            });
            if (!res.ok) throw new Error();

            bootstrap.Modal.getInstance(document.getElementById('modalIngredientes'))?.hide();
            showAlert('itemAlertBox', 'Ficha técnica do prato atualizada!', 'success');
            loadItens();
        } catch {
            alert('Erro ao persistir composição do prato.');
        }
    });

    $('[data-tela="tela-produtos"]').click(function () {
        loadItens();
        loadIngredientes();
    });
});