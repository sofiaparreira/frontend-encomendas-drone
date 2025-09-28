import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function useGetDronesViewModel() {

    const [drones, setDrones] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

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

    const deleteDrone = async (id) => {
        try {
            setLoading(true)
            const response = await axios.delete(`${import.meta.env.VITE_URL_BASE}/drone/${id}`);
            const data = response.data;
            console.log(data)
            getAllDrones()
        } catch (error) {
            console.error("Erro ao mostrar drones", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllDrones();
    },[])
    return {drones, deleteDrone, navigate, loading}
}