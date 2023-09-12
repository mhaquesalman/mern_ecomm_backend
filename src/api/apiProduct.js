import { API } from '../utils/config';
import axios from 'axios';

export const getProducts = (sortBy, order, limit, skip) => {
    return axios.get(`${API}/product?sortBy=${sortBy}&order=${order}&limit=${limit}&skip=${skip}`)
}

export const getProductDetails = (id) => {
    return axios.get(`${API}/product/${id}`)
}

export const getCategories = () => {
    console.log("API ", API)
    return axios.get(`${API}/category`)
}

export const getFilteredProducts = (skip, limit, filters = {}, order, sortBy) => {
    const data = {
        order: order,
        sortBy: sortBy,
        limit: limit,
        skip: skip,
        filters: { ...filters }
    }
    return axios.post(`${API}/product/filter`, data, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export const getSearchedProducts = value => {
    return axios.post(`${API}/product/search?q=${value}`)
}

export const createComment = (pid, commentBody, commentRating) => {
    const data = {
        product: pid,
        commentBody: commentBody,
        commentRating: commentRating
    }
    return axios.post(`${API}/comment`, data, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export const getComments = pid => {
    return axios.get(`${API}/comment?pid=${pid}`)
}