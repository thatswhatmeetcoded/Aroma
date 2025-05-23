const mongoose = require('mongoose');

// const bidSchema = new mongoose.Schema({
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId, // Refers to the user placing the bid
//     required: true,
//     ref: 'User'
//   },
//   product_id: {
//     type: mongoose.Schema.Types.ObjectId, // Refers to the item being bid on
//     required: true,
//     ref: 'Listing'
//   },
//   start_time: {
//     type: timestamps,
//     required: true
//   },
//   end_time: {
//     type: timestamps,
//     required: true
//   },
//   bid_amount: {
//     type: Number, // The amount being bid
//     required: true
//   }
//   // bid_time: { 
//   //   type: Date, 
//   //   default: Date.now
//   // },
//   // bid_status: {
//   //   type: String,
//   //   enum: ['active', 'closed'],
//   //   default: 'active'
//   // }
// }, { timestamps: true });

const bidSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, unique: true },
  bid_amount: { type: Number, required: true },
  bid_end_time: { type: Date, required: true },
  // bid_status: { type: String, default: 'active' }, // 'active', 'expired', etc.
});


const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;
