import { API } from '../utils/config';
import axios from 'axios';

export const createCategory = (token, data) => {
    return axios.post(`${API}/category`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

export const createProduct = (token, data) => {
    return axios.post(`${API}/product`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

export const getCategories = () => {
    return axios.get(`${API}/category`)
}

export const createCoupon = (token, data) => {
    return axios.post(`${API}/coupon`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

export const getCoupons = () => {
    return axios.get(`${API}/coupon`)
}

export const checkValidCoupon = code => {
    return axios.get(`${API}/coupon/code?c=${code}`)
}