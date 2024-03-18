import React, { useCallback, useEffect, useState } from 'react'
import Submit from './Submit'

const Todo = () => {
    const [todo, setTodo] = useState({
        title:'',
        description:''
    })
    const changeTodo=(e)=>{
        setTodo({...todo,[e.target.name]:e.target.value})
    }

    const [timer, setTimer]=useState('')

    const getTime=()=>{
        let datetext = new Date().toTimeString().split(' ')[0];
        setTimer(datetext)
    }

    useEffect(() => {
        const interval = setInterval(() => getTime(), 1000);    
        return () => clearInterval(interval);
      }, []);

    const handleSubmit = useCallback(() => console.log("submitted"), []);

    return (
        <>
        <div>
            {timer}
        </div>
            <div>
                <label htmlFor='title'>Title</label>
                <input type='text' id='title' name='title' value={todo.title} onChange={(e) => changeTodo(e)} />
            </div>
            <div>
                <label htmlFor='description'>Description</label>
                <input type='text' id='description' name='description' value={todo.description} onChange={(e) => changeTodo(e)} />
            </div>
            
            <Submit handleSubmit={handleSubmit}/>
        </>
    )
}

export default Todo