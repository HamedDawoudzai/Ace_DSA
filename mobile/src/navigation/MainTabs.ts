import type { LearnTrack } from "../data/learnTopics";

export type MainStackParamList = {
  Learn: undefined;
  LearnDetail: {
    id: string;
    track: LearnTrack;
  };
};
