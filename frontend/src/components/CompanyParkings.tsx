import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
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
    const fetchParkings = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/users/me/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const user = await response.json();
        const company_id = user.company_id;

        if (selectedCity != null) {
            const responseParkings = await fetch(`${BASE_URL}/companies/${company_id}/parkings/city/${selectedCity}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await responseParkings.json();
            console.log(data);
            setParkings(data);
        }
    };

    fetchParkings();
}, [selectedCity]); // Добавьте selectedCity в зависимости useEffect

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

            <ul className="parking-list">
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
