import React, { createContext, useRef, useState} from "react";
import { getSearchedProducts } from "./api/apiProduct";

export const StateContext = createContext()

export const StateProvider = ({children}) => {
    const required = useRef(false)
    const [searchedProducts, setSearchedProducts] = useState([])
    return(
        <StateContext.Provider
        value={{
            required,
            searchedProducts,
            setSearchedProducts,
            search: (input) => {
                console.log(input)
                getSearchedProducts(input)
                .then((response) => {
                    setSearchedProducts(response.data)
                    required.current = true
                })
                .catch ((err) => {
                    console.log(err)
                    required.current = false
                })
            }
        }}>
            {children}
        </StateContext.Provider>
    )
}