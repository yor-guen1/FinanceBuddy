import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

interface PieSlice {
  value: number;
  color: string;
}

interface PieChartProps {
  size?: number;
  thickness?: number;
  data: PieSlice[];
}

export default function PieChart({ size = 160, thickness = 18, data }: PieChartProps) {
  const radius = size / 2;
  const innerRadius = radius - thickness;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  let startAngle = -Math.PI / 2; // start at top
  const arcs = data.map((slice) => {
    const angle = (slice.value / total) * Math.PI * 2;
    const endAngle = startAngle + angle;
    const largeArc = angle > Math.PI ? 1 : 0;

    const outerStartX = radius + radius * Math.cos(startAngle);
    const outerStartY = radius + radius * Math.sin(startAngle);
    const outerEndX = radius + radius * Math.cos(endAngle);
    const outerEndY = radius + radius * Math.sin(endAngle);

    const innerEndX = radius + innerRadius * Math.cos(endAngle);
    const innerEndY = radius + innerRadius * Math.sin(endAngle);
    const innerStartX = radius + innerRadius * Math.cos(startAngle);
    const innerStartY = radius + innerRadius * Math.sin(startAngle);

    const d = [
      `M ${outerStartX} ${outerStartY}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${outerEndX} ${outerEndY}`,
      `L ${innerEndX} ${innerEndY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStartX} ${innerStartY}`,
      'Z',
    ].join(' ');

    const path = <Path key={`${startAngle}-${endAngle}`} d={d} fill={slice.color} />;
    startAngle = endAngle;
    return path;
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G>
          {arcs}
        </G>
      </Svg>
    </View>
  );
}


