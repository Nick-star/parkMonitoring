import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './Parkings.scss';

const Parkings: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const [cities, setCities] = useState<any[]>([]);
    const [parkings, setParkings] = useState<any[]>([]);
    const [selectedCity, setSelectedCity] = useState<number | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetch(`${BASE_URL}/cities/`)
            .then(response => response.json())
            .then(data => setCities(data));
    }, []);

    useEffect(() => {
        if (selectedCity) {
            fetch(`${BASE_URL}/parkings/city/${selectedCity}/`)
                .then(response => response.json())
                .then(data => setParkings(data));
        }
    }, [selectedCity]);

    return (
        <div className="parkings-container">
            <h1>Парковки</h1>
            <input
                className="city-input"
                value={inputValue}
                onChange={e => {
                    setInputValue(e.target.value);
                    setShowSuggestions(true); // Показываем предложения при каждом изменении inputValue
                }}
                placeholder="Введите город..."
            />
            {inputValue && showSuggestions && (
                <ul className="city-suggestions">
                    {cities.filter(city => city.name.toLowerCase().includes(inputValue.toLowerCase())).map(city => (
                        <li key={city.id} onClick={() => {
                            setInputValue(city.name);
                            setSelectedCity(city.id);
                            setShowSuggestions(false); // Скрываем предложения после клика
                        }}>
                            {city.name}
                        </li>
                    ))}
                </ul>
            )}

            <ul>
                {parkings.map(parking => (
                    <li key={parking.id}>
                        <Link to={`/parking/${parking.id}`}>
                            <div className="parking-name">{parking.name}</div>
                            <div className="parking-address">{parking.address}</div>
                            <div className="parking-info">
                                <span>{parking.total_spaces - parking.free_spaces}/{parking.total_spaces}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default Parkings;
