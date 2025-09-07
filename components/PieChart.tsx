import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

interface PieChartData {
  id: string;
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
}

export default function PieChart({ data, size = 200 }: PieChartProps) {
  // Create a simple donut chart using circular progress bars
  const renderDonutChart = () => {
    let cumulativePercentage = 0;
    
    return data.map((item, index) => {
      const segmentStyle = {
        position: 'absolute' as const,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 8,
        borderColor: 'transparent',
        borderTopColor: item.color,
        transform: [{ rotate: `${cumulativePercentage * 3.6}deg` }],
      };
      
      cumulativePercentage += item.percentage;
      
      return (
        <View key={item.id} style={segmentStyle} />
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Donut Chart */}
      <View style={styles.chartContainer}>
        <View style={[styles.donutOuter, { width: size, height: size, borderRadius: size / 2 }]}>
          {renderDonutChart()}
          <View style={[styles.donutInner, { width: size - 40, height: size - 40, borderRadius: (size - 40) / 2 }]}>
            <Text style={styles.centerText}>Total</Text>
            <Text style={styles.centerAmount}>
              ${data.reduce((sum, item) => sum + item.value, 0).toFixed(0)}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.id} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.name}</Text>
            <Text style={styles.legendValue}>${item.value.toFixed(0)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutOuter: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  donutInner: {
    position: 'absolute',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  centerAmount: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 4,
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
