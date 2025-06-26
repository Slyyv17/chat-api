const signup = async (req, res) => {
    res.json({
        status: 'success',
        message: 'User signed up successfully!'
    })
}

module.exports = {
    signup
}