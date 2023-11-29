require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const invoiceRoutes = require('./routes/carSales');
const path = require('path');
const fs = require('fs');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
connectDB();

const app = express();

// Set up Handlebars with .hbs extension and helpers
app.engine('.hbs', exphbs({
    extname: '.hbs',
    helpers: {
        classify: function (text) {
            if (typeof text !== 'string') return ''; // Return an empty string if text is not a string
            return text.replace(/\s+/g, '-').toLowerCase();
        },
        formatDate: function (date) {
            if (!date) return '';
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            return [year, month.length < 2 ? '0' + month : month, day.length < 2 ? '0' + day : day].join('-');
        },
        json: function(context) {
            return JSON.stringify(context);
        }
    }
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up method-override middleware
app.use(methodOverride('_method'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use invoice routes
app.use('/', invoiceRoutes); // Verify if this route setup is correct as per your requirement

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
