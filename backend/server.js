const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { engine } = require('express-handlebars');
const conexion = require('./conexion.js');
const { categorias, productos, masVendidos, buscarProducto, estrellasHtml } = require('./data/productos.js');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const raizProyecto = path.join(__dirname, '..');

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(raizProyecto, 'views', 'layouts'),
        partialsDir: path.join(raizProyecto, 'views', 'partials'),
    })
);

app.set('view engine', 'hbs');
app.set('views', path.join(raizProyecto, 'views'));

app.use(cors());
app.use(express.json());

function conEstrellas(lista) {
    return lista.map((item) => ({
        ...item,
        estrellasHtml: item.estrellas ? estrellasHtml(item.estrellas) : '',
    }));
}

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Sweet Freeze - Heladería',
        layout: 'main',
        categorias,
        productos: conEstrellas(productos),
        masVendidos,
    });
});

app.get('/personalizar/:slug', (req, res) => {
    const producto = buscarProducto(req.params.slug, req.query.lista);

    if (!producto) {
        return res.redirect('/');
    }

    const nombreCompleto = producto.nombreCompleto
        || (producto.titulo && producto.nombre && !producto.nombre.includes('Ice cream')
            ? `${producto.titulo} ${producto.nombre}`
            : producto.nombre);

    res.render('personalizar', {
        title: `Personalizar ${nombreCompleto} - Sweet Freeze`,
        layout: 'main',
        scriptPersonalizar: true,
        producto: {
            slug: producto.slug,
            nombreCompleto,
            precio: producto.precio,
            imagen: producto.imagen,
        },
    });
});

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Iniciar Sesión - Sweet Freeze',
        layout: 'auth',
    });
});

app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Registro - Sweet Freeze',
        layout: 'auth',
    });
});

app.use(express.static(path.join(raizProyecto, 'Frontend')));

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    if (password.length < 6) {
        return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO usuarios (email, password) VALUES (?, ?)';

        conexion.query(sql, [email, hash], (error) => {
            if (error) {
                console.error(error);

                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ mensaje: 'El correo ya está registrado' });
                }

                return res.status(500).json({ mensaje: 'Error interno del servidor' });
            }

            res.status(201).json({ mensaje: '¡Usuario registrado con éxito!' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const sql = 'SELECT id, email, password FROM usuarios WHERE email = ? LIMIT 1';

    conexion.query(sql, [email], async (error, filas) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }

        if (filas.length === 0) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
        }

        const usuario = filas[0];

        try {
            const coincide = await bcrypt.compare(password, usuario.password);

            if (!coincide) {
                return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
            }

            res.json({
                mensaje: 'Inicio de sesión exitoso',
                usuario: { id: usuario.id, email: usuario.email },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
