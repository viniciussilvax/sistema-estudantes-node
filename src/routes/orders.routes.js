const {Router} = require('express')
const ordersController = require('../controllers/ordersController')
const ordersRoutes = new Router()

ordersRoutes.post('/', ordersController.postOrder)
ordersRoutes.get('/:id', ordersController.getOrderById)


module.exports = ordersRoutes;
