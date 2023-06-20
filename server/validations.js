const signUpValidation = (req, res, next) => {
    const { login, password, repeatPassword} = req.body;

    if (login.length <= 2) {
        return res.status(400).json({ errorMessage: "Login must have more than 2 symbols" });
    }
    else if (password.length < 8) {
        return res.status(400).json({ errorMessage: "Password must have more than 7 symbols" });
    }
    else if (password !== repeatPassword) {
        return res.status(400).json({ errorMessage: "Passwords don't match" });
    }

    next();
}

module.exports = {
    signUpValidation
}