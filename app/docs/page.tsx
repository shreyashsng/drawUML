import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function DocsPage() {
  return (
    <main className="min-h-screen pt-24 bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Documentation</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">Getting Started</h2>
            <p className="text-gray-600 mb-4">
              DrawUML helps you create UML diagrams using natural language. Simply describe what you want, and our AI will generate the diagram for you.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">How it Works</h3>
            <ol className="list-decimal pl-4 space-y-2 text-gray-600">
              <li>Start by clicking the "Create" button in the navigation bar</li>
              <li>Choose your desired diagram type (Class, Sequence, Use Case, etc.)</li>
              <li>Describe your diagram requirements in natural language</li>
              <li>Select your preferred AI model for generation</li>
              <li>Click "Generate" and watch your diagram come to life</li>
            </ol>

            <h3 className="text-xl font-semibold mt-6 mb-3">Supported Diagram Types</h3>
            <ul className="list-disc pl-4 space-y-2 text-gray-600">
              <li>Class Diagrams</li>
              <li>Sequence Diagrams</li>
              <li>Use Case Diagrams</li>
              <li>Activity Diagrams</li>
              <li>Component Diagrams</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">AI Models</h3>
            <p className="text-gray-600 mb-4">
              We support multiple AI models to ensure the best possible diagram generation:
            </p>
            <ul className="list-disc pl-4 space-y-2 text-gray-600">
              <li><strong>DeepSeek R1:</strong> Optimized for code and technical tasks</li>
              <li><strong>Gemini Flash Lite:</strong> Fast responses with balanced performance</li>
              <li><strong>Llama Nemotron:</strong> High accuracy with large context window</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
} 