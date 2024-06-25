import React, { useState } from "react";
import logo from "../../Assets/Images/cascarparking.svg";
import "../../Assets/StyleCss/styles.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useCallback } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setAlert } from "redux/slices/alertSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const dispatch = useDispatch();
  const [rememberme, setrememberme] = useState(false);
  const [loginobj, setloginobj] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleCheck() {
    setrememberme(!rememberme);
  }

  function onchange(e) {
    setloginobj({ ...loginobj, [e.target.name]: e.target.value });
  }
  const userID = useCallback((token) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/me/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        const { username, email, is_superuser } = res.data;
       
        localStorage.setItem("issuperuser",is_superuser)
        localStorage.setItem("isLoggedIn", true);
      })
      .catch((err) => {
        
       
        localStorage.setItem("issuperuser",false)
      });
  }, []);

  function handlelogin(e) {
    e.preventDefault();
//loginobj.email should be in small letters
loginobj.email=loginobj.email.toLowerCase()
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/login/`, loginobj)
      .then((res) => {
        if (res.status === 200) {
          
          localStorage.setItem("token", res.data.token);
          userID(res.data.token);
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        localStorage.setItem("isLoggedIn", false);
        // toast.error("Invalid email or password.", {
        //   position: toast.POSITION.BOTTOM_RIGHT,
        // });
        dispatch(
          setAlert({
            open: true,
            message: "Invalid email or password.",
            severity: "error", // or "error", "warning", "info"
            duration: 6000,
          })
        );
      });
  }

  return (
    <>
      <div className="mainbody">
        <div className="login-outerdiv">
          <div className="loginsection">
            <ValidatorForm
              className="loginform"
              onSubmit={(e) => handlelogin(e)}
            >
              <div className="logintitle">
                <img className="logo" src={logo} alt="img" />
                <div className="logotitle">
                  Let’s login to your Cascar Parking Map Account
                </div>
              </div>
              <div className="loginformcontrol">
                <label className="loginlabel">Email</label>
                <TextValidator
                  variant="outlined"
                  validators={["required", "isEmail"]}
                  errorMessages={["Email is required ", "Email is not valid"]}
                  className="logininput"
                  name="email"
                  value={loginobj.email}
                  onChange={onchange}
                  type="text"
                />
              </div>
              <div className="loginformcontrol">
                <label className="loginlabel">Password</label>
                <TextValidator
                  variant="outlined"
                  validators={["required"]}
                  value={loginobj.password}
                  errorMessages={["Password is required"]}
                  className="logininput"
                  name="password"
                  onChange={onchange}
                  // type="password"
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
                  // name="password"
                  type={showPassword ? "text" : "password"}
                />
              </div>

              <div className="LoginButton">
                <button type="submit" className="loginbuttoncontrol">
                  Login
                </button>
              </div>
            </ValidatorForm>
          </div>
        </div>
      </div>

      <div className="loginfooter">
        <span>Copyright by Cascar Parking Map 2023</span>
      </div>
    </>
  );
}
