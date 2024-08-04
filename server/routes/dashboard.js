const express = require('express')
const router = express.Router()
const isLoggedin = require('../middleware/checkAuth')
const dashboardController = require('../controllers/dashboardController')

/**
 * Dashboard Routes
 */
 
router.get('/', isLoggedin,  dashboardController.dashboard, ) // get all notes for current user
router.get('/new-note', isLoggedin, dashboardController.dashboardNewNote) // get new-note page
router.get('/search', isLoggedin, dashboardController.searchNotes)
router.post('/search', isLoggedin, dashboardController.submitSearchNotes) // search notes

router.get('/note/:id', isLoggedin, dashboardController.getNote) // get note by id
router.put('/note/:id', isLoggedin, dashboardController.updateNote) // update note by id
router.delete('/note/:id', isLoggedin, dashboardController.deleteNote) // delete note by id
router.post('/new-note', isLoggedin, dashboardController.addNote) // add new note

module.exports = router