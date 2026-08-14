import {
  betaConsentVersion,
  betaStorageKeys,
  vapsPublicMode,
  type VapsPublicMode,
} from "./vaps-public-config";

export function getStoredQuestionMode(): VapsPublicMode {
  return window.localStorage.getItem("vapsQuestionMode") === "official" ? "official" : "beta";
}

export function hasAcceptedBetaTerms() {
  return (
    window.localStorage.getItem(betaStorageKeys.consentAccepted) === "yes" &&
    window.localStorage.getItem(betaStorageKeys.consentVersion) === betaConsentVersion
  );
}

export function requiresBetaGate() {
  return vapsPublicMode === "beta" && (!hasAcceptedBetaTerms() || getStoredQuestionMode() !== "beta");
}

export function betaProtectedHref(fallback = "/beta") {
  return requiresBetaGate() ? fallback : null;
}
