const express = require('express');
const Cart = require('./../models/cart'); // Cart schema
const Listing = require('./../models/listing'); // listing schema
const authMiddleware = require('././authMiddleware');

const router = express.Router();

// Search route
router.get('/listing/:product_name', async (req, res) => {
    const { product_name } = req.params;
  
    try {
      const products = await Listing.find({ product_name: { $regex: new RegExp(product_name, 'i') } }); // to identify similar strings , machine learning thing , i signifies lower case and upper case to be treated as same 
  
      if (!products.length) {
        return res.status(404).json({ message: 'No products found' });
      }
  
      const productDetails = products.map(product => ({
        user_id: product.user_id,
        product_name: product.product_name,
        product_image: product.product_image,
        product_price: product.product_price
      }));
  
      res.status(200).json(productDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  
  // Add or list items in the database
router.post('/listing', authenticateUser, async (req, res) => {
    const { product_name, product_price, product_image, product_count } = req.body;
  
    try {
      const newListing = new Listing({
        user_id: req.userId,
        product_name,
        product_price,
        product_image,
        product_count
      });
  
      await newListing.save();
      res.status(201).json(newListing);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });


  // Buy item, decrease count, and remove from cart if present
router.post('/buy/listing/:product_id', authenticateUser, async (req, res) => {
    const { product_id } = req.params;
  
    try {
      const product = await Listing.findOne({ product_id });
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (product.product_count <= 0) {
        return res.status(400).json({ message: 'Out of stock' });
      }
  
      // Decrease product count
      product.product_count -= 1;
      await product.save();
  
      // Remove from cart
      await Cart.findOneAndDelete({ user_id: req.userId, product_id });
  
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  
  // Filter products by price range and sort
router.get('/listing/filter', async (req, res) => {
    const { min_price, max_price, sort } = req.query;
  
    const filter = {
      product_price: {
        $gte: min_price || 0,  // default values mentioned against them 
        $lte: max_price || Infinity
      }
    };
  
    const sortOption = sort === 'low-to-high' ? { product_price: 1 } : { product_price: -1 }; // equality in both values and type === 
  
    try {
      const products = await Listing.find(filter).sort(sortOption);
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  module.exports = router;