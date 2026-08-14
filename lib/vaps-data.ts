export type Axis =
  | "R"
  | "H"
  | "E"
  | "A"
  | "C"
  | "P"
  | "S"
  | "F"
  | "M"
  | "G"
  | "L"
  | "O";

export type Aspect =
  | "thought_origin"
  | "thought_structure"
  | "judgement_origin"
  | "judgement_principle"
  | "action_operation"
  | "action_orientation";

export type SimplePage = "simple_thought" | "simple_judgement" | "simple_action";

export type DetailCategory =
  | "thought_origin"
  | "thought_structure"
  | "thought_bonus"
  | "judgement_origin"
  | "judgement_principle"
  | "judgement_bonus"
  | "action_operation"
  | "action_orientation"
  | "action_bonus";

export type SimpleQuestion = {
  id: string;
  text: string;
  page: SimplePage;
  type: "axis_choice" | "aspect_choice";
  choices: Array<{
    label: string;
    axis?: Axis;
    aspect?: Aspect;
    axes?: Axis[];
  }>;
};

export type DetailQuestion = {
  id: string;
  text: string;
  type: "normal" | "bonus";
  axis?: Axis;
  reverse_axis?: Axis;
  aspect?: Aspect;
  reverse_aspect?: Aspect;
  category: DetailCategory;
};

export type DiagnosisQuestion =
  | ({ kind: "simple" } & SimpleQuestion)
  | ({ kind: "detail" } & DetailQuestion);

export const axisPairs: Record<Aspect, Axis[]> = {
  thought_origin: ["R", "H"],
  thought_structure: ["E", "A"],
  judgement_origin: ["C", "P"],
  judgement_principle: ["S", "F"],
  action_operation: ["M", "G"],
  action_orientation: ["L", "O"],
};

export const reverseAspect: Record<Aspect, Aspect> = {
  thought_origin: "thought_structure",
  thought_structure: "thought_origin",
  judgement_origin: "judgement_principle",
  judgement_principle: "judgement_origin",
  action_operation: "action_orientation",
  action_orientation: "action_operation",
};

export const sectionLabels: Record<SimplePage | DetailCategory, string> = {
  simple_thought: "簡易診断 思考",
  simple_judgement: "簡易診断 判断",
  simple_action: "簡易診断 行動",
  thought_origin: "詳細診断 思考起点",
  thought_structure: "詳細診断 思考構造",
  thought_bonus: "詳細診断 思考判別",
  judgement_origin: "詳細診断 判断起点",
  judgement_principle: "詳細診断 判断原理",
  judgement_bonus: "詳細診断 判断判別",
  action_operation: "詳細診断 行動運用",
  action_orientation: "詳細診断 行動志向",
  action_bonus: "詳細診断 行動判別",
};

export const sectionColors: Record<string, string> = {
  simple_thought: "var(--thought)",
  simple_judgement: "var(--judgement)",
  simple_action: "var(--action)",
  thought_origin: "var(--thought)",
  thought_structure: "var(--thought)",
  thought_bonus: "var(--thought)",
  judgement_origin: "var(--judgement)",
  judgement_principle: "var(--judgement)",
  judgement_bonus: "var(--judgement)",
  action_operation: "var(--action)",
  action_orientation: "var(--action)",
  action_bonus: "var(--action)",
};

export const simpleQuestions: SimpleQuestion[] = [
  {
    id: "SQ1",
    text: "思考はどこから始まる？",
    page: "simple_thought",
    type: "axis_choice",
    choices: [
      { label: "仮定/パターン/予測/全体像", axis: "H" },
      { label: "事実/差異/具体/精度", axis: "R" },
    ],
  },
  {
    id: "SQ2",
    text: "思考の進め方は？",
    page: "simple_thought",
    type: "axis_choice",
    choices: [
      { label: "広げていく", axis: "E" },
      { label: "まとめていく", axis: "A" },
    ],
  },
  {
    id: "SQ3",
    text: "どちらを大切にしたい？",
    page: "simple_thought",
    type: "aspect_choice",
    choices: [
      { label: "思考を始めること", aspect: "thought_origin", axes: ["R", "H"] },
      { label: "思考を進めること", aspect: "thought_structure", axes: ["E", "A"] },
    ],
  },
  {
    id: "SQ4",
    text: "正しさの基準はどっち？",
    page: "simple_judgement",
    type: "axis_choice",
    choices: [
      { label: "整合/論理/効率/条件", axis: "C" },
      { label: "優先/感情/配慮/事情", axis: "P" },
    ],
  },
  {
    id: "SQ5",
    text: "判断の姿勢は？",
    page: "simple_judgement",
    type: "axis_choice",
    choices: [
      { label: "一貫性をもつ", axis: "S" },
      { label: "柔軟性をもつ", axis: "F" },
    ],
  },
  {
    id: "SQ6",
    text: "どちらを大切にしたい？",
    page: "simple_judgement",
    type: "aspect_choice",
    choices: [
      { label: "判断の正しさ", aspect: "judgement_origin", axes: ["C", "P"] },
      { label: "判断の姿勢", aspect: "judgement_principle", axes: ["S", "F"] },
    ],
  },
  {
    id: "SQ7",
    text: "日々の過ごし方は？",
    page: "simple_action",
    type: "axis_choice",
    choices: [
      { label: "状況に合わせて決める", axis: "M" },
      { label: "計画を立てて動く", axis: "G" },
    ],
  },
  {
    id: "SQ8",
    text: "今後の生活をどうしていきたい？",
    page: "simple_action",
    type: "axis_choice",
    choices: [
      { label: "その時の気分で行動したい", axis: "L" },
      { label: "自分にルールを課したい", axis: "O" },
    ],
  },
  {
    id: "SQ9",
    text: "どちらを大切にしたい？",
    page: "simple_action",
    type: "aspect_choice",
    choices: [
      { label: "日々をどう過ごすか", aspect: "action_operation", axes: ["M", "G"] },
      { label: "将来どうなるか", aspect: "action_orientation", axes: ["L", "O"] },
    ],
  },
];

export const detailQuestions: DetailQuestion[] = [
  { id: "Q1", text: "何かについて考え始めるとき、実際に見たり聞いたりした情報がないと、考えが動きにくい。", type: "normal", axis: "R", reverse_axis: "H", category: "thought_origin" },
  { id: "Q2", text: "情報が少ない状態でも、自分で仮定を置いて十分に考えを進められる。", type: "normal", axis: "H", reverse_axis: "R", category: "thought_origin" },
  { id: "Q3", text: "目の前で起きていることが、思考を強く引き付ける。", type: "normal", axis: "R", reverse_axis: "H", category: "thought_origin" },
  { id: "Q4", text: "物事や人は、事実を確認する前に内部でモデルにあてはめる。", type: "normal", axis: "H", reverse_axis: "R", category: "thought_origin" },
  { id: "Q5", text: "経験や具体例がない話だけで、長時間思考を続けられる。", type: "normal", axis: "H", reverse_axis: "R", category: "thought_origin" },
  { id: "Q6", text: "結論が出ていない状態でも、複数の可能性を残して考え続けたい。", type: "normal", axis: "E", reverse_axis: "A", category: "thought_structure" },
  { id: "Q7", text: "考えがまとまったら、多少粗くても一度“結論”として確定させたい。", type: "normal", axis: "A", reverse_axis: "E", category: "thought_structure" },
  { id: "Q8", text: "ひとつの話題から、別の視点や別の案が次々に浮かぶほうだ。", type: "normal", axis: "E", reverse_axis: "A", category: "thought_structure" },
  { id: "Q9", text: "いくつか案が出たら、「判断基準」を決めて取捨選択し、1つに絞りたくなる。", type: "normal", axis: "A", reverse_axis: "E", category: "thought_structure" },
  { id: "Q10", text: "「まだ決めなくていい」と言われると、むしろ楽になる。", type: "normal", axis: "E", reverse_axis: "A", category: "thought_structure" },
  { id: "Q11", text: "企画を評価するとき、内容の詳細よりも「最初の着想」が光っているかを重視する。", type: "bonus", aspect: "thought_origin", reverse_aspect: "thought_structure", category: "thought_bonus" },
  { id: "Q12", text: "内容が良くても、説明の仕方が整っていなければ説得力は出ないと思う。", type: "bonus", aspect: "thought_structure", reverse_aspect: "thought_origin", category: "thought_bonus" },
  { id: "Q13", text: "アイデアが弱いとき、整理し直すよりも、別の発想に変えるほうが早いと思う。", type: "bonus", aspect: "thought_origin", reverse_aspect: "thought_structure", category: "thought_bonus" },
  { id: "Q14", text: "事情があっても、筋が通っていなければ正しいとは言えないと思う。", type: "normal", axis: "C", reverse_axis: "P", category: "judgement_origin" },
  { id: "Q15", text: "何かを決めるとき、関わっている人の気持ちや事情を優先するべきだ。", type: "normal", axis: "P", reverse_axis: "C", category: "judgement_origin" },
  { id: "Q16", text: "結論が合理的なら、不満があっても仕方のないことだ。", type: "normal", axis: "C", reverse_axis: "P", category: "judgement_origin" },
  { id: "Q17", text: "問題が起きたとき、ケアよりも原因を明らかにしたい。", type: "normal", axis: "C", reverse_axis: "P", category: "judgement_origin" },
  { id: "Q18", text: "誰かを傷つけるなら正しさを選ぶべきではないと思う。", type: "normal", axis: "P", reverse_axis: "C", category: "judgement_origin" },
  { id: "Q19", text: "どんな場合においても、迷わず自分の見解を出せるほうだ。", type: "normal", axis: "S", reverse_axis: "F", category: "judgement_principle" },
  { id: "Q20", text: "その場に合わないと感じたら、自分の判断基準をその都度調整することがある。", type: "normal", axis: "F", reverse_axis: "S", category: "judgement_principle" },
  { id: "Q21", text: "正しいと思っていた基準でも、状況が変われば別の基準を使うことに抵抗はない。", type: "normal", axis: "F", reverse_axis: "S", category: "judgement_principle" },
  { id: "Q22", text: "「自分ならこうしたい」という意見は、どんな状況でも伝えたい。", type: "normal", axis: "S", reverse_axis: "F", category: "judgement_principle" },
  { id: "Q23", text: "自分の基準と完全には一致しなくても、場に合うならその判断を選べる。", type: "normal", axis: "F", reverse_axis: "S", category: "judgement_principle" },
  { id: "Q24", text: "あらゆる基準よりも、自分の選択の仕方を一貫したい。", type: "bonus", aspect: "judgement_principle", reverse_aspect: "judgement_origin", category: "judgement_bonus" },
  { id: "Q25", text: "判断が必要なとき、結論よりも議論や検証をすることが大事だと思う。", type: "bonus", aspect: "judgement_origin", reverse_aspect: "judgement_principle", category: "judgement_bonus" },
  { id: "Q26", text: "自分にとって、何が正しいかよりもどう判断するかのほうが重要だと思う。", type: "bonus", aspect: "judgement_principle", reverse_aspect: "judgement_origin", category: "judgement_bonus" },
  { id: "Q27", text: "旅行に行くときは、すべての行動を事前に決めておきたい。", type: "normal", axis: "G", reverse_axis: "M", category: "action_operation" },
  { id: "Q28", text: "毎日のルーティンをこなせないと、不安になる。", type: "normal", axis: "G", reverse_axis: "M", category: "action_operation" },
  { id: "Q29", text: "やることがいくつかあるとき、優先順位はその場で決める。", type: "normal", axis: "M", reverse_axis: "G", category: "action_operation" },
  { id: "Q30", text: "予定が変わったとき、流れを確認し直したい。", type: "normal", axis: "G", reverse_axis: "M", category: "action_operation" },
  { id: "Q31", text: "思いついたことは、準備が整う前にとりあえず始めてみる。", type: "normal", axis: "M", reverse_axis: "G", category: "action_operation" },
  { id: "Q32", text: "目指す将来像になるまでの手段や条件を言語化できる。", type: "normal", axis: "O", reverse_axis: "L", category: "action_orientation" },
  { id: "Q33", text: "あらかじめ方向が決まっているより、選択肢が残されている状態のほうが安心する。", type: "normal", axis: "L", reverse_axis: "O", category: "action_orientation" },
  { id: "Q34", text: "「この道で行く」と決めると、他の可能性を捨てる感じがして抵抗がある。", type: "normal", axis: "L", reverse_axis: "O", category: "action_orientation" },
  { id: "Q35", text: "将来像が途中で変わることに問題はないと思う。", type: "normal", axis: "L", reverse_axis: "O", category: "action_orientation" },
  { id: "Q36", text: "「こうするべき」と決めてしまうと、息苦しく感じることがある。", type: "normal", axis: "L", reverse_axis: "O", category: "action_orientation" },
  { id: "Q37", text: "理想よりも、今をどう生きるかのほうが重要だと思う。", type: "bonus", aspect: "action_operation", reverse_aspect: "action_orientation", category: "action_bonus" },
  { id: "Q38", text: "自分が消耗しても、未来のためと思えば頑張れる。", type: "bonus", aspect: "action_orientation", reverse_aspect: "action_operation", category: "action_bonus" },
  { id: "Q39", text: "理想の自分になるために行動をしたいと思う。", type: "bonus", aspect: "action_orientation", reverse_aspect: "action_operation", category: "action_bonus" },
];

export const diagnosisQuestions: DiagnosisQuestion[] = [
  ...simpleQuestions.map((question) => ({ ...question, kind: "simple" as const })),
  ...detailQuestions.map((question) => ({ ...question, kind: "detail" as const })),
];

export const scaleChoices = [
  { value: 1, label: "同意する" },
  { value: 2, label: "少し同意する" },
  { value: 3, label: "どちらでもない" },
  { value: 4, label: "あまり同意しない" },
  { value: 5, label: "同意しない" },
];

export const allAxes: Axis[] = ["R", "H", "E", "A", "C", "P", "S", "F", "M", "G", "L", "O"];

export const typeRows = [
  ["RSO", "SO", "統率者", "革命家", "同じ行動をともにしたい人を集めたい"],
  ["HSO", "SO", "統率者", "教祖", "同じ思想をともにしたい人を集めたい"],
  ["ESO", "SO", "統率者", "社長", "同じ場所でともに発展させたい人を集めたい"],
  ["ASO", "SO", "統率者", "政治家", "同じ場所でともに決定させたい人を集めたい"],
  ["RSL", "SL", "発起人", "実行役", "みんなが楽しむ場所を作りたい"],
  ["HSL", "SL", "発起人", "主宰者", "みんなが共感する場所を作りたい"],
  ["ESL", "SL", "発起人", "先導者", "みんなの場所を盛り上げたい"],
  ["ASL", "SL", "発起人", "指揮者", "みんなの場所をまとめたい"],
  ["RSG", "SG", "指導者", "警察官", "今起きていることを介入する"],
  ["HSG", "SG", "指導者", "医師", "未来を見越して介入する"],
  ["ESG", "SG", "指導者", "教師", "成長のために介入する"],
  ["ASG", "SG", "指導者", "司令官", "制御のために介入する"],
  ["RSM", "SM", "風来坊", "観光客", "新しい場所で様々な体験をしたい"],
  ["HSM", "SM", "風来坊", "探検家", "新しい場所で新しい発見をしたい"],
  ["ESM", "SM", "風来坊", "留学生", "新しい場所で人生を豊かにしたい"],
  ["ASM", "SM", "風来坊", "探索者", "新しい場所で自分を見つけたい"],
  ["RFO", "FO", "調律者", "オペレーター", "進行の滞りを解消したい"],
  ["HFO", "FO", "調律者", "プロデューサー", "進行の経路を設計したい"],
  ["EFO", "FO", "調律者", "アナライザー", "条件を組み替えながら進行したい"],
  ["AFO", "FO", "調律者", "ディレクター", "条件を定めながら進行したい"],
  ["RFL", "FL", "参画者", "合流者", "肌に合う場所に参加したい"],
  ["HFL", "FL", "参画者", "参入者", "新しい場所に参加したい"],
  ["EFL", "FL", "参画者", "演出家", "参加した場所で別の選択肢を提示したい"],
  ["AFL", "FL", "参画者", "主張者", "参加した場所で1つの選択肢を通したい"],
  ["RFG", "FG", "帰還者", "安住者", "落ち着く場所に帰りたい"],
  ["HFG", "FG", "帰還者", "滞在者", "楽しい場所に帰りたい"],
  ["EFG", "FG", "帰還者", "遍歴者", "帰る場所を気分で決めたい"],
  ["AFG", "FG", "帰還者", "定住者", "帰る場所を1つに決めたい"],
  ["RFM", "FM", "享受者", "観測者", "様々な世界を見届けたい"],
  ["HFM", "FM", "享受者", "思想家", "様々な世界を構想したい"],
  ["EFM", "FM", "享受者", "表現者", "自分の世界を拡張したい"],
  ["AFM", "FM", "享受者", "随筆家", "自分の世界を追求したい"],
  ["RCO", "CO", "専門家", "監査官", "常に矛盾を模索する"],
  ["HCO", "CO", "専門家", "研究員", "常に本質を模索する"],
  ["ECO", "CO", "専門家", "開発者", "常に可能性を探求する"],
  ["ACO", "CO", "専門家", "編集者", "常に完成形を探求する"],
  ["RCL", "CL", "芸術家", "画家", "自分の力で真実を見つけたい"],
  ["HCL", "CL", "芸術家", "音楽家", "自分の力で意味を見つけたい"],
  ["ECL", "CL", "芸術家", "作家", "自分の力で物語を広げたい"],
  ["ACL", "CL", "芸術家", "発明家", "自分の力で物語を完成させたい"],
  ["RCG", "CG", "開発者", "エンジニア", "仕組みを整えて改良したい"],
  ["HCG", "CG", "開発者", "プランナー", "仕組みを設計して制作したい"],
  ["ECG", "CG", "開発者", "プログラマー", "仕組みを使って進めたい"],
  ["ACG", "CG", "開発者", "デザイナー", "仕組みを使って整えたい"],
  ["RCM", "CM", "討論者", "検察官", "既存の内容で議論したい"],
  ["HCM", "CM", "討論者", "弁護士", "本質のズレを議論したい"],
  ["ECM", "CM", "討論者", "評論家", "議論をどんどん広げたい"],
  ["ACM", "CM", "討論者", "裁判官", "議論で結論をだしたい"],
  ["RPO", "PO", "出演者", "演者", "自分の行動で盛り上げたい"],
  ["HPO", "PO", "出演者", "芸人", "自分の言葉で盛り上げたい"],
  ["EPO", "PO", "出演者", "実況者", "盛り上がりを高めていきたい"],
  ["APO", "PO", "出演者", "解説者", "盛り上がりを維持したい"],
  ["RPL", "PL", "支援者", "守護者", "人に安心を与えられる自分でありたい"],
  ["HPL", "PL", "支援者", "伴走者", "理想に寄り添える自分でありたい"],
  ["EPL", "PL", "支援者", "仲介者", "どんな場も和らげる自分でありたい"],
  ["APL", "PL", "支援者", "擁護者", "どんな意見も受け入れられる自分でありたい"],
  ["RPG", "PG", "従事者", "看護師", "起きていることに責任を持ちたい"],
  ["HPG", "PG", "従事者", "整備士", "起こり得ることに責任を持ちたい"],
  ["EPG", "PG", "従事者", "教官", "可能性を責任持って伸ばしたい"],
  ["APG", "PG", "従事者", "司書", "可能性を責任持ってまとめたい"],
  ["RPM", "PM", "共鳴者", "同席者", "何をするかを楽しみたい"],
  ["HPM", "PM", "共鳴者", "同好者", "誰とするかを楽しみたい"],
  ["EPM", "PM", "共鳴者", "感応者", "人の動きを楽しみたい"],
  ["APM", "PM", "共鳴者", "立会人", "人の配置を楽しみたい"],
] as const;

export const typeData = Object.fromEntries(
  typeRows.map(([code, groupCode, groupName, typeName, core]) => [
    code,
    { code, groupCode, groupName, typeName, core },
  ]),
);

export const axisDescriptions: Record<Axis, string> = {
  R: "事実や具体性から思考を始める傾向",
  H: "仮定や全体像から思考を始める傾向",
  E: "可能性を広げながら考える傾向",
  A: "要素をまとめて結論へ向かう傾向",
  C: "整合性や論理を重視して判断する傾向",
  P: "事情や配慮を重視して判断する傾向",
  S: "一貫した判断基準を保つ傾向",
  F: "状況に応じて判断基準を調整する傾向",
  M: "その場の流れに合わせて動く傾向",
  G: "計画や段取りを確認して動く傾向",
  L: "選択肢や余白を残して進む傾向",
  O: "目標やルールに沿って進む傾向",
};

export const axisNames: Record<Axis, string> = {
  R: "事実起点",
  H: "仮定起点",
  E: "拡張思考",
  A: "収束思考",
  C: "整合判断",
  P: "配慮判断",
  S: "一貫原理",
  F: "柔軟原理",
  M: "即興運用",
  G: "計画運用",
  L: "余白志向",
  O: "目標志向",
};

export const stateDescriptions: Record<string, string> = {
  成熟: "詳細診断と自己認識がよく重なっており、現在の価値観が安定して表れています。",
  安定: "主要な軸がはっきり出ており、行動や判断の方向性が比較的読み取りやすい状態です。",
  経過: "主要な軸は見えていますが、状況や自己認識との間に揺れも残っている状態です。",
  不安定: "複数の軸が近く、場面によって結果の出方が変わりやすい状態です。",
};

export const matchDescriptions: Record<string, string> = {
  同一: "簡易診断での自己認識と詳細診断の結果がよく一致しています。",
  近似: "自己認識と詳細診断の結果に近い部分がありつつ、一部に違いもあります。",
  乖離: "自己認識と詳細診断の結果に差が出ています。理想像や最近の環境変化が影響している可能性があります。",
};
