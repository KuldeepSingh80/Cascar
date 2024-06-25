import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import CancelIcon from "@mui/icons-material/Cancel";

// Import local components or Redux actions/slices
import PanZoomRows from "./PanZoomRows";
import { setModal } from "redux/slices/modalSlice";
import { getAllParkingMap } from "redux/slices/ParkingSlice";
import { setAlert } from "redux/slices/alertSlice";


const PanZoomCol = ({ item, index, parkingSlots }) => {
 // Constants for dispatch and selecting from Redux store
 const dispatch = useDispatch();
 const parkingData = useSelector((state) => state.parking.getAllParkingMap);

 // State hooks
 const [editModes, setEditModes] = useState(Array(parkingData?.length).fill(false));
 const [editlabel, seteditlabel] = useState("");



  const handleEdit = (index) => {
    const labelToUpdate = editlabel[index];
    const token = localStorage.getItem("token");

    if (!labelToUpdate || !token) {
      // toast.error("Invalid label or token");
      dispatch(
        setAlert({
          open: true,
          message: "Invalid label or token",
          severity: "error", // or "error", "warning", "info"
          duration: 6000,
        })
      );
      return;
    }

    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/api/parking/label/${index}/`,
        { name: labelToUpdate },
        config
      )
      .then((res) => {
        if (res.status === 200) {
          // toast.success("Label Updated Successfully");
          dispatch(
            setAlert({
              open: true,
              message: "Label Updated Successfully",
              severity: "success", // or "error", "warning", "info"
              duration: 6000,
            })
          );
          dispatch(getAllParkingMap());
          // Handle other logic if needed after successful update
        } else if (res.status === 400) {
          // toast.error(res.data.non_field_errors[0]);
          dispatch(
            setAlert({
              open: true,
              message: res.data.non_field_errors[0],
              severity: "error", // or "error", "warning", "info"
              duration: 6000,
            })
          );
        } else {
          // toast.error("Something went wrong");
          dispatch(
            setAlert({
              open: true,
              message: "Something went wrong",
              severity: "error", // or "error", "warning", "info"
              duration: 6000,
            })
          );
        }
      })
      .catch((err) => {
        // toast.error(err.response?.data?.detail || "An error occurred");
        dispatch(
          setAlert({
            open: true,
            message: err.response?.data?.detail || "An error occurred",
            severity: "error", // or "error", "warning", "info"
            duration: 6000,
          })
        );
      });
  };
  // console.log(singledata, "iiiii");
  const handleLiDoubleClick = async (event, data) => {
    event.preventDefault();

    // Dispatch the asynchronous action
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parking/parking_map/${data.id}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(setModal({ open: true, data: response.data }));
      return response.data;
    } catch (error) {
      return error.response.data;
    }

    // Now, the asynchronous action is fulfilled, and you can access the updated state
  };
  const [lastTouchEndTime, setLastTouchEndTime] = useState(0);

  const handleTouchEnd = (e, iteminner) => {
    const now = Date.now();
    const timeDiff = now - lastTouchEndTime;

    if (timeDiff <= 300) {
      // It's a double-tap, call your double-tap handler
      handleLiDoubleClick(e, iteminner);
    }

    // Update the last touch end time
    setLastTouchEndTime(now);
  };

  return (
    <>
      <div className="parkingmap-body" key={index}>
        <ul className="parkingmap-body-ul" key={item.id}>
          {editModes[index] ? (
            <div className="parking-edit-div">
              <div className="parking-edit-div">
                <input
                  type="text"
                  className="parkingmap-body-front"
                  value={editlabel[item.id] || ""} // Use the specific edit label for this item
                  onChange={(e) => {
                    const newEditLabel = [...editlabel];
                    newEditLabel[item.id] = e.target.value;
                    seteditlabel(newEditLabel);
                  }}
                />
                <button
                  className="parking-edit"
                  onClick={() => {
                    handleEdit(item.id);
                    setEditModes((prevModes) => {
                      const newModes = [...prevModes];
                      newModes[index] = false;
                      return newModes;
                    });
                  }}
                >
                  Edit
                </button>
                <CancelIcon
                  className="crossedit"
                  onClick={() => {
                    const newEditModes = [...editModes];
                    if (newEditModes[index] === true) {
                      newEditModes[index] = false;
                      setEditModes(newEditModes);
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <li
              onClick={() => {
                const newEditModes = [...editModes];
                newEditModes[index] = true;
                setEditModes(newEditModes);
                seteditlabel((prevLabels) => {
                  const newLabels = [...prevLabels];
                  newLabels[item.id] = item.name;
                  return newLabels;
                });
              }}
              className="parkingmap-body-front"
            >
              {item.name}
            </li>
          )}
          <div style={{ display: "flex", gap: "20px" }}>
            {parkingSlots.map((iteminner, index1) => (
              <li
                key={iteminner.id} // Assuming iteminner has a unique identifier
                style={{
                  cursor: "pointer",
                }}
                onDoubleClickCapture={(e) => handleLiDoubleClick(e, iteminner)}
                onTouchEnd={(e) => handleTouchEnd(e, iteminner)}
              >
                <PanZoomRows
                  key={index1}
                  iteminner={iteminner}
                  index1={index1}
                  index={index}
                />
              </li>
            ))}
          </div>
          {/* showing label again */}
          <li className="parkingmap-body-front">{item.name}</li>
        </ul>
      </div>
    </>
  );
};

export default React.memo(PanZoomCol);
