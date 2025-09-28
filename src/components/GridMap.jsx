import React, { useState, useEffect, useMemo } from 'react';
import { MdMyLocation, MdFlight } from 'react-icons/md';
import { FaMapMarkerAlt } from 'react-icons/fa';

const GridMap = ({
  gridSize = 50, // mínimo 50
  droneLatLong,
  destinationLatLong,
  baseLatLong, // posição da base
  obstacles = [],
  onCellClick,
  enderecoDestino = {},
  showCoordinates = false,
  containerWidth = '100%'
}) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [mapSize, setMapSize] = useState(600);

  // Limites geográficos em Belo Horizonte
  const latMin = -20.020;  // Sul
  const latMax = -19.740;  // Norte
  const longMin = -44.050; // Oeste
  const longMax = -43.800; // Leste

  const actualGridSize = Math.max(50, gridSize);

  const normalize = (value, min, max) => {
    if (typeof value !== 'number' || isNaN(value)) return 0;
    const v = (value - min) / (max - min);
    return Math.min(1, Math.max(0, v));
  };

  const toGrid = (lat, long) => {
    const latNorm = normalize(lat, latMin, latMax);
    const longNorm = normalize(long, longMin, longMax);
    const row = Math.floor((1 - latNorm) * (actualGridSize - 1)); // latitude -> y
    const col = Math.floor(longNorm * (actualGridSize - 1));      // longitude -> x
    return { x: col, y: row };
  };

  // Obstáculo fixo
  const obstacleLatLong = useMemo(() => ({ lat: -19.850856, long: -43.950067 }), []);
  const obstacleCell = useMemo(() => toGrid(obstacleLatLong.lat, obstacleLatLong.long), [obstacleLatLong.lat, obstacleLatLong.long, actualGridSize]);

  const mergedObstacles = useMemo(() => {
    const exists = obstacles.some(obs => obs.x === obstacleCell.x && obs.y === obstacleCell.y);
    return exists ? obstacles : [...obstacles, obstacleCell];
  }, [obstacles, obstacleCell.x, obstacleCell.y]);

  // posições
  const dronePosition = droneLatLong?.lat && droneLatLong?.long ? toGrid(droneLatLong.lat, droneLatLong.long) : { x: -1, y: -1 };
  const destination = destinationLatLong?.lat && destinationLatLong?.long ? toGrid(destinationLatLong.lat, destinationLatLong.long) : { x: -1, y: -1 };
  const basePosition = baseLatLong?.lat && baseLatLong?.long ? toGrid(baseLatLong.lat, baseLatLong.long) : null;

  useEffect(() => {
    const updateMapSize = () => {
      const availableWidth = Math.min(window.innerWidth * 0.9, 800);
      setMapSize(availableWidth - 32);
    };
    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    return () => window.removeEventListener('resize', updateMapSize);
  }, []);

  const cellSize = mapSize / actualGridSize;

  const isObstacle = (x, y) => mergedObstacles.some(obs => obs.x === x && obs.y === y);
  const isDestination = (x, y) => destination.x === x && destination.y === y;
  const isDronePosition = (x, y) => dronePosition.x === x && dronePosition.y === y;
  const isBasePosition = (x, y) => basePosition && basePosition.x === x && basePosition.y === y;

  const getCellColor = (x, y) => {
    if (isDronePosition(x, y)) return 'bg-blue-500';
    if (isDestination(x, y)) return 'bg-green-500';
    if (isBasePosition(x, y)) return 'bg-purple-500';
    if (isObstacle(x, y)) return 'bg-red-500';
    if (hoveredCell && hoveredCell.x === x && hoveredCell.y === y) return 'bg-gray-300';
    if (selectedCell && selectedCell.x === x && selectedCell.y === y) return 'bg-yellow-300';
    return 'bg-white';
  };

  const handleCellClick = (x, y) => {
    setSelectedCell({ x, y });
    if (onCellClick) onCellClick({ x, y });
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < actualGridSize; y++) {
      for (let x = 0; x < actualGridSize; x++) {
        const cellKey = `${x}-${y}`;
        cells.push(
          <div
            key={cellKey}
            className={`border border-gray-300 cursor-pointer transition-all duration-200 hover:border-gray-600 flex items-center justify-center ${getCellColor(x, y)}`}
            style={{
              width: cellSize,
              height: cellSize,
              fontSize: Math.max(6, cellSize / 4),
              borderWidth: cellSize > 8 ? '1px' : '0.5px'
            }}
            onClick={() => handleCellClick(x, y)}
            onMouseEnter={() => setHoveredCell({ x, y })}
            onMouseLeave={() => setHoveredCell(null)}
            title={`Posição: (${x}, ${y})`}
          >
            {isDronePosition(x, y) && (
              <MdFlight className="text-white" style={{ fontSize: Math.max(8, cellSize * 0.6), display: cellSize > 6 ? 'block' : 'none' }} />
            )}
            {isDestination(x, y) && !isDronePosition(x, y) && (
              <FaMapMarkerAlt className="text-white" style={{ fontSize: Math.max(6, cellSize * 0.5), display: cellSize > 6 ? 'block' : 'none' }} />
            )}
            {isObstacle(x, y) && cellSize > 4 && (
              <div className="bg-white rounded-full" style={{ width: Math.max(2, cellSize * 0.3), height: Math.max(2, cellSize * 0.3) }} />
            )}
            {isBasePosition(x, y) && (
              <div className="text-white font-bold" style={{ fontSize: Math.max(6, cellSize * 0.4) }}>🏠</div>
            )}
            {showCoordinates && cellSize > 20 && !isDronePosition(x, y) && !isDestination(x, y) && !isObstacle(x, y) && !isBasePosition(x, y) && (
              <span className="text-xs text-gray-600" style={{ fontSize: Math.max(6, cellSize / 6) }}>{x},{y}</span>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Controles e Info */}
      <div className="bg-white rounded-lg shadow-md p-4 w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <MdMyLocation className="h-5 w-5 mr-2 text-blue-600" />
          Mapa de Rastreamento - Malha {actualGridSize}x{actualGridSize}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
              <MdFlight className="text-white text-xs" />
            </div>
            <span>Drone</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
              <FaMapMarkerAlt className="text-white text-xs" />
            </div>
            <span>Destino</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">🏠</span>
            </div>
            <span>Base</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
            <span>Obstáculo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded" />
            <span>Área Livre</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Posição do Drone:</span>
              <span className="ml-2 text-blue-600 font-bold">({dronePosition.x}, {dronePosition.y})</span>
            </div>
            {selectedCell && (
              <div>
                <span className="font-medium text-gray-700">Célula Selecionada:</span>
                <span className="ml-2 text-yellow-600 font-bold">({selectedCell.x}, {selectedCell.y})</span>
              </div>
            )}
            {hoveredCell && (
              <div>
                <span className="font-medium text-gray-700">Hover:</span>
                <span className="ml-2 text-gray-600 font-bold">({hoveredCell.x}, {hoveredCell.y})</span>
              </div>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            <p>
              Endereço do destino: {enderecoDestino.rua}, {enderecoDestino.numero}, {enderecoDestino.bairro} - {enderecoDestino.cidade} - {enderecoDestino.estado}, {enderecoDestino.cep}
            </p>
            <p className="mt-2">{obstacleLatLong.lat === -19.850856 && obstacleLatLong.long === -43.950067 ? "Zona de exclusão aérea: Aeroporto de Pampulha" : ""}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-4xl">
        <div
          className="grid border-2 border-gray-600 bg-gray-100 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${actualGridSize}, 1fr)`,
            width: mapSize,
            height: mapSize,
            maxWidth: '100%'
          }}
        >
          {renderGrid()}
        </div>
      </div>
    </div>
  );
};

export default GridMap;
