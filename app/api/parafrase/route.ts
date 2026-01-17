import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { text, style } = await request.json();

        if (!text || !text.trim()) {
            return NextResponse.json(
                { error: 'Teks tidak boleh kosong' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API Key tidak dikonfigurasi di server' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const styleInstructions: Record<string, string> = {
            formal: 'dalam gaya bahasa formal dan profesional',
            kasual: 'dalam gaya bahasa kasual dan santai',
            ringkas: 'dengan cara yang lebih ringkas dan padat',
            detail: 'dengan penjelasan yang lebih detail dan lengkap',
            akademik: 'dalam gaya penulisan akademik dan ilmiah',
            kreatif: 'dengan gaya bahasa yang kreatif dan menarik',
        };

        const prompt = `Parafrase teks berikut ${styleInstructions[style] || styleInstructions.formal} dalam bahasa Indonesia. Pertahankan makna asli tetapi gunakan kata-kata dan struktur kalimat yang berbeda. Hanya berikan hasil parafrase tanpa penjelasan tambahan.

Teks asli:
${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const paraphrasedText = response.text();

        return NextResponse.json({ result: paraphrasedText });
    } catch (error: any) {
        console.error('Error in parafrase API:', error);

        // Handle specific Google AI errors
        let errorMessage = 'Gagal melakukan parafrase';

        if (error.message?.includes('quota') || error.message?.includes('QUOTA_EXCEEDED')) {
            errorMessage = 'Quota API sudah habis. Silakan coba lagi nanti.';
        } else if (error.message?.includes('rate limit') || error.message?.includes('RATE_LIMIT_EXCEEDED')) {
            errorMessage = 'Terlalu banyak request. Silakan tunggu beberapa saat dan coba lagi.';
        } else if (error.message?.includes('API key')) {
            errorMessage = 'API Key tidak valid.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: error.status || 500 }
        );
    }
}
