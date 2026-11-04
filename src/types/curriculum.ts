export interface VocabItem { id: string; es: string; en: string; category?: string; notes?: string; }
export interface GrammarSection { id: string; title: string; content: string; }
export interface Activity {
  id: string; key: string; instructionsEs: string; instructionsEn: string;
  rawText: string; answers: Record<string, string>; rawAnswerKey: string;
}
export interface CulturalReading { instructions: string; text: string; answers: Record<string, string>; rawAnswerKey: string; }
export type Cefr = 'A1' | 'A1+' | 'A2' | 'A2+' | 'B1' | 'B1+';
export interface LessonMeta {
  id: string; book: 1 | 2; lessonNumber: number; globalIndex: number; title: string; cefrLevel: Cefr;
  neighborhoodFocus: string[]; grammarTitles: string[]; vocabCount: number; questionCount: number;
}
export interface LessonData extends Omit<LessonMeta, 'grammarTitles' | 'vocabCount' | 'questionCount'> {
  vocabulary: VocabItem[]; grammar: GrammarSection[]; activities: Activity[];
  culturalReading: CulturalReading | null; speaking?: string;
}
export interface GlossEntry { es: string; en: string; category?: string; notes?: string; book?: number; }
export interface Glossary { es: GlossEntry[]; topic: GlossEntry[]; cognates: GlossEntry[]; grammar: string[]; }
