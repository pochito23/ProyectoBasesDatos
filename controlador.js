let usuarioActual = null;

let listaProductos = [
    { nombre: 'PlayStation 5', emoji: '🎮', reservas: 85, categoria: 'Electrónica' },
    { nombre: 'Cancha Volleyball', emoji: '🏐', reservas: 72, categoria: 'Deportes' },
    { nombre: 'Cámara Canon EOS', emoji: '📷', reservas: 48, categoria: 'Fotografía' },
    { nombre: 'Laptop Dell XPS', emoji: '💻', reservas: 60, categoria: 'Electrónica' },
];

let listaReservas = [
    { hora: '09:00-11:00', producto: 'Cancha Volleyball', cliente: 'Juan Pérez', estado: 'confirmada' },
    { hora: '11:00-13:00', producto: 'PlayStation 5', cliente: 'María González', estado: 'confirmada' },
    { hora: '14:00-16:00', producto: 'Cámara Canon EOS', cliente: 'Pedro López', estado: 'pendiente' },
    { hora: '16:00-18:00', producto: 'Laptop Dell XPS', cliente: 'Ana Martínez', estado: 'cancelada' },
];

const datosGrafico = {
    '7': [45, 70, 55, 85, 90, 65, 40],
    '30': [60, 75, 65, 80, 70, 85, 75],
    '90': [50, 65, 60, 70, 75, 80, 70],

};

function iniciarConGoogle() {
    alert('⚠️ Para usar Google Sign-In necesitas configurar OAuth 2.0\n\n💡 Por ahora usa el login con email');
}

function iniciarSesion(evento) {
    evento.preventDefault();

    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (email && password) {
        usuarioActual = {
            nombre: email.split('@')[0],
            email: email,
            foto: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23ec4899"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="white" font-size="40" font-family="Arial">' + email.charAt(0).toUpperCase() + '</text></svg>'
        };

        localStorage.setItem('usuario', JSON.stringify(usuarioActual));
        window.location.href = 'dashboard.html';
    }
}

function cerrarSesion() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        localStorage.removeItem('usuario');
        window.location.href = 'login.html';
    }
}

function verificarSesion() {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (window.location.pathname.includes('dashboard.html')) {
        if (!usuarioGuardado) {
            window.location.href = 'login.html';
            return;
        }
        usuarioActual = JSON.parse(usuarioGuardado);
        inicializarDashboard();
    }

    if (window.location.pathname.includes('login.html')) {
        if (usuarioGuardado) {
            window.location.href = 'dashboard.html';
        }
    }
}

function inicializarDashboard() {
    document.getElementById('nombreUsuario').textContent = usuarioActual.nombre;
    document.getElementById('emailUsuario').textContent = usuarioActual.email;
    document.getElementById('fotoUsuario').src = usuarioActual.foto;

    mostrarFechaActual();
    mostrarProductosPopulares();
    mostrarReservasHoy();
    mostrarGrafico('30');
    cargarProductosEnSelect();
}

function mostrarFechaActual() {
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    document.getElementById('fechaActual').textContent = fecha;
}

function mostrarProductosPopulares() {
    const contenedor = document.getElementById('productosPopulares');
    const coloresFondo = [
        'from-pink-50 to-purple-50',
        'from-blue-50 to-green-50',
        'from-purple-50 to-pink-50'
    ];
    const coloresEmoji = [
        'from-pink-300 to-pink-400',
        'from-blue-300 to-blue-400',
        'from-purple-300 to-purple-400'
    ];

    contenedor.innerHTML = listaProductos.map((producto, indice) => `
        <div class="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r ${coloresFondo[indice % 3]} rounded-xl hover:scale-105 hover:shadow-lg transition-all">
            <div class="flex items-center space-x-3 md:space-x-4">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${coloresEmoji[indice % 3]} rounded-lg flex items-center justify-center text-xl md:text-2xl">
                    ${producto.emoji}
                </div>
                <div>
                    <p class="font-semibold text-gray-800 text-sm md:text-base">${producto.nombre}</p>
                    <p class="text-xs md:text-sm text-gray-500">${producto.reservas} reservas</p>
                </div>
            </div>
            <button class="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-white font-medium text-xs md:text-sm" style="background: linear-gradient(135deg, #FFB5E8 0%, #DCD6F7 100%);">
                Ver
            </button>
        </div>
    `).join('');
}

function mostrarReservasHoy() {
    const contenedor = document.getElementById('reservasHoy');

    contenedor.innerHTML = listaReservas.map(reserva => {
        const estiloEstado = reserva.estado === 'confirmada' 
            ? 'background: linear-gradient(135deg, #B5EAD7 0%, #C7FFDB 100%); color: #15803d;'
            : reserva.estado === 'pendiente' 
            ? 'background: #fef3c7; color: #92400e;' 
            : 'background: #fee2e2; color: #991b1b;';
        const [inicio, fin] = reserva.hora.split('-');

        return `
            <div class="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                <div class="w-12 md:w-16 text-center flex-shrink-0">
                    <p class="text-xs text-gray-500 font-medium">${inicio}</p>
                    <p class="text-xs text-gray-400">↓</p>
                    <p class="text-xs text-gray-500 font-medium">${fin}</p>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-800 text-sm md:text-base truncate">${reserva.producto}</p>
                    <p class="text-xs md:text-sm text-gray-500 truncate">Cliente: ${reserva.cliente}</p>
                    <span class="inline-block mt-1 px-2 py-1 rounded text-xs capitalize" style="${estiloEstado}">
                        ${reserva.estado}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function mostrarGrafico(periodo) {
    const contenedor = document.getElementById('contenedorGrafico');
    const datos = datosGrafico[periodo];
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const colores = [
        'from-pink-300 to-pink-200',
        'from-purple-300 to-purple-200',
        'from-blue-300 to-blue-200',
        'from-pink-300 to-pink-200',
        'from-purple-300 to-purple-200',
        'from-blue-300 to-blue-200',
        'from-pink-300 to-pink-200'
    ];

    contenedor.innerHTML = datos.map((valor, indice) => `
        <div class="flex flex-col items-center space-y-2 flex-1">
            <div class="barra-grafico w-full bg-gradient-to-t ${colores[indice]} rounded-t-lg" style="height: ${valor}%"></div>
            <span class="text-xs md:text-sm text-gray-600 font-medium">${dias[indice]}</span>
        </div>
    `).join('');
}

function actualizarGrafico() {
    const periodo = document.getElementById('periodoGrafico').value;
    mostrarGrafico(periodo);
}

function alternarMenu() {
    const menu = document.getElementById('menuLateral');
    const overlay = document.getElementById('overlay');
    
    if (menu.classList.contains('activo')) {
        menu.classList.remove('activo');
        overlay.classList.add('hidden');
    } else {
        menu.classList.add('activo');
        overlay.classList.remove('hidden');
    }
}

function marcarActivo(elemento) {
    document.querySelectorAll('.enlace-nav').forEach(enlace => {
        enlace.classList.remove('activo');
    });

    elemento.classList.add('activo');

    if (window.innerWidth < 768) {
        alternarMenu();
    }
}

function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';

    const formulario = document.getElementById(idModal === 'modalProducto' ? 'formularioProducto' : 'formularioReserva');
    formulario.reset();
}

function guardarProducto(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('nombreProducto').value;
    const categoria = document.getElementById('categoriaProducto').value;
    const descripcion = document.getElementById('descripcionProducto').value;
    const precio = document.getElementById('precioProducto').value;

    const emojisPorCategoria = {
        'Electrónica': '💻',
        'Deportes': '⚽',
        'Fotografía': '📸',
        'Entretenimiento': '🎮'
    };

    const nuevoProducto = {
        nombre: nombre,
        emoji: emojisPorCategoria[categoria] || '📦',
        reservas: 0,
        categoria: categoria
    };

    listaProductos.push(nuevoProducto);

    const totalActual = parseInt(document.getElementById('contadorProductos').textContent);
    document.getElementById('contadorProductos').textContent = totalActual + 1;

    mostrarProductosPopulares();
    cargarProductosEnSelect();

    alert(`✅ Producto "${nombre}" agregado exitosamente!\n\nCategoría: ${categoria}\nPrecio: $${precio}/hora`);

    cerrarModal('modalProducto');
}

function cargarProductosEnSelect() {
    const select = document.getElementById('productoReserva');
    if (!select) return;

    select.innerHTML = '<option value="">Seleccionar producto</option>' +
        listaProductos.map(producto =>
            `<option value="${producto.nombre}">${producto.nombre}</option>`
        ).join('');
}

function guardarReserva(evento) {
    evento.preventDefault();

    const producto = document.getElementById('productoReserva').value;
    const cliente = document.getElementById('clienteReserva').value;
    const fecha = document.getElementById('fechaReserva').value;
    const horaInicio = document.getElementById('horaInicioReserva').value;
    const horaFin = document.getElementById('horaFinReserva').value;
    const estado = document.getElementById('estadoReserva').value;

    const nuevaReserva = {
        hora: `${horaInicio}-${horaFin}`,
        producto: producto,
        cliente: cliente,
        estado: estado
    };

    listaReservas.push(nuevaReserva);

    const totalActual = parseInt(document.getElementById('contadorReservas').textContent);
    document.getElementById('contadorReservas').textContent = totalActual + 1;

    const productoEncontrado = listaProductos.find(p => p.nombre === producto);
    if (productoEncontrado) {
        productoEncontrado.reservas++;
    }

    mostrarReservasHoy();
    mostrarProductosPopulares();

    alert(`✅ Reserva creada exitosamente!\n\nProducto: ${producto}\nCliente: ${cliente}\nFecha: ${fecha}\nHorario: ${horaInicio} - ${horaFin}`);

    cerrarModal('modalReserva');
}

function generarReporte() {
    const totalProductos = document.getElementById('contadorProductos').textContent;
    const reservasActivas = document.getElementById('contadorReservas').textContent;
    const ingresos = document.getElementById('contadorIngresos').textContent;

    const reporte = `
═══════════════════════════════════════
    📊 REPORTE DE RESERVAS
═══════════════════════════════════════

📦 Total Productos: ${totalProductos}
📅 Reservas Activas: ${reservasActivas}
💰 Ingresos Totales: ${ingresos}

─────────────────────────────────────

🔥 TOP 3 PRODUCTOS MÁS RENTADOS:

${listaProductos.slice(0, 3).map((p, i) =>
        `${i + 1}. ${p.nombre} - ${p.reservas} reservas`
    ).join('\n')}

─────────────────────────────────────

📅 RESERVAS DE HOY: ${listaReservas.length}

${listaReservas.map((r, i) =>
        `${i + 1}. ${r.hora} - ${r.producto}\n   Cliente: ${r.cliente}\n   Estado: ${r.estado}`
    ).join('\n\n')}

═══════════════════════════════════════
Usuario: ${usuarioActual.nombre}
Generado: ${new Date().toLocaleString('es-ES')}
═══════════════════════════════════════
    `;

    console.log(reporte);
    alert('📊 Reporte generado!\n\nRevisa la consola del navegador (F12) para ver el reporte completo.');
}

document.addEventListener('click', function (evento) {
    const modales = ['modalProducto', 'modalReserva'];
    modales.forEach(idModal => {
        const modal = document.getElementById(idModal);
        if (modal && evento.target === modal) {
            cerrarModal(idModal);
        }
    });
});

window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
        const menu = document.getElementById('menuLateral');
        const overlay = document.getElementById('overlay');
        if (menu) menu.classList.remove('activo');
        if (overlay) overlay.classList.remove('activo');
    }
});

document.addEventListener('DOMContentLoaded', verificarSesion);