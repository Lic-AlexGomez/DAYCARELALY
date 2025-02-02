import React,{useContext} from "react";
import '../../styles/Gallery.css'
import { Context } from "../store/appContext";
import { useEffect } from "react";

  const Gallery = () => {
    const { actions, store } = useContext(Context);
    useEffect(()=>{
      actions.fetchGallery()
    },[])
  return (
    
    <div className="  tw-bg-[#FFC909] tw-pb-[350px] ">
      <h1 className="tw-text-center tw-text-3xl tw-font-black tw-pt-20 ">Gallery</h1>
      <div className="card-container tw-mt-20 ">
        {store.gallery.map((gallery) => (
      <div key={gallery.id} className="card tw-pb-20">
        <div className="card-overlay"></div>
        <div className="card-inner"><img src={gallery.image} alt="" /></div>
      </div>
       ))}
    </div>
      </div>
      
    
    
  );
};

export default Gallery;