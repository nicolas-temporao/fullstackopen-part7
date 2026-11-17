const key = 'loggedInUser'

export const getUser = () => {
    const savedUser = window.localStorage.getItem(key)
    return savedUser ? JSON.parse(savedUser) : null
}

export const saveUser = (user) => {
    window.localStorage.setItem(key, JSON.stringify(user))
}

export const removeUser = () => {
    window.localStorage.removeItem(key)
}

