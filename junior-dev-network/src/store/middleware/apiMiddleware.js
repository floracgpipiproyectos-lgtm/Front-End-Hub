// store/middleware/apiMiddleware.js
import { createAction } from '@reduxjs/toolkit'

// Acciones para el middleware
createAction('api/callBegan');
createAction('api/callSuccess');
createAction('api/callFailed');

// Middleware para manejar llamadas API


// Helper para crear acciones API de manera tipada
