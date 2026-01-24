/**
 * @fileoverview Utilidades para manejo de arrays y objetos
 */

/**
 * Elimina duplicados de un array
 * @param {Array} arr - Array a procesar
 * @param {Function} keyFn - Función para obtener clave única (opcional)
 * @returns {Array} Array sin duplicados
 */
export const unique = (arr, keyFn = null) => {
  if (!Array.isArray(arr)) return []

  if (keyFn) {
    const seen = new Set()
    return arr.filter(item => {
      const key = keyFn(item)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  return [...new Set(arr)]
}

/**
 * Agrupa elementos de un array por una propiedad
 * @param {Array} arr - Array a agrupar
 * @param {Function|string} keyFn - Función o propiedad para agrupar
 * @returns {Object} Objeto con elementos agrupados
 */
export const groupBy = (arr, keyFn) => {
  if (!Array.isArray(arr)) return {}

  return arr.reduce((groups, item) => {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn]
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {})
}

/**
 * Ordena array por una propiedad
 * @param {Array} arr - Array a ordenar
 * @param {string|Function} key - Propiedad o función para ordenar
 * @param {string} order - 'asc' o 'desc'
 * @returns {Array} Array ordenado
 */
export const sortBy = (arr, key, order = 'asc') => {
  if (!Array.isArray(arr)) return []

  return [...arr].sort((a, b) => {
    let aVal = typeof key === 'function' ? key(a) : a[key]
    let bVal = typeof key === 'function' ? key(b) : b[key]

    // Manejar valores null/undefined
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return order === 'asc' ? -1 : 1
    if (bVal == null) return order === 'asc' ? 1 : -1

    // Comparación
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Pagina un array
 * @param {Array} arr - Array a paginar
 * @param {number} page - Página (1-based)
 * @param {number} limit - Elementos por página
 * @returns {Object} Objeto con datos paginados
 */
export const paginate = (arr, page = 1, limit = 10) => {
  if (!Array.isArray(arr)) return { data: [], pagination: {} }

  const totalItems = arr.length
  const totalPages = Math.ceil(totalItems / limit)
  const currentPage = Math.max(1, Math.min(page, totalPages))
  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit

  return {
    data: arr.slice(startIndex, endIndex),
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1
    }
  }
}

/**
 * Busca elementos en un array
 * @param {Array} arr - Array a buscar
 * @param {string} query - Término de búsqueda
 * @param {string[]} fields - Campos donde buscar
 * @returns {Array} Elementos que coinciden
 */
export const search = (arr, query, fields = []) => {
  if (!Array.isArray(arr) || !query) return arr

  const searchTerm = query.toLowerCase()

  return arr.filter(item => {
    if (fields.length === 0) {
      // Buscar en todas las propiedades string
      return Object.values(item).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(searchTerm)
      )
    }

    // Buscar en campos específicos
    return fields.some(field => {
      const value = item[field]
      return typeof value === 'string' && value.toLowerCase().includes(searchTerm)
    })
  })
}

/**
 * Mezcla aleatoriamente un array
 * @param {Array} arr - Array a mezclar
 * @returns {Array} Array mezclado
 */
export const shuffle = (arr) => {
  if (!Array.isArray(arr)) return []

  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Obtiene elementos aleatorios de un array
 * @param {Array} arr - Array fuente
 * @param {number} count - Número de elementos a obtener
 * @returns {Array} Elementos aleatorios
 */
export const sample = (arr, count = 1) => {
  if (!Array.isArray(arr) || arr.length === 0) return []

  const shuffled = shuffle(arr)
  return shuffled.slice(0, Math.min(count, arr.length))
}

/**
 * Encuentra la intersección de múltiples arrays
 * @param {...Array} arrays - Arrays a comparar
 * @returns {Array} Elementos comunes
 */
export const intersection = (...arrays) => {
  if (arrays.length === 0) return []
  if (arrays.length === 1) return [...arrays[0]]

  return arrays.reduce((acc, arr) => {
    return acc.filter(item => arr.includes(item))
  })
}

/**
 * Encuentra la diferencia entre arrays
 * @param {Array} arr1 - Array principal
 * @param {Array} arr2 - Array a restar
 * @returns {Array} Elementos en arr1 pero no en arr2
 */
export const difference = (arr1, arr2) => {
  if (!Array.isArray(arr1)) return []
  if (!Array.isArray(arr2)) return [...arr1]

  return arr1.filter(item => !arr2.includes(item))
}

/**
 * Aplana un array anidado
 * @param {Array} arr - Array a aplanar
 * @param {number} depth - Profundidad máxima (Infinity por defecto)
 * @returns {Array} Array aplanado
 */
export const flatten = (arr, depth = Infinity) => {
  if (!Array.isArray(arr)) return [arr]

  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flatten(item, depth - 1))
    } else {
      acc.push(item)
    }
    return acc
  }, [])
}

/**
 * Chunk array en grupos más pequeños
 * @param {Array} arr - Array a dividir
 * @param {number} size - Tamaño de cada chunk
 * @returns {Array} Array de chunks
 */
export const chunk = (arr, size) => {
  if (!Array.isArray(arr) || size <= 0) return []

  const chunks = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

/**
 * Cuenta ocurrencias de elementos en un array
 * @param {Array} arr - Array a contar
 * @returns {Object} Objeto con conteos
 */
export const countBy = (arr, keyFn = null) => {
  if (!Array.isArray(arr)) return {}

  return arr.reduce((counts, item) => {
    const key = keyFn ? keyFn(item) : item
    counts[key] = (counts[key] || 0) + 1
    return counts
  }, {})
}

/**
 * Encuentra el elemento más frecuente
 * @param {Array} arr - Array a analizar
 * @returns {any} Elemento más frecuente
 */
export const mostFrequent = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null

  const counts = countBy(arr)
  let maxCount = 0
  let mostFrequentItem = null

  for (const [item, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count
      mostFrequentItem = item
    }
  }

  return mostFrequentItem
}
