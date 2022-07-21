import React from 'react';
import allIcon from '../../assets/images/icons/all-icon-32px.svg';

const Filter = (props) => {
  const { options, value, onChange, includeAll } = props;

  return (
    <ul className="filter">
      { includeAll &&
      <li className={!value ? 'active' : ''}>
        <button onClick={() => onChange(null)} className="pretty-link">
          <img src={allIcon} alt="All" />
          All
        </button>
      </li>
      }
      { options.map((option) => (
      <li key={option.value} className={value === option.value ? 'active' : ''}>
        <button onClick={() => onChange(option.value)} className="pretty-link">
          <img src={option.icon} alt={option.value} />
          <span className="text-uppercase text-xs">{option.value}</span>
        </button>
      </li>
      ))}
    </ul>
  );

};

export default Filter;