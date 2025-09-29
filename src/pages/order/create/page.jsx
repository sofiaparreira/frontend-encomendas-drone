import React from 'react';
import InputContainer from '../../../components/InputContainer';
import { zipcodeMask } from '../../../masks/zipcodeMask';
import ButtonDefault from '../../../components/button/ButtonDefault';
import ButtonBack from '../../../components/button/ButtonBack';
import useCreateOrderViewModel from './useCreateOrderViewModel';
import Dropdown from '../../../components/Dropdown';
import Loading from '../../../components/Loading';


const CreateOrderPage = () => {
  const {
    order,
    setOrder,
    updateCoordinates,
    createOrder,
    handleCEP,
    droneOptions,
    priorities,
    loading

  } = useCreateOrderViewModel();


  return (
    <main className='min-h-screen bg-gray-50 flex items-center justify-center '>
      <div className='w-full max-w-4xl'>
        <div className='py-12'>
          <span className="flex gap-3 items-center">
            <ButtonBack link="/order" />
            <h1 className='text-2xl font-bold'>Solicitar pedido</h1>
          </span>
          <p className='text-gray-600 mt-2'>
            Preencha o formulário abaixo para solicitar um pedido de entrega por drone.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await updateCoordinates();
            await createOrder();
          }}
          className='mb-16'
        >

          {/* Informações do pedido */}
          <fieldset className='bg-white p-6 border border-gray-200 rounded-lg shadow-lg shadow-gray-100 mb-6'>
            <h2 className='text-lg font-medium mb-4'>Especificações do Pedido</h2>

            <InputContainer
              label={'Peso do pedido (kg)'}
              value={order.pesoKg}
              onChange={(e) => setOrder(prev => ({ ...prev, pesoKg: e.target.value }))}
            />

            <Dropdown
              options={priorities.map(p => ({
                label: p.nome,
                value: p._id
              }))}

              onSelect={(selectedValue) => {
                setOrder(prevOrder => ({
                  ...prevOrder,
                  prioridadeId: selectedValue
                }));
              }}
              value={order.prioridadeId}
              placeholder="Selecione uma prioridade"
            />



          </fieldset>


          {/* Endereço de destino */}
          <fieldset className='bg-white p-6 border border-gray-200 rounded-lg shadow-lg shadow-gray-100 mb-6'>
            <h2 className='text-lg font-medium mb-4'>Endereço de Destino</h2>


            <InputContainer
              label={'CEP'}
              value={order.enderecoDestino?.cep || ''}
              onChange={(e) => {
                const formatted = zipcodeMask(e.target.value);
                setOrder(prev => ({
                  ...prev,
                  enderecoDestino: {
                    ...prev.enderecoDestino,
                    cep: formatted
                  }
                }));
                const numericCEP = formatted.replace(/\D/g, '');
                if (numericCEP.length === 8) handleCEP(numericCEP); 
              }}
            />

            <div className='grid grid-cols-2 gap-3'>
              <InputContainer
                label={'Estado'}
                value={order.enderecoDestino?.estado || ''}
                onChange={(e) =>
                  setOrder(prev => ({
                    ...prev,
                    enderecoDestino: {
                      ...prev.enderecoDestino,
                      estado: e.target.value
                    }
                  }))
                }
              />
              <div>
                <InputContainer
                  label={'Cidade'}
                  value={order.enderecoDestino?.cidade || ''}
                  onChange={(e) =>
                    setOrder(prev => ({
                      ...prev,
                      enderecoDestino: {
                        ...prev.enderecoDestino,
                        cidade: e.target.value
                      }
                    }))
                  }
                />
                                <p className="text-sm text-gray-500">Por favor insira locais somente em Belo Horizonte</p>

              </div>
              <InputContainer
                label={'Bairro'}
                value={order.enderecoDestino?.bairro || ''}
                onChange={(e) =>
                  setOrder(prev => ({
                    ...prev,
                    enderecoDestino: {
                      ...prev.enderecoDestino,
                      bairro: e.target.value
                    }
                  }))
                }
              />
              <InputContainer
                label={'Número'}
                value={order.enderecoDestino?.numero || ''}
                onChange={(e) =>
                  setOrder(prev => ({
                    ...prev,
                    enderecoDestino: {
                      ...prev.enderecoDestino,
                      numero: e.target.value
                    }
                  }))
                }
              />
              <InputContainer
                label={'Rua'}
                value={order.enderecoDestino?.rua || ''}
                onChange={(e) =>
                  setOrder(prev => ({
                    ...prev,
                    enderecoDestino: {
                      ...prev.enderecoDestino,
                      rua: e.target.value
                    }
                  }))
                }
              />
            </div>

          </fieldset>
          <ButtonDefault text={'Cadastrar Pedido'} variant='primary' type='submit' />
        </form>
      </div>

      {loading && <Loading />}

    </main>
  );
};

export default CreateOrderPage;
