const db = require('../db');
const config = require('../config')
const bcrypt = require(`bcrypt`);
const jwt = require('jsonwebtoken');

class UsersController {
    static async signUp(req, res) {
        try {
            let { login, password } = req.body;
            let avatar;
    
            if (req.files !== null) {
                avatar = req.files.avatar;
    
                avatar.mv(`../server/public/avatars/${avatar.name}`, err => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ errorMessage: "Server error" });
                    }
                })
            }
    
            let sql = "SELECT `login` FROM `users` WHERE `login` = ?";
            const results = await db.query(sql, [login]);
            if(results.length !== 0) {
                return res.status(400).json({ errorMessage: "This login is already exists" });
            }
    
            login = login.toLowerCase();
            password = await bcrypt.hash(password, 5);
    
            if (!avatar) {
                sql = "INSERT INTO `users` (`login`, `passwordHash`) VALUES (?, ?)";
                await db.query(sql, [login, password]);
            }
            else {
                sql = "INSERT INTO `users` (`login`, `passwordHash`, avatar) VALUES (?, ?, ?)";
                await db.query(sql, [login, password, avatar.name]);
            }
    
            res.status(201).json({ errorMessage: "Registration is OK" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ errorMessage: "Server error" })
        }
    }

    static async signIn(req, res) {
        try {
            const { login, password } = req.body;
    
            let sql = "SELECT * FROM `users` WHERE `login` = ?";
            const results = await db.query(sql, [login.toLowerCase()]);
            if (results.length === 0) {
                return res.status(404).json({ errorMessage: "User is not found" });
            }
    
            const isValidPass = await bcrypt.compare(password, results[0].passwordHash);
            if (!isValidPass) {
                return res.status(403).json({ errorMessage: "Invalid password" });
            }
    
            const token = jwt.sign(
                {
                    id: results[0].id
                },
                config.secretKey,
                {
                    expiresIn: "24h"
                }
            )
    
            const {passwordHash, ...userData} = results[0];
    
            res.status(200).json({
                message: "Login OK",
                token,
                userData
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ errorMessage: "Server error" });
        }
    }

    static async getAvatar(req, res) {
        let fileAvatarPath;
        try {
            const sql = "SELECT avatar FROM users WHERE id = ?";
            const results = await db.query(sql, [req.userId]);
            if (!results[0].avatar) {
                fileAvatarPath = `/static/avatars/null.jpg`;
                return res.status(404).json({ errorMessage: "Avatar is not found", fileAvatarPath });
            }
    
            const { avatar } = results[0];
            fileAvatarPath = `/static/avatars/${avatar}`;
            res.status(200).json({ fileAvatarPath });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ errorMessage: "Server error" });
        }
    }
}

module.exports = UsersController;