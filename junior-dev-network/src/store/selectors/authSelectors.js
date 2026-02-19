// store/selectors/authSelectors.js
import { createSelector } from '@reduxjs/toolkit'
import { APP_CONSTANTS } from '@/constants/appConstants'

// Selectores básicos
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user




// Selectores memoizados (derivados)
createSelector(
    [selectUser],
    (user) => {
        if (!user) return 'Usuario'
        return user.fullName || user.alias || user.email.split('@')[0]
    }
);

createSelector(
    [selectUser],
    (user) => {
        if (!user) return APP_CONSTANTS.DEFAULT_AVATAR
        return user.avatarUrl || APP_CONSTANTS.DEFAULT_AVATAR
    }
);

createSelector(
    [selectUser],
    (user) => {
        if (!user) return 'JD'
        const name = user.fullName || user.alias || user.email
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }
);

createSelector(
    [selectAuth],
    (auth) => {
        if (!auth.meta.sessionStart) return 0
        const start = new Date(auth.meta.sessionStart)
        const now = new Date()
        return Math.floor((now - start) / (1000 * 60)) // minutos
    }
);