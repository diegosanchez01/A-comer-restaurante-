// Variables Globales
var categoriaActiva = null;
var pedido = [];

// Mostrar / Ocultar Categoría
function mostrarCategoria(cat) {
    categoriaActiva = cat;

    var tabDesayunos = document.getElementById('tabDesayunos');
    var tabAlmuerzos = document.getElementById('tabAlmuerzos');
    var desayunosSec = document.getElementById('desayunosSec');
    var almuerzosSec = document.getElementById('almuerzosSec');
    var promptBox = document.getElementById('initialPrompt');

    // Resetear clases de pestañas
    tabDesayunos.classList.remove('active');
    tabAlmuerzos.classList.remove('active');

    if (cat === 'desayunos') {
        tabDesayunos.classList.add('active');
        desayunosSec.classList.remove('hidden');
        almuerzosSec.classList.add('hidden');
    } else if (cat === 'almuerzos') {
        tabAlmuerzos.classList.add('active');
        almuerzosSec.classList.remove('hidden');
        desayunosSec.classList.add('hidden');
    }

    if (promptBox) {
        promptBox.classList.add('hidden');
    }

    // Resetear buscador
    var input = document.getElementById('searchInput');
    if (input && input.value !== '') {
        input.value = '';
        filtrarPlatos();
    }
}

// Agregar producto al pedido
function agregarAlPedido(nombre, precio) {
    var existente = pedido.find(function(item) {
        return item.nombre === nombre;
    });

    if (existente) {
        existente.cantidad += 1;
    } else {
        pedido.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }

    actualizarBarraPedido();
}

// Actualizar barra flotante inferior
function actualizarBarraPedido() {
    var bar = document.getElementById('orderBar');
    var countEl = document.getElementById('orderCount');
    var totalEl = document.getElementById('orderTotal');

    var totalCantidad = 0;
    var totalMonto = 0;

    for (var i = 0; i < pedido.length; i++) {
        totalCantidad += pedido[i].cantidad;
        totalMonto += (pedido[i].precio * pedido[i].cantidad);
    }

    if (totalCantidad > 0) {
        bar.classList.remove('hidden');
        countEl.textContent = totalCantidad + (totalCantidad === 1 ? ' platillo seleccionado' : ' platillos seleccionados');
        totalEl.textContent = totalMonto.toLocaleString('es-CO') + ' COP';
    } else {
        bar.classList.add('hidden');
    }
}

// Modal del Carrito
function abrirModal() {
    var modal = document.getElementById('orderModal');
    var lista = document.getElementById('cartItemsList');
    var totalEl = document.getElementById('modalTotal');

    lista.innerHTML = '';
    var totalMonto = 0;

    for (var i = 0; i < pedido.length; i++) {
        var item = pedido[i];
        totalMonto += (item.precio * item.cantidad);

        var div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML =
            '<div>' +
            '<strong>' + item.nombre + '</strong>' +
            '<div class="unit-price">' + item.precio.toLocaleString('es-CO') + ' COP c/u</div>' +
            '</div>' +
            '<div class="qty-controls">' +
            '<button onclick="cambiarCantidad(' + i + ', -1)">-</button>' +
            '<span>' + item.cantidad + '</span>' +
            '<button onclick="cambiarCantidad(' + i + ', 1)">+</button>' +
            '</div>';

        lista.appendChild(div);
    }

    totalEl.textContent = totalMonto.toLocaleString('es-CO') + ' COP';
    modal.style.display = 'flex';
}

function cambiarCantidad(index, cambio) {
    pedido[index].cantidad += cambio;

    if (pedido[index].cantidad <= 0) {
        pedido.splice(index, 1);
    }

    if (pedido.length === 0) {
        cerrarModal();
    } else {
        abrirModal();
    }

    actualizarBarraPedido();
}

function cerrarModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Enviar Pedido a WhatsApp
function enviarWhatsApp() {
    if (pedido.length === 0) return;

    var mesa = document.getElementById('tableName').value.trim() || 'No especificada';
    var mensaje = '*¡Hola! Quisiera realizar un pedido en Restaurante A Comer:*\n\n';
    var total = 0;

    for (var i = 0; i < pedido.length; i++) {
        var subtotal = pedido[i].precio * pedido[i].cantidad;
        total += subtotal;
        mensaje += '• ' + pedido[i].cantidad + 'x *' + pedido[i].nombre + '* - $' + subtotal.toLocaleString('es-CO') + ' COP\n';
    }

    mensaje += '\n*Total:* $' + total.toLocaleString('es-CO') + ' COP';
    mensaje += '\n*Mesa / Ubicación:* ' + mesa;

    var telefono = "573000000000"; // Reemplaza por tu número de WhatsApp
    var url = 'https://wa.me/' + telefono + '?text=' + encodeURIComponent(mensaje);
    window.open(url, '_blank');
}

// Filtrar buscador
function filtrarPlatos() {
    var input = document.getElementById('searchInput');
    var query = input.value.toLowerCase().trim();
    var clearBtn = document.getElementById('clearSearch');
    var noResults = document.getElementById('noResults');
    var cards = document.querySelectorAll('.item-card');
    var encontrados = 0;

    if (query !== '') {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }

    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var titulo = card.getAttribute('data-title');
        var cat = card.getAttribute('data-category');

        var coincideCategoria = (categoriaActiva === null || cat === categoriaActiva);
        var coincideBusqueda = titulo.includes(query);

        if (coincideCategoria && coincideBusqueda) {
            card.style.display = 'flex';
            encontrados++;
        } else {
            card.style.display = 'none';
        }
    }

    if (categoriaActiva !== null && encontrados === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
    }
}

function limpiarBuscador() {
    var input = document.getElementById('searchInput');
    input.value = '';
    filtrarPlatos();
}

// Event listener del buscador
document.addEventListener('DOMContentLoaded', function() {
    var input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('keyup', filtrarPlatos);
    }
});








><!DOCTYPE html>
<html lang="es">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menú Digital - Restaurante A Comer</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
    <style>
        :root {
        --primary: #b22222;
        --primary-dark: #8b0000;
        --secondary: #1a202c;
        --bg-body: #f8fafc;
        --surface: #ffffff;
        --text-main: #2d3748;
        --text-muted: #718096;
        --border-color: #e2e8f0;
        --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
        --shadow-lg: 0 10px 25px rgba(0,0,0,0.12);
        --radius-md: 12px;
        --radius-lg: 20px;
        --transition: all 0.25s ease;
    }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
        font-family: 'Outfit', sans-serif;
        background-color: var(--bg-body);
        color: var(--text-main);
        line-height: 1.5;
        padding-bottom: 100px;
    }

        .container { max-width: 1250px; margin: 0 auto; padding: 0 1.25rem; }

        .hero {
        background: linear-gradient(135deg, rgba(26, 32, 44, 0.92), rgba(178, 34, 34, 0.88)),
        url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1600') center/cover;
        color: #ffffff;
        padding: 3rem 0 3.5rem;
        text-align: center;
        border-bottom-left-radius: var(--radius-lg);
        border-bottom-right-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
    }

        .brand-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: rgba(255, 255, 255, 0.15);
        padding: 0.35rem 0.9rem;
        border-radius: 20px;
        font-size: 0.82rem;
        font-weight: 500;
        margin-bottom: 0.75rem;
    }

        .hero h1 {
        font-family: 'Playfair Display', serif;
        font-size: 2.8rem;
        font-weight: 700;
        margin-bottom: 0.4rem;
    }

        .hero p {
        font-size: 1.05rem;
        color: #e2e8f0;
        font-weight: 300;
        max-width: 550px;
        margin: 0 auto 1.5rem;
    }

        .search-box { position: relative; max-width: 500px; margin: 0 auto; }
        .search-box input {
        width: 100%;
        padding: 0.9rem 2.5rem 0.9rem 1.2rem;
        border-radius: 40px;
        border: 2px solid transparent;
        background: #ffffff;
        font-size: 0.95rem;
        outline: none;
        box-shadow: var(--shadow-lg);
    }
        .search-box input:focus { border-color: var(--primary); }

        .clear-btn {
        position: absolute; right: 1.2rem; top: 50%; transform: translateY(-50%);
        background: none; border: none; color: var(--text-muted); cursor: pointer; display: none; font-size: 1rem; font-weight: bold;
    }

        .category-tabs-container { margin-top: -1.5rem; margin-bottom: 2rem; position: relative; z-index: 10; }
        .category-tabs { display: flex; justify-content: center; gap: 1rem; }

        .tab-btn {
        background: var(--surface);
        border: 2px solid var(--border-color);
        color: var(--secondary);
        padding: 0.85rem 1.75rem;
        border-radius: 30px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: var(--shadow-md);
        transition: var(--transition);
    }
        .tab-btn:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }
        .tab-btn.active { background: var(--primary); color: #ffffff; border-color: var(--primary); box-shadow: 0 4px 15px rgba(178, 34, 34, 0.3); }

        .prompt-box {
        text-align: center;
        background: var(--surface);
        padding: 3.5rem 2rem;
        border-radius: var(--radius-md);
        border: 2px dashed var(--border-color);
        max-width: 600px;
        margin: 2rem auto;
    }
        .prompt-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .prompt-box h3 { font-size: 1.3rem; color: var(--secondary); margin-bottom: 0.5rem; }
        .prompt-box p { color: var(--text-muted); font-size: 0.95rem; }

        .menu-container { padding-top: 1rem; }
        .columnas-menu { display: grid; grid-template-columns: 1fr; max-width: 750px; margin: 0 auto; }

        .seccion-card {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: 1.75rem;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--border-color);
    }

        .seccion-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 1.5rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.75rem;
    }
        .seccion-header h2 { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--primary); }

        .item-card {
        display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #edf2f7;
    }
        .item-card:last-child { border-bottom: none; }

        .foto-item { width: 75px; height: 75px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; background-color: #edf2f7; }
        .item-info { flex-grow: 1; }
        .item-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.25rem; }
        .item-header h3 { font-size: 1.05rem; font-weight: 600; color: var(--secondary); }

        .precio {
        font-weight: 700; color: var(--primary); font-size: 0.95rem;
        background: #fff5f5; padding: 0.2rem 0.5rem; border-radius: 6px; white-space: nowrap;
    }
        .item-info p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.5rem; }

        .btn-add {
        background: var(--bg-body); color: var(--secondary); border: 1px solid var(--border-color);
        padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: var(--transition);
    }
        .btn-add:hover { background: var(--primary); color: #ffffff; border-color: var(--primary); }

        .no-results { text-align: center; padding: 3rem; color: var(--text-muted); }

        /* BARRA FLOTANTE */
        .order-bar { position: fixed; bottom: 1.5rem; left: 0; right: 0; z-index: 100; pointer-events: none; }
        .order-bar-content {
        pointer-events: auto; background: var(--secondary); color: #ffffff; padding: 0.85rem 1.5rem;
        border-radius: 50px; display: flex; align-items: center; justify-content: space-between;
        box-shadow: var(--shadow-lg); max-width: 600px; margin: 0 auto;
    }
        .order-info { display: flex; align-items: center; gap: 1rem; }
        .cart-icon { font-size: 1.3rem; background: rgba(255, 255, 255, 0.15); padding: 0.4rem 0.6rem; border-radius: 50%; }
        .order-info span { display: block; font-size: 0.8rem; color: #a0aec0; }
        .order-info strong { font-size: 1.05rem; color: #ffffff; }

        .btn-order {
        background: var(--primary); color: #ffffff; border: none; padding: 0.6rem 1.25rem;
        border-radius: 30px; font-weight: 600; cursor: pointer; transition: var(--transition);
    }
        .btn-order:hover { background: var(--primary-dark); }

        /* MODAL */
        .modal {
        display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); z-index: 200; justify-content: center; align-items: center; padding: 1rem;
    }
        .modal-content { background: var(--surface); width: 100%; max-width: 480px; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden; }
        .modal-header { padding: 1.25rem; background: var(--bg-body); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); }
        .modal-header h3 { font-size: 1.2rem; color: var(--secondary); }
        .close-modal { background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; }
        .modal-body { padding: 1.25rem; max-height: 60vh; overflow-y: auto; }

        .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); }
        .unit-price { font-size: 0.8rem; color: var(--text-muted); }
        .qty-controls { display: flex; align-items: center; gap: 0.5rem; background: var(--bg-body); padding: 0.25rem 0.5rem; border-radius: 20px; }
        .qty-controls button { background: var(--surface); border: 1px solid var(--border-color); width: 26px; height: 26px; border-radius: 50%; cursor: pointer; font-weight: 600; }

        .cart-summary { display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; padding-top: 1rem; border-top: 2px dashed var(--border-color); }
        .cart-summary strong { font-size: 1.3rem; color: var(--primary); }

        .form-group { margin-top: 1.25rem; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--secondary); }
        .form-group input { width: 100%; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); outline: none; }

        .modal-footer { padding: 1.25rem; border-top: 1px solid var(--border-color); }
        .btn-whatsapp {
        width: 100%; background: #25d366; color: #ffffff; border: none; padding: 0.85rem;
        border-radius: 30px; font-weight: 600; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    }
        .btn-whatsapp:hover { background: #1da851; }

        .hidden { display: none !important; }
        footer { text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem; margin-top: 4rem; }
    </style>
</head>
<body>

<header class="hero">
    <div class="container">
        <span class="brand-badge">🍽️ Gastronomía Tradicional</span>
        <h1>Restaurante A Comer</h1>
        <p>Selecciona una categoría para ver nuestra oferta del día</p>

        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Buscar un platillo (ej. Pollo, Pisca, Pabellón)..." onkeyup="filtrarPlatos()">
                <button id="clearSearch" class="clear-btn" onclick="limpiarBuscador()">✕</button>
        </div>
    </div>
</header>

<nav class="category-tabs-container">
    <div class="container category-tabs">
        <button class="tab-btn" id="tabDesayunos" onclick="mostrarCategoria('desayunos')">
            ☀️ Desayunos
        </button>
        <button class="tab-btn" id="tabAlmuerzos" onclick="mostrarCategoria('almuerzos')">
            🍴 Almuerzos Ejecutivos
        </button>
    </div>
</nav>

<main class="container menu-container">

    <div id="initialPrompt" class="prompt-box">
        <div class="prompt-icon">👈</div>
        <h3>¡Bienvenido a Restaurante A Comer!</h3>
        <p>Por favor presiona <strong>Desayunos</strong> o <strong>Almuerzos Ejecutivos</strong> arriba para desplegar los platos disponibles.</p>
    </div>

    <div id="noResults" class="hidden no-results">
        <h3>No se encontraron platillos</h3>
        <p>Intenta buscando con otro término o cambiando de categoría.</p>
    </div>

    <div class="columnas-menu">

        <!-- SECCIÓN DESAYUNOS -->
        <section class="seccion-card hidden" id="desayunosSec">
            <div class="seccion-header">
                <h2>☀️ Desayunos</h2>
            </div>

            <div class="item-card" data-category="desayunos" data-title="tortillas de jamon y queso">
                <img src="https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&q=80&w=200" alt="Tortilla" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>Tortillas de Jamón y Queso</h3>
                            <span class="precio">6.000 COP</span>
                        </div>
                        <p>Suave tortilla de huevos batidos rellena de jamón de pavo y abundante queso fundido.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Tortilla de Jamón y Queso', 6000)">+ Agregar</button>
                    </div>
            </div>

            <div class="item-card" data-category="desayunos" data-title="tortillas de pollo mechado">
                <img src="https://cdn3.myrealfood.app/s3-myrealfood/recipes/1JvkKcsoSgo7lzGtMh5A/main_1652384283508.jpg" alt="Pollo" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>tortillas de Pollo Mechado</h3>
                            <span class="precio">6.500 COP</span>
                        </div>
                        <p>Jugoso pollo sazonado y desmenuzado, servido con arepitas calientes o pan tostado.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Pollo Mechado', 6500)">+ Agregar</button>
                    </div>
            </div>

            <div class="item-card" data-category="desayunos" data-title="huevos fritos">
                <img src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=200" alt="Huevos" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>Huevos Fritos</h3>
                            <span class="precio">6.000 COP</span>
                        </div>
                        <p>Dos huevos frescos fritos al gusto, acompañados de tostadas y mantequilla.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Huevos Fritos', 6000)">+ Agregar</button>
                    </div>
            </div>

            <div class="item-card" data-category="desayunos" data-title="pisca andina">
                <img src="https://primalwellness.coach/wp-content/uploads/2023/11/Pisca-Andina-1-819x1024.jpg" alt="Pisca" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>Pisca Andina</h3>
                            <span class="precio">6.500 COP</span>
                        </div>
                        <p>Sopa tradicional a base de caldo con leche, cilantro, papas, huevo escalfado y queso blanco fresco.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Pisca Andina', 6500)">+ Agregar</button>
                    </div>
            </div>

            <div class="item-card" data-category="desayunos" data-title="tajadas con queso">
                <img src="https://tofuu.getjusto.com/orioneat-local/resized2/YMy46q3CsGA7dyREC-300-x.webp" alt="Tajadas" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>Tajadas con Queso</h3>
                            <span class="precio">6.000 COP</span>
                        </div>
                        <p>Plátano maduro frito cortado en lonjas doradas, cubiertas de abundante queso blanco rallado.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Tajadas con Queso', 14.000cop)">+ Agregar</button>
                    </div>
            </div>
        </section>

        <!-- SECCIÓN ALMUERZOS -->
        <section class="seccion-card hidden" id="almuerzosSec">
            <div class="seccion-header">
                <h2>🍴 Almuerzos Ejecutivos</h2>
            </div>

            <div class="item-card" data-category="almuerzos" data-title="pollo rebozado">
                <img src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=200" alt="Rebozado" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>Pollo Rebozado</h3>
                            <span class="precio">14.000 COP</span>
                        </div>
                        <p>Crocantes trozos de pollo dorados y crujientes, acompañados de contornos a elección.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Pollo Rebozado', 7000)">+ Agregar</button>
                    </div>
            </div>

            <div class="item-card" data-category="almuerzos" data-title="pollo al horno">
                <img src="https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=200" alt="Horno" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>Pollo al Horno</h3>
                            <span class="precio">14.000 COP</span>
                        </div>
                        <p>Jugosa pieza de pollo horneada a fuego lento con finas hierbas y especias.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Pollo al Horno', 14000)">+ Agregar</button>
                    </div>
            </div>

            <div class="item-card" data-category="almuerzos" data-title="pechuga a la plancha">
                <img src="https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=200" alt="Plancha" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>Pechuga a la Plancha</h3>
                            <span class="precio">7.000 COP</span>
                        </div>
                        <p>Tierna pechuga de pollo desgrasada, dorada a la plancha con un toque de ajo y perejil.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Pechuga a la Plancha', 7000)">+ Agregar</button>
                    </div>
            </div>

            <div class="item-card" data-category="almuerzos" data-title="chuleta ahumada">
                <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200" alt="Chuleta" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>Chuleta Ahumada</h3>
                            <span class="precio">14.000 COP</span>
                        </div>
                        <p>Jugosa chuleta de cerdo ahumada y sellada a la plancha.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Chuleta Ahumada', 14000)">+ Agregar</button>
                    </div>
            </div>

            <div class="item-card" data-category="almuerzos" data-title="pescado frito">
                <img src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=200" alt="Pescado" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>Pescado Frito</h3>
                            <span class="precio">16.000 COP</span>
                        </div>
                        <p>Filete de pescado fresco sazonado, empanizado y frito hasta quedar crujiente.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Pescado Frito', 16000)">+ Agregar</button>
                    </div>
            </div>

            <div class="item-card" data-category="almuerzos" data-title="pabellon criollo">
                <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200" alt="Pabellon" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>Pabellón Criollo</h3>
                            <span class="precio">14.000 COP</span>
                        </div>
                        <p>El plato tradicional: carne desmechada, caraotas negras, arroz blanco y tajadas de plátano maduro.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Pabellón Criollo', 14000)">+ Agregar</button>
                    </div>
            </div>

            <div class="item-card" data-category="almuerzos" data-title="callos a la madrileña">
                <img src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=200" alt="Callos" class="foto-item">
                    <div class="item-info">
                        <div class="item-header">
                            <h3>Callos a la Madrileña</h3>
                            <span class="precio">13.000 COP</span>
                        </div>
                        <p>Guiso tradicional de tripa de res con chorizo, morcilla y un toque sutil de picante.</p>
                        <button class="btn-add" onclick="agregarAlPedido('Callos a la Madrileña', 13000)">+ Agregar</button>
                    </div>
            </div>
        </section>

    </div>

</main>

<!-- BARRA FLOTANTE -->
<div id="orderBar" class="order-bar hidden">
    <div class="container order-bar-content">
        <div class="order-info">
            <div class="cart-icon">🛒</div>
            <div>
                <span id="orderCount">0 ítems</span>
                <strong id="orderTotal">0 COP</strong>
            </div>
        </div>
        <button class="btn-order" onclick="abrirModal()">Ver Pedido &rarr;</button>
    </div>
</div>

<!-- MODAL -->
<div id="orderModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>🧾 Resumen del Pedido</h3>
            <button class="close-modal" onclick="cerrarModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div id="cartItemsList"></div>
            <div class="cart-summary">
                <span>Total:</span>
                <strong id="modalTotal">0 COP</strong>
            </div>
            <div class="form-group">
                <label for="tableName">Ubicación / Mesa o Nombre:</label>
                <input type="text" id="tableName" placeholder="Ej: Mesa 3 o Para llevar - María">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn-whatsapp" onclick="enviarWhatsApp()">📲 Enviar Pedido a WhatsApp</button>
        </div>
    </div>
</div>

<footer>
    <p>&copy; 2026 Restaurante A Comer. Todos los derechos reservados.</p>
</footer>

<script>
    var categoriaActiva = null;
    var pedido = [];

    function mostrarCategoria(cat) {
    categoriaActiva = cat;

    var tabDesayunos = document.getElementById('tabDesayunos');
    var tabAlmuerzos = document.getElementById('tabAlmuerzos');
    var desayunosSec = document.getElementById('desayunosSec');
    var almuerzosSec = document.getElementById('almuerzosSec');
    var promptBox = document.getElementById('initialPrompt');

    tabDesayunos.classList.remove('active');
    tabAlmuerzos.classList.remove('active');

    if (cat === 'desayunos') {
    tabDesayunos.classList.add('active');
    desayunosSec.classList.remove('hidden');
    almuerzosSec.classList.add('hidden');
} else if (cat === 'almuerzos') {
    tabAlmuerzos.classList.add('active');
    almuerzosSec.classList.remove('hidden');
    desayunosSec.classList.add('hidden');
}

    if (promptBox) {
    promptBox.classList.add('hidden');
}

    var input = document.getElementById('searchInput');
    if (input && input.value !== '') {
    input.value = '';
    filtrarPlatos();
}
}

    function agregarAlPedido(nombre, precio) {
    var existente = pedido.find(function(item) {
    return item.nombre === nombre;
});

    if (existente) {
    existente.cantidad += 1;
} else {
    pedido.push({ nombre: nombre, precio: precio, cantidad: 1 });
}

    actualizarBarraPedido();
}

    function actualizarBarraPedido() {
    var bar = document.getElementById('orderBar');
    var countEl = document.getElementById('orderCount');
    var totalEl = document.getElementById('orderTotal');

    var totalCantidad = 0;
    var totalMonto = 0;

    for (var i = 0; i < pedido.length; i++) {
    totalCantidad += pedido[i].cantidad;
    totalMonto += (pedido[i].precio * pedido[i].cantidad);
}

    if (totalCantidad > 0) {
    bar.classList.remove('hidden');
    countEl.textContent = totalCantidad + (totalCantidad === 1 ? ' platillo' : ' platillos');
    totalEl.textContent = totalMonto.toLocaleString('es-CO') + ' COP';
} else {
    bar.classList.add('hidden');
}
}

    function abrirModal() {
    var modal = document.getElementById('orderModal');
    var lista = document.getElementById('cartItemsList');
    var totalEl = document.getElementById('modalTotal');

    lista.innerHTML = '';
    var totalMonto = 0;

    for (var i = 0; i < pedido.length; i++) {
    var item = pedido[i];
    totalMonto += (item.precio * item.cantidad);

    var div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML =
    '<div>' +
    '<strong>' + item.nombre + '</strong>' +
    '<div class="unit-price">' + item.precio.toLocaleString('es-CO') + ' COP c/u</div>' +
    '</div>' +
    '<div class="qty-controls">' +
    '<button onclick="cambiarCantidad(' + i + ', -1)">-</button>' +
    '<span>' + item.cantidad + '</span>' +
    '<button onclick="cambiarCantidad(' + i + ', 1)">+</button>' +
    '</div>';

    lista.appendChild(div);
}

    totalEl.textContent = totalMonto.toLocaleString('es-CO') + ' COP';
    modal.style.display = 'flex';
}

    function cambiarCantidad(index, cambio) {
    pedido[index].cantidad += cambio;

    if (pedido[index].cantidad <= 0) {
    pedido.splice(index, 1);
}

    if (pedido.length === 0) {
    cerrarModal();
} else {
    abrirModal();
}

    actualizarBarraPedido();
}

    function cerrarModal() {
    document.getElementById('orderModal').style.display = 'none';
}

    function enviarWhatsApp() {
    if (pedido.length === 0) return;

    var mesa = document.getElementById('tableName').value.trim() || 'No especificada';
    var mensaje = '*¡Hola! Quisiera realizar un pedido en Restaurante A Comer:*\n\n';
    var total = 0;

    for (var i = 0; i < pedido.length; i++) {
    var subtotal = pedido[i].precio * pedido[i].cantidad;
    total += subtotal;
    mensaje += '• ' + pedido[i].cantidad + 'x *' + pedido[i].nombre + '* - $' + subtotal.toLocaleString('es-CO') + ' COP\n';
}

    mensaje += '\n*Total:* $' + total.toLocaleString('es-CO') + ' COP';
    mensaje += '\n*Mesa / Ubicación:* ' + mesa;

    var telefono = "584149767000";
    var url = 'https://wa.me/' + telefono + '?text=' + encodeURIComponent(mensaje);
    window.open(url, '_blank');
}

    function filtrarPlatos() {
    var input = document.getElementById('searchInput');
    var query = input.value.toLowerCase().trim();
    var clearBtn = document.getElementById('clearSearch');
    var noResults = document.getElementById('noResults');
    var cards = document.querySelectorAll('.item-card');
    var encontrados = 0;

    if (query !== '') {
    clearBtn.style.display = 'block';
} else {
    clearBtn.style.display = 'none';
}

    for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var titulo = card.getAttribute('data-title');
    var cat = card.getAttribute('data-category');

    var coincideCategoria = (categoriaActiva === null || cat === categoriaActiva);
    var coincideBusqueda = titulo.includes(query);

    if (coincideCategoria && coincideBusqueda) {
    card.style.display = 'flex';
    encontrados++;
} else {
    card.style.display = 'none';
}
}

    if (categoriaActiva !== null && encontrados === 0) {
    noResults.classList.remove('hidden');
} else {
    noResults.classList.add('hidden');
}
}

    function limpiarBuscador() {
    var input = document.getElementById('searchInput');
    input.value = '';
    filtrarPlatos();
}
</script>
</body>
</html>