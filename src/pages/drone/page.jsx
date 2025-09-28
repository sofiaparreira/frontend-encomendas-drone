import React from 'react'
import useGetDronesViewModel from './useGetDronesViewModel'
import DroneCard from '../../components/card/DroneCard';
import ButtonDefault from '../../components/button/ButtonDefault';
import Loading from '../../components/Loading'

const DashboardDronePage = () => {
    const {
        drones, deleteDrone, navigate, loading
    } = useGetDronesViewModel();

    return (
        <main className='p-8 bg-gray-50 min-h-screen'>
            <div className="flex justify-between">
                <h1 className='mb-8 text-2xl font-bold'>Meus Drones</h1>
                <div className="w-48">
                    <ButtonDefault text={'Cadastrar drone'} onClick={() => navigate("/drone/create")} />
                </div>
            </div>

            {drones.length > 0 ? (
                <section className='grid grid-cols-3 gap-8'>
                    {drones.map((d) => (
                        <DroneCard
                            key={d._id}
                            id={d._id}
                            name={d.nome}
                            status={d.status}
                            coordX={d.coordX}
                            coordY={d.coordY}
                            batery={d.porcentagemBateria}
                            time={d.tempoVooMax}
                            weight={d.capacidadeMaxKg}
                            speed={d.velocidadeKMH}
                            onDelete={() => deleteDrone(d._id)}
                            onEdit={() => { }}
                            onClick={() => navigate(`/drone/${d._id}`)}
                        />
                    ))}
                </section>
            ) : (
                !loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum drone cadastrado</h3>
                        <p className="text-gray-500 mb-6 text-center">
                            Você ainda não possui drones cadastrados. <br />
                            Clique no botão acima para cadastrar seu primeiro drone.
                        </p>
                    </div>
                )
            )}

            {loading && <Loading />}
        </main>
    )
}

export default DashboardDronePage