/** Rich sections for algorithm topic detail screens (e.g. Two Pointers). */
export interface LearnDetailSection {
  title: string;
  body: string;
  /** Optional snippet shown in a themed syntax-highlighted block (web) */
  code?: string;
  /** Passed to the highlighter, default `python` */
  codeLanguage?: string;
}
