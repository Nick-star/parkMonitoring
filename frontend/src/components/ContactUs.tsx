
import React from 'react';

const ContactUs = () => {
  return (
    <div>
      <h1>Связаться с нами!</h1>
      <p>Связаться для дальнейшего сотрудничества.</p>
      <form>
        <label htmlFor="name">Имя:</label>
        <input type="text" id="name" name="name" required />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <label htmlFor="message">Сообщение:</label>
        <textarea id="message" name="message" required></textarea>
        <button type="submit">👌</button>
      </form>
    </div>
  );
};

export default ContactUs;
