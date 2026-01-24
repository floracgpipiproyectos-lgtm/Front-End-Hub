// store/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { profileService } from '@/api/services'
import { STORAGE_KEYS } from '@/constants/apiConfig'
import { LOADING_STATES } from '@/constants/apiConfig'

// Async Thunks
export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const profile = await profileService.getProfile()
            return profile
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (updateData, { rejectWithValue }) => {
        try {
            const updatedProfile = await profileService.updateProfile(updateData)
            return updatedProfile
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const uploadAvatar = createAsyncThunk(
    'profile/uploadAvatar',
    async ({ file, onProgress }, { rejectWithValue }) => {
        try {
            const result = await profileService.uploadAvatar(file, onProgress)
            return result
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updatePreferences = createAsyncThunk(
    'profile/updatePreferences',
    async (preferences, { rejectWithValue }) => {
        try {
            const updated = await profileService.updatePreferences(preferences)
            return updated
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

// Estado inicial
const initialState = {
    data: null,
    preferences: {
        theme: 'light',
        language: 'es',
        notifications: true,
        privacy: 'public'
    },
    status: LOADING_STATES.IDLE,
    error: null,
    avatarUpload: {
        progress: 0,
        isUploading: false,
        error: null
    },
    lastUpdated: null,
    stats: {
        profileCompleteness: 0,
        lastActivity: null
    }
}

// Slice
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileData: (state, action) => {
            state.data = action.payload
            state.lastUpdated = new Date().toISOString()
        },

        setProfilePreferences: (state, action) => {
            state.preferences = { ...state.preferences, ...action.payload }
        },

        setAvatarUploadProgress: (state, action) => {
            state.avatarUpload.progress = action.payload
            state.avatarUpload.isUploading = action.payload < 100
        },

        clearProfileError: (state) => {
            state.error = null
            state.status = LOADING_STATES.IDLE
        },

        updateProfileCompleteness: (state) => {
            if (!state.data) {
                state.stats.profileCompleteness = 0
                return
            }

            let score = 0
            const fields = [
                'avatarUrl', 'bio', 'location', 'currentTitle',
                'skills', 'projects', 'socialLinks'
            ]

            fields.forEach(field => {
                if (state.data[field]) {
                    if (Array.isArray(state.data[field]) && state.data[field].length > 0) {
                        score += 10
                    } else if (state.data[field] && state.data[field].toString().trim().length > 0) {
                        score += 10
                    }
                }
            })

            state.stats.profileCompleteness = Math.min(score, 100)
        },

        clearProfile: (state) => {
            state.data = null
            state.preferences = initialState.preferences
            state.status = LOADING_STATES.IDLE
            state.error = null
            state.lastUpdated = null
        }
    },
    extraReducers: (builder) => {
        // Fetch Profile
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.status = LOADING_STATES.LOADING
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.data = action.payload
                state.status = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()
                state.error = null
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = LOADING_STATES.ERROR
                state.error = action.payload
            })

        // Update Profile
        builder
            .addCase(updateProfile.pending, (state) => {
                state.status = LOADING_STATES.LOADING
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.data = action.payload
                state.status = LOADING_STATES.SUCCESS
                state.lastUpdated = new Date().toISOString()
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.status = LOADING_STATES.ERROR
                state.error = action.payload
            })

        // Upload Avatar
        builder
            .addCase(uploadAvatar.pending, (state) => {
                state.avatarUpload.isUploading = true
                state.avatarUpload.progress = 0
                state.avatarUpload.error = null
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.avatarUpload.isUploading = false
                state.avatarUpload.progress = 100

                // Actualizar avatar en datos del perfil
                if (state.data) {
                    state.data.avatarUrl = action.payload.avatarUrl
                }

                state.lastUpdated = new Date().toISOString()
            })
            .addCase(uploadAvatar.rejected, (state, action) => {
                state.avatarUpload.isUploading = false
                state.avatarUpload.error = action.payload
            })

        // Update Preferences
        builder
            .addCase(updatePreferences.fulfilled, (state, action) => {
                state.preferences = action.payload
            })
    }
})

// Exportar acciones y reducer
export const {
    setProfileData,
    setProfilePreferences,
    setAvatarUploadProgress,
    clearProfileError,
    updateProfileCompleteness,
    clearProfile
} = profileSlice.actions

export default profileSlice.reducer