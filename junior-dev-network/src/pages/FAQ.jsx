/**
 * Página de FAQ (Preguntas Frecuentes)
 */
import { Link } from 'react-router-dom'

export default function FAQ() {
  const faqs = [
    {
      question: "¿Qué es JuniorDev?",
      answer: "JuniorDev es una plataforma diseñada para ayudar a desarrolladores junior a encontrar su primer trabajo en tecnología. Ofrecemos análisis de CV, proyectos sugeridos, conexión con mentores y un sistema de gamificación para motivar tu crecimiento."
    },
    {
      question: "¿Cuánto cuesta usar JuniorDev?",
      answer: "JuniorDev tiene un plan gratuito con funcionalidades básicas y un plan Pro de $9.99/mes con características adicionales como mentorías, badges premium y perfil destacado."
    },
    {
      question: "¿Cómo funciona el análisis de CV?",
      answer: "Simplemente sube tu CV en formato PDF o DOCX y nuestro sistema de IA analizará tu experiencia y habilidades técnicas para sugerirte proyectos y oportunidades adecuadas a tu nivel."
    },
    {
      question: "¿Qué son las mentorías?",
      answer: "Las mentorías son sesiones con desarrolladores experimentados que pueden guiarte en tu carrera, revisar tu código, dar feedback sobre tu portafolio y ayudarte a preparar entrevistas."
    },
    {
      question: "¿Cómo puedo conectar con otros desarrolladores?",
      answer: "Puedes enviar solicitudes de conexión a otros usuarios de la plataforma. El plan gratuito permite 3 conexiones al mes, mientras que el plan Pro ofrece conexiones ilimitadas."
    },
    {
      question: "¿Qué son los badges?",
      answer: "Los badges son reconocimientos que ganas al completar logros en la plataforma, como subir tu CV, completar proyectos, obtener mentorías, etc. Te ayudan a visualizar tu progreso."
    },
    {
      question: "¿Es seguro subir mi CV?",
      answer: "Sí, protegemos tus datos con encriptación y no compartimos tu información personal con terceros sin tu consentimiento."
    },
    {
      question: "¿Cómo puedo empezar?",
      answer: "¡Es muy fácil! Solo necesitas crear una cuenta gratuita, subir tu CV y comenzar a explorar proyectos y conectarte con otros desarrolladores."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h1>
          <p className="text-xl">Resolvemos tus dudas sobre JuniorDev</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">¿No encontraste la respuesta que buscabas?</p>
            <Link to="/contacto" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
