const { gql } = require("apollo-server")
const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core")
const jwt = require("jsonwebtoken")
const isISBN = require("is-isbn")
const createDataLoaders = require("./dataloaders")

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const TOKEN_EXPIRATION_TIME = 1000 * 60 * 30 // half an hour

const schema = require("./schema")
const typeDefs = gql(schema)
const resolvers = require("./resolvers")
const plugins = [ApolloServerPluginLandingPageGraphQLPlayground()]
const introspection = true
const context = async ({ req }) => {
  const getUserDataFromReq = () => {
    const authHeader = req.headers?.authorization
    const token = authHeader && authHeader.replace("Bearer ", "")
    if (!token) throw new Error("Login required")
    const userData = jwt.verify(token, ACCESS_TOKEN_SECRET)
    return userData
  }

  const createToken = userData => jwt.sign(userData, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION_TIME })

  const validateISBN = isbn => isISBN.validate(isbn.replace("-", ""))

  const loaders = createDataLoaders()

  return { createToken, getUserDataFromReq, validateISBN, loaders }
}

module.exports = { typeDefs, resolvers, context, plugins, introspection }

