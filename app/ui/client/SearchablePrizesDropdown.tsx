import { useEffect, useRef, useState } from 'react';
import { PrizeInfoDB } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';

const SearchablePrizesDropdown = ({
  prizes,
  selectedVal,
  handleChange,
  showPrizeName,
}: {
  prizes: PrizeInfoDB[];
  selectedVal?: PrizeInfoDB;
  handleChange: any;
  showPrizeName: boolean;
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  prizes.sort((a, b) => a.credit - b.credit);
  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener('click', toggle);
    return () => document.removeEventListener('click', toggle);
  }, []);

  const selectOption = (prize?: PrizeInfoDB) => {
    setQuery(() => '');
    handleChange(prize);
    setIsOpen((isOpen) => !isOpen);
  };

  function toggle(e: any) {
    setIsOpen(e && e.target === inputRef.current);
  }

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal)
      return showPrizeName ? selectedVal.name : selectedVal.credit;

    return '';
  };

  const filter = (options: any) => {
    return options.filter(
      (option: PrizeInfoDB) =>
        option.name.includes(query.toLowerCase()) ||
        option.extra.includes(query.toLowerCase()),
    );
  };

  return (
    <div className="dropdown" key="prizeId">
      <div className="control">
        <div className="selected-value rtl align-text-right" >
          <input
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            name={showPrizeName ? 'prize' : 'amount'}
            onChange={(e) => {
              setQuery(e.target.value);
              handleChange(null);
            }}
            onClick={toggle}
          />
        </div>
        <div className={`arrow ${isOpen ? 'open' : ''}`}></div>
      </div>

      <div className={`options ${isOpen ? 'open' : ''}`}>
        {filter(prizes).map((option: any, index: any) => {
          return (
            <div
              onClick={() => selectOption(option)}
              className={`rtl option ${
                option.id === selectedVal?.id ? 'selected' : ''
              } dropdown-player`}
              key={`${option.id}-${index}`}
            >
              <div style={{ marginLeft: 10, marginRight: 6 }}>
                <div>
                  <b>{option.name}</b>
                </div>
              </div>
              <div style={{ marginLeft: 30, color: 'black', direction:'ltr' }}>
                <b> {formatCurrency(option.credit)}</b>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchablePrizesDropdown;
