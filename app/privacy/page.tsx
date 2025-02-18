import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information Collection</h2>
              <p className="text-gray-600">
                We collect only the information necessary to provide our UML diagram generation service. This includes:
              </p>
              <ul className="list-disc pl-4 space-y-2 text-gray-600 mt-2">
                <li>Your diagram descriptions and preferences</li>
                <li>Basic usage analytics to improve our service</li>
                <li>Technical information required for service functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
              <p className="text-gray-600">
                Your data is used solely for:
              </p>
              <ul className="list-disc pl-4 space-y-2 text-gray-600 mt-2">
                <li>Generating UML diagrams</li>
                <li>Improving our AI models and service</li>
                <li>Ensuring service reliability and performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your information. Your diagram data is processed securely and is not shared with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-gray-600">
                For any privacy-related questions, please contact us at hi@shreyash.social
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
} 