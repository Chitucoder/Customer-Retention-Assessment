import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
const AgeDistributionChart = () => {

    const [ageData, setAgeData] = useState([])

    const fetchChartData = async () => {
        let data = await fetch("http://127.0.0.1:5000/agedistributiondata", { method: "GET" })
        data = await data.json()
        setAgeData(data)
    }
    useEffect(() => {
        fetchChartData()
    }, [])
    return (
        <div className='w-120 mt-10 bg-[#202938] text-center shadow-black shadow-xl ml-[10%] pb-5 mb-10'>
            <h2 className='text-white text-xl pt-5'>Age Distribution</h2>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={ageData}>
                    <XAxis dataKey="agegroup" label={{ value: "Age Group", position: "bottom", offset: -10 }} />
                    <YAxis label={{ value: "Count", angle: -90, position: "insideLeft", dy: -10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#5d0ec0" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default AgeDistributionChart
