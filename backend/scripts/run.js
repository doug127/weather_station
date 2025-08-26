import { now } from 'sequelize/lib/utils';
import { insertMeteostatData } from '../controllers/valuesTimescale.controller.js';
import '../models/index.js';

(async () => {
  try {
    console.log('⏳ Iniciando carga de datos Meteostat...');

    const req = {
      query: {
        station: '80428',
        start: '2021-01-01',
        end: new Date().toISOString().slice(0, 10) 
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