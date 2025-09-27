import { useEffect, useState } from "react"
import { getAddressFromCEP } from "../../../utils/getAddressFromCEP";
import { getCoordinatesFromAddress } from "../../../utils/getCoordinatesFromAddress";
import axios from "axios";
import { useNavigate } from "react-router-dom";



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
    prioridade: "",
    prioridade: 0
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

  useEffect(() => {
    const { estado, cidade, bairro, numero, coordX, coordY } = order.enderecoDestino;

    if (estado && cidade && bairro && numero) {
      updateCoordinates();
    }
  }, [order.enderecoDestino.estado, order.enderecoDestino.cidade, order.enderecoDestino.bairro, order.enderecoDestino.numero]);


  // ---------- SOLICITAR PEDIDO ----------
  const createOrder = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL_BASE}/pedido`, order)
      console.log('Resposta do servidor: ', response.data)
      navigate("/order")
    } catch (error) {
      console.error('Erro ao solicitar pedido: ', error)

    }
  }


  // --- get drones para popular dropdown
  const [drones, setDrones] = useState([]);

      console.log("drones", drones)

  const getAllDrones = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/drone`);
      const data = response.data;

      setDrones(data)
      console.log(data)
    } catch (error) {
      console.error("Erro ao mostrar drones", error)
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
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/prioridade`);
      setPriorities(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Erro ao buscar prioridades:", error);
    }
  };

  useEffect(() => {
    getPriority();
    getAllDrones();

  }, [])


  return { order, setOrder, handleCEP, updateCoordinates, drones, loading, droneOptions, createOrder, priorities }
}