import { Button } from "@/components/ui/button";
import { Cpu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ModelInfo = {
  id: string;
  name: string;
  description: string;
  temperature: number;
  maxTokens: number;
  alias: string;
};

export const ModelSelector = ({ 
  currentModel, 
  onModelChange,
  isGenerating
}: { 
  currentModel: ModelInfo;
  onModelChange: (model: ModelInfo) => void;
  isGenerating: boolean;
}) => {
  const models: ModelInfo[] = [
    // ... models array remains same
  ];

  return (
    <div className="z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/90 shadow-sm hover:bg-white hover:shadow-md transition-all relative"
            disabled={isGenerating}
          >
            <Cpu className="h-5 w-5 text-gray-700" />
            {isGenerating && (
              <span className="absolute -top-1 -right-1 h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 bg-white/95 backdrop-blur-sm border-gray-200">
          <DropdownMenuLabel className="text-gray-500">Select AI Model</DropdownMenuLabel>
          {models.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onModelChange(model)}
              className={`flex flex-col items-start gap-1 p-4 hover:bg-gray-50 cursor-pointer
                ${currentModel.id === model.id ? 'bg-blue-50/50' : ''}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-gray-900">{model.name}</span>
                {currentModel.id === model.id && (
                  <span className="text-blue-500 text-sm">Active</span>
                )}
              </div>
              <span className="text-sm text-gray-500">{model.description}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}; 