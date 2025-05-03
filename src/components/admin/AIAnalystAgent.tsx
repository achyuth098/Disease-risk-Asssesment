
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bot, MessagesSquare } from "lucide-react";
import { useStore } from "@/lib/store";
import { AIQuery, Disease } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AIAnalystAgent = () => {
  const [query, setQuery] = useState("");
  const [queryHistory, setQueryHistory] = useState<AIQuery[]>([]);
  const { assessments, getAnalyticsSummary } = useStore();

  const analyzeQuery = (question: string) => {
    const analytics = getAnalyticsSummary();
    let response = "";

    // Basic pattern matching for demo purposes
    if (question.toLowerCase().includes("high risk")) {
      const highRiskCount = analytics.assessmentsByRiskLevel.high || 0;
      response = `There are ${highRiskCount} patients classified as high risk across all diseases.`;
    } 
    else if (question.toLowerCase().includes("diabetes")) {
      const diabetesCount = analytics.assessmentsByDisease.diabetes || 0;
      response = `There are ${diabetesCount} diabetes risk assessments recorded.`;
    }
    else if (question.toLowerCase().includes("region")) {
      const regions = Object.entries(analytics.assessmentsByRegion)
        .map(([region, count]) => `${region}: ${count} assessments`)
        .join(", ");
      response = `Regional distribution of assessments: ${regions}`;
    }
    else {
      response = `I understand you're asking about "${question}". Currently, I can help you analyze the assessment data, risk levels, disease types, and regional distribution.`;
    }

    return response;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const response = analyzeQuery(query);
    const newQuery: AIQuery = {
      question: query,
      timestamp: new Date().toISOString(),
      response
    };

    setQueryHistory(prev => [...prev, newQuery]);
    setQuery("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-20 right-4 h-12 w-12 rounded-full">
          <Bot className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Analyst
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 mt-4">
              {queryHistory.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MessagesSquare className="h-4 w-4 mt-1" />
                    <p className="text-sm">{item.question}</p>
                  </div>
                  {item.response && (
                    <div className="flex items-start gap-2 ml-6">
                      <Bot className="h-4 w-4 mt-1" />
                      <p className="text-sm text-muted-foreground">{item.response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSubmit} className="border-t pt-4 mt-4">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about your dashboard data..."
                className="flex-1"
              />
              <Button type="submit">Ask</Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
