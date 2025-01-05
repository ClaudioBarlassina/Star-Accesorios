import { useContext } from "react";
import {FilterContext} from "../Context/Filters"

export function useFilters() {
    const{filters, setFilters} = useContext(FilterContext)
    
   const filterProduct = products =>{
    return products.filter(products =>{
        return (
           filters.categoria === "all" || products.Categoria === filters.categoria
        )
    })
   }

 return {
    filterProduct, setFilters, filters
 };

}