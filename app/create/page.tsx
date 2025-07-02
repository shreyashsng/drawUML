'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { generateUMLFromText, DiagramType, DetailLevel } from '../utils/api';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Code, Info, ZoomIn, ZoomOut, Move, Download, Cpu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { Navbar } from "@/components/navbar";

type AIModel = 'deepseek/deepseek-r1:free' | 'google/gemma-3-27b-it:free';

const ZoomControls = ({ zoomIn, zoomOut, resetTransform }: any) => (
  <div className="flex gap-2">
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white"
      onClick={() => zoomIn(0.5)}
    >
      <ZoomIn className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white"
      onClick={() => zoomOut(0.5)}
    >
      <ZoomOut className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white"
      onClick={() => resetTransform()}
    >
      <Move className="h-4 w-4" />
    </Button>
  </div>
);

const ModelSelector = ({ 
  currentModel, 
  onModelChange,
  isGenerating
}: { 
  currentModel: AIModel;
  onModelChange: (model: ModelInfo) => void;
  isGenerating: boolean;
}) => {
  const models: ModelInfo[] = [
    {
      id: 'deepseek/deepseek-r1:free',
      name: 'DeepSeek R1',
      description: 'Optimized for code and technical tasks',
      temperature: 0.7,
      maxTokens: 4096,
      alias: 'deepseek-r1'
    },
    {
      id: 'google/gemma-3-27b-it:freee',
      name: 'Gemma 3 27B',
      description: 'High accuracy, 131K context window',
      temperature: 0.7,
      maxTokens: 131072,
      alias: 'gemma-3'
    }
  ];

  return (
    <div className="z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white relative"
            disabled={isGenerating}
          >
            <Cpu className="h-4 w-4" />
            {isGenerating && (
              <span className="absolute -top-1 -right-1 h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-[280px] bg-white/95 backdrop-blur-sm border-gray-200"
          style={{ zIndex: 101 }}
        >
          <DropdownMenuLabel className="flex items-center">
            <Cpu className="h-4 w-4 mr-2" />
            AI Model
          </DropdownMenuLabel>
          {models.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onModelChange(model)}
              className="flex flex-col items-start py-2"
              disabled={isGenerating}
            >
              <div className="flex items-center w-full">
                <span className="font-medium">{model.name}</span>
                {currentModel === model.id && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-green-500" />
                )}
              </div>
              <span className="text-xs text-gray-500">{model.description}</span>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                  {model.alias}
                </span>
                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                  {model.maxTokens.toLocaleString()} tokens
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

type ModelInfo = {
  id: AIModel;
  name: string;
  description: string;
  temperature: number;
  maxTokens: number;
  alias: string;
};

// Add this type for better error handling
type ErrorType = {
  message: string;
  action?: string;
};

export default function CreatePage() {
  const [description, setDescription] = useState('');
  const [diagramType, setDiagramType] = useState<DiagramType>('class');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);
  const [result, setResult] = useState<any>(null);
  const [currentModel, setCurrentModel] = useState<AIModel>('google/gemini-2.0-pro-exp-02-05:free');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await generateUMLFromText(description, diagramType, detailLevel, currentModel);
      
      if (!result.plantUMLCode || !result.plantUMLCode.includes('@startuml')) {
        throw new Error('Invalid diagram generated');
      }
      
      setResult(result);
    } catch (err) {
      console.error('Generation error:', err);
      setResult(null);
      
      setError({
        message: 'Unable to generate diagram with the current model.',
        action: 'Try regenerating or switch to a different AI model.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (modelInfo: ModelInfo) => {
    setCurrentModel(modelInfo.id);
    setResult(null);
    setError(null);
  };

  const downloadImage = async (format: 'svg' | 'png') => {
    if (!result) return;
    try {
      const url = format === 'png' ? result.pngUrl : result.svgUrl;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      downloadFile(blobUrl, `diagram-${diagramType}-${detailLevel}.${format}`);
    } catch (error) {
      setError({
        message: 'Failed to download diagram.',
        action: 'Please try again or choose a different format.'
      });
    }
  };

  const downloadPlantUML = () => {
    if (!result) return;
    const blob = new Blob([result.plantUMLCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    downloadFile(url, `diagram-${diagramType}-${detailLevel}.txt`);
  };

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Update the error display component
  const ErrorMessage = ({ error }: { error: ErrorType }) => (
    <div className="mt-2 p-4 bg-red-50 border border-red-100 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {error.message}
          </h3>
          {error.action && (
            <div className="mt-1 text-sm text-red-600">
              {error.action}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9] p-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-md text-center">
          <div className="mb-4 inline-block bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
            <Code className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold mb-2">drawUML</h1>
          <p className="text-gray-600 mb-4">
            For the best experience, please access drawUML on a desktop device.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9]">
      <Navbar />
      
      <div className="pt-24 h-[calc(100vh-0px)] p-4">
        <div className="h-full flex gap-4">
          <Card className="w-1/4 flex flex-col bg-white/80 backdrop-blur-sm">
            <CardHeader className="shrink-0 pb-4">
              <CardTitle className="text-xl font-semibold">Generate UML Diagram</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-4 pr-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Diagram Type</label>
                <Select
                  value={diagramType}
                  onValueChange={(value: DiagramType) => setDiagramType(value)}
                >
                  <SelectTrigger className="w-full bg-white/50 border-gray-200 hover:bg-white/80 transition-colors">
                    <SelectValue placeholder="Select diagram type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-gray-200">
                    <SelectItem value="class" className="hover:bg-gray-50">Class Diagram</SelectItem>
                    <SelectItem value="sequence" className="hover:bg-gray-50">Sequence Diagram</SelectItem>
                    <SelectItem value="usecase" className="hover:bg-gray-50">Use Case Diagram</SelectItem>
                    <SelectItem value="activity" className="hover:bg-gray-50">Activity Diagram</SelectItem>
                    <SelectItem value="component" className="hover:bg-gray-50">Component Diagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Detail Level</label>
                <Select
                  value={detailLevel}
                  onValueChange={(value: DetailLevel) => setDetailLevel(value)}
                >
                  <SelectTrigger className="w-full bg-white/50 border-gray-200 hover:bg-white/80 transition-colors">
                    <SelectValue placeholder="Select detail level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-gray-200">
                    <SelectItem value="basic" className="hover:bg-gray-50">Basic</SelectItem>
                    <SelectItem value="intermediate" className="hover:bg-gray-50">Intermediate</SelectItem>
                    <SelectItem value="detailed" className="hover:bg-gray-50">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your UML diagram in natural language..."
                  className="h-48 resize-none bg-white/50 border-gray-200 hover:bg-white/80 transition-colors"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !description}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-opacity
                  disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-50 h-12 rounded-xl"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </div>
                ) : (
                  "Generate Diagram"
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{error.message}</p>
                  {error.action && (
                    <p className="text-sm text-red-500 mt-1">{error.action}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm">
            <CardHeader className="shrink-0 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Preview</CardTitle>
              {result && (
                <div className="space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-white/60">
                        <Info className="h-5 w-5 text-gray-600" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white/95 backdrop-blur-sm">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-md">
                            <Code className="h-4 w-4 text-white" />
                          </div>
                          <span>DrawUML Code</span>
                        </DialogTitle>
                      </DialogHeader>
                      <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[60vh] text-sm">
                        <code>{result.plantUMLCode}</code>
                      </pre>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-white/60">
                        <Download className="h-5 w-5 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-gray-200">
                      <DropdownMenuLabel className="text-gray-500">Download As</DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => downloadImage('svg')}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        SVG Image
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => downloadImage('png')}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        PNG Image
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => downloadPlantUML()}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        PlantUML Code
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 relative">
              <div className="absolute inset-0 bg-blue-50" style={{ 
                backgroundImage: `
                  linear-gradient(to right, #e3e8ef 1px, transparent 1px),
                  linear-gradient(to bottom, #e3e8ef 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                opacity: 0.5
              }} />
              
              <div className="fixed bottom-8 right-8" style={{ zIndex: 100 }}>
                <ModelSelector 
                  currentModel={currentModel}
                  onModelChange={handleModelChange}
                  isGenerating={loading}
                />
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full w-full relative"
                  >
                    <TransformWrapper
                      initialScale={1}
                      minScale={0.5}
                      maxScale={4}
                      centerOnInit
                      limitToBounds={true}
                      wheel={{ step: 0.1 }}
                    >
                      {(utils) => (
                        <div className="absolute inset-0">
                          <TransformComponent
                            wrapperClass="!w-full !h-full"
                            contentClass="!w-full !h-full flex items-center justify-center"
                          >
                            <div className="max-w-full max-h-full p-4 flex items-center justify-center">
                              <img 
                                src={result.pngUrl} 
                                alt="Generated UML Diagram" 
                                className="max-w-full max-h-[calc(100vh-12rem)] object-contain bg-white rounded-lg shadow-lg"
                                onError={() => {
                                  setError({
                                    message: 'Failed to render the diagram.',
                                    action: 'The diagram might be too complex. Try simplifying your description or using a different model.'
                                  });
                                  setResult(null);
                                }}
                              />
                            </div>
                          </TransformComponent>
                          <div className="fixed bottom-8 left-8 z-50">
                            <ZoomControls {...utils} />
                          </div>
                        </div>
                      )}
                    </TransformWrapper>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center text-gray-500 z-10"
                  >
                    Your generated UML diagram will appear here
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
} 
