/** Rich sections for algorithm topic detail screens (e.g. Two Pointers). */
export interface LearnDetailSection {
  title: string;
  body: string;
  /** Optional Python 3 (or other) snippet shown in a monospace block */
  code?: string;
}
