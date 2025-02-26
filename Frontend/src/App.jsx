import { useState } from 'react'
import './App.css'
import GC from './components/GC';
import AgeDistributionChart from './components/AgeDistributionChart';
import SubscriptionDistributionPie from './components/SubscriptionDistributionPie';
import SupportCallsPerSubTypeChart from './components/SupportCallsPerSubTypeChart';
import PaymentDelayvsUsageFreq from './components/PaymentDelayvsUsageFreq';
function App() {
  const [custId, setCustId] = useState("")
  const [custData, setCustData] = useState({})
  const [valid, setValid] = useState(true);
  const [risk, setRisk] = useState("");
  const getData = async () => {
    if (custId == "" || isNaN(custId)) {
      setValid(false);
      setCustData({})
      setRisk("")
      return;
    }
    setValid(true);
    let data = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      }, body: custId
    })
    data = await data.json()
    let p = data['yes'] * 100;
    if (p < 40) {
      setRisk("Low Risk");
    } else if (p < 70) {
      setRisk("Medium Risk");
    } else {
      setRisk("High Risk");
    }
    setCustData(data)
  }
  const handleChange = (e) => {
    setCustId(e.target.value)
  }
  return (
    <>
      <div className="container relative top-10 flex w-screen">
        <div className='border-black border-1 p-8 min-w-25% ml-20 shadow-violet-800 shadow-xl  bg-slate-800 rounded-2xl'>
          <h1 className='text-2xl text-white font-bold py-8 pt-0'>Enter Customer ID</h1>

          <input className='bg-white border-2 rounded-lg text-m w-full' type="text" name="custId" value={custId} onChange={handleChange} />
          {!valid && <div className='text-m text-red-600 text-center font-bold'>Invalid Customer Id</div>}
          <button className='border-gray-900 text-m bg-cyan-200 border-2 w-full my-3 font-bold rounded-lg' type='submit' onClick={getData}>Submit</button>
          {Object.keys(custData).length >= 1 && <div className="cdata text-s text-white">
            <div><b>Customer Id:</b> {custData.customer_id}</div>
            <div><b>Age:</b> {custData.age}</div>
            <div><b>Gender:</b> {custData.gender}</div>
            <div><b>Total Spend:</b> {custData.total_spend} rupees</div>
            <div><b>Tenure:</b> {custData.tenure} months</div>
            <div><b>Support Calls:</b> {custData.support_calls}</div>
            <div><b>Subscription Type:</b> {custData.subscription_type}</div>
            <div><b>Payment Delay:</b> {custData.payment_delay} days</div>
            <div><b>Last Interaction:</b> {custData.last_interaction} days</div>
            <div><b>Contract Length:</b> {custData.contract_length}</div>
            <div><b>Usage Frequency:</b> {custData.usage_frequency}</div>
            <div><b>Probability of leaving service:</b> {100 * custData.yes}%</div>
            {/* <div><b>:</b> {100 * custData.no}%</div> */}
          </div>}
        </div>
        {Object.keys(custData).length >= 1 &&
          <div className='items-center'>
            <GC prob={custData.yes} />
            <div className='text-white text-center mt-4 ml-10 font-bold text-xl '>{risk}</div>
          </div>
        }
        {Object.keys(custData).length >= 1 && <div className='mt-20 bg-slate-900 h-50 p-3 ml-10 shadow-black shadow-xl'>

          <div className='flex text-lg text-white gap-x-5 items-center'>
            <div className='bg-red-600 w-25 h-5 my-5'></div>
            71%-100% (High Risk)
          </div>
          <div className='flex text-lg text-white gap-x-5 items-center'>
            <div className='bg-yellow-300 w-25 h-5 my-5'></div>
            41%-70% (Medium Risk)
          </div>
          <div className='flex text-lg text-white gap-x-5 items-center'>
            <div className='bg-green-600 w-25 h-5 my-5'></div>
            0%-40% (Low Risk)
          </div>
        </div>}
        {/* 
        Gauge Chart to display risk.
        Age Distribution of Customers (Histogram)
        Subscription Type Distribution (Pie Chart)
        Support Calls per Subscription Type (Bar Chart)
        Payment Delays vs. Usage Frequency (Scatter Plot)
        */}
      </div>
      <div>
        <div className='flex items-center'>
          <AgeDistributionChart />
          <SubscriptionDistributionPie />
        </div>
        <div className='flex items-center'>
          <SupportCallsPerSubTypeChart />
          {Object.keys(custData).length >= 1 && <PaymentDelayvsUsageFreq payment_delay={custData.payment_delay} usage_frequency={custData.usage_frequency} />}
        </div>

      </div>

    </>
  )
}
export default App
