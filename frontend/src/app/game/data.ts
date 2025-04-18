export interface PracticeText {
  id: number;
  text: string;
  level: 'easy' | 'medium' | 'hard';
}

export const practiceTexts: PracticeText[] = [
  {
    id: 1,
    text: "タイピングは基本的なコンピュータースキルの一つです。正確に素早く入力できるようになると、作業効率が大幅に向上します。",
    level: 'easy'
  },
  {
    id: 2,
    text: "プログラミングを学ぶことで、論理的思考力や問題解決能力が養われます。初心者にはJavaScriptやPythonがおすすめです。",
    level: 'easy'
  },
  {
    id: 3,
    text: "人工知能（AI）は、人間の知能を模倣するコンピューターシステムです。機械学習やディープラーニングなどの技術が含まれます。",
    level: 'medium'
  },
  {
    id: 4,
    text: "クラウドコンピューティングは、インターネットを通じてコンピューティングサービスを提供する技術です。AWSやGCP、Azureなどが代表的なプロバイダーです。",
    level: 'medium'
  },
  {
    id: 5,
    text: "ブロックチェーンは、分散型台帳技術であり、暗号通貨の基盤となっています。データの改ざんが困難で、透明性が高いことが特徴です。",
    level: 'hard'
  },
  {
    id: 6,
    text: "量子コンピューティングは、量子力学の原理を利用した新しいコンピューティングパラダイムです。特定の問題に対して従来のコンピューターよりも指数関数的に高速な計算が可能になると期待されています。",
    level: 'hard'
  }
];

export const timeAttackTexts: string[] = [
  "技術の進歩は私たちの生活を大きく変えました。スマートフォンやインターネットの普及により、情報へのアクセスが容易になりました。",
  "健康的な生活を送るためには、バランスの取れた食事と適切な運動が重要です。十分な睡眠も心身の健康維持に不可欠です。",
  "環境問題は世界的な課題となっています。気候変動や生物多様性の喪失、海洋プラスチック汚染などの問題に対して、私たち一人ひとりが行動を起こすことが大切です。",
  "ビットコインなどの暗号通貨は、ブロックチェーン技術を基盤としています。分散型で中央機関に依存しない特性があり、金融の未来を変える可能性があります。",
  "人工知能（AI）の発展により、様々な産業で自動化が進んでいます。AIは医療診断から自動運転車まで、多くの分野で革新をもたらしています。",
  "プログラミング教育は、論理的思考力や問題解決能力を養うために重要です。多くの国で初等教育からプログラミングを取り入れる動きが広がっています。"
];

export const getRandomText = (textArray: any[]): any => {
  const randomIndex = Math.floor(Math.random() * textArray.length);
  return textArray[randomIndex];
};

export const getRandomPracticeText = (level?: 'easy' | 'medium' | 'hard'): PracticeText => {
  if (level) {
    const filteredTexts = practiceTexts.filter(text => text.level === level);
    return getRandomText(filteredTexts);
  }
  return getRandomText(practiceTexts);
};

export const getRandomTimeAttackText = (): string => {
  return getRandomText(timeAttackTexts);
}; 