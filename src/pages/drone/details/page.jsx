import React, { useState } from 'react';
import { BsBatteryFull, BsBatteryHalf, BsBattery } from 'react-icons/bs';
import { MdWarning, MdPlayArrow, MdMyLocation } from 'react-icons/md';
import useDetailDroneViewModel from './useDetailDroneViewModel';
import { FaClock } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import GridMap from '../../../components/GridMap'
import Loading from '../../../components/Loading'

const DroneDetailPage = () => {
  const { drone, startFlight, order, loading, rechargeBaterry, fila } = useDetailDroneViewModel();
  const [isStartingFlight, setIsStartingFlight] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponivel':
        return 'text-green-600 bg-green-100 border border-green-200';
      case 'reservado':
        return 'text-gray-600 bg-gray-100 border border-gray-200';
      case 'entregando':
        return 'text-blue-600 bg-blue-100 border border-blue-200';
      case 'retornando':
        return 'text-blue-600 bg-blue-100 border border-blue-200';
      case 'recarregando':
        return 'text-red-600 bg-red-100 border border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border border-gray-200';
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

  const isBatteryLow = drone.porcentagemBateria <= 30;

  // Debug: Log dos dados da fila
  console.log("🔍 Debug - Fila:", fila);
  console.log("🔍 Debug - Destinos:", fila?.entregas?.[0]?.pedidos?.map(pedido => ({
    lat: pedido.enderecoDestino.coordX,
    long: pedido.enderecoDestino.coordY
  })) || []);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="flex gap-3 items-center">
              <h1 className="text-3xl font-bold text-gray-900">{drone.nome}</h1>
                        <p className="text-sm rounded-full bg-gray-700 text-white px-2 py-1">{drone._id}</p>
            </span>

            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(drone.status)}`}>
              {drone.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className='flex gap-2 items-center text-sm mt-4'>
              <span className="text-gray-600 text-sm">Criado em:</span>
              <p className="font-medium text-gray-900">{formatDate(drone.createdAt)}</p>
            </div>
            <div className='flex gap-2 items-center text-sm'>
              <span className="text-gray-600 text-sm">Última atualização:</span>
              <p className="font-medium text-gray-900">{formatDate(drone.updatedAt)}</p>
            </div>
        </div>

        {isBatteryLow && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <MdWarning className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="text-red-800 font-medium">
                  Atenção: Bateria baixa ({drone.porcentagemBateria}%)!
                </p>
                <p className="text-red-700 text-sm mt-1">
                  O drone não pode iniciar voo com bateria abaixo de 30%. Recarregue antes de prosseguir.
                </p>
              </div>
            </div>
          </div>
        )}

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
                onClick={startFlight}
                disabled={isStartingFlight || isBatteryLow}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${isStartingFlight || isBatteryLow
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-md hover:shadow-lg'
                  }`}
                title={isBatteryLow ? 'Bateria insuficiente para iniciar voo' : ''}
              >
                <MdPlayArrow className="h-4 w-4 mr-2" />
                {isStartingFlight ? 'Iniciando...' :
                  isBatteryLow ? 'Bateria Baixa' : 'Iniciar Voo'}
              </button>
            </div>
          </div>
        )}

        {/* Informações Principais */}
        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-7 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 col-span-2">
            <div className="flex items-center justify-between mb-3 ">
              <div className="flex items-center">
                <BsBattery className={`h-5 w-5 mr-2 ${getBatteryColor(drone.porcentagemBateria)}`} />
                <h3 className="text-sm font-semibold text-gray-900">Bateria</h3>
              </div>
              <button
                onClick={rechargeBaterry}
                className='group flex items-center text-xs py-1.5 px-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-medium cursor-pointer'
              >
                <svg className="w-3 h-3 mr-1.5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Recarregar
              </button>
            </div>

            <div className="text-center">
              <span className={`text-lg font-bold ${getBatteryColor(drone.porcentagemBateria)}`}>
                {drone.porcentagemBateria}%
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${drone.porcentagemBateria >= 80 ? 'bg-green-600' :
                      drone.porcentagemBateria >= 50 ? 'bg-yellow-600' :
                        drone.porcentagemBateria >= 20 ? 'bg-orange-600' : 'bg-red-600'
                    }`}
                  style={{ width: `${drone.porcentagemBateria}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Capacidade</h3>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-blue-600">{drone.capacidadeMaxKg} kg</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Velocidade</h3>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-purple-600">{drone.velocidadeKMH} km/h</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              <FaClock className="h-5 w-5 mr-2 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">Tempo de Voo</h3>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-indigo-600">{drone.tempoVooMax} min</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
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

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MdMyLocation className="h-6 w-6 mr-3 text-blue-600" />
            Mapa de Rastreamento
          </h3>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Rastreamento em Tempo Real:</strong> Ao iniciar voo você poderá acompanhar o drone voando em tempo real no mapa abaixo!
            </p>
            {fila?.entregas?.[0]?.pedidos && (
              <p className="text-sm text-blue-700 mt-2">
                <strong>Entregas programadas:</strong> {fila.entregas[0].pedidos.length} pedido(s) para entrega
              </p>
            )}
            {fila?.entregas?.[0]?.pedidos && fila.entregas[0].pedidos.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                <strong>Destinos:</strong>
                <ul className="mt-1 ml-4">
                  {fila.entregas[0].pedidos.map((pedido, index) => (
                    <li key={index} className="list-disc">
                      {pedido.enderecoDestino.rua}, {pedido.enderecoDestino.numero} - {pedido.enderecoDestino.bairro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="w-full flex justify-center">
            <GridMap
              gridSize={30}
              droneLatLong={{ lat: drone.coordX, long: drone.coordY }}
              destinations={fila?.entregas?.[0]?.pedidos?.map(pedido => ({
                lat: pedido.enderecoDestino.coordX,
                long: pedido.enderecoDestino.coordY
              })) || []}
              baseLatLong={{ lat: drone.homeCoordX, long: drone.homeCoordY }}
              showCoordinates={false}
              mapWidth={800}
              mapHeight={600}
            />
          </div>
        </div>
      </div>

      {loading && <Loading />}
    </main>
  );
};

export default DroneDetailPage;