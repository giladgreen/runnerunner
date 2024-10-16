import { useEffect, useMemo, useRef, useState } from 'react';
import { PlayerDB } from '@/app/lib/definitions';
import Image from 'next/image';
import { formatCurrency, formatCurrencyColor } from '@/app/lib/utils';

const SearchablePlayersDropdown = ({
  playerId,
  players,
  selectedVal,
  handleChange,
}: {
  playerId: string;
  players: PlayerDB[];
  selectedVal?: PlayerDB;
  handleChange: any;
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener('click', toggle);
    return () => document.removeEventListener('click', toggle);
  }, []);

  const selectOption = (player?: PlayerDB) => {
    setQuery(() => '');
    handleChange(player);
    setIsOpen((isOpen) => !isOpen);
  };

  function toggle(e: any) {
    setIsOpen(e && e.target === inputRef.current);
  }

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal.phone_number;

    return '';
  };

  const filter = (options: any) => {
    return options.filter(
      (option: { player: PlayerDB; display: any }) =>
        option.player.name.includes(query.toLowerCase()) ||
        option.player.phone_number.includes(query.toLowerCase()),
    );
  };

  const allOptions = players.map((option: any, index: any) => {
    return {
      player: option,
      display: (
        <div
          onClick={() => selectOption(option)}
          className={`option ${
            option.id === selectedVal?.id ? 'selected' : ''
          } dropdown-player`}
          key={`${option.id}-${index}`}
        >
          <Image
            src={option.image_url}
            className="zoom-on-hover"
            width={30}
            height={25}
            style={{ marginLeft: 3, marginRight: 6 }}
            alt={`${option.name}'s profile picture`}
          />
          <div style={{ marginLeft: 5, marginRight: 6 }}>
            <div style={{ color: 'black' }}>
              <b>{option.name}</b>
            </div>
            <div>{option.phone_number}</div>
          </div>
          <div
            style={{
              marginLeft: 30,
              paddingTop: 10,
              color: formatCurrencyColor(option.balance),
            }}
          >
            <b> {formatCurrency(option.balance)}</b>
          </div>
        </div>
      ),
    };
  });

  const optionsToShow = useMemo(() => {
    return filter(allOptions).map(
      (option: { player: PlayerDB; display: any }) => option.display,
    );
  }, [query]);

  const onChange = (e: any) => {
    setQuery(e.target.value);
    handleChange(null);
  };

  return (
    <div className="dropdown" key={playerId}>
      <div className="control">
        <div className="selected-value">
          <input
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            name="other_player"
            onChange={onChange}
            onClick={toggle}
          />
          {selectedVal && (
            <div style={{ marginLeft: 5, marginTop: 5 }}>
              ({selectedVal.name})
            </div>
          )}
        </div>
        <div className={`arrow ${isOpen ? 'open' : ''}`}></div>
      </div>

      <div className={`options ${isOpen ? 'open' : ''}`}>{optionsToShow}</div>
    </div>
  );
};

export default SearchablePlayersDropdown;
