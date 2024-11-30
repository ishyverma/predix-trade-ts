"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flipBalance = void 0;
const variable_1 = require("../store/variable");
const flipBalance = (userId, quantity, stockSymbol, stockType, price) => {
    if (!variable_1.STOCK_BALANCES[userId]) {
        variable_1.STOCK_BALANCES[userId] = {
            [stockSymbol]: {
                [stockType]: {
                    quantity,
                    locked: 0
                }
            }
        };
        variable_1.INR_BALANCES[userId].balance -= quantity * price;
        return;
    }
    if (!variable_1.STOCK_BALANCES[userId][stockSymbol]) {
        variable_1.STOCK_BALANCES[userId][stockSymbol] = {
            [stockType]: {
                quantity,
                locked: 0
            }
        };
        variable_1.INR_BALANCES[userId].balance -= quantity * price;
        return;
    }
    if (!variable_1.STOCK_BALANCES[userId][stockSymbol][stockType]) {
        variable_1.STOCK_BALANCES[userId][stockSymbol][stockType] = {
            quantity,
            locked: 0
        };
        variable_1.INR_BALANCES[userId].balance -= quantity * price;
        return;
    }
    if (variable_1.STOCK_BALANCES[userId][stockSymbol][stockType]) {
        variable_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity += quantity;
        variable_1.INR_BALANCES[userId].balance -= quantity * price;
        return;
    }
};
exports.flipBalance = flipBalance;
