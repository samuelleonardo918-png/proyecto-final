const CLAVE_SESION = 'usuarioSweetFreeze';

function obtenerSesion() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SESION) || 'null');
    } catch {
        return null;
    }
}

function inicialesDesdeEmail(email) {
    const nombre = email.split('@')[0] || 'U';
    const partes = nombre.replace(/[._-]/g, ' ').trim().split(/\s+/);
    if (partes.length >= 2) {
        return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.slice(0, 2).toUpperCase();
}

function nombreDesdeEmail(email) {
    const base = email.split('@')[0] || 'Usuario';
    return base.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function actualizarBarraNavegacion() {
    const loginItem = document.getElementById('navLoginItem');
    const perfilItem = document.getElementById('navPerfilItem');

    if (!loginItem || !perfilItem) return;

    const usuario = obtenerSesion();

    if (usuario?.email) {
        loginItem.hidden = true;
        perfilItem.hidden = false;

        const avatar = document.getElementById('perfilAvatar');
        const nombre = document.getElementById('perfilNombre');
        const email = document.getElementById('perfilEmail');

        if (avatar) avatar.textContent = inicialesDesdeEmail(usuario.email);
        if (nombre) nombre.textContent = nombreDesdeEmail(usuario.email);
        if (email) email.textContent = usuario.email;
    } else {
        loginItem.hidden = false;
        perfilItem.hidden = true;
    }
}

document.getElementById('btnCerrarSesion')?.addEventListener('click', () => {
    localStorage.removeItem(CLAVE_SESION);
    window.location.href = '/';
});

actualizarBarraNavegacion();
