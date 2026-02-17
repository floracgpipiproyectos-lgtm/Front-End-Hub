/**
 * Página de Privacidad
 */
export default function Privacidad() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
          <p className="text-xl">Cómo protegemos tus datos personales</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="prose lg:prose-xl">
            <p className="text-gray-600 mb-6">
              Última actualización: Enero 2025
            </p>

            <h2 className="text-2xl font-bold mb-4">1. Introducción</h2>
            <p className="text-gray-600 mb-6">
              En JuniorDev, nos comprometemos a proteger tu privacidad. Esta política de privacidad 
              describe cómo recopilamos, usamos y protegemos tu información personal.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Información que recopilamos</h2>
            <p className="text-gray-600 mb-6">
              Recopilamos información que nos proporcionas al crear una cuenta, como tu nombre, 
              correo electrónico, yCV. También recopilamos información sobre cómo usas nuestra plataforma.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. Cómo usamos tu información</h2>
            <p className="text-gray-600 mb-6">
              Usamos tu información para proporcionarte nuestros servicios, personalizar tu experiencia, 
              comunicarnos contigo y mejorar nuestra plataforma.
            </p>

            <h2 className="text-2xl font-bold mb-4">4. Protección de datos</h2>
            <p className="text-gray-600 mb-6">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos 
              contra acceso no autorizado, modificación o destrucción.
            </p>

            <h2 className="text-2xl font-bold mb-4">5. Tus derechos</h2>
            <p className="text-gray-600 mb-6">
              Tienes derecho a acceder, corregir o eliminar tus datos personales. 
              Puedes ejercer estos derechos contactándonos en cualquier momento.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Contacto</h2>
            <p className="text-gray-600 mb-6">
              Si tienes preguntas sobre esta política de privacidad, por favor contactános 
              en privacy@juniordev.com
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
