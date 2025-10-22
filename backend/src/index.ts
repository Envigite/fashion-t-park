import express from 'express';
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../frontend/public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/index.html"));
});

app.use("/dist", express.static(path.join(__dirname, "../../frontend/dist")));

app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/carrito.html"));
});

app.use((req, res) => {
    res.status(404).send('Página no encontrada');
})


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})

