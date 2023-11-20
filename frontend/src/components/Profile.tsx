import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.scss';

const Profile: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isPasswordFormOpen, setPasswordFormOpen] = useState<boolean>(false);
const [newPassword, setNewPassword] = useState('');
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${BASE_URL}/users/me/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setUser(data);
                setLoading(false);
            } catch (err) {
                console.error("Ошибка при запросе данных пользователя", err);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

const handlePasswordChange = async (newPassword: string) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${BASE_URL}/users/me/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        });

        if (!response.ok) {
            throw new Error('Error updating password');
        }

        const data = await response.json();
        console.log('Password updated successfully:', data);
    } catch (err) {
        console.error(err);
    }
};

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>Error loading user data.</p>;
    }

    return (
        <div className="profile">
            <h1>Профиль</h1>
            <p>Email: {user.email}</p>
            <p>Имя: {user.first_name}</p>
            <p>Фамилия: {user.last_name}</p>
            <p>Телефон: {user.phone_number}</p>
            <p>Админ: {user.is_admin ? '✅' : '❌'}</p>
            {user.is_admin && <Link to="/create-user">Создать пользователя</Link>}
            <Link to="/company-parkings">Парковки компании</Link>
            <button onClick={() => setPasswordFormOpen(true)}>Смена пароля</button>
        {isPasswordFormOpen && (
            <form className={isPasswordFormOpen ? 'form-visible' : 'form-hidden'} onSubmit={(e) => { e.preventDefault(); handlePasswordChange(newPassword); }}>
    <input type="password" placeholder="Новый пароль" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
    <button type="submit">Подтвердить</button>
</form>
        )}
            {/* Можете добавить и другую информацию о пользователе */}
        </div>
    );
};

export default Profile;
