import React, { useContext, useEffect, useState } from "react";
import "./AdminPortalHome.css";
import Image from "../Assests/landscape.jpg";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const AdminPortalOrderDetails = () => {
  const navigation = useNavigate();
  const { dispatch } = useContext(UserContext);
  const [orderList, setOrderList] = useState([]);
  const [defaultProducts, setDefaultProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/admin/order/all`, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          setOrderList(result.data.orders);
          setDefaultProducts(result.data.orders);
          console.log(result.data.orders);
        } else {
          console.log(result.error.message);
        }
      });
  }, []);

  function convertRzpPrice(price) {
    const temp = price.toString().split("");
    temp.splice(temp.length - 2, 0, ".");
    return temp.join("");
  }

  const filterIt = (text) => {
    if (text == "" || text.trim() == "" || text.trim() == null) {
      setOrderList(defaultProducts);
      return null;
    }
    const lowerText = text.toLowerCase();
    console.log(text);
    const filterItem = defaultProducts.filter((item) => {
      const lowerName = item._id.toLowerCase();
      const match = lowerName.match(lowerText);

      if (match != null) {
        return true;
      } else return false;
    });
    setOrderList(filterItem);
  };

  const handleOrderStatus = (
    orderId,
    payment_mode,
    order_status,
    payment_status
  ) => {
    fetch(`${process.env.REACT_APP_API_URI}/admin/order/${orderId}/update`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        order_status,
        payment_mode,
        payment_status,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status == "success") {
          console.log(result);
          const newData = orderList.filter((item) => {
            if (item.orderId == orderId) return result.data.updatedOrder;
            else return item;
          });
          setOrderList(newData);
          toast.success("Order status updated.");
        } else console.log(result.error);
      })
      .catch((err) => console.log(err));
  };

  const handleCancelOrder = (orderId) => {
    fetch(`${process.env.REACT_APP_API_URI}/admin/order/${orderId}/update`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        order_status: "CANCELLED BY ADMIN",
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.status == "success") {
          const newData = orderList.filter((item) => {
            if (item.orderId == orderId) return result.data.updatedOrder;
            else return item;
          });
          setOrderList(newData);
        } else console.log(result.error);
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    navigation("/");
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
        <div className="adminNavbarItems">
          Order Details <div className="adminNavbarItemsActiveline"></div>
        </div>
        <Link to="/UserDetail">
          <div className="adminNavbarItems">
            Users <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>

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
            handleLogout();
          }}
        >
          Logout <div className="adminNavbarItemsUnActiveline "></div>
        </div>
        <div className="adminPagemainContainer">
          <div className="addarticleHeading">Order Details</div>
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search order by Id"
              onChange={(e) => filterIt(e.target.value)}
            />
          </div>
          {orderList.map((item) => (
            <div className="eachOrderContainer" key={item._id}>
              <div className="orderDetailingContainer">
                <div className="itemName">
                  Order Id/CC Order Id : {item._id} |{" "}
                  {item.cc_bankRefNo
                    ? `CC Payment Bank Ref No. :
                  ${item.cc_bankRefNo}`
                    : "(Order cancelled while making payment)"}
                </div>
                <ul>
                  {item.products.map((cartItem) => (
                    <li key={cartItem._id} className="listItem">
                      <img
                        // src={
                        //   cartItem?.product?.displayImage[0]?.url
                        //     ? cartItem?.product?.displayImage[0]?.url
                        //     : "https://static.thenounproject.com/png/5191452-200.png"
                        // }
                        src={cartItem?.product?.displayImage[0].url}
                      />
                      <div>
                        {cartItem.product ? (
                          <div className="itemPrice orderDetailEachlist">
                            <div
                              style={{ marginBottom: "1%" }}
                            >{`Item name : BEIGE & INDIGO COTTON BLOCK PRINT HANDCRAFTED AJRAKH DUPATTA SET | Product Id : #${cartItem.product?.productId} | Price : ${cartItem.product?.price} |
                      Quantity : ${cartItem.quantity}`}</div>
                          </div>
                        ) : (
                          <div>{`Product Deleted |
                          Quantity : ${cartItem.quantity}`}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {/* <div className='itemPrice'>Reseller Id : Reseller</div> */}
                <div className="itemPrice">
                  {/* <b>Total Order Price : {convertRzpPrice(item.order_price)}</b> */}
                  <b>Total Order Price : {item.order_price}</b>
                </div>
                <div className="itemPrice">
                  Purchaser Name :{" "}
                  {item.buyer ? item.buyer.displayName : "User deleted"}
                </div>
                <div className="itemPrice">
                  Payment Status : {item.payment_mode} | {item.payment_status}
                </div>
                {item.shippingAddress ? (
                  <div className="itemPrice">
                    Delivery Address : {item.shippingAddress.address},{" "}
                    {item.shippingAddress.pincode}
                  </div>
                ) : (
                  <></>
                )}

                <div>Delivery Status : {item.order_status}</div>
                <div className="orderStatusInfoContainer">
                  <input
                    type="radio"
                    id="placed"
                    name={`status ${item._id}`}
                    defaultChecked={item.order_status == "PLACED"}
                    onClick={() =>
                      handleOrderStatus(
                        item._id,
                        item.payment_mode,
                        "PLACED",
                        item.payment_status
                      )
                    }
                    value="placed"
                  />
                  <label for="placed">Placed</label>
                  <input
                    type="radio"
                    id="shipped"
                    name={`status ${item._id}`}
                    value="shipped"
                    defaultChecked={item.order_status == "SHIPPED"}
                    onClick={() =>
                      handleOrderStatus(
                        item._id,
                        item.payment_mode,
                        "SHIPPED",
                        item.payment_status
                      )
                    }
                  />
                  <label for="shipped">Shipped</label>

                  <input
                    type="radio"
                    id="delivered"
                    name={`status ${item._id}`}
                    defaultChecked={item.order_status == "DELIVERED"}
                    onClick={() =>
                      handleOrderStatus(
                        item._id,
                        item.payment_mode,
                        "DELIVERED",
                        item.payment_status
                      )
                    }
                    value="delivered"
                  />
                  <label for="delivered">Delivered</label>
                </div>
                {item.cancelled ? (
                  <div className="cancelButton">Order Cancelled</div>
                ) : (
                  <div
                    className="cancelButton"
                    onClick={() => handleCancelOrder(item._id)}
                  >
                    Cancel
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPortalOrderDetails;
