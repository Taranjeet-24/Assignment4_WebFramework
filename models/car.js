// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    InvoiceNo: String,
    //image: Buffer,
    Manufacturer: String,
    class: String,
    Sales_in_thousands: Number,
    __year_resale_value: mongoose.Schema.Types.Decimal128,
    Vehicle_type: String,
    Price_in_thousands: Number,
    Engine_size: Number,
    Horsepower: Number,
    Wheelbase: Number,
    Width: Number,
    Length: Number,
    Curb_weight: Number,
    Fuel_capacity: Number,
    Fuel_efficiency: Number,
    Latest_Launch: Date,
    Power_perf_factor: Number,
    features: [String], // Array of strings
    specs: { // Mixed type
        type: Schema.Types.Mixed,
        default: {}
    },
    isElectric: Boolean
});

module.exports = mongoose.model('Car', CarSchema, 'cars');
