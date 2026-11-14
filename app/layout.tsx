import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Startup Advisor Crew | Powered by Gemini 3.5 Flash',
  description: 'Multi-agent AI crew that evaluates student startup ideas, researches verified competitors, designs business models, and generates structured startup planning reports.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
