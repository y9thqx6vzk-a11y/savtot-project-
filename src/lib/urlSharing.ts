import { ProjectData } from "@/types/project";

/**
 * Encodes a ProjectData object to a URL-safe Base64 string supporting full UTF-8 Hebrew characters.
 */
export function encodeProjectToUrl(project: ProjectData): string {
  try {
    const jsonStr = JSON.stringify(project);
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (err) {
    console.error("Failed to encode project for URL", err);
    return "";
  }
}

/**
 * Decodes a URL-safe Base64 string back into a ProjectData object.
 */
export function decodeProjectFromUrl(hashOrParam: string): ProjectData | null {
  try {
    let clean = hashOrParam.trim();
    if (clean.startsWith("#")) clean = clean.slice(1);
    if (clean.startsWith("share=")) clean = clean.slice(6);
    if (clean.startsWith("p=")) clean = clean.slice(2);

    let base64 = clean.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);
    if (parsed && typeof parsed === "object") {
      return parsed as ProjectData;
    }
    return null;
  } catch (err) {
    console.error("Failed to decode project from URL", err);
    return null;
  }
}

/**
 * Generates a full shareable URL containing the current project data.
 */
export function generateShareUrl(project: ProjectData): string {
  if (typeof window === "undefined") return "";
  const encoded = encodeProjectToUrl(project);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#share=${encoded}`;
}
