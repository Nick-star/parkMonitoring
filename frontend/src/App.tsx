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
import Logout from './components/Logout';
import { AuthContext } from './components/AuthContext';
import CreateUser from './components/CreateUser';
import CompanyParkings from './components/CompanyParkings';


const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        console.log('isAuthenticated changed:', isAuthenticated);
    }, [isAuthenticated]);

    return (
         <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <Router>
            <div className="App">
                <nav>
                    <Link to="/"><Logo className="App-logo"/></Link>
                    <Link to="/parkings">Парковки</Link>
                    <Link to="/contactus">Связаться с нами</Link>
                    {isAuthenticated ? (
                        <>
                        <Link to="/profile">Профиль</Link>
                        <Link to="/logout">Выйти</Link>
                        </>
                        ) : (
                        <Link to="/login">Войти</Link>
                        )}
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
                    <Route path="/logout" element={<Logout/>}/>
                    <Route path="/create-user" element={<CreateUser />} />
                    <Route path="/company-parkings" element={<CompanyParkings />} />
                </Routes>
            </div>
        </Router>
             </AuthContext.Provider>
    );
}

export default App;
