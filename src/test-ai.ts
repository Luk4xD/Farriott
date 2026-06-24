import { GoogleGenAI } from '@google/genai';

// Lấy key Pro từ file .env bạn đã tạo
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ Chưa tìm thấy API Key trong file .env rồi bạn ơi!");
} else {
    const ai = new GoogleGenAI({ apiKey: apiKey });

    async function testGeminiPro() {
        console.log("⏳ Đang gửi yêu cầu tới Gemini Pro...");
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro', // Sử dụng dòng Pro mạnh mẽ
                contents: 'Hãy phân tích và kiểm tra luồng mapping logic của trang web này dựa trên cấu trúc source code hiện tại.',
            });

            console.log("\n================ KẾT QUẢ ================");
            console.log(response.text);
            console.log("=========================================\n");
        } catch (error) {
            console.error("❌ Lỗi gọi API:", error);
        }
    }

    // Chạy hàm test
    testGeminiPro();
}