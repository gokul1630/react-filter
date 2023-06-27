import React from 'react';

const INPUT_FILTER = ['<', '>', '===', '<=', '>=', '0', '1'];

const HIDE_INPUT_FILTER = ['0', '1']

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

const stringFunc = (arg = '') => arg.toLowerCase().replace(/\s/gi, '');

const switchFunction = (condition, key, value) => {
    let filteredKey

    if (typeof key === 'string') {
        filteredKey = null;
    } else if (condition === '0' || condition === '1') {
        filteredKey = key === 0 ? 1 : key;
    } else {
        filteredKey = key
    }

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
            return !filteredKey;
        case '1':
            return filteredKey;
        case 'empty':
            return !key;
        case 'notEmpty':
            return key;
        case 'contains':
            return stringFunc(key).includes(stringFunc(value))
        case 'doesNot':
            return !stringFunc(key).includes(stringFunc(value));
        case 'starts':
            return stringFunc(key).startsWith(stringFunc(value));
        case 'ends':
            return stringFunc(key).endsWith(stringFunc(value));
        case 'exactly':
            return key?.replace(/\s/gi,'') === value?.replace(/\s/gi,'');
        default:
            return false;
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
        formData: [{}],
        operator: 'OR',
        showFilter: false,
        x: 0,
    };

    const [state, setState] = React.useReducer((state, action) => ({ ...state, ...action }), initialState);
    const { formData, operator, showFilter, x } = state;

    const toggleFilterCard = () => setState({ showFilter: !showFilter });

    const handleOperatordropDown = (event) => setState({ operator: event.target.value });

    const handleAttributeDropDown = (index) => (event) => {
        const dataArr = [...formData];
        const property = event.target.value;
        dataArr[index] = { property, value: null, operator: '' };
        setState({ formData: dataArr });
    };

    const handleConditionDropDown = (index) => (event) => {
        const operator = event.target.value;
        const dataArr = [...formData];
        dataArr[index].operator = operator;
        setState({ formData: dataArr });
    };

    const handleValueInput = (index, operatorIndex) => (event) => {
        const dataArr = [...formData];
        const inputData = event.target.value;
        const value = INPUT_FILTER.includes(operatorIndex) ? parseInt(inputData) : inputData;
        dataArr[index].value = value;
        setState({ formData: dataArr });
    };

    const handleDeleteQuery = (index) => () => {
        const dataArr = [...formData];
        setState({ formData: dataArr?.filter((_, idx) => idx !== index) });
    };

    const handleAddFilter = () => setState({ formData: [...formData, {}] });

    const handleClearFilter = () => {
        onApply(data);
        setState(initialState);
    };

    const handleApply = () => {
        const filteredObj = {};
        formData?.map((obj) => {
            filteredObj[obj.property] = { value: obj.value, condition: obj.operator };
        });
        onApply(filterData(data, operator, filteredObj));
    };

    const handleMoveCard = () => {
        document.onmousemove = function (event) {
            setState({ x: event.clientX });
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    return (
        <div className='tailwind tw-relative tw-select-none'>
            <button
                onClick={toggleFilterCard}
                className='tailwind tw-relative tw-text-[#4b0dba] tw-text-base tw-font-semibold tw-px-5 tw-bg-white tw-rounded-lg tw-border tw-border-solid tw-border-[#4b0dba] tw-cursor-pointer tw-h-[31px]'>
                Filter
            </button>
            {data?.length > 0 ? (
                <div
                    style={{ left: x }}
                    className={`${
                        !showFilter ? 'tw-hidden' : ''
                    } tw-z-20 tw-absolute tw-top-[120%] tw-bg-yellow-100 tw-px-4 tw-py-4 tw-rounded-lg tw-shadow-lg`}>
                    <div
                        className='tailwind tw-h-4 tw-flex tw-items-center tw-gap-2 tw-cursor-pointer tw-w-max tw-ml-2'
                        onMouseDown={handleMoveCard}>
                        <span className='tailwind tw-font-semibold tw-text-xl tw-leading-none'>&#x2261;</span>
                        <span className='tailwind tw-text-sm'>Move</span>
                    </div>
                    <ul className='tailwind tw-mt-2'>
                        {formData?.map((_, index) => {
                            const dataFirstIndex = data[0];
                            const operatorIndex = formData[index].operator;
                            const propertyIndex = formData[index].property;

                            return (
                                <li
                                    key={index + ' key'}
                                    className={`tw-grid tw-gap-3 tw-pb-2 ${
                                        formData[0].operator
                                            ? 'tw-grid-cols-[4.5rem,12.5rem,12.5rem,12.5rem,1.56rem]'
                                            : 'tw-grid-flow-col'
                                    }`}>
                                    {index === 0 ? <span className='tailwind tw-py-1 tw-px-2 tw-text-base'>Where</span> : null}

                                    {index === 1 ? (
                                        <select
                                            key='operatorOptions'
                                            value={operator}
                                            onChange={handleOperatordropDown}
                                            className='tailwind tw-rounded-lg tw-py-1 tw-px-2 tw-cursor-pointer'>
                                            <option key='and-operator' value='AND'>
                                                AND
                                            </option>
                                            <option key='or-operator' value='OR'>
                                                OR
                                            </option>
                                        </select>
                                    ) : null}

                                    {![0, 1].includes(index) ? (
                                        <span key='operator' className='tailwind tw-py-1 tw-px-2'>
                                            {operator}
                                        </span>
                                    ) : null}

                                    <select
                                        key='attributeOptions'
                                        className='tailwind tw-rounded-lg tw-py-1 tw-px-2 tw-cursor-pointer'
                                        defaultValue='attribute'
                                        onChange={handleAttributeDropDown(index)}>
                                        <option value='attribute' key='item-one-default' disabled>
                                            Attribute
                                        </option>
                                        {Object.keys(dataFirstIndex)?.map((key, index) => (
                                            <option value={key} key={key + index}>
                                                {key}
                                            </option>
                                        ))}
                                    </select>

                                    {propertyIndex ? (
                                        <select
                                            key='operatorOption'
                                            className='tailwind tw-rounded-lg tw-py-1 tw-px-2 tw-cursor-pointer'
                                            defaultValue='condition'
                                            onChange={handleConditionDropDown(index)}>
                                            <option key='item-two-default' value='condition' id='condition' disabled>
                                                Condition
                                            </option>
                                            {Object.entries(dataFirstIndex)?.map(([key, value]) => (
                                                <>
                                                    {key === propertyIndex && typeof value === 'number'
                                                        ? NUMERIC_OPERATORS.map((item) => (
                                                              <option value={item.value} key={key + item.value}>
                                                                  {item.name}
                                                              </option>
                                                          ))
                                                        : null}
                                                    {key === propertyIndex && typeof value === 'string'
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

                                    {operatorIndex && !HIDE_INPUT_FILTER.includes(operatorIndex) ? (
                                        <input
                                            type={INPUT_FILTER.includes(operatorIndex) ? 'number' : 'text'}
                                            onChange={handleValueInput(index, operatorIndex)}
                                            placeholder='Enter value'
                                            className='tailwind tw-rounded-lg tw-py-1 tw-px-2 '
                                        />
                                    ) : null}

                                    {![0].includes(index) ? (
                                        <span
                                            onClick={handleDeleteQuery(index)}
                                            className='tailwind tw-text-2xl tw-leading-none tw-cursor-pointer tw-col-start-5 tw-text-red-400 hover:tw-text-red-600 tw-py-1'
                                            title='delete this filter'>
                                            &#8855;
                                        </span>
                                    ) : null}
                                </li>
                            );
                        })}
                    </ul>

                    {formData[0].operator ? (
                        <div className='tailwind tw-flex tw-gap-2'>
                            <button
                                onClick={handleAddFilter}
                                className='tailwind tw-text-gray-500 tw-text-base tw-px-2 tw-block tw-mt-5 tw-py-1 tw-rounded-lg hover:tw-bg-gray-400 p-2 tw-border tw-border-solid tw-border-gray-400'>
                                + Add Filter
                            </button>

                            <button
                                onClick={handleClearFilter}
                                className='tailwind tw-ml-auto tw-text-gray-500 tw-text-base tw-px-2 tw-block tw-mt-5 tw-py-1 tw-rounded-lg hover:tw-bg-gray-400 p-2 tw-border tw-border-solid tw-border-gray-400'>
                                CLEAR ALL
                            </button>
                            <button
                                onClick={handleApply}
                                className='tailwind tw-text-gray-500 tw-text-base tw-px-2 tw-block tw-mt-5 tw-py-1 tw-rounded-lg hover:tw-bg-gray-400 p-2 tw-border tw-border-solid tw-border-gray-400'>
                                APPLY
                            </button>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

export default Filter;
