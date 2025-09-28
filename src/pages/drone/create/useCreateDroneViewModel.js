import axios from "axios";
import { useEffect, useState, useRef } from "react"
import { getAddressFromCEP } from "../../../utils/getAddressFromCEP";
import { getCoordinatesFromAddress } from "../../../utils/getCoordinatesFromAddress";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function useCreateDroneViewModel() {
  const [drone, setDrone] = useState({
    nome: '',
    capacidadeMaxKg: 0,
    alcanceMaxKm: 0,
    porcentagemBateria: 100,
    coordX: '',
    coordY: '',
    status: 'disponivel',
    velocidadeKMH: 0,
    tempoVooMax: 0
  });

  const [endereco, setEndereco] = useState({
    estado: '',
    cidade: '',
    bairro: '',
    numero: '',
    cep: ''
  });

  const [isGettingCoords, setIsGettingCoords] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const gettingCoordsRef = useRef(false);

  const updateCoordinates = async () => {
    if (gettingCoordsRef.current) return null;

    try {
      setLoading(true)
      gettingCoordsRef.current = true;
      setIsGettingCoords(true);

      const coords = await getCoordinatesFromAddress(endereco);
      if (!coords || (coords.lat == null && coords.lon == null)) {
        return null;
      }

      const lat = typeof coords.lat === "string" ? coords.lat.trim() : coords.lat;
      const lon = typeof coords.lon === "string" ? coords.lon.trim() : coords.lon;

      setDrone(prev => ({
        ...prev,
        coordX: lat,
        coordY: lon
      }));

      return { lat, lon };
    } catch (err) {
      console.error("Erro ao obter coordenadas:", err);
      return null;
    } finally {
      gettingCoordsRef.current = false;
      setIsGettingCoords(false);
      setLoading(false)
    }
  };


  // --- viacep ---
  const handleCEP = async (cep) => {
    const enderecoData = await getAddressFromCEP(cep);
    if (enderecoData) {
      setEndereco(prev => ({
        ...prev,
        ...enderecoData
      }));
    }
  };

  // ---------- CADASTRAR DRONE ----------
  const createDrone = async () => {
  if (isCreating) return;
  setIsCreating(true);

  try {
    setLoading(true);

    const coords = await updateCoordinates();
    if (!coords || coords.lat == null || coords.lon == null) {
      throw new Error("Não foi possível obter coordenadas a partir do endereço. Verifique o endereço ou insira manualmente.");
    }

    const parseNum = (v) => {
      if (v === undefined || v === null) return NaN;
      if (typeof v === "number") return v;
      return Number(String(v).replace(",", ".").trim());
    };

    const lat = parseNum(coords.lat);
    const lon = parseNum(coords.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      throw new Error("Coordenadas inválidas. Confirme as coordenadas antes de criar o drone.");
    }

    const payload = {
      ...drone,
      coordX: lat,
      coordY: lon
    };

    const response = await axios.post(`${import.meta.env.VITE_URL_BASE}/drone`, payload);
    console.log('Resposta do servidor', response.data);

    navigate("/drone");
  } catch (error) {
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err) => {
        const message = Object.values(err)[0];
        toast.error(message);
      });
    } else {
      console.error("Erro inesperado:", error);
      toast.error("Ocorreu um erro inesperado");
    }
  } finally {
    setIsCreating(false);
    setLoading(false)
  }
};


  return { createDrone, setDrone, drone, endereco, setEndereco, handleCEP, updateCoordinates, isCreating, loading };
}
