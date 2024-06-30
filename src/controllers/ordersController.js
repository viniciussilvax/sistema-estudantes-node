const connection = require("../database")

class OrderController {
    async postOrder(req, res) {
        try {
            const { client_id, total, addres, observations } = req.body

            const clientExist = await connection.query(`
            select * from clients where id = ${client_id}`)

            if (clientExist[1].rowCount === 0) {
                res.status(404).json({ messagem: "Cliente não cadastrado!" })
            }

            await connection.query(`
            insert into orders (client_id, total, addres, observations)
            values (${client_id}, ${total}, '${addres}', '${observations}')`)

            res.status(200).json({ messagem: "Pedido criado com sucesso!" })
        } catch (error) {
            res.json({ messagem: "Problema ao cadastrar pedido!" })
        }
    }

    async postOrderById(req, res) {
        try {
            const { order_id, product_id, amount, price } = req.body

            const orderExist = await connection.query(`select * from orders where id = ${order_id}`)
            if (orderExist[1].rowCount === 0) {
                res.json({ messagem: "Pedido não existe" })
            }
            const productExist = await connection.query(`select * from products where id = ${product_id}`)
            if (productExist[1].rowCount === 0) {
                res.json({ messagem: "Produto não está cadastrado!" })
            }

            await connection.query(`
            insert into orders_items (order_id, product_id, amount, price)
            values (${order_id}, ${product_id}, ${amount}, ${price})`)

            res.status(200).json({ messagem: "Produto adicionado ao carrinho!" })

        } catch (error) {
            res.json({ messagem: "Problema ao adicinar produto no carrinho!" })
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
        where o.id = ${orderId}
            `)

        if(orderExist[1].rowCount === 0) {
            res.status(404).json({messagem: "Pedido não encontrado"})
        } else {
            res.json(orderExist[1].rows[0])
        }
        
    }
}

module.exports = new OrderController()