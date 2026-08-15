import express from 'express';
import cors from 'cors';
import serverController from './controllers/ServerController';

const app = express();
const port = 3002; // Porta diferente para nao conflitar com o ATM10

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', serverController);

app.listen(port, () => {
    console.log(`[ATM Lite] Backend API rodando em http://localhost:${port}`);
});
