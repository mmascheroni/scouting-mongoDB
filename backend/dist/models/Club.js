"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubModel = void 0;
const mongoose_1 = require("mongoose");
const ClubSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    pais: { type: String, required: true, default: 'Uruguay' },
    ciudad: { type: String, required: true },
    estadio: { type: String },
    division: { type: String, required: true }
});
exports.ClubModel = (0, mongoose_1.model)('Club', ClubSchema, 'CLUB');
