// components/DefiRecommendations.tsx
import { useState } from 'react';
import { Recommendation } from '../types/defi';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';
import { getDefiInsights } from '../services/geminiService';

interface DefiRecommendationsProps {
  aptBalance: number;
  onSelectRecommendation: (recommendation: Recommendation) => void;
}

export default function DefiRecommendations({ 
  aptBalance, 
  onSelectRecommendation 
}: DefiRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  
  const getRecommendations = async () => {
    setLoading(true);
    try {
      const recommendations = await getDefiInsights(aptBalance);
      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getRiskColor = (risk: number) => {
    if (risk < 0.3) return 'bg-green-100 text-green-800';
    if (risk < 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const getReturnColor = (returnValue: number) => {
    if (returnValue < 0.03) return 'text-slate-600';
    if (returnValue < 0.07) return 'text-blue-600';
    return 'text-purple-600';
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">AI DeFi Recommendations</h2>
        <Button 
          onClick={getRecommendations} 
          disabled={loading || aptBalance <= 0}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Get Recommendations'
          )}
        </Button>
      </div>
      
      {recommendations.length === 0 && !loading ? (
        <p className="text-muted-foreground">
          Click the button above to get AI-powered DeFi recommendations based on your APT balance.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {recommendations.map((rec) => (
            <Card key={rec.protocol} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{rec.protocol}</CardTitle>
                  {/*  */}
                  <div className={getRiskColor(rec.riskLevel)}>
                    Risk: {(rec.riskLevel * 100).toFixed(0)}%
                  </div>
                  {/*  */}
                </div>
                <CardDescription>{rec.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Return:</span>
                    <span className={`font-medium ${getReturnColor(rec.expectedReturn)}`}>
                      {(rec.expectedReturn * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Benefit:</span>
                    <span className={`font-medium ${getReturnColor(rec.netBenefit)}`}>
                      {(rec.netBenefit * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => onSelectRecommendation(rec)}
                >
                  Use This Strategy
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}