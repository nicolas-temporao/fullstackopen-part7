import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useAnecdotes = () => {
    const [anecdotes, setAnecdotes] = useState([])

    useEffect(() => {
        anecdoteService.getAll().then(data => {
            setAnecdotes(data)
        })
    }, [])

    const addAnecdote = async (newAnecdote) => {
        const addedAnecdote = anecdoteService.createNew(newAnecdote)
        setAnecdotes(current => current.concat(addedAnecdote))
    }

    const deleteAnecdote = async(id) => {
        await anecdoteService.remove(id)

        setAnecdotes(current => current.filter(anecdote => anecdote.id !== id))
    }

    return { anecdotes, addAnecdote, deleteAnecdote }
}
