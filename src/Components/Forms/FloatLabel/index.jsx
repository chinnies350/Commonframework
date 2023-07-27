import React, { useEffect, useState } from "react";

import "./index.css";

const FloatLabel = props => {
  const [focus, setFocus] = useState(false);
  const { children, label, value, isOnChange } = props;
  
  const labelClass =
    focus || (value && value.length !== 0) || isOnChange? "label label-float" : "label"  ;

  return (
    <div 
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {children}
      <label className={labelClass}>{label}</label>
    </div>
  );
};

export default FloatLabel;
