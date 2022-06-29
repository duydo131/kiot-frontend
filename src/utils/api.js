import axios from 'axios'
import { REACT_APP_API_URL } from 'src/constants/httpConstants'

const getToken = () => {
    const token = localStorage.getItem('token') || '"no-token"'
    return token.substring(1, token.length - 1)
}

const callApiHttp = ({ url, method, baseUrl, data, params, headers }) => 
    axios.create({
        baseURL: baseUrl || REACT_APP_API_URL,
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            ...headers
        },
    })({
        method,
        url,
        data,
        params,
    })

export default callApiHttp