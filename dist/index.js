"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const variable_1 = require("./store/variable");
const fillOrder_1 = require("./utils/fillOrder");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/user/create/:userId", (req, res) => {
    const { userId } = req.params;
    variable_1.INR_BALANCES[userId] = {
        balance: 0,
        locked: 0
    };
    res.json({
        message: "User created"
    });
});
app.post("/symbol/create/:stockSymbol", (req, res) => {
    const { stockSymbol } = req.params;
    variable_1.STOCK_SYMBOL.push(stockSymbol);
    res.json({
        message: "Stock created successfully"
    });
});
app.get("/orderbook", (req, res) => {
    res.json({
        ORDERBOOK: variable_1.ORDERBOOK
    });
});
app.get("/balances/inr", (req, res) => {
    res.json({
        INR_BALANCES: variable_1.INR_BALANCES
    });
});
app.get("/balances/stock", (req, res) => {
    res.json({
        STOCK_BALANCES: variable_1.STOCK_BALANCES
    });
});
app.post("/reset", (req, res) => {
    for (const value in variable_1.INR_BALANCES) {
        delete variable_1.INR_BALANCES[value];
    }
    for (const value in variable_1.ORDERBOOK) {
        delete variable_1.ORDERBOOK[value];
    }
    for (const value in variable_1.STOCK_BALANCES) {
        delete variable_1.STOCK_BALANCES[value];
    }
    variable_1.STOCK_SYMBOL.splice(0, variable_1.STOCK_SYMBOL.length);
    res.json({
        message: "All variables reseted"
    });
});
app.get("/balance/inr/:userId", (req, res) => {
    const { userId } = req.params;
    if (!variable_1.INR_BALANCES[userId]) {
        res.json({
            message: "No user exists"
        });
    }
    else {
        res.json({
            balance: variable_1.INR_BALANCES[userId]
        });
    }
});
app.post("/onramp/inr", (req, res) => {
    const { userId, amount } = req.body;
    if (!variable_1.INR_BALANCES[userId]) {
        res.json({
            message: "No user exists"
        });
    }
    else {
        variable_1.INR_BALANCES[userId].balance += amount;
        res.json({
            message: "Added money"
        });
    }
});
app.get("/balance/stock/:userId", (req, res) => {
    const { userId } = req.params;
    if (!variable_1.STOCK_BALANCES[userId]) {
        res.json({
            message: "No user exists"
        });
    }
    else {
        res.json({
            stockBalance: variable_1.STOCK_BALANCES[userId]
        });
    }
});
app.post("/order/buy", (req, res) => {
    const { userId, stockSymbol, quantity, price, stockType } = req.body;
    if (!variable_1.INR_BALANCES[userId]) {
        res.json({
            message: "No user exists"
        });
        return;
    }
    const isSymbol = variable_1.STOCK_SYMBOL.some(symbols => symbols == stockSymbol);
    if (!isSymbol) {
        res.json({
            message: "There is no such stock"
        });
        return;
    }
    if (variable_1.INR_BALANCES[userId].balance < quantity * price) {
        res.json({
            message: "Not that much money"
        });
        return;
    }
    const remaininingQauntity = (0, fillOrder_1.fillOrder)(quantity, price, stockType, stockSymbol, userId);
    if (!remaininingQauntity) {
        res.json({
            message: "Bought the stock"
        });
        return;
    }
    if (!variable_1.ORDERBOOK.buy) {
        variable_1.ORDERBOOK.buy = {
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
        };
        res.json({
            message: "Bought the stock"
        });
        return;
    }
    if (!variable_1.ORDERBOOK.buy[stockSymbol]) {
        variable_1.ORDERBOOK.buy[stockSymbol] = {
            [stockType]: {
                [price]: {
                    total: remaininingQauntity,
                    orders: {
                        [userId]: remaininingQauntity
                    }
                }
            }
        };
        res.json({
            message: "Bought the stock"
        });
        return;
    }
    if (!variable_1.ORDERBOOK.buy[stockSymbol][stockType]) {
        variable_1.ORDERBOOK.buy[stockSymbol][stockType] = {
            [price]: {
                total: remaininingQauntity,
                orders: {
                    [userId]: remaininingQauntity
                }
            }
        };
        res.json({
            message: "Bought the stock"
        });
        return;
    }
    if (!variable_1.ORDERBOOK.buy[stockSymbol][stockType][price]) {
        variable_1.ORDERBOOK.buy[stockSymbol][stockType][price] = {
            total: remaininingQauntity,
            orders: {
                [userId]: remaininingQauntity
            }
        };
        res.json({
            message: "Bought the stock"
        });
        return;
    }
    if (!variable_1.ORDERBOOK.buy[stockSymbol][stockType][price]['orders'][userId]) {
        variable_1.ORDERBOOK.buy[stockSymbol][stockType][price]['orders'][userId] = remaininingQauntity;
        variable_1.ORDERBOOK.buy[stockSymbol][stockType][price]['total'] += remaininingQauntity;
        res.json({
            message: "Bought the stock"
        });
        return;
    }
    if (variable_1.ORDERBOOK.buy[stockSymbol][stockType][price]['orders'][userId]) {
        variable_1.ORDERBOOK.buy[stockSymbol][stockType][price]['orders'][userId] += remaininingQauntity;
        variable_1.ORDERBOOK.buy[stockSymbol][stockType][price]['total'] += remaininingQauntity;
        res.json({
            message: "Bought the stock"
        });
        return;
    }
});
app.post("/order/sell", (req, res) => {
    const { userId, stockSymbol, quantity, price, stockType } = req.body;
    if (!variable_1.ORDERBOOK.sell) {
        variable_1.ORDERBOOK.sell = {
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
        };
        res.json({
            message: "Sold the stock"
        });
        return;
    }
    if (!variable_1.ORDERBOOK.sell[stockSymbol]) {
        variable_1.ORDERBOOK.sell[stockSymbol] = {
            [stockType]: {
                [price]: {
                    total: quantity,
                    orders: {
                        [userId]: quantity
                    }
                }
            }
        };
        res.json({
            message: "Sold the stock"
        });
        return;
    }
    if (!variable_1.ORDERBOOK.sell[stockSymbol][stockType]) {
        variable_1.ORDERBOOK.sell[stockSymbol][stockType] = {
            [price]: {
                total: quantity,
                orders: {
                    [userId]: quantity
                }
            }
        };
        res.json({
            message: "Sold the stock"
        });
        return;
    }
    if (!variable_1.ORDERBOOK.sell[stockSymbol][stockType][price]) {
        variable_1.ORDERBOOK.sell[stockSymbol][stockType][price] = {
            total: quantity,
            orders: {
                [userId]: quantity
            }
        };
        res.json({
            message: "Sold the stock"
        });
        return;
    }
    if (!variable_1.ORDERBOOK.sell[stockSymbol][stockType][price]['orders'][userId]) {
        variable_1.ORDERBOOK.sell[stockSymbol][stockType][price]['orders'][userId] = quantity;
        variable_1.ORDERBOOK.sell[stockSymbol][stockType][price]['total'] += quantity;
        res.json({
            message: "Sold the stock"
        });
        return;
    }
    if (variable_1.ORDERBOOK.sell[stockSymbol][stockType][price]['orders'][userId]) {
        variable_1.ORDERBOOK.sell[stockSymbol][stockType][price]['orders'][userId] += quantity;
        variable_1.ORDERBOOK.sell[stockSymbol][stockType][price]['total'] += quantity;
        res.json({
            message: "Sold the stock"
        });
        return;
    }
});
app.listen(3000);
