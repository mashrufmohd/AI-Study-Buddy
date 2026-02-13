import { GraduationCap, Heart, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 mt-auto">
      {/* Main Footer Content */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                AI
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Study Buddy
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered learning companion helping students study smarter, not harder.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors" title="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors" title="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors" title="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/explain" className="hover:text-primary transition-colors">Explain Topics</Link></li>
              <li><Link to="/summarize" className="hover:text-primary transition-colors">Summarize Notes</Link></li>
              <li><Link to="/quiz" className="hover:text-primary transition-colors">Generate Quizzes</Link></li>
              <li><Link to="/flashcards" className="hover:text-primary transition-colors">Create Flashcards</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subtle Background Pattern */}
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <div className="w-96 h-96 bg-gradient-to-br from-primary to-purple-600 rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
}
