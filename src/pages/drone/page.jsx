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
      {loading && <Loading />}

        </main>
    )
}

export default DashboardDronePage
