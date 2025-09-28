import React, { useState, useEffect, useMemo } from 'react';
import { MdFlight, MdMyLocation } from 'react-icons/md';
import { FaMapMarkerAlt } from 'react-icons/fa';

const GridMap = ({
  gridSize = 50,
  droneLatLong,
  destinations = [],
  baseLatLong,
  obstacles = [],
  onCellClick,
  showCoordinates = false,
  containerWidth = '100%',
  mapWidth = 500,
  mapHeight = 500
}) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [mapSize, setMapSize] = useState(600);
  const [dronePosition, setDronePosition] = useState({ x: -1, y: -1 });

  // Limites geográficos
  const latMin = -20.020;
  const latMax = -19.740;
  const longMin = -44.050;
  const longMax = -43.800;

  const actualGridSize = Math.max(50, gridSize);

  const normalize = (value, min, max) => Math.min(1, Math.max(0, (value - min) / (max - min)));

  const toGrid = (lat, long) => {
    const latNorm = normalize(lat, latMin, latMax);
    const longNorm = normalize(long, longMin, longMax);
    return {
      x: Math.floor(longNorm * (actualGridSize - 1)),
      y: Math.floor((1 - latNorm) * (actualGridSize - 1))
    };
  };

  // Obstáculo fixo
  const obstacleLatLong = useMemo(() => ({ lat: -19.850856, long: -43.950067 }), []);
  const obstacleCell = useMemo(() => toGrid(obstacleLatLong.lat, obstacleLatLong.long), [obstacleLatLong, actualGridSize]);

  const mergedObstacles = useMemo(() => {
    const exists = obstacles.some(obs => obs.x === obstacleCell.x && obs.y === obstacleCell.y);
    return exists ? obstacles : [...obstacles, obstacleCell];
  }, [obstacles, obstacleCell]);

  const currentDronePosition = droneLatLong?.lat && droneLatLong?.long
    ? toGrid(droneLatLong.lat, droneLatLong.long)
    : { x: -1, y: -1 };

  const destinationPositions = destinations.map(dest =>
    dest?.lat && dest?.long ? toGrid(dest.lat, dest.long) : { x: -1, y: -1 }
  );

  const basePosition = baseLatLong?.lat && baseLatLong?.long
    ? toGrid(baseLatLong.lat, baseLatLong.long)
    : null;

  // Atualiza posição do drone sempre que droneLatLong mudar
  useEffect(() => {
    if (currentDronePosition.x !== -1 && currentDronePosition.y !== -1) {
      setDronePosition(currentDronePosition);
    }
  }, [currentDronePosition.x, currentDronePosition.y]);

  // Ajuste de tamanho do mapa
  useEffect(() => {
    const updateMapSize = () => {
      const availableWidth = Math.min(window.innerWidth * 0.95, 1000);
      const availableHeight = Math.min(window.innerHeight * 0.7, 800);
      setMapSize(Math.min(availableWidth, availableHeight));
    };
    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    return () => window.removeEventListener('resize', updateMapSize);
  }, []);

  const cellSize = mapSize / actualGridSize;

  const isObstacle = (x, y) => mergedObstacles.some(obs => obs.x === x && obs.y === y);
  const isDestination = (x, y) => destinationPositions.some(dest => dest.x === x && dest.y === y);
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
            className={`border border-gray-300 cursor-pointer flex items-center justify-center ${getCellColor(x, y)}`}
            style={{ width: cellSize, height: cellSize }}
            onClick={() => handleCellClick(x, y)}
            onMouseEnter={() => setHoveredCell({ x, y })}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {isDronePosition(x, y) && <MdFlight className="text-white" style={{ fontSize: Math.max(8, cellSize * 0.6) }} />}
            {isDestination(x, y) && !isDronePosition(x, y) && <FaMapMarkerAlt className="text-white" style={{ fontSize: Math.max(6, cellSize * 0.5) }} />}
            {isBasePosition(x, y) && <span className="text-white font-bold" style={{ fontSize: Math.max(6, cellSize * 0.4) }}>🏠</span>}
            {showCoordinates && !isDronePosition(x, y) && !isDestination(x, y) && !isObstacle(x, y) && !isBasePosition(x, y) && (
              <span className="text-xs text-gray-600">{x},{y}</span>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4 w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <MdMyLocation className="h-5 w-5 mr-2 text-blue-600" />
          Mapa de Rastreamento - Malha {actualGridSize}x{actualGridSize}
        </h3>

        <div className="mt-3 flex justify-center">
          <div
            className="grid border-2 border-gray-600 bg-gray-100"
            style={{
              gridTemplateColumns: `repeat(${actualGridSize}, 1fr)`,
              width: mapWidth || mapSize,
              height: mapHeight || mapSize,
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            {renderGrid()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridMap;
