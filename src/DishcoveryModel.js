// src/DishcoveryModal.js
import React from "react";
import "./styles/DishcoveryModal.css";

const DishcoveryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="dishcovery-backdrop">
      <div className="dishcovery-modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <iframe
          src="https://copilotstudio.microsoft.com/environments/Default-5e022ca1-5c04-4f87-8db7-d588726274e3/bots/cr932_dishcovery/webchat?__version__=2"
          frameBorder="0"
          title="Dishcovery AI"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default DishcoveryModal;
