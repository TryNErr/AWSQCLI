import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Send, AutoFixHigh, Assessment } from '@mui/icons-material';

const WritingCritique: React.FC = () => {
  const [essay, setEssay] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeEssay = async () => {
    if (!essay.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnalysis({
        overallScore: 85,
        strengths: [
          'Clear thesis statement',
          'Good use of examples',
          'Logical flow of ideas'
        ],
        improvements: [
          'Consider varying sentence structure',
          'Add more transitional phrases',
          'Strengthen the conclusion'
        ],
        grammar: {
          score: 90,
          issues: [
            { line: 3, issue: 'Consider using a comma before "and"' },
            { line: 7, issue: 'Fragment sentence detected' }
          ]
        },
        vocabulary: {
          score: 80,
          suggestions: [
            { word: 'good', alternatives: ['excellent', 'outstanding', 'remarkable'] },
            { word: 'big', alternatives: ['significant', 'substantial', 'considerable'] }
          ]
        }
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Writing Critique
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Submit your essay for AI-powered analysis and feedback
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Essay Input */}
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Essay
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={20}
                  placeholder="Paste your essay here for analysis..."
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  variant="outlined"
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {essay.length} characters, ~{Math.ceil(essay.split(' ').length)} words
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={analyzeEssay}
                    disabled={!essay.trim() || loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Essay'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Analysis Results */}
          <Box sx={{ flex: 1 }}>
            {analysis ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Overall Score */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Assessment color="primary" />
                      <Box>
                        <Typography variant="h6">
                          Overall Score
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {analysis.overallScore}/100
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="success.main">
                      Strengths
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {analysis.strengths.map((strength: string, index: number) => (
                        <Chip 
                          key={index}
                          label={strength}
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Areas for Improvement */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="warning.main">
                      Areas for Improvement
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {analysis.improvements.map((improvement: string, index: number) => (
                        <Alert key={index} severity="info" sx={{ py: 0 }}>
                          {improvement}
                        </Alert>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Grammar Analysis */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Grammar Analysis
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Grammar Score: {analysis.grammar.score}/100
                      </Typography>
                    </Box>
                    {analysis.grammar.issues.map((issue: any, index: number) => (
                      <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                        Line {issue.line}: {issue.issue}
                      </Alert>
                    ))}
                  </CardContent>
                </Card>

                {/* Vocabulary Suggestions */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Vocabulary Enhancement
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Vocabulary Score: {analysis.vocabulary.score}/100
                      </Typography>
                    </Box>
                    {analysis.vocabulary.suggestions.map((suggestion: any, index: number) => (
                      <Paper key={index} sx={{ p: 2, mb: 1 }}>
                        <Typography variant="body2">
                          Instead of "<strong>{suggestion.word}</strong>", consider:
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {suggestion.alternatives.map((alt: string, altIndex: number) => (
                            <Chip 
                              key={altIndex}
                              label={alt}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    ))}
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <AutoFixHigh sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Submit your essay to get detailed feedback
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our AI will analyze grammar, vocabulary, structure, and more
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default WritingCritique;
