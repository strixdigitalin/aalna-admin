import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const UserDetails = () => {
  const REACT_APP_API_URI = process.env.REACT_APP_API_URI;
  const [users, setUsers] = useState([]);
  const admin = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${REACT_APP_API_URI}/admin/user/all`, {
      headers: {
        Authorization: "Bearer " + admin.token,
      },
    })
      .then(res => res.json())
      .then(result => {
        if (result.status == "success") {
          setUsers(result.data.users);
        } else toast.error(result.error.message);
      })
      .catch(err => console.log(err));
  }, []);

  const handleBlockUser = (_id, blockStatus) => {
    fetch(`${REACT_APP_API_URI}/admin/user/${_id}/block/${blockStatus}`, {
      method: "post",
      headers: {
        Authorization: "Bearer " + admin.token,
      },
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === "success") {
          const newData = users.map(item => {
            if (item._id == result.data.updatedUser._id)
              return result.data.updatedUser;
            else return item;
          });
          setUsers(newData);
          toast.success(result.data.message);
        } else toast.error(result.error.message);
      })
      .catch(err => console.log(err));
  };

  const handleDeleteUser = (userId, email) => {
    if (window.confirm(`Are you sure you want to delete user: ${email}?`)) {
      fetch(`${REACT_APP_API_URI}/admin/user/${userId}/delete`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + admin.token,
        },
      })
        .then(res => res.json())
        .then(result => {
          if (result.status === "success") {
            const newData = users.filter(({ _id }) => _id !== userId);
            setUsers(newData);
            toast.success(result.data.message);
          } else toast.error(result.error.message);
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="adminPageNavbar">
        <div className="adminBrandnameNavbar">Aalna | Admin Page</div>
        <Link to="/Home">
          <div className="adminNavbarItems">
            Add Product <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>
        <Link to="/Products">
          <div className="adminNavbarItems">
            Products On Site{" "}
            <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>
        <Link to="/OrderDetail">
          <div className="adminNavbarItems">
            Order Details <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>

        <div className="adminNavbarItems">
          Users <div className="adminNavbarItemsActiveline"></div>
        </div>
        <Link to="/BlogsPage">
          <div className="adminNavbarItems">
            Blogs <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>

        {/* <Link to="/FAQPage">
          <div className="adminNavbarItems">
            FAQs <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link> */}
        <Link to="/CouponPage">
          <div className="adminNavbarItems">
            Coupons <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>
        <Link to="/BannerPage">
          <div className="adminNavbarItems">
            Banner <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>
        <Link to="/TrendingPage">
          <div className="adminNavbarItems">
            Trending <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>
        <div
          className="adminLogoutButton"
          onClick={() => {
            // handleLogout();
          }}
        >
          Logout <div className="adminNavbarItemsUnActiveline "></div>
        </div>
        <div className="adminPagemainContainer">
          <div className="addarticleHeading">User Details</div>
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search user by Name"
              //   onChange={(e) => filterIt(e.target.value)}
            />
          </div>
          {users.map(item => (
            <div className="eachOrderContainer" key={item._id}>
              <div className="orderDetailingContainer">
                <div className="itemName">
                  Customer Name : {item.displayName}
                </div>
                <div className="itemPrice">
                  <b>Customer Email : </b> {item.email}
                </div>
                <div className="itemPrice">
                  <b>Customer Phone Number : </b> {item.phoneNumber}
                </div>
                <div className="itemPrice">
                  <b>Customer Id : </b> #{item._id}
                </div>

                <div className="prductsOnSiteButtonContainer">
                  <div
                    className="cancelButton"
                    onClick={() => handleBlockUser(item._id, !item.isBlocked)}
                  >
                    {item.isBlocked ? "Unblock" : "Block"}
                  </div>
                  <div
                    className="cancelButton"
                    onClick={() => handleDeleteUser(item._id, item.email)}
                  >
                    Delete
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* <div className="eachOrderContainer">
            <div className="orderDetailingContainer">
              <div className="itemName">Customer Name : Customer Name</div>
              <div className="itemPrice">
                <b>Customer Email : </b> customer@gmail.com
              </div>
              <div className="itemPrice">
                <b>Customer Id : </b> #3423421e12ne12e
              </div>

              <div className="prductsOnSiteButtonContainer">
                <div
                  className="cancelButton"
                  // onClick={() => handleDeleteProduct(item.productId)}
                >
                  Block
                </div>
                <div className="cancelButton">Delete</div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
