export const useDonutChart = (width: number = 96, strokeWidth: number = 8, rotation: number = -90, _height?: number) => {
  const r = (width - (2 * strokeWidth)) / 2
  const cx = r + strokeWidth
  const cy = r + strokeWidth
  const circumference = 2 * Math.PI * r
  const height = _height ?? width

  const transform = `rotate(${rotation}, ${cx}, ${cy})`
  const svgProps = { width, height, viewBox: `0 0 ${width} ${height}` } as const
  const circleProps = { cx, cy, r, 'stroke-width': strokeWidth, 'stroke-linecap': 'round', transform } as const

  return { circumference, circleProps, svgProps }
}

interface Segment {
  l: number
  vl: number
  offset: number
}
