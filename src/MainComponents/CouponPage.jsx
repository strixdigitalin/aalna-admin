import { useContext, useEffect, useRef, useState } from "react";
import { BsNutFill, BsPlusLg } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import { RxCross2 } from "react-icons/rx";
import { UserContext } from "../App";
import { CircularLoader } from "./Loader";

const CouponPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { dispatch } = useContext(UserContext);
  const navigation = useNavigate();
  const [addCouponModal, setAddCouponModal] = useState(false);
  const [couponList, setCouponList] = useState([]);
  const [defaultCouponList, setdefaultCouponList] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [editCouponData, setEditCouponData] = useState({});
  const [addCouponLoading, setAddCouponLoading] = useState(false);
  const code = useRef("");
  const condition = useRef("");
  const min_price = useRef("");
  const discount_percent = useRef(0);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/coupon/all`)
      .then(res => res.json())
      .then(result => {
        if (result.status === "success") {
          setCouponList(result.data.coupons);
          setdefaultCouponList(result.data.coupons);
        } else {
          toast.info(result.error.message);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleAddEditCoupon = async () => {
    setAddCouponLoading(false);
    if (modalType == "add") {
      await fetch(`${process.env.REACT_APP_API_URI}/admin/coupon/add`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify({
          code: code.current,
          condition: condition.current,
          min_price: min_price.current,
          discount_percent: discount_percent.current,
        }),
      })
        .then(res => res.json())
        .then(result => {
          if (result.status == "success") {
            const newList = [result.data.coupon, couponList];
            setCouponList(newList);
            OpenCloseAddCouponModal(false);
            toast.success(result.data.message);
          } else toast.error(result.error.message);
        })
        .catch(err => console.log(err));
      setAddCouponLoading(false);
    } else {
      await fetch(
        `${process.env.REACT_APP_API_URI}/admin/coupon/${editCouponData._id}/edit`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
          body: JSON.stringify({
            code: code.current,
            condition: condition.current,
            min_price: min_price.current,
            discount_percent: discount_percent.current,
          }),
        }
      )
        .then(res => res.json())
        .then(result => {
          if (result.status == "success") {
            const newList = couponList.map(item => {
              if (item._id == editCouponData._id)
                return result.data.updatedCoupon;
              else return item;
            });
            setCouponList(newList);
            toast.success(result.data.message);
            OpenCloseAddCouponModal(false);
          } else toast.error(result.error.message);
        })
        .catch(err => console.log(err));
      setAddCouponLoading(false);
    }
  };

  const handleIsActiveCoupon = (_id, value) => {
    fetch(`${process.env.REACT_APP_API_URI}/admin/coupon/${_id}/edit`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        is_active: value,
      }),
    })
      .then(res => res.json())
      .then(result => {
        if (result.status == "success") {
          const newList = couponList.map(item => {
            if (item._id == editCouponData._id)
              return result.data.updatedCoupon;
            else return item;
          });
          setCouponList(newList);
          toast.success(result.data.message);
        } else toast.error(result.error.message);
      })
      .catch(err => console.log(err));
  };

  const handleDeleteCoupon = (_id, code) => {
    if (window.confirm(`Are you sure you want to delete coupon: ${code}`))
      fetch(`${process.env.REACT_APP_API_URI}/admin/coupon/${_id}/delete`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
      })
        .then(res => res.json())
        .then(result => {
          if (result.status == "success") {
            const newList = couponList.filter(item => item._id != _id);
            // console.log(newList);
            setCouponList(newList);
            toast.success(result.data.message);
          } else toast.error(result.error.message);
        })
        .catch(err => console.log(err));
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    navigation("/");
  };

  const OpenCloseAddCouponModal = value => {
    setAddCouponModal(value);
    if (!value) {
      setEditCouponData({});
      code.current = "";
      condition.current = "";
      min_price.current = "";
      discount_percent.current = 0;
    }
  };

  const filterIt = text => {
    if (text == "" || text.trim() == "" || text.trim() == null) {
      setCouponList(defaultCouponList);
      return null;
    }
    const lowerText = text.toLowerCase();

    const filterItem = defaultCouponList.filter(item => {
      const lowerName = item.code.toLowerCase();
      const match = lowerName.match(lowerText);
      // console.log(match);
      if (match != null) {
        return true;
      } else return false;
    });
    setCouponList(filterItem);
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
        <div className="adminNavbarItems">
          Coupons <div className="adminNavbarItemsActiveline"></div>
        </div>
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
          <div className="addarticleHeading">Coupon Page</div>
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search coupon by code"
              onChange={e => filterIt(e.target.value)}
            />
          </div>
          <div className="prductsOnSiteButtonContainer">
            <div
              className="cancelButton"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                width: "auto",
              }}
              onClick={() => {
                OpenCloseAddCouponModal(true);
                setModalType("add");
              }}
            >
              <BsPlusLg style={{ marginRight: "4%" }} />
              Add Coupon
            </div>
          </div>
          {couponList.map(item => (
            <div className="eachOrderContainer" key={item._id}>
              <div className="orderDetailingContainer">
                <div className="itemName">Coupon Code : {item.code}</div>
                <div className="itemPrice">
                  <b>Condition : </b> {item.condition}
                </div>
                <div className="itemPrice">
                  <b>Min Order Value : </b> ₹{item.min_price}.
                </div>
                <div className="itemPrice">
                  <b>Discount : </b> {item.discount_percent}%.
                </div>
                <div
                  className="itemPrice"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <b>Is Active : </b>{" "}
                  <input
                    type="checkbox"
                    defaultChecked={item.is_active}
                    onClick={() =>
                      handleIsActiveCoupon(item._id, !item.is_active)
                    }
                  />
                </div>

                <div className="prductsOnSiteButtonContainer">
                  <div
                    className="cancelButton"
                    onClick={() => {
                      setEditCouponData(item);
                      code.current = item.code;
                      condition.current = item.condition;
                      min_price.current = item.min_price;
                      setModalType("edit");
                      OpenCloseAddCouponModal(true);
                    }}
                  >
                    Edit
                  </div>
                  <div
                    className="cancelButton"
                    onClick={() => handleDeleteCoupon(item._id, item.code)}
                  >
                    Delete
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={addCouponModal}
        onRequestClose={() => {
          OpenCloseAddCouponModal(false);
        }}
        className="modalContainer"
      >
        <div className="addCategoryModalHeaderCnotainer">
          <div className="addCategoryModalHeader">Add Coupon</div>
          <RxCross2
            onClick={() => {
              OpenCloseAddCouponModal(false);
            }}
          />
        </div>

        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">Coupon Code:</div>
          <input
            className="addCategoryModalInput"
            placeholder="Enter Coupon Code"
            defaultValue={editCouponData?.code ? editCouponData.code : ""}
            onChange={e => (code.current = e.target.value)}
          />
        </div>
        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">Coupon Condition: </div>
          <input
            className="addCategoryModalInput"
            defaultValue={
              editCouponData?.condition ? editCouponData.condition : ""
            }
            onChange={e => (condition.current = e.target.value)}
            placeholder="Enter Coupon Condition Line"
          />
        </div>

        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">
            Coupon percentage off:{" "}
          </div>
          <input
            type="number"
            className="addCategoryModalInput"
            placeholder="Enter Coupon Condition Line"
            defaultValue={
              editCouponData?.discount_percent
                ? editCouponData.discount_percent
                : ""
            }
            onChange={e => (discount_percent.current = e.target.value)}
          />
        </div>
        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">Coupon Min Price: </div>
          <input
            type="number"
            className="addCategoryModalInput"
            defaultValue={
              editCouponData?.min_price ? editCouponData.min_price : ""
            }
            onChange={e => (min_price.current = e.target.value)}
            placeholder="Enter Min Price at which coupon is applicable"
          />
        </div>
        <div className="prductsOnSiteButtonContainer addCategoryModalButtonContainer">
          {addCouponLoading ? (
            <CircularLoader />
          ) : (
            <div className="cancelButton" onClick={handleAddEditCoupon}>
              {modalType == "add" ? "Add" : "Edit"} Coupon
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CouponPage;
