import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Layout, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">PDF Builder</span>
        </div>
        <Link
          to="/editor"
          className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          Open Editor
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Create professional PDFs <br />
          <span className="text-blue-600">in seconds.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          The simplest way to build, preview, and export high-quality PDF documents. No complex software, just clean results.
        </p>
        <Link
          to="/editor"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105"
        >
          Start Building Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Everything you need</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
                <Zap className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Preview</h3>
              <p className="text-gray-600">See your changes instantly as you type. Our real-time PDF engine ensures what you see is what you get.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="bg-green-100 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
                <Layout className="text-green-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Modern Editor</h3>
              <p className="text-gray-600">A clean, distraction-free environment designed for productivity and ease of use on any device.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="bg-purple-100 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
                <FileText className="text-purple-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Export</h3>
              <p className="text-gray-600">One-click PDF generation. High-quality vector output ready for printing or digital distribution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-blue-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to create your first document?</h2>
          <p className="text-blue-100 mb-10 text-lg">Join thousands of users creating professional documents with PDF Builder.</p>
          <Link
            to="/editor"
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Go to Editor
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600 w-5 h-5" />
            <span className="font-bold">PDF Builder</span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 PDF Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
