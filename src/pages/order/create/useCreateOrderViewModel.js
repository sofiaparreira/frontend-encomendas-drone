import { useEffect, useState } from "react"
import { getAddressFromCEP } from "../../../utils/getAddressFromCEP";
import { getCoordinatesFromAddress } from "../../../utils/getCoordinatesFromAddress";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



export default function useCreateOrderViewModel() {

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({
    enderecoDestino: {
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      coordX: null,
      coordY: null
    },
    pesoKg: "",
    droneId: "",
    prioridadeId: 0,

  });

  const navigate = useNavigate();
  console.log(order)


  // --- CONSULTAR CEP PELO VIA CEP ---
  const handleCEP = async (cep) => {
    const enderecoData = await getAddressFromCEP(cep);
    if (enderecoData) {
      setOrder(prev => ({
        ...prev,
        enderecoDestino: {
          ...prev.enderecoDestino,
          ...enderecoData
        }
      }));
    }
  };


  // ------ GERAR COORDENADAS A PARTIR DO ENDEREÇO ------ 
  const updateCoordinates = async () => {
    const coords = await getCoordinatesFromAddress(order.enderecoDestino);
    if (coords) {
      setOrder(prev => ({
        ...prev,
        enderecoDestino: {
          ...prev.enderecoDestino,
          coordX: coords.lat,
          coordY: coords.lon
        }
      }));
    }
  };


  // ---------- SOLICITAR PEDIDO ----------
  const createOrder = async () => {
    try {
      await updateCoordinates()
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_URL_BASE}/pedido`, order)
      console.log('Resposta do servidor: ', response.data)

      navigate("/order")

    } catch (error) {

      if (error.response && error.response.data) {
        console.error('Erro do backend:', error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        console.error('Erro inesperado:', error.message);
        toast.error('Erro inesperado, tente novamente.');
      }

    } finally {
      setLoading(false)
    }
  }


  // --- get drones para popular dropdown
  const [drones, setDrones] = useState([]);

  console.log("drones", drones)

  const getAllDrones = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/drone`);
      const data = response.data;

      setDrones(data)
      console.log(data)
    } catch (error) {
      console.error("Erro ao mostrar drones", error)
    } finally {
      setLoading(false)
    }
  }


  const droneOptions = drones
    .map(drone => ({
      value: drone._id,
      label: drone.nome,
      disabled: drone.status !== 'disponivel'
    }))
    .sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      return 0;
    });

  console.log("options ordenadas:", droneOptions);


  const [priorities, setPriorities] = useState([]);

  // --- GET PRIORIDADES ---
  const getPriority = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/prioridade`);
      setPriorities(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Erro ao buscar prioridades:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getPriority();
    getAllDrones();

  }, [])


  return { order, setOrder, handleCEP, updateCoordinates, drones, loading, droneOptions, createOrder, priorities, loading }
}