import React, { useState, useMemo } from 'react'
import useOrderViewModel from './useOrderViewModel'
import OrderCard from '../../components/card/OrderCard';
import { FaClock, FaTruck, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { MdFlightTakeoff } from 'react-icons/md';
import ButtonDefault from '../../components/button/ButtonDefault';
import DeleteModal from '../../components/modal/DeleteModal';
import { IoBatteryFull, IoBatteryHalf } from 'react-icons/io5';
import { TiBatteryLow } from 'react-icons/ti';
import Loading from '../../components/Loading';


const DashboardOrdersPage = () => {
  const {
    orders, activeFilter, setActiveFilter, navigate, isOpenDeleteModal, toggleDeleteModal, deleteOrder, selectedOrderId, loading
  } = useOrderViewModel();

  const [expandedDrones, setExpandedDrones] = useState(new Set());

  const groupedOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    // Para pedidos entregues, não agrupar por drone
    if (activeFilter === 'entregues') {
      return orders;
    }
    
    // Para outros status, agrupar por drone
    const groups = orders.reduce((acc, order) => {
      const droneKey = order.droneId?._id || 'sem-drone';
      if (!acc[droneKey]) {
        acc[droneKey] = {
          droneId: order.droneId || null,
          orders: []
        };
      }
      acc[droneKey].orders.push(order);
      return acc;
    }, {});

    return Object.entries(groups).map(([key, data]) => ({
      key,
      droneId: data.droneId,
      orders: data.orders
    }));
  }, [orders, activeFilter]);

  const toggleDroneSection = (droneId) => {
    const newExpanded = new Set(expandedDrones);
    if (newExpanded.has(droneId)) {
      newExpanded.delete(droneId);
    } else {
      newExpanded.add(droneId);
    }
    setExpandedDrones(newExpanded);
  };

  const toggleAllDrones = () => {
    const allDroneKeys = groupedOrders.map(group => group.key);
    if (expandedDrones.size === allDroneKeys.length) {
      setExpandedDrones(new Set());
    } else {
      setExpandedDrones(new Set(allDroneKeys));
    }
  };

  const getDroneColor = (droneId) => {
    if (droneId === 'sem-drone') return 'bg-gray-500';
    
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    
    // Usar hash simples do droneId para escolher cor consistente
    let hash = 0;
    for (let i = 0; i < droneId.length; i++) {
      hash = droneId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const renderDeliveredOrders = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaCircleCheck className="text-green-500" />
            Pedidos Entregues
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} entregu{orders.length !== 1 ? 'es' : 'e'}
          </p>
        </div>
        
        <div className="space-y-3">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard
                key={order._id}
                id={order._id}
                status={order.status}
                enderecoDestino={order.enderecoDestino}
                dataCriacao={order.createdAt}
                peso={order.pesoKg}
                prioridade={order.prioridadeId.nome}
                onCancel={() => toggleDeleteModal(order._id)}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <FaCircleCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhum pedido entregue encontrado</p>
              <p className="text-gray-400 text-sm mt-2">
                Os pedidos entregues aparecerão aqui
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGroupedOrders = () => {
    return (
      <div className='space-y-4'>
        {groupedOrders.length > 0 ? (
          groupedOrders.map((group) => {
            const { key, droneId, orders } = group;
            const isExpanded = expandedDrones.has(key);
            const droneColor = getDroneColor(key);
            
            return (
              <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header da seção do drone */}
                <button
                  onClick={() => toggleDroneSection(key)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${droneColor} rounded-lg flex items-center justify-center`}>
                      <MdFlightTakeoff className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-lg ">
                          {key === 'sem-drone' ? 'Pedidos sem Drone' : `Drone ${droneId?.nome || key}`}
                        </h3>
                        {droneId?._id && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                            {droneId._id}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        
                        {droneId && (
                          <>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              droneId.status === 'disponivel' ? 'text-green-600 bg-green-100' :
                              droneId.status === 'em_voo' ? 'text-blue-600 bg-blue-100' :
                              droneId.status === 'reservado' ? 'text-gray-600 bg-gray-100' :
                              droneId.status === 'manutencao' ? 'text-red-600 bg-red-100' :
                              'text-gray-600 bg-gray-100'
                            }`}>
                              {droneId.status}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              {droneId.porcentagemBateria >= 80 ? <IoBatteryFull className='text-green-600'/> : droneId.porcentagemBateria >= 40 ? <IoBatteryHalf className='text-orange-600' /> : <TiBatteryLow className='text-red-600' /> }{droneId.porcentagemBateria}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {orders.length}
                    </span>
                    <div className="text-gray-400">
                      {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                    </div>
                  </div>
                </button>
                
                {/* Lista de pedidos (colapsável) */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-6">
                    {/* Informações detalhadas do drone */}
                    {droneId && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Informações do Drone</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Capacidade:</span>
                            <span className="ml-2 font-medium">{droneId.capacidadeMaxKg}kg</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Velocidade:</span>
                            <span className="ml-2 font-medium">{droneId.velocidadeKMH}km/h</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Bateria:</span>
                            <span className="ml-2 font-medium">{droneId.porcentagemBateria}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Status:</span>
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              droneId.status === 'disponivel' ? 'text-green-600 bg-green-100' :
                              droneId.status === 'em_voo' ? 'text-blue-600 bg-blue-100' :
                              droneId.status === 'reservado' ? 'text-gray-600 bg-gray-100' :
                              droneId.status === 'manutencao' ? 'text-red-600 bg-red-100' :
                              'text-gray-600 bg-gray-100'
                            }`}>
                              {droneId.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Lista de pedidos */}
                    <div className="space-y-3">
                      {orders.length > 0 ? (
                        orders.map((order, index) => (
                          <div key={order._id} className="relative">
                            {/* Indicador de posição na fila */}
                            <div className="absolute -left-2 top-4 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 z-10">
                              {index + 1}
                            </div>
                            
                            <div className="ml-8">
                              <OrderCard
                                id={order._id}
                                status={order.status}
                                enderecoDestino={order.enderecoDestino}
                                dataCriacao={order.createdAt}
                                peso={order.pesoKg}
                                prioridade={order.prioridadeId.nome}
                                onCancel={() => toggleDeleteModal(order._id)}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          Nenhum pedido encontrado para este drone
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <MdFlightTakeoff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
            <p className="text-gray-400 text-sm mt-2">
              Os pedidos aparecerão aqui organizados por drone
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className='bg-gray-50 min-h-screen p-8'>
      <div className="flex justify-between items-center mb-8">
        <h1 className='text-2xl font-bold'>Pedidos</h1>
        
        <div className="w-48">
          <ButtonDefault text={'Solicitar pedido'} onClick={() => navigate("/order/create")} />
        </div>
      </div>

      <section className='flex justify-end mb-6'>
         <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveFilter('pendentes')}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer
              ${activeFilter === 'pendentes'
                ? 'bg-yellow-500 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
              }
            `}
          >
            <FaClock />
            Pendentes
          </button>
          
          <button
            onClick={() => setActiveFilter('em_transito')}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer
              ${activeFilter === 'em_transito'
                ? 'bg-blue-500 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }
            `}
          >
            <FaTruck />
            Em Trânsito
          </button>
          
          <button
            onClick={() => setActiveFilter('entregues')}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer
              ${activeFilter === 'entregues'
                ? 'bg-green-500 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }
            `}
          >
            <FaCircleCheck />
            Entregues
          </button>
        </div>
      </section>

      {/* Indicador visual do filtro ativo */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            ${activeFilter === 'pendentes' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${activeFilter === 'em_transito' ? 'bg-blue-100 text-blue-800' : ''}
            ${activeFilter === 'entregues' ? 'bg-green-100 text-green-800' : ''}
          `}>
            {activeFilter === 'pendentes' && <FaClock />}
            {activeFilter === 'em_transito' && <FaTruck />}
            {activeFilter === 'entregues' && <FaCircleCheck />}
            Exibindo: {activeFilter === 'em_transito' ? 'Em Trânsito' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
          </div>
          
          {/* Botão "Expandir/Recolher Todos" só aparece para status que têm agrupamento */}
          {activeFilter !== 'entregues' && groupedOrders.length > 0 && (
            <button
              onClick={toggleAllDrones}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expandedDrones.size === groupedOrders.length ? 'Recolher Todos' : 'Expandir Todos'}
            </button>
          )}
        </div>
      </div>

      <section className='mb-8'>
        <p className="text-gray-600">
          {activeFilter === 'entregues' 
            ? 'Lista de pedidos entregues.' 
            : 'Pedidos organizados por drone. Clique nas seções para expandir/recolher.'
          }
        </p>
      </section>

      {/* Renderização condicional baseada no filtro */}
      {activeFilter === 'entregues' ? renderDeliveredOrders() : renderGroupedOrders()}

      {/* Modal FORA do map */}
      {isOpenDeleteModal && (
        <DeleteModal 
          onConfirm={() => deleteOrder(selectedOrderId)} 
          onClose={() => toggleDeleteModal()} 
          title="Excluir Pedido"
          message="Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          type="danger"
        />
      )}

      {loading && <Loading />}

    </main>
  )
}

export default DashboardOrdersPage