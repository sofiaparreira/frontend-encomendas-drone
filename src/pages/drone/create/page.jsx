import React from 'react'
import InputContainer from '../../../components/InputContainer'
import useCreateDroneViewModel from './useCreateDroneViewModel'
import { zipcodeMask } from '../../../masks/zipcodeMask'
import ButtonDefault from '../../../components/button/ButtonDefault'
import ButtonBack from '../../../components/button/ButtonBack'
import Loading from '../../../components/Loading'

const CreateDronePage = () => {

  const {
    setDrone, drone, endereco, setEndereco, handleCEP, createDrone, updateCoordinates, loading
  } = useCreateDroneViewModel();

  console.log("Drone", drone);


  return (
    <main className='min-h-screen bg-gray-50 flex items-center justify-center '>
      <div className='w-full max-w-4xl'>
        <div className='py-12'>
          <span className="flex gap-3 items-center">
            <ButtonBack link="/drone" />
            <h1 className='text-2xl font-bold'>Cadastro de Drone</h1>
          </span>
          <p className='text-gray-600 mt-2'>
            Preencha o formulário abaixo para cadastrar um drone.
          </p>
        </div>

        <form onSubmit={async (e) => {
          e.preventDefault();
          await updateCoordinates();
          await createDrone();
        }}

          className='mb-16'>
          <fieldset className='bg-white p-6 border border-gray-200 rounded-lg shadow-lg shadow-gray-100 mb-6'>
            <h2 className='text-lg font-medium  '>Especificações do Drone</h2>
            <p className='text-gray-600 mb-4'>
              Todas essas informações se encontram nas especificações técnicas do seu drone.
            </p>
            <InputContainer
              label={'Nome'}
              onChange={(e) => {
                setDrone((prev) => ({
                  ...prev,
                  nome: e.target.value
                }))
              }}
              value={drone.nome}
            />
            <div className="grid grid-cols-3 gap-x-3 ">
              <InputContainer
                label={'Capacidade máxima (kg)'}
                onChange={(e) => {
                  setDrone((prev) => ({
                    ...prev,
                    capacidadeMaxKg: e.target.value
                  }))
                }}
                value={drone.capacidadeMaxKg}
              />
              <InputContainer
                label={'Velocidade máxima (KM/H)'}
                onChange={(e) => {
                  setDrone((prev) => ({
                    ...prev,
                    velocidadeKMH: e.target.value
                  }))
                }}
                value={drone.velocidadeKMH}
              />
              <InputContainer
                label={'Alcance máximo (KM)'}
                onChange={(e) => {
                  setDrone((prev) => ({
                    ...prev,
                    alcanceMaxKm: e.target.value
                  }))
                }}
                value={drone.alcanceMaxKm}
              />
            </div>
            <div className="">
              <InputContainer
                label={'Tempo de duração da bateria (em voo)'}
                onChange={(e) => {
                  setDrone((prev) => ({
                    ...prev,
                    tempoVooMax: e.target.value
                  }))
                }}
                value={drone.tempoVooMax}
              />

              <div className="flex gap-3 items-center">
                <InputContainer
                  label={'Porcentagem da bateria'}
                  onChange={(e) => {
                    setDrone((prev) => ({
                      ...prev,
                      porcentagemBateria: e.target.value
                    }));
                  }}
                  value={drone.porcentagemBateria}
                />

                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setDrone(prev => ({
                        ...prev,
                        porcentagemBateria: e.target.checked ? 100 : prev.duracaoBateria
                      }));
                    }}
                    checked={drone.porcentagemBateria === 100}
                    className="w-4 h-4"
                  />
                  Carregado 100%
                </label>
              </div>

            </div>
          </fieldset>

          <fieldset className='bg-white p-6 border border-gray-200 rounded-lg shadow-lg shadow-gray-100 mb-6'>
            <h2 className='text-lg font-medium mb-4 '>Localização atual do drone</h2>

            <div className="">
              <InputContainer
                label={'CEP'}
                value={endereco.cep}
                onChange={(e) => {
                  const formatted = zipcodeMask(e.target.value);
                  setEndereco(prev => ({ ...prev, cep: formatted }));

                  const numericCEP = formatted.replace(/\D/g, '');
                  if (numericCEP.length === 8) handleCEP(numericCEP);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 ">
              <InputContainer
                label={'Estado'}
                onChange={(e) => {
                  setEndereco((prev) => ({
                    ...prev,
                    estado: e.target.value
                  }))
                }}
                value={endereco.estado}
              />
              <InputContainer
                label={'Cidade'}
                onChange={(e) => {
                  setEndereco((prev) => ({
                    ...prev,
                    cidade: e.target.value
                  }))
                }}
                value={endereco.cidade}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
              <InputContainer
                label={'Bairro'}
                onChange={(e) => {
                  setEndereco((prev) => ({
                    ...prev,
                    bairro: e.target.value
                  }))
                }}
                value={endereco.bairro}
              />
              <InputContainer
                label={'Número'}
                onChange={(e) => {
                  setEndereco((prev) => ({
                    ...prev,
                    numero: e.target.value
                  }))
                }}
                value={endereco.numero}
              />
            </div>
          </fieldset>

          <ButtonDefault text={'Cadastrar'} variant='primary' type='submit' />
        </form>
      </div>

      {loading && <Loading />}
    </main>
  )
}

export default CreateDronePage
