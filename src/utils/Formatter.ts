export function sanitizeTarget(id: string) {
  return id.replace(/[^0-9]/g, '')
}

export function formatTarget(id: string) {
  const numbers = sanitizeTarget(id)
  if (numbers.length >= 13) return numbers
  return ('0000000000000' + numbers.replace(/^0/, '66')).slice(-13)
}
