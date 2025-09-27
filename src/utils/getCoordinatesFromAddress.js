import axios from "axios";

/**
 * @param {Object} endereco 
 * @returns {Promise<{lat: number, lon: number} | null>}
 */


export const getCoordinatesFromAddress = async (endereco) => {
  try {
    const { numero = "", rua = "", bairro = "", cidade = "", estado = "" } = endereco;
    const address = `${numero} ${rua} ${bairro}, ${cidade}, ${estado}, Brasil`;

    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        addressdetails: 1,
        limit: 1
      }
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }

    console.log("Endereço não encontrado");
    return null;
  } catch (error) {
    console.error("Erro ao buscar lat/lon:", error);
    return null;
  }
};
