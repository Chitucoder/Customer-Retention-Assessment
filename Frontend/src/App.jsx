import { useState } from 'react'
import './App.css'
import GC from './components/GC';
import AgeDistributionChart from './components/AgeDistributionChart';
import SubscriptionDistributionPie from './components/SubscriptionDistributionPie';
import SupportCallsPerSubTypeChart from './components/SupportCallsPerSubTypeChart';
import PaymentDelayvsSuppCalls from './components/PaymentDelayvsSuppCalls';
function App() {
  const [custId, setCustId] = useState("")
  const [custData, setCustData] = useState({})
  const [valid, setValid] = useState(true);
  const [risk, setRisk] = useState("");
  const [clv, setclv] = useState(0);

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
    calculateCLV(data);
  }
  const handleChange = (e) => {
    setCustId(e.target.value)
  }

  const calculateCLV = (data) => {
    const totalSpend = data.total_spend;
    const usageFrequency = data.usage_frequency;
    const tenureYears = data.tenure / 12;
    const churnRate = data.yes;
    const customerLifespan = 1 / churnRate;
    const totalPurchases = usageFrequency * tenureYears;
    const apv = totalSpend / totalPurchases;
    const clvValue = apv * usageFrequency * customerLifespan;
    console.log(custData.response)
    setclv(clvValue.toFixed(2));
  }

  return (
    <>
      <div className='text-white w-full text-xl bg-[#202938] p-2'>
        <div className='ml-[10%]'>Customer Retention Assessment</div>
      </div>
      <div className="container relative mt-[2%] ml-30 w-screen">
        <div className='bg-[#202938] rounded-lg w-[100%] m-auto pb-[2%]'>
          <div className=' flex justify-center item-center'>
            <input
              placeholder='Enter Customer ID (eg 1001)'
              className='bg-[#384152] border-[#2563ea] border-2 text-[#9399a6] h-8 self-center rounded-lg text-m w-[85%]' type="text" name="custId" value={custId} onChange={handleChange} />
            <button className='ml-5 text-m bg-[#2563ea] py-2 w-fit px-2 my-3 font-bold rounded-lg' type='submit' onClick={getData}>Search</button>
          </div>
          {!valid && <div className='text-m text-red-600 text-center font-bold'>Invalid Customer Id</div>}
          <div className='flex space-x-25'>
            {Object.keys(custData).length >= 1 && <div className="cdata text-s shadow-black pr-10 shadow-lg text-white ml-[5%] w-[30%] space-y-1">
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
            {Object.keys(custData).length >= 1 &&
              <div className='items-center'>
                <GC prob={custData.yes} />
                <div className='text-white text-center font-bold text-xl ml-15'>{risk}</div>
                <div className='text-white ml-15 mt-5 border-2 border-white rounded-xl text-xl p-5'>
                  Customer Lifetime Value = {clv}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <div className='text-white flex rounded-xl shadow-black shadow-xl justify-center text-xl bg-[#243c69] my-8 mx-30'>
        {Object.keys(custData).length >= 1 && <div>
          <h2 className='text-3xl m-5'>Reasons </h2>
          <div className='m-5 bg-[#374f7b] p-3 rounded-xl'>{custData.response}</div>
        </div>}
      </div>
      <div>
        <div className='flex'>
          <AgeDistributionChart />
          <SubscriptionDistributionPie />
        </div>
        <div className='flex'>
          <SupportCallsPerSubTypeChart />
          <PaymentDelayvsSuppCalls payment_delay={custData.payment_delay} support_calls={custData.support_calls} />
        </div>

      </div>

    </>
  )
}
export default App
