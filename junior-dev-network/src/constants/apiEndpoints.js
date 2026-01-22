// Base URL de la API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Endpoints de Autenticación
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  OAUTH_LINKEDIN: '/auth/oauth/linkedin',
  OAUTH_GITHUB: '/auth/oauth/github',
}

// Endpoints de Análisis de CV
export const CV_ENDPOINTS = {
  UPLOAD: '/cv/upload',
  ANALYZE: '/cv/analyze',
  GET_ANALYSIS: '/cv/analysis/:id',
  GET_SKILLS: '/cv/skills',
  UPDATE_SKILLS: '/cv/skills',
  GET_SUGGESTIONS: '/cv/suggestions',
}

// Endpoints de Proyectos
export const PROJECT_ENDPOINTS = {
  GET_ALL: '/projects',
  GET_BY_ID: '/projects/:id',
  GET_RECOMMENDED: '/projects/recommended',
  GET_OPEN_SOURCE: '/projects/open-source',
  GET_FREELANCE: '/projects/freelance',
  GET_CHALLENGES: '/projects/challenges',
  JOIN_PROJECT: '/projects/:id/join',
  LEAVE_PROJECT: '/projects/:id/leave',
  COMPLETE_PROJECT: '/projects/:id/complete',
  GET_USER_PROJECTS: '/projects/user',
  SEARCH: '/projects/search',
}

// Endpoints de Networking
export const NETWORK_ENDPOINTS = {
  GET_MENTORS: '/network/mentors',
  GET_MENTOR_BY_ID: '/network/mentors/:id',
  REQUEST_MENTOR: '/network/mentors/:id/request',
  GET_COMMUNITIES: '/network/communities',
  JOIN_COMMUNITY: '/network/communities/:id/join',
  GET_CONNECTIONS: '/network/connections',
  SEND_CONNECTION_REQUEST: '/network/connections/request',
  ACCEPT_CONNECTION: '/network/connections/:id/accept',
  REJECT_CONNECTION: '/network/connections/:id/reject',
  GET_MESSAGES: '/network/messages',
  SEND_MESSAGE: '/network/messages',
}

// Endpoints de Gamificación
export const GAMIFICATION_ENDPOINTS = {
  GET_BADGES: '/gamification/badges',
  GET_USER_BADGES: '/gamification/badges/user',
  GET_PROGRESS: '/gamification/progress',
  GET_LEADERBOARD: '/gamification/leaderboard',
  CLAIM_BADGE: '/gamification/badges/:id/claim',
}

// Endpoints de Portafolio
export const PORTFOLIO_ENDPOINTS = {
  GET_PORTFOLIO: '/portfolio',
  GENERATE_PORTFOLIO: '/portfolio/generate',
  UPDATE_PORTFOLIO: '/portfolio',
  DEPLOY_PORTFOLIO: '/portfolio/deploy',
  GET_TEMPLATES: '/portfolio/templates',
  PREVIEW_PORTFOLIO: '/portfolio/preview',
}

// Endpoints de Perfil
export const PROFILE_ENDPOINTS = {
  GET_PROFILE: '/profile',
  UPDATE_PROFILE: '/profile',
  GET_PUBLIC_PROFILE: '/profile/:id',
  UPLOAD_AVATAR: '/profile/avatar',
  UPDATE_PREFERENCES: '/profile/preferences',
  DELETE_ACCOUNT: '/profile/delete',
}

// Endpoints de GitHub (integración externa)
export const GITHUB_ENDPOINTS = {
  GET_ISSUES: '/github/issues',
  GET_REPOSITORIES: '/github/repositories',
  SYNC_PROFILE: '/github/sync',
}

// Helper para reemplazar parámetros en URLs
export const buildEndpoint = (endpoint, params = {}) => {
  let url = endpoint
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key])
  })
  return url
}
