// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar contenido principal inicialmente
    document.getElementById('mainContent').style.display = 'none';
    
    // Manejar login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const resultado = autenticarUsuario(username, password);
        if (resultado.success) {
            mostrarNotificacion(`Bienvenido ${resultado.usuario.nombre}`);
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            cargarPedidos();
        } else {
            mostrarNotificacion(resultado.message, 'error');
        }
    });
    
    // Manejar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        usuarioActual = null;
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });
    
    // Mostrar modal de registro
    document.getElementById('crearCuentaBtn').addEventListener('click', function(e) {
        e.preventDefault();
        const registroModal = new bootstrap.Modal(document.getElementById('registroModal'));
        registroModal.show();
    });
    
    // Manejar registro
    document.getElementById('registroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('regNombre').value;
        const email = document.getElementById('regEmail').value;
        const username = document.getElementById('regUsuario').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (password !== confirmPassword) {
            mostrarNotificacion("Las contraseñas no coinciden", "error");
            return;
        }
        
        const resultado = registrarUsuario(nombre, email, username, password);
        if (resultado.success) {
            mostrarNotificacion(resultado.message);
            // Limpiar formulario
            document.getElementById('registroForm').reset();
            // Cerrar modal
            bootstrap.Modal.getInstance(document.getElementById('registroModal')).hide();
        } else {
            mostrarNotificacion(resultado.message, "error");
        }
    });
    
    // Filtros y búsqueda
    document.getElementById('filterEstado').addEventListener('change', cargarPedidos);
    document.getElementById('searchInput').addEventListener('input', cargarPedidos);
    
    // Botón imprimir factura
    document.getElementById('imprimirFacturaBtn').addEventListener('click', function() {
        window.print();
    });
});