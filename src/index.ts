import express, { Request, Response } from "express"
import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES, STOCK_SYMBOL } from "./store/variable"
import { fillOrder } from "./utils/fillOrder"

const app = express()
app.use(express.json())

app.post("/user/create/:userId", (req: Request, res: Response) => {
    const { userId } = req.params
    INR_BALANCES[userId] = {
        balance: 0,
        locked: 0
    }
    res.json({
        message: "User created"
    })
})

app.post("/symbol/create/:stockSymbol", (req: Request, res: Response) => {
    const { stockSymbol } = req.params
    STOCK_SYMBOL.push(stockSymbol)
    res.json({
        message: "Stock created successfully"
    })
})

app.get("/orderbook", (req: Request, res: Response) => {
    res.json({
        ORDERBOOK
    })
})

app.get("/balances/inr", (req: Request, res: Response) => {
    res.json({
        INR_BALANCES
    })
})

app.get("/balances/stock", (req: Request, res: Response) => {
    res.json({
        STOCK_BALANCES
    })
})

app.post("/reset", (req: Request, res: Response) => {
    for (const value in INR_BALANCES) {
        delete INR_BALANCES[value]
    }
    for (const value in ORDERBOOK) {
        delete ORDERBOOK[value]
    }
    for (const value in STOCK_BALANCES) {
        delete STOCK_BALANCES[value]
    }
    STOCK_SYMBOL.splice(0, STOCK_SYMBOL.length)
    res.json({
        message: "All variables reseted"
    })
})

app.get("/balance/inr/:userId", (req: Request, res: Response) => {
    const { userId } = req.params
    if (!INR_BALANCES[userId]) {
        res.json({
            message: "No user exists"
        })
    } else {
        res.json({
            balance: INR_BALANCES[userId]
        })
    }
})

app.post("/onramp/inr", (req: Request, res: Response) => {
    const { userId, amount } = req.body
    if (!INR_BALANCES[userId]) {
        res.json({
            message: "No user exists"
        }) 
    } else {
        INR_BALANCES[userId].balance += amount
        res.json({
            message: "Added money"
        })
    }
})

app.get("/balance/stock/:userId", (req: Request, res: Response) => {
    const { userId } = req.params
    if (!STOCK_BALANCES[userId]) {
        res.json({
            message: "No user exists"
        })
    } else {
        res.json({
            stockBalance: STOCK_BALANCES[userId]
        })
    }
})

app.post("/order/buy", (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity, price, stockType } = req.body
    if (!INR_BALANCES[userId]) {
        res.json({
            message: "No user exists"
        })
        return
    }

    const isSymbol = STOCK_SYMBOL.some(symbols => symbols == stockSymbol)
    if (!isSymbol) {
        res.json({
            message: "There is no such stock"
        })
        return 
    }

    if (INR_BALANCES[userId].balance < quantity * price) {
        res.json({
            message: "Not that much money"
        })
        return 
    }

    const remaininingQauntity = fillOrder(quantity, price, stockType, stockSymbol, userId)
    if (!remaininingQauntity) {
        res.json({
            message: "Bought the stock"
        })
        return 
    } 
    if (!ORDERBOOK.buy) {
        ORDERBOOK.buy = {
            [stockSymbol]: {
                [stockType]: {
                    [price]: {
                        total: remaininingQauntity,
                        orders: {
                            [userId]: remaininingQauntity
                        }
                    }
                }
            }
        }
        res.json({
            message: "Bought the stock"
        })
        return
    }

    if (!ORDERBOOK.buy[stockSymbol]) {
        ORDERBOOK.buy[stockSymbol] = {
            [stockType]: {
                [price]: {
                    total: remaininingQauntity,
                    orders: {
                        [userId]: remaininingQauntity
                    }
                }
            }
        }
        res.json({
            message: "Bought the stock"
        })
        return
    }

    if (!ORDERBOOK.buy[stockSymbol][stockType]) {
        ORDERBOOK.buy[stockSymbol][stockType] = {
            [price]: {
                total: remaininingQauntity,
                orders: {
                    [userId]: remaininingQauntity
                }
            }
        }
        res.json({
            message: "Bought the stock"
        })
        return
    }

    if (!ORDERBOOK.buy[stockSymbol][stockType][price]) {
        ORDERBOOK.buy[stockSymbol][stockType][price] = {
            total: remaininingQauntity,
            orders: {
                [userId]: remaininingQauntity
            }
        }
        res.json({
            message: "Bought the stock"
        })
        return
    }

    if (!ORDERBOOK.buy[stockSymbol][stockType][price]['orders'][userId]) {
        ORDERBOOK.buy[stockSymbol][stockType][price]['orders'][userId] = remaininingQauntity
        ORDERBOOK.buy[stockSymbol][stockType][price]['total'] += remaininingQauntity
        res.json({
            message: "Bought the stock"
        })
        return
    }

    if (ORDERBOOK.buy[stockSymbol][stockType][price]['orders'][userId]) {
        ORDERBOOK.buy[stockSymbol][stockType][price]['orders'][userId] += remaininingQauntity
        ORDERBOOK.buy[stockSymbol][stockType][price]['total'] += remaininingQauntity
        res.json({
            message: "Bought the stock"
        })
        return
    }
})

app.post("/order/sell", (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity, price, stockType } = req.body
    if (!ORDERBOOK.sell) {
        ORDERBOOK.sell = {
            [stockSymbol]: {
                [stockType]: {
                    [price]: {
                        total: quantity,
                        orders: {
                            [userId]: quantity
                        }
                    }
                }
            }
        }
        res.json({
            message: "Sold the stock"
        })
        return
    }

    if (!ORDERBOOK.sell[stockSymbol]) {
        ORDERBOOK.sell[stockSymbol] = {
            [stockType]: {
                [price]: {
                    total: quantity,
                    orders: {
                        [userId]: quantity
                    }
                }
            }
        }
        res.json({
            message: "Sold the stock"
        })
        return
    }

    if (!ORDERBOOK.sell[stockSymbol][stockType]) {
        ORDERBOOK.sell[stockSymbol][stockType] = {
            [price]: {
                total: quantity,
                orders: {
                    [userId]: quantity
                }
            }
        }
        res.json({
            message: "Sold the stock"
        })
        return
    }

    if (!ORDERBOOK.sell[stockSymbol][stockType][price]) {
        ORDERBOOK.sell[stockSymbol][stockType][price] = {
            total: quantity,
            orders: {
                [userId]: quantity
            }
        }
        res.json({
            message: "Sold the stock"
        })
        return
    }

    if (!ORDERBOOK.sell[stockSymbol][stockType][price]['orders'][userId]) {
        ORDERBOOK.sell[stockSymbol][stockType][price]['orders'][userId] = quantity
        ORDERBOOK.sell[stockSymbol][stockType][price]['total'] += quantity
        res.json({
            message: "Sold the stock"
        })
        return
    }

    if (ORDERBOOK.sell[stockSymbol][stockType][price]['orders'][userId]) {
        ORDERBOOK.sell[stockSymbol][stockType][price]['orders'][userId] += quantity
        ORDERBOOK.sell[stockSymbol][stockType][price]['total'] += quantity
        res.json({
            message: "Sold the stock"
        })
        return
    }
})

app.listen(3000)