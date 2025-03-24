import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";


const COLORS = ["#8884d8", "#82ca9d", "#ffc658"]

const SubscriptionDistributionPie = () => {
    const [subData, setSubData] = useState([])
    const fetchChartData = async () => {
        let data = await fetch("http://127.0.0.1:5000/subtypepie", { method: "GET" })
        data = await data.json()
        setSubData(data)
    }
    useEffect(() => {
        fetchChartData()
    }, [])

    return (
        <div className='w-130 mt-10 bg-[#202938] text-center shadow-black shadow-xl ml-5 pb-5 mb-10 text-white'>
            <div className="w-full h-[400px] mx-auto mt-5 p-4 rounded-lg shadow-lg">
                <h2 className="text-center font-semibold text-lg mb-2">Subscription Distribution</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={subData}
                            dataKey="percent"
                            nameKey="subscription"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label={({ subscription, percent }) => `${subscription} ${percent}%`}
                        >
                            {subData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} name={entry.subscription} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default SubscriptionDistributionPie
