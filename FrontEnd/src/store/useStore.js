import { create } from 'zustand'
import { signOut } from 'firebase/auth'
import { auth } from '../components/layoudShopLogM/firebase/firebase'
import { devtools, persist } from 'zustand/middleware'
import { crearPedido } from "../api/orders.api";

// clave de línea de carrito: producto + variante.
// fallback para ítems guardados antes de que existieran las variantes
export const getCarritoId = (item) =>
  item?.carritoId || `${item?._id}__${item?.variante || ""}`;

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
          const stock = producto.stock
          const tieneStock = stock !== undefined && stock !== null
          if (tieneStock && stock <= 0) return state

          // el stock es compartido entre variantes: se suma todo lo del mismo producto
          const totalEnCarrito = state.Carrito
            .filter((item) => item._id === producto._id)
            .reduce((acc, item) => acc + item.cantidad, 0)
          if (tieneStock && totalEnCarrito >= stock) return state

          const carritoId = getCarritoId(producto)
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
              { ...producto, carritoId, cantidad: 1 },
            ],
          }
        }),

      addAumentar: (carritoId) =>
        set((state) => ({
          Carrito: state.Carrito.map((item) =>
            getCarritoId(item) === carritoId
              ? { ...item, cantidad: item.cantidad + 1 }
              : item,
          ),
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
