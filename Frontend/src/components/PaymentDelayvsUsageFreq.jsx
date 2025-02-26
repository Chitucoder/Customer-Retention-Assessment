import React, { useState, useEffect } from 'react'
import { ScatterChart, Legend, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

let data = {}
const PaymentDelayvsUsageFreq = (props) => {
    const [scData, setScData] = useState({})
    useEffect(() => {
        if (props) {
            data = { x: props.payment_delay, y: props.usage_frequency }
            setScData([data])
        }
    }, [props.payment_delay, props.usage_frequency])
    return (
        <div className="w-[400px] h-[300px] mx-auto p-4 text-white text-center rounded-lg shadow-lg shadow-black">
            <h2 className="text-center font-semibold text-lg mb-2">Single Point Scatter Plot</h2>
            <ResponsiveContainer width="100%" height={250}>
                <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <XAxis type="number" dataKey="x" name="X Value" domain={[0, 100]}
                        label={{ value: "Payment Delay", position: "bottom", offset: -9 }} />
                    <YAxis type="number" dataKey="y" name="Y Value" domain={[0, 100]}
                        label={{ value: "Usage Frequency", angle: -90, position: "left", offset: 0 }} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="Point" data={scData} fill="#ff7300" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}

export default PaymentDelayvsUsageFreq
