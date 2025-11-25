export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  greeting: string;
}

export enum CourseLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Business = 'Business'
}

export interface Course {
  id: string;
  title: string;
  language: string;
  description: string;
  image: string;
  level: CourseLevel;
  duration: string;
}