const ES_ARCHIVO_LOCAL = window.location.protocol === 'file:';
const API_URL = ES_ARCHIVO_LOCAL ? 'http://localhost:3000' : window.location.origin;

function irA(ruta) {
    const destino = ES_ARCHIVO_LOCAL ? `http://localhost:3000${ruta}` : ruta;
    window.location.href = destino;
}

async function enviarFormulario(endpoint, email, password) {
    const respuesta = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Ocurrió un error');
    }

    return datos;
}

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            const datos = await enviarFormulario('/login', email, password);

            if (datos.usuario) {
                localStorage.setItem('usuarioSweetFreeze', JSON.stringify(datos.usuario));
            }

            alert(datos.mensaje);
            irA('/');
        } catch (error) {
            alert(error.message);
        }
    });
}

const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const datos = await enviarFormulario('/register', email, password);
            alert(datos.mensaje);
            irA('/login');
        } catch (error) {
            alert(error.message);
        }
    });
}
