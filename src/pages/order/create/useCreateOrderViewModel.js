import { useEffect, useRef, useState } from "react"
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
 const gettingCoordsRef = useRef(false);

// ------ GERAR COORDENADAS A PARTIR DO ENDEREÇO ------
const updateCoordinates = async () => {
  if (gettingCoordsRef.current) return null;

  const { enderecoDestino } = order;

  if (!enderecoDestino?.cep || !enderecoDestino?.rua || !enderecoDestino?.cidade || !enderecoDestino?.estado) {
    toast.error("Preencha todos os campos do endereço antes de gerar coordenadas.");
    return null;
  }

  try {
    setLoading(true);
    gettingCoordsRef.current = true;

    const coords = await getCoordinatesFromAddress(enderecoDestino);

    if (!coords || coords.lat == null || coords.lon == null) {
      toast.error("Não foi possível gerar coordenadas a partir do endereço fornecido.");
      return null;
    }

    const lat = typeof coords.lat === "string" ? coords.lat.trim() : coords.lat;
    const lon = typeof coords.lon === "string" ? coords.lon.trim() : coords.lon;

    setOrder(prev => ({
      ...prev,
      coordX: lat,
      coordY: lon
    }));

    return { lat, lon };
  } catch (err) {
    console.error("Erro ao obter coordenadas:", err);
    toast.error("Erro ao gerar coordenadas. Tente novamente.");
    return null;
  } finally {
    gettingCoordsRef.current = false;
    setLoading(false);
  }
};

// ---------- SOLICITAR PEDIDO ----------
const createOrder = async () => {
  try {
    setLoading(true);

    const coords = await updateCoordinates();
    if (!coords) return;

    const lat = Number(coords.lat);
    const lon = Number(coords.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon) || lat === 0 || lon === 0) {
      toast.error("Coordenadas inválidas. Confirme o endereço ou insira manualmente.");
      return;
    }

    const payload = {
      ...order,
      enderecoDestino: {
        ...order.enderecoDestino,
        coordX: lat,
        coordY: lon
      }
    };

    const response = await axios.post(`${import.meta.env.VITE_URL_BASE}/pedido`, payload);
    console.log('Resposta do servidor: ', response.data);

    navigate("/order");

  } catch (error) {
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err) => {
        const message = Object.values(err)[0];
        toast.error(message);
      });

    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);

    } else {
      console.error("Erro inesperado:", error);
      toast.error("Ocorreu um erro inesperado");
    }

  } finally {
    setLoading(false);
  }
};

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