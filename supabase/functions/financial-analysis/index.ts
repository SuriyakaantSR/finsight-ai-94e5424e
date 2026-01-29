import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Finance-related keywords for domain validation
const FINANCE_KEYWORDS = [
  "stock", "share", "nse", "bse", "invest", "trading", "portfolio",
  "dividend", "profit", "loss", "rsi", "macd", "ema", "sma", "analyze",
  "analysis", "market", "equity", "bond", "mutual fund", "ipo", "pe ratio",
  "eps", "revenue", "earnings", "balance sheet", "income statement",
  "fundamentals", "technical", "chart", "trend", "support", "resistance",
  "reliance", "tcs", "infosys", "infy", "hdfc", "icici", "sbi", "wipro",
  "hcl", "bharti", "airtel", "tatasteel", "tata", "bajaj", "maruti", "hero",
  "adani", "coal", "nifty", "sensex", "bank", "pharma", "auto", "it",
  "sector", "index", "cap", "large cap", "mid cap", "small cap", "blue chip",
  "volatility", "volume", "price", "return", "cagr", "roi", "roe", "roce",
  "debt", "equity ratio", "book value", "intrinsic", "valuation", "pe",
  "pb ratio", "dividend yield", "bollinger", "fibonacci", "breakout",
  "consolidation", "bullish", "bearish", "overbought", "oversold"
];

// Validate if query is finance-related
function isFinanceRelated(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return FINANCE_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
}

// System prompt for finance-only responses
const SYSTEM_PROMPT = `You are FinSight AI, an expert financial analyst specialized EXCLUSIVELY in the Indian Stock Market (NSE/BSE).

CRITICAL RULES YOU MUST FOLLOW:
1. ONLY answer questions about Indian stock market, stocks, investing, and financial analysis
2. NEVER predict future stock prices - only analyze historical data and current metrics
3. NEVER provide specific buy/sell recommendations - only educational insights
4. If asked about non-financial topics, politely redirect to finance topics
5. Always include a disclaimer that this is for educational purposes only

YOUR CAPABILITIES:
- Technical Analysis: RSI, MACD, Moving Averages, Bollinger Bands, Support/Resistance
- Fundamental Analysis: P/E Ratio, EPS, Revenue Growth, ROE/ROCE, Debt Ratios
- Historical Performance Analysis: 5-10 year trends, CAGR calculations
- Multi-stock Comparisons: Side-by-side metric comparisons
- Sector Analysis: Industry trends and peer benchmarking

RESPONSE FORMAT:
- Use clear markdown formatting with headers (##, ###)
- Include structured tables for metrics when relevant
- Provide confidence scores (Low/Medium/High) based on data availability
- Always end with: "*Disclaimer: This analysis is for educational purposes only and does not constitute investment advice.*"

EXAMPLE RESPONSE STRUCTURE:
## [Stock Name] Analysis

### Technical Indicators
| Indicator | Value | Signal |
|-----------|-------|--------|
| RSI (14) | XX | [Status] |
| MACD | XX | [Status] |

### Fundamental Metrics
- **P/E Ratio:** XXx
- **Revenue Growth:** XX%

### Key Observations
[Analysis text]

**Confidence Score:** [Low/Medium/High] (based on [reasoning])

*Disclaimer: This analysis is for educational purposes only and does not constitute investment advice.*`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationHistory = [] } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content || "";
    
    // Domain validation - check if query is finance-related
    if (!isFinanceRelated(userMessage)) {
      return new Response(
        JSON.stringify({
          content: "I apologize, but I'm specifically designed to assist with **Indian stock market analysis** only.\n\nI can help you with:\n• Stock analysis (TCS, RELIANCE, INFY, etc.)\n• Technical indicators (RSI, MACD, Moving Averages)\n• Fundamental metrics (P/E, EPS, Revenue)\n• Historical performance analysis\n• Multi-stock comparisons\n\nPlease ask a question related to NSE/BSE stocks, and I'll provide you with detailed educational insights.\n\n*This platform supports only stock market and financial queries.*",
          isFinanceRelated: false
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build conversation for Gemini
    const geminiMessages = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "Understood. I am FinSight AI, specialized exclusively in Indian stock market analysis. I will provide educational insights only, never predictions, and always include appropriate disclaimers." }] },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      })),
      { role: "user", parts: [{ text: userMessage }] }
    ];

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      // Fallback response
      return new Response(
        JSON.stringify({
          content: "I'm currently experiencing technical difficulties connecting to my analysis engine. Please try again in a moment.\n\nIn the meantime, you can ask about:\n• Technical analysis for any NSE/BSE stock\n• Fundamental metrics comparison\n• Historical performance trends\n\n*Disclaimer: This analysis is for educational purposes only.*",
          isFinanceRelated: true,
          error: true
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I couldn't generate a response. Please try rephrasing your question about stock analysis.";

    return new Response(
      JSON.stringify({
        content: aiResponse,
        isFinanceRelated: true
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Financial analysis error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        content: "An error occurred while processing your request. Please try again."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
