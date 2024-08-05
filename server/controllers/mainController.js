const expressEjsLayouts = require("express-ejs-layouts")

exports.homepage = async (req, res) => {
    const locals = {
        title: 'NodeNotes',
        description: 'A simple notes app made with Node.js',
        signedIn: req.user ? true : false
    }

    res.render('index', {
        locals,
        layout: '../views/layouts/front-page'
    })
}

exports.about = async (req, res) => {
    const locals = {
        title: 'NodeNotes - About',
        description: 'About NodeNotes'
    }
    
    res.render('about', {
        locals,
        layout: '../views/layouts/front-page'
    })
}