import { create } from 'zustand'
import { signOut } from 'firebase/auth'
import { auth } from '../components/layoudShopLogM/firebase/firebase'
import { devtools, persist } from 'zustand/middleware'
import { crearPedido } from "../api/orders.api";

const useStore = create(
  devtools(
    // persist(
    (set, get) => ({
      Carrito: [],
      Pedidos: [],
      user: null,
      

      // 🔐 AUTH
      setUser: (user) => set({ user }),

      logout: async () => {
        await signOut(auth)
        set({ user: null, Carrito: [] }) // opcional limpiar carrito
      },
      // 🛒 Agregar al carrito
      addCarrito: (producto) =>
        set((state) => {
          const existe = state.Carrito.find((item) => item._id === producto._id)

          if (existe) {
            return {
              Carrito: state.Carrito.map((item) =>
                item._id === producto._id
                  ? { ...item, cantidad: item.cantidad + 1 }
                  : item,
              ),
            }
          }

          return {
            Carrito: [...state.Carrito, { ...producto, cantidad: 1 }],
          }
        }),

      // ➕ Aumentar cantidad
      addAumentar: (id) =>
        set((state) => ({
          Carrito: state.Carrito.map((item) =>
            item._id === id ? { ...item, cantidad: item.cantidad + 1 } : item,
          ),
        })),

      // ➖ Disminuir cantidad
      addDisminuir: (id) =>
        set((state) => ({
          Carrito: state.Carrito.map((item) =>
            item._id === id ? { ...item, cantidad: item.cantidad - 1 } : item,
          ).filter((item) => item.cantidad > 0),
        })),

      // ❌ Eliminar producto
      addEliminar: (id) =>
        set((state) => ({
          Carrito: state.Carrito.filter((item) => item._id !== id),
        })),

     addPedidos: async (pedido) => {
  if (pedido.productos.length === 0) return;

  set({ loadingPedido: true, errorPedido: null });

  try {
    const { data } = await crearPedido(pedido);

    set((state) => ({
      Pedidos: [...state.Pedidos, data],
      Carrito: [],
      loadingPedido: false,
    }));

  } catch (error) {
    const msg = error.response?.data || error.message || "Error al enviar pedido";
    set({
      errorPedido: msg,
      loadingPedido: false,
    });
    throw error;
  }
},

      // 🧹 Limpiar carrito
      limpiaCarrito: () => set({ Carrito: [] }),

      // 📊 Obtener total carrito
      getTotalCarrito: () => {
        return get().Carrito.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0,
        )
      },
    }),
    // {
    //   name: "StorePersist",
    //   partialize: (state) => ({
    //     Carrito: state.Carrito,
    //     Pedidos: state.Pedidos,
    //   }),
    // }
    // )
  ),
)

export default useStore
