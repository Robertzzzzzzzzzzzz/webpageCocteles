// Función para obtener el badge del estado
function getBadgeEstado(estado) {
    const estados = {
        pendiente: { class: 'bg-secondary', text: 'Pendiente' },
        preparacion: { class: 'bg-warning text-dark', text: 'En preparación' },
        listo: { class: 'bg-success', text: 'Listo' },
        entregado: { class: 'bg-info text-dark', text: 'Entregado' }
    };
    return `<span class="badge badge-estado ${estados[estado].class}">${estados[estado].text}</span>`;
}

// Función para cargar pedidos
function cargarPedidos() {
    const filtroEstado = document.getElementById('filterEstado').value;
    const busqueda = document.getElementById('searchInput').value.toLowerCase();
    
    let pedidosFiltrados = pedidos;
    
    // Aplicar filtro de estado
    if (filtroEstado !== 'todos') {
        pedidosFiltrados = pedidosFiltrados.filter(p => p.estado === filtroEstado);
    }
    
    // Aplicar búsqueda
    if (busqueda) {
        pedidosFiltrados = pedidosFiltrados.filter(p => 
            p.cliente.toLowerCase().includes(busqueda) || 
            p.mesa.toLowerCase().includes(busqueda) ||
            p.items.some(item => item.nombre.toLowerCase().includes(busqueda))
        );
    }
    
    // Ordenar por hora de salida
    pedidosFiltrados.sort((a, b) => a.horaSalida.localeCompare(b.horaSalida));
    
    // Generar HTML
    const container = document.getElementById('pedidosContainer');
    container.innerHTML = '';
    
    if (pedidosFiltrados.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-4"><h5>No hay pedidos que coincidan con los criterios</h5></div>';
        return;
    }
    
    pedidosFiltrados.forEach(pedido => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Pedido #${pedido.id}</span>
                    ${getBadgeEstado(pedido.estado)}
                </div>
                <div class="card-body">
                    <h5 class="card-title cliente-info">${pedido.cliente}</h5>
                    <p class="card-text"><i class="fas fa-table"></i> ${pedido.mesa}</p>
                    <p class="card-text"><i class="far fa-clock"></i> Pedido: ${pedido.horaPedido}</p>
                    <p class="card-text hora-salida"><i class="fas fa-hourglass-end"></i> Sale: ${pedido.horaSalida}</p>
                    
                    <h6 class="mt-3">Items:</h6>
                    <ul class="list-group list-group-flush mb-3">
                        ${pedido.items.map(item => `
                            <li class="list-group-item d-flex justify-content-between">
                                <span>${item.nombre} x${item.cantidad}</span>
                                <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                            </li>
                        `).join('')}
                    </ul>
                    
                    <div class="d-flex flex-wrap">
                        <button class="btn btn-success btn-action" onclick="cambiarEstado(${pedido.id}, 'entregado')">
                            <i class="fas fa-check"></i> Entregado
                        </button>
                        <button class="btn btn-info btn-action" onclick="verFactura(${pedido.id})">
                            <i class="fas fa-file-invoice"></i> Factura
                        </button>
                        ${pedido.estado === 'pendiente' ? `
                            <button class="btn btn-warning btn-action" onclick="cambiarEstado(${pedido.id}, 'preparacion')">
                                <i class="fas fa-utensils"></i> Preparar
                            </button>
                        ` : ''}
                        ${pedido.estado === 'preparacion' ? `
                            <button class="btn btn-primary btn-action" onclick="cambiarEstado(${pedido.id}, 'listo')">
                                <i class="fas fa-check-circle"></i> Listo
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Función para cambiar estado de un pedido
function cambiarEstado(idPedido, nuevoEstado) {
    const pedidoIndex = pedidos.findIndex(p => p.id === idPedido);
    if (pedidoIndex !== -1) {
        pedidos[pedidoIndex].estado = nuevoEstado;
        cargarPedidos();
        mostrarNotificacion(`El pedido #${idPedido} ha sido marcado como "${getBadgeEstado(nuevoEstado).match(/>([^<]+)</)[1]}"`);
    }
}

// Función para mostrar factura
function verFactura(idPedido) {
    const pedido = pedidos.find(p => p.id === idPedido);
    if (!pedido) return;
    
    // Calcular total
    const total = pedido.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // Generar contenido de la factura
    const facturaContent = document.getElementById('facturaContent');
    facturaContent.innerHTML = `
        <div class="factura-container">
            <div class="text-center mb-4">
                <h3>Factica 1</h3>
                <p class="mb-1">Dirección del Restaurante</p>
                <p class="mb-1">Tel: 123-456-7890</p>
                <p>NIT: 123456789-0</p>
            </div>
            
            <div class="row mb-3">
                <div class="col-md-6">
                    <p><strong>Factura:</strong> #${pedido.id}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                    <p><strong>Mesa/Barra:</strong> ${pedido.mesa}</p>
                </div>
            </div>
            
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>Item</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${pedido.items.map(item => `
                        <tr>
                            <td>${item.nombre}</td>
                            <td>${item.cantidad}</td>
                            <td>$${item.precio.toFixed(2)}</td>
                            <td>$${(item.precio * item.cantidad).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="text-end"><strong>Total:</strong></td>
                        <td class="total-factura">$${total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="mt-4 text-center">
                <p>¡Gracias por su visita!</p>
                <p class="text-muted">Hora estimada de entrega: ${pedido.horaSalida}</p>
            </div>
        </div>
    `;
    
    // Mostrar modal
    const facturaModal = new bootstrap.Modal(document.getElementById('facturaModal'));
    facturaModal.show();
}

// Función para registrar un nuevo usuario
function registrarUsuario(nombre, email, username, password) {
    // Verificar si el usuario ya existe
    const usuarioExistente = usuarios.find(u => u.username === username || u.email === email);
    if (usuarioExistente) {
        return { success: false, message: "El usuario o correo ya existe" };
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre,
        email,
        username,
        password, // En producción, esto debería estar encriptado
        rol: "usuario"
    };
    
    usuarios.push(nuevoUsuario);
    return { success: true, message: "Usuario registrado con éxito" };
}

// Función para autenticar usuario
function autenticarUsuario(username, password) {
    const usuario = usuarios.find(u => u.username === username && u.password === password);
    if (usuario) {
        usuarioActual = usuario;
        return { success: true, usuario };
    }
    return { success: false, message: "Usuario o contraseña incorrectos" };
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const tipos = {
        success: { class: 'bg-success', icon: 'fa-check-circle' },
        error: { class: 'bg-danger', icon: 'fa-exclamation-circle' },
        info: { class: 'bg-info', icon: 'fa-info-circle' }
    };
    
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '11';
    toast.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${tipos[tipo].class} text-white">
                <i class="fas ${tipos[tipo].icon} me-2"></i>
                <strong class="me-auto">${tipo === 'success' ? 'Éxito' : tipo === 'error' ? 'Error' : 'Información'}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${mensaje}
            </div>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}