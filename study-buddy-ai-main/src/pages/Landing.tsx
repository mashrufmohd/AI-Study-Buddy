import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, Layers, FileText, Zap, ArrowRight } from 'lucide-react';
import { mockAuthService, type MockUser } from '@/lib/mockAuth';

export function Landing() {
  const navigate = useNavigate();
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    // Check current user on mount
    const currentUser = mockAuthService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      navigate('/');
    }
  }, [navigate]);

  const features = [
    {
      icon: BookOpen,
      title: 'Smart Explanations',
      description: 'Get detailed explanations tailored to your learning level',
    },
    {
      icon: Brain,
      title: 'Quiz Generator',
      description: 'Test your knowledge with AI-generated quizzes',
    },
    {
      icon: Layers,
      title: 'Flashcards',
      description: 'Create and study interactive flashcards',
    },
    {
      icon: FileText,
      title: 'Content Summarization',
      description: 'Summarize any topic into digestible content',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
              AI
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Study Buddy
            </span>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="border-gray-300"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your AI-Powered Study Companion
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Transform your learning with intelligent explanations, quizzes, flashcards, and summaries powered by advanced AI technology.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
          >
            Start Learning Today <ArrowRight className="w-4 h-4" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate('/login')}
            className="border-2 border-gray-300"
          >
            Already have an account?
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Learning Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border border-gray-200 bg-white/50 backdrop-blur">
            <CardHeader>
              <Zap className="w-8 h-8 text-yellow-500 mb-2" />
              <CardTitle>Fast & Efficient</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get instant answers and summaries for any topic without wasting time searching.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white/50 backdrop-blur">
            <CardHeader>
              <Brain className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle>Personalized Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Choose your difficulty level and get content tailored to your learning style.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white/50 backdrop-blur">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-purple-500 mb-2" />
              <CardTitle>Comprehensive Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Master any subject with explanations, quizzes, and flashcards all in one place.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl mb-4">
              Ready to Elevate Your Learning?
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Join thousands of students using AI Study Buddy to achieve their educational goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 gap-2"
              onClick={() => navigate('/signup')}
            >
              Create Your Account Now <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur mt-20">
        <div className="container mx-auto px-4 py-12 text-center text-gray-600">
          <p>© 2026 AI Study Buddy. All rights reserved.</p>
          <p className="text-sm mt-2">Empowering learners with artificial intelligence</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
