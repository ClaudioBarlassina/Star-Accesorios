import { useContext } from "react";
import { FilterContext } from "../Context/Filters";

export function useFilters() {
    const { filters, setFilters } = useContext(FilterContext);

    const filterProduct = (products) => {
        console.log(products.Categoria)
        return products.filter((product) => {
            return (
                (filters.categoria === "all" || product.Categoria === filters.categoria) &&
                (filters.subcategoria === "all" || product.SubCategoria === filters.subcategoria)
            );
        });
    };

    return {
        filterProduct,
        setFilters,
        filters,
    };
}
