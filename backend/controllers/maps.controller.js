import ee from "@google/earthengine";
import { GoogleAuth } from "google-auth-library";
import path from "path";
import fs from "fs";

const SERVICE_ACCOUNT_KEY = path.resolve('utils/private-key.json');

async function initEE () {
    const privateKey = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_KEY, 'utf8'));

    return new Promise((resolve, reject) => {
        ee.data.authenticateViaPrivateKey(privateKey, () => {
            ee.initialize(null, null, () => {
                console.log("Earth Engine initialized");
                resolve();
            }, reject);
        }, reject);
    });
};

export const getChirpsMap = async (req, res) => {
  try {
    await initEE();

    const dataset = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
      .filter(ee.Filter.date('2018-05-01', '2018-05-02'));
    const precipitation = dataset.select('precipitation').mean(); // convertimos a imagen única

    const visParams = {
      min: 1,
      max: 17,
      palette: ['001137', '0aab1e', 'e7eb05', 'ff4a2d', 'e90000'],
    };

    // Generar URL de descarga temporal
    const url = precipitation.getDownloadURL({
      name: 'chirps_image',
      scale: 5000, // ajusta la resolución
      region: [-180, -90, 180, 90], // bounding box mundial
      format: 'png',
      min: visParams.min,
      max: visParams.max,
      palette: visParams.palette
    });

    res.json({ downloadUrl: url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo datos de CHIRPS' });
  }
};
