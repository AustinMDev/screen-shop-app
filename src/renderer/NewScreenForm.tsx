import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Dropdown from "./Dropdown";
import DropdownInput  from "./DropdownText";
import NumberField from "./NumberField";
import ScreenConfig from "./ScreenConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { elementSKUs, screenPricing, splinePricing, spreaderBarPricing, pullTabPricing, hawaiiTaxRate } from '../config';


function NewScreenForm( {addScreenToOrder, currentScreen, nextScreenNumber, configImages, editMode, clearOrder}) {

    const navigate = useNavigate();

    const frameColor = Object.keys(elementSKUs.frameColor).map((color, index) => ({id: index+1, value: color}));
    const frameType = Object.keys(elementSKUs.frameType).map((type, index) => ({id: index+1, value: type}));
    const splineType = Object.keys(elementSKUs.splineType).map((type, index) => ({id: index+1, value: type}));
    const screenType = screenPricing.map((type, index) => ({id: index+1, value: type.label}));
    const pullTabOptions = pullTabPricing.map((tab, index) => ({ id: index + 1, value: tab.label }));

    const initialFormState = currentScreen ? currentScreen : {
        height: '',
        heightFraction: '',
        width: '',
        widthFraction: '',
        frameColor: '',
        frameType: '',
        screenType: '',
        quantity: 1,
    };


    const [formState, setFormState] = useState(initialFormState);
    const [heightFraction, setHeightFraction] = useState(currentScreen ? currentScreen.heightFraction : '');
    const [widthFraction, setWidthFraction] = useState(currentScreen ? currentScreen.widthFraction : '');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [resetDropdowns, setResetDropdowns] = useState(0);
    const [orderIncomplete, setOrderIncomplete] = useState(false);
    const [screenNumber, setScreenNumber] = useState(nextScreenNumber);

    const [selectedConfig, setSelectedConfig] = useState(currentScreen ? currentScreen.config : 'Blank - Custom');
    const configObject = configImages ? configImages.find(obj => obj.value === selectedConfig) : null;

    const handleDropdownToggle = (id) => {
        setOpenDropdown(id === openDropdown ? null : id);
    };

    const handleMenu = () => {
        clearOrder();
        navigate('/');
    }

    const handleSummary = () => {
        navigate('/OrderSummary');
    }

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if all required fields are filled out
    if (
        !formState.height ||
        !formState.heightFraction ||
        !formState.width ||
        !formState.widthFraction ||
        !formState.frameColor ||
        !formState.frameType ||
        !formState.splineType ||
        !formState.screenType ||
        !formState.config
    ) {
        // Set orderIncomplete to true if a required field is not filled out
        setOrderIncomplete(true);
    } else {
        // If the selected config includes "Tabs", set the pullTab and pullTabQty fields
        const includesTabs = formState.config.includes('Tabs');
        let updatedFormState = { ...formState };

        if (includesTabs) {
            updatedFormState = {
                ...updatedFormState,
                pullTab: pullTabOptions[0].value, // Set a default value for pullTab
                pullTabQty: 2, // Default quantity for pullTab
            };
        } else {
            // If "Tabs" are not selected, remove pullTab and pullTabQty from the formState
            delete updatedFormState.pullTab;
            delete updatedFormState.pullTabQty;
        }

        // Additional processing based on the selected configuration can go here

        // If all conditions are met, proceed to add the screen to the order
        let spreaderBar = false;
        let springQty = 0;

        if (formState.config.includes('Spreader Bar')) {
            spreaderBar = true;
        }

        if (formState.config.includes('Springs')) {
            springQty = 2;
        }

        const newScreen = {
            ...updatedFormState,
            id: currentScreen ? currentScreen.id : screenNumber,
            configImg: formState.configImg,
            configFilePath: formState.configFilePath,
            spreaderBar: spreaderBar,
            springQty: springQty,
        };

        console.log(newScreen);
        addScreenToOrder(newScreen);
        setHeightFraction('');
        setWidthFraction('');
        setFormState(initialFormState);
        setResetDropdowns(resetDropdowns + 1);

        setOrderIncomplete(false);
        if (!currentScreen) {
            setScreenNumber(screenNumber + 1);
        }
    }
  };



    const handleModify = (event) => {
        event.preventDefault();

        const modifiedScreen = {
            ...formState,
            id: currentScreen ? currentScreen.id : screenNumber,
            configImg: formState.configImg,
            configFilePath: formState.configFilePath
        };

        let updatedQty = 2;

        if (formState.config.includes('Tabs') && formState.config.includes('Narrow')) {
            updatedQty = 1;
        }

        if (formState.config.includes('Tabs')) {
            // If 'Tabs' are selected, update the pullTab field
            modifiedScreen.pullTab = formState.pullTab;
            modifiedScreen.pullTabQty = updatedQty;
        } else {
            // If 'Tabs' are not selected, remove the pullTab field and set pullTabQty to 0
            modifiedScreen.pullTab = '';
            modifiedScreen.pullTabQty = 0;
        }

        if (formState.config.includes('Spreader Bar')) {
            modifiedScreen.spreaderBarQty = true;
        } else {
            modifiedScreen.spreaderBarQty = false;
        }

        if (formState.config.includes('Springs')) {
            modifiedScreen.springQty = 2;
        } else {
            modifiedScreen.springQty = 0;
        }

        console.log(modifiedScreen);
        addScreenToOrder(modifiedScreen);
        setHeightFraction('');
        setWidthFraction('');
        setFormState(initialFormState);
        setResetDropdowns(resetDropdowns + 1);

        setOrderIncomplete(false);

        // Navigate back to the summary page after modifying the screen
        navigate('/OrderSummary');
    };


    function Button({ text, onClick, children, direction }) {
        return (
          <button onClick={onClick}>
            {direction === 'right' ? (
              <>
                {text}
                {children}
              </>
            ) : (
              <>
                {children}
                {text}
              </>
            )}
          </button>
        );
      }

  return (
    <div>
        <div className="header">
            <h1>Enter Screen Information:</h1>
            <h1>Screen No. {currentScreen ? currentScreen.id : screenNumber}</h1>
        </div>
        <div className="screen-img">
        {configObject && <ScreenConfig config={configObject} />}
        </div>
        <div className="app-container">
            {orderIncomplete && <div className="error-message">Order item incomplete - please fill out all fields.</div>}
            <div className="field-container-dimensions">
                <h2 className="text-container">Width: </h2>
                <div className="text-field-width">
                    <NumberField placeholder="Inches"
                        step={1}
                        value={(formState.width || 0)}
                        min={1}
                        onChange={e => setFormState(prev => ({...prev, width: e.target.value}))}/>
                    <DropdownInput
                        options={['1/16', '1/8', '3/16', '1/4', '5/16', '3/8', '7/16', '1/2', '9/16', '5/8', '11/16', '3/4', '13/16', '7/8', '15/16']}
                        placeholder="Fraction"
                        value={widthFraction}
                        onChange={e => {
                            setWidthFraction(e.target.value);
                            setFormState(prev => ({...prev, widthFraction: e.target.value}));
                        }}
                    />
                </div>
            </div>
            <div className="field-container-dimensions">
                <h2 className="text-container">Height: </h2>
                <div className="text-field-height">
                    <NumberField placeholder="Inches"
                        step={1}
                        value={(formState.height || 0)}
                        min={1}
                        onChange={e => setFormState(prev => ({...prev, height: e.target.value}))}
                    />
                    <DropdownInput
                        options={['1/16', '1/8', '3/16', '1/4', '5/16', '3/8', '7/16', '1/2', '9/16', '5/8', '11/16', '3/4', '13/16', '7/8', '15/16']}
                        placeholder="Fraction"
                        value={heightFraction}
                        onChange={e => {
                            setHeightFraction(e.target.value);
                            setFormState(prev => ({...prev, heightFraction: e.target.value}));
                        }}
                    />
                </div>
            </div>
            <div className="field-container">
                <h2 className="text-container">Screen Config: </h2>
                <div className="dd-container">
                    <Dropdown
                        reset={resetDropdowns}
                        id={5}
                        onToggle={handleDropdownToggle}
                        isOpen={openDropdown === 5}
                        items={configImages}
                        title={formState.config || "Screen Config"}
                        onSelect={(item) => {
                            setSelectedConfig(item.value);
                            setFormState(prev => ({...prev,
                                config: item.value,
                                configImg: item.img,
                                configFilePath: item.filePath
                               }));
                        }}
                    />
                </div>
            </div>
            <div className="field-container">
                <h2 className="text-container">Screen Type: </h2>
                <div className="dd-container">
                    <Dropdown
                        reset={resetDropdowns}
                        id={4}
                        onToggle={handleDropdownToggle}
                        isOpen={openDropdown === 4}
                        items={screenType}
                        title={formState.screenType || "Screen Type"}
                        onSelect={(item) => setFormState(prev => ({...prev, screenType: item.value}))}
                    />
                </div>
            </div>
            <div className="field-container">
                <h2 className="text-container">Frame Color: </h2>
                <div className="dd-container">
                    <Dropdown
                        reset={resetDropdowns}
                        id={1}
                        onToggle={handleDropdownToggle}
                        isOpen={openDropdown === 1}
                        items={frameColor}
                        title={formState.frameColor || "Frame Color"}
                        onSelect={(item) => setFormState(prev => ({...prev, frameColor: item.value}))}
                    />
                </div>
            </div>
            <div className="field-container">
                <h2 className="text-container">Frame Type: </h2>
                <div className="dd-container">
                <Dropdown
                    reset={resetDropdowns}
                    id={2}
                    onToggle={handleDropdownToggle}
                    isOpen={openDropdown === 2}
                    items={frameType}
                    title={formState.frameType || 'Frame Type'}
                    onSelect={(item) => setFormState(prev => ({...prev, frameType: item.value}))}
                    />
                </div>
            </div>
            <div className="field-container">
                <h2 className="text-container">Spline Type: </h2>
                <div className="dd-container">
                <Dropdown
                    reset={resetDropdowns}
                    id={3}
                    onToggle={handleDropdownToggle}
                    isOpen={openDropdown === 3}
                    items={splineType}
                    title={formState.splineType || 'Spline Type'}
                    onSelect={(item) => setFormState(prev => ({ ...prev, splineType: item.value }))}
                />
                </div>
            </div>
            {selectedConfig.includes('Tabs') && (
                <div className="field-container">
                    <h2 className="text-container">Pull Tab Type: </h2>
                    <div className="dd-container">
                        <Dropdown
                            reset={resetDropdowns}
                            id={6}
                            onToggle={handleDropdownToggle}
                            isOpen={openDropdown === 6}
                            items={pullTabOptions}
                            title={formState.pullTab || "Pull Tab Type"}
                            onSelect={(item) => {
                                let updatedQty = 2;

                                if (selectedConfig.includes('Narrow')) {
                                  updatedQty = 1;
                                }

                                setFormState(prev => ({
                                  ...prev,
                                  pullTab: item.value,
                                  pullTabQty: updatedQty,
                                }));
                              }}
                        />
                    </div>
                </div>
            )}
            <div className="field-container">
                <div className="number-field-container">
                    <h2 className="text-container">Quantity: </h2>
                    <div className="number-field">
                        <NumberField
                            defaultValue={1}
                            step={1}
                            value={formState.quantity || 0}
                            onChange={e => setFormState(prev => ({...prev, quantity: e.target.value}))}
                            />
                    </div>
                </div>
                <form onSubmit={editMode ? handleModify : handleSubmit}>
                    <div className="add-order">
                        <Button  type="submit" text={editMode ? "Modify" : "Add to Order"}  />
                    </div>
                </form>
            </div>
            <div className="field-container">
                <div className="button-container">
                    <Button onClick={ handleMenu } text="Cancel Order" direction="left">
                        <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
                    </Button>
                </div>
                <div className="button-container" >
                <Button onClick={() => handleSummary()} text="Order Summary" direction="right">
                        <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '10px' }} />
                    </Button>
                </div>
            </div>
        </div>
    </div>
    );
}


export default NewScreenForm;
