import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAudioURL(baseURL: string, audioPath: string) {
  return (new URL(audioPath, baseURL)).href
}