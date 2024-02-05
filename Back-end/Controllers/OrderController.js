import Order from '../models/OrderModel.js';

const createOrder = (req, res) => {
  const { selectedProducts, totalPrice } = req.body;
  const newOrder = new Order({
    selectedProducts,
    totalPrice,
    user: req.user._id 
  });
  newOrder.save()
    .then(order => {
      res.json(order);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
};

const getOrderByUser = (req, res) => {
  Order.find({ user: req.user._id }) 
    .populate('selectedProducts.productId', 'title description') 
    .populate('user', 'username email') 
    .then(orders => {
      res.json(orders);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
};

export { createOrder, getOrderByUser };