document.addEventListener('DOMContentLoaded', async () => {
    const apiBase = '/luizao';
    const screens = document.querySelectorAll('.item-tela');
    const menuButtons = document.querySelectorAll('.menu-item[data-tela]');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const filterButton = document.getElementById('filterButton');
    const finalizarButton = document.getElementById('finalizarPedido');
    const paymentSummary = document.getElementById('paymentSummary');
    const paymentMessage = document.getElementById('paymentMessage');
    const paymentMethodButtons = document.querySelectorAll('.payment-method-btn[data-method]');
    const cardTypeButtons = document.querySelectorAll('.payment-method-btn[data-card-type]');
    const voltarVenda = document.getElementById('voltarVenda');
    const voltarMetodo = document.getElementById('voltarMetodo');
    const pedidosList = document.getElementById('pedidosList');
    const reportsContainer = document.getElementById('reportsContainer');
    const estoqueList = document.getElementById('estoqueList');
    const pedidoAtual = document.getElementById('pedidoAtual');
    const subtotal = document.getElementById('subtotal');
    const limparPedido = document.getElementById('limparPedido');
    const productsGrid = document.getElementById('productsGrid');
    const formProduto = document.getElementById('formProduto');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const productCategoryInput = document.getElementById('productCategory');
    const productDescriptionInput = document.getElementById('productDescription');
    const productImagePathInput = document.getElementById('productImagePath');
    const itemList = document.getElementById('itemList');

    let carrinho = [];
    let currentCategory = 'lanche';
    let orders = [];
    let pendingPaymentMethod = null;
    let productCards = [];
    let items = [];
    let defaultUserId = 1;
    const itemCategoryMap = {};

    const showScreen = (screenId) => {
        screens.forEach(screen => screen.classList.add('d-none'));
        const target = document.getElementById(screenId);
        if (target) target.classList.remove('d-none');
    };

    const setActiveMenu = (screenId) => {
        menuButtons.forEach(button => {
            if (button.getAttribute('data-tela') === screenId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
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
                            <img src="${item.img}" style="width: 50px; height: 50px; object-fit: contain;" alt="${item.nome}">
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
                </div>
            `;
        });

        subtotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        return total;
    };

    const mapItemCategory = (item) => {
        if (!item) return 'lanche';

        if (itemCategoryMap[item.id]) {
            return itemCategoryMap[item.id];
        }

        const name = (item.name || '').toLowerCase();
        const description = (item.description || '').toLowerCase();

        if (description.includes('suco') || description.includes('refrigerante') || description.includes('bebida') || name.includes('refrigerante') || name.includes('suco')) {
            return 'bebida';
        }

        if (description.includes('milkshake') || description.includes('sorvete') || description.includes('sobremesa') || name.includes('milkshake') || name.includes('doce')) {
            return 'sobremesa';
        }

        return 'lanche';
    };

    const renderProductCards = (itemsArray) => {
        if (!productsGrid) return;

        productsGrid.innerHTML = itemsArray.map(item => {
            const category = mapItemCategory(item);
            const price = Number(item.price || item.preco || 0).toFixed(2).replace('.', ',');
            const img = item.img || item.imagePath || item.image || '/img/logo.png';

            return `
                <div class="col-lg-4 col-md-6">
                    <div class="product-card" data-nome="${item.name}" data-preco="${Number(item.price || item.preco || 0)}" data-category="${category}" data-stock="${item.quantity_stock ?? item.stock ?? 0}" data-img="${img}">
                        <div class="imagem">
                            <img src="${img}" alt="${item.name}">
                        </div>
                        <div class="product-title">${item.name}</div>
                        <div class="product-description">${item.description || ''}</div>
                        <div class="d-flex justify-content-between align-items-center mt-4">
                            <div class="price">R$ ${price}</div>
                            <button class="add-btn">+</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        productCards = Array.from(document.querySelectorAll('.product-card'));
        bindAddButtons();
        applyFilters();
    };

    const bindAddButtons = () => {
        const addButtons = Array.from(document.querySelectorAll('.add-btn'));
        addButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.product-card');
                if (!card) return;
                const nome = card.dataset.nome;
                const preco = Number(card.dataset.preco);
                const img = card.dataset.img || '/img/logo.png';

                const existing = carrinho.find(item => item.nome === nome);
                if (existing) {
                    existing.quantidade += 1;
                } else {
                    carrinho.push({ nome, preco, img, quantidade: 1 });
                }
                renderCarrinho();
            });
        });
    };

    const handleApiError = async (response) => {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const body = await response.json();
            return body.message || body.error || JSON.stringify(body);
        }
        return response.statusText || 'Erro na requisição';
    };

    const loadItems = async () => {
        try {
            const response = await fetch(`${apiBase}/items`);
            if (!response.ok) {
                const message = await handleApiError(response);
                throw new Error(message);
            }

            items = await response.json();
            items.forEach(item => {
                itemCategoryMap[item.id] = mapItemCategory(item);
            });
            renderProductCards(items);
        } catch (error) {
            console.error('Erro ao carregar itens:', error.message);
            if (productsGrid) productsGrid.innerHTML = '<p class="text-danger">Falha ao carregar produtos. Atualize a página.</p>';
        }
    };

    const loadSales = async () => {
        try {
            const response = await fetch(`${apiBase}/sales`);
            if (!response.ok) {
                const message = await handleApiError(response);
                throw new Error(message);
            }

            const sales = await response.json();
            orders = sales.map(sale => ({
                id: sale.fkOrder || sale.id,
                total: Number(sale.amount || 0),
                date: sale.createdAt ? new Date(sale.createdAt).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
                method: sale.status || 'Finalizado',
                status: sale.status || 'Finalizado',
                items: []
            }));
            updateOrdersView();
            updateReportsView();
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error.message);
        }
    };

    const getDefaultUserId = async () => {
        try {
            const response = await fetch(`${apiBase}/users`);
            if (!response.ok) {
                const message = await handleApiError(response);
                throw new Error(message);
            }

            const users = await response.json();
            if (Array.isArray(users) && users.length > 0) {
                return users[0].id;
            }

            const createResponse = await fetch(`${apiBase}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'PDV Usuário',
                    email: 'pdv@luizao.local',
                    password: 'pdv123',
                    role: 'USER',
                    status: 'ATIVO'
                })
            });

            if (!createResponse.ok) {
                const message = await handleApiError(createResponse);
                throw new Error(message);
            }

            const createdUser = await createResponse.json();
            return createdUser.id;
        } catch (error) {
            console.error('Erro ao obter usuário padrão:', error.message);
            return 1;
        }
    };

    const applyFilters = () => {
        const searchText = searchInput.value.trim().toLowerCase();

        productCards.forEach(card => {
            const category = card.dataset.category || '';
            const name = card.dataset.nome.toLowerCase();
            const matchesCategory = currentCategory ? category === currentCategory : true;
            const matchesSearch = searchText ? name.includes(searchText) : true;
            card.closest('.col-lg-4').classList.toggle('d-none', !(matchesCategory && matchesSearch));
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
                    <span class="badge bg-success">${order.status}</span>
                </div>
                <div class="mb-2">Total: <strong>R$ ${order.total.toFixed(2).replace('.', ',')}</strong></div>
                <div>${order.items && order.items.length > 0 ? order.items.map(item => `<div>${item.quantidade}x ${item.nome}</div>`).join('') : '<div class="text-muted">Itens não disponíveis</div>'}</div>
            </div>
        `).join('');
    };

    const updateReportsView = () => {
        if (!reportsContainer) return;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const itemsSold = orders.reduce((sum, order) => sum + order.items.reduce((count, item) => count + item.quantidade, 0), 0);

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
            </div>
        `;
    };

    const updateEstoqueView = () => {
        if (!estoqueList) return;

        // Array com os ingredientes reais e insumos detalhados
const ingredientes = [
            { nome: "Bacon", categoria: "Insumo / Adicional", qtd: "20 Unid", status: "Estoque Crítico", classeBadge: "bg-warning text-dark" },
            { nome: "Pão de Hambúrguer", categoria: "Insumo Base", qtd: "50 Unid", status: "Estoque OK", classeBadge: "bg-success" },
            { nome: "Blend de Carne (150g)", categoria: "Insumo Base", qtd: "65 Unid", status: "Estoque OK", classeBadge: "bg-success" },
            { nome: "Queijo Prato Cheddar", categoria: "Insumo / Adicional", qtd: "40 Unid", status: "Estoque OK", classeBadge: "bg-success" },
            { nome: "Batata Palito Congelada", categoria: "Porção / Insumo", qtd: "15 kg", status: "Estoque Moderado", classeBadge: "bg-warning text-dark" },
            { nome: "Alface Fresca", categoria: "Hortifrúti", qtd: "12 Unid", status: "Estoque OK", classeBadge: "bg-success" },
            { nome: "Tomate", categoria: "Hortifrúti", qtd: "8 kg", status: "Estoque Moderado", classeBadge: "bg-warning text-dark" },
            { nome: "Nuggets de Frango (Congelado)", categoria: "Porção / Insumo", qtd: "180 Unid", status: "Estoque OK", classeBadge: "bg-success" },
            { nome: "Refrigerante Lata 350ml", categoria: "Bebida Pronta", qtd: "20 Unid", status: "Estoque OK", classeBadge: "bg-success" },
            { nome: "Laranja (Suco Natural)", categoria: "Hortifrúti", qtd: "25 kg", status: "Estoque OK", classeBadge: "bg-success" },
            { nome: "Base para Milkshake", categoria: "Insumo Sobremesa", qtd: "10 kg", status: "Estoque OK", classeBadge: "bg-success" },
            { nome: "Ovomaltine Flocos", categoria: "Insumo Sobremesa", qtd: "5 kg", status: "Estoque OK", classeBadge: "bg-success" }
        ];

        // Monta as linhas da tabela dinamicamente com os ingredientes reais
        estoqueList.innerHTML = ingredientes.map(item => `
            <tr>
                <td class="fw-semibold">${item.nome}</td>
                <td>${item.categoria}</td>
                <td class="fw-bold text-dark">${item.qtd}</td>
                <td><span class="badge ${item.classeBadge} px-2 py-1">${item.status}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    };

    const completeOrder = async (method) => {
        const total = renderCarrinho();
        if (carrinho.length === 0) return;

        try {
            const orderPayload = {
                code: `PDV-${Date.now()}`,
                observations: `Pagamento ${method}`,
                status: 'CONCLUIDO'
            };

            const orderResponse = await fetch(`${apiBase}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            if (!orderResponse.ok) {
                const message = await handleApiError(orderResponse);
                throw new Error(`Falha ao salvar pedido: ${message}`);
            }

            const orderData = await orderResponse.json();
            const salePayload = {
                amount: total,
                discount: 0,
                status: 'ATIVO',
                fk_order: orderData.id,
                fk_user: 1
            };

            const saleResponse = await fetch(`${apiBase}/sales`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...salePayload,
                    fk_user: defaultUserId
                })
            });

            if (!saleResponse.ok) {
                const message = await handleApiError(saleResponse);
                throw new Error(`Falha ao salvar venda: ${message}`);
            }

            const saleData = await saleResponse.json();
            const order = {
                id: orderData.id,
                method,
                total,
                items: carrinho.map(item => ({ nome: item.nome, quantidade: item.quantidade })),
                date: new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
                status: saleData.status || 'ATIVO'
            };

            orders.unshift(order);
            carrinho = [];
            renderCarrinho();
            updateOrdersView();
            updateReportsView();
            if (paymentMessage) paymentMessage.textContent = `Pagamento com ${method} confirmado! Pedido #${order.id} registrado.`;
            showScreen('tela-pedidos');
            setActiveMenu('tela-pedidos');
        } catch (error) {
            console.error(error.message);
            if (paymentMessage) paymentMessage.textContent = `Erro ao finalizar pedido: ${error.message}`;
        }
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
            <div>
                <p class="text-muted mb-0">Escolha um método de pagamento abaixo.</p>
            </div>
        `;
        if (paymentMessage) paymentMessage.textContent = '';
    };

    const handleMenuClick = (event) => {
        const screenId = event.currentTarget.getAttribute('data-tela');
        if (!screenId) return;
        showScreen(screenId);
        setActiveMenu(screenId);
        if (screenId === 'tela-pedidos') updateOrdersView();
        if (screenId === 'tela-relatorios') updateReportsView();
        if (screenId === 'tela-estoque') updateEstoqueView();
    };

    menuButtons.forEach(button => button.addEventListener('click', handleMenuClick));

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category || '';
            applyFilters();
        });
    });

    filterButton?.addEventListener('click', applyFilters);
    searchInput?.addEventListener('keyup', applyFilters);

    finalizarButton?.addEventListener('click', () => {
        renderPaymentSummary();
        showScreen('tela-dinheiro');
        setActiveMenu('');
    });

    paymentMethodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const method = button.dataset.method;
            if (method === 'Cartão') {
                pendingPaymentMethod = method;
                showScreen('tela-cartao');
                setActiveMenu('');
                return;
            }
            completeOrder(method);
        });
    });

    cardTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.cardType;
            if (!pendingPaymentMethod) return;
            completeOrder(`${pendingPaymentMethod} - ${type}`);
            pendingPaymentMethod = null;
        });
    });

    voltarMetodo?.addEventListener('click', () => {
        showScreen('tela-dinheiro');
        setActiveMenu('');
    });

    voltarVenda?.addEventListener('click', () => {
        showScreen('tela-venda');
        setActiveMenu('tela-venda');
    });

    limparPedido?.addEventListener('click', () => {
        carrinho = [];
        renderCarrinho();
    });

    formProduto?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = productNameInput?.value.trim();
        const description = productDescriptionInput?.value.trim();
        const price = Number(productPriceInput?.value);
        const category = productCategoryInput?.value;
        const imagePath = productImagePathInput?.value.trim() || '/img/logo.png';

        if (!name || !price || price <= 0) {
            if (itemList) {
                itemList.innerHTML = '<div class="alert alert-danger">Nome e preço são obrigatórios para cadastrar um item.</div>';
            }
            return;
        }

        try {
            const response = await fetch(`${apiBase}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    price,
                    status: 'ATIVO',
                    created_at: new Date(),
                    image: imagePath
                })
            });

            if (!response.ok) {
                const message = await handleApiError(response);
                throw new Error(message);
            }

            const createdItem = await response.json();
            itemCategoryMap[createdItem.id] = category || mapItemCategory(createdItem);

            if (itemList) {
                itemList.innerHTML = '<div class="alert alert-success">Item cadastrado com sucesso.</div>';
            }

            productNameInput.value = '';
            productDescriptionInput.value = '';
            productPriceInput.value = '';
            productImagePathInput.value = '';

            await loadItems();
        } catch (error) {
            console.error('Erro ao cadastrar item:', error.message);
            if (itemList) {
                itemList.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
            }
        }
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
            if (carrinho[index].quantidade <= 0) {
                carrinho.splice(index, 1);
            }
            renderCarrinho();
        }
    };

    defaultUserId = await getDefaultUserId();
    await loadItems();
    await loadSales();
    applyFilters();
});

function atualizarRelogio() {
    const agora = new Date();
    const dataAtual = agora.toLocaleDateString('pt-BR');
    const horaAtual = agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    document.getElementById('dataAtual').textContent = dataAtual;
    document.getElementById('horaAtual').textContent = horaAtual;
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);