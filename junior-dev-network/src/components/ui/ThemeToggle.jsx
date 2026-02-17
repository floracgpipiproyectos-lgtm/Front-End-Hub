/**
 * @fileoverview Componente ThemeToggle para cambiar entre tema claro y oscuro
 * Permite al usuario alternar entre modos de tema persistentemente
 */

import React from 'react'
import { useUI } from '@/store/hooks/useUI'

/**
 * Componente botón para alternar entre tema claro y oscuro
 * @component
 * @returns {React.ReactElement} Botón de cambio de tema
 * 
 * @example
 * <ThemeToggle />
 */
const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useUI()

    /**
     * Maneja el cambio de tema
     */
    const handleThemeToggle = () => {
        toggleTheme()
    }

    return (
        <button
            onClick={handleThemeToggle}
            className="theme-toggle"
            aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
        >
            {/* Icono del tema */}
            <span aria-hidden="true">
                {isDarkMode ? '☀️' : '🌙'}
            </span>
        </button>
    )

export default ThemeToggle