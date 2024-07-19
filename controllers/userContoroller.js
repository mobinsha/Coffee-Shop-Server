const userModel = require("../models/userModel")
const {result} = require("lodash/object");


function getAllUsers(req, res) {
    userModel.getAllUsers((err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(user);
    });
}


function getUserById(req, res) {
    const userId = req.params.id
    userModel.getUserById(userId, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user)
    });
}


function addUser (req, res) {
    const {userName, fullName, email, phoneNumber, gender, permission } = req.body;

    if (!userName || !fullName || !email || !phoneNumber || !gender || !permission) {
        return res.status(400).json({ error: 'fill all fields ' });
    }

    userModel.addUser({userName, fullName, email, phoneNumber, gender, permission},(err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({massage : 'User added successfully'});
    });
}


function userUpdate(req, res) {
    const userId = req.body.id;
    const userData = req.body;

    userModel.userUpdate(userId, userData, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User updated successfully' });
    });
}


function deleteUser(req, res) {
    const deleteUserId = req.body.id;
    userModel.deleteUser(deleteUserId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Server Error' });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            return res.status(200).json({ message: 'User deleted successfully' });
        }
    });
}


module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    deleteUser,
    userUpdate
}

