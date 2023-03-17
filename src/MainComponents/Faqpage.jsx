import { useContext, useEffect, useRef, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import { UserContext } from "../App";
import { CircularLoader } from "./Loader";

const FaqPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { dispatch } = useContext(UserContext);
  const navigation = useNavigate();
  const [addCouponModal, setAddCouponModal] = useState(false);
  const [faqList, setFaqList] = useState([]);
  const [defaultFaqList, setDefaultFaqList] = useState([]);

  const [editFaqData, seteditFaqData] = useState({});
  const [modalType, setModalType] = useState(null);
  const [addFaqLoading, setAddFaqLoading] = useState(false);
  const question = useRef("");
  const answer = useRef("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/faq/all`)
      .then(res => res.json())
      .then(result => {
        if (result.status === "success") {
          setFaqList(result.data.FAQs);
          setDefaultFaqList(result.data.FAQs);
        } else {
          toast.info(result.error.message);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleAddEditFaq = async () => {
    setAddFaqLoading(true);
    if (modalType == "add") {
      await fetch(`${process.env.REACT_APP_API_URI}/admin/faq/add`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify({
          question: question.current,
          answer: answer.current,
        }),
      })
        .then(res => res.json())
        .then(result => {
          if (result.status === "success") {
            const newFaqList = [result.data.FAQ, ...faqList];
            setFaqList(newFaqList);
            OpenCloseAddFaqModal(false);
            toast.success(result.data.message);
          } else toast.error(result.error.message);
        })
        .catch(err => console.log(err));
      setAddFaqLoading(false);
    } else {
      await fetch(
        `${process.env.REACT_APP_API_URI}/admin/faq/${editFaqData._id}/edit`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
          body: JSON.stringify({
            question: question.current,
            answer: answer.current,
          }),
        }
      )
        .then(res => res.json())
        .then(result => {
          if (result.status === "success") {
            const newFaqList = faqList.map(item => {
              if (item._id == editFaqData._id) return result.data.updatedFAQ;
              else return item;
            });
            setFaqList(newFaqList);
            OpenCloseAddFaqModal(false);
            toast.success(result.data.message);
          } else toast.error(result.error.message);
        })
        .catch(err => console.log(err));
      addFaqLoading(false);
    }
  };

  const handleFaqDelete = (faqId, question) => {
    console.log("called");
    if (
      window.confirm(
        `Are you sure you want to delete FAQ: ${question.substring(0, 25)}...`
      )
    ) {
      fetch(`${process.env.REACT_APP_API_URI}/admin/faq/${faqId}/delete`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
      })
        .then(res => res.json())
        .then(result => {
          if (result.status === "success") {
            const newList = faqList.filter(item => item._id != faqId);
            setFaqList(newList);
            toast.success(result.data.message);
          } else toast.error(result.data.message);
        })
        .catch(err => console.log(err));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    navigation("/");
  };

  const OpenCloseAddFaqModal = value => {
    setAddCouponModal(value);
    if (!value) {
      question.current = "";
      answer.current = "";
      seteditFaqData({});
    }
  };

  const filterIt = text => {
    if (text == "" || text.trim() == "" || text.trim() == null) {
      setFaqList(defaultFaqList);
      return null;
    }
    const lowerText = text.toLowerCase();

    const filterItem = defaultFaqList.filter(item => {
      const lowerName = item.question.toLowerCase();
      const match = lowerName.match(lowerText);
      // console.log(match);
      if (match != null) {
        return true;
      } else return false;
    });
    setFaqList(filterItem);
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

        <div className="adminNavbarItems">
          FAQs <div className="adminNavbarItemsActiveline"></div>
        </div>
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
          <div className="addarticleHeading">FAQs Page</div>
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search Questions"
              onChange={e => filterIt(e.target.value)}
            />
          </div>
          <div className="prductsOnSiteButtonContainer">
            <div
              className="cancelButton"
              // onClick={() => handleDeleteProduct(item.productId)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                width: "auto",
              }}
              onClick={() => {
                OpenCloseAddFaqModal(true);
                setModalType("add");
              }}
            >
              <BsPlusLg style={{ marginRight: "4%" }} />
              Add FAQ
            </div>
          </div>
          {faqList.map(item => (
            <div className="eachOrderContainer" key={item._id}>
              <div className="orderDetailingContainer">
                <div className="itemName">{item.question}</div>
                <div className="itemPrice">
                  <b>Answer : </b>
                  {item.answer}
                </div>

                <div className="prductsOnSiteButtonContainer">
                  <div
                    className="cancelButton"
                    onClick={() => {
                      OpenCloseAddFaqModal(true);
                      seteditFaqData(item);
                      question.current = item.question;
                      answer.current = item.answer;
                    }}
                  >
                    Edit
                  </div>
                  <div
                    className="cancelButton"
                    onClick={() => handleFaqDelete(item._id, item.question)}
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
        onRequestClose={() => OpenCloseAddFaqModal(false)}
        className="modalContainer"
      >
        <div className="addCategoryModalHeaderCnotainer">
          <div className="addCategoryModalHeader">Add FAQ</div>
          <RxCross2 onClick={() => OpenCloseAddFaqModal(false)} />
        </div>

        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">Question:</div>
          <textarea
            className="addCategoryModalInputTextArea"
            defaultValue={editFaqData?.question ? editFaqData.question : ""}
            onChange={e => (question.current = e.target.value)}
            placeholder="Enter Question"
          />
        </div>
        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">Answer: </div>
          <textarea
            className="addCategoryModalInputTextArea"
            defaultValue={editFaqData?.answer ? editFaqData.answer : ""}
            onChange={e => (answer.current = e.target.value)}
            placeholder="Enter Answer"
          />
        </div>

        <div className="prductsOnSiteButtonContainer addCategoryModalButtonContainer">
          {addFaqLoading ? (
            <CircularLoader />
          ) : (
            <div className="cancelButton" onClick={handleAddEditFaq}>
              {modalType === "add" ? "Add" : "Edit"} FAQ
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FaqPage;
