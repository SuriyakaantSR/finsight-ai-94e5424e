import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
  "consolidation", "bullish", "bearish", "overbought", "oversold",
  "compare", "comparison", "vs", "versus"
];

function isFinanceRelated(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return FINANCE_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
}

const SYSTEM_PROMPT = `You are FinSight AI, an expert financial analyst specialized EXCLUSIVELY in the Indian Stock Market (NSE/BSE).

CRITICAL RULES:
1. ONLY answer questions about Indian stock market, stocks, investing, and financial analysis
2. NEVER predict future stock prices - only analyze historical data and current metrics
3. NEVER provide specific buy/sell recommendations - only educational insights
4. If asked about non-financial topics, politely redirect to finance topics
5. Always include a disclaimer that this is for educational purposes only

YOUR CAPABILITIES:
- Technical Analysis: RSI, MACD, Moving Averages, Bollinger Bands, Support/Resistance, ATR, ADX, VWAP
- Fundamental Analysis: P/E Ratio, EPS, Revenue Growth, ROE/ROCE, Debt Ratios, Market Cap
- Historical Performance Analysis: 5-10 year trends, CAGR calculations
- Multi-stock Comparisons: Side-by-side metric comparisons
- Sector Analysis: Industry trends and peer benchmarking
- Pattern Recognition: Trend analysis, momentum signals
- Confidence Scoring: Rate analysis confidence based on indicator alignment

RESPONSE FORMAT:
- Use clear markdown formatting with headers (##, ###)
- Include structured tables for metrics when relevant using markdown tables
- Provide confidence scores (0-100%) based on data availability and indicator alignment
- Always end with: "*Disclaimer: This analysis is for educational purposes only and does not constitute investment advice.*"

When analyzing a specific stock, you MUST use the stock_analysis_with_charts tool to provide structured data alongside your analysis.
When answering general questions or comparisons without specific chart needs, respond with plain text.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationHistory = [] } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userMessage = messages[messages.length - 1]?.content || "";
    
    if (!isFinanceRelated(userMessage)) {
      return new Response(
        JSON.stringify({
          content: "I apologize, but I'm specifically designed to assist with **Indian stock market analysis** only.\n\nI can help you with:\n• Stock analysis (TCS, RELIANCE, INFY, etc.)\n• Technical indicators (RSI, MACD, Moving Averages)\n• Fundamental metrics (P/E, EPS, Revenue)\n• Historical performance analysis\n• Multi-stock comparisons\n\nPlease ask a question related to NSE/BSE stocks, and I'll provide you with detailed educational insights.\n\n*This platform supports only stock market and financial queries.*",
          isFinanceRelated: false
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build conversation history for Lovable AI
    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    const requestBody: any = {
      model: "google/gemini-3-flash-preview",
      messages: aiMessages,
      tools: [
        {
          type: "function",
          function: {
            name: "stock_analysis_with_charts",
            description: "Generate comprehensive stock analysis with chart data for visualization. Use this when analyzing a specific stock or comparing stocks. Generate realistic historical data based on your knowledge of the stock's actual performance.",
            parameters: {
              type: "object",
              properties: {
                analysis: {
                  type: "string",
                  description: "Full markdown analysis text with headers, tables, and insights"
                },
                stock_symbol: {
                  type: "string",
                  description: "Stock ticker symbol (e.g., TCS, RELIANCE, INFY)"
                },
                chart_data: {
                  type: "object",
                  description: "Chart visualization data",
                  properties: {
                    ohlcv: {
                      type: "array",
                      description: "Last 60 trading days of OHLCV data based on realistic historical prices",
                      items: {
                        type: "object",
                        properties: {
                          date: { type: "string", description: "Date in YYYY-MM-DD format" },
                          open: { type: "number" },
                          high: { type: "number" },
                          low: { type: "number" },
                          close: { type: "number" },
                          volume: { type: "number" }
                        },
                        required: ["date", "open", "high", "low", "close", "volume"]
                      }
                    },
                    rsi: {
                      type: "array",
                      description: "RSI(14) values for each trading day",
                      items: {
                        type: "object",
                        properties: {
                          date: { type: "string" },
                          value: { type: "number" }
                        },
                        required: ["date", "value"]
                      }
                    },
                    macd: {
                      type: "array",
                      description: "MACD values for each trading day",
                      items: {
                        type: "object",
                        properties: {
                          date: { type: "string" },
                          macd: { type: "number" },
                          signal: { type: "number" },
                          histogram: { type: "number" }
                        },
                        required: ["date", "macd", "signal", "histogram"]
                      }
                    },
                    sma20: {
                      type: "array",
                      description: "20-day SMA values",
                      items: {
                        type: "object",
                        properties: {
                          date: { type: "string" },
                          value: { type: "number" }
                        },
                        required: ["date", "value"]
                      }
                    },
                    sma50: {
                      type: "array",
                      description: "50-day SMA values",
                      items: {
                        type: "object",
                        properties: {
                          date: { type: "string" },
                          value: { type: "number" }
                        },
                        required: ["date", "value"]
                      }
                    }
                  }
                },
                fundamental_metrics: {
                  type: "object",
                  description: "Key fundamental metrics if available",
                  properties: {
                    pe_ratio: { type: "number" },
                    eps: { type: "number" },
                    roe: { type: "number" },
                    roce: { type: "number" },
                    debt_to_equity: { type: "number" },
                    market_cap: { type: "string" },
                    revenue_growth: { type: "number" },
                    profit_margin: { type: "number" },
                    dividend_yield: { type: "number" },
                    book_value: { type: "number" }
                  }
                },
                confidence_score: {
                  type: "number",
                  description: "Analysis confidence score 0-100 based on indicator alignment and data quality"
                },
                signal: {
                  type: "string",
                  enum: ["bullish", "bearish", "neutral"],
                  description: "Overall market signal based on technical analysis"
                }
              },
              required: ["analysis"],
              additionalProperties: false
            }
          }
        }
      ]
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment.", content: "I'm currently experiencing high demand. Please try again in a few seconds." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable.", content: "The analysis service is temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({
          content: "I'm experiencing technical difficulties. Please try again in a moment.\n\n*Ensure your question relates to Indian stock market analysis.*",
          error: true
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    // Handle tool call response
    if (choice?.message?.tool_calls?.length > 0) {
      const toolCall = choice.message.tool_calls[0];
      if (toolCall.function?.name === "stock_analysis_with_charts") {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          return new Response(
            JSON.stringify({
              content: args.analysis || "Analysis completed.",
              chartData: args.chart_data || null,
              fundamentalMetrics: args.fundamental_metrics || null,
              stockSymbol: args.stock_symbol || null,
              confidenceScore: args.confidence_score || null,
              signal: args.signal || null,
              isFinanceRelated: true
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (parseError) {
          console.error("Tool call parse error:", parseError);
        }
      }
    }

    // Fallback to regular text response
    const aiResponse = choice?.message?.content || 
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
