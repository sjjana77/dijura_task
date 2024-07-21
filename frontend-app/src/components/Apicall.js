import axios from 'axios';

const Apicall = async ({ data, apiname }) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}${apiname}/`, data);
        return response.data;
    } catch (error) {
        console.error('Failed to update expense:', error);
        return null;
    }
}

export default Apicall;
