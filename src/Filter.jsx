import React, { useEffect, useRef } from 'react';

const INPUT_FILTER = ['<', '>', '===', '<=', '>=', '0', '1'];

const NUMERIC_OPERATORS = [
    { name: 'less than', value: '<' },
    { name: 'greater than', value: '>' },
    { name: 'equal to', value: '===' },
    { name: 'less than or equal to', value: '<=' },
    { name: 'greater than or equal to', value: '>=' },
    { name: 'not equal to', value: '!==' },
    { name: 'is empty', value: '0' },
    { name: 'not empty', value: '1' },
];

const STRING_OPERATORS = [
    { name: 'contains', value: 'contains' },
    { name: 'does not contain', value: 'doesNot' },
    { name: 'starts with', value: 'starts' },
    { name: 'ends with', value: 'ends' },
    { name: 'is exactly', value: 'exactly' },
    { name: 'empty', value: 'empty' },
    { name: 'not empty', value: 'notEmpty' },
];

const switchFunction = (condition, key, value) => {
    switch (condition) {
        case '<':
            return key < value;
        case '>':
            return key > value;
        case '===':
            return key === value;
        case '<=':
            return key <= value;
        case '>=':
            return key >= value;
        case '!==':
            return key !== value;
        case '0':
            return !key;
        case '1':
            return key;
        case 'contains':
            return key.includes(value);
        case 'notEmpty':
            return key;
        case 'doesNot':
            return !key.includes(value);
        case 'starts':
            return key.startsWith(value);
        case 'ends':
            return key.endsWith(value);
        case 'exactly':
            return key === value;
        case 'empty':
            return key;
    }
};

function filterData(data, operator, conditions) {
    return data.filter((item) => {
        if (operator === 'AND') {
            return Object.entries(conditions)?.every(([key, val]) => {
                const value = val.value;
                const keyOne = item[key];
                const condition = val.condition;
                return switchFunction(condition, keyOne, value);
            });
        } else {
            return Object.entries(conditions)?.some(([key, val]) => {
                const value = val.value;
                const keyOne = item[key];
                const condition = val.condition;
                return switchFunction(condition, keyOne, value);
            });
        }
    });
}

const Filter = (props) => {
    const { data, onApply } = props;

    const initialState = {
        originalData: [],
        formData: [{}],
        operator: 'OR',
        showFilter: false,
        isClicked: false,
        x: 0,
    };

    const [state, setState] = React.useReducer((state, action) => ({ ...state, ...action }), initialState);
    const { formData, operator, showFilter, originalData, x } = state;

    useEffect(() => {
        if (data?.length) setState({ originalData: data });
    }, []);

    return (
        <>
            {originalData?.length > 0 ? (
                <div className='tw-relative tw-select-none'>
                    <button
                        onClick={() => setState({ showFilter: !showFilter })}
                        className='tw-relative tw-text-gray-500 tw-text-base tw-px-5 tw-py-1 tw-rounded-lg hover:tw-bg-gray-400 p-2 tw-border tw-border-solid tw-border-gray-400'>
                        Filter
                    </button>
                    <div
                        style={{ left: x }}
                        className={`${
                            showFilter ? 'tw-hidden' : ''
                        } tw-absolute tw-top-[120%] tw-bg-yellow-100 tw-px-4 tw-py-4 tw-rounded-lg tw-shadow-lg`}>
                        <div
                            className='tw-h-4 tw-flex tw-items-center tw-gap-2 tw-cursor-pointer tw-w-max tw-ml-2'
                            onMouseDown={() => {
                                document.onmousemove = function (event) {
                                    setState({ x: event.clientX });
                                };

                                document.onmouseup = function () {
                                    document.onmousemove = null;
                                    document.onmouseup = null;
                                };
                            }}>
                            <span className='tw-font-semibold tw-text-xl tw-leading-none'>&#x2261;</span>
                            <span className='tw-text-sm'>Move</span>
                        </div>
                        <ul className='tw-mt-2'>
                            {formData?.map((_, index) => (
                                <li
                                    key={index + ' key'}
                                    className={`tw-grid tw-gap-3 tw-pb-2 ${
                                        formData[0].operator
                                            ? 'tw-grid-cols-[4.5rem,12.5rem,12.5rem,12.5rem,1.56rem]'
                                            : 'tw-grid-flow-col'
                                    }`}>
                                    {index === 0 ? <span className='tw-py-1 tw-px-2 tw-text-base'>Where</span> : null}

                                    {index === 1 ? (
                                        <select
                                            key='operatorOptions'
                                            value={operator}
                                            onChange={(event) => {
                                                setState({ operator: event.target.value });
                                            }}
                                            className='tw-rounded-lg tw-py-1 tw-px-2 tw-cursor-pointer'>
                                            <option key='and-operator' value='AND'>
                                                AND
                                            </option>
                                            <option key='or-operator' value='OR'>
                                                OR
                                            </option>
                                        </select>
                                    ) : null}

                                    {![0, 1].includes(index) ? (
                                        <span key='operator' className='tw-py-1 tw-px-2'>
                                            {operator}
                                        </span>
                                    ) : null}

                                    <select
                                        key='attributeOptions'
                                        className='tw-rounded-lg tw-py-1 tw-px-2 tw-cursor-pointer'
                                        defaultValue='attribute'
                                        onChange={(event) => {
                                            const data = [...formData];
                                            data[index] = { property: event.target.value, value: null, operator: '' };
                                            setState({ formData: data });
                                        }}>
                                        <option value='attribute' key='item-one-default' disabled>
                                            Attribute
                                        </option>
                                        {Object.keys(originalData[0])?.map((key, index) => (
                                            <option value={key} key={key + index}>
                                                {key}
                                            </option>
                                        ))}
                                    </select>

                                    {formData[index].property ? (
                                        <select
                                            key='operatorOption'
                                            className='tw-rounded-lg tw-py-1 tw-px-2 tw-cursor-pointer'
                                            defaultValue='condition'
                                            onChange={(event) => {
                                                const operator = event.target.value;
                                                const data = [...formData];

                                                data[index].operator = operator;
                                                setState({ formData: data });
                                            }}>
                                            <option key='item-two-default' value='condition' id='condition' disabled>
                                                Condition
                                            </option>
                                            {Object.entries(originalData[0])?.map(([key, value]) => (
                                                <>
                                                    {key === formData[index].property && typeof value === 'number'
                                                        ? NUMERIC_OPERATORS.map((item) => (
                                                              <option value={item.value} key={key + item.value}>
                                                                  {item.name}
                                                              </option>
                                                          ))
                                                        : null}
                                                    {key === formData[index].property && typeof value === 'string'
                                                        ? STRING_OPERATORS.map((item) => (
                                                              <option value={item.value} key={key + item.name}>
                                                                  {item.name}
                                                              </option>
                                                          ))
                                                        : null}
                                                </>
                                            ))}
                                        </select>
                                    ) : null}

                                    {formData[index].operator ? (
                                        <input
                                            type={INPUT_FILTER.includes(formData[index].operator) ? 'number' : 'text'}
                                            onChange={(event) => {
                                                const data = [...formData];
                                                const inputData = event.target.value;
                                                const value = INPUT_FILTER.includes(formData[index].operator)
                                                    ? parseInt(inputData)
                                                    : inputData;
                                                data[index].value = value;
                                            }}
                                            placeholder='Enter value'
                                            className='tw-rounded-lg tw-py-1 tw-px-2 '
                                        />
                                    ) : null}

                                    {![0].includes(index) ? (
                                        <span
                                            onClick={() => {
                                                const data = [...formData];
                                                setState({ formData: data?.filter((_, idx) => idx !== index) });
                                            }}
                                            className='tw-text-2xl tw-leading-none tw-cursor-pointer tw-col-start-5 tw-text-red-400 hover:tw-text-red-600 tw-py-1'
                                            title='delete this filter'>
                                            &#8855;
                                        </span>
                                    ) : null}
                                </li>
                            ))}
                        </ul>

                        {formData[0].operator ? (
                            <div className='tw-flex tw-gap-2'>
                                <button
                                    onClick={() => {
                                        setState({ formData: [...formData, {}] });
                                    }}
                                    className='tw-text-gray-500 tw-text-base tw-px-2 tw-block tw-mt-5 tw-py-1 tw-rounded-lg hover:tw-bg-gray-400 p-2 tw-border tw-border-solid tw-border-gray-400'>
                                    + Add Filter
                                </button>

                                <button
                                    onClick={() => {
                                        onApply(originalData);
                                        setState(initialState);
                                    }}
                                    className='tw-ml-auto tw-text-gray-500 tw-text-base tw-px-2 tw-block tw-mt-5 tw-py-1 tw-rounded-lg hover:tw-bg-gray-400 p-2 tw-border tw-border-solid tw-border-gray-400'>
                                    CLEAR ALL
                                </button>
                                <button
                                    onClick={() => {
                                        const filteredObj = {};
                                        formData?.map((obj) => {
                                            filteredObj[obj.property] = { value: obj.value, condition: obj.operator };
                                        });
                                        onApply(filterData(originalData, operator, filteredObj));
                                    }}
                                    className='tw-text-gray-500 tw-text-base tw-px-2 tw-block tw-mt-5 tw-py-1 tw-rounded-lg hover:tw-bg-gray-400 p-2 tw-border tw-border-solid tw-border-gray-400'>
                                    APPLY
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Filter;