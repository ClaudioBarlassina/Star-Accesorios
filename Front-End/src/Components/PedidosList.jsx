import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./PedidosList.css";

const PedidosList = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      const { data, error } = await supabase.from("Pedidos").select("*");
      if (error) {
        console.error("Error al obtener pedidos:", error);
      } else {
        setPedidos(data);
      }
    };
    fetchPedidos();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("Pedidos").delete().eq("id", id);
    if (!error) {
      setPedidos(pedidos.filter((pedido) => pedido.id !== id));
    } else {
      console.error("Error al eliminar pedido:", error);
    }
  };

  const handleCheckChange = async (id) => {
    const pedido = pedidos.find(p => p.id === id);
    const { error } = await supabase
      .from("Pedidos")
      .update({ tomado: !pedido.tomado })
      .eq("id", id);

    if (!error) {
      setPedidos(pedidos.map(p => p.id === id ? { ...p, tomado: !p.tomado } : p));
    } else {
      console.error("Error al actualizar el estado de toma:", error);
    }
  };

  return (
    <div className="orders-list-container">
      <h2 className="titulo">Lista de Pedidos</h2>
      <button className="boton-volver" onClick={() => navigate("/Admin")}>
        Volver
      </button>
      <ul className="lista-pedidos">
        {pedidos.map((pedido) => (
          <li
            key={pedido.id}
            className={`pedido-item ${pedido.tomado ? 'leido' : ''}`}
          >
            <div className="info-pedido">
              <p><strong>Cliente:</strong> {pedido.Cliente.nombre}</p>
              <p><strong>Localidad:</strong> {pedido.Cliente.ciudad}</p>
              <p><strong>Dirección:</strong> {pedido.Cliente.direccion}</p>
             
             
            </div>
            <div className="productos-pedido">
              <p><strong>Productos:</strong></p>
              <table className="tabla-productos">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.Productos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>
                      <td>{producto.cantidad}</td>
                      <td>${producto.importe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="boton eliminar" onClick={() => handleDelete(pedido.id)}>Eliminar</button>
            <label>
                <input
                  type="checkbox"
                  checked={pedido.tomado || false}
                  onChange={() => handleCheckChange(pedido.id)}
                />
                Leído
              </label>
              <p><strong>Total Pedido:</strong> ${pedido.Total}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PedidosList;
