import Axios from "axios"
import React, { useState } from "react"

function UserCard(props) {
    const [isEditing, setIsEditing] = useState(false)
    const [draftName, setDraftName] = useState("")
    const [file, setFile] = useState()
    const [draftQuiz, setDraftQuiz] = useState("")
    const [draftTechSessions, setDraftTechSessions] = useState("")
    const [draftNonTechSessions, setDraftNonTechSessions] = useState("")
    // const [draftLastSession, setDraftLastSession] = useState("")

    async function submitHandler(e) {
        e.preventDefault()
        setIsEditing(false)
        props.setUsers(prev =>
            prev.map(function (user) {
                if (user._id == props.id) {
                    return { ...user, name: draftName, quiz: draftQuiz, techSession: draftTechSessions, nonTechSession: draftNonTechSessions }
                }
                return user
            })
        )
        const data = new FormData()
        if (file) {
            data.append("photo", file)
        }
        data.append("_id", props.id)
        data.append("name", draftName)
        data.append("quiz", draftQuiz)
        data.append("techSession", draftTechSessions)
        data.append("nonTechSession", draftNonTechSessions)
        // data.append("lastSession", draftLastSession)
        const newPhoto = await Axios.post("/update-user", data, { headers: { "Content-Type": "multipart/form-data" } })
        if (newPhoto.data) {
            props.setUsers(prev => {
                return prev.map(function (user) {
                    if (user._id == props.id) {
                        return { ...user, photo: newPhoto.data }
                    }
                    return user
                })
            })
        }
    }

    return (
        <div className="card">
            <div className="our-card-top">
                {isEditing && (
                    <div className="our-custom-input">
                        <div className="our-custom-input-interior">
                            <input onChange={e => setFile(e.target.files[0])} className="form-control form-control-sm" type="file" />
                        </div>
                    </div>
                )}
                <img src={props.photo ? `/uploaded-photos/${props.photo}` : "/fallback.png"} className="card-img-top" alt={`The user is ${props.name}`} />
            </div>
            <div className="card-body">
                {!isEditing && (
                    <>
                        <h4>{props.name}</h4>
                        <p className="text-muted small">Quiz Count: {props.quiz}</p>
                        <p className="text-muted small">Tech Sessions: {props.techSession}</p>
                        <p className="text-muted small">Non Tech Sessions: {props.nonTechSession}</p>
                        {!props.readOnly && (
                            <>
                                <button
                                    onClick={() => {
                                        setIsEditing(true)
                                        setDraftName(props.name)
                                        setDraftQuiz(props.quiz)
                                        setDraftTechSessions(props.techSession)
                                        setDraftNonTechSessions(props.nonTechSession)
                                        setFile("")
                                    }}
                                    className="btn btn-sm btn-primary"
                                >
                                    Edit
                                </button>{" "}
                                <button
                                    onClick={async () => {
                                        const test = Axios.delete(`/user/${props.id}`)
                                        props.setUsers(prev => {
                                            return prev.filter(user => {
                                                return user._id != props.id
                                            })
                                        })
                                    }}
                                    className="btn btn-sm btn-outline-danger"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </>
                )}
                {isEditing && (
                    <form onSubmit={submitHandler}>
                        <div className="mb-1">
                            <input autoFocus onChange={e => setDraftName(e.target.value)} type="text" className="form-control form-control-sm" value={draftName} />
                        </div>
                        <div className="mb-2">
                            <input onChange={e => setDraftQuiz(e.target.value)} type="text" className="form-control form-control-sm" value={draftQuiz} />
                        </div>
                        <div className="mb-2">
                            <input onChange={e => setDraftTechSessions(e.target.value)} type="text" className="form-control form-control-sm" value={draftTechSessions} />
                        </div>
                        <div className="mb-2">
                            <input onChange={e => setDraftNonTechSessions(e.target.value)} type="text" className="form-control form-control-sm" value={draftNonTechSessions} />
                        </div>
                        <button className="btn btn-sm btn-success">Save</button>{" "}
                        <button onClick={() => setIsEditing(false)} className="btn btn-sm btn-outline-secondary">
                            Cancel
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default UserCard