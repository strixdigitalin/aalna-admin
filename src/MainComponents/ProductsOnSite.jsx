import React, { useContext, useEffect, useRef, useState } from "react";
import "./AdminPortalHome.css";
import Image from "../Assests/landscape.jpg";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as DOMPurify from "dompurify";

const ProductsOnSite = () => {
  const [avilability, setAvilability] = useState(true);
  const { dispatch } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState(1);
  const [defaultProducts, setDefaultProducts] = useState([]);
  const navigation = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const quantityRef = useRef(0);

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const handleChange = (event) => {

    setValue(event.target.value);
 
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/product/all?page=${2}`, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          setProducts(result.data.products);
          setDefaultProducts(result.data.products);
        } else {
          toast.info(result.error.message);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const filterIt = (text) => {
    if (text == "" || text.trim() == "" || text.trim() == null) {
      setProducts(defaultProducts);
      return null;
    }
    const lowerText = text.toLowerCase();

    const filterItem = defaultProducts.filter((item) => {
      const lowerName = item.productId.toLowerCase();
      const match = lowerName.match(lowerText);
      // console.log(match);
      if (match != null) {
        return true;
      } else return false;
    });
    setProducts(filterItem);
  };

  const handleAvailability = (_id) => {
    fetch(`${process.env.REACT_APP_API_URI}/admin/product/${_id}/edit`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        availability: quantityRef.current,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          // result.data.adminProduct
          const updatedList = products.map((item) => {
            if (item._id == result.data.product._id) return result.data.product;
            else return item;
          });
          setProducts(updatedList);
          toast.success("Product updated.");
        } else {
          toast.info(result.error.message);
          console.log(result.error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteProduct = (productId, name) => {
    if (window.confirm(`Are you sure you want to delete product: ${name}?`)) {
      fetch(
        `${process.env.REACT_APP_API_URI}/admin/product/${productId}/delete`,
        {
          method: "delete",
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.status === "success") {
            const newData = products.filter((item) => item._id !== productId);
            setProducts(newData);
            toast.error("Product deleted.");
          }
        })
        .catch((err) => {
          toast.info("Internal server error.");
          console.log(err);
        });
    }
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

        <div className="adminNavbarItems">
          Products On Site <div className="adminNavbarItemsActiveline"></div>
        </div>

        <Link to="/OrderDetail">
          <div className="adminNavbarItems">
            Order Details <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>
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
          <div className="addarticleHeading">Products On Site</div>
          <select value={value} onChange={handleChange}>
            <option value="1">Page 1</option>
            <option value="2">Page 2</option>
            <option value="3">Page 3</option>
            <option value="4" >Page 4</option>
            <option value="5" >Page 5</option>
          </select>
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search product by Id"
              onChange={(e) => filterIt(e.target.value)}
            />
          </div>
          {products.map((item) => (
            <div className="eachOrderContainer" key={item._id}>
              <img
                // src={item.displayImage[0].url ? item.displayImage[0].url : ""}
                src={item.displayImage[0].url}
                className="productImage"
              />
              <div className="productsOnSiteContainer">
                <div className="itemName">Item Id : {item.productId}</div>
                <div className="itemPrice">Item name : {item.displayName}</div>
                <div className="itemPrice">
                  Item Brandname : {item.brand_title}
                </div>

                <div className="itemPrice">Price : ₹ {item.price}</div>
                <div className="itemPrice orderDetailingDescription">
                  Item Description:
                </div>
                <div
                  className=" orderDetailingDescription"
                  dangerouslySetInnerHTML={createMarkup(item.description)}
                ></div>
                <div className="itemPrice">
                  Category : {item.product_category?.name}
                </div>
                <div
                  className="itemPrice bold"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "70%",
                    alignItems: "center",
                  }}
                >
                  Availability :{item.availability}
                  <input
                    className="availabilityInput"
                    type="number"
                    placeholder="Products Available"
                    onChange={(e) => (quantityRef.current = e.target.value)}
                  />{" "}
                  <div
                    className="availabilityUpdateButton"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleAvailability(item._id)}
                  >
                    Update
                  </div>
                </div>
                <div className="prductsOnSiteButtonContainer">
                  <div
                    className="cancelButton"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleDeleteProduct(item._id, item.displayName)
                    }
                  >
                    Delete
                  </div>
                  <div
                    className="cancelButton"
                    onClick={() =>
                      navigation("/Home", {
                        state: {
                          isEdit: true,
                          _id: item._id,
                          displayName: item.displayName,
                          description: item.description,
                          displayImage: item.displayImage,
                          brand_title: item.brand_title,
                          price: item.price,
                          product_category: item?.product_category,
                          availability: item.availability,
                          color: item.color,
                        },
                      })
                    }
                  >
                    Edit
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsOnSite;
