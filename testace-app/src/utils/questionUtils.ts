export function generateUniqueOptions(options: string[]): string[] {
  // Shuffle the array to randomize the order
  return options
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, 4); // Ensure we only return 4 options
}
