import React, { useState, useEffect } from 'react';
import Select, { SingleValue, CSSObjectWithLabel, OptionProps, FilterOptionOption } from 'react-select';

interface Country {
  name: { common: string };
  flags: { png: string };
  idd: { root: string; suffixes: string[] };
}

interface CountryOption {
  value: string; 
  label: JSX.Element; 
  flag: string;
  name: string; 
}

interface CountrySelectorProps {
  onSelect: (dialCode: string) => void;
  defaultValue?: string; 
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ onSelect, defaultValue }) => {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,idd');
        const data: Country[] = await response.json();
        const sortedData = data
          .filter(c => c.idd?.root && c.idd?.suffixes?.length > 0)
          .map(c => {
            const dialCode = `${c.idd.root}${c.idd.suffixes[0]}`;
            return {
              value: dialCode,
              label: (
                <div className="flex items-center">
                  <img src={c.flags.png} alt={`${c.name.common} flag`} className="w-5 h-3 mr-2" />
                  {c.name.common} ({dialCode})
                </div>
              ),
              flag: c.flags.png,
              name: c.name.common, 
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedData);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const defaultOption = defaultValue
    ? countries.find(country => country.value === defaultValue)
    : null;

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading countries...</div>
      ) : (
        <Select<CountryOption>
          options={countries}
          onChange={(option: SingleValue<CountryOption>) => onSelect(option?.value || '')}
          defaultValue={defaultOption}
          placeholder="Select country code"
          className="react-select-container"
          classNamePrefix="react-select"
          isClearable={false}
          isSearchable={true}
          filterOption={(option: FilterOptionOption<CountryOption>, rawInput: string) => {

            const optionName = option.data.name.toLowerCase();
            const searchInput = rawInput.toLowerCase();
            return optionName.includes(searchInput);
          }}
          styles={{
            control: (base: CSSObjectWithLabel) => ({
              ...base,
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-input)',
              color: 'var(--text-primary)',
            }),
            singleValue: (base: CSSObjectWithLabel) => ({
              ...base,
              color: 'var(--text-primary)',
            }),
            menu: (base: CSSObjectWithLabel) => ({
              ...base,
              backgroundColor: 'var(--bg-card)',
            }),
            option: (base: CSSObjectWithLabel, state: OptionProps<CountryOption>) => ({
              ...base,
              backgroundColor: state.isSelected
                ? 'var(--bg-accent)'
                : state.isFocused
                ? 'var(--bg-hover)'
                : 'var(--bg-card)',
              color: 'var(--text-primary)',
              '&:active': {
                backgroundColor: 'var(--bg-accent-active)',
              },
            }),
          }}
        />
      )}
    </div>
  );
};

export default CountrySelector;