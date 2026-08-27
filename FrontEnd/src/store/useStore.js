import { create } from 'zustand'
import { signOut } from 'firebase/auth'
import { auth } from '../components/layoudShopLogM/firebase/firebase'
import { devtools, persist } from 'zustand/middleware'
import { crearPedido } from "../api/orders.api";

// clave de línea de carrito: producto + variante.
// fallback para ítems guardados antes de que existieran las variantes
export const getCarritoId = (item) =>
  item?.carritoId || `${item?._id}__${item?.variante || ""}`;

// stock efectivo de un producto: suma de sus variantes si las tiene, si no su stock
export const stockEfectivo = (p) => {
  if (Array.isArray(p?.variantes) && p.variantes.length > 0) {
    return p.variantes.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
  }
  return p?.stock;
};

const useStore = create(
  devtools(
    persist(
    (set, get) => ({
      Carrito: [],
      Pedidos: [],
      user: null,
      loadingPedido: false,
      errorPedido: null,

      setUser: (user) => set({ user }),

      logout: async () => {
        await signOut(auth)
        set({ user: null, Carrito: [] })
      },

      addCarrito: (producto) =>
        set((state) => {
          const tieneVariantes = Array.isArray(producto.variantes) && producto.variantes.length > 0

          // límite de stock: el de la variante seleccionada (si aplica) o el general
          let limite = stockEfectivo(producto)
          if (tieneVariantes && producto.variante) {
            const vObj = producto.variantes.find((v) => v.nombre === producto.variante)
            limite = vObj ? Number(vObj.stock) || 0 : (stockEfectivo(producto) ?? null)
          }
          const tieneStock = limite !== undefined && limite !== null
          if (tieneStock && limite <= 0) return state

          const carritoId = getCarritoId(producto)

          // el stock es por variante: se suma lo del mismo producto + misma variante
          const totalEnCarrito = state.Carrito
            .filter((item) => getCarritoId(item) === carritoId)
            .reduce((acc, item) => acc + item.cantidad, 0)
          if (tieneStock && totalEnCarrito >= limite) return state

          const existe = state.Carrito.find(
            (item) => getCarritoId(item) === carritoId,
          )

          if (existe) {
            return {
              Carrito: state.Carrito.map((item) =>
                getCarritoId(item) === carritoId
                  ? { ...item, cantidad: item.cantidad + 1 }
                  : item,
              ),
            }
          }

          return {
            Carrito: [
              ...state.Carrito,
              { ...producto, carritoId, limiteStock: limite, cantidad: 1 },
            ],
          }
        }),

      addAumentar: (carritoId) =>
        set((state) => ({
          Carrito: state.Carrito.map((item) => {
            if (getCarritoId(item) !== carritoId) return item
            const limite = item.limiteStock
            const tieneStock = limite !== undefined && limite !== null
            if (tieneStock && item.cantidad >= limite) return item
            return { ...item, cantidad: item.cantidad + 1 }
          }),
        })),

      addDisminuir: (carritoId) =>
        set((state) => ({
          Carrito: state.Carrito.map((item) =>
            getCarritoId(item) === carritoId
              ? { ...item, cantidad: item.cantidad - 1 }
              : item,
          ).filter((item) => item.cantidad > 0),
        })),

      addEliminar: (carritoId) =>
        set((state) => ({
          Carrito: state.Carrito.filter(
            (item) => getCarritoId(item) !== carritoId,
          ),
        })),

      addPedidos: async (pedido) => {
        if (!pedido.productos || pedido.productos.length === 0) return false;

        set({ loadingPedido: true, errorPedido: null });

        try {
          const { data } = await crearPedido(pedido);

          set((state) => ({
            Pedidos: [...state.Pedidos, data],
            Carrito: [],
            loadingPedido: false,
          }));

          return true;

        } catch (error) {
          const msg = error.response?.data?.error || error.message || "Error al enviar pedido";
          set({
            errorPedido: msg,
            loadingPedido: false,
          });
          return false;
        }
      },

      limpiaCarrito: () => set({ Carrito: [] }),

      getTotalCarrito: () => {
        return get().Carrito.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0,
        )
      },
    }),
    {
      name: "StorePersist",
      partialize: (state) => ({
        Carrito: state.Carrito,
        Pedidos: state.Pedidos,
      }),
    }
    ),
  ),
)

export default useStore
