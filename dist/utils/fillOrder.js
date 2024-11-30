"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillOrder = void 0;
const variable_1 = require("../store/variable");
const flipBalance_1 = require("./flipBalance");
const fillOrder = (quantity, price, stockType, stockSymbol, userId) => {
    const remaininingQauntity = quantity;
    if (!variable_1.ORDERBOOK.sell) {
        return remaininingQauntity;
    }
    if (!variable_1.ORDERBOOK.sell[stockSymbol]) {
        return remaininingQauntity;
    }
    if (!variable_1.ORDERBOOK.sell[stockSymbol][stockType]) {
        return remaininingQauntity;
    }
    if (variable_1.ORDERBOOK.sell[stockSymbol][stockType][price]) {
        let total = variable_1.ORDERBOOK.sell[stockSymbol][stockType][price].total;
        let orders = variable_1.ORDERBOOK.sell[stockSymbol][stockType][price].orders;
        if (total > remaininingQauntity) {
            variable_1.ORDERBOOK.sell[stockSymbol][stockType][price]['total'] -= quantity;
            for (const users in orders) {
                if (orders[users] > remaininingQauntity) {
                    orders[users] -= quantity;
                    (0, flipBalance_1.flipBalance)(userId, quantity, stockSymbol, stockType, price);
                    return 0;
                }
                if (orders[users] === remaininingQauntity) {
                    delete orders[users];
                    (0, flipBalance_1.flipBalance)(userId, quantity, stockSymbol, stockType, price);
                    return 0;
                }
            }
        }
        if (total === remaininingQauntity) {
            delete variable_1.ORDERBOOK.sell[stockSymbol][stockType][price];
            (0, flipBalance_1.flipBalance)(userId, quantity, stockSymbol, stockType, price);
            return 0;
        }
        if (remaininingQauntity > total) {
            delete variable_1.ORDERBOOK.sell[stockSymbol][stockType][price];
            return remaininingQauntity - total;
        }
    }
};
exports.fillOrder = fillOrder;
