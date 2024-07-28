const servicesModel = require("../models/servicesModel")
const userModel = require("../models/userModel");


function getAllServices (req, res) {
    servicesModel.getAllServices((err, services) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(services);
    });
}


function getServicesById (req, res) {
    const servicesId = req.params.id
    servicesModel.getServicesById(servicesId, (err, service) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!service) {
            return res.status(404).json({ error: 'service not found' });
        }
        res.json(service)
    });
}


function addService (req, res) {
    const {imageAddress , name} = req.body;

    if (!imageAddress || !name) {
        return res.status(400).json({ error: 'Fill all fields ' });
    }

    servicesModel.addService({imageAddress , name},(err, service) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({massage : 'Service added successfully'});
    });
}


function deleteService (req, res) {
    const deleteServiceId = req.body.id;
    servicesModel.deleteService(deleteServiceId , (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Server Error' });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Service not found' });
        } else {
            return res.status(200).json({ message: 'Service deleted successfully' });
        }
    });
}


module.exports = {
    getAllServices,
    getServicesById,
    deleteService,
    addService
}