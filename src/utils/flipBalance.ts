import { INR_BALANCES, STOCK_BALANCES } from "../store/variable"

export const flipBalance = (userId: string, quantity: number, stockSymbol: string, stockType: string, price: number) => {
    if (!STOCK_BALANCES[userId]) {
        STOCK_BALANCES[userId] = {
            [stockSymbol]: {
                [stockType]: {
                    quantity,
                    locked: 0
                }
            }
        }
        INR_BALANCES[userId].balance -= quantity * price
        return
    }

    if (!STOCK_BALANCES[userId][stockSymbol]) {
        STOCK_BALANCES[userId][stockSymbol] = {
            [stockType]: {
                quantity,
                locked: 0
            }
        }
        INR_BALANCES[userId].balance -= quantity * price
        return
    }

    if (!STOCK_BALANCES[userId][stockSymbol][stockType]) {
        STOCK_BALANCES[userId][stockSymbol][stockType] = {
            quantity,
            locked: 0
        }
        INR_BALANCES[userId].balance -= quantity * price
        return
    }

    if (STOCK_BALANCES[userId][stockSymbol][stockType]) {
        STOCK_BALANCES[userId][stockSymbol][stockType].quantity += quantity
        INR_BALANCES[userId].balance -= quantity * price
        return
    }
}