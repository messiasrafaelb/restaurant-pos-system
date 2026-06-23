const getToken = () => localStorage.getItem('token');
const getUser = () => { try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; } };
const isAdmin = () => getUser().role === 'ADMIN';
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: { ...authHeaders(), ...(options.headers || {}) }
    });
    return res;
}

function showAlert(containerId, message, type = 'danger') {
    const $box = $(`#${containerId}`);
    if (!$box.length) return;

    $box.html(`
    <div class="alert alert-${type} alert-dismissible fade show py-2" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`
    );
    setTimeout(() => { $box.find('.alert').alert('close'); }, 4000);
}

$(document).ready(function () {
    if (!getToken()) {
        window.location.href = '/login';
        return;
    }

    const user = getUser();
    $('#topbarNome').text(user.name || 'Operador');
    $('#topbarRole').text(user.role || '');

    if (!isAdmin()) {
        $('.admin-only').addClass('d-none');
    }

    $('#btnLogout').click(function () {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/register';
    });

    setInterval(() => {
        const agora = new Date();
        $('#dataAtual').text(agora.toLocaleDateString('pt-BR'));
        $('#horaAtual').text(agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
});