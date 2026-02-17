/**
 * Página de Términos y Condiciones
 */
export default function Terminos() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Términos y Condiciones</h1>
          <p className="text-xl">Las reglas de uso de JuniorDev</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="prose lg:prose-xl">
            <p className="text-gray-600 mb-6">
              Última actualización: Enero 2025
            </p>

            <h2 className="text-2xl font-bold mb-4">1. Aceptación de términos</h2>
            <p className="text-gray-600 mb-6">
              Al registrarte en JuniorDev, aceptas nuestros términos y condiciones. 
              Si no estás de acuerdo con estos términos, no deberías usar nuestra plataforma.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Uso de la plataforma</h2>
            <p className="text-gray-600 mb-6">
              Te comprometes a usar JuniorDev de manera lawful y de acuerdo con estos términos. 
              No puedes usar la plataforma para ningún propósito ilegal o no autorizado.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. Cuenta de usuario</h2>
            <p className="text-gray-600 mb-6">
              Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. 
              Aceptas ser responsable de todas las actividades que ocurran bajo tu cuenta.
            </p>

            <h2 className="text-2xl font-bold mb-4">4. Contenido del usuario</h2>
            <p className="text-gray-600 mb-6">
              Por contenido del usuario nos referimos a cualquier material que submiteas a la plataforma, 
              incluyendo tu CV, proyectos y comentarios. Retienes la propiedad de tu contenido.
            </p>

            <h2 className="text-2xl font-bold mb-4">5. Limitación de responsabilidad</h2>
            <p className="text-gray-600 mb-6">
              JuniorDev no será responsable por cualquier daño directo, indirecto, incidental o 
              consecuente resultado del uso de la plataforma.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Modificaciones</h2>
            <p className="text-gray-600 mb-6">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              El uso continuado de la plataforma después de los cambios constituye aceptación.
            </p>

            <h2 className="text-2xl font-bold mb-4">7. Contacto</h2>
            <p className="text-gray-600 mb-6">
              Si tienes preguntas sobre estos términos, por favor contactános en legal@juniordev.com
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
