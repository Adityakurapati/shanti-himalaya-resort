import { NextRequest, NextResponse } from 'next/server';
import { dbQueryService } from '@/lib/db-query-service';

export async function POST(request: NextRequest) {
  try {
    console.log(`🔍 ===== NEW CHAT REQUEST =====`);
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log(`🔍 User query: "${message}"`);

    // Step 1: Get data from database
    const dbContext = await dbQueryService.getRelevantData(message);
    const databaseContent = dbQueryService.formatContextForAI(dbContext);

    console.log(`📊 Database results: ${dbContext.journeys.length} journeys, ${dbContext.experientialStays.length} stays`);

    // Step 2: Call Gemini with optimized prompt
    const aiResponse = await callGeminiAPI(message, databaseContent, dbContext);
    
    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('💥 Chat API Error:', error);
    
    const fallbackResponse = getJourneysFallbackResponse();
    
    return NextResponse.json({
      success: true,
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      source: "fallback"
    });
  }
}

async function callGeminiAPI(
  userQuestion: string, 
  databaseContent: string,
  dbContext: any
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('No Gemini API key');
    return getJourneysFallbackResponse();
  }

  // Create a SIMPLE, SHORT prompt
  const prompt = `You are Shanti Himalaya's assistant. Answer the user's question using ONLY this data:

${databaseContent}

User question: "${userQuestion}"

CONTACT: Phone/WhatsApp: +91 98765 43210, Email: info@shantihimalaya.com

IMPORTANT RULES:
1. Answer in 150 words maximum
2. Use ONLY the data above - if something isn't listed, say "Please contact us for details"
3. Format with bullet points (•) for lists
4. Keep each bullet point SHORT (one line)
5. Make sure response is COMPLETE - don't stop mid-sentence
6. End with: "What would you like to know next?"

Example format for journeys:
• Journey Name (Duration, Difficulty)
  Brief description
• Another Journey (Duration, Difficulty)
  Brief description

Now answer the user's question:`;

  try {
    console.log(`🔍 Calling Gemini API...`);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400, // SHORTER responses
            topP: 0.8,
            topK: 40,
          }
        }),
        signal: AbortSignal.timeout(10000)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', response.status);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      let responseText = data.candidates[0].content.parts[0].text.trim();
      console.log(`✅ Gemini response received: ${responseText.length} chars`);
      
      // Validate and clean response
      responseText = validateResponse(responseText, userQuestion);
      
      return responseText;
    } else {
      throw new Error('No response from Gemini');
    }
    
  } catch (error) {
    console.error('❌ Gemini API call failed:', error);
    return getJourneysFallbackResponse();
  }
}

function validateResponse(text: string, question: string): string {
  console.log(`🔍 Validating response...`);
  
  // Clean up the text
  text = text.trim();
  
  // Check if response is too short or incomplete
  if (text.length < 50) {
    console.log('⚠️ Response too short, using fallback');
    return getJourneysFallbackResponse();
  }
  
  // Check for common cutoff patterns
  const cutoffPatterns = [
    /\*$/,
    /•$/,
    /\s*\.\.\.$/,
    /\s*--$/,
    /\s*---$/,
    /\s*\(incomplete\)$/i
  ];
  
  for (const pattern of cutoffPatterns) {
    if (pattern.test(text)) {
      console.log('⚠️ Response appears cut off');
      // Remove the cutoff pattern and add proper ending
      text = text.replace(pattern, '');
      if (!text.endsWith('.')) text += '.';
    }
  }
  
  // Ensure it ends with a question
  if (!text.endsWith('?')) {
    text += "\n\nWhat would you like to know next?";
  }
  
  return text;
}

function getJourneysFallbackResponse(): string {
  return `Namaste! 🙏 Welcome to Shanti Himalaya!

Based on our offerings, here are some Himalayan journeys you can experience:

**Popular Journeys:**
• **Everest Base Camp Trek** (12-14 days, Challenging)
  The ultimate Himalayan adventure to the world's highest peak

• **Annapurna Circuit** (18 days, Moderate-Challenging)
  Circle the Annapurna massif through diverse landscapes

• **Langtang Valley Trek** (7-10 days, Moderate)
  Beautiful valley trekking near Kathmandu

• **Bhutan Cultural Tour** (10 days, Easy)
  Explore the mystical kingdom of Bhutan

**What's Included:**
✓ Expert mountain guides
✓ Accommodation during the journey
✓ Most meals
✓ Safety equipment
✓ Cultural experiences

For detailed itineraries, exact pricing, and availability:
📞 Call/WhatsApp: +91 98765 43210
📧 Email: info@shantihimalaya.com

Which journey interests you most?`;
}