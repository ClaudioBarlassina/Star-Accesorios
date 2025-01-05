import { createContext, useState } from "react";

// Creamos el contexto

export const FilterContext = createContext();


// crear el Provider para proveer el contexto 

export function FilterProvider({children}){
    const [filters, setFilters] = useState({
        categoria: "all"
    })
    return(
        <FilterContext.Provider value={{
            filters, setFilters
        }}>
           {children}


        </FilterContext.Provider>
    )
}