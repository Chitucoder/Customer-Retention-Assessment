import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"]
const SupportCallsPerSubTypeChart = () => {
    const [scps, setscps] = useState([])
    const fetchChartData = async () => {
        let data = await fetch("http://127.0.0.1:5000/suppersub", { method: "GET" })
        data = await data.json()
        setscps(data)
    }
    useEffect(() => {
        fetchChartData()
    }, [])
    return (
        <div>
            <div className="w-120 mt-2 bg-[#202938] text-center shadow-black shadow-xl ml-[26%] pb-5">
                <h2 className='text-white text-center text-lg'>Support Calls Per Subscription Type</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scps}>
                        <XAxis dataKey="subscription" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="support calls" fill="#8884d8">
                            {scps.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default SupportCallsPerSubTypeChart
