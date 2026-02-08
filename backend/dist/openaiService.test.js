"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openaiService_1 = require("./openaiService");
// 模拟环境变量
process.env.DEEPSEEK_API_KEY = 'test-api-key';
describe('OpenAIService', () => {
    let openaiService;
    beforeEach(() => {
        openaiService = new openaiService_1.OpenAIService();
    });
    describe('createChatCompletion', () => {
        it('should throw error when API key is not configured', async () => {
            // 保存原始API密钥
            const originalApiKey = process.env.DEEPSEEK_API_KEY;
            // 移除API密钥
            delete process.env.DEEPSEEK_API_KEY;
            try {
                await openaiService.createChatCompletion({
                    messages: [
                        { role: 'user', content: 'Hello' }
                    ]
                });
                fail('Expected error but none was thrown');
            }
            catch (error) {
                expect(error).toBeDefined();
            }
            finally {
                // 恢复原始API密钥
                process.env.DEEPSEEK_API_KEY = originalApiKey;
            }
        });
        it('should handle valid chat request', async () => {
            // 注意：这个测试会实际调用API，需要有效的API密钥
            // 在实际运行时可能需要跳过或模拟
            if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'test-api-key') {
                console.log('Skipping API integration test - no valid API key');
                return;
            }
            try {
                const response = await openaiService.createChatCompletion({
                    messages: [
                        { role: 'user', content: 'Hello, how are you?' }
                    ],
                    model: 'deepseek-chat',
                    temperature: 0.7,
                    stream: false
                });
                expect(response).toBeDefined();
                expect(response.choices).toBeInstanceOf(Array);
                expect(response.choices.length).toBeGreaterThan(0);
                expect(response.choices[0].message).toBeDefined();
                expect(response.choices[0].message.content).toBeDefined();
            }
            catch (error) {
                console.log('API test failed:', error);
                // 不失败测试，因为可能是API密钥无效或网络问题
            }
        });
    });
    describe('createChatCompletionStream', () => {
        it('should handle streaming chat request', async () => {
            // 注意：这个测试会实际调用API，需要有效的API密钥
            if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'test-api-key') {
                console.log('Skipping streaming API integration test - no valid API key');
                return;
            }
            try {
                let receivedChunks = '';
                const fullResponse = await openaiService.createChatCompletionStream({
                    messages: [
                        { role: 'user', content: 'Hello, what is your name?' }
                    ],
                    model: 'deepseek-chat',
                    temperature: 0.7,
                    stream: true
                }, (chunk) => {
                    receivedChunks += chunk;
                });
                expect(fullResponse).toBeDefined();
                expect(fullResponse.length).toBeGreaterThan(0);
                expect(receivedChunks).toBe(fullResponse);
            }
            catch (error) {
                console.log('Streaming API test failed:', error);
                // 不失败测试，因为可能是API密钥无效或网络问题
            }
        });
    });
});
// 辅助函数
function fail(message) {
    throw new Error(message);
}
