import React from 'react';

function ScreenConfig({ config, screenWidth, screenHeight }) {
  // Here you can use screenWidth and screenHeight as strings with fractions
  // For example, if you want to display them in the component:

  return (
    <div>
      <img src={config.img} alt={config.value} />
    </div>
  );
}
  
  export default ScreenConfig;
  
  