// Datos del menú (simulados - luego se reemplazará con datos del backend)
const menuItems = [
    { id: 1, name: 'Hamburguesa', category: 'comida', price: 1500, desc: 'Hamburguesa con queso y papas', icon: '🍔' },
    { id: 2, name: 'Pizza', category: 'comida', price: 2000, desc: 'Pizza muzzarella grande', icon: '🍕' },
    { id: 3, name: 'Milanesa', category: 'comida', price: 1800, desc: 'Milanesa con ensalada', icon: '🍖' },
    { id: 4, name: 'Coca Cola', category: 'bebida', price: 500, desc: 'Gaseosa 500ml', icon: '🥤' },
    { id: 5, name: 'Cerveza', category: 'bebida', price: 600, desc: 'Cerveza artesanal', icon: '🍺' },
    { id: 6, name: 'Jugo Natural', category: 'bebida', price: 400, desc: 'Jugo de naranja exprimido', icon: '🧃' },
    { id: 7, name: 'Helado', category: 'postre', price: 800, desc: 'Helado 2 bochas', icon: '🍨' },
    { id: 8, name: 'Flan', category: 'postre', price: 700, desc: 'Flan casero con dulce de leche', icon: '🍮' }
];

// Variables globales
let cart = [];
let selectedPayment = null;
let orderType = null;
let completedOrders = [];

// Función para cambiar entre pantallas
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}



// ========== FUNCIONES DE LOGIN ==========

function login() {
    // Esta función simula un login real para usuarios registrados (delivery)
    const user = document.getElementById('username').value;
    if (!user) {
        alert('Por favor, ingresa tu usuario y contraseña.');
        return;
    }

    // (Aquí iría la lógica futura de validación con el backend)

    alert(`¡Bienvenido de nuevo, ${user}! `);
    showMenu(); // Llevamos al menú
}

// NUEVA FUNCIÓN para el Totem (Ingreso como invitado)
function loginAsGuest() {
    // Esta función simplemente salta al menú
    console.log("Ingresando como invitado (Totem)");
    showMenu();
}

function showRegister() {
    alert('Funcionalidad de registro - próximamente');
}

// FUNCION LOGOUTT
function logOut() {
    // 1. Reiniciamos todas las variables globales
    cart = [];
    selectedPayment = null;
    orderType = null;

    // 2. Actualizamos el contador del carrito en la UI
    updateCartCount(); // Esto lo pondrá en 0

    // 3. Limpiamos los campos de formularios
    document.getElementById('deliveryAddress').value = '';
    document.getElementById('deliveryPhone').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    // 4. Mostramos la pantalla de login
    showScreen('loginScreen');
}

// ========== FUNCIONES DEL MENÚ ==========
function showMenu() {
    showScreen('menuScreen');
    renderMenu('all');
}

function filterCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderMenu(category);
}

function renderMenu(category) {
    const grid = document.getElementById('menuGrid');
    const filtered = category === 'all' ? menuItems : menuItems.filter(i => i.category === category);

    grid.innerHTML = filtered.map(item => `
        <div class="menu-item">
            <div class="item-img">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-desc">${item.desc}</div>
            <div class="item-price">$${item.price}</div>
            <button class="add-btn" onclick="addToCart(${item.id})">Agregar al Carrito</button>
        </div>
    `).join('');
}

// ========== FUNCIONES DEL CARRITO ==========
function addToCart(itemId) {
    // 1. Revisa si el item ya está en el carrito
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        // 2. Si existe, solo incrementa la cantidad
        existingItem.quantity++;
    } else {
        // 3. Si no existe, busca los detalles y lo añade con cantidad 1
        const item = menuItems.find(i => i.id === itemId);
        cart.push({ ...item, quantity: 1 }); // Añadimos la propiedad 'quantity'
    }

    updateCartCount();
}

function updateCartCount() {
    // Suma la 'quantity' de todos los items en el carrito
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalCount;
}

function showCart() {
    showScreen('cartScreen');
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItems');
    // CÁLCULO CORREGIDO: Multiplica precio * cantidad para el total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;">Tu carrito está vacío</p>';
    } else {
        container.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div style="font-size:30px;">${item.icon}</div>
                    <div>
                        <strong>${item.name}</strong>
                        <div style="font-size: 14px; color: #555;">Cantidad: ${item.quantity}</div>
                    </div>
                    <div style="color:#ff6b6b;font-weight:600;">$${item.price * item.quantity}</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Eliminar</button>
            </div>
        `).join('');
    }

    // Asigna el total corregido
    document.getElementById('cartTotal').textContent = `$${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
}

// ========== FUNCIONES DE PAGO ==========
function showPayment() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    showScreen('paymentScreen');
    // CÁLCULO CORREGIDO: Multiplica precio * cantidad
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('paymentTotal').textContent = `$${total}`;
}

function selectPayment(method) {
    selectedPayment = method;
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
    event.target.closest('.payment-option').classList.add('selected');
}

// ========== FUNCIONES DE TIPO DE PEDIDO ==========
function showOrderType() {
    if (!selectedPayment) {
        alert('Por favor selecciona un método de pago');
        return;
    }
    showScreen('orderTypeScreen');
}

function selectOrderType(type) {
    orderType = type;
    document.querySelectorAll('.order-type-card').forEach(card => card.classList.remove('selected'));
    event.target.closest('.order-type-card').classList.add('selected');

    const deliveryForm = document.getElementById('deliveryForm');
    if (type === 'delivery') {
        deliveryForm.classList.add('active');
    } else {
        deliveryForm.classList.remove('active');
    }
}

// ========== FUNCIÓN DE CONFIRMACIÓN DE PEDIDO ==========
function confirmOrder() {
   
    if (!orderType) {
        alert('Por favor selecciona el tipo de pedido');
        return;
    }

    if (orderType === 'delivery') {
        const address = document.getElementById('deliveryAddress').value;
        const phone = document.getElementById('deliveryPhone').value;
        if (!address || !phone) {
            alert('Por favor completa los datos de entrega');
            return;
        }
    }


    const orderNum = Math.floor(Math.random() * 900) + 100;
    // Actualiza el cálculo del total aquí
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = {
        number: orderNum,
        items: [...cart],
        total: total, // Aquí se usa el total corregido
        type: orderType,
        payment: selectedPayment,
        status: 'Listo para retirar',
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };

    completedOrders.push(newOrder);

    document.getElementById('orderNumber').textContent = orderNum;

    const message = orderType === 'delivery'
        ? 'Tu pedido está en camino. Te contactaremos al número proporcionado.'
        : 'Por favor espera tu pedido en el local';
    document.getElementById('confirmationMessage').textContent = message;

    showScreen('confirmationScreen');
}

// ========== FUNCIONES DE PEDIDOS LISTOS ==========
function showOrdersReady() {
    showScreen('ordersReadyScreen');
    renderOrdersReady();
}

function renderOrdersReady() {
    const grid = document.getElementById('ordersGrid');
    const noOrders = document.getElementById('noOrders');

    if (completedOrders.length === 0) {
        grid.innerHTML = '';
        noOrders.style.display = 'block';
    } else {
        noOrders.style.display = 'none';
        grid.innerHTML = completedOrders.map(order => `
            <div class="order-card">
                <div class="order-card-header">
                    <div class="order-card-number">#${order.number}</div>
                    <div class="order-badge">${order.type === 'delivery' ? '🚚 Delivery' : '🍽️ Local'}</div>
                </div>
                <div class="order-card-items">
                    ${order.items.map(item => `
                        <div class="order-card-item">
                            ${item.icon} ${item.quantity}x ${item.name} - $${item.price * item.quantity}
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid rgba(255,255,255,0.3);">
                    <strong>Total: $${order.total}</strong>
                </div>
                <div style="margin-top: 10px; font-size: 14px;">
                    ⏰ ${order.time} | 💳 ${order.payment === 'efectivo' ? 'Efectivo' : 'Débito'}
                </div>
                <div class="order-status">✓ ${order.status}</div>
            </div>
        `).join('');
    }
}

// ========== FUNCIÓN PARA NUEVO PEDIDO ==========
function newOrder() {
    cart = [];
    selectedPayment = null;
    orderType = null;
    updateCartCount();
    document.getElementById('deliveryAddress').value = '';
    document.getElementById('deliveryPhone').value = '';
    showMenu();
}

// Inicialización al cargar la página
renderMenu('all');