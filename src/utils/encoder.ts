/**
 * Generate an `UCS-2`-like? Hex string for Tag 81
 *
 * This method is equivalent to:
 *
 * `Buffer.from(message, 'utf16le').swap16().toString('hex').toUpperCase()`
 *
 * @param message - Message
 * @returns Hex string of provided message
 */
export function encodeTag81(message: string) {
  return message
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(4, '0'))
    .join('')
    .toUpperCase()
}
