// components/ui/ThemeToggle.jsx
import React from 'react'
import { useUI } from '@/store/hooks/useUI'

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useUI()

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
            {isDarkMode ? '☀️' : '🌙'}
        </button>
    )
}

export default ThemeToggle