import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  ResponsiveContainer,
} from "recharts"

interface BarChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

export function BarChart({ data, index, categories, colors, valueFormatter, yAxisWidth = 0 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
        <Tooltip formatter={valueFormatter} />
        <Legend />
        {categories.map((category, i) => (
          <Bar key={category} dataKey={category} fill={colors[i % colors.length]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
