import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import passwordData from "../../config/pwd.json";
import configData from "../../config/config.json";


const ConfigMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState({
    ...configData.additionalPrices,
    sizePrices: configData.sizePrices,
    elementSKUs: configData.elementSKUs, 
    sizeLabels: configData.sizeLabels,
  });

  const navigate = useNavigate();

  const checkPassword = () => {
    if (password === passwordData.pwd) {
      setIsLoggedIn(true);
    }
  };

  const handleInputChange = (section, index, key, value) => {
    const updatedData = { ...data };
  
    let parsedValue;
  
    // Check if the key relates to a number input (like rate or price)
    if (key === "rate" || key === "price") {
      let regexPattern = /^\d+(\.\d{1,2})?$/;
  
      // Allow up to 3 decimal places for 'rate'
      if (key === "rate") {
        regexPattern = /^\d+(\.\d{1,3})?$/;
      }
  
      // If input is not empty and does not match regex, exit early
      if (value !== "" && !regexPattern.test(value)) {
        console.error("Invalid input");
        return;
      }
  
      // Parse numerical input and adjust if it's a 'rate' (percentage)
      parsedValue = value === "" ? "" : parseFloat(value);
      if (key === "rate" && value !== "") {
        parsedValue = parsedValue / 100;
      }
    } else {
      // For non-numerical input, use the value directly
      parsedValue = value;
    }
  
    // Update logic
    if (index !== null && index !== undefined) {
      if (!updatedData[section][index]) {
        updatedData[section][index] = {};
      }
      updatedData[section][index][key] = parsedValue;
    } else {
      updatedData[section][key] = parsedValue;
    }
  
    // Validate and set the data
    if (typeof parsedValue === "number" && isNaN(parsedValue)) {
      console.error("Invalid number entered", value);
      return;
    }
  
    setData(updatedData);
  };
  

  const addNewItem = (section) => {
    const updatedData = { ...data };

    const keys = Object.keys(updatedData[section][0]);
    const blankItem = keys.reduce((obj, key) => ({ ...obj, [key]: ""}), {});

    updatedData[section].unshift(blankItem);

    setData(updatedData);
  };

  const handlePrevious = () => {
    navigate('/');
  };

  const handleSaveChanges = () => {
    // Sending data to the main process via IPC
    console.log(data);
    window.electron.ipcRenderer.sendMessage('save-changes', data);
    window.electron.ipcRenderer.once('save-changes-reply', (_event, message) => {
      console.log(message); // Should log 'Data saved successfully'
    });
  };
  

  const toProperGrammar = (str) => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (char) => char.toUpperCase()) 
      .trim();
  };

  return (
    <div>
      <div className="config-page-header">
        <h3>Pricing Config</h3>
        <div className="config-page-header-buttons">
          <button onClick={handlePrevious}>Previous</button>
          <button onClick={handleSaveChanges}>Save Changes</button>
        </div>
      </div>
      {isLoggedIn ? (
        <div className="config-container" style={{ overflowY: 'scroll', height: '80%' }}>
          {Object.keys(data).filter((section) => section !== "elementSKUs" && section !== "sizeLabels")
            .map((section, index) => (
            <div className="config-sections" key={index}>
              <div className="config-header">
                <h3>{toProperGrammar(section)} </h3>
                {section !== "hawaiiTaxRate" && section !== "elementSKUs" && section !== "sizeLabels" &&
                section !== "sizePrices" && <button onClick={() => addNewItem(section)}>Add Item</button>}
              </div>
              {section !== "elementSKUs" && section !== "sizeLabels" ? (
                Array.isArray(data[section]) ? (
                  data[section].map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <div className="config-element">
                        <div className="config-element-header">
                          <h4>{item.label}</h4>
                        </div>
                        {Object.keys(item).map((field, fieldIndex) => (
                          <div className="config-field-element" key={fieldIndex}>
                            <label>{field}:</label>
                            <input
                              type={
                                field === "sku" ? "number" :
                                field === "price" ? "number" :
                                field === "description" ? "text" :
                                field === "rate" ? "number" : "text"
                              }
                              value={item[field]}
                              onChange={(e) => handleInputChange(section, itemIndex, field, e.target.value)}
                            />
                          </div>
                        ))}
                        <button>Delete</button>
                      </div>
                    </div>
                  ))
                ) : section === 'additionalPrices' || section === 'sizePrices' ? (
                  Object.keys(data[section]).map(subSection => (
                    <div>
                      <div className="config-element">
                        <div className="config-element-header">
                          <h4>{subSection}</h4>
                        </div>
                        {Array.isArray(data[section][subSection]) ?
                          data[section][subSection].map((item, itemIndex) => (
                            <div key={itemIndex}>
                              {Object.keys(item).map((field, fieldIndex) => (
                                <div className="config-field-element" key={fieldIndex}>
                                  <label>{field}:</label>
                                  <input
                                    type={
                                      field === "sku" ? "number" :
                                      field === "price" ? "number" :
                                      field === "description" ? "text" :
                                      field === "rate" ? "number" : "text"
                                    }
                                    value={item[field]}
                                    onChange={(e) => handleInputChange(section, subSection, itemIndex, field, e.target.value)}
                                  />
                                </div>
                              ))}
                              <button>Delete</button>
                            </div>              
                          )) :
                          Object.keys(data[section][subSection]).map((item, itemIndex) => (
                            <div className="config-field-element" key={itemIndex}>
                              <label>{item}:</label>
                              <input 
                                type="number"
                                value={data[section][subSection][item]}
                                onChange={(e) => handleInputChange(section, subSection, item, e.target.value)}
                              />
                            </div>  
                          ))
                        }
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    {Object.keys(data[section]).map((key, keyIndex) => (
                      <div className="config-element" key={keyIndex}>
                        <div className="config-element-header">
                          <h4 style={{ textTransform: 'capitalize' }}>{key}</h4>
                        </div>
                        <div className="config-field-element">
                        <label>%</label>
                        <input
                          type={key === "rate" ? "number" : "text"}
                          value={
                            key === "rate"
                              ? data[section][key] === ""
                                ? ""
                                : data[section][key] * 100
                              : data[section][key]
                          }
                          onChange={(e) => handleInputChange(section, null, key, e.target.value)}
                        />
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : null }
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <div className="login-container">
            <input style={{height: '30px'}} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={checkPassword}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigMenu;
