import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Speech-to-text API called');
    
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      console.error('No audio file provided');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate audio format
    const supportedFormats = [
      'audio/mpeg', 'audio/mp3', 'audio/mpeg3', 'audio/x-mpeg-3', 'audio/x-mp3',
      'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/aac', 'audio/x-aac',
      'audio/aiff', 'audio/x-aiff', 'audio/ogg', 'audio/opus', 'audio/flac',
      'audio/x-flac', 'audio/mp4', 'audio/x-m4a', 'audio/amr', 'audio/x-ms-wma',
      'audio/webm', 'video/webm'
    ];

    // Strip codec information from MIME type (e.g., 'audio/webm;codecs=opus' -> 'audio/webm')
    const cleanMimeType = audioFile.type.split(';')[0];
    
    if (!supportedFormats.includes(cleanMimeType)) {
      console.error('Unsupported audio format:', {
        original: audioFile.type,
        clean: cleanMimeType
      });
      return NextResponse.json(
        { error: `Unsupported audio format: ${cleanMimeType}. Supported formats: ${supportedFormats.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('Audio file received:', {
      name: audioFile.name,
      size: audioFile.size,
      originalType: audioFile.type,
      cleanType: cleanMimeType
    });

    // Check if API key is configured
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      console.error('SARVAM_API_KEY not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Convert audio file to buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    console.log('Audio buffer size:', audioBuffer.length);

    // Prepare the request for Sarvam API
    const sarvamFormData = new FormData();
    const audioBlob = new Blob([audioBuffer], { type: cleanMimeType });
    sarvamFormData.append('file', audioBlob, audioFile.name);

    console.log('Making request to Sarvam API with:', {
      fileName: audioFile.name,
      originalFileType: audioFile.type,
      cleanFileType: cleanMimeType,
      fileSize: audioBuffer.length
    });

    // Make request to Sarvam API
    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': apiKey,
      },
      body: sarvamFormData,
    });

    console.log('Sarvam API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sarvam API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { error: `Sarvam API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Sarvam API response data:', data);

    // Check if we have a transcript
    if (!data.transcript) {
      console.error('No transcript in response:', data);
      return NextResponse.json(
        { error: 'No transcript received from Sarvam API' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      text: data.transcript,
      confidence: 0.95,
      language: data.language_code || null,
      request_id: data.request_id || null
    });

  } catch (error) {
    console.error('Speech-to-text error:', error);
    return NextResponse.json(
      { error: `Failed to process audio: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 