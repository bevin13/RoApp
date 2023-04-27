import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Axios from "axios";
import CreateNewForm from "./components/CreateNewForm";
import UserCard from "./components/UserCard";

function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function go() {
            const response = await Axios.get("/api/users");
            setUsers(response.data);
        }
        go()
    }, [])

    return (
        <div className="container">
            <p><a href="/">&laquo; Back to homepage</a></p>
            <h1>EDIT PAGE</h1>
            <CreateNewForm setUsers={setUsers} />
            <div className="user-grid">
                {users.map(function (user) {
                    return <UserCard key={user._id} name={user.name} quiz={user.quiz} techSession={user.techSession} nonTechSession={user.nonTechSession} photo={user.photo} id={user._id} setUsers={setUsers} />
                })}
            </div>
        </div>
    )
}

const root = createRoot(document.querySelector("#app"))
root.render(<App />)