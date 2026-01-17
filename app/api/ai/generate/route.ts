import { NextRequest, NextResponse } from 'next/server';
import { AIContentService } from '@/lib/ai-service';

const aiService = new AIContentService();

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Validate the payload
    if (!payload.title || !payload.contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: title and contentType' },
        { status: 400 }
      );
    }

    // Generate content using the server-side AI service
    const result = await aiService.generateContent(payload);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}