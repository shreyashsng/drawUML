import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Footer } from "@/components/footer";
import { SparklesCore } from "@/components/ui/sparkles";

export default function Home() {
  return (
    <main className="min-h-screen pt-24 bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9] relative overflow-hidden">
      <Navbar />
      {/* Hero Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 grid grid-cols-6 gap-2 p-8">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-gray-200/50" />
          ))}
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <AnimatedShinyText>
                Powered by Google Gemini, Deepseek R1, and many more
              </AnimatedShinyText>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Generate UML Diagrams with AI
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Transform your ideas into professional UML diagrams using natural language. 
              Save time and effort with AI-powered diagram generation.
            </p>
            <div className="flex items-center justify-center gap-4 mb-16">
              <Link href="/create">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 text-lg hover:opacity-90">
                  Start Creating
                </Button>
              </Link>
              <a 
                href="#examples" 
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                View Examples
              </a>
            </div>
          </div>

          {/* Preview Section */}
          <div className="max-w-6xl mx-auto mb-24">
            <div className="relative p-[10px] rounded-2xl bg-gradient-to-b from-gray-200 via-gray-100 to-white">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/20 to-indigo-500/20 blur-xl" />
              <div className="relative bg-white rounded-2xl p-3 backdrop-blur-3xl">
                <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl overflow-hidden">
                  <img 
                    src="/preview.png" 
                    alt="DrawUML Dashboard Preview" 
                    className="w-full h-auto object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights with modern design */}
          <div className="max-w-6xl mx-auto px-4 mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Features
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: "Multiple Diagram Types",
                  description: "Generate Class, Sequence, Use Case, Activity, and Component diagrams.",
                  gradient: "from-blue-500/10 to-blue-600/10"
                },
                {
                  title: "AI-Powered Generation",
                  description: "Leverage multiple AI models for accurate and efficient diagram creation.",
                  gradient: "from-indigo-500/10 to-indigo-600/10"
                },
                {
                  title: "Export Options",
                  description: "Download your diagrams in SVG, PNG, or DrawUML format.",
                  gradient: "from-purple-500/10 to-purple-600/10"
                }
              ].map((feature, i) => (
                <div key={i} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl transition-opacity group-hover:opacity-100 opacity-0`} />
                  <div className="relative bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {feature.title}
                      </h3>
                      <span className="text-2xl text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to Use Section with modern design */}
          <div className="max-w-6xl mx-auto px-4 mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                How It Works
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: "01",
                  title: "Describe Your Diagram",
                  description: "Write your requirements in natural language. No need for complex syntax.",
                  gradient: "from-amber-500/10 to-orange-600/10"
                },
                {
                  step: "02",
                  title: "AI Magic",
                  description: "Choose your preferred AI model. Our AI will analyze and generate your diagram.",
                  gradient: "from-emerald-500/10 to-teal-600/10"
                },
                {
                  step: "03",
                  title: "Download & Use",
                  description: "Download your diagram in multiple formats and start using it right away.",
                  gradient: "from-blue-500/10 to-indigo-600/10"
                }
              ].map((step, i) => (
                <div key={i} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-3xl blur-xl transition-opacity group-hover:opacity-100 opacity-0`} />
                  <div className="relative bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-900 text-white mb-6">
                      Step {step.step}
                    </span>
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add this before the Footer */}
      <div className="relative w-full">
        <SparklesCore />
      </div>
      
      <Footer />
    </main>
  );
}
