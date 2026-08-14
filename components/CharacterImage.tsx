"use client";

import { useState } from "react";

type CharacterImageProps = {
  typeCode: string;
};

export function CharacterImage({ typeCode }: CharacterImageProps) {
  const [missing, setMissing] = useState(false);

  return (
    <div className="character-frame">
      {missing ? (
        <div className="character-empty" aria-label={`${typeCode}タイプのキャラクター画像準備中`} />
      ) : (
        <img
          src={`/images/characters/${typeCode}.png`}
          alt={`${typeCode}タイプのキャラクター`}
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}
