import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';

// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'file://',  // Para Electron cuando carga archivos locales
  'http://localhost:3000', // Por si necesitas comunicación entre servicios
  'http://127.0.0.1:3000',
  'https://w0glr2td-3000.uks1.devtunnels.ms',
  'https://w0glr2td-8000.uks1.devtunnels.ms',
  'https://w0glr2td-5173.uks1.devtunnels.ms'
  ];

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // permite requests sin origen (ej: curl, Postman)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());

// Rutas
app.use('/api', routes);

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        service: 'node-backend',
        timestamp: new Date().toISOString(),
        port: PORT,
        host: HOST
    });
});

try {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running at http://127.0.0.1:${PORT}`);
  });
} catch (error) {
  console.error('Server error:', error);
}
