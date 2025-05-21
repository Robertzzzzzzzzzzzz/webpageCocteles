// Datos de ejemplo
const pedidos = [
    {
        id: 1,
        cliente: "Juan Pérez",
        mesa: "Mesa 5",
        horaPedido: "17:30",
        horaSalida: "17:45",
        estado: "listo",
        items: [
            { nombre: "Margarita", cantidad: 2, precio: 8.50 },
            { nombre: "Nachos", cantidad: 1, precio: 6.00 }
        ]
    },
    {
        id: 2,
        cliente: "María González",
        mesa: "Mesa 2",
        horaPedido: "17:45",
        horaSalida: "18:00",
        estado: "preparacion",
        items: [
            { nombre: "Mojito", cantidad: 1, precio: 7.50 },
            { nombre: "Hamburguesa", cantidad: 1, precio: 9.00 },
            { nombre: "Papas fritas", cantidad: 1, precio: 4.00 }
        ]
    },
    {
        id: 3,
        cliente: "Carlos Ruiz",
        mesa: "Barra",
        horaPedido: "18:00",
        horaSalida: "18:20",
        estado: "pendiente",
        items: [
            { nombre: "Cerveza artesanal", cantidad: 3, precio: 5.00 },
            { nombre: "Alitas picantes", cantidad: 1, precio: 8.50 }
        ]
    }
];

// Usuarios del sistema
const usuarios = [
    {
        id: 1,
        nombre: "Administrador",
        email: "admin@factica.com",
        username: "admin",
        password: "admin123",
        rol: "admin"
    }
];

// Variables de estado
let usuarioLogueado = false;
let usuarioActual = null;