import * as React from "react";
import { DataGrid, GridPagination } from "@mui/x-data-grid";
import { CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { PiTrashFill } from "react-icons/pi";
import { BiSolidPencil } from "react-icons/bi";
import CustomPagination from "Components/CustomPagination";
import { ValidatorForm,  } from "react-material-ui-form-validator";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, updateUser } from "redux/slices/UserSlice";
import { deleteUser } from "redux/slices/UserSlice";
import { createUser } from "redux/slices/UserSlice";
import { toast } from "react-toastify";
import Loader from "Loader";
import Adduser from "Assets/Dialog box/Adduser";
import Deletebox from "Assets/Dialog box/Deletebox";
import { setAlert } from "redux/slices/alertSlice";
export default function UserManagment() {
  const dispatch = useDispatch();
  const [openadd, setOpenadd] = useState(false);
  const [openedit, setOpenedit] = useState(false);
  const [opendelete, setOpendelete] = useState(false);
  const [addLoader,setAddLoader]=useState(false)
  // const isLoading = useSelector((state) => state.user.isLoading);
  const [isLoading, setIsLoading] = useState(false);
  const getUsers = useSelector((state) => state.user.getAllUsers);
  var getUsersarr = [];
  if (Array.isArray(getUsers)) {
    getUsersarr = getUsers;
  }
  const errorMessage = useSelector((state) => state.user);
  const getTotalPages = useSelector((state) => state.user.totalPages);
  const currentPage = useSelector((state) => state.user.currentPage);

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
  });
  ValidatorForm.addValidationRule("ismax30", (value) => {
    // Change the regular expression according to your desired phone number format
    value = (value + "").trim();
    if (value.length <= 30 && value !== "") {
      return true;
    } else {
      return false;
    }
  });
  function PaginationComponent(props) {
    const { total, getData, currentPage, ...rest } = props;
    return (
      <GridPagination
        ActionsComponent={(paginationProps) => (
          <CustomPagination
            currentPage={currentPage}
            total={total}
            getData={getData}
            {...paginationProps}
          />
        )}
        {...rest}
      />
    );
  }

  const handleCloseDelete = () => {
    setOpendelete(false);
  };

  const handleClickOpenadd = () => {
    setOpenadd(true);
  };

  const handleClickcloseedit = () => {
    setOpenedit(false);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
    });
  };

  const handleCloseadd = () => {
    setOpenadd(false);
  };
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdduser = () => {
    setAddLoader(true)
    if (
      formData.email === "" ||
      formData.first_name === "" ||
      formData.last_name === ""
    ) {
      // toast.error("Please fill in all required fields.");
      dispatch(
        setAlert({
          open: true,
          message: "Please fill in all required fields.",
          severity: "error", // or "error", "warning", "info"
          duration: 6000,
        })
      );
      setAddLoader(false)
      return;
    }
    //formdata.email should be in small letters
    formData.email = formData.email.toLowerCase();
    dispatch(createUser(formData))
      .unwrap()
      .then((res) => {
        if (res.status === 400) {
          if(res.data?.email[0]){
            dispatch(
              setAlert({
                open: true,
                message: res.data.email[0],
                severity: "error", // or "error", "warning", "info"
                duration: 6000,
              })
            );
          }
          else if(res.data?.first_name[0]){
            dispatch(
              setAlert({
                open: true,
                message: res.data.first_name[0],
                severity: "error", // or "error", "warning", "info"
                duration: 6000,
              })
            );
          }
          else if(res.data?.last_name[0]){
            dispatch(
              setAlert({
                open: true,
                message: res.data.last_name[0],
                severity: "error", // or "error", "warning", "info"
                duration: 6000,
              })
            );
          }
          // toast.error(res.data.email[0] || "");
          // toast.error(res.data.first_name[0] || "");
          // toast.error(res.data.last_name[0] || "");
          setAddLoader(false)
        } else {
          dispatch(getAllUsers(1));
          // toast.success("User Added Successfully!!!");
          dispatch(
            setAlert({
              open: true,
              message: "User Added Successfully",
              severity: "success", // or "error", "warning", "info"
              duration: 6000,
            })
          );
          
          
          setOpenadd(false);
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
          });
          setAddLoader(false)
        }
      })
      .catch((error) => {
        if (error.status === 400) {
          if(error.data?.email[0]){
            dispatch(
              setAlert({
                open: true,
                message: error.data.email[0],
                severity: "error", // or "error", "warning", "info"
                duration: 6000,
              })
            );
          }
          else if(error.data?.first_name[0]){
            dispatch(
              setAlert({
                open: true,
                message: error.data.first_name[0],
                severity: "error", // or "error", "warning", "info"
                duration: 6000,
              })
            );
          }
          else if(error.data?.last_name[0]){
            dispatch(
              setAlert({
                open: true,
                message: error.data.last_name[0],
                severity: "error", // or "error", "warning", "info"
                duration: 6000,
              })
            );
          }
          // toast.error(error.data.email[0] || "");
          // toast.error(error.data.first_name[0] || "");
          // toast.error(error.data.last_name[0] || "");
          setAddLoader(false)
        } else {
          // toast.error(errorMessage?.message);
          dispatch(
            setAlert({
              open: true,
              message: errorMessage?.message,
              severity: "error", // or "error", "warning", "info"
              duration: 6000,
            })
          );
          setAddLoader(false)
        }
      });
  };

  const handleClickOpenedit = (id) => {
    const obj = getUsersarr.find((item) => item.id === id);
    setFormData(obj);
    setOpenedit(true);
  };
  const UpdateUser = () => {
    setAddLoader(true)
   
    // e.preventDefault();
    dispatch(updateUser({ userData: formData })).then((res) => {
    
      if (res.status === 400) {
        if(res.data?.email[0]){
          dispatch(
            setAlert({
              open: true,
              message: res.data.email[0],
              severity: "error", // or "error", "warning", "info"
              duration: 6000,
            })
          );
        }
        else if(res.data?.first_name[0]){
          dispatch(
            setAlert({
              open: true,
              message: res.data.first_name[0],
              severity: "error", // or "error", "warning", "info"
              duration: 6000,
            })
          );
        }
        else if(res.data?.last_name[0]){
          dispatch(
            setAlert({
              open: true,
              message: res.data.last_name[0],
              severity: "error", // or "error", "warning", "info"
              duration: 6000,
            })
          );
        }
        // toast.error(res.data.email[0] || "");
        // toast.error(res.data.first_name[0] || "");
        // toast.error(res.data.last_name[0] || "");
        setAddLoader(false)
      } else if (res.type === "user/updateUser/fulfilled")  {
        // toast.success("User Updated Successfully!!!");
        dispatch(
          setAlert({
            open: true,
            message: "User Updated Successfully!!!",
            severity: "success", // or "error", "warning", "info"
            duration: 6000,
          })
        );
        setAddLoader(false)
      }
      else {
      }
    handleClickcloseedit();
    setAddLoader(false)
  });}

  const handleDelete = (id) => {
    dispatch(deleteUser(id)).then((res) => {
      dispatch(
        setAlert({
          open: true,
          message: "Data Deleted Successfully",
          severity: "success", // or "error", "warning", "info"
          duration: 6000,
        })
      );
    }).catch((error) => {
      dispatch(
        setAlert({
          open: true,
          message: "Something went wrong",
          severity: "error", // or "error", "warning", "info"
          duration: 6000,
        })
      );
    });
    setDeleteUserId(null);
    setOpendelete(false);
  };
  const columns = [
    {
      field: "s.no",
      type: "string",
      flex: 1,
      minWidth: 165,
      renderHeader: () => (
        <strong>
          <Typography
            variant="overline"
            fontWeight="bold"
            sx={{ textDecodation: "none", paddingLeft: "20px" }}
          >
            Serial Number
          </Typography>
        </strong>
      ),
      renderCell: (params, index) => (
        <Typography sx={{ textDecodation: "none", paddingLeft: "30px" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "first_name",
      type: "string",
      flex: 1,
      minWidth: 230,
      renderHeader: () => (
        <strong>
          <Typography variant="overline" fontWeight="bold">
            First Name
          </Typography>
        </strong>
      ),
      renderCell: (params) => (
        <Typography sx={{ textDecodation: "none" }}>{params.value}</Typography>
      ),
    },
    {
      field: "last_name",
      type: "string",
      flex: 1,
      minWidth: 230,
      renderHeader: () => (
        <strong>
          <Typography variant="overline" fontWeight="bold">
            Last Name
          </Typography>
        </strong>
      ),
      renderCell: (params) => (
        <Typography sx={{ textDecodation: "none" }}>{params.value}</Typography>
      ),
    },
    {
      field: "email",
      type: "string",
      flex: 1,
      minWidth: 350,
      renderHeader: () => (
        <strong>
          <Typography variant="overline" fontWeight="bold">
            Email
          </Typography>
        </strong>
      ),
      renderCell: (params) => (
        <Typography className="email-box" sx={{ textDecodation: "none" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "action",
      type: "string",
      flex: 1,
      minWidth: 90,
      renderHeader: () => (
        <strong>
          <Typography variant="overline" fontWeight="bold">
            Action
          </Typography>
        </strong>
      ),
      renderCell: (params) => (
        <div className="actions">
          <div
            className="actionitems"
            onClick={() => {
              handleClickOpenedit(params.row.id);
            }}
          >
            <BiSolidPencil />
          </div>
          <div
            className="actionitems"
            onClick={() => {
              setDeleteUserId(params.row.id);
              setOpendelete(true);
            }}
          >
            <PiTrashFill />
          </div>
        </div>
      ),
    },
    // {
    //   field: "action",
    //   type: "string",
    //   width: 115,
    //   renderHeader: () => (
    //     <strong>
    //       <Typography variant="overline" fontWeight="bold">
    //         Action
    //       </Typography>
    //     </strong>
    //   ),
    //   renderCell: (params) => (
    //     <div className="actions">
    //       <div
    //         className="actionitems"
    //         onClick={() => {
    //           handleClickOpenedit(params.row.id);
    //         }}
    //       >
    //         <BiSolidPencil />
    //       </div>
    //       <div
    //         className="actionitems"
    //         onClick={() => {
    //           setDeleteUserId(params.row.id);
    //           setOpendelete(true);
    //         }}
    //       >
    //         <PiTrashFill />
    //       </div>
    //     </div>
    //   ),
    // },
  ];
  // useEffect(() => {
  //   if (getUsersarr.length > 0) {
  //     let virtualScrollerRenderZoneDiv = document.querySelector(
  //       ".MuiDataGrid-virtualScrollerRenderZone"
  //     );
  //     let virtualScrollerContentDiv = document.querySelector(
  //       ".MuiDataGrid-virtualScrollerContent"
  //     );
  //     let renderZoneHeight = virtualScrollerRenderZoneDiv?.clientHeight;
  //     if (virtualScrollerContentDiv) {
  //       virtualScrollerContentDiv.style.height = renderZoneHeight + "px";
  //     }
  //   }
  // }, [getUsersarr]);
  useEffect(() => {
    setIsLoading(true);
    dispatch(getAllUsers());
    if(getUsers && getUsers.length >= 0 ){
      setIsLoading(false);
    } 
  }, [dispatch]);

  return (
    <div>
      <div className="sectiontitle">
        <div className="title">
          <label className="titletag">User Management</label>
        </div>
        <label className="addbtn">
          <button className="addbuttoncontrol" onClick={handleClickOpenadd}>
            {" "}
            <AiFillPlusCircle /> Add User
          </button>
        </label>
      </div>

      <div className="section-inner">
        {isLoading ? (
          <Loader />
        ) : (
          <DataGrid
            sx={{
              margin: "0px 10px",
            }}
            autoHeight
            className="custom-table"
            pagination
            slots={{
              pagination: (props) => (
                <PaginationComponent
                  getData={getAllUsers}
                  currentPage={currentPage}
                  total={getTotalPages}
                  pagesize={getUsersarr?.length}
                  rows={getUsersarr}
                  {...props}
                />
              ),
            }}
            rows={getUsersarr?.map((item, index) => {
              return {
                ...item,
                "s.no":
                  currentPage > 1 ? index + (currentPage * 10 - 9) : index + 1,
              };
            })}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
          />
        )}
      </div>
      <div>
        <Adduser
          open={openadd}
          onClose={handleCloseadd}
          title="Add User"
          onConfirm={handleAdduser}
          formData={formData}
          handleFormChange={handleFormChange}
          buttonName="Add User"
          handleSubmit={
            formData.email === "" ||
            formData.first_name === "" ||
            formData.last_name === ""
              ? null
              : handleAdduser
          }
          setAddLoader={setAddLoader}
          addLoader={addLoader}
        /> 
      </div>

      <div>
        <Adduser
          open={openedit}
          onClose={handleClickcloseedit}
          title="Edit User"
          onConfirm={UpdateUser}
          formData={formData}
          handleFormChange={handleFormChange}
          buttonName="Update User"
          handleSubmit={
            formData.email === "" ||
            formData.first_name === "" ||
            formData.last_name === ""
              ? null
              : UpdateUser
          }
          setAddLoader={setAddLoader}
          addLoader={addLoader}
        /> 
      
        
       
      </div>
      {/* Delete Popup */}
      <Deletebox
        open={opendelete}
        onClose={handleCloseDelete}
        title="Are you sure you want to delete ?"
        onConfirm={() => {
          handleDelete(deleteUserId);
        }}
      />
    </div>
  );
}
