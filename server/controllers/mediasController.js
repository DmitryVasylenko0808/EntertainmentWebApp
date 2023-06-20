const db = require('../db');

class MediasController {
    static async getAll(req, res) {
        try {
            let sql = "SELECT medias.id, title, year, picture, types.type FROM `medias` LEFT JOIN types ON (type_id = types.id) ORDER BY year DESC";
            const results = await db.query(sql); 
            if (results.length === 0) {
                return res.status(404).json({ errorMessage: "Medias not found" });
            }
    
            const medias = results;
            medias.forEach(m => {
                m.picture = `static/medias/${m.picture}`;
            }); 
            res.status(200).json({ medias });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ errorMessage: "Server error" });
        }
    }

    static async getMediasByType(req, res) {
        try {
            const { typeid } = req.params;
    
            const sql = "SELECT medias.id, title, year, picture, types.type FROM `medias` LEFT JOIN types ON (type_id = types.id) WHERE type_id = ? ORDER BY year DESC";
            const results = await db.query(sql, [typeid]);
            if (results.length === 0) {
                return res.status(404).json({ errorMessage: "Medias is not found" });
            }
    
            const medias = results;
            medias.forEach(m => {
                m.picture = `static/medias/${m.picture}`;
            }); 
            res.status(200).json({ medias });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ errorMessage: "Server error" })
        }
    }

    static async getMarkMedias(req, res) {
        try {
            let sql = "SELECT id_media, `medias`.title, types.type, `medias`.year, `medias`.picture FROM `users_medias` LEFT JOIN `medias` ON (`medias`.id = id_media) LEFT JOIN types ON (medias.type_id = types.id) WHERE id_user = ? AND `medias`.type_id = 1 ORDER BY year DESC";
            let results = await db.query(sql, [req.userId]);
            const markMovies = results;
            
            sql = "SELECT id_media, `medias`.title, types.type, `medias`.year, `medias`.picture FROM `users_medias` LEFT JOIN `medias` ON (`medias`.id = id_media) LEFT JOIN types ON (medias.type_id = types.id) WHERE id_user = ? AND `medias`.type_id = 2 ORDER BY year DESC";
            results = await db.query(sql, [req.userId]);
            const markSeries = results;
    
            if (markMovies.length === 0 && markSeries.length === 0) {
                return res.status(404).json({ errorMessage: "Mark movies and TV series are not found" });
            }
    
            markMovies.forEach(m => {
                m.picture = `static/medias/${m.picture}`;
            }); 
            markSeries.forEach(m => {
                m.picture = `static/medias/${m.picture}`;
            }); 
    
            res.status(200).json({ markMovies, markSeries });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ errorMessage: "Server error" })
        }
    }

    static async addMarkMedia(req, res) {
        try {
            const { mediaId } = req.body;
    
            let sql = "SELECT id FROM medias WHERE id = ?";
            let results = await db.query(sql, [mediaId]);
            if (results.length === 0) {
                return res.status(404).json({ errorMessage: "Media is not found" });
            }
    
            sql = "SELECT id_user, id_media FROM users_medias WHERE id_user = ? AND id_media = ?";
            results = await(db.query(sql, [req.userId, mediaId]));
            if (results.length !== 0) {
                return res.status(400).json({ errorMessage: "Media is already marked" });
            }
    
            sql = "INSERT INTO users_medias (id_user, id_media) VALUES (?, ?)";
            await db.query(sql, [req.userId, mediaId]);
    
            res.status(200).json({ message: "Success add" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ errorMessage: "Server error" });
        }
    }

    static async deleteMarkMedia(req, res) {
        try {
            const { mediaId } = req.params;
    
            const sql = "DELETE FROM users_medias WHERE id_user = ? AND id_media = ?";
            const results = await db.query(sql, [req.userId, mediaId]);
            if (results.affectedRows === 0) {
                return res.status(404).json({ errorMessage: "Marked media is not found" });
            }
    
            res.status(200).json({ message: "Success" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ errorMessage: "Server error" });
        }
    }

    static async searchMedia(req, res) {
        try {
            const { typeId, title } = req.params;
    
            let sql = `SELECT medias.id, title, year, picture, types.type FROM medias LEFT JOIN types ON (type_id = types.id) WHERE title LIKE '%${title}%'`;
            if (typeId !== "all") {
                sql += ` AND type_id = ${typeId}`;
            }
            const results = await db.query(sql);
    
            if(results.length === 0) {
                return res.status(404).json({ errorMessage: "Medias are not found" });
            }
    
            const medias = results;
            medias.forEach(m => {
                m.picture = `static/medias/${m.picture}`;
            }); 
            res.status(200).json({ medias });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ errorMessage: "Server error" });
        }
    }

    static async searchMarkedMedia(req, res) {
        try {
            const { title } = req.params;
    
            let sql = `SELECT id_media, medias.title, types.type, medias.year, medias.picture FROM users_medias LEFT JOIN medias ON (medias.id = id_media) LEFT JOIN types ON (medias.type_id = types.id) WHERE id_user = ? AND medias.type_id = 1 AND medias.title LIKE '%${title}%'`;
            let results = await db.query(sql, [req.userId]);
            const markMovies = results;
            
            sql = `SELECT id_media, medias.title, types.type, medias.year, medias.picture FROM users_medias LEFT JOIN medias ON (medias.id = id_media) LEFT JOIN types ON (medias.type_id = types.id) WHERE id_user = ? AND medias.type_id = 2 AND medias.title LIKE '%${title}%'`;
            results = await db.query(sql, [req.userId]);
            const markSeries = results;
    
            if (markMovies.length === 0 && markSeries.length === 0) {
                return res.status(404).json({ errorMessage: "Mark movies and TV series are not found" });
            }
    
            markMovies.forEach(m => {
                m.picture = `static/medias/${m.picture}`;
            }); 
            markSeries.forEach(m => {
                m.picture = `static/medias/${m.picture}`;
            }); 
    
            res.status(200).json({ markMovies, markSeries });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ errorMessage: "Server error" })
        }
    }
}

module.exports = MediasController