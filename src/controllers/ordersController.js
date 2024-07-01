const { where } = require("sequelize")
const connection = require("../database")

class OrderController {
    async postOrder(req, res) {

        try {

            const { client_id, addres, observations, products } = req.body

            const clientExist = await connection.query(`
            select * from clients where id = ${client_id}`)

            if (clientExist[1].rowCount === 0) {
                res.status(404).json({ messagem: "Cliente não cadastrado!" })
            }


            let totalPrice = 0

            for (let product of products) {
                const price = await connection.query(`
                select price from products where id = ${product.id}`)
                totalPrice += totalPrice + (price[0][0].price * product.amount)
            }

           const order = await connection.query(`
            insert into orders (client_id, addres, observations, total)
            values (${client_id}, '${addres}', '${observations}', ${totalPrice}) RETURNING *`)

            products.forEach(async item => {
                const prod = await connection.query(`
                select price from products where id = ${item.id}`)

                await connection.query(`
                insert into orders_items (order_id, product_id, amount, price)
                values(${order[0][0].id}, ${item.id}, ${item.amount}, ${prod[0][0].price})`)
            });

            res.status(200).json({ messagem: "Pedido criado com sucesso!" })


        } catch (error) {
            res.json({ messagem: "Problema ao cadastrar pedido!" })
            console.log(error)
        }

    }

    
    async getOrderById(req, res) {
        const orderId = req.params.id

        const orderExist = await connection.query(`
        select c.name as Cliente, o.total, o.addres, o.observations, p.name as Produto, oi.amount, oi.price
        from orders o
        inner join clients c
        on o.client_id = c.id
        inner join orders_items oi
        on oi.order_id = o.id
        inner join products p
        on oi.product_id = p.id
        where o.id = ${orderId}`)

        if (orderExist[1].rowCount === 0) {
            res.status(404).json({ messagem: "Pedido não encontrado" })
        } else {
            res.json(orderExist[0])
        }

    }
}

module.exports = new OrderController() 