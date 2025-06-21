'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function ImageGenerator() {
  const [plotOutline, setPlotOutline] = useState('');
  const [setting, setSetting] = useState('');
  const [style, setStyle] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [textResponse, setTextResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!plotOutline.trim()) {
      setError('Please enter a plot outline');
      return;
    }

    setLoading(true);
    setError(null);
    setImageBase64(null);
    setTextResponse(null);

    try {
      // Create the structured prompt data
      const promptData = {
        plot_outline: plotOutline,
        setting: setting || 'General setting',
        style: style || 'Children\'s book illustration style'
      };

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: JSON.stringify(promptData)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setImageBase64(data.imageBase64);
      if (data.textResponse) {
        setTextResponse(data.textResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Story Illustration Generator (Gemini)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="plotOutline" className="text-sm font-medium">
              Plot Outline (Required):
            </label>
            <Input
              id="plotOutline"
              value={plotOutline}
              onChange={(e) => setPlotOutline(e.target.value)}
              placeholder="A veterinarian using a stethoscope to listen to the heartbeat of a baby otter"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="setting" className="text-sm font-medium">
              Setting (Optional):
            </label>
            <Input
              id="setting"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="A cozy veterinary clinic in the forest"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="style" className="text-sm font-medium">
              Style (Optional):
            </label>
            <Input
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Children's book illustration style, warm and friendly"
              disabled={loading}
            />
          </div>
          
          <Button 
            onClick={generateImage} 
            disabled={loading || !plotOutline.trim()}
            className="w-full"
          >
            {loading ? 'Generating Illustration...' : 'Generate Illustration'}
          </Button>

          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {textResponse && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">AI Response:</h3>
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-gray-700">{textResponse}</p>
              </div>
            </div>
          )}

          {imageBase64 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Generated Illustration:</h3>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={`data:image/png;base64,${imageBase64}`}
                  alt="Generated illustration"
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 