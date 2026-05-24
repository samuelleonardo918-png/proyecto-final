const categorias = [
    { slug: 'frutales', nombre: 'Frutales', imagen: '/img/categorias/frutales.jpg' },
    { slug: 'chocolates', nombre: 'Chocolates', imagen: '/img/categorias/chocolate.jpg' },
    { slug: 'especiales', nombre: 'Especiales', imagen: '/img/categorias/especiales.jpg' },
    { slug: 'frutos-rojos', nombre: 'Frutos Rojos', imagen: '/img/categorias/frutos-rojos.jpg' },
    { slug: 'cookies', nombre: 'Cookies', imagen: '/img/categorias/cookies.jpg' },
    { slug: 'pistacho', nombre: 'Pistacho', imagen: '/img/categorias/pistacho.jpg' },
];

const productos = [
    { slug: 'fresa', nombre: 'FRESA', titulo: 'Ice cream', precio: 450, estrellas: 5, imagen: '/img/productos/fresa.jpg', imagenHover: '/img/productos/fresa-hover.jpg' },
    { slug: 'chocolate', nombre: 'CHOCOLATE', titulo: 'Ice cream', precio: 200, estrellas: 3, imagen: '/img/productos/chocolate.jpg', imagenHover: '/img/productos/chocolate-hover.jpg' },
    { slug: 'mango', nombre: 'MANGO', titulo: 'Ice cream', precio: 135, estrellas: 5, imagen: '/img/productos/mango.jpg', imagenHover: '/img/productos/mango-hover.jpg' },
    { slug: 'cookies-cream', nombre: 'Cream', titulo: 'Cookies and', precio: 189, estrellas: 5, imagen: '/img/productos/cookies.jpg', imagenHover: '/img/productos/cookies-hover.jpg', subtitulo: true },
    { slug: 'vainilla', nombre: 'VAINILLA', titulo: 'Ice cream', precio: 175, estrellas: 4, imagen: '/img/productos/vainilla.jpg', imagenHover: '/img/productos/vainilla-hover.jpg' },
    { slug: 'frambuesa', nombre: 'FRAMBUESA', titulo: 'Ice cream', precio: 160, estrellas: 5, imagen: '/img/productos/frambuesa.jpg', imagenHover: '/img/productos/frambuesa-hover.jpg' },
    { slug: 'pistacho', nombre: 'PISTACHO', titulo: 'Ice cream', precio: 195, estrellas: 5, imagen: '/img/productos/pistacho.jpg', imagenHover: '/img/productos/pistacho-hover.jpg' },
];

const pinaProducto = {
    slug: 'pina',
    nombre: 'PIÑA',
    titulo: 'Ice cream',
    precio: 300,
    estrellas: 5,
    imagen: '/img/productos/pina.jpg',
    imagenHover: '/img/productos/pina-hover.jpg',
};

if (!productos.find((p) => p.slug === 'pina')) {
    productos.push(pinaProducto);
}

const masVendidos = [
    { slug: 'vainilla', nombre: 'Ice cream de Vainilla', nombreCompleto: 'Ice cream de Vainilla', precio: 400, imagen: '/img/productos/vainilla.jpg', imagenHover: '/img/productos/vainilla-hover.jpg' },
    { slug: 'chocolate', nombre: 'Ice cream de Chocolate', nombreCompleto: 'Ice cream de Chocolate', precio: 300, imagen: '/img/productos/chocolate.jpg', imagenHover: '/img/productos/chocolate-hover.jpg' },
    { slug: 'fresa', nombre: 'Ice cream de Fresa', nombreCompleto: 'Ice cream de Fresa', precio: 600, imagen: '/img/productos/fresa.jpg', imagenHover: '/img/productos/fresa-hover.jpg' },
    { slug: 'pina', nombre: 'Ice cream de Piña', nombreCompleto: 'Ice cream de Piña', precio: 300, imagen: '/img/productos/pina.jpg', imagenHover: '/img/productos/pina-hover.jpg' },
    { slug: 'caramelo', nombre: 'Ice cream de Caramelo', nombreCompleto: 'Ice cream de Caramelo', precio: 350, imagen: '/img/productos/caramelo.jpg', imagenHover: '/img/productos/caramelo-hover.jpg' },
];

const catalogo = [...productos, ...masVendidos];

function buscarProducto(slug, origen) {
    const normal = productos.find((p) => p.slug === slug);
    const vendido = masVendidos.find((p) => p.slug === slug);

    if (origen === 'mas-vendidos' && vendido) {
        return { ...normal, ...vendido };
    }

    return normal || vendido || null;
}

function estrellasHtml(cantidad) {
    const llenas = '★'.repeat(cantidad);
    const vacias = '☆'.repeat(5 - cantidad);
    return llenas + vacias;
}

module.exports = { categorias, productos, masVendidos, buscarProducto, estrellasHtml };
