import { apiRequest, showAlert } from './utils.js';

let clientesInitialized = false;

export async function initClientes() {
  await loadClientes();
  if (clientesInitialized) return;
  clientesInitialized = true;

  document.getElementById('formNovoCliente').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveCliente();
  });
}

async function loadClientes() {
  const tbody = document.getElementById('clientesTableBody');
  tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Carregando...</td></tr>';

  try {
    const res = await apiRequest('/luizao/customers');
    const customers = await res.json();

    if (!customers.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum cliente cadastrado.</td></tr>';
      return;
    }

    tbody.innerHTML = customers.map(c => `
      <tr>
        <td class="text-muted">${c.id}</td>
        <td class="fw-semibold">${c.name}</td>
        <td>${c.phone || '—'}</td>
        <td>${c.document || '—'}</td>
      </tr>
    `).join('');
  } catch (err) {
    if (err.message !== 'Não autenticado') {
      tbody.innerHTML = '<tr><td colspan="4" class="text-danger text-center">Erro ao carregar clientes.</td></tr>';
    }
  }
}

async function saveCliente() {
  const name = document.getElementById('clienteNome').value.trim();
  const phone = document.getElementById('clienteTelefone').value.trim();
  const docNumber = document.getElementById('clienteDocumento').value.trim();

  try {
    const res = await apiRequest('/luizao/customers/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone: phone || null, document: docNumber || null })
    });
    const data = await res.json();

    if (!res.ok) {
      showAlert('clienteAlertBox', data.message || 'Erro ao cadastrar cliente.');
      return;
    }

    showAlert('clienteAlertBox', 'Cliente cadastrado com sucesso!', 'success');
    document.getElementById('formNovoCliente').reset();
    await loadClientes();
  } catch (err) {
    if (err.message !== 'Não autenticado') {
      showAlert('clienteAlertBox', 'Erro de conexão.');
    }
  }
}
