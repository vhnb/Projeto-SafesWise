import { NextResponse } from 'next/server'

export const runtime = 'edge'

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default async function POST(req: Request) {
    try {
        const body = await req.json();
        const messages = body.messages as Message[];
        
        const geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta2/models/[MODEL_ID]:predict"; // URL correta do Google Gemini
        
        const response = await fetch(geminiApiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`, 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: {
                    text: messages.map((m) => m.content).join("\n")
                },
                maxOutputTokens: 150,
                temperature: 1,
            })
        });

        const textResponse = await response.text();
        try {
            const geminiResponse = JSON.parse(textResponse);

            const assistantMessage = {
                id: '1',
                role: 'assistant',
                content: geminiResponse.candidates[0].output
            };

            return new NextResponse(JSON.stringify([assistantMessage]), { status: 200 });
        } catch (jsonError) {
            console.error("Resposta não era JSON:", textResponse);
            throw new Error("A resposta não é um JSON válido.");
        }
        
    } catch (error) {
        console.error("Error in /api/chat:", error);
        return new NextResponse(JSON.stringify({ error: "An error occurred on the server." }), { status: 500 });
    }
}