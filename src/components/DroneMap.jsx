import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import droneSvg from '../assets/drone.png';

const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [22, 22],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const droneIcon = L.divIcon({
  className: 'drone-marker',
  html: `
    <div class="pulse-container">
      <div class="pulse-ring"></div>
      <div class="pulse-ring delay-1"></div>
      <div class="pulse-ring delay-2"></div>
      <img src="${droneSvg}" alt="drone" class="drone-icon" />
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

const DroneMap = ({ destinations, destinationsAddress, droneLocation, base }) => {
  const mapCenter = [
    droneLocation?.lat || base?.lat || -19.937, 
    droneLocation?.lng || base?.lng || -43.933, 
  ];

  return (
    <>
      <style>{`
        .drone-marker {
          background: transparent !important;
          border: none !important;
        }

        .pulse-container {
          position: relative;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pulse-ring {
          position: absolute;
          border: 3px solid #3b82f6;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          opacity: 0;
        }

        .pulse-ring.delay-1 {
          animation-delay: 0.5s;
        }

        .pulse-ring.delay-2 {
          animation-delay: 1s;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.1);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        .drone-icon {
          width: 22px;
          height: 22px;
          position: relative;
          z-index: 10;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
      `}</style>
      
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
/>


        {/* Marcadores de destino */}
        {destinations.map((dest, index) => (
          <Marker
            key={index}
            position={[dest.lat, dest.lng]}
            icon={deliveryIcon}
          >
            <Popup>
              <strong>Destino {index + 1}</strong><br />
              <span>{destinationsAddress?.[index]?.address || 'Endereço não disponível'}</span>
            </Popup>
          </Marker>
        ))}

        {/* Marcador do drone com efeito pulsante */}
        {droneLocation && (
          <Marker
            position={[droneLocation.lat, droneLocation.lng]}
            icon={droneIcon}
          >
            <Popup>🚁 Localização atual do drone</Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
};

export default DroneMap;