type RGBColor = [number, number, number]

export function transitionColor(
  start: RGBColor,
  end: RGBColor,
  progress: number
) {
  const map = start.map((v, i) => [v, end[i]]) as [number, number][]
  const final = map.map(([s, e]) => s + ((e - s) * progress)) as RGBColor
  return final
}
