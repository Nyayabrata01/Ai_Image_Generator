"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Wand2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

type Ad = {
  headline: string;
  description: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const [product, setProduct] = useState("");
  const [offer, setOffer] = useState("");
  const [audience, setAudience] = useState("");
  const [ads, setAds] = useState<Ad[]>([]);
  const [loadingKeywords, setLoadingKeywords] = useState(false);

  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingImage(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to generate image");

      setImage(data.imageUrl);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingImage(false);
    }
  };

  const generateKeywords = async () => {
    if (!product || !offer || !audience) {
      toast({
        title: "Error",
        description: "All fields are required to generate ads.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingKeywords(true);
      const response = await fetch("/api/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, offer, audience }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to generate ads");

      setAds(data.ads);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingKeywords(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* === AI Image Generator === */}
        <section>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">AI Image Generator</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Transform your ideas into stunning images using artificial intelligence.
            </p>
          </div>

          <Card className="p-6 mt-6 bg-gray-800/50 border-gray-700">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button
                  onClick={generateImage}
                  disabled={loadingImage}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loadingImage ? (
                    "Generating..."
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              {loadingImage && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-300 mt-4">Creating your masterpiece...</p>
                </div>
              )}

              {image && !loadingImage && (
                <div className="mt-8 rounded-lg overflow-hidden">
                  <img src={image} alt="Generated image" className="w-full h-auto" />
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* === Ad Keywords Generator === */}
        <section>
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">AI Google Ads Generator</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Enter a product, discount, and target audience to generate Google ad copy.
            </p>
          </div>

          <Card className="p-6 mt-6 bg-gray-800/50 border-gray-700">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  placeholder="Product/Service"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Offer (e.g. 50% off)"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Target Audience (e.g. students)"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                onClick={generateKeywords}
                disabled={loadingKeywords}
                className="bg-green-600 hover:bg-green-700"
              >
                {loadingKeywords ? (
                  "Generating..."
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Ads
                  </>
                )}
              </Button>

              {ads.length > 0 && (
                <div className="mt-6 space-y-4">
                  {ads.map((ad, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-900 text-white border border-gray-700 rounded-lg"
                    >
                      <h3 className="text-lg font-semibold">{ad.headline}</h3>
                      <p className="text-gray-300">{ad.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
