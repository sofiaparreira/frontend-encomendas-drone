import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function useGetDronesViewModel() {

    const [drones, setDrones] = useState([]);
    const navigate = useNavigate()

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

    const deleteDrone = async (id) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_URL_BASE}/drone/${id}`);
            const data = response.data;
            console.log(data)
            getAllDrones()
        } catch (error) {
            console.error("Erro ao mostrar drones", error)
        }
    }

    useEffect(() => {
        getAllDrones();
    },[])
    return {drones, deleteDrone, navigate}
}