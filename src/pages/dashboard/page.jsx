import React from 'react'
import useDashboardViewModel from './useDashboardVeiwModel'
import { MdLocalShipping, MdPending, MdCheckCircle } from 'react-icons/md'
import { FiClock, FiPackage } from 'react-icons/fi'
import { HiOutlineStatusOnline, HiOutlineStatusOffline } from 'react-icons/hi'
import { BiBattery } from 'react-icons/bi'
import { PiDroneFill } from 'react-icons/pi'
import { TbTruckDelivery, TbTruckReturn } from 'react-icons/tb'
import Loading from '../../components/Loading'

const DashboardPage = () => {
    const {
        deliveredOrders,
        pendingOrders,
        totalOrders,
        transportOrders,
        drones,
        loading
    } = useDashboardViewModel()

    

    const droneStats = {
        total: drones.length,
        disponivel: drones.filter(d => d.status === 'disponivel').length,
        reservado: drones.filter(d => d.status === 'reservado').length,
        entregando: drones.filter(d => d.status === 'entregando').length,
        retornando: drones.filter(d => d.status === 'retornando').length,
        carregando: drones.filter(d => d.status === 'carregando').length,
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'disponivel': return 'text-gray-700 bg-white border-gray-200'
            case 'reservado': return 'text-gray-700 bg-white border-gray-200'
            case 'entregando': return 'text-gray-700 bg-white border-gray-200'
            case 'retornando': return 'text-gray-700 bg-white border-gray-200'
            case 'carregando': return 'text-gray-700 bg-white border-gray-200'
            default: return 'text-gray-700 bg-white border-gray-200'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'disponivel': return <HiOutlineStatusOnline className="text-green-600" size={18} />
            case 'reservado': return <FiClock className="text-gray-600" size={18} />
            case 'entregando': return <TbTruckDelivery className="text-blue-600" size={18} />
            case 'retornando': return <TbTruckReturn className="text-purple-600" size={18} />
            case 'carregando': return <BiBattery className="text-yellow-600" size={18} />
            default: return <HiOutlineStatusOffline className="text-gray-600" size={18} />
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'disponivel': return 'Disponível'
            case 'reservado': return 'Reservado'
            case 'entregando': return 'Entregando'
            case 'retornando': return 'Retornando'
            case 'carregando': return 'Carregando'
            default: return 'Indefinido'
        }
    }

    return (
        <main className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
                <p className="text-gray-600">Monitoramento e métricas do sistema de entregas</p>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Seção dos Drones */}
                <section className="lg:col-span-2">
                    <div className="bg-white shadow-lg shadow-gray-200/50 p-6 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <PiDroneFill className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Área de Drones</h3>
                                <p className="text-sm text-gray-600">Status atual da frota</p>
                            </div>
                        </div>

                        {/* Total de Drones */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-gray-700">Total de Drones</span>
                                <span className="text-3xl font-bold text-blue-600">{droneStats.total}</span>
                            </div>
                        </div>

                        {/* Status dos Drones - Grid 2x3 para acomodar 5 status */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className={`p-4 rounded-lg border-2 ${getStatusColor('disponivel')}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon('disponivel')}
                                        <span className="font-medium">Disponível</span>
                                    </div>
                                    <span className="text-xl font-bold">{droneStats.disponivel}</span>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg border-2 ${getStatusColor('reservado')}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon('reservado')}
                                        <span className="font-medium">Reservado</span>
                                    </div>
                                    <span className="text-xl font-bold">{droneStats.reservado}</span>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg border-2 ${getStatusColor('entregando')}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon('entregando')}
                                        <span className="font-medium">Entregando</span>
                                    </div>
                                    <span className="text-xl font-bold">{droneStats.entregando}</span>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg border-2 ${getStatusColor('retornando')}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon('retornando')}
                                        <span className="font-medium">Retornando</span>
                                    </div>
                                    <span className="text-xl font-bold">{droneStats.retornando}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg border-2 ${getStatusColor('carregando')} mb-4`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon('carregando')}
                                    <span className="font-medium">Carregando</span>
                                </div>
                                <span className="text-xl font-bold">{droneStats.carregando}</span>
                            </div>
                        </div>

                        {/* Lista de Drones */}
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Drones Ativos</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {drones.map((drone) => (
                                    <div key={drone._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-gray-50 border border-gray-200">
                                                {getStatusIcon(drone.status)}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">{drone.nome || `Drone ${drone._id}`}</span>
                                                <p className="text-sm text-gray-600">ID: {drone._id}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                            {getStatusLabel(drone.status)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="bg-white shadow-lg shadow-gray-200/50 p-6 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <FiPackage className="text-gray-600" size={20} />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">Total de Pedidos</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{totalOrders}</div>
                    </div>

                    <div className="bg-white shadow-lg shadow-gray-200/50 p-6 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <MdPending className="text-gray-600" size={20} />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">Pedidos Pendentes</span>
                        </div>
                        <div className="text-3xl font-bold text-orange-600">{pendingOrders}</div>
                    </div>

                    <div className="bg-white shadow-lg shadow-gray-200/50 p-6 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <MdLocalShipping className="text-gray-600" size={20} />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">Pedidos em Transporte</span>
                        </div>
                        <div className="text-3xl font-bold text-blue-600">{transportOrders}</div>
                    </div>

                    <div className="bg-white shadow-lg shadow-gray-200/50 p-6 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <MdCheckCircle className="text-gray-600" size={20} />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">Pedidos Entregues</span>
                        </div>
                        <div className="text-3xl font-bold text-green-600">{deliveredOrders}</div>
                    </div>
                </section>
            </section>
            {loading && <Loading />}
        </main>
    )
}

export default DashboardPage