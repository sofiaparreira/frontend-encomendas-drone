import React from 'react';
import ButtonDefault from '../button/ButtonDefault';
import { FaLocationDot } from 'react-icons/fa6';
import { GiWeight } from 'react-icons/gi';

const OrderCard = ({
  id,
  enderecoDestino,
  status,
  peso,
  dataCriacao,
  dataEntrega,
  observacoes,
  prioridade,
  onCancel
}) => {

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendente':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'em_transporte':
      case 'em transporte':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'entregue':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelado':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // formatar endereco
  const formatAddress = (endereco) => {
    if (!endereco) return 'Endereço não informado';
    const { rua, numero, bairro, cidade, estado } = endereco;
    return `${rua}, ${numero} - ${bairro}, ${cidade}/${estado}`;
  };



  return (
    <div className='relative bg-white border border-gray-200 rounded-xl p-6 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 hover:-translate-y-1 group overflow-hidden'>



      <div className='flex justify-between mb-2'>
        <h1 className='text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200'>
          Pedido #{id?.slice(-8) || 'N/A'}
        </h1>

        <span className={`inline-flex items-center gap-2 rounded-full text-sm font-semibold px-4 py-1.5 border ${getStatusColor(status)}`}>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          {status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-center">
          <div className="w-full h-px bg-gray-200 relative">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>



        <div className="flex items-start gap-2 text-gray-600">
          <FaLocationDot />
          <div className="flex-1">
            <p className='text-xs text-gray-500 font-medium mb-1'>DESTINO</p>
            <p className='text-sm'>{formatAddress(enderecoDestino)}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <GiWeight  />
          <div>
            <p className="text-xs text-gray-500">Peso da encomenda</p>
            <p className="font-semibold text-gray-900">{peso ? `${peso}kg` : '--'}</p>
          </div>
        </div>



        <div>
          <p className="text-xs text-gray-500 mb-1">Prioridade</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${prioridade === 'alta'
              ? 'bg-red-100 text-red-800'
              : prioridade === 'media'
                ? 'bg-orange-100 text-orange-800'
                : prioridade
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
            }`}>
            {prioridade ?? 'Sem prioridade'}
          </span>
        </div>

        <div>
          <p className="text-xs text-gray-500">Data da solicitação</p>
          <p className="font-semibold text-gray-900 text-xs">
            {formatDate(dataCriacao)}
          </p>
        </div>
      </div>

      {dataEntrega && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-600 font-medium">ENTREGUE EM</p>
          <p className="text-sm font-semibold text-green-700">{formatDate(dataEntrega)}</p>
        </div>
      )}

      {observacoes && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 font-medium mb-1">OBSERVAÇÕES</p>
          <p className="text-sm text-blue-700">{observacoes}</p>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        {/* <div className="flex-1">
          <ButtonDefault text='Ver detalhes' />
        </div> */}
        {status === 'pendente' && (
          <button onClick={onCancel} className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium text-sm">
            Cancelar
          </button>
        )}
      </div>


    </div>
  );
};

export default OrderCard;