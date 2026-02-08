"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 环境变量加载模块
const dotenv_1 = __importDefault(require("dotenv"));
// 加载环境变量
dotenv_1.default.config();
// 设置OPENAI_API_KEY环境变量
if (process.env.DEEPSEEK_API_KEY) {
    process.env.OPENAI_API_KEY = process.env.DEEPSEEK_API_KEY;
    console.log('Environment variables configured successfully');
}
else {
    console.error('DEEPSEEK_API_KEY environment variable is not set');
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
}
exports.default = process.env;
