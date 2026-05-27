const PRECIOS = {
    tamano: { pequeno: 0, mediano: 25, grande: 45 },
    presentacion: { cono: 0, vaso: 0, copa: 10, canasta: 15 },
    topping: 12,
    maxToppings: 36,
    doble: 50,
    paraLlevar: 10,
};

function obtenerPrecioBase() {
    return Number(document.getElementById('precioBase')?.value || 0);
}

function calcularTotal() {
    const precioBase = obtenerPrecioBase();
    const tamano = document.querySelector('input[name="tamano"]:checked')?.value || 'pequeno';
    const presentacion = document.querySelector('input[name="presentacion"]:checked')?.value || 'cono';
    const cantidadToppings = document.querySelectorAll('input[name="toppings"]:checked').length;
    const doble = document.querySelector('input[name="extras"][value="doble"]')?.checked;
    const paraLlevar = document.querySelector('input[name="extras"][value="para-llevar"]')?.checked;

    let extraToppings = cantidadToppings * PRECIOS.topping;
    if (extraToppings > PRECIOS.maxToppings) {
        extraToppings = PRECIOS.maxToppings;
    }

    let total = precioBase
        + (PRECIOS.tamano[tamano] || 0)
        + (PRECIOS.presentacion[presentacion] || 0)
        + extraToppings;

    if (doble) total += PRECIOS.doble;
    if (paraLlevar) total += PRECIOS.paraLlevar;

    document.getElementById('totalPrecio').textContent = `RD$${total}`;
    return total;
}

function actualizarResumenTexto() {
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
}

const form = document.getElementById('formPersonalizar');

if (form) {
    const camposConPrecio = form.querySelectorAll(
        'input[name="tamano"], input[name="presentacion"], input[name="toppings"], input[name="extras"]'
    );

    camposConPrecio.forEach((campo) => {
        campo.addEventListener('change', () => {
            actualizarResumenTexto();
            calcularTotal();
        });
    });

    document.getElementById('notas')?.addEventListener('input', actualizarResumenTexto);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const slug = document.getElementById('productoSlug')?.value;
        const precioBase = obtenerPrecioBase();

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

    actualizarResumenTexto();
    calcularTotal();
}
