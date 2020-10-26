console.clear()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")

const app = express()

app.use(express.static("./public"))
app.use(helmet())
app.use(morgan("tiny"))
app.use(cors())
app.use(express.json())

// app.get("/url/:id", (req, res) => {
//   // TODO: create a short url
// })
// app.get("/:id", (req, res) => {
//   // TODO: redirect to url
// })

// app.post("/url", (req, res) => {
//   // TODO: create a short url
// })

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`)
})
