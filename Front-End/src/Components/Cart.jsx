// import React, { useState } from 'react';
// import "./Cart.css";
// import { FaRegTrashAlt } from "react-icons/fa";
// import { Link } from 'react-router-dom';
// import { useCart } from '../Hook/useCart';
// import enviarEmail from "../complements/EnviarEmail"

// const Cart = () => {
//   const { cart, removeItem, updateQuantity } = useCart();

//   const contadores = cart.reduce((total, item) => total + item.quantity, 0);
//   const totalPrecio = cart.reduce((total, item) => total + (item.precio * item.quantity), 0);

//   // Estados para el formulario
//   const [formData, setFormData] = useState({
//     nombre: '',
//     direccion: '',
//     telefono: '',
//     email: '',
//     codigoPostal: '',
//     ciudad: '', // Nuevo estado para la ciudad
//     metodoPago: 'efectivo',
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Si es el código postal, validamos que solo tenga 4 dígitos
//     if (name === "codigoPostal" && value.length <= 4 && /^\d*$/.test(value)) {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     } else if (name !== "codigoPostal") {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }

//     // Si el campo es código postal, buscar la ciudad cuando tenga 4 dígitos
//     if (name === "codigoPostal" && value.length === 4) {
//       fetchCity(value); // Llamamos a la función para obtener la ciudad cuando el código postal tiene 4 dígitos
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Datos del cliente:", formData);
//   };

//   const fetchCity = async (codigoPostal) => {
//     if (!codigoPostal) {
//       setFormData({ ...formData, ciudad: '' }); // Si el código postal está vacío, vaciamos el campo ciudad
//       return;
//     }

//     try {
//       // Llamada a la API para obtener la ciudad usando Zippopotam.us
//       const response = await fetch(`https://api.zippopotam.us/ar/${codigoPostal}`);
//       const data = await response.json();

//       if (data && data.places && data.places.length > 0) {
//         const ciudad = data.places[0]['place name']; // Extraemos la ciudad de la respuesta
//         setFormData({ ...formData, ciudad }); // Actualizamos el estado con la ciudad obtenida
//       } else {
//         setFormData({ ...formData, ciudad: 'Ciudad no encontrada' });
//       }
//     } catch (error) {
//       console.error("Error al obtener la ciudad:", error);
//       setFormData({ ...formData, ciudad: 'Error al obtener la ciudad' });
//     }
//   };

//   return (
//     <div className='Cont-Cart'>
//       <h2>PREPARAMOS TU PEDIDO </h2>
//       {cart.map((item, index) => (
//         <div key={index} className="cart-item">
//           <img src={item.image} alt="" className="imagen-items-carrito" />
//           <div className="cant-nombre">
//             <p>{item.nombre}</p>
//             <div className="conjunto-botones">
//               <button
//                 className="botton-carrito"
//                 onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                 disabled={item.quantity <= 1}
//               >
//                 -
//               </button>
//               <span>{item.quantity}</span>
//               <button
//                 className="botton-carrito"
//                 onClick={() => updateQuantity(item.id, item.quantity + 1)}
//               >
//                 +
//               </button>
//             </div>
//           </div>
//           <div>
//             <FaRegTrashAlt className="boton-borrar" onClick={() => removeItem(item.id)} />
//             <p> c/u ${item.precio}</p>
//           </div>
//           <p> ${item.precio * item.quantity}</p>
//         </div>
//       ))}
//       <div className='carrito-pagina'>
//         <span>{`Cantidad Total: ${contadores}`}</span>
//         <span>{`Total a pagar: $${totalPrecio}`}</span>
//       </div>

//       <form onSubmit={handleSubmit} className="form-datos">
//         <h3>Ingresa tus datos</h3>
//         <div>
//           <label htmlFor="nombre">Nombre:</label>
//           <input
//             type="text"
//             id="nombre"
//             name="nombre"
//             value={formData.nombre}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="direccion">Dirección:</label>
//           <input
//             type="text"
//             id="direccion"
//             name="direccion"
//             value={formData.direccion}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="telefono">Teléfono:</label>
//           <input
//             type="text"
//             id="telefono"
//             name="telefono"
//             value={formData.telefono}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         {/* Nuevo campo Email */}
//         <div>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         {/* Nuevo campo Código Postal */}
//         <div>
//           <label htmlFor="codigoPostal">Código Postal:</label>
//           <input
//             type="text"
//             id="codigoPostal"
//             name="codigoPostal"
//             // value={formData.codigoPostal}
//             onInput={handleInputChange} // Cambié onChange por onInput
//             maxLength={4} // Limita a 4 dígitos
//             pattern="\d{4}" // Asegura que solo se acepten números de 4 dígitos
//             required
//           />
//         </div>

//         {/* Mostrar la ciudad si se obtiene */}
//         {formData.ciudad && (
//           <div>
//             <label htmlFor="ciudad">Ciudad:</label>
//             <input
//               type="text"
//               id="ciudad"
//               name="ciudad"
//               value={formData.ciudad}
//               readOnly
//             />
//           </div>
//         )}

//         <div>
//           <label htmlFor="metodoPago">Método de Pago:</label>
//           <select
//             id="metodoPago"
//             name="metodoPago"
//             value={formData.metodoPago}
//             onChange={handleInputChange}
//             required
//           >
//             <option value="efectivo">Efectivo</option>
//             <option value="transferencia">Transferencia</option>
//           </select>
//         </div>

//         {/* Mostrar los detalles de la cuenta para transferencia si el método de pago es transferencia */}
//         {formData.metodoPago === 'transferencia' && (
//           <div className="transferencia-info">
//             <h4>Detalles para la Transferencia:</h4>
//             <p><strong>Alias de Cuenta:</strong> MiAliasDeCuenta</p>
//             <p><strong>Banco:</strong> Banco XYZ</p>
//             <p><strong>Cbu:</strong> 1234567890123456789012</p>
//             <p><strong>Concepto:</strong> Compra en tienda online</p>
//             <p><strong>Valor a Transferir:</strong> ${totalPrecio}</p>
//             <p><em>Realiza la transferencia con los datos anteriores. Una vez realizada, por favor espera la confirmación de tu compra.</em></p>
//           </div>
//         )}

//         <button type="submit" className="" onClick={enviarEmail}>
//           Confirmar Datos y Finalizar Compra
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Cart;

import React, { useState } from 'react';
import "./Cart.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { useCart } from '../Hook/useCart';
import enviarEmail from "../complements/EnviarEmail";

const Cart = () => {
  const { cart, removeItem, updateQuantity } = useCart();

  const contadores = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrecio = cart.reduce((total, item) => total + (item.precio * item.quantity), 0);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    codigoPostal: '',
    ciudad: '',
    metodoPago: 'efectivo',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validar código postal (máximo 4 dígitos numéricos)
    if (name === "codigoPostal" && value.length <= 4 && /^\d*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
      if (value.length === 4) fetchCity(value);
    } else if (name !== "codigoPostal") {
      setFormData({ ...formData, [name]: value });
    }
  };

  const fetchCity = async (codigoPostal) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/ar/${codigoPostal}`);
      const data = await response.json();
      if (data?.places?.length > 0) {
        setFormData({ ...formData, ciudad: data.places[0]['place name'] });
      } else {
        setFormData({ ...formData, ciudad: 'Ciudad no encontrada' });
      }
    } catch (error) {
      setFormData({ ...formData, ciudad: 'Error al obtener la ciudad' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cart.length) {
      alert("Tu carrito está vacío");
      return;
    }

    // Crear el objeto pedido
    const pedido = {
      cliente: { ...formData },
      productos: cart.map(item => ({
        nombre: item.nombre,
        cantidad: item.quantity,
        total: item.precio * item.quantity
      })),
      total: totalPrecio,
    };

    console.log("Datos del pedido:", pedido);
    
    await enviarEmail(pedido); // Enviar email con el pedido
  };

  return (
    <div className='Cont-Cart'>
      <h2>PREPARAMOS TU PEDIDO </h2>
      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <img src={item.image} alt="" className="imagen-items-carrito" />
          <div className="cant-nombre">
            <p>{item.nombre}</p>
            <div className="conjunto-botones">
              <button className="botton-carrito" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
              <span>{item.quantity}</span>
              <button className="botton-carrito" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
          </div>
          <div>
            <FaRegTrashAlt className="boton-borrar" onClick={() => removeItem(item.id)} />
            <p> c/u ${item.precio}</p>
          </div>
          <p> ${item.precio * item.quantity}</p>
        </div>
      ))}
      <div className='carrito-pagina'>
        <span>{`Cantidad Total: ${contadores}`}</span>
        <span>{`Total a pagar: $${totalPrecio}`}</span>
      </div>

      {/* Formulario de datos del cliente */}
      <form onSubmit={handleSubmit} className="form-datos">
        <h3>Ingresa tus datos</h3>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="direccion">Dirección:</label>
          <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="telefono">Teléfono:</label>
          <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="codigoPostal">Código Postal:</label>
          <input type="text" id="codigoPostal" name="codigoPostal" onInput={handleInputChange} maxLength={4} pattern="\d{4}" required />
        </div>
        {formData.ciudad && (
          <div>
            <label htmlFor="ciudad">Ciudad:</label>
            <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} readOnly />
          </div>
        )}
        <div>
          <label htmlFor="metodoPago">Método de Pago:</label>
          <select id="metodoPago" name="metodoPago" value={formData.metodoPago} onChange={handleInputChange} required>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        {formData.metodoPago === 'transferencia' && (
          <div className="transferencia-info">
            <h4>Detalles para la Transferencia:</h4>
            <p><strong>Alias de Cuenta:</strong> MiAliasDeCuenta</p>
            <p><strong>Banco:</strong> Banco XYZ</p>
            <p><strong>Cbu:</strong> 1234567890123456789012</p>
            <p><strong>Concepto:</strong> Compra en tienda online</p>
            <p><strong>Valor a Transferir:</strong> ${totalPrecio}</p>
            <p><em>Realiza la transferencia con los datos anteriores. Una vez realizada, por favor espera la confirmación de tu compra.</em></p>
          </div>
        )}

        <button type="submit" className="btn-finalizar">
          Confirmar Datos y Finalizar Compra
        </button>
      </form>
    </div>
  );
}

export default Cart;
