import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  return (
    <footer id="contacto" className="footer-container">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Star-Accesorios - Todos los derechos reservados</p>

        <div className="footer-redes">
          <a
            href="https://www.instagram.com/tu_usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            
            {/* <FaWhatsapp className="icono" />
            WhatsApp */}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
