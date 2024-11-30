import { ORDERBOOK, STOCK_BALANCES } from "../store/variable"
import { flipBalance } from "./flipBalance"

interface OrderType {
    [userId: string]: number
}

export const fillOrder = (quantity: number, price: number, stockType: string, stockSymbol: string, userId: string) => {
    const remaininingQauntity = quantity
    if (!ORDERBOOK.sell) {
        return remaininingQauntity
    }
    if (!ORDERBOOK.sell[stockSymbol]) {
        return remaininingQauntity
    }
    if (!ORDERBOOK.sell[stockSymbol][stockType]) {
        return remaininingQauntity
    }
    if (ORDERBOOK.sell[stockSymbol][stockType][price]) {
        let total: number = ORDERBOOK.sell[stockSymbol][stockType][price].total
        let orders: OrderType = ORDERBOOK.sell[stockSymbol][stockType][price].orders
        if (total > remaininingQauntity) {
            ORDERBOOK.sell[stockSymbol][stockType][price]['total'] -= quantity
            for (const users in orders) {
                if (orders[users] > remaininingQauntity) {
                    orders[users] -= quantity
                    flipBalance(userId, quantity, stockSymbol, stockType, price)
                    return 0
                } 
                
                if (orders[users] === remaininingQauntity) {
                    delete orders[users]
                    flipBalance(userId, quantity, stockSymbol, stockType, price)
                    return 0
                } 
            }
        }

        if (total === remaininingQauntity) {
            delete ORDERBOOK.sell[stockSymbol][stockType][price]
            flipBalance(userId, quantity, stockSymbol, stockType, price)
            return 0
        }

        if (remaininingQauntity > total) {
            delete ORDERBOOK.sell[stockSymbol][stockType][price]
            return remaininingQauntity - total
        }

    }
}