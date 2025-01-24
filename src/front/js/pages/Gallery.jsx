import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';
import littleexplorers from "../../img/little-explorers.jpg";
import dancing from "../../img/dancing.jpg";
import Scientists from "../../img/LittleScientist.jpg";
import galleryback from "../../img/gallery-back.jpg";


const Gallery = () => {
  return (
    <div>
      <div className="relative w-screen h-64 overflow-hidden">
        <img
          src={galleryback}
          alt="Header"
          className="w-screen h-full object-cover"
        />
      </div>
      <div className="bg-yellow-400 p-8 text-center">
        <div className="tw-relative tw-inline-block tw-py-4">
          <h2
            className="tw-text-4xl tw-font-extrabold tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-r tw-from-yellow-400 tw-to-red-500"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            <br />
            Gallery
          </h2>
          <div className="tw-absolute tw-left-1/2 tw-transform -tw-translate-x-1/2 tw-mt-2 tw-h-1 tw-w-3/4 tw-bg-gradient-to-r tw-from-red-500 tw-to-yellow-400 tw-rounded-full"></div>
        </div>
        <div
          className="flex flex-row justify-center gap-6 mt-6"
          style={{ flexWrap: "nowrap", overflowX: "auto" }}
        >
          <div className="flex-shrink-0 w-48 h-48 rounded-lg shadow-lg overflow-hidden">
            <img
              src={dancing}
              alt="Dancing"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-shrink-0 w-48 h-48 rounded-lg shadow-lg overflow-hidden">
            <img
              src={Scientists}
              alt="Scientists"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-shrink-0 w-48 h-48 rounded-lg shadow-lg overflow-hidden">
            <img
              src={littleexplorers}
              alt="Gallery Back"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;