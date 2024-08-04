function isLoggedIn (req, res, next) {
    if (req.user) {
         next()
    } else {
        return res.status(401).send('Unauthorized')
    }
}

module.exports = isLoggedIn