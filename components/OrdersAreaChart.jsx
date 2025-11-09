'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function OrdersAreaChart({ allOrders }) {

    // Group orders by date
    const ordersPerDay = allOrders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0] // format: YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1
        return acc
    }, {})

    // Convert to array for Recharts
    const chartData = Object.entries(ordersPerDay).map(([date, count]) => ({
        date,
        orders: count
    }))

    return (
        <div
            className="w-full max-w-4xl h-[300px] text-xs"
            role="region"
            aria-label="Orders per day area chart"
        >
            <h3
                className="text-lg font-medium text-slate-800 mb-4 pt-2 text-right"
                aria-label="Orders per day chart title"
            >
                <span className='text-slate-500'>Orders /</span> Day
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    aria-label="Area chart showing number of orders per day"
                >
                    <CartesianGrid strokeDasharray="3 3" aria-label="Grid lines" />
                    <XAxis dataKey="date" aria-label="Date axis" />
                    <YAxis
                        allowDecimals={false}
                        label={{ value: 'Orders', angle: -90, position: 'insideLeft' }}
                        aria-label="Orders count axis"
                    />
                    <Tooltip aria-label="Chart tooltip" />
                    <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="#4f46e5"
                        fill="#8884d8"
                        strokeWidth={2}
                        aria-label="Area representing daily order volume"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
