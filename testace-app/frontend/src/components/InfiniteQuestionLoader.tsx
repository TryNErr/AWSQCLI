import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import { Question } from '../types';
import { apiService } from '../services/api';

interface InfiniteQuestionLoaderProps {
  sessionId: string;
  onQuestionsLoaded: (questions: Question[]) => void;
  onError: (error: string) => void;
  batchSize?: number;
}

export const InfiniteQuestionLoader: React.FC<InfiniteQuestionLoaderProps> = ({
  sessionId,
  onQuestionsLoaded,
  onError,
  batchSize = 10
}) => {
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [generatedCount, setGeneratedCount] = useState(0);

  const loadMoreQuestions = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await apiService.get(`/sessions/${sessionId}/questions`, {
        params: { offset, limit: batchSize }
      });

      const { questions, hasMore: moreAvailable, generated } = response.data.data;
      
      if (questions.length > 0) {
        onQuestionsLoaded(questions);
        setOffset(prev => prev + questions.length);
        setGeneratedCount(prev => prev + (generated || 0));
      }
      
      setHasMore(moreAvailable && questions.length === batchSize);
    } catch (error: any) {
      console.error('Error loading questions:', error);
      onError(error.response?.data?.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [sessionId, offset, batchSize, loading, hasMore, onQuestionsLoaded, onError]);

  // Auto-load initial questions
  useEffect(() => {
    if (offset === 0) {
      loadMoreQuestions();
    }
  }, []);

  const requestMoreQuestions = async () => {
    setLoading(true);
    try {
      const response = await apiService.post(`/sessions/${sessionId}/more-questions`, {
        count: batchSize
      });

      const { questions, totalQuestions } = response.data.data;
      onQuestionsLoaded(questions);
      setGeneratedCount(prev => prev + questions.length);
      
      // Update offset to reflect new total
      setOffset(totalQuestions);
    } catch (error: any) {
      console.error('Error generating more questions:', error);
      onError(error.response?.data?.message || 'Failed to generate more questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      {generatedCount > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          🎯 {generatedCount} questions generated on-the-fly to keep you practicing!
        </Alert>
      )}
      
      {hasMore ? (
        <Button
          variant="contained"
          onClick={loadMoreQuestions}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ mr: 2 }}
        >
          {loading ? 'Loading...' : 'Load More Questions'}
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={requestMoreQuestions}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Generating...' : 'Generate More Questions'}
        </Button>
      )}
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Questions loaded: {offset} | Generated: {generatedCount}
      </Typography>
    </Box>
  );
};

export default InfiniteQuestionLoader;
