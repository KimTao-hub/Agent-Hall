"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = exports.openaiService = exports.OpenAIService = void 0;
// 其他模块导入
const openai_1 = __importDefault(require("openai"));
const winston_1 = __importDefault(require("winston"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logsDir = path_1.default.join(__dirname, '..', 'logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// 配置日志记录
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'logs/combined.log' })
    ]
});
// 创建OpenAI实例
const apiKey = process.env.DEEPSEEK_API_KEY || '';
if (!apiKey) {
    console.error('DEEPSEEK_API_KEY environment variable is not set');
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
}
// 直接创建OpenAI实例，确保在模块顶层正确初始化
const openai = new openai_1.default({
    apiKey: apiKey,
    baseURL: 'https://api.deepseek.com'
});
exports.openai = openai;
console.log('OpenAI instance created successfully with DeepSeek API');
console.log('Base URL:', 'https://api.deepseek.com');
console.log('API Key configured:', apiKey ? 'Yes' : 'No');
class OpenAIService {
    /**
     * 发送聊天请求
     * @param request 聊天请求参数
     * @returns 聊天响应
     */
    async createChatCompletion(request) {
        try {
            const startTime = Date.now();
            logger.info('Creating chat completion', {
                request: {
                    ...request,
                    messages: request.messages.map(msg => ({
                        role: msg.role,
                        content: msg.role === 'user' ? msg.content.substring(0, 100) + '...' : msg.content
                    }))
                }
            });
            const completion = await openai.chat.completions.create({
                messages: request.messages,
                model: request.model || 'deepseek-chat',
                temperature: request.temperature || 0.7,
                stream: false
            });
            const endTime = Date.now();
            logger.info('Chat completion created successfully', {
                response: {
                    id: completion.id,
                    model: completion.model,
                    choices: completion.choices.map((choice) => ({
                        index: choice.index,
                        message: {
                            role: choice.message.role,
                            content: choice.message.content.substring(0, 100) + '...'
                        },
                        finish_reason: choice.finish_reason
                    })),
                    usage: completion.usage
                },
                duration: endTime - startTime
            });
            console.log(" openai.chat.completions", completion);
            return completion;
        }
        catch (error) {
            logger.error('Error creating chat completion', {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }
    /**
     * 流式发送聊天请求
     * @param request 聊天请求参数
     * @param onChunk  chunks回调函数
     * @returns 完整响应
     */
    async createChatCompletionStream(request, onChunk) {
        try {
            const startTime = Date.now();
            logger.info('Creating streaming chat completion', {
                request: {
                    ...request,
                    messages: request.messages.map(msg => ({
                        role: msg.role,
                        content: msg.role === 'user' ? msg.content.substring(0, 100) + '...' : msg.content
                    }))
                }
            });
            const stream = await openai.chat.completions.create({
                messages: request.messages,
                model: request.model || 'deepseek-chat',
                temperature: request.temperature || 0.7,
                stream: true
            });
            console.log("ai--response--stream", stream);
            let fullResponse = '';
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    fullResponse += content;
                    onChunk(content);
                }
            }
            const endTime = Date.now();
            logger.info('Streaming chat completion finished', {
                response: {
                    content: fullResponse.substring(0, 100) + '...'
                },
                duration: endTime - startTime
            });
            return fullResponse;
        }
        catch (error) {
            logger.error('Error creating streaming chat completion', {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }
}
exports.OpenAIService = OpenAIService;
// 导出单例实例
exports.openaiService = new OpenAIService();
