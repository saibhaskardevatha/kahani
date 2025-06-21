import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Parse the prompt as JSON to extract story details
    let plot_outline, setting, style;
    try {
      const promptData = JSON.parse(prompt);
      plot_outline = promptData.plot_outline;
      setting = promptData.setting;
      style = promptData.style;
    } catch (error) {
      // If parsing fails, treat the entire prompt as plot_outline
      plot_outline = prompt;
      setting = '';
      style = '';
      console.log(error)
    }

    const updatedPrompt = `
    You are a professional illustrator. You are given a story line, setting of the story & style of the story. You need to generate a illustration for the audio story.
    The story line is: ${plot_outline}
    The setting of the story is: ${setting}
    The style of the story is: ${style}

    Output should be in the following format: square image with 1:1 aspect ratio.
    `;

    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
      responseMimeType: 'text/plain',
    };

    const model = 'gemini-2.0-flash-preview-image-generation';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: updatedPrompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let imageBase64: string | null = null;
    let textResponse = '';

    for await (const chunk of response) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue;
      }

      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        imageBase64 = inlineData.data || null;
      } else if (chunk.text) {
        textResponse += chunk.text;
      }
    }

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageBase64,
      prompt: updatedPrompt,
      textResponse: textResponse || null,
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 