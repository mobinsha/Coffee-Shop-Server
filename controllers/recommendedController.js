const recommendedModel = require("../models/recommendedModel")
const userModel = require("../models/userModel");


function getAllRecommended (req, res) {
    recommendedModel.getAllRecommended((err, recommended) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(recommended);
    });
}


function getRecommendedById (req, res) {
    const recommendedId = req.params.id
    recommendedModel.getRecommendedById(recommendedId, (err, recommended) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!recommended) {
            return res.status(404).json({ error: 'recommended not found' });
        }
        res.json(recommended)
    });
}


function addRecommended (req, res) {
    const {imageAddress, name, shortTitle, price, description} = req.body;

    if (!imageAddress || !name || !shortTitle || !price || !description) {
        return res.status(400).json({ error: 'Fill all fields ' });
    }

    recommendedModel.addRecommended({imageAddress, name, shortTitle, price, description},(err, recommended) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.status(201).json({massage : 'recommended added successfully'});

    });
}


function deleteRecommended (req, res) {
    const deleteRecommendedId = req.body.id;
    recommendedModel.deleteRecommended(deleteRecommendedId , (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Server Error' });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Recommended not found' });
        } else {
            return res.status(200).json({ message: 'Recommended deleted successfully' });
        }
    });
}


module.exports = {
    getRecommendedById,
    getAllRecommended,
    deleteRecommended,
    addRecommended
}