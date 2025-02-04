import { createContext, useState } from "react";

export const EstadoContext = createContext();


export function EstadoProvider ({children}){
    const [isCartOpen, setisCartOpen] = useState(false)

    return (
        <EstadoContext.Provider value={{isCartOpen, setisCartOpen}}>


    {children}

        </EstadoContext.Provider>
    )
}