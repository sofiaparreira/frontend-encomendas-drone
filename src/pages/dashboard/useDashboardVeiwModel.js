import { useState, useEffect } from "react";
import axios from "axios";

export default function useDashboardViewModel() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [transportOrders, setTransportOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pendingRes, transportRes, deliveredRes, dronesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_URL_BASE}/pedido/pendente`),
          axios.get(`${import.meta.env.VITE_URL_BASE}/pedido/transporte`),
          axios.get(`${import.meta.env.VITE_URL_BASE}/pedido/entregue`),
          axios.get(`${import.meta.env.VITE_URL_BASE}/drone`)
        ]);

        const pendingCount = pendingRes.data.length;
        const transportCount = transportRes.data.length;
        const deliveredCount = deliveredRes.data.length;

        setPendingOrders(pendingCount);
        setTransportOrders(transportCount);
        setDeliveredOrders(deliveredCount);
        setTotalOrders(pendingCount + transportCount + deliveredCount);

        setDrones(dronesRes.data || []);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    totalOrders,
    pendingOrders,
    transportOrders,
    deliveredOrders,
    drones,
    loading
  };
}
