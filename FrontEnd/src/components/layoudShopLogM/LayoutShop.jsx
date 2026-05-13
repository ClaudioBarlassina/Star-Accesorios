import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './LayoudShop.module.css'
import { ADMIN_EMAILS } from '../../config/admin.js'
import CardCarrito from '../layoudShopLogM/Card1-Carrito/CardCarrito'
import logo from '../layoudShopLogM/logo2.png'
import barra from './Botones/barra.svg'
import search from './Botones/search-normal.svg'
import users from './Botones/user.svg'
import Cart from './Botones/cart.svg'

export default function LayoutShop({
  children,
  onSearch,
  cartOpen,
  setCartOpen,
  prod,
  incr,
  decr,
  remov,
  user,
  logout,
  EnlaseFinalizar,
  authComponent
}) {
  const navigate = useNavigate()
  const isAdmin = user && ADMIN_EMAILS.includes(user.email)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const total = prod.reduce((acc, item) => {
    return acc + item.precio * item.cantidad
  }, 0)

  return (
    <>
      {/* 🔝 NAVBAR */}
      <header className={styles.navbar}>
        
        {/* IZQUIERDA */}
        <div className={styles.left}>
          <button onClick={() => setMenuOpen(true)}><img src={barra} alt="menu" /></button>

          <button onClick={() => setSearchOpen(!searchOpen)}><img src={search} alt="search" /></button>
        </div>

        {/* CENTRO */}
        <div className={styles.brand}>
          {/* <img src={logo} alt="logo" /> */}
          <h1 className='logoprincipal'>Star</h1>
        </div>

        {/* DERECHA */}
        <div className={styles.right}>
          
          {/* USER */}
          <div className={styles.userBox}>
            <button onClick={() => setUserOpen(!userOpen)}><img src={users} alt="menu" /></button>

            {userOpen && (
              <div className={styles.dropdown}>
                {!user ? (
                  <span>No logueado</span>
                ) : (
                  <>
                    <p style={{ margin: 0, fontSize: '14px' }}>{user.displayName || user.email}</p>
                    {isAdmin && (
                      <button style={{ backgroundColor: 'white', color: '#c9a84c', padding: '8px', border: '1px solid #c9a84c', fontSize: '12px', marginTop: '4px' }} onClick={() => { setUserOpen(false); navigate('/admin') }}>
                        Panel Admin
                      </button>
                    )}
                    <button style={{ backgroundColor: 'white', color: 'black', padding: '10px', border: '1px solid black', fontSize: '12px', marginTop: '4px' }} onClick={logout}>
                      Cerrar sesión
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* CART */}
          <button onClick={() => user && setCartOpen(true)}><img src={Cart} alt="cart" /></button>
          {prod.length > 0 && <p className={styles.cartBadge}>{prod.length}</p>}
        </div>
      </header>

      {/* 🔍 SEARCH BAR */}
      {searchOpen && (
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar productos..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      )}

      {/* CONTENIDO */}
      <main
        className={styles.content}
        style={{
          filter: user ? "none" : "blur(6px)",
          pointerEvents: user ? "auto" : "none",
        }}
      >
        {children}
      </main>

      {/* OVERLAY */}
      <div
        className={`${styles.overlay} ${
          menuOpen || cartOpen ? styles.overlayOpen : ''
        }`}
        onClick={() => {
          setMenuOpen(false)
          setCartOpen(false)
          setUserOpen(false)
        }}
      />

      {/* ☰ MENU IZQUIERDO */}
      <aside className={`${styles.drawer} ${menuOpen ? styles.open : ''}`}>
        <button onClick={() => setMenuOpen(false)}>✕</button>

        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/">Contacto</Link>
      </aside>

      {/* 🛒 CARRITO */}
      <aside className={`${styles.cart} ${cartOpen ? styles.open : ''}`}>
        <button className={styles.closeBtn} onClick={() => setCartOpen(false)}>✕</button>

        <h3>Carrito</h3>

        <div className={styles.cartContent}>
          {prod.map((item) => (
            <CardCarrito
              key={item._id}
              image={item.images[0].url}
              title={item.nombre}
              price={item.precio}
              quantity={item.cantidad}
              onIncrease={() => incr(item._id)}
              onDecrease={() => decr(item._id)}
              onRemove={() => remov(item._id)}
            />
          ))}
        </div>

        {prod.length > 0 && (
          <div className={styles.cartFooter}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <strong>${total.toLocaleString()}</strong>
            </div>

            <button className={styles.primary} onClick={EnlaseFinalizar}>
              Finalizar compra
            </button>

            <button
              className={styles.secondary}
              onClick={() => setCartOpen(false)}
            >
              Seguir comprando
            </button>
          </div>
        )}
      </aside>

      {!user && authComponent}
    </>
  )
}