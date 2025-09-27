import axios from "axios";

export const getAddressFromCEP = async (cep) => {
  try {
    const numericCEP = cep.replace(/\D/g, "");
    if (numericCEP.length !== 8) throw new Error("CEP inválido");

    const response = await axios.get(`https://viacep.com.br/ws/${numericCEP}/json/`);
    const data = response.data;

    if (data.erro) throw new Error("CEP não encontrado");

    return {
      estado: data.uf,
      cidade: data.localidade,
      bairro: data.bairro,
      rua: data.logradouro || ""
    };
  } catch (error) {
    console.error("Erro ao consultar CEP:", error.message);
    return null;
  }
};
