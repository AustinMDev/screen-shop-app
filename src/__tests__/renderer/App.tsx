import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import "./App.css";
import NewScreenForm from "./NewScreenForm";
import MainMenu from "./MainMenu";
import OrderSummary from "./OrderSummary";
import PDFDocument from "./PDFMake";

import configImg0 from '/assets/screenConfigImgs/screen-template-blank.png';

import configImg1 from '/assets/screenConfigImgs/screen-template-corners-angle.png';
import configImg2 from '/assets/screenConfigImgs/screen-template-corners-angle-pulltabs-springs.png';
import configImg3 from '/assets/screenConfigImgs/screen-template-corners-angle-pulltabs-springs-rod.png';
import configImg4 from '/assets/screenConfigImgs/screen-template-corners-angle-rod.png';
import configImg5 from '/assets/screenConfigImgs/screen-template-corners-angle-pulltabs-springs-narrow.png';

import configImg6 from '/assets/screenConfigImgs/screen-template-corners-box.png';
import configImg7 from '/assets/screenConfigImgs/screen-template-corners-box-pulltabs-springs.png';
import configImg8 from '/assets/screenConfigImgs/screen-template-corners-box-pulltabs-springs-rod.png';
import configImg9 from '/assets/screenConfigImgs/screen-template-corners-box-rod.png';
import configImg10 from '/assets/screenConfigImgs/screen-template-corners-box-pulltabs-springs-narrow.png';

export default function App() {
  const [order, setOrder] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(null);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(null);
  const [highestId, setHighestId] = useState(0);
  const editMode = currentScreen !== null || currentScreenIndex !== null;
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [estimatedPickup, setEstimatedPickup] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [selectedScreenClip, setSelectedScreenClip] = useState("");
  const [screenClipNumber, setScreenClipNumber] = useState(0); 
  const [clipSpring, setClipSpring] = useState(0);
  const [spreaderBarClip, setSpreaderBarClip] = useState(0); 

  const [comment, setComment] = useState("");

  const configImages = [
    { id: 0, value: 'Blank - Custom', img: configImg0, filePath: '/assets/screenConfigImgs/screen-template-blank.png' },
    { id: 1, value: 'Angled - Blank', img: configImg1, filePath: '/assets/screenConfigImgs/screen-template-corners-angle.png' },
    { id: 2, value: 'Angled - Springs & Tabs', img: configImg2, filePath: '/assets/screenConfigImgs/screen-template-corners-angle-pulltabs-springs.png' },
    { id: 3, value: 'Angled - Springs, Tabs & Spreader Bar', img: configImg3, filePath: '/assets/screenConfigImgs/screen-template-corners-angle-pulltabs-springs-rod.png' },
    { id: 4, value: 'Angled - Blank & Spreader Bar', img: configImg4, filePath: '/assets/screenConfigImgs/screen-template-corners-angle-rod.png' },
    { id: 5, value: 'Angled - Narrow - Springs & Tabs', img: configImg5, filePath: '/assets/screenConfigImgs/screen-template-corners-angle-pulltabs-springs-narrow.png' },
    { id: 6, value: 'Squared - Blank', img: configImg6, filePath: '/assets/screenConfigImgs/screen-template-corners-box.png' },
    { id: 7, value: 'Squared - Springs & Tabs', img: configImg7, filePath: '/assets/screenConfigImgs/screen-template-corners-box-pulltabs-springs.png' },
    { id: 8, value: 'Squared - Springs, Tabs & Spreader Bar', img: configImg8, filePath: '/assets/screenConfigImgs/screen-template-corners-box-pulltabs-springs-rod.png' },
    { id: 9, value: 'Squared - Blank & Spreader Bar', img: configImg9, filePath: '/assets/screenConfigImgs/screen-template-corners-box-rod.png' },
    { id: 10, value: 'Squared - Narrow - Springs & Tabs', img: configImg10, filePath: '/assets/screenConfigImgs/screen-template-corners-box-pulltabs-springs-narrow.png' },
    ];

  const editScreen = (index) => {
    setCurrentScreen(order[index]);
    setCurrentScreenIndex(index);
  };  

  const deleteScreen = (index) => {
    setOrder(prevOrder => {
      const updatedOrder = prevOrder.filter((_, i) => i !== index);
      const reIndexedOrder = updatedOrder.map((screen, i) => {
        return { ...screen, id: i + 1 };
      });
      setHighestId(reIndexedOrder.length);
      return reIndexedOrder;
    });
  };
  

  const addScreenToOrder = (screen) => {
    if (currentScreenIndex !== null) {
        setOrder(prevOrder => prevOrder.map((s, i) => i === currentScreenIndex ? screen : s));
        setCurrentScreen(null);
        setCurrentScreenIndex(null);
    } else {
        setOrder(prevOrder => [...prevOrder, screen]);
        setHighestId(screen.id);
    }
  };

  const clearOrder = () => {
    setOrder([]);
    setHighestId(0);
    setCustomerName("");
    setCustomerPhone("");
    setEstimatedPickup("");
    setEmployeeName("");
    setSelectedScreenClip("");
    setScreenClipNumber(0);
    setClipSpring(0);
    setSpreaderBarClip(0);
    setComment("");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route
          path="/NewScreenForm"
          element={
            <NewScreenForm
              addScreenToOrder={addScreenToOrder}
              currentScreen={currentScreen}
              nextScreenNumber={highestId + 1}
              configImages={configImages}
              editMode={editMode}
              clearOrder={clearOrder} 
            />
          }/>
        <Route
            path="/OrderSummary"
            element={
              <OrderSummary
                order={order}
                editScreen={editScreen}
                deleteScreen={deleteScreen}
                configImages={configImages}
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                estimatedPickup={estimatedPickup}
                setEstimatedPickup={setEstimatedPickup}
                employeeName={employeeName}
                setEmployeeName={setEmployeeName}
                selectedScreenClip={selectedScreenClip}
                setSelectedScreenClip={setSelectedScreenClip}
                screenClipNumber={screenClipNumber}
                setScreenClipNumber={setScreenClipNumber}
                clipSpring={clipSpring}
                setClipSpring={setClipSpring}
                spreaderBarClip={spreaderBarClip}
                setSpreaderBarClip={setSpreaderBarClip}
                comment={comment}
                setComment={setComment}
              />
            }
          />
        <Route path="/PDFMake" element={<PDFDocument order={order} />} />
      </Routes>
    </Router>
  );
}
