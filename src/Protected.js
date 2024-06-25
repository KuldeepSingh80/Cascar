import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Protected = ({ children }) => {
const navigate = useNavigate();
const token = localStorage.getItem("token");
useEffect(() => {
    if (token === null || token === undefined || !token) {
     navigate("/");
    }
}, [token, navigate]);
if (token === null || token === undefined || !token) {
    return <></>;
}
return children;
};
export const ProtectedAdmin = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const issuperadmin = localStorage.getItem("issuperuser");
    useEffect(() => {
        if (token === null || token === undefined || !token || issuperadmin==="false" || issuperadmin===null || issuperadmin===undefined) {
         navigate("/");
        }
    }, [token,issuperadmin, navigate]);
    if (token === null || token === undefined || !token || issuperadmin==="false" || issuperadmin===null || issuperadmin===undefined) {
        return <></>;
    }
    return children;
    };
export default Protected;
export const UnProtectedRoute = ({ children }) => {
const location = useLocation();
const navigate = useNavigate();
const token = localStorage.getItem("token");
useEffect(() => {
    if (token !== null  && location.pathname==="/") {
     navigate("/dashboard");
    }
   

}, [token, navigate,location.pathname]);
if (token !== null && location.pathname==="/"){
    return <></>;
}
return children;
};