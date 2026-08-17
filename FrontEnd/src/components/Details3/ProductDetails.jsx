import { useState, useEffect } from "react";
import useStore from "../../store/useStore";
import { useNavigate } from "react-router-dom";
import styles from "./ProductDetails.module.css";

export default function ProductDetails({ product }) {
  const [mainImage, setMainImage] = useState(null);
  const [qty, setQty] = useState(1);
  const addCarrito = useStore((s) => s.addCarrito);
  const navigate = useNavigate();

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0].url);
    }
  }, [product]);

  if (!product) {
    return <div className={styles.loadingState}>Cargando producto...</div>;
  }

  const sinStock = product.stock !== undefined && product.stock !== null && product.stock <= 0
  const maxQty = product.stock ?? Infinity

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addCarrito(product);
    }
    navigate("/order");
  };

  return (
    <div className={styles.container}>
      <div className={styles.gallery}>
        <img
          className={styles.mainImage}
          src={mainImage || product.images?.[0]?.url}
          alt={product.nombre}
        />
        <div className={styles.thumbnails}>
          {product.images?.map((img) => (
            <img
              key={img.url}
              src={img.url}
              alt=""
              onClick={() => setMainImage(img.url)}
              className={mainImage === img.url ? styles.thumbnailActive : ""}
            />
          ))}
        </div>
      </div>

      <div className={styles.info}>
        {product.categoria && (
          <span className={styles.category}>{product.categoria}</span>
        )}
        <h1 className={styles.name}>{product.nombre}</h1>
        <p className={styles.price}>${product.precio}</p>

        {product.stock !== undefined && product.stock !== null && (
          <span className={`${styles.stockBadge} ${product.stock <= 0 ? styles.stockOut : product.stock <= 5 ? styles.stockLow : styles.stockOk}`}>
            {product.stock <= 0 ? "Agotado" : product.stock === 1 ? "Última unidad" : `${product.stock} uni`}
          </span>
        )}

        <p className={styles.description}>{product.descripcion}</p>

        <div className={styles.quantity}>
          <label>Cantidad</label>
          <div className={styles.quantityControls}>
            <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)} disabled={qty >= maxQty}>+</button>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.buyButton} onClick={handleAddToCart} disabled={sinStock}>
            {sinStock ? "Sin stock" : "Agregar al carrito"}
          </button>
          <button
            className={styles.buyButtonVolver}
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </div>

      <div className={styles.details}>
        <h3>Detalles del producto</h3>
        <p>
          <strong>Categoría:</strong> {product.categoria}
        </p>
        <p>
          <strong>Subcategoría:</strong> {product.subcategoria}
        </p>
      </div>
    </div>
  );
}