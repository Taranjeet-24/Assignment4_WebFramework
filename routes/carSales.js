const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Car = require('../models/car'); // Ensure this path is correct

// Get all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find().lean();
        res.render('alldata', { cars });
        //res.json(cars);
    } catch (err) {
        console.error('Error fetching cars:', err);
        res.status(500).send('Error fetching cars: ' + err.message);
    }
});

router.get('/addData', async (req, res) => {
    res.render('addInvoice');
});

router.post('/invoices', async (req, res) => {
    try {
        const newCar = new Car({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        });
        await newCar.save();
        res.redirect('/');
    } catch (err) {
        console.error("Error saving new car: ", err);
        res.status(500).send('Failed to add new car');
    }
});

router.get('/UpdateData', async (req, res) => {
    res.render('searchInvoice');
});

router.get('/find', async (req, res) => {
    try {
        const invoiceNo = req.query.InvoiceNo;
        const car = await Car.findOne({ InvoiceNo: invoiceNo }).lean(); // Single document
        if (!car) {
            return res.status(404).send('Car not found');
        }
        res.render('CarDetail', { car });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error searching car');
    }
});
router.post('/update/:InvoiceNo', async (req, res) => {
    console.log("Received PUT request for invoiceNo:", req.params.InvoiceNo);
    console.log("Request body:", req.body);

    try {
        const invoiceNo = req.params.InvoiceNo;
        const updatedData = req.body;

        console.log("Attempting to update car with invoiceNo:", invoiceNo);

        const updatedCar = await Car.findOneAndUpdate({ InvoiceNo: invoiceNo }, updatedData, { new: true });
        
        if (!updatedCar) {
            console.log("No car found with invoiceNo:", invoiceNo);
            return res.status(404).send('Car not found');
        }

        console.log("Updated car:", updatedCar);
        res.redirect('/'); // Redirect to a confirmation page or back to the details page
    } catch (err) {
        console.error("Error in updating car:", err);
        res.status(500).send('Error updating car');
    }
});

router.get('/car/:InvoiceNo', async (req, res) => {
    try {
        const invoiceNo = req.params.InvoiceNo;
        const car = await Car.findOne({ InvoiceNo: invoiceNo });
        if (!car) {
            return res.status(404).send('Car not found');
        }
        res.json(car);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

router.put('/car/:InvoiceNo', async (req, res) => {
    const invoiceNo = req.params.InvoiceNo;
    const updateData = req.body;
    try {
        const updatedCar = await Car.findOneAndUpdate({ InvoiceNo: invoiceNo }, updateData, { new: true });
        if (!updatedCar) {
            return res.status(404).send('Car not found');
        }
        res.json(updatedCar);
    } catch (err) {
        console.error('Error updating car:', err);
        res.status(500).send(err.message);
    }
});

// POST route to create a new car and return the created car data
router.post('/api/cars', async (req, res) => {
    try {
        // Creating a new car instance
        const newCar = new Car({
            _id: new mongoose.Types.ObjectId(),
            ...req.body // Spread the request body to match the schema fields
        });

        // Save the new car to the database
        await newCar.save();
        console.log("Car Added Successfully");

        // Return only the newly added car data
        res.json(newCar);

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});


router.delete('/car/:invoiceNo', async (req, res) => {
    const invoiceNo = req.params.invoiceNo;
    try {
        const deletedCar = await Car.findOneAndDelete({ InvoiceNo: invoiceNo });
        if (!deletedCar) {
            return res.status(404).send('Car not found');
        }
        res.send('Car deleted successfully');
    } catch (err) {
        console.error('Error deleting car:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
