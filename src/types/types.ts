export interface BalanceInInr {
    [userId: string]: {
        balance: number;
        locked: number;
    }
}

export interface Orderbook {
    [type: string]: {
        [symbol: string]: StockType
    }
}
    
export interface OrderDetails {
    total: number;
    orders: {
        [userId: string]: number
    }
}

export interface StockRate {
    [price: string]: OrderDetails
}

export interface StockType {
    [type: string]: StockRate
}

export interface StockBalances {
    [userId: string]: {
        [stockSymbol: string]: {
            [stockType: string]: {
                quantity: number;
                locked: number;
            }
        }
    }
}

export interface stockSymbol {
    [stockSymbol: string]: {
        
    }
}