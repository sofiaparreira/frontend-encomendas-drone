import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        tempoVooMax: 0
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


    const getDroneById = async () => {
        if (!id) {
            console.log("Drone não encontrado")
            return;
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/drone/${id}`);
            const data = response.data;
            console.log("Data", data)
            setDrone(data)
        } catch (error) {
            console.error('Erro ao mostrar drone por id: ', error);
        }
    }



    // ---------- ATUALIZAR STATUS DO DRONE ----------
    const updateStatus = async () => {
        if (!id) {
            console.log("Drone não encontrado");
            return;
        }
        const status = "entregando";
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_URL_BASE}/drone/status/${id}`,
                { status }
            );

            const data = response.data;
            console.log("update status", data);
            getDroneById();
        } catch (error) {
            console.error("Erro ao atualizar status do drone: ", error);
        }
    };


    // ---------- GET PEDIDO DO DRONE ----------

    const getPedidoByDroneId = async () => {
        if (!id) {
            console.log("Drone não encontrado")
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/pedido/drone/${id}`);
            const data = response.data
            setOrder(data)
            console.log("Pedido do drone", data)
        } catch (error) {
            console.error("Erro ao encontrar pedido: ", error);

        }
    }

    useEffect(() => {
        getDroneById();
        getPedidoByDroneId();
    }, [])



    return { drone, updateStatus, order }
}