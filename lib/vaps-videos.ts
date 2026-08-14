export type RecommendedVideo = {
  id: string;
  title: string;
  youtubeId?: string;
};

export const recommendedVideos: RecommendedVideo[] = [
  { id: "intro", title: "おすすめ動画 1" },
  { id: "type", title: "おすすめ動画 2" },
  { id: "axis", title: "おすすめ動画 3" },
];
