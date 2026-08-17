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
                    <button style={{ backgroundColor: 'white', color: '#c9a84c', padding: '8px', border: '1px solid #c9a84c', fontSize: '12px', marginTop: '4px', cursor: 'pointer' }} onClick={() => { setUserOpen(false); navigate('/mis-pedidos') }}>
                      Mis Pedidos
                    </button>
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
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      )}

      {/* CONTENIDO */}
      <main
        className={styles.content}
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
              image={item.images?.[0]?.url || ''}
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

      <a
        href="https://wa.me/5493537571489"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappFloat}
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.054 9.374L1.054 31.25l6.118-1.97A15.907 15.907 0 0 0 16.004 32C24.83 32 32 24.822 32 16S24.83 0 16.004 0zm9.316 22.6c-.39 1.1-1.932 2.014-3.158 2.28-.84.18-1.936.322-5.642-1.214-4.746-1.966-7.796-6.79-8.032-7.104-.226-.314-1.9-2.53-1.9-4.826 0-2.294 1.206-3.42 1.634-3.884.39-.428.926-.55 1.232-.55.306 0 .612.003.882.016.284.013.664-.106 1.034.788.39.946 1.332 3.242 1.448 3.472.116.23.194.498.038.776-.152.29-.258.47-.492.726-.234.256-.476.452-.71.724-.212.234-.448.486-.19.912s1.154 1.916 2.496 3.106c1.724 1.53 3.138 2.006 3.598 2.214.39.178.832.14 1.082-.176.318-.4.7-1.016 1.094-1.632.28-.438.646-.494 1.064-.336.426.154 2.696 1.272 3.158 1.5.462.228.77.34.886.532.116.19.116 1.1-.276 2.2z"/>
        </svg>
      </a>
    </>
  )
}