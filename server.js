const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const multer = require('multer');
const upload = multer();
const sanitizeHTML = require('sanitize-html');
const fse = require('fs-extra');
const sharp = require('sharp');
let db;
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { getNextSessionsHelper } = require("./helpers");
const UserCard = require('./src/components/UserCard').default;

fse.ensureDirSync(path.join("public", "uploaded-photos"));

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    const allNames = await db.collection("Users").find().sort({ name: 1 }).toArray();
    console.log(allNames);
    const sessionNames = getNextSessionsHelper(allNames);
    const generatedHTML = ReactDOMServer.renderToString(
        <div className="container pt-3">
            <h1 className="mb-3">Dashboard</h1>
            <h3>Next week's sessions are taken by </h3>
            {/* <table>
                <thead>
                    <tr>
                        <td>Quiz</td>
                        <td>Tech Session</td>
                        <td>Non Tech Session</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{sessionNames.quiz}</td>
                        <td>{sessionNames.techSession}</td>
                        <td>{sessionNames.nonTechSession}</td>
                    </tr>
                </tbody>
            </table> */}
            <h6>Quiz: {sessionNames.quiz}</h6>
            <h6>Tech Session: {sessionNames.techSession}</h6>
            <h6>Non Tech Session: {sessionNames.nonTechSession}</h6>
            <div className="user-grid mb-3 mt-4">
                {allNames.map(user => <UserCard key={user._id} name={user.name} quiz={user.quiz} techSession={user.techSession} nonTechSession={user.nonTechSession} photo={user.photo} id={user._id} readOnly={true} />)}
            </div>
            <p><a href="/edit">Edit Users</a></p>

        </div>
    )
    res.render("home", { generatedHTML });
});

app.get("/edit", (req, res) => {
    res.render("edit");
});

app.get("/api/users", async (req, res) => {
    const allNames = await db.collection("Users").find().sort({ name: 1 }).toArray();
    res.json(allNames);
})

app.post("/create-user", upload.single("photo"), ourCleanup, async (req, res) => {
    if (req.file) {
        const photoFileName = `${Date.now()}.jpg`;
        await sharp(req.file.buffer).resize(844, 456).jpeg({ quality: 60 }).toFile(path.join("public", "uploaded-photos", photoFileName))
        req.cleanData.photo = photoFileName
    }

    console.log(req.body);
    const info = await db.collection("Users").insertOne(req.cleanData);
    const newUser = await db.collection("Users").findOne({ _id: new ObjectId(info.insertedId) });
    res.send(newUser);
})

app.delete("/user/:id", async (req, res) => {
    if (typeof req.params.id != "string") req.params.id = ""
    const doc = await db.collection("Users").findOne({ _id: new ObjectId(req.params.id) });
    if (doc.photo) {
        fse.remove(path.join("public", "uploaded-photos", doc.photo))
    }
    db.collection("Users").deleteOne({ _id: new ObjectId(req.params.id) });
    res.send("Deleted");
})

app.post("/update-user", upload.single("photo"), ourCleanup, async (req, res) => {
    if (req.file) {
        const photoFileName = `${Date.now()}.jpg`;
        await sharp(req.file.buffer).resize(844, 456).jpeg({ quality: 60 }).toFile(path.join("public", "uploaded-photos", photoFileName))
        req.cleanData.photo = photoFileName
        const info = await db.collection("Users").findOneAndUpdate({ _id: new ObjectId(req.body._id) }, { $set: req.cleanData })
        if (info.value.photo) {
            fse.remove(path.join("public", "uploaded-photos", info.value.photo))
        }
        res.send(photoFileName)
    } else {
        db.collection("Users").findOneAndUpdate({ _id: new ObjectId(req.body._id) }, { $set: req.cleanData })
        res.send(false)
    }
})

function ourCleanup(req, res, next) {
    if (typeof req.body.name != "string") req.body.name = ""
    if (typeof req.body.quiz != "string") req.body.quiz = ""
    if (typeof req.body.techSession != "string") req.body.techSession = ""
    if (typeof req.body.nonTechSession != "string") req.body.nonTechSession = ""
    if (typeof req.body._id != "string") req.body._id = ""

    req.cleanData = {
        name: sanitizeHTML(req.body.name.trim(), { allowedTags: [], allowedAttributes: {} }),
        quiz: sanitizeHTML(req.body.quiz.trim(), { allowedTags: [], allowedAttributes: {} }),
        techSession: sanitizeHTML(req.body.techSession.trim(), { allowedTags: [], allowedAttributes: {} }),
        nonTechSession: sanitizeHTML(req.body.nonTechSession.trim(), { allowedTags: [], allowedAttributes: {} })
    }

    next()
}


async function start() {
    const client = new MongoClient("mongodb://root:root@localhost:27017/RoApp?&authSource=admin");
    await client.connect();
    db = client.db();
    app.listen(3000)
}

start();

