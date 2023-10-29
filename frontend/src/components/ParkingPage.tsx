import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import './ParkingPage.scss';

function ParkingPage() {
    const {id} = useParams();
    const [parking, setParking] = useState<ParkingType | null>(null);
    const [company, setCompany] = useState<CompanyType | null>(null);
    const [images, setImages] = useState<ImageType[] | null>(null);
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    type ImageType = {
        id: number;
        image: string;
    };

    type ParkingType = {
        id: number;
        name: string;
        address: string;
        total_spaces: number;
        free_spaces: number;
        is_paid: boolean;
        price: number;
        company_id: number;
    };

    type CompanyType = {
        id: number;
        name: string;
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${BASE_URL}/parkings/${id}`);
                const data = await response.json();
                setParking(data);
            } catch (error) {
                console.error("Ошибка при загрузке данных о парковке:", error);
            }
        }

        fetchData();
    }, [id]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${BASE_URL}/parkings/${id}/company`);
                const data = await response.json();
                setCompany(data);
            } catch (error) {
                console.error("Ошибка при загрузке данных о компании:", error);
            }
        }


        fetchData();
    }, [id]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${BASE_URL}/parkings/${id}/images`);
                const data = await response.json();
                setImages(data);
            } catch (error) {
                console.error("Ошибка при загрузке изображений парковки:", error);
            }
        }

        fetchData();
    }, [id]);


    // Если данные еще не загружены, покажите индикатор загрузки
    if (!parking || !company) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="parking-page">
            <div className="parking-page__images">
                {images && images.map((image) => (
                    <img key={image.id} src={`${BASE_URL}/${image.image}`} alt={parking.name}/>
                ))}
            </div>
            <h2>{parking.name}</h2>
            <p>Адрес: {parking.address}</p>
            <p>Свободных мест: {parking.total_spaces - parking.free_spaces}/{parking.total_spaces}</p>
            <p>Компания: <Link to={`/companies/${company.id}`}>{company.name}</Link></p>
            <p>Стоимость: {parking.is_paid ? parking.price : <span style={{color: 'green'}}>Бесплатно</span>}</p>
        </div>
    );
}

export default ParkingPage;
