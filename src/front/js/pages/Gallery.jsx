import React from "react";
import littleexplorers from "../../img/little-explorers.jpg";
import dancing from "../../img/dancing.jpg";
import Scientists from "../../img/LittleScientist.jpg";
import kids3C from "../../img/kids3C.png";
import galleryback from "../../img/gallery-back.jpg";

const Gallery = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${galleryback})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
 >
      <div
  style={{
    textAlign: "center",
    padding: "20px 0",
    fontFamily: "'Fredoka', sans-serif",
    marginBottom: "40px",
    width: "90%",
    maxWidth: "800px",
  }}
>
  <h2
    style={{
      fontSize: "2.5rem",
      fontWeight: "800",
      margin: 0,
      color: "#FFC909",
      display: "inline-block",
      backgroundColor: "#9C29B2",
      padding: "5px 10px",
      borderRadius: "8px",
    }}
  >
    Gallery
  </h2>
</div>

      {/* Galería */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "30px",
          width: "90%",
          maxWidth: "1500px",
        }}
      >

        <div
          style={{
            width: "100%",
            height: "350px",
            backgroundColor: "#000",
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-10px",
              transform: "translateY(-50%)",
              width: "10px",
              height: "40px",
              backgroundColor: "#000",
              borderRadius: "50%",
              boxShadow: "inset 0 0 4px rgba(255, 255, 255, 0.5)",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "-10px",
              transform: "translateY(-50%)",
              width: "10px",
              height: "40px",
              backgroundColor: "#000",
              borderRadius: "50%",
              boxShadow: "inset 0 0 4px rgba(255, 255, 255, 0.5)",
            }}
          ></div>
          <img
            src={littleexplorers}
            alt="Little Explorers"
            style={{
              width: "calc(100% - 40px)",
              height: "100%",
              margin: "0 20px",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          style={{
            width: "100%",
            height: "350px",
            backgroundColor: "#000",
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-10px",
              transform: "translateY(-50%)",
              width: "10px",
              height: "40px",
              backgroundColor: "#000",
              borderRadius: "50%",
              boxShadow: "inset 0 0 4px rgba(255, 255, 255, 0.5)",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "-10px",
              transform: "translateY(-50%)",
              width: "10px",
              height: "40px",
              backgroundColor: "#000",
              borderRadius: "50%",
              boxShadow: "inset 0 0 4px rgba(255, 255, 255, 0.5)",
            }}
          ></div>
          <img
            src={dancing}
            alt="Dancing"
            style={{
              width: "calc(100% - 40px)",
              height: "100%",
              margin: "0 20px",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          style={{
            width: "100%",
            height: "350px",
            backgroundColor: "#000",
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-10px",
              transform: "translateY(-50%)",
              width: "10px",
              height: "40px",
              backgroundColor: "#000",
              borderRadius: "50%",
              boxShadow: "inset 0 0 4px rgba(255, 255, 255, 0.5)",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "-10px",
              transform: "translateY(-50%)",
              width: "10px",
              height: "40px",
              backgroundColor: "#000",
              borderRadius: "50%",
              boxShadow: "inset 0 0 4px rgba(255, 255, 255, 0.5)",
            }}
          ></div>
          <img
            src={Scientists}
            alt="Little Scientists"
            style={{
              width: "calc(100% - 40px)",
              height: "100%",
              margin: "0 20px",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          style={{
            width: "100%",
            height: "350px",
            backgroundColor: "#000",
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-10px",
              transform: "translateY(-50%)",
              width: "10px",
              height: "40px",
              backgroundColor: "#000",
              borderRadius: "50%",
              boxShadow: "inset 0 0 4px rgba(255, 255, 255, 0.5)",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "-10px",
              transform: "translateY(-50%)",
              width: "10px",
              height: "40px",
              backgroundColor: "#000",
              borderRadius: "50%",
              boxShadow: "inset 0 0 4px rgba(255, 255, 255, 0.5)",
            }}
          ></div>
          <img
            src={kids3C}
            alt="Kids Activity"
            style={{
              width: "calc(100% - 40px)",
              height: "100%",
              margin: "0 20px",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
