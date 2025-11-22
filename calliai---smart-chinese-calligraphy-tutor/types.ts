export type Point = {
  x: number;
  y: number;
  pressure?: number;
};

export type Stroke = Point[];

export type AppState = 'idle' | 'analyzing' | 'result' | 'error';

export type ErrorType = 'ORDER' | 'DIRECTION' | 'CONNECTION' | 'SHAPE' | 'NONE';

export type Language = 'en' | 'zh' | 'th';

export interface StrokeAnalysis {
  strokeIndex: number;
  isCorrect: boolean;
  errorType: ErrorType;
  explanation: string;
  correction: string;
}

export interface AnalysisResponse {
  score: number;
  critique: string;
  strokeAnalysis: StrokeAnalysis[];
  positiveFeedback: string;
}