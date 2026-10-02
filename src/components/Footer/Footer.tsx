import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__copy">
          <span className="footer__logo">SB</span>
          <span>© 2026 SocoBlocks México. Homenajes con bloques plásticos coleccionables.</span>
        </div>
        <nav className="footer__links">
          <a href="#garantia">Garantía de Piezas</a>
          <a href="#comunidad">Comunidad MOC</a>
          <a href="#terminos">Términos de Servicio</a>
        </nav>
      </div>
    </footer>
  )
}
