import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import "./CompanyPage.scss"

interface Company {
    name: string;
    description: string;
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CompanyPage: React.FC = () => {
    const {id} = useParams();
    const [company, setCompany] = useState<Company | null>(null);
    useEffect(() => {
        fetch(`${BASE_URL}/companies/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setCompany(data);
            });
    }, [id]);

    if (!company) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{company.name}</h1>
            <p>{company.description}</p>
        </div>
    );
};

export default CompanyPage;
