"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveEnvVariable = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var retrieveEnvVariable = function (variableName, logger) {
    var variable = process.env[variableName] || '';
    if (!variable) {
        logger.error("".concat(variableName, " is not set"));
        process.exit(1);
    }
    return variable;
};
exports.retrieveEnvVariable = retrieveEnvVariable;
