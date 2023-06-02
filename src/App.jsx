import { useState } from 'react'
import { data } from '../data.json'
import { useReducer } from 'react'

const OPERATORS = [
  { name: 'less than', value: '<' },
  { name: 'greater than', value: '>' },
  { name: 'equal to', value: '===' },
]

function App() {
  const initialState = {
    formData: [{}]
  }
  const [state, setState] = useReducer((state, action) => ({ ...state, ...action }), initialState)
  const { formData } = state
  const [show, setShow] = useState(false)

  const headings = ["name", "email", "status", "totalTasks", "submittedTasks", "M1_Avg", "M2_Avg", "Hackathon1_score", "Hackathon2_score", "totalTaskMarks", "pendingTasks"]

  return (
    <div>
      <div className='tw-relative tw-w-full'>

        <button onClick={() => setShow((state) => !state)} className='tw-relative tw-text-gray-500 tw-text-base tw-px-5 tw-py-1 tw-rounded-lg hover:tw-bg-gray-400 p-2 tw-border tw-border-solid tw-border-gray-400'>Filter
        </button>
        <div className={`${show ? 'tw-hidden' : ''} tw-absolute tw-top-full tw-max-w-full tw-bg-yellow-100 tw-px-4 tw-py-2 tw-rounded-lg`}>




          Where
          <ul>
            {formData?.map((item, index) => (
              <li key={index} className='tw-flex tw-gap-4'>

                <select className='tw-ml-2' onChange={(event) => {
                  const data = [...formData]
                  data[index] = { property: event.target.value, value : null, operator: ''  }
                  setState({ formData: data })
                }
                }>
                  <option selected disabled>Attribute</option>
                  {Object.keys(data[0]).map((key) => <option className='tw-flex tw-justify-between' id={key} key={key}>{key}
                  </option>)}
                </select>




                {Object.keys(formData[index]).length ?
                  <select className='tw-ml-2' onChange={(event) => {
                    const operator = event.target.value
                    const data = [...formData]

                    data[index].operator = operator  
                    setState({ formData: data })
                  
                  console.log(data);
                }
                  }>
                    <option selected disabled>Attribute</option>
                    {Object.entries(data[0]).map(([key, value]) => {
                      return (
                        <>{
                          key === formData[index].property ? typeof value === 'number' ? OPERATORS.map(data => (<option value={data.value} key={key}>{data.name}</option>)) : null : null
                        }</>
                      )
                    })}
                  </select> : null}
                
                {formData[0].operator ? <input type='text' placeholder='Enter value' /> : null}
                


              </li>
            ))}
          </ul>

          {formData[0].operator ? <button onClick={() => {
            setState({ formData: [...formData, {}] })
          }} className='tw-text-gray-500 tw-text-base tw-px-2 tw-block tw-mt-5 tw-py-1 tw-rounded-lg hover:tw-bg-gray-400 p-2 tw-border tw-border-solid tw-border-gray-400  '>+ Add Filter</button> : null}
        </div>
      </div>

      <table className='tw-border tw-border-solid tw-border-white tw-mt-5'>
        <thead>
          <tr className='w-full'>
            <th className='tw-border tw-border-solid tw-border-white'>Name</th>
            <th className='tw-border tw-border-solid tw-border-white'>Email</th>
            <th className='tw-border tw-border-solid tw-border-white'>Status</th>
            <th className='tw-border tw-border-solid tw-border-white'>Total Tasks</th>
            <th className='tw-border tw-border-solid tw-border-white'>Submitted Tasks</th>
            <th className='tw-border tw-border-solid tw-border-white'>Mock 1 (Avg)</th>
            <th className='tw-border tw-border-solid tw-border-white'>Mock 2 (Avg)</th>
            <th className='tw-border tw-border-solid tw-border-white'>Webcode 1 (score)</th>
            <th className='tw-border tw-border-solid tw-border-white'>Webcode 2 (score)</th>
            <th className='tw-border tw-border-solid tw-border-white'>Total Task Marks</th>
            <th className='tw-border tw-border-solid tw-border-white'>Pending Tasks</th>
          </tr>
        </thead>
        <tbody>
          <>
            {data.map(item => (
              <tr key={item.email}>
                {
                  Object.entries(item).map(([key, value]) => {
                    return headings.includes(key) ? <th className='tw-border tw-border-solid tw-border-white tw-p-2'>{value}</th> : null
                  })
                }
              </tr>
            ))}
          </>
        </tbody>
      </table>

    </div>
  )
}

export default App
