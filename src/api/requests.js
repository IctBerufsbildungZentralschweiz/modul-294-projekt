import { useToken } from './auth'

const backend = 'https://backend.m294.ict-bz.ch/projekt'

const { token, setToken } = useToken()

// Lädt die Feedbacks
export async function fetchFeedback () {
    const response = await request('/feedback')

    return response.data
}

// Erhöht die Votes eines Feedbacks
export async function voteFeedback (id) {
    const response = await request(`/feedback/${id}`, {
        method: 'PATCH',
    })

    return response.data
}

// Sendet das Feedback-Formular ans backend.
export async function submitFeedback (title, text, category) {
    const response = await request(`/feedback`, {
        method: 'POST',
        body: JSON.stringify({ title, text, category }),
    })

    return response.data
}

// Sendet das Login-Formular ans backend.
export async function login (email, password) {
    const response = await request(`/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    })

    if (response.token) {
        setToken(response.token)
    }

    return response.token
}

// Überprüft, ob das Session-Token gültig ist.
export async function checkAuth () {
    try {
        const response = await request(`/auth`, {
            method: 'GET',
        })

        return response.user
    } catch (error) {
        return false
    }
}

async function request (url, options) {
    const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    }

    if (token.value) {
        headers['Authorization'] = 'Bearer ' + token.value
    }

    const response = await fetch(backend + url, { headers, ...options })

    if (response.ok) {
        return response.json()
    } else if (response.status === 422) {
        const data = await response.json()

        throw new ValidationError('validation failed', data.errors)
    } else {
        throw new Error(`Server error: ${await response.text()}`)
    }
}

class ValidationError {
    message
    errors

    constructor (message, errors) {
        this.message = message
        this.errors = errors
    }
}