const express = require('express')
const { isWebUri } = require('valid-url')
const uuid = require('uuid/v4')
const logger = require('../logger')
const { bookmarks } = require('../store')
const BookmarksService = require('../bookmarks-service')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: bookmark.title,
    web: bookmark.content,
    descript: bookmark.descript,
    rating: bookmark.rating
  })

bookmarkRouter
    .route('/bookmarks')
    .get((req, res)=> {
        res.json(bookmarks);
    })
    .post(bodyParser, (req, res, next) => {
        for(const field of ['title', 'url', 'rating']){
            if(!req.body[field]){
                logger.error(`${field} is required`)
                return res.status(400).send({
                    error: { message: `'${field}' is required`}
                })
            }
        }
        const { title, web, descript, rating} = req.body
        if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
            logger.error(`Invalid rating '${rating}' supplied`)
            return res.status(400).send(`'rating' must be a number between 0 and 5`)
          } 

        if (!isWebUri(web)) {
            logger.error(`Invalid url '${web}' supplied`)
            return res.status(400).send({
                error: { message: `'url' must be a valid URL` }
        })
        }

        const newBookmark = { title, web, descript, rating }

        const id =uuid();
        BookmarksService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
        .then(bookmark => {
            logger.info(`Bookmark with id ${id} created`);
            res
                .status(201)
                .location(`/bookmarks/${bookmark.id}`)
                .json(serializeBookmark(bookmark))
        })
        .catch(next)

    })

bookmarkRouter
    .route('/bookmarks/:bookmark_id')
    .all((req, res, next) => {
        const { bookmark_id } =  req.params;
        BookmarksService.getById(req.app.get('db'), bookmark_id)
        .then(bookmark => {
            if(!bookmark){
                logger.error(`Bookmark with ${id} not found.`);
                return res.status(404).json({
                    error: { message: 'Bookmark not found'}
                });
            }
            res.bookmark = bookmark
            next()
        }) 
        .catch(next)
    })
    .get((req, res) => {
        res.json(serializedBookmark(res.bookmark));
    })
    .delete((req, res, next) => {
        const { bookmark_id } = req.params
        BookarksService.deleteBookmark(
          req.app.get('db'),
          bookmark_id
        )
          .then(numRowsAffected => {
            logger.info(`Bookmark with id ${bookmark_id} deleted.`)
            res.status(204).end()
          })
          .catch(next)
      })

    module.exports = bookmarkRouter