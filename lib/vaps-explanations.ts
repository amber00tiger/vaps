export type GroupExplanation = {
  description: string[];
};

export type TypeExplanation = {
  intro?: string;
  description: string[];
  strengths: string[];
  skills: string[];
  weaknesses: string[];
  challenges: string[];
  jobs: string[];
  roles: string[];
  compatibility: {
    good: string[];
    bad: string[];
  };
};

export const groupExplanations: Record<string, GroupExplanation> = {
  SO: {
    description: [
      "統率者グループは、自分の目的を達成することを軸に生きながら、自分の意見や行動に賛同して共に進む人々を仲間として認識し、その関係を維持しようとする傾向があります。",
      "仲間が安心して存在できる環境を整えるため、ルールや方針を示し、全体の状態を調整しながら、人がその中でどのように動くかを観察することを好みます。",
      "その環境に影響を与えそうな違和感や変化に敏感で、問題が表面化する前の段階で対処しようとすることもあります。",
      "自分の目指す状態に向けて方向性を示しながら進む姿勢は、周囲にとって指針として認識されることもあるでしょう。",
    ],
  },
};

export const typeExplanations: Record<string, TypeExplanation> = {
  HSO: {
    intro:
      "ひらめきと観察から物事の本質をつかみ、自分の見立てを目標や方針として示していくタイプです。",
    description: [
      "教祖タイプは、統率者グループの中でもひらめきに長け、まるで相手を見透かしたように提案し、導くことを好みます。",
      "これは超能力ではなく、見るものすべてにタグを付け、瞬時にそのタグを割り振ることに特化しているのです。",
      "正しい自分であるために、彼らは多くの情報を求め、人や物をよく観察し、自ら本質にたどり着きます。",
      "そして、たどり着いた本質が正しかったと証明するため、自分を表現できる目標を定め、その目標を達成することで自分の判断の一貫性を示そうとします。",
      "自分の理論と矛盾しない形で生き続けることそのものが、自分が正しかったことを証明する行為になるのです。",
    ],
    strengths: ["サンプル：本質を見抜く視点を持ちやすい"],
    skills: ["サンプル：方向性を言語化し、人を導くこと"],
    weaknesses: ["サンプル：自分の理論と違う動きに強く反応しやすい"],
    challenges: ["サンプル：相手の自律性を待つこと"],
    jobs: ["サンプル：企画、研究、マネジメント、発信活動"],
    roles: ["サンプル：方針を示す人、思想をまとめる人"],
    compatibility: {
      good: ["サンプル：方針を共有し、補佐できるタイプ"],
      bad: ["サンプル：目的や前提を共有しないまま動くタイプ"],
    },
  },
};
