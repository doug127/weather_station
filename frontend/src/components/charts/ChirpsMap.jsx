import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import { api } from "../../api/apiRoutes";

export const ChirpsMap = ({ title }) => {
  const [tileUrl, setTileUrl] = useState(null);

  useEffect(() => {
    const fetchChirpsMap = async () => {
      try {
        const response = await api.get('/chirpsMap');
        setTileUrl(response.data.tileUrl);
      } catch (error) {
        console.error('Error fetching CHIRPS map:', error);
      }
    };
    fetchChirpsMap();
  }, [])

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 md:p-6">
      <MapContainer center={[7.71, 17.93]} zoom={3} style={{ height: '100vh' }}>
        {tileUrl && <TileLayer url={tileUrl} />}
      </MapContainer>
    </div>
  );
}