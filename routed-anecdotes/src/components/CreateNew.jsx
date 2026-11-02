import { useNavigate } from "react-router"
import { useField } from "../hooks"
import { useAnecdotes } from "../hooks/useAnecdotes"

const CreateNew = () => {
  const { addAnecdote } = useAnecdotes()
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    await addAnecdote({ 
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate("/")
  } 

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }
  
  const {reset: resetContent, ...contentInput } = content
  const {reset: resetAuthor, ...authorInput } = author
  const {reset: resetInfo, ...infoInput } = info

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentInput}/>
        </div>
        <div>
          author
          <input {...authorInput}/>
        </div>
        <div>
          url for more info
          <input {...infoInput}/>
        </div>
        <button type='submit'>create</button><button type='button' onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
