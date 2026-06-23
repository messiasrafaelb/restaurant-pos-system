$(document).ready(function () {
    let carrinho = [];

    function renderCardComponent(item) {
        return `
      <div class="col-lg-4 col-md-6 mb-3">
        <div class="product-card card h-100 shadow-sm" 
             data-item-id="${item.id}" data-nome="${item.name.replace(/"/g, '&quot;')}" data-preco="${item.price}">
          <div class="card-body text-center">
            <img src="/img/logo.png" style="width:50px;height:50px;object-fit:contain;" alt="${item.name}">
            <div class="fw-bold mt-2">${item.name}</div>
            <div class="text-muted small">${item.description || ''}</div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div class="fw-bold text-success">R$ ${Number(item.price).toFixed(2).replace('.', ',')}</div>
              <button class="btn btn-sm btn-primary add-btn">+</button>
            </div>
          </div>
        </div>
      </div>`;
    }

    function renderCarrinhoItemComponent(item, index) {
        return `
      <div class="order-item border-bottom pb-2 mb-2">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-bold small">${item.nome}</div>
            <small class="text-muted">R$ ${item.preco.toFixed(2).replace('.', ',')}</small>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary py-0 px-2 qty-diminuir" data-index="${index}">-</button>
            <strong>${item.quantidade}</strong>
            <button class="btn btn-sm btn-outline-secondary py-0 px-2 qty-aumentar" data-index="${index}">+</button>
          </div>
        </div>
      </div>`;
    }

    async function loadProductCards() {
        const $grid = $('#productsGrid');
        if (!$grid.length) return;

        try {
            const res = await apiFetch('/luizao/items?status=ATIVO');
            if (!res.ok) throw new Error();
            const items = await res.json();

            if (!Array.isArray(items) || items.length === 0) {
                $grid.html('<div class="col-12 text-center text-muted py-5">Nenhum produto disponível.</div>');
                return;
            }

            $grid.empty().append(items.map(renderCardComponent).join(''));
        } catch {
            $grid.html('<div class="col-12 text-center text-danger py-5">Erro ao carregar produtos.</div>');
        }
    }

    function atualizarCarrinhoUI() {
        const $container = $('#pedidoAtual');
        $container.empty();
        let total = 0;

        carrinho.forEach((item, index) => {
            total += item.preco * item.quantidade;
            $container.append(renderCarrinhoItemComponent(item, index));
        });

        $('#subtotal').text(`R$ ${total.toFixed(2).replace('.', ',')}`);
    }

    $('#productsGrid').on('click', '.add-btn', function () {
        const $card = $(this).closest('.product-card');
        const item = {
            itemId: Number($card.data('item-id')),
            nome: $card.data('nome'),
            preco: Number($card.data('preco')),
            quantidade: 1
        };

        const existing = carrinho.find(i => i.itemId === item.itemId);
        if (existing) { existing.quantidade += 1; } else { carrinho.push(item); }
        atualirCarrinhoUI();
    });

    $('#pedidoAtual').on('click', '.qty-aumentar', function () {
        carrinho[$(this).data('index')].quantidade += 1;
        atualizarCarrinhoUI();
    });

    $('#pedidoAtual').on('click', '.qty-diminuir', function () {
        const idx = $(this).data('index');
        carrinho[idx].quantidade -= 1;
        if (carrinho[idx].quantidade <= 0) carrinho.splice(idx, 1);
        atualizarCarrinhoUI();
    });

    $('#limparPedido').click(function () {
        carrinho = [];
        atualizarCarrinhoUI();
    });

    $('#searchInput').on('keyup', function () {
        const text = $(this).val().toLowerCase().trim();
        $('#productsGrid .product-card').each(function () {
            const name = ($(this).data('nome') || '').toLowerCase();
            $(this).closest('[class*="col"]').toggle(!text || name.includes(text));
        });
    });

    loadProductCards();
});