import axios from "axios";
import { useEffect, useState } from "react";

export default function useDashboardViewModel() {

    const [totalOrders, setTotalOrders] = useState(0)
    const [pendingOrders, setPendingOrders] = useState(0)
    const [transportOrders, setTransportOrders] = useState(0)
    const [deliveredOrders, seteDeliveredOrders] = useState(0)
    const [drones, setDrones] = useState([])
    const [loading, setLoading] = useState(false)

    // --- GET PEDIDOS PENDENTES ---
    const getPendingOrders = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/pedido/pendente`)
            const data = response.data;
            setPendingOrders(data.length)
        } catch (error) {
            console.error("Erro ao mostrar pedidos pendentes", error)

        } finally {
            setLoading(false)
        }
    }

    const getTransportOrders = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/pedido/transporte`)
            const data = response.data;
            setTransportOrders(data.length)
        } catch (error) {
            console.error("Erro ao mostrar pedidos em transporte", error)

        } finally {
            setLoading(false)
        }
    }

    const getDeliveredOrders = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/pedido/entregue`)
            const data = response.data;
            seteDeliveredOrders(data.length)
        } catch (error) {
            console.error("Erro ao mostrar pedidos entregues", error)

        } finally {
            setLoading(false)
        }
    }

    // --- GET DRONES ---
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
useEffect(() => {
  setTotalOrders(pendingOrders + transportOrders + deliveredOrders);
}, [pendingOrders, transportOrders, deliveredOrders]);

    useEffect(() => {
        getPendingOrders();
        getTransportOrders();
        getDeliveredOrders();
        getAllDrones()
    },[])
    return { totalOrders, deliveredOrders, transportOrders, pendingOrders, drones }
}