import React, { useState } from 'react';
import { BsBatteryFull, BsBatteryHalf, BsBattery } from 'react-icons/bs';
import { MdWarning, MdPlayArrow, MdMyLocation } from 'react-icons/md';
import useDetailDroneViewModel from './useDetailDroneViewModel';
import { FaClock } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import GridMap from '../../../components/GridMap'

const DroneDetailPage = () => {
  const { drone, updateStatus, order } = useDetailDroneViewModel();
  const [isStartingFlight, setIsStartingFlight] = useState(false);


  const getStatusColor = (status) => {
    switch (status) {
      case 'disponivel':
        return 'text-green-600 bg-green-100';
      case 'reservado':
        return 'text-yellow-600 bg-yellow-100';
      case 'em_voo':
        return 'text-blue-600 bg-blue-100';
      case 'manutencao':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBatteryColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    if (percentage >= 20) return 'text-orange-600';
    return 'text-red-600';
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-8">
      <div className="">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{drone.nome}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(drone.status)}`}>
              {drone.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-gray-600 text-sm">ID: {drone._id}</p>
        </div>

        {/* Botão de Ação - Logo abaixo do header se reservado */}
        {drone.status === 'reservado' && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 border-l-4 border-yellow-400">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <MdWarning className="h-5 w-5 mr-2 text-yellow-600" />
                  Drone Reservado - Pronto para Voo
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  O drone já foi reservado para um pedido e irá voar automaticamente para o destino ao iniciar voo.
                </p>
              </div>
              <button
                onClick={updateStatus}
                disabled={isStartingFlight}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                  isStartingFlight 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-md hover:shadow-lg'
                }`}
              >
                <MdPlayArrow className="h-4 w-4 mr-2" />
                {isStartingFlight ? 'Iniciando...' : 'Iniciar Voo'}
              </button>
            </div>
          </div>
        )}

        {/* Informações Principais */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {/* Bateria */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              <BsBattery className={`h-5 w-5 mr-2 ${getBatteryColor(drone.porcentagemBateria)}`} />
              <h3 className="text-sm font-semibold text-gray-900">Bateria</h3>
            </div>
            <div className="text-center">
              <span className={`text-lg font-bold ${getBatteryColor(drone.porcentagemBateria)}`}>
                {drone.porcentagemBateria}%
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    drone.porcentagemBateria >= 80 ? 'bg-green-600' :
                    drone.porcentagemBateria >= 50 ? 'bg-yellow-600' :
                    drone.porcentagemBateria >= 20 ? 'bg-orange-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${drone.porcentagemBateria}%` }}
                ></div>
              </div>
            </div>
          </div>


          {/* Capacidade */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              {/* <Package className="h-5 w-5 mr-2 text-blue-600" /> */}
              <h3 className="text-sm font-semibold text-gray-900">Capacidade</h3>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-blue-600">{drone.capacidadeMaxKg} kg</span>
            </div>
          </div>

          {/* Velocidade */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              {/* <Zap className="h-5 w-5 mr-2 text-purple-600" /> */}
              <h3 className="text-sm font-semibold text-gray-900">Velocidade</h3>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-purple-600">{drone.velocidadeKMH} km/h</span>
            </div>
          </div>

          {/* Tempo de Voo */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              <FaClock className="h-5 w-5 mr-2 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">Tempo de Voo</h3>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-indigo-600">{drone.tempoVooMax} min</span>
            </div>
          </div>

          {/* Alcance */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              {/* <Navigation className="h-5 w-5 mr-2 text-orange-600" /> */}
              <h3 className="text-sm font-semibold text-gray-900">Alcance</h3>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-orange-600">
                {drone.alcanceMaxKm > 0 ? `${drone.alcanceMaxKm} km` : 'N/D'}
              </span>
            </div>
          </div>

          {/* Localização */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              <FaLocationDot className="h-5 w-5 mr-2 text-red-600" />
              <h3 className="text-sm font-semibold text-gray-900">Localização</h3>
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-red-600">
                {drone.coordX && drone.coordY 
                  ? `${drone.coordX}, ${drone.coordY}` 
                  : 'Não disponível'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Informações de Sistema */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <MdWarning className="h-5 w-5 mr-2 text-gray-600" />
            Informações do Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="text-gray-600 text-sm">Criado em:</span>
              <p className="font-medium text-gray-900">{formatDate(drone.createdAt)}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Última atualização:</span>
              <p className="font-medium text-gray-900">{formatDate(drone.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MdMyLocation className="h-6 w-6 mr-3 text-blue-600" />
            Mapa de Rastreamento
          </h3>
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Rastreamento em Tempo Real:</strong> Acompanhe a posição atual do drone, 
              destinos programados e obstáculos no percurso. Clique em qualquer célula para mais informações.
            </p>
          </div>

          <GridMap
            gridSize={20}
            droneLatLong={{ lat: drone.coordX, long: drone.coordY }}
            destinationLatLong={{ lat: order.enderecoDestino.coordX, long: order.enderecoDestino.coordY}}
            enderecoDestino={order.enderecoDestino}

            // dronePosition={droneMapPosition}
            // destinations={destinations}
            // obstacles={obstacles}
            // onCellClick={handleMapCellClick}
            showCoordinates={false}
            mapWidth={500}
            mapHeight={500}
          />
        </div>

        {/* Status de Alerta */}
        {drone.porcentagemBateria < 20 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <MdWarning className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800 font-medium">
                Atenção: Bateria baixa! Recomenda-se recarregar antes do próximo voo.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default DroneDetailPage;