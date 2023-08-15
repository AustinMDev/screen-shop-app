import React from "react";
import Button from "./Button";
import { useNavigate } from 'react-router-dom';

import imageSrc from '/assets/menuImg/screen-menu-img.jpg';

const MainMenu: React.FC = () => {
    const navigate = useNavigate();

    const handleNewScreen = () => {
        navigate('/NewScreenForm');
    };
    
    const handleReScreening = () => {
        // Here you can navigate to the re-screening page, or do any other setup required
    };

    return (
        <div>
            <div className="header">
                <h1>Screen Shop Order Generator:</h1>
            </div>
            <div className="menu-img">
                <img src={imageSrc} alt="Main menu image" />
            </div>
            <div className="app-container">
                <div className="menu">
                    <div className="new-screen-menu">
                        <Button onClick={handleNewScreen} text="New Screen"/>
                        <h2>- test</h2>
                    </div>
                    <div className="rescreening-menu">
                        <Button onClick={handleReScreening} text="Re-Screening"/>
                        <h2>- test</h2>
                    </div>
                    <div className="pdf-document">
                        <Button onClick={() => navigate('/PDFMake')} text="PDF Document"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;
