import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { storyline } = await request.json();

    if (!storyline) {
      return NextResponse.json(
        { error: 'Storyline is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const prompt = `
    You are a professional content creator for audio stories. Based on the following storyline, generate an engaging title and description for the audio story.

    Storyline: ${storyline}

    Please provide your response in the following JSON format:
    {
      "title": "A catchy, engaging title (max 45 characters)",
      "description": "A compelling description that summarizes the story and hooks listeners (max 100 characters)"
    }

    Requirements:
    - Title should be catchy and memorable
    - Description should be engaging and give listeners a clear idea of what the story is about
    - Keep both title and description concise and appealing
    - Make sure the response is valid JSON
    `;

    const result = await ai.models.generateContent({ 
      model: 'gemini-2.0-flash', 
      contents: prompt 
    });
    
    const text = result.text || '';
    console.log('Generated text:', text);

    // Try to parse the JSON response
    let metadata;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        metadata = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      // Fallback: create a simple title and description
      metadata = {
        title: "Your Audio Story",
        description: "Listen to the generated episode"
      };
    }

    // Validate the response
    if (!metadata.title || !metadata.description) {
      metadata = {
        title: "Your Audio Story",
        description: "Listen to the generated episode"
      };
    }

    return NextResponse.json({
      success: true,
      title: metadata.title,
      description: metadata.description,
    });

  } catch (error) {
    console.error('Error generating metadata:', error);
    return NextResponse.json(
      { error: 'Failed to generate metadata' },
      { status: 500 }
    );
  }
} 