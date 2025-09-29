import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  mapWidth = null,
  mapHeight = null
}) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [mapSize, setMapSize] = useState(600);
  const [dronePosition, setDronePosition] = useState({ x: -1, y: -1 });
  const gridRef = useRef(null);

  // Limites geográficos (mantive os seus)
  const latMin = -20.020;
  const latMax = -19.740;
  const longMin = -44.050;
  const longMax = -43.800;

  const actualGridSize = Math.max(50, gridSize);

  // ---------- helpers ----------
  const parseNumber = (v) => {
    if (v === undefined || v === null) return NaN;
    if (typeof v === 'number') return v;
    if (typeof v === 'string') return Number(v.replace(',', '.').trim());
    return NaN;
  };

  const normalize = (value, min, max) => Math.min(1, Math.max(0, (value - min) / (max - min)));

  // toGrid agora recebe raw lat/long e faz round
  const toGrid = (latRaw, longRaw, gridSz = actualGridSize) => {
    const lat = parseNumber(latRaw);
    const lon = parseNumber(longRaw);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return { x: -1, y: -1 };

    const latNorm = normalize(lat, latMin, latMax);
    const longNorm = normalize(lon, longMin, longMax);

    const x = Math.round(longNorm * (gridSz - 1));
    const y = Math.round((1 - latNorm) * (gridSz - 1));
    return { x, y };
  };

  // aceita tanto {lat,long} quanto {coordX,coordY}
  const normalizeInputLatLong = (raw) => {
    if (!raw) return null;
    if (raw.lat !== undefined && raw.long !== undefined) return { lat: raw.lat, long: raw.long };
    if (raw.coordX !== undefined && raw.coordY !== undefined) return { lat: raw.coordX, long: raw.coordY };
    // caso venha em outra forma (ex: {x,y}) — retorna null
    return null;
  };

  // Obstáculo fixo (mantive)
  const obstacleLatLong = useMemo(() => ({ lat: -19.850856, long: -43.950067 }), []);
  const obstacleCell = useMemo(() => toGrid(obstacleLatLong.lat, obstacleLatLong.long), [obstacleLatLong, actualGridSize]);

  const mergedObstacles = useMemo(() => {
    const exists = obstacles.some(obs => obs.x === obstacleCell.x && obs.y === obstacleCell.y);
    return exists ? obstacles : [...obstacles, obstacleCell];
  }, [obstacles, obstacleCell]);

  // computed positions (resilientes)
  const currentDronePositionComputed = useMemo(() => {
    const normalized = normalizeInputLatLong(droneLatLong);
    if (!normalized) return { x: -1, y: -1 };
    return toGrid(normalized.lat, normalized.long, actualGridSize);
  }, [droneLatLong, actualGridSize]);

  const destinationPositions = useMemo(() => {
    return destinations.map(dest => {
      const normalized = normalizeInputLatLong(dest);
      if (!normalized) return { x: -1, y: -1 };
      return toGrid(normalized.lat, normalized.long, actualGridSize);
    });
  }, [destinations, actualGridSize]);

  const basePosition = useMemo(() => {
    const normalized = normalizeInputLatLong(baseLatLong);
    if (!normalized) return null;
    return toGrid(normalized.lat, normalized.long, actualGridSize);
  }, [baseLatLong, actualGridSize]);

  // ---------- map sizing ----------
  useEffect(() => {
    const updateMapSize = () => {
      const availableWidth = Math.min(window.innerWidth * 0.95, 1000);
      const availableHeight = Math.min(window.innerHeight * 0.7, 800);
      const preferred = Math.min(availableWidth, availableHeight);
      setMapSize(preferred);
    };
    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    return () => window.removeEventListener('resize', updateMapSize);
  }, []);

  // escolher width/height finais (prioriza props mapWidth/mapHeight)
  const width = mapWidth || mapSize;
  const height = mapHeight || mapSize;
  const containerPx = Math.min(width, height);
  const cellSize = containerPx / actualGridSize;

  // ---------- sincroniza dronePosition a partir do payload do backend ----------
  useEffect(() => {
    console.log('[GridMap] droneLatLong raw ->', droneLatLong);
    console.log('[GridMap] computed cell ->', currentDronePositionComputed);

    if (currentDronePositionComputed.x !== -1 && currentDronePositionComputed.y !== -1) {
      setDronePosition(prev => {
        if (prev.x === currentDronePositionComputed.x && prev.y === currentDronePositionComputed.y) {
          return prev;
        }
        return currentDronePositionComputed;
      });
    } else {
      // opcional: se quiser apagar a posição quando inválida
      // setDronePosition({ x: -1, y: -1 });
    }
  }, [droneLatLong, currentDronePositionComputed.x, currentDronePositionComputed.y]);

  // helpers visuais
  const isObstacle = (x, y) => mergedObstacles.some(obs => obs.x === x && obs.y === y);
  const isDestination = (x, y) => destinationPositions.some(dest => dest.x === x && dest.y === y);
  const isBasePosition = (x, y) => basePosition && basePosition.x === x && basePosition.y === y;

  const getCellColor = (x, y) => {
    if (dronePosition.x === x && dronePosition.y === y) return 'bg-blue-500';
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

  // monta células (ainda renderizo as células como antes)
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
            {/* não colocamos o ícone do drone dentro da célula para permitir overlay animado */}
            {isDestination(x, y) && <FaMapMarkerAlt className="text-white" style={{ fontSize: Math.max(6, cellSize * 0.5) }} />}
            {isBasePosition(x, y) && <span className="text-white font-bold" style={{ fontSize: Math.max(6, cellSize * 0.4) }}>🏠</span>}
            {showCoordinates && !isDestination(x, y) && !isObstacle(x, y) && !isBasePosition(x, y) && (
              <span className="text-xs text-gray-600">{x},{y}</span>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  // posição do overlay do drone em pixels
  const droneLeft = dronePosition.x >= 0 ? dronePosition.x * cellSize : -9999;
  const droneTop = dronePosition.y >= 0 ? dronePosition.y * cellSize : -9999;

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4 w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <MdMyLocation className="h-5 w-5 mr-2 text-blue-600" />
          Mapa de Rastreamento - Malha {actualGridSize}x{actualGridSize}
        </h3>

        <div className="mt-3 flex justify-center">
          <div
            ref={gridRef}
            className="grid border-2 border-gray-600 bg-gray-100"
            style={{
              position: 'relative',             // importante para overlay absoluto
              gridTemplateColumns: `repeat(${actualGridSize}, 1fr)`,
              width: containerPx,
              height: containerPx,
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            {renderGrid()}

            {/* Overlay do drone (absoluto) — anima com transform */}
            {dronePosition.x >= 0 && dronePosition.y >= 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: cellSize,
                  height: cellSize,
                  transform: `translate3d(${droneLeft}px, ${droneTop}px, 0)`,
                  transition: 'transform 0.6s linear',
                  pointerEvents: 'none', // deixa clicks passarem para as células
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 50
                }}
              >
                <MdFlight className="text-white" style={{ fontSize: Math.max(12, cellSize * 0.6), filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridMap;
