import React from 'react'
import GaugeChart from 'react-gauge-chart'
import { useMemo } from 'react';
const GC = ({ prob }) => {
    const memoizedGauge = useMemo(() => (
        <GaugeChart
            percent={prob}
        />
    ), [prob]);
    return (
        <div className='w-100 h-50 mt-20 ml-15 shadow-black shadow-2xl'>
            {memoizedGauge}
        </div>
    )
}

export default GC