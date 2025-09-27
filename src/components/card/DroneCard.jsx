import React from 'react';
import ButtonDefault from '../button/ButtonDefault';
import { FaTrash } from 'react-icons/fa';
import { FaSquarePen } from 'react-icons/fa6';

const DroneCard = ({ name, status, coordX, coordY, batery, id, time, weight, speed, onDelete, onEdit, onClick}) => {

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'disponivel':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'pronto':
                return 'bg-blue-50 text-blue-700 border-blue-200';

            case 'carregando':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'entregando':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'retornando':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'manutencao':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getBatteryColor = (battery) => {
        if (battery >= 70) return 'bg-green-500';
        if (battery >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const BatteryIcon = () => (
        <div className="flex items-center gap-1">
            <div className="relative">
                <div className="w-6 h-3 border border-gray-400 rounded-sm bg-white">
                    <div
                        className={`h-full rounded-sm transition-all duration-300 ${getBatteryColor(batery)}`}
                        style={{ width: `${batery}%` }}
                    />
                </div>
                <div className="absolute -right-1 top-0.5 w-1 h-2 bg-gray-400 rounded-r-sm" />
            </div>
        </div>
    );



    return (
        <div className='relative bg-white border border-gray-200 rounded-xl p-6 shadow-lg shadow-gray-200/60 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 hover:-translate-y-1 group overflow-hidden'>

            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-500" />

            <div className="relative flex justify-end gap-3 items-start mb-4">


                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2 border border-gray-100">
                    <BatteryIcon />
                    <span className="text-sm font-medium text-gray-700">{batery}%</span>
                </div>

                <div className='flex gap-3 items-center'>
                    <button onClick={onDelete} className='rounded-full border border-red-100 bg-red-50 text-red-600 p-2 flex justify-center items-center cursor-pointer'> <FaTrash size={14} /></button>
                    <button className='rounded-full border border-orange-100 bg-orange-50 text-orange-600 p-2 flex justify-center items-center cursor-pointer'> <FaSquarePen size={16} /></button>

                </div>
            </div>

            <div className="relative space-y-3 mb-6">
                <div>
                    <h1 className='text-xl font-bold text-gray-900 first-letter:uppercase group-hover:text-blue-600 transition-colors duration-200'>
                        {name}
                    </h1>
                    <p className='text-gray-500 text-sm font-medium mt-1'>ID: {id}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className='text-sm font-medium'>{coordX}°, {coordY}°</span>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-2 rounded-full text-sm font-semibold px-4 py-1.5 border ${getStatusColor(status)}`}>
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        {
                        status === "reservado" ? 'Reservado' :
                        status === "disponivel" ? 'Disponível' :
                        status === "entregando" ? "Em transporte" :
                        'Retornando'
                        }
                    </span>

                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-gray-50 border-gray-300 rounded-lg border">
                <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{time} min</div>
                    <div className="text-xs text-gray-500">Tempo de voo máximo</div>
                </div>
                <div className="text-center border-x border-gray-200">
                    <div className="text-lg font-bold text-gray-900">{weight}</div>
                    <div className="text-xs text-gray-500">peso máximo</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{speed} Km/h</div>
                    <div className="text-xs text-gray-500">Velocidade máxima</div>
                </div>
            </div>

            <div className="relative">
                <ButtonDefault onClick={onClick} text='Ver detalhes' />
            </div>

            <div className="absolute top-3 left-3">
                <div className="flex space-x-1">
                    <div className="w-1 h-2 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-3 bg-green-400 rounded animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-2 bg-green-400 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
};

export default DroneCard;