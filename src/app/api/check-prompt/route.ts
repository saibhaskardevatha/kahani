import { NextRequest, NextResponse } from 'next/server';
import { PangeaConfig, PromptGuardService, AIGuardService } from 'pangea-node-sdk';

const pangeaDomain = process.env.PANGEA_DOMAIN;
const pangeaToken = process.env.PANGEA_AUTH_TOKEN;

if (!pangeaDomain || !pangeaToken) {
  throw new Error("Missing Pangea environment variables");
}

const config = new PangeaConfig({ domain: pangeaDomain });
const promptGuard = new PromptGuardService(pangeaToken, config);
const aiGuard = new AIGuardService(pangeaToken, config);

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    // 1. Check for prompt injection attacks
    const injectionResponse = await promptGuard.guard({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    if (injectionResponse.result.detected) {
      return NextResponse.json(
        { blocked: true, reason: injectionResponse.summary },
        { status: 200 }
      );
    }
    
    // 2. Check for malicious content
    const maliciousResponse = await aiGuard.guardText({
      text: prompt,
    });

    if (maliciousResponse.result.blocked) {
      return NextResponse.json(
        { blocked: true, reason: maliciousResponse.summary },
        { status: 200 }
      );
    }

    return NextResponse.json({ blocked: false }, { status: 200 });

  } catch (error) {
    console.error("Pangea API Error:", error);
    return NextResponse.json({ error: 'Failed to validate prompt' }, { status: 500 });
  }
} 