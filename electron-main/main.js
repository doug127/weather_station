// electron-main/main.js
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');

const REACT_INDEX = path.join(__dirname, '..', 'frontend', 'index.html'); // root/frontend/index.html
const REACT_DEV_URL = 'http://127.0.0.1:5173'; // URL del servidor de desarrollo de React
const REACT_CWD = path.join(__dirname, '..', 'frontend'); // carpeta del frontend
const REACT_PORT = 5173;
const REACT_HEALTH_URL = `http://127.0.0.1:${REACT_PORT}`;
const DJANGO_CWD = path.join(__dirname, '..', 'ml_service'); // ruta donde está manage.py
const DJANGO_PORT = 8000;
const DJANGO_CHECK_URL = `http://127.0.0.1:${DJANGO_PORT}/health/`; // Cambiado a /health/
const DJANGO_ROOT = path.join(__dirname, '..');

const NODE_CWD = path.join(__dirname, '..', 'backend'); // root/backend
const NODE_PORT = 3000; // asegúrate que tu backend use este puerto (ver instrucciones abajo)
const NODE_HEALTH_URL = `http://127.0.0.1:${NODE_PORT}/health`; // crearemos este endpoint

// Detect python bin inside venv (Windows vs *nix)
const PYTHON_BIN = process.platform === 'win32'
  ? path.join(DJANGO_CWD, 'venv', 'Scripts', 'python.exe')
  : path.join(DJANGO_CWD, 'venv', 'bin', 'python');

let djangoProc = null;
let nodeProc = null;
let reactProc = null;

async function waitForUrl(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await axios.get(url, { 
        timeout: 2000,
        validateStatus: function (status) {
          // Aceptar cualquier código de estado como válido (incluso 404)
          return status < 500; 
        }
      });
      console.log(`[electron] ${url} respondió con status: ${response.status}`);
      return true;
    } catch (e) {
      // si falla, intenta con localhost
      if (url.includes('127.0.0.1')) {
        try {
          const localhostUrl = url.replace('127.0.0.1', 'localhost');
          const response = await axios.get(localhostUrl, { 
            timeout: 2000,
            validateStatus: function (status) {
              return status < 500;
            }
          });
          console.log(`[electron] ${localhostUrl} respondió con status: ${response.status}`);
          return true;
        } catch (localhostError) {
          // Continuar con el bucle
        }
      }
      
      // Log cada 5 segundos para mostrar progreso
      if ((Date.now() - start) % 5000 < 500) {
        console.log(`[electron] Esperando que ${url} responda... (${Math.round((Date.now() - start) / 1000)}s)`);
      }
      
      await new Promise(r => setTimeout(r, 500)); // espera 0.5s antes del siguiente intento
    }
  }
  throw new Error(`Timeout waiting for ${url}`);
}

function startDjango() {
  const pythonCmd = PYTHON_BIN; // ruta al python del venv
  const args = ['manage.py', 'runserver', `127.0.0.1:${DJANGO_PORT}`];

  console.log('[electron] arrancando Django con:', pythonCmd, args.join(' '));

  const django = spawn(pythonCmd, args, {
    cwd: DJANGO_CWD, // carpeta donde está manage.py
    env: {
      ...process.env,
      DJANGO_SETTINGS_MODULE: 'weather_station.settings', // 👈 la clave
      PYTHONUNBUFFERED: '1' // opcional: ver logs en tiempo real
    }
  });

  django.stdout.on('data', (data) => console.log(`[Django] ${data.toString()}`));
  django.stderr.on('data', (data) => console.error(`[Django] ${data.toString()}`));
  django.on('exit', code => console.log('[electron] Django exited with code', code));

  djangoProc = django;
  return django;
}

function startReactDev() {
  console.log('[electron] arrancando React dev server en:', REACT_CWD);
  const env = { 
    ...process.env, 
    PORT: String(REACT_PORT),
    FORCE_COLOR: '0',
    NO_COLOR: '1'
  };

  const proc = spawn('npm', ['run', 'dev'], {
    cwd: REACT_CWD,
    env,
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
  });

  proc.stdout.on('data', (data) => {
    const output = data.toString().replace(/\x1b\[[0-9;]*m/g, '');
    console.log(`[React Dev] ${output}`);
  });
  
  proc.stderr.on('data', (data) => {
    const output = data.toString().replace(/\x1b\[[0-9;]*m/g, '');
    console.error(`[React Dev Error] ${output}`);
  });

  proc.on('exit', code => console.log('[electron] React dev server exited with code', code));
  reactProc = proc;
  return proc;
}

function startNodeBackend() {
  // arrancamos npm run dev en la carpeta backend -> nodemon ./app.js
  console.log('[electron] arrancando backend Node (npm run dev) en:', NODE_CWD);
  const env = { 
    ...process.env, 
    PORT: String(NODE_PORT),
    FORCE_COLOR: '0', // Deshabilitar colores ANSI
    NO_COLOR: '1'
  };

  // usar shell:true para que "npm run dev" funcione cross-platform
  const proc = spawn('npm', ['run', 'dev'], {
    cwd: NODE_CWD,
    env,
    stdio: ['pipe', 'pipe', 'pipe'], // Cambiar de inherit a pipe para manejar la salida
    shell: true
  });

  // Manejar la salida de manera más limpia
  proc.stdout.on('data', (data) => {
    const output = data.toString().replace(/\x1b\[[0-9;]*m/g, ''); // Limpiar códigos ANSI
    console.log(`[Node Backend] ${output}`);
  });
  
  proc.stderr.on('data', (data) => {
    const output = data.toString().replace(/\x1b\[[0-9;]*m/g, ''); // Limpiar códigos ANSI
    console.error(`[Node Backend Error] ${output}`);
  });

  proc.on('exit', code => console.log('[electron] Node backend exited with code', code));
  nodeProc = proc;
  return proc;
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      webSecurity: false, // para evitar problemas CORS en desarrollo
      contextIsolation: true,
      nodeIntegration: false, // Por seguridad
      enableRemoteModule: false,
      // preload: path.join(__dirname, 'preload.js') // si usas preload, descomenta
    }
  });

  win.maximize();

  // Cargar desde el servidor de desarrollo en lugar del archivo estático
  try {
    await win.loadURL(REACT_HEALTH_URL);
    console.log('[electron] Aplicación React cargada desde servidor de desarrollo');
  } catch (err) {
    console.error('[electron] Error cargando React desde servidor, intentando archivo local:', err);
    await win.loadFile(REACT_INDEX);
  }
  
  // Descomenta para abrir las herramientas de desarrollo
  // win.webContents.openDevTools();
}

app.on('ready', async () => {
  try {
    console.log('[electron] =========================');
    console.log('[electron] Iniciando todos los servicios...');
    console.log('[electron] =========================');

    // 1) Django
    try {
      await waitForUrl(DJANGO_CHECK_URL, 3000);
      console.log('[electron] ✅ Django ya responde en', DJANGO_CHECK_URL);
    } catch (e) {
      console.log('[electron] ❌ Django no responde: arrancando Django localmente');
      startDjango();
      
      console.log('[electron] ⏳ Esperando que Django arranque completamente...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await waitForUrl(DJANGO_CHECK_URL, 30000);
      console.log('[electron] ✅ Django iniciado correctamente');
    }

    // 2) Node backend
    try {
      await waitForUrl(NODE_HEALTH_URL, 3000);
      console.log('[electron] ✅ Node backend ya responde en', NODE_HEALTH_URL);
    } catch (e) {
      console.log('[electron] ❌ Node backend no responde: arrancando backend');
      startNodeBackend();
      
      console.log('[electron] ⏳ Esperando que Node.js arranque completamente...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      await waitForUrl(NODE_HEALTH_URL, 30000);
      console.log('[electron] ✅ Node backend iniciado correctamente');
    }

    // 3) React dev server
    try {
      console.log('[electron] 🔍 Verificando React dev server en', REACT_HEALTH_URL);
      await waitForUrl(REACT_HEALTH_URL, 3000);
      console.log('[electron] ✅ React dev server ya responde en', REACT_HEALTH_URL);
    } catch (e) {
      console.log('[electron] ❌ React dev server no responde: arrancando servidor de desarrollo');
      console.log('[electron] 📁 Carpeta React:', REACT_CWD);
      
      startReactDev();
      
      console.log('[electron] ⏳ Esperando que React dev server arranque completamente...');
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      console.log('[electron] 🔍 Verificando React nuevamente...');
      await waitForUrl(REACT_HEALTH_URL, 45000);
      console.log('[electron] ✅ React dev server iniciado correctamente');
    }

    console.log('[electron] =========================');
    console.log('[electron] Todos los servicios iniciados');
    console.log('[electron] =========================');

  } catch (err) {
    console.error('[electron] Error arrancando servicios:', err);
    dialog.showErrorBox('Error arrancando servicios', `${err.message}`);
    // opcional: app.quit();
  }

  createWindow();
});

app.on('before-quit', () => {
  try { if (djangoProc) djangoProc.kill(); } catch (e) {}
  try { if (nodeProc) nodeProc.kill(); } catch (e) {}
  try { if (reactProc) reactProc.kill(); } catch (e) {}
});