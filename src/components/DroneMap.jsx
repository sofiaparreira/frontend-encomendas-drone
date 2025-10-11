import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FaLocationDot } from 'react-icons/fa6';

// Criando um ícone customizado usando Leaflet
const deliveryIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // ícone de pacote
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});



const DroneMap = ({ destinations, destinationsAddress, droneLocation, base }) => {

    console.log("a", destinationsAddress)
    return (
        <MapContainer
            center={[-23.55052, -46.633308]}
            zoom={13}
            style={{ height: '500px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marcadores dentro do MapContainer */}
            {destinations.map((dest, index) => (
  <Marker key={index} position={[dest.lat, dest.lng]} icon={deliveryIcon}>
    <Popup>
      <strong>Destino {index + 1}</strong><br />
      <span>{destinationsAddress?.[index]?.address || 'Endereço não disponível'}</span>
    </Popup>
  </Marker>
))}


        </MapContainer>
    );
};

export default DroneMap;
