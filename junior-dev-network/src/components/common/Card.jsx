/**
 * Componente Card reutilizable
 */
export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md border border-gray-100
        ${hover ? 'hover:shadow-lg hover:border-blue-200 transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
