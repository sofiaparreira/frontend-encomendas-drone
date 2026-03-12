import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useLoginViewModel() {
    const [userLogin, setUserLogin] = useState({
        email: "sofia@gmail.com",
        password: "1234",
    })
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_URL_BASE}/auth/login`, {
                email: userLogin.email,
                senha: userLogin.password
            })
            const data = response.data
            console.log(data)
            navigate("/drone")
        } catch (error) {

  const data = error.response?.data

  if (data?.errors) {
    data.errors.forEach(err => {
      const message = Object.values(err)[0]
      toast.error(message)
    })
  } else if (data?.message) {
    toast.error(data.message)
  } else {
    toast.error("Erro inesperado")
  }

} finally {
            setLoading(false)
        }
    }

    return {
        setUserLogin,
        userLogin,
        showPassword,
        setShowPassword,
        loading,
        handleLogin
    }
}