import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function useDetailDroneViewModel() {

    const [drone, setDrone] = useState({
        nome: '',
        capacidadeMaxKg: 0,
        alcanceMaxKm: 0,
        porcentagemBateria: 100,
        coordX: '',
        coordY: '',
        status: 'disponivel',
        velocidadeKMH: 0,
        tempoVooMax: 0,
        homeCoordX: 0,
        homeCoordY: 0
    });

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

    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    console.log("id", id)

    const getDroneById = async () => {
        if (!id) {
            console.log("Drone não encontrado")
            return;
        }
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/drone/${id}`);
            const data = response.data;
            console.log("Data", data)
            setDrone(data)
        } catch (error) {
            console.error('Erro ao mostrar drone por id: ', error);
        } finally {
            setLoading(false)
        }
    }



    // ---------- INICIA VOO DO DRONE ----------
    const startFlight = async () => {
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_URL_BASE}/drone/start-flight/${id}`)
            const data = response.data
            console.log("voo iniciado", data)

            getDroneById()

        } catch (error) {
            console.error('Erro ao iniciar drone: ', error);

        } finally {
            setLoading(false)
        }
    }

    // ---------- GET PEDIDO DO DRONE ----------
    const getPedidoByDroneId = async () => {
        if (!id) {
            console.log("Drone não encontrado")
            return;
        }


        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/pedido/drone/${id}`);
            const data = response.data
            setOrder(data)
            console.log("Pedido do drone", data)
        } catch (error) {
            console.error("Erro ao encontrar pedido: ", error);

        } finally {
            setLoading(false)
        }
    }

// --- RECARREGAR BATERIA DO DRONE ---
const rechargeBaterry = () => {
    try {
        setLoading(true)
        const response = new axios.patch(`${import.meta.env.VITE_URL_BASE}/drone/recharge/${id}`)
        console.log(response.data)
    } catch (error) {
                    console.error("Erro ao encontrar pedido: ", error);

    } finally {
        setLoading(false)
    }
}


    // --- MOSTRA A SIMULAÇÃO DE VOO EM TEMPO REAL ---
   useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setDrone(data);
    };
    ws.onclose = () => console.log("Conexão WebSocket fechada");
    return () => ws.close();
}, []);


    useEffect(() => {
        getDroneById();
        getPedidoByDroneId();
    }, [])



    return { drone, startFlight, order, loading, rechargeBaterry }
}