import { insertMeteostatData } from '../controllers/value.controller.js';
import '../models/index.js'; // Para inicializar Sequelize y modelos

(async () => {
  try {
    console.log('⏳ Iniciando carga de datos Meteostat...');

    const req = {
      query: {
        station: '80428',
        start: '2021-01-01',
        end: '2025-06-30'
      },
      body: {
        frequency: 1
      }
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`✅ Status: ${code}`, data);
        }
      })
    };

    await insertMeteostatData(req, res);

    console.log('✅ Proceso completado.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando el seeder:', error);
    process.exit(1);
  }
})();