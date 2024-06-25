import React, { useState } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../../Assets/Images/cascarparking.svg";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setAlert } from "redux/slices/alertSlice";

function Password() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });
  ValidatorForm.addValidationRule('ismax8', (value) => {
    // Change the regular expression according to your desired phone number format
    value = (value + "").trim();
    if (value.length >= 8 && value.match(/^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/)) {
        return true;
    } else {
        return false;
    }
    
});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
    if (value !== formData.password) {
      return false;
    }
    return true;
  });

  ValidatorForm.addValidationRule("isPasswordLength", (value) => {
    if (value.length >= 8) {
      return true;
    }
    return false;
  });

  const handleFormChange = (e) => {
    
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/change_password/`,
          formData,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          // toast.success("Password changed successfully", {
          //   position: toast.POSITION.BOTTOM_RIGHT,
          // });
          dispatch(
            setAlert({
              open: true,
              message: "Password changed successfully",
              severity: "success", // or "error", "warning", "info"
              duration: 6000,
            })
          );
          
         //validatorform should not generate error after success
          ValidatorForm.removeValidationRule("isPasswordMatch");
          ValidatorForm.removeValidationRule("isPasswordLength");
          ValidatorForm.removeValidationRule("ismax8");
         window.location.reload();

        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            // toast.error(
            //   "Same password cannot be used again. Please try with a different password",
            //   {
            //     position: toast.POSITION.BOTTOM_RIGHT,
            //   }
            // );
            dispatch(
              setAlert({
                open: true,
                message: "Same password cannot be used again. Please try with a different password",
                severity: "error", // or "error", "warning", "info"
                duration: 6000,
              })
            );
          } else {
            // toast.error("Something went wrong", {
            //   position: toast.POSITION.BOTTOM_RIGHT,
            // });
            dispatch(
              setAlert({
                open: true,
                message: "Something went wrong",
                severity: "error", // or "error", "warning", "info"
                duration: 6000,
              })
            );
          }
        });
    } catch (err) {
      // toast.error("Something went wrong", {
      //   position: toast.POSITION.BOTTOM_RIGHT,
      // });
      dispatch(
        setAlert({
          open: true,
          message: "Something went wrong",
          severity: "error", // or "error", "warning", "info"
          duration: 6000,
        })
      );
    }
  };

  return (
    <div className="changepassword-outerdiv">
      <div className="change-password-section">
        <div className="logintitle passwordtitle">
          <img className="change-password-logo" src={logo} alt="img" />
          <div className="logotitle">Change Password</div>
        </div>
        <ValidatorForm onSubmit={(e) => handleSubmit(e)}>
          <div className="row-popup change-div">
            <div className="change-password-control">
              <label className="popup-label">Set Password:</label>
              <TextValidator
                validators={["required", "isPasswordMatch", "isPasswordLength","ismax8"]}
                errorMessages={[
                  "This field is required",
                  "Password must match with confirm password",
                  "Password must be at least 8 characters",
                  "Password must contain at least one letter and one number (no whitespace)",
                ]}
                className="popup-input1"
                value={formData.password}
                onChange={handleFormChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                name="password"
                type={showPassword ? "text" : "password"}
              />
            </div>
          </div>
          <div className="row-popup  change-div">
            <div className="model-input-full ">
              <label className="popup-label">Confirm Password:</label>
              <TextValidator
                validators={["required", "isPasswordMatch", "isPasswordLength"]}
                errorMessages={[
                  "This field is required",
                  "Confirm password must match with password",
                  "Password must be at least 8 characters",
                ]}
                className="popup-input1"
                value={formData.password2}
                name="password2"
                onChange={handleFormChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showConfirmPassword ? "text" : "password"}
              />
            </div>
          </div>
          <div className="change-password-btn-div">
            <button type="submit" className="change-password-buttoncontrol ">
              Submit
            </button>
          </div>
        </ValidatorForm>
      </div>
    </div>
  );
}

export default Password;
