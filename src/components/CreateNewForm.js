import Axios from "axios"
import React, { useState, useRef } from "react"

function CreateNewForm(props) {
    const [name, setName] = useState("")
    const [quiz, setQuiz] = useState("")
    const [techSession, setTechSessions] = useState("")
    const [nonTechSession, setNonTechSessions] = useState("")
    const [file, setFile] = useState("")
    const CreatePhotoField = useRef()

    async function submitHandler(e) {
        e.preventDefault()
        const data = new FormData()
        data.append("photo", file)
        data.append("name", name)
        data.append("quiz", quiz)
        data.append("techSession", techSession)
        data.append("nonTechSession", nonTechSession)
        setName("")
        setQuiz("")
        setTechSessions("")
        setNonTechSessions("")
        setFile("")
        CreatePhotoField.current.value = ""
        const newPhoto = await Axios.post("/create-user", data, { headers: { "Content-Type": "multipart/form-data" } })
        props.setUsers(prev => prev.concat([newPhoto.data]))
    }

    return (
        <form className="p-3 bg-success bg-opacity-25 mb-5" onSubmit={submitHandler}>
            <div className="mb-2">
                <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
            </div>
            <div className="mb-2">
                <input onChange={e => setName(e.target.value)} value={name} type="text" className="form-control" placeholder="User name" />
            </div>
            <div className="mb-2">
                <input onChange={e => setQuiz(e.target.value)} value={quiz} type="text" className="form-control" placeholder="Quiz Count" />
            </div>
            <div className="mb-2">
                <input onChange={e => setTechSessions(e.target.value)} value={techSession} type="text" className="form-control" placeholder="Tech Sessions" />
            </div>
            <div className="mb-2">
                <input onChange={e => setNonTechSessions(e.target.value)} value={nonTechSession} type="text" className="form-control" placeholder="Non Tech Sessions" />
            </div>

            <button className="btn btn-success">Add New User!</button>
        </form>
    )
}

export default CreateNewForm