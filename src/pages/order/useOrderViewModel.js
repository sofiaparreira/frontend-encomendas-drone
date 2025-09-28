import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function useOrderViewModel() {

    const [orders, setOrders] = useState([]);
    const [activeFilter, setActiveFilter] = useState('pendentes');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();


    const getPendingOrders = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/pedido/pendente`)
            const data = response.data;
            setOrders(data)
            console.log("data", data)
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
            setOrders(data)
            console.log("data", data)
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
            setOrders(data)
            console.log("data", data)
        } catch (error) {
            console.error("Erro ao mostrar pedidos entregues", error)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (activeFilter === 'pendentes') {
            getPendingOrders();

        } else if (activeFilter === 'em_transito') {
            getTransportOrders();
        } else {
            getDeliveredOrders();
        }
    }, [activeFilter])


    // ---------- DELETE PEDIDO ----------
    const deleteOrder = async (id) => {
        try {
            setLoading(true)
            const response = await axios.delete(`${import.meta.env.VITE_URL_BASE}/pedido/${id}`)
            console.log(response.data)
            getPendingOrders();
        } catch (error) {
            console.error("Erro ao excluir pedido", error)

        } finally {
            setLoading(false)
        }
    }


    // delete modal
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
        const [selectedOrderId, setSelectedOrderId] = useState(null);

const toggleDeleteModal = (orderId = null) => {
  setSelectedOrderId(orderId);
  setIsOpenDeleteModal((prev) => !prev);
};

    return { orders, activeFilter, setActiveFilter, navigate, deleteOrder, toggleDeleteModal, isOpenDeleteModal, selectedOrderId, loading }
}