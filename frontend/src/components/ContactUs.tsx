import React, {FormEvent, useState} from 'react';
import "./ContactUs.scss";

const ContactUs = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = {
            name,
            email,
            message
        };
        console.log(formData)

        try {
            const response = await fetch(`${BASE_URL}/contacts/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });


            const data = await response.json();
            console.log(data);

            if (response.ok) {
                // Здесь вы можете добавить обработку успешного ответа, например, очистить поля формы.
                setName('');
                setEmail('');
                setMessage('');
            } else {
                // Обработка ошибок, например, показать пользователю сообщение об ошибке.
                console.error("Ошибка при отправке формы");
            }

        } catch (error) {
            console.error("Произошла ошибка:", error);
        }
    };

    return (
        <div className="contact-us">
            <h1>Связаться с нами!</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Имя:</label>
                <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)}
                       required/>

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                       required/>

                <label htmlFor="message">Сообщение:</label>
                <textarea id="message" name="message" value={message} onChange={(e) => setMessage(e.target.value)}
                          required></textarea>

                <button type="submit">👌</button>
            </form>
        </div>
    );
};

export default ContactUs;
