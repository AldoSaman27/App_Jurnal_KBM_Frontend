// axios
import axios from "axios";

const getJurnalData = async (accessToken, nip, date) => {
    try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        axios.defaults.headers.common["Accept"] = "application/json";
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/jurnal/index/${nip}/${date.getMonth() + 1}/${date.getFullYear()}`);
        return response.data.jurnal;
    } catch (error) {
        throw error.response.data;
    }
};

export default getJurnalData;
