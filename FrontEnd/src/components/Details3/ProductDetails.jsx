import { useState, useEffect } from "react";
import useStore from "../../store/useStore";
import { useNavigate } from "react-router-dom";
import styles from "./ProductDetails.module.css";

export default function ProductDetails({ product }) {
  const [mainImage, setMainImage] = useState(null);
  const [varianteSel, setVarianteSel] = useState(null);
  const [qty, setQty] = useState(1);
  const addCarrito = useStore((s) => s.addCarrito);
  const navigate = useNavigate();

  const variantes = product?.variantes || [];

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0].url);
    }
    const vs = product?.variantes || [];
    const conStock = vs.find((v) => (Number(v.stock) || 0) > 0);
    setVarianteSel(conStock?.nombre || vs[0]?.nombre || null);
  }, [product]);

  if (!product) {
    return <div className={styles.loadingState}>Cargando producto...</div>;
  }

  const varianteSelObj = variantes.find((v) => v.nombre === varianteSel);

  // límite de stock: el de la variante seleccionada si el producto tiene
  // variantes; si no, el stock general del producto
  const limiteStock = variantes.length > 0
    ? (varianteSelObj ? Number(varianteSelObj.stock) || 0 : 0)
    : (product.stock ?? Infinity)

  const sinStock = Number.isFinite(limiteStock) && limiteStock <= 0
  const maxQty = limiteStock

  const elegirVariante = (v) => {
    if ((Number(v.stock) || 0) <= 0) return;
    setVarianteSel(v.nombre);
    if (v.imageUrl) setMainImage(v.imageUrl);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addCarrito({ ...product, variante: varianteSel || undefined });
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

        {Number.isFinite(limiteStock) && (
          <span className={`${styles.stockBadge} ${limiteStock <= 0 ? styles.stockOut : limiteStock <= 5 ? styles.stockLow : styles.stockOk}`}>
            {limiteStock <= 0 ? "Agotado" : limiteStock === 1 ? "Última unidad" : `${limiteStock} uni`}
          </span>
        )}

        {variantes.length > 0 && (
          <div className={styles.variants}>
            <label>Modelo / Tamaño</label>
            <div className={styles.variantChips}>
              {variantes.map((v) => {
                const agotada = (Number(v.stock) || 0) <= 0
                return (
                  <button
                    key={v.nombre}
                    type="button"
                    onClick={() => elegirVariante(v)}
                    disabled={agotada}
                    title={agotada ? "Sin stock" : `${v.stock} disponibles`}
                    className={`${styles.chip} ${varianteSel === v.nombre ? styles.chipActive : ""} ${agotada ? styles.chipDisabled : ""}`}
                  >
                  {v.nombre}
                </button>
                )
              })}
            </div>
          </div>
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