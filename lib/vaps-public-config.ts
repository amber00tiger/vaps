export type VapsPublicMode = "beta" | "official";

export const vapsPublicMode: VapsPublicMode = "beta";

export const betaConsentVersion = "2026-08-beta-1";

export const discordCommunityUrl =
  process.env.NEXT_PUBLIC_DISCORD_COMMUNITY_URL ?? "https://discord.gg/JW7ySc7bju";

export const betaStorageKeys = {
  consentAccepted: "vapsBetaConsentAccepted",
  consentVersion: "vapsBetaConsentVersion",
  responseId: "vapsResponseId",
} as const;

export function createResponseId(_source: VapsPublicMode = "beta") {
  return `VAPS-${createOpaqueToken(20)}`;
}

function createOpaqueToken(length: number) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  }

  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}
