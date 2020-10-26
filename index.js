console.clear()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const yup = require("yup")
const { nanoid } = require("nanoid")
const monk = require("monk")

//  for security purposes
require("dotenv").config()

const mongo_DB_URI =
  process.env.NODE_ENV === "development"
    ? process.env.MONGO_DEVELOPMENT_URI
    : process.env.MONGO_PRODUCTION_URI

const db = monk(mongo_DB_URI)
const urls = db.get("urls")
urls.createIndex({ slug: 1 }, { unique: true })

const app = express()

app.use(express.static("./public"))
app.use(helmet())
app.use(morgan("tiny"))
app.use(cors())
app.use(express.json())

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().url().required(),
})

// app.get("/url/:id", (req, res) => {
//   // TODO: create a short url
// })

app.get("/list", async (req, res) => {
  const shortUrls = await urls.find()
  let list = []
  shortUrls.forEach(element => {
    list.push({
      slug: `${element.slug}`,

      url: element.url,
    })
  })
  res.json(list)
})

app.delete("/delete", async (req, res) => {
  const { slug } = req.body
  console.log("slug", req.body)

  try {
    const response = await urls.remove({ slug: slug })
    if (response.result.ok) {
      res.redirect("/")
    }
  } catch (error) {
    res.json(error)
  }
})

app.get("/:id", async (req, res) => {
  // TODO: redirect to url
  const { id: slug } = req.params
  try {
    const url = await urls.findOne({ slug })
    if (url) {
      res.redirect(url.url)
    }
    res.redirect(`/?error=${slug} not found`)
  } catch (error) {
    res.redirect(`/?error=link not found`)
  }
})

app.post("/url", async (req, res, next) => {
  // TODO: create a short url
  let { slug, url } = req.body
  try {
    await schema.validate({
      slug,
      url,
    })
    if (!slug) {
      slug = nanoid(5)
    } else {
      const existing = await urls.findOne({ slug })
      if (existing) {
        throw new Error("Slug is in use")
      }
    }
    slug = slug.toLowerCase()
    const newUrl = {
      slug,
      url,
    }
    const created = await urls.insert(newUrl)
    res.json(created)
  } catch (error) {
    next(error)
  }
})

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status)
  } else {
    res.status(500)
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "🍰" : error.stack,
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`)
})
