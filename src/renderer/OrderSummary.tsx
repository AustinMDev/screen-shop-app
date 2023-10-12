  import { useNavigate } from 'react-router-dom';
  import { generatePDF } from './PDFGenerator';
  import Button from "./Button";
  import TextField from "./TextField";
  import DropdownInput from "./DropdownText";
  import ConfigDropdown from "./ConfigDropdown";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
  import config from '../../config/config.json';
  import NumberField from "./NumberField";

  const OrderSummary = ({
  order,
  editScreen,
  deleteScreen,
  configImages,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  estimatedPickup,
  setEstimatedPickup,
  employeeName,
  setEmployeeName,
  selectedScreenClip,
  setSelectedScreenClip,
  screenClipNumber,
  setScreenClipNumber,
  clipSpring,
  setClipSpring,
  spreaderBarClips,
  comment,
  setComment,
  }) => {

  const navigate = useNavigate();

  const handleOrder = () => {
    navigate('/NewScreenForm');
  };

  const handlePrint = () => {
  const orderDetails = generateOrderDetails();

  const selectedClip = config.additionalPrices.screenClips.find(clip => clip.label === selectedScreenClip);
  const clipExtendedPrice = selectedClip ? (selectedClip.price * screenClipNumber) : 0;

  // Create a screen clip order object
  const screenClipOrder = [];
    if (selectedClip && screenClipNumber > 0) {
        screenClipOrder.push({
            sku: selectedClip.sku,
            qty: screenClipNumber,
            description: selectedClip.description,
            unitPrice: selectedClip.price,
            extendedPrice: clipExtendedPrice
        });
  }

  // Create a clip spring order object
  const clipSpringOrder = config.additionalPrices.clipSprings
    .filter(item => clipSpring > 0)
    .map(item => ({
      sku: item.sku,
      qty: clipSpring,
      description: item.description,
      unitPrice: item.price,
      extendedPrice: item.price * clipSpring
    }));

  // Create a spreader bar clip order object
  const spreaderBarClipOrder = config.additionalPrices.spreaderBarClip
    .filter(item => spreaderBarClips > 0)
    .map(item => ({
      sku: item.sku,
      qty: spreaderBarClips,
      description: item.description,
      unitPrice: item.price,
      extendedPrice: item.price * spreaderBarClips
    }));

  // Combine all orders into one array
  const pricingOrdersForPdf = [
    ...screenClipOrder,
    ...clipSpringOrder,
    ...spreaderBarClipOrder
  ].map(order => ({
    sku: order.sku || '',
    qty: order.qty || '',
    description: order.description || 'Screen Kit',
    unitPrice: order.unitPrice || order.price || '',
    extendedPrice: (order.unitPrice * order.qty) || (order.price * order.qty) || ''
  }));

    generatePDF(order, orderDetails, customerName, customerPhone, estimatedPickup, employeeName, comment, pricingOrdersForPdf);
  }

  const dropdownStyle = {
    control: (base) => ({
      ...base,
      width: 'auto', 
      height: '30px',
      color: 'black', 
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? 'skyblue'
        : isFocused
        ? 'lightgray'
        : null,
      color: 'black', // Change color of dropdown options
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black' // Change color of selected value
    })
  };

  const generateOrderDetails = () => {
    return order.map(screen => {
      const { sku, sizeSKU } = generateSKU(screen);
      console.log(screen.frameType);
      const frameTypeCategory = frameTypeIsBox(screen.frameType) ? "Box" : "Lip";
      console.log(frameTypeCategory);
      const price = config.sizePrices[frameTypeCategory][sizeSKU];

      return {
        sku,
        price,
        qty: screen.quantity
      };
    });
  };

  const frameTypeIsBox = (frameType) => {
      return frameType.includes("Box");
  };

  
  const generateSKU = (order) => {
    const { frameColor, splineType, frameType, width, height } = order;
    const totalSize = parseInt(width) + parseInt(height);
    let sizeSKU;

    if (totalSize <= 48) sizeSKU = '48';
    else if (totalSize <= 72) sizeSKU = '72';
    else if (totalSize <= 108) sizeSKU = '108';
    else if (totalSize <= 132) sizeSKU = '132';
    else if (totalSize > 132) sizeSKU = '132';

    const colorSKU = config.elementSKUs.frameColor[frameColor] || '';
    const splineTypeSKU = config.elementSKUs.splineType[splineType] || '';
    const frameTypeSKU = config.elementSKUs.frameType[frameType] || '';

    const sku = colorSKU + splineTypeSKU + frameTypeSKU + sizeSKU;

    return { sku, sizeSKU };
  };

  return (
    <div>
      <div className="header">
        <h1>Order Summary:</h1>
      </div>
      <div className="app-container">
        <div className="header-info">
          <div className="header-text">
            <p style={{ marginRight: '10px' }}>Customer:</p>
            <TextField
              placeholder="Customer Name:"
              value={customerName}
              onChange={setCustomerName}
            />
          </div>
          <div className="header-text">
            <p style={{ marginRight: '10px' }}>PH#:</p>
            <TextField
              placeholder="Customer Phone #:"
              value={customerPhone}
              onChange={setCustomerPhone}
              numeric={true}
            />
          </div>
        </div>
        <div className="header-info">
          <div className="header-text">
            <p style={{ marginRight: '8.5px' }}>Employee:</p>
            <TextField
              placeholder="Employee Name:"
              value={employeeName}
              onChange={setEmployeeName}
            />
          </div>
          <div className="header-text">
            <p style={{ marginRight: '11px' }}>ETA:</p>
            <DropdownInput
              options={[
                "1 Week - 2 Weeks",
                "2 Weeks - 3 Weeks",
                "3 Weeks - 4 Weeks",
                "4+ Weeks",
              ]}
              placeholder="ETA:"
              value={estimatedPickup}
              onChange={(e) => setEstimatedPickup(e.target.value)}
            />
          </div>
        </div>
        <div className="order-summary">
          <div className="order-summary-content">
            {order.map((screen, index) => {
              // Find the corresponding config image
              const configImage = configImages.find(
                img => img.value === screen.config
              );
              return (
                <div key={index} className="order-item">
                  <div className="order-header">
                    <h2>Screen No. {index + 1}</h2>
                  </div>
                  <div className="order-text">
                    <p>Config: <span className="value">{screen.config}</span></p>
                    <p>Frame Color: <span className="value">{screen.frameColor}</span></p>
                    <p>Frame Type: <span className="value">{screen.frameType}</span></p>
                    <p>Height: <span className="value">{screen.height} - {screen.heightFraction}"</span></p>
                    <p>Width: <span className="value">{screen.width} - {screen.widthFraction}"</span></p>
                    <p>Screen Type: <span className="value">{screen.screenType}</span></p>
                    <p>Spline Type: <span className="value">{screen.splineType}</span></p>
                    <p>Quantity: <span className="value">{screen.quantity}</span></p>
                  </div>
                  <div className="order-img">
                    <img src={configImage ? configImage.img : null} alt="Screen Config" />
                  </div>
                  <div className="order-buttons">
                    <button onClick={() => {
                      editScreen(index);
                      navigate('/NewScreenForm');
                    }}>Edit</button>
                    <button onClick={() => deleteScreen(index)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="order-summary-footer">
          <div className="add-on-field">
              <label>Extras - </label>
          </div>
          <div className="add-on-field">
              <label>Screen Clips: </label>
              <ConfigDropdown
                      placeholder="Select Screen Clip"
                      value={selectedScreenClip}
                      onChange={(option) => setSelectedScreenClip(option)}
                      optionsData={config.additionalPrices.screenClips}
                      styles={dropdownStyle}
                />
              <NumberField
                value={screenClipNumber}
                onChange={(e) => setScreenClipNumber(e.target.value)}
              />
            </div>
            <div className="add-on-field">
              <label>Clip Springs: </label>
              <NumberField
                value={clipSpring}
                min={0}
                onChange={(e) => setClipSpring(e.target.value)}
              />
            </div>
            <div className="comment-box">
              <textarea
                rows="3"
                placeholder="Enter your comments here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="summary-buttons">
              <div className="button-container">
                <Button onClick={handleOrder} text="Previous" direction="left">
                  <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
                </Button>
              </div>
              <div className="button-container">
                <Button onClick={handlePrint} text="Print Order" direction="right">
                  <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '10px' }} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  export default OrderSummary;
