import React from "react";
import {Link as LinkScroll} from 'react-scroll';
import {Link} from 'react-router-dom';
import "./GetStarted.scss";


const GetStarted: React.FC = () => {
    return (
        <div className="get-started">
            <div className="chapter1">
                <h2>Parklite</h2>
                <p>
                    Присоединяйтесь к нашей системе мониторинга свободных мест на
                    парковках, чтобы улучшить свои парковочные решения с помощью Parklite!
                </p>
                <div className="buttons">
                    <Link to="/contactus">
                    <button className="try-api">Связаться с нами</button>
                    </Link>
                    <LinkScroll
                        to="chapter2"
                        smooth={true}
                        duration={500}
                    >
                        <button className="learn-more">Узнать больше...</button>
                    </LinkScroll>
                </div>
                <img className="get_started_img" src={`${process.env.PUBLIC_URL}/getstarted.png`} alt="Get Started"/>
            </div>
            <div className="chapter2" id="chapter2">
                <div className="activity">
                    <h3>Безопасный API</h3>
                    <p>Безопасный</p>
                </div>

                <div className="activity">
                    <h3>Быстрый API</h3>
                    <p>Большие коэффициенты</p>
                </div>

                <div className="activity">
                    <h3>Небольшая цена</h3>
                    <p>5 рублей</p>
                </div>
                <div className="activity">
                    <h3>Стильный сайт</h3>
                    <p>Реально?</p>
                </div>
            </div>

        </div>
    );
};

export default GetStarted;
