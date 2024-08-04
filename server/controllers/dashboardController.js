const Notes = require('../models/Notes')
const mongoose = require('mongoose')

exports.dashboard = async (req, res) => {

    let perPage = 12;
    let currentPage = req.query.page || 1;

    const locals = {
        title: "Dashboard",
        description: "Free NodeJS Notes App.",
    };

    try {

        const notes = await Notes.aggregate([
            { $sort: { updatedAt: -1 } },
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },

            {
                $project: {
                    title: { $substr: ["$title", 0, 50] },
                    body: { $substr: ["$body", 0, 100] },
                },
            }
        ])
            .skip(perPage * currentPage - perPage)
            .limit(perPage)
            .exec();

        const count = await Notes.countDocuments({ user: req.user.id })

        res.render('dashboard/index', {
            username: req.user.firstName,
            locals,
            notes,
            layout: "../views/layouts/dashboard",
            current: currentPage,
            pages: Math.ceil(count / perPage)
        });


    } catch (error) {
        console.log(error);
    }
};

exports.dashboardNewNote = async (req, res) => {
    res.render('dashboard/new-note', {
        layout: "../views/layouts/dashboard",
    });
}

// GET note by ID /dashboard/note/:id
exports.getNote = async (req, res) => {

    try {

        const locals = {
            title: 'New Note',
            description: 'Create a new note'
        }

        const note = await Notes.findById({ _id: req.params.id })
            .where({ user: req.user.id })
            .lean()

        if (note) {
            res.render("dashboard/view-note", {
                locals,
                noteId: req.params.id,
                note,
                layout: "../views/layouts/dashboard",
            });
        } else {
            res.send("Something went wrong.");
        }
    }
    catch (error) {
        res.status(404).render('404', {
            description: error.message,
            layout: '../views/layouts/main'
        }
        )
    }
}

exports.updateNote = async (req, res) => {
    try {

        await Notes.findOneAndUpdate(
            { _id: req.params.id },
            { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
        ).where({ user: req.user.id });

        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);

    }
}

exports.deleteNote = async (req, res) => {
    try {

        let ng = await Notes.deleteOne({ _id: req.params.id },)
            .where({ user: req.user.id });

        console.log(ng);
        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);

    }
}

exports.addNote = async (req, res) => {
    try {

        req.body.user = req.user.id;
        await Notes.create(req.body);

        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);

    }
}

/**
 * Search notes
 */

exports.searchNotes = async (req, res) => {
    try {
        res.render('dashboard/search', {
            searchResults: '',
            layout: "../views/layouts/dashboard",
        });

    }
    catch (error) {
        console.log(error);
    }

}

exports.submitSearchNotes = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const searchResults = await Notes.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
                { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
            ],
        }).where({ user: req.user.id });

        res.render("dashboard/search", {
            searchResults,
            layout: "../views/layouts/dashboard",
        });

    }
    catch (error) {
        console.log(error);
    }

}