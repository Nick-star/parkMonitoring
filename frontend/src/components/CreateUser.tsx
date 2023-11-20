import React, { useState, useEffect } from 'react';
import './CreateUser.scss';

const CreateUser: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [company_id, setCompanyId] = useState<number | null>(null);
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/users/me/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setCompanyId(data.company_id);
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (company_id) {
            const response = await fetch(`${BASE_URL}/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phoneNumber,
                    is_admin: isAdmin,
                    company_id: company_id,
                }),
            });

            if (response.ok) {
                // Обработка успешного создания пользователя
            } else {
                // Обработка ошибки создания пользователя
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-user">
            {/* Форма создания пользователя */}
            <label htmlFor={'email'}>Email</label>
            <input type={'email'} value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor={'password'}>Пароль</label>
            <input type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor={'firstName'}>Имя</label>
            <input type={'text'} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
<label htmlFor={'lastName'}>Фамилия</label>
            <input type={'text'} value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <label htmlFor={'phoneNumber'}>Телефон</label>
            <input type={'text'} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <label htmlFor={'isAdmin'}>Админ</label>
            <input type={'checkbox'} checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
            <button type={'submit'}>Создать</button>
        </form>
    );
};

export default CreateUser;