'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateUMLFromText, DiagramType, DetailLevel } from './utils/api';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Code, Info, ZoomIn, ZoomOut, Move, Download, Cpu } from "lucide-react";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const BlueprintGrid = () => (
  <div className="absolute inset-0 bg-blue-50" style={{ 
    backgroundImage: `
      linear-gradient(to right, #e3e8ef 1px, transparent 1px),
      linear-gradient(to bottom, #e3e8ef 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    opacity: 0.5
  }} />
);

const DiagramLegend = ({ type }: { type: DiagramType }) => {
  const [isVisible, setIsVisible] = useState(false);
  const legends = {
    usecase: [
      { symbol: '→', description: 'Association' },
      { symbol: '..>', description: 'Include/Extend relationship' },
      { symbol: '👤', description: 'Actor' },
      { symbol: '⭕', description: 'Use Case' },
      { symbol: '□', description: 'System Boundary' }
    ],
    class: [
      { symbol: '--|>', description: 'Inheritance' },
      { symbol: '-->', description: 'Association' },
      { symbol: 'o--', description: 'Aggregation' },
      { symbol: '*--', description: 'Composition' },
      { symbol: '+', description: 'Public' },
      { symbol: '-', description: 'Private' },
      { symbol: '#', description: 'Protected' }
    ],
    sequence: [
      { symbol: '→', description: 'Synchronous Message' },
      { symbol: '->', description: 'Asynchronous Message' },
      { symbol: '-->', description: 'Return Message' },
      { symbol: '□', description: 'Activation Box' },
      { symbol: '↓', description: 'Timeline' }
    ],
    activity: [
      { symbol: '◆', description: 'Decision Node' },
      { symbol: '→', description: 'Flow' },
      { symbol: '||', description: 'Fork/Join' },
      { symbol: '●', description: 'Start/End Node' },
      { symbol: '□', description: 'Activity' }
    ],
    component: [
      { symbol: '[ ]', description: 'Component' },
      { symbol: '○', description: 'Interface (Ball)' },
      { symbol: '◁', description: 'Interface (Socket)' },
      { symbol: '→', description: 'Dependency' },
      { symbol: '⬡', description: 'Port' }
    ]
  };

  return (
    <div className="absolute top-4 right-4 z-20">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white"
        onClick={() => setIsVisible(!isVisible)}
      >
        <Info className="h-4 w-4" />
      </Button>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-10 right-0 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 min-w-[200px]"
          >
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Legend</h3>
            <div className="space-y-1">
              {legends[type].map(({ symbol, description }, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <span className="w-8 font-mono">{symbol}</span>
                  <span>{description}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type ZoomControlsProps = {
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  resetTransform: () => void;
};

const ZoomControls = ({ zoomIn, zoomOut, resetTransform }: ZoomControlsProps) => (
  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
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

const BrandHeader = () => (
  <div className="flex items-center gap-2">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
      <Code className="h-5 w-5 text-white" />
    </div>
    <div>
      <h1 className="text-xl font-bold">drawUML</h1>
      <p className="text-xs text-gray-500">AI-Powered UML Diagram Generator</p>
    </div>
        </div>
);

type DownloadFormat = 'svg' | 'png' | 'txt';

const DownloadOptions = ({ 
  onDownload, 
  disabled 
}: { 
  onDownload: (format: DownloadFormat) => void;
  disabled: boolean;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" disabled={disabled}>
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => onDownload('svg')}>
        Download as SVG
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onDownload('png')}>
        Download as PNG
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onDownload('txt')}>
        Download as TXT
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

type AIModel = 'deepseek/deepseek-r1:free' | 'google/gemini-2.0-flash-lite-preview-02-05:free' | 'nvidia/llama-3.1-nemotron-70b-instruct:free' | 'google/gemini-2.0-flash-thinking-exp:free'  ;

type ModelInfo = {
  id: AIModel;
  name: string;
  description: string;
  temperature: number;
  maxTokens: number;
  alias: string;
};

const ModelSelector = ({ currentModel, onModelChange, isGenerating }: { 
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
      id: 'nvidia/llama-3.1-nemotron-70b-instruct:free',
      name: 'Llama 3.1 Nemotron',
      description: 'High accuracy, 131K context window',
      temperature: 0.7,
      maxTokens: 131072, // Based on the API docs showing 131,072 context
      alias: 'nemotron-70b'
    },
    {
      id: 'google/gemini-2.0-flash-lite-preview-02-05:free',
      name: 'Gemini Flash Lite',
      description: 'Fast responses, balanced performance',
      temperature: 0.7,
      maxTokens: 4096,
      alias: 'gemini-flash'
    },
    {
      id: 'google/gemini-2.0-flash-thinking-exp:free',
      name: 'Gemini Flash Thinking Experiment',
      description: 'Fast responses, thinking ability',
      temperature: 0.7,
      maxTokens: 4096,
      alias: 'gemini-flash-thinking'
    },
  ];

  return (
    <div className="absolute bottom-4 right-4 z-20">
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
        <DropdownMenuContent align="end" className="w-[280px]">
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

const MobileWarning = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-md text-center">
      <div className="mb-4 inline-block bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
        <Code className="h-6 w-6 text-white" />
      </div>
      <h1 className="text-xl font-bold mb-2">drawUML</h1>
      <p className="text-gray-600 mb-4">
        For the best experience, please access drawUML on a desktop device. 
        The application requires a larger screen for optimal UML diagram creation and visualization.
      </p>
      <p className="text-sm text-gray-500">
        We're working on making it mobile-friendly!
      </p>
    </div>
  </div>
);

export default function Home() {
  const [description, setDescription] = useState('');
  const [diagramType, setDiagramType] = useState<DiagramType>('class');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    plantUMLCode: string;
    pngUrl: string;
    svgUrl: string;
  } | null>(null);
  const [currentModelInfo, setCurrentModelInfo] = useState<ModelInfo>({
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1',
    description: 'Optimized for code and technical tasks',
    temperature: 0.7,
    maxTokens: 4096,
    alias: 'deepseek-r1'
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return <MobileWarning />;
  }

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await generateUMLFromText(
        description, 
        diagramType, 
        detailLevel, 
        currentModelInfo.id,
        currentModelInfo.temperature,
        currentModelInfo.maxTokens
      );
      setResult(result);
    } catch (err) {
      setError('Failed to generate diagram. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (result?.plantUMLCode) {
      navigator.clipboard.writeText(result.plantUMLCode);
    }
  };

  const handleDownload = async (format: DownloadFormat) => {
    if (!result) return;

    try {
      const url = format === 'png' ? result.pngUrl : 
                  format === 'svg' ? result.svgUrl :
                  format === 'txt' ? null : null;

      if (format === 'txt') {
        const blob = new Blob([result.plantUMLCode], { type: 'text/plain' });
        const blobUrl = window.URL.createObjectURL(blob);
        downloadFile(blobUrl, `diagram-${diagramType}-${detailLevel}.txt`);
        return;
      }

      if (url) {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        downloadFile(blobUrl, `diagram-${diagramType}-${detailLevel}.${format}`);
      }
    } catch (error) {
      setError('Failed to download diagram. Please try again.');
      console.error(error);
    }
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

  const handleModelChange = (modelInfo: ModelInfo) => {
    setCurrentModelInfo(modelInfo);
    setResult(null);
    setError(null);
  };

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="h-14 bg-white/50 backdrop-blur-sm border-b border-gray-200 px-4 flex justify-between items-center">
        <BrandHeader />
        <a 
          href="https://github.com/yourusername/drawuml" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          GitHub
        </a>
      </div>

      <div className="h-[calc(100vh-3.5rem)] p-4 flex gap-4">
        <Card className="w-1/4 flex flex-col">
          <CardHeader className="shrink-0 pb-4">
            <BrandHeader />
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-4 pr-2">
            <div>
              <label className="text-sm font-medium">Diagram Type</label>
              <Select value={diagramType} onValueChange={(value: DiagramType) => setDiagramType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Class Diagram</SelectItem>
                  <SelectItem value="sequence">Sequence Diagram</SelectItem>
                  <SelectItem value="usecase">Use Case Diagram</SelectItem>
                  <SelectItem value="activity">Activity Diagram</SelectItem>
                  <SelectItem value="component">Component Diagram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Detail Level</label>
              <Select value={detailLevel} onValueChange={(value: DetailLevel) => setDetailLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Diagram (30% Detail)</SelectItem>
                  <SelectItem value="intermediate">Intermediate Diagram (75% Detail)</SelectItem>
                  <SelectItem value="detailed">Detailed Diagram (100% Detail)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium mb-2">Description</label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 min-h-[200px] resize-none"
                placeholder="Describe your system or process..."
              />
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={loading || !description}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : 'Generate UML Diagram'}
            </Button>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-row justify-between items-center shrink-0 bg-white z-10 pb-4">
            <CardTitle>Generated Diagram</CardTitle>
            <div className="space-x-2">
              {result && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Code className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>PlantUML Code</DialogTitle>
                    </DialogHeader>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[calc(80vh-8rem)]">
                      <pre className="text-sm">
                        <code>{result?.plantUMLCode}</code>
                      </pre>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleCopyCode}
                      className="mt-2"
                    >
                      Copy Code
                    </Button>
                  </DialogContent>
                </Dialog>
              )}
              <DownloadOptions 
                onDownload={handleDownload}
                disabled={!result}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 relative">
            <BlueprintGrid />
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
                <>
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    transition={{ 
                      duration: 0.5,
                      ease: 'easeOut'
                    }}
                    className="h-full w-full flex items-center justify-center p-4 z-10"
                  >
                    <TransformWrapper
                      initialScale={1}
                      minScale={0.5}
                      maxScale={4}
                      centerOnInit
                      wheel={{ step: 0.1 }}
                    >
                      {(utils) => (
                        <div className="relative w-full h-full">
                          <TransformComponent
                            wrapperClass="!w-full !h-full"
                            contentClass="!w-full !h-full flex items-center justify-center"
                          >
                            <motion.img 
                              src={result.pngUrl} 
                              alt="Generated UML Diagram" 
                              className="max-w-full max-h-full object-contain rounded-lg shadow-lg bg-white p-4"
                              style={{ 
                                maxHeight: 'calc(100vh - 12rem)',
                                width: 'auto'
                              }}
                              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                              transition={{ 
                                delay: 0.2,
                                duration: 0.4,
                                ease: 'easeOut'
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                setError('Failed to load diagram. Please check the PlantUML syntax.');
                              }}
                            />
                          </TransformComponent>
                          <ZoomControls {...utils} />
                        </div>
                      )}
                    </TransformWrapper>
                  </motion.div>
                  <DiagramLegend type={diagramType} />
                </>
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
            <ModelSelector 
              currentModel={currentModelInfo.id}
              onModelChange={handleModelChange}
              isGenerating={loading}
            />
          </CardContent>
        </Card>
    </div>
    </main>
  );
}
