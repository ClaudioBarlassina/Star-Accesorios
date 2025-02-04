import "./Notificacion.css"
const Notificacion = ( {productos} ) => {
    return (
      <div className="conteiner-notificacion">
        {productos.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt={item.nombre} />
            <p>{item.nombre}</p>
            <p>Precio: ${item.precio}</p>
            <p>Cantidad: {item.quantity}</p>
          </div>
        ))}
    
       
      </div>
    );
  };
  
  export default Notificacion;
