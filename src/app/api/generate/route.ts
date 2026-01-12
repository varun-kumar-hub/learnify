import { GoogleGenerativeAI } from "@google/generative-ai";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

const GenerateSchema = z.object({
  topic: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic } = GenerateSchema.parse(body);

    const cookieStore = await cookies();
    const apiKey = cookieStore.get("gemini_api_key")?.value;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key missing. Please set your Gemini API Key." },
        { status: 401 }
      );
    }

    // Use Stable Model (Free Tier Compatible)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const prompt = `
          You are an expert curriculum designer. Generate a knowledge graph for "${topic}".
          Return ONLY a JSON object with this structure:
          {
            "title": "Topic Title",
            "description": "Brief overview",
            "nodes": [ { "id": "1", "label": "Main Concept", "description": "Explanation", "type": "root" } ],
            "edges": [ { "source": "1", "target": "2", "label": "connects" } ]
          }
          Create 10-15 nodes.
        `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonStr = text.replace(/```json\n|\n```/g, "").trim();
      let data;
      try {
        data = JSON.parse(jsonStr);
      } catch (e) {
        return NextResponse.json({ error: "Failed to format AI response." }, { status: 500 });
      }

      // --- PERSISTENCE ---
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: insertData, error: insertError } = await supabase
          .from('learning_paths')
          .insert({ user_id: user.id, topic: topic, graph_data: data })
          .select('id')
          .single();

        if (!insertError && insertData) {
          return NextResponse.json({ ...data, pathId: insertData.id });
        }
      }

      return NextResponse.json(data);

    } catch (apiError: any) {
      console.warn("Gemini API Error:", apiError.message);

      const msg = apiError.message?.toLowerCase() || "";
      if (msg.includes("403") || msg.includes("quota") || msg.includes("limit")) {
        return NextResponse.json(
          { error: "AI service temporarily unavailable (Quota/Auth). Please try again later." },
          { status: 503 }
        );
      }

      throw apiError;
    }

  } catch (error: any) {
    console.error("Global API Handler Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
