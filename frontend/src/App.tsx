import React from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import GetStarted from './components/GetStarted';
import Parkings from './components/Parkings';
import ParkingPage from './components/ParkingPage';
import CompanyPage from './components/CompanyPage';
import ContactUs from './components/ContactUs';
import {ReactComponent as Logo} from "./logo.svg";
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.scss'
import Error404 from './components/Error404';
import Login from './components/Login';
import Profile from './components/Profile';

const App: React.FC = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/token/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }, []);
    return (
        <Router>
            <div className="App">
                <nav>
                    <Link to="/"><Logo className="App-logo"/></Link>
                    <Link to="/parkings">Парковки</Link>
                    <Link to="/contactus">Связаться с нами</Link>
                    <div>
                    {user ? (
                        <div>
                        <Link to="/profile">Профиль</Link>
                        <Link to="/logout">Выйти</Link>
                        </div>
                    ) : (
                        <Link to="/login">Войти</Link>
                    )}
        </div>
                </nav>
                <Routes>
                    <Route path="/" element={<GetStarted/>}/>
                    <Route path="/parkings" element={<Parkings/>}/>
                    <Route path="/parking/:id" element={<ParkingPage/>}/>
                    <Route path="/contactus" element={<ContactUs/>}/>
                    <Route path="/companies/:id" element={<CompanyPage/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="*" element={<Error404/>}/>
                    <Route path="/logout" element={<div>Logout</div>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
