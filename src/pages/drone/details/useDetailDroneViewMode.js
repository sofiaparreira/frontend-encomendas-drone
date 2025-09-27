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


  const { id } = useParams(); 


    const getDroneById = async () => {


        if(!id){
            console.log("Drone não encontrado")
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/drone/${id}`);
            const data = response.data;
            console.log("Data", data)
        } catch (error) {
            console.error('Erro ao mostrar drone por id: ', error);
        }
    }

    useEffect(() => {
        getDroneById();
    },[])

    return {}
}