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

    const [fila, setFila] = useState(null);

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

    // ------ GET FILA POR ID DRONE ----------

    useEffect(() => {
        const getFilaByIdDrone = async () => {
          setLoading(true);
    
          try {
            const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/fila/${id}`);
            setFila(response.data); // salva a fila no state
            console.log("fila", response.data)
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
    
        if (id) {
            getFilaByIdDrone();
        }
      }, [id]);

    // ---------- INICIA VOO DO DRONE ----------
    const startFlight = async () => {
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_URL_BASE}/drone/start-flight/${id}`)
            const data = response.data
            console.log("voo iniciado", data)

            getDroneById()
            toast.success("O drone iniciou o voo! Confira a movimentação no mapa em tempo real.")

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
    
    ws.onopen = () => {
        console.log("🔌 WebSocket conectado para drone", id);
    };
    
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log("📡 WebSocket recebeu dados do drone:", data);
            
            // Só atualiza se for o drone correto
            if (data._id === id) {
                setDrone(data);
                console.log("🚁 Drone atualizado via WebSocket:", data.nome, "Status:", data.status);
            }
        } catch (error) {
            console.error("❌ Erro ao processar dados WebSocket:", error);
        }
    };
    
    ws.onclose = () => {
        console.log("🔌 Conexão WebSocket fechada");
    };
    
    ws.onerror = (error) => {
        console.error("❌ Erro WebSocket:", error);
    };
    
    return () => {
        console.log("🔌 Fechando WebSocket");
        ws.close();
    };
}, [id]);


    useEffect(() => {
        getDroneById();
        getPedidoByDroneId();
    }, [])



    return { drone, startFlight, order, loading, rechargeBaterry, fila }
}