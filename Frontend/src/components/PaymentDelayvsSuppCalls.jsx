import React, { useState, useEffect } from 'react'
import { ScatterChart, Legend, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

let data = {}
const PaymentDelayvsSuppCalls = (props) => {
    const [scData, setScData] = useState({})
    useEffect(() => {
        if (props) {
            data = { x: props.payment_delay, y: props.support_calls }
            setScData([data])
        }
    }, [props.payment_delay, props.support_calls])
    return (
        <div className="w-130 mt-2 bg-[#202938] text-center shadow-black shadow-xl ml-[11.5%] pb-5 mb-10 text-white">
            <h2 className="text-center h-[70px] font-semibold text-lg mb-2">Support Calls and Payment Delay</h2>
            <ResponsiveContainer width="100%" height={250}>
                <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <XAxis type="number" dataKey="x" name="X Value" domain={[0, 100]}
                        label={{ value: "Payment Delay", position: "bottom", offset: -9 }} />
                    <YAxis type="number" dataKey="y" name="Y Value" domain={[0, 100]}
                        label={{ value: "Support Calls", angle: -90, position: "left", offset: 0 }} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="Point" data={scData} fill="#ff7300" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}

export default PaymentDelayvsSuppCalls
