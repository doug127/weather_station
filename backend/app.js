import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
<<<<<<< HEAD
  origin: 'http://localhost:5173', 
  credentials: true,
=======
  origin: 'http://localhost:5173',
  credentials: true
>>>>>>> 9c59a07bf16529c233edbb7fd36a15211024d0c7
}));
app.use(express.json());

// Rutas
app.use('/api', routes);


try {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Server error:', error);
}