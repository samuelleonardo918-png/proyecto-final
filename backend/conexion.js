const path = require('path');
const mysql = require('mysql2');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const conexion = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'proyecto_final',
});

const crearTablaUsuarios = `
    CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

conexion.connect((error) => {
    if (error) {
        console.error('Error de conexión a MySQL:', error.message);
        return;
    }

    console.log('Conectado a MySQL');

    conexion.query(crearTablaUsuarios, (errTabla) => {
        if (errTabla) {
            console.error('Error al preparar la tabla usuarios:', errTabla.message);
            return;
        }

        console.log('Tabla usuarios lista');
    });
});

module.exports = conexion;
