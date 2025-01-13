import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/Classes.css";

const Classes = () => {
    const { store, actions } = useContext(Context);
    const [visibleClasses, setVisibleClasses] = useState(8);
    useEffect(() => {
        if (store.classes.length === 0) {
            actions.fetchClasses();
          }
        }, [store.classes.length]);
        const handleShowMore = () => {
            setVisibleClasses((prev) => prev + 4);
        };

        return (
            <div className="classes-container">
              <h2 className="classes-title">Take The Classes & Start Learning From Today</h2>
              <div className="classes-grid">
                {store.classes.slice(0, visibleClasses).map((classItem) => (
                  <div key={classItem.id} className="class-card">
                    <img
                      src={classItem.image}
                      alt={classItem.title}
                      className="class-image"
                    />
                    <div className="class-info">
                      <h3 className="class-title">{classItem.title}</h3>
                      <p className="class-price">${classItem.price}</p>
                      <p className="class-description">{classItem.description}</p>
                      <p className="class-details">
                        <span>Age: {classItem.age}</span>
                        <span>Time: {classItem.time}</span>
                        <span>Capacity: {classItem.capacity}</span>
                      </p>
                      <button className="class-read-more">Read More</button>
                    </div>
                  </div>
                ))}
              </div>
              {visibleClasses < store.classes.length && (
                <button onClick={handleShowMore} className="show-more-button">
                  More Classes
                </button>
              )}
            </div>
          );
        };
        
        export default Classes;