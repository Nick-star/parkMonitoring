import React from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import GetStarted from './components/GetStarted';
import Parkings from './components/Parkings';
import ParkingPage from './components/ParkingPage';
import CompanyPage from './components/CompanyPage';
import ContactUs from './components/ContactUs';
import {ReactComponent as Logo} from "./logo.svg";
import './App.scss'

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <nav>
                    <Link to="/"><Logo className="App-logo"/></Link>
                    <Link to="/parkings">Парковки</Link>
                    <Link to="/contactus">Связаться с нами</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<GetStarted/>}/>
                    <Route path="/parkings" element={<Parkings/>}/>
                    <Route path="/parking/:id" element={<ParkingPage/>}/>
                    <Route path="/contactus" element={<ContactUs/>}/>
                    <Route path="*" element={<h1>Not Found</h1>}/>
                    <Route path="/companies/:id" element={<CompanyPage/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
