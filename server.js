const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json()); // Middleware para analizar JSON
app.use(express.static(path.join(__dirname)));

// Ruta existente para guardar datos en answers.json (acumula en un array)
app.post('/save-answers', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'answers.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        let json = [];

        if (!err && data) {
            try {
                json = JSON.parse(data);
            } catch (e) {
                console.error('Error al analizar el JSON existente:', e);
                return res.status(500).send('Error al analizar el JSON existente');
            }
        }

        if (!Array.isArray(json)) {
            json = []; // Aseguramos que sea un array
        }

        json.push(req.body);

        fs.writeFile(filePath, JSON.stringify(json, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar el archivo:', err);
                return res.status(500).send('Error al guardar el archivo');
            }
            res.send('Archivo guardado con éxito');
        });
    });
});

// NUEVA RUTA para sobrescribir teams.json
app.post('/save-teams', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'teams.json');

    // Sobrescribe directamente el archivo con el contenido recibido
    fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar el archivo:', err);
            return res.status(500).send('Error al guardar el archivo');
        }
        res.send('Archivo guardado con éxito');
    });
});

// Actualizar registros o modificar answers.json
app.put('/update-answer/:id', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'answers.json');
    const id = req.params.id;
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error al leer el archivo');
        }

        let json = [];
        try {
            json = JSON.parse(data);
        } catch (e) {
            console.error('Error al analizar el JSON existente:', e);
            return res.status(500).send('Error al analizar el JSON existente');
        }

        // Buscar el índice del objeto con el id proporcionado
        const index = json.findIndex(item => item.id === id);
        if (index === -1) {
            return res.status(404).send('No se encontró el registro con el ID proporcionado');
        }

        // Actualizar solo las claves proporcionadas en req.body
        json[index] = { ...json[index], ...req.body };

        fs.writeFile(filePath, JSON.stringify(json, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar el archivo:', err);
                return res.status(500).send('Error al guardar el archivo');
            }
            res.send('Registro actualizado con éxito');
        });
    });
});

// Ruta para abrir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://127.0.0.1:${PORT}`);
});