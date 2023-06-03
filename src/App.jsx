import { useState } from 'react';
import { data } from '../data.json';
import Filter from './Filter';

function App() {
    const [tableData, setTableData] = useState(data);
    return (
        <>
            <Filter data={tableData} onApply={setTableData} />
            
            <table className='tw-border tw-border-solid tw-border-white tw-mt-5'>
                <thead>
                    <tr className='w-full'>
                        {Object.entries(data[0]).map(([key, value]) => {
                            return (
                                <th key={key + value} className='tw-border tw-border-solid tw-border-white tw-p-2'>
                                    {key}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    <>
                        {tableData?.map((item, idx) => (
                            <tr key={idx}>
                                {Object.entries(item).map(([key, value]) => {
                                    return (
                                        <th
                                            key={value + key}
                                            className='tw-border tw-border-solid tw-border-white tw-p-2'>
                                            {value}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </>
                </tbody>
            </table>
        </>
    );
}

export default App;
