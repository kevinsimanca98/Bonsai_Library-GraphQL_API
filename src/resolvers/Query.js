const { AuthorModel, BookModel, PublisherModel } = require("../model")

const QueryResolvers = {
  author: async (_, args, { getUserDataFromReq }) => {
    getUserDataFromReq()
    return AuthorModel.findById(args.id)
  },

  authors: async (_, args, { getUserDataFromReq }) => {
    getUserDataFromReq()
    return AuthorModel.find()
  },

  publisher: async (_, args) => PublisherModel.findById(args.id),
  publishers: async () => PublisherModel.find(),

  book: async (_, args) => BookModel.findById(args.id),
  books: async (_, args) => {
    const { page, amount, year, title, authorID, publisherID, orderBy, orderType } = args

    const entriesToShow = amount ?? 10
    const entriesToSkip = entriesToShow * (page - 1)

    const filter = {}
    if (year) filter.publicationYear = year
    if (title) filter.title = new RegExp(title, "i")
    if (authorID) filter.authorIDs = { $in: [authorID] }
    if (publisherID) filter.publisherID = publisherID

    return BookModel
      .find(filter)
      .sort([[orderBy, orderType]])
      .limit(entriesToShow)
      .skip(entriesToSkip)
  }
}

module.exports = QueryResolvers
