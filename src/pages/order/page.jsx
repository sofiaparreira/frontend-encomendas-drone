import React, { useState } from 'react'
import useOrderViewModel from './useOrderViewModel'
import OrderCard from '../../components/card/OrderCard';
import { FaClock, FaTruck } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import ButtonDefault from '../../components/button/ButtonDefault';

const DashboardOrdersPage = () => {

  const {
    orders, activeFilter, setActiveFilter, navigate
  } = useOrderViewModel();



  return (
    <main className='bg-gray-50 min-h-screen p-8'>
      <div className="flex justify-between items-center mb-8">
        <h1 className='text-2xl font-bold'>Pedidos</h1>
        
        <div className="w-48">
          <ButtonDefault text={'Solicitar pedido'} onClick={() => navigate("/order/create")} />
        </div>
       
      </div>

      <section className='flex justify-end'>
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
      </div>

      <section className='mb-8'>
        <p>Pedidos pendentes são organizados por uma fila com base na prioridade do pedido</p>
      </section>

    <section className='flex flex-col gap-3'>
  {orders && orders.length > 0 ? (
    orders.map((order) => (
      <OrderCard
        key={order._id}
        id={order._id}
        status={order.status}
        enderecoDestino={order.enderecoDestino}
        dataCriacao={order.createdAt}
        peso={order.pesoKg}
      />
    ))
  ) : (
    <p className="text-gray-500 text-center">Nenhum pedido encontrado</p>
  )}
</section>



    </main>
  )
}

export default DashboardOrdersPage