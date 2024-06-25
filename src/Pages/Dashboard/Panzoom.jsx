import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PanZoomCol from "./PanZoomCol";
import { getAllParkingMap } from "redux/slices/ParkingSlice";
import { IconButton, Skeleton, Tooltip, tooltipClasses } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SkeletonLoader from "./SkeletonLoader";

const Panzoomcls = () => {
  const [panScale, setPanScale] = useState(0.1);
  const [loader, setLoader] = useState(true);
  const data = useSelector((state) => state.modal.data);
  const parkingData = useSelector((state) => state.parking.getAllParkingMap);
  const dragStartRef = useRef({ x: 0, y: 0, isDragging: false });
  const containerRef = useRef();
  const [minScale, setMinScale] = useState(0.1);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoader(true);
    dispatch(getAllParkingMap());
  }, [dispatch]);

  useEffect(() => {
    if (parkingData && parkingData.length > 0) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const maxParkingSlots = Math.max(
        ...parkingData.map((item) => item.max_parking_slots)
      );
      const maxParkingRows = parkingData.length;
      const initialPanScaleWidth = screenWidth / (maxParkingSlots * 150); // Assuming each parking slot takes up 100px width
      const initialPanScaleHeight = screenHeight / (maxParkingRows * 150); // Assuming each parking row takes up 100px height
      const initialPanScale = Math.min(initialPanScaleWidth, initialPanScaleHeight);
      setPanScale(initialPanScale); // Adjust the initial panScale based on screen size to show full map
      setMinScale(initialPanScale);
      setLoader(false);
    }
  }, [parkingData]);

  const handleZoom = (type) => {
    if (parkingData && parkingData.length > 0) {
      const minPanScale = minScale;
      const maxPanScale = 2;
      
      setPanScale((prevPanScale) => {
        let newPanScale;
  
        if (type === "zoomout") {
          newPanScale = Math.max(minPanScale, prevPanScale - 0.05);
        } else if (type === "zoomin") {
          newPanScale = Math.min(maxPanScale, prevPanScale + 0.05);
        } else {
          return prevPanScale;
        }
  
        return newPanScale;
      });
    }
  };
  

  const resetPanZoom = () => {
    if (parkingData && parkingData.length > 0) {
      const maxParkingSlots = Math.max(
        ...parkingData.map((item) => item.max_parking_slots)
      );
      const initialPanScale = 1 / (maxParkingSlots * 0.1);
      setPanScale(initialPanScale - 0.1);
    }
  };

  const handleDragStart = (e) => {
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollTop: containerRef.current.scrollTop,
      scrollLeft: containerRef.current.scrollLeft,
      isDragging: true,
    };
  };

  const handleDragMove = (e) => {
    if (dragStartRef.current.isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      containerRef.current.scrollTop = dragStartRef.current.scrollTop - dy;
      containerRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
    }
  };

  const handleDragEnd = () => {
    dragStartRef.current.isDragging = false;
  };
  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0]); // Use the first touch point
  };

  const handleTouchMove = (e) => {
    handleDragMove(e.touches[0]); // Use the first touch point
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };
  const calculateCenter = (e) => {
    
    // Check if containerRef.current is truthy before accessing its properties
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const centerX = width / 2;
      const centerY = height / 2;
      console.log(e,"event data")
      return `${centerX}px ${centerY}px`;
    }
    return 'center center';
  };


  return (
    <>
      <div
        className="parking-map-wrapper style-2"
        ref={containerRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          WebkitOverflowScrolling: 'touch',
          userSelect: 'none', // Disable text selection
    
        }}
      >
        {loader ? (
          // Loader component
          <div>
            <SkeletonLoader />
          </div>
        ) : (
          // Parking map content
          <div
            className="parking-map-wrapper-inner"
            style={{
              transform: `matrix(${panScale}, 0, 0, ${panScale}, 0, 0)`,
              
            }}
          >
            {parkingData &&
              parkingData.map((item, index) => {
                const parkingSlots = item.parking_slots;
                return (
                  <div key={index}>
                    <PanZoomCol
                      item={item}
                      index={index}
                      parkingSlots={parkingSlots}
                      data={data}
                    />
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Recenter and Zoom buttons */}
      <div className="recenter-cls">
        <div className="zoom">
          <div
            className="zoomin"
            onClick={() => handleZoom("zoomin")}
            onTouchStart={() => handleZoom("zoomin")}
          >
            <Tooltip arrow placement="left" title="Zoom In">
              <IconButton aria-label="Zoom In" color="primary">
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div
            className="zoomout"
            onClick={() => handleZoom("zoomout")}
            onTouchStart={() => handleZoom("zoomout")}
          >
            <Tooltip arrow placement="left" title="Zoom Out">
              <IconButton aria-label="Zoom Out" color="primary">
                <RemoveIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

export default Panzoomcls;
