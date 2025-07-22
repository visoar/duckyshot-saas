// Time formatting utility functions

/**
 * Format seconds into a human-readable time string
 * @param seconds - Number of seconds
 * @returns Formatted time string (e.g., "1m 30s" or "45s")
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Format milliseconds into seconds and then to human-readable time
 */
export function formatTimeFromMs(milliseconds: number): string {
  return formatTime(Math.floor(milliseconds / 1000));
}
