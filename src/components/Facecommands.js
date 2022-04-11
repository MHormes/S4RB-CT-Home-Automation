import styles from "./Facecommands.module.css";
import React from 'react';
import face from '../img/face.png'; 

console.log(face); 

function Facecommands() {
  // Import result is the URL of your image
  return <img src={face} alt="Logo" />;
  
}

export default Facecommands;