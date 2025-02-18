import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Terms</h2>
              <p className="text-gray-600">
                By accessing DrawUML, you agree to be bound by these terms of service and comply with all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="text-gray-600">
                DrawUML grants you a personal, non-exclusive, non-transferable license to use the service for creating UML diagrams.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
              <p className="text-gray-600">
                The diagrams generated through our service are provided "as is". We make no warranties about the accuracy or reliability of the generated content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
              <p className="text-gray-600">
                We shall not be held liable for any damages arising from the use of our service.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
} 