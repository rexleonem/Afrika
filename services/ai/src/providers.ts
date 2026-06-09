export type AIModelRole = "structure" | "speed" | "reason";

export type AIProviderName = "gemini" | "groq" | "deepseek";

export type AIProviderConfig = {
  name: AIProviderName;
  apiKey: string;
  baseUrl: string;
  model: string;
};

export function getProviderConfig(name: AIProviderName): AIProviderConfig {
  if (name === "gemini") {
    return {
      name,
      apiKey: process.env.GEMINI_API_KEY ?? "",
      baseUrl: process.env.GEMINI_BASE_URL ?? "https://generativelanguage.googleapis.com",
      model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash"
    };
  }

  if (name === "groq") {
    return {
      name,
      apiKey: process.env.GROQ_API_KEY ?? "",
      baseUrl: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
      model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile"
    };
  }

  return {
    name: "deepseek",
    apiKey: process.env.DEEPSEEK_API_KEY ?? "",
    baseUrl: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com",
    model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat"
  };
}

export function providerForRole(role: AIModelRole): AIProviderConfig {
  if (role === "structure") return getProviderConfig("gemini");
  if (role === "speed") return getProviderConfig("groq");
  return getProviderConfig("deepseek");
}

export function roleLabel(role: AIModelRole) {
  if (role === "structure") return "Gemini";
  if (role === "speed") return "Groq";
  return "DeepSeek";
}
