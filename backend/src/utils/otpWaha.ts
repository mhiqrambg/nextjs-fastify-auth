import { http } from "./http";

export const otpWaha = {
  generateOtp: () => String(Math.floor(100000 + Math.random() * 900000)),
  sendText: async (chatId: string, text: string, session = "default") => {
    const result = await http.post("/sendText", { chatId, text, session });

    return result
      ? { status: "success", message: "OTP sent successfully" }
      : null;
  },
};
