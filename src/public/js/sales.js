import { apiFetch } from './utils.js';
import { carrinho, clearCart, renderCarrinho, showScreen, setActiveMenu } from './order.js';
import { updateOrdersView } from './report.js';

let isSubmitting = false;
const paymentSummary = document.getElementById('paymentSummary');
const paymentMessage = document.getElementById('paymentMessage');

export function renderPaymentSummary() {
  const total = renderCarrinho();
  if (!paymentSummary) return false;

  // Se o carrinho real estiver vazio, cancela e avisa o script principal
  if (carrinho.length === 0) {
    paymentSummary.innerHTML = '<p class="text-muted m-0">Adicione itens ao pedido antes de finalizar.</p>';
    return false; // <-- RETORNA FALSO
  }

  paymentSummary.innerHTML = `
    <div class="mb-3">
      <h5>Subtotal</h5>
      <p class="fs-4">R$ ${total.toFixed(2).replace('.', ',')}</p>
    </div>
    <p class="text-muted mb-0">Escolha um método de pagamento abaixo.</p>`;
  if (paymentMessage) paymentMessage.textContent = '';
  
  return true; // <-- RETORNA VERDADEIRO SE ESTIVER TUDO OK
}

export async function completeOrder(paymentCode) {
  if (carrinho.length === 0 || isSubmitting) return;
  isSubmitting = true;

  const total = renderCarrinho();
  const payload = {
    items: carrinho.map(i => ({
      itemId: i.itemId,
      quantity: i.quantidade,
      amount: +(i.preco * i.quantidade).toFixed(2)
    })),
    amount: +total.toFixed(2),
    paymentMethodCode: paymentCode
  };

  try {
    const res = await apiFetch('/luizao/orders', { method: 'POST', body: JSON.stringify(payload) });
    const data = await res.json();

    if (!res.ok) {
      if (paymentMessage) paymentMessage.textContent = data.message || 'Erro ao registrar pedido.';
      return;
    }

    clearCart();
    if (paymentMessage) {
      paymentMessage.textContent = `Pagamento confirmado! ${data.code || 'Pedido #' + data.id} registrado.`;
    }
    showScreen('tela-pedidos');
    setActiveMenu('tela-pedidos');
    updateOrdersView();
  } catch {
    if (paymentMessage) paymentMessage.textContent = 'Erro de conexão ao registrar pedido.';
  } finally {
    isSubmitting = false;
  }
}