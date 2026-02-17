/**
 * Componente Footer
 * ACTUALIZADO: Usa React Router Links en lugar de anchor tags
 */
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">🚀 JuniorDev</h3>
            <p className="text-gray-400">Conectando talento junior con oportunidades reales.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/caracteristicas" className="hover:text-white">Características</Link></li>
              <li><Link to="/precios" className="hover:text-white">Precios</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/mentores" className="hover:text-white">Mentores</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Comunidad</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Discord</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/privacidad" className="hover:text-white">Privacidad</Link></li>
              <li><Link to="/terminos" className="hover:text-white">Términos</Link></li>
              <li><Link to="/contacto" className="hover:text-white">Contacto</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 JuniorDev Network. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
