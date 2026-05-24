const PRECIOS_EXTRA = {
    pequeno: 0,
    mediano: 50,
    grande: 100,
    doble: 80,
};

function obtenerProductoBase() {
    const slug = document.getElementById('productoSlug')?.value;
    const precioEl = document.getElementById('totalPrecio');
    const match = precioEl?.textContent.match(/RD\$(\d+)/);
    const precioBase = match ? Number(match[1]) : 0;
    return { slug, precioBase };
}

function calcularTotal() {
    const { precioBase } = obtenerProductoBase();
    const tamano = document.querySelector('input[name="tamano"]:checked')?.value || 'pequeno';
    const doble = document.querySelector('input[name="extras"][value="doble"]')?.checked;

    let total = precioBase + (PRECIOS_EXTRA[tamano] || 0);
    if (doble) total += PRECIOS_EXTRA.doble;

    document.getElementById('totalPrecio').textContent = `RD$${total}`;
    return total;
}

function actualizarResumen() {
    const presentacion = document.querySelector('input[name="presentacion"]:checked')?.value || 'cono';
    const tamano = document.querySelector('input[name="tamano"]:checked')?.value || 'pequeno';
    const toppings = [...document.querySelectorAll('input[name="toppings"]:checked')].map((el) => el.value);
    const extras = [...document.querySelectorAll('input[name="extras"]:checked')].map((el) => el.value);
    const notas = document.getElementById('notas')?.value.trim();

    const partes = [
        `Tamaño: ${tamano}`,
        `Presentación: ${presentacion}`,
        toppings.length ? `Toppings: ${toppings.join(', ')}` : 'Sin toppings extra',
        extras.length ? `Extras: ${extras.join(', ')}` : null,
        notas ? `Notas: ${notas}` : null,
    ].filter(Boolean);

    document.getElementById('resumenTexto').textContent = partes.join(' · ');
    calcularTotal();
}

const form = document.getElementById('formPersonalizar');

if (form) {
    form.addEventListener('input', actualizarResumen);
    form.addEventListener('change', actualizarResumen);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const { slug, precioBase } = obtenerProductoBase();
        const pedido = {
            producto: slug,
            tamano: document.querySelector('input[name="tamano"]:checked')?.value,
            presentacion: document.querySelector('input[name="presentacion"]:checked')?.value,
            toppings: [...document.querySelectorAll('input[name="toppings"]:checked')].map((el) => el.value),
            extras: [...document.querySelectorAll('input[name="extras"]:checked')].map((el) => el.value),
            notas: document.getElementById('notas')?.value.trim(),
            total: calcularTotal(),
            precioBase,
            fecha: new Date().toISOString(),
        };

        const pedidos = JSON.parse(localStorage.getItem('pedidosSweetFreeze') || '[]');
        pedidos.push(pedido);
        localStorage.setItem('pedidosSweetFreeze', JSON.stringify(pedidos));

        alert(`¡Pedido confirmado! Total: RD$${pedido.total}\nTe lo preparamos como lo pediste.`);
        window.location.href = '/';
    });

    actualizarResumen();
}
