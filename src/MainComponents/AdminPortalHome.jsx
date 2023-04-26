import React, { useContext, useEffect, useRef, useState } from "react";
import "./AdminPortalHome.css";
import "./AddCategoryModal.css";
import Image from "../Assests/landscape.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { BsPlusLg } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import { CircularLoader } from "./Loader";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import draftjsToHtml from "draftjs-to-html";

const AdminPortalHome = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const { dispatch } = useContext(UserContext);
  const navigation = useNavigate();

  const [imagePreviewObj, setimagePreviewObj] = useState({
    imagePreview1: {
      edit: false,
      file: null,
      url: location?.state?.displayImage[0]
        ? location?.state?.displayImage[0].url
        : null,
    },
    imagePreview2: {
      edit: false,
      file: null,
      url: location?.state?.displayImage[1]
        ? location?.state?.displayImage[1].url
        : null,
    },
    imagePreview3: {
      edit: false,
      file: null,
      url: location?.state?.displayImage[2]
        ? location?.state?.displayImage[2].url
        : null,
    },
    imagePreview4: {
      edit: false,
      file: null,
      url: location?.state?.displayImage[3]
        ? location?.state?.displayImage[3].url
        : null,
    },
    imagePreview5: {
      edit: false,
      file: null,
      url: location?.state?.displayImage[4]
        ? location?.state?.displayImage[4].url
        : null,
    },
  });
  const [categoryImagePreview, setCategoryImagePreview] = useState({
    url: null,
  });

  const [categoryType, setCategoryType] = useState(
    location?.state?.product_category ? location.state.product_category : {}
  );
  const [activeColor, setactiveColor] = useState(
    location?.state?.color ? location?.state?.color : {}
  );
  const [categoryList, setCategoryList] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [addProductLoading, setAddProductLoading] = useState(false);
  const [addCetgoryLoading, setAddCetgoryLoading] = useState(false);
  const [allImages, setallImages] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editBlogData, setEditBlogData] = useState({});
  const [addColorLoading, setAddColorLoading] = useState(false);
  const displayName = useRef(
    location?.state?.displayName ? location.state.displayName : ""
  );
  const price = useRef(location?.state?.price ? location.state.price : "");
  const brand_title = useRef(
    location?.state?.brand_title ? location.state.brand_title : ""
  );
  const availability = useRef(
    location?.state?.availability ? location.state.availability : ""
  );
  const color_name = useRef("");
  const hexcode = useRef("");
  const categoryName = useRef("");
  const categoryDescription = useRef("");
  const prodDescriptionContent = useRef(
    location?.state?.description ? location.state.description : ""
  );

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/product/category/all`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success")
          setCategoryList(result.data.categories);
        else console.log(result.error);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/product/color/all`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") setColorList(result.data.colors);
        else console.log(result.error);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    navigation("/");
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const result = draftjsToHtml(convertToRaw(editorState.getCurrentContent()));
    prodDescriptionContent.current = result;
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    // console.log(selected);
    // setallImages([...allImages, e.target.files[0]]);
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview1: {
          edit: true,
          url: reader.result,
          file: selected,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChange2 = (e) => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview2(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview2: {
          edit: true,
          file: selected,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChange3 = (e) => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview3(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview3: {
          edit: true,
          file: selected,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChange4 = (e) => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview4(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview4: {
          edit: true,
          url: reader.result,
          file: selected,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChange5 = (e) => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview4(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview5: {
          edit: true,
          url: reader.result,
          file: selected,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };

  const handleCategoryImageChange = (e) => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setCategoryImagePreview({ url: reader.result });
    };
    reader.readAsDataURL(selected);
  };

  const handlePostType = (item) => {
    setCategoryType(item);
  };

  const handleActiveColor = (colorObj) => {
    setactiveColor(colorObj);
  };

  const handleAddEditSubmit = async (type) => {
    setAddProductLoading(true);
    if (type === "add") {
      await postImage(type);
    } else {
      await postImage(type);
    }
  };
  console.log(imagePreviewObj, "<<<this is imagepreview");
  const postImage = async (requestType) => {
    if (requestType === "add") addProduct();
    else editProduct();
    // addProduct();
    return null;
    const newData2 = [];
    const promises = Object.keys(imagePreviewObj).map(async (item) => {
      console.log(imagePreviewObj[item]);
      if (imagePreviewObj[item].edit) {
        if (imagePreviewObj[item].url) {
          const data = new FormData();
          data.append("file", imagePreviewObj[item].url.toString());
          data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
          data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
          data.append("folder", process.env.REACT_APP_FOLDER);

          await fetch(`${process.env.REACT_APP_CLOUDINARY_URI}`, {
            method: "post",
            body: data,
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              newData2.push({ url: data.url });
            })
            .catch((err) => console.log(err));
        }
      } else {
        if (imagePreviewObj[item].url) {
          newData2.push({ url: imagePreviewObj[item].url });

          // const newData = [
          //   ...displayImages,
          //   { url: imagePreviewObj[item].url },
          // ];
          // setdisplayImages(newData);
          // setdisplayImages([
          //   ...displayImages,
          //   {
          //     url: imagePreviewObj[item].url,
          //   },
          // ]);
        }
        // console.log(displayImages, 'at post image edit false push');
      }
      return Promise.resolve();
    });
    console.log({ newData2 });
    // setdisplayImages(newData2);
    await Promise.all(promises);

    // if (requestType === "add") addProduct(newData2);
    // else editProduct(newData2);
  };

  const addProduct = async (displayImages) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + user.token);

    var formdata = new FormData();
    formdata.append("displayName", displayName.current);
    formdata.append("brand_title", brand_title.current);
    formdata.append("description", prodDescriptionContent.current);
    formdata.append("color", activeColor._id);
    formdata.append("availability", availability.current);
    formdata.append("price", price.current);
    formdata.append("product_category", categoryType._id);

    if (imagePreviewObj.imagePreview1?.file != null) {
      formdata.append(
        "image",
        imagePreviewObj?.imagePreview1?.file,
        imagePreviewObj?.imagePreview1?.file.name
      );
    }
    if (imagePreviewObj.imagePreview2?.file != null) {
      formdata.append(
        "image",
        imagePreviewObj?.imagePreview2?.file,
        imagePreviewObj?.imagePreview2?.file.name
      );
    }
    if (imagePreviewObj.imagePreview3?.file != null) {
      formdata.append(
        "image",
        imagePreviewObj?.imagePreview3?.file,
        imagePreviewObj?.imagePreview3?.file.name
      );
    }
    if (imagePreviewObj.imagePreview4?.file != null) {
      formdata.append(
        "image",
        imagePreviewObj?.imagePreview4?.file,
        imagePreviewObj?.imagePreview4?.file.name
      );
    }
    if (imagePreviewObj.imagePreview5?.file != null) {
      formdata.append(
        "image",
        imagePreviewObj?.imagePreview5?.file,
        imagePreviewObj?.imagePreview5?.file.name
      );
    }

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    console.log("uploading data");
    // fetch("http://localhost:8080" + "/admin/product/add", requestOptions)
    fetch(process.env.REACT_APP_API_URI + "/admin/product/add", requestOptions)
      .then((response) => response.text())
      .then((result1) => {
        const result = JSON.parse(result1);
        console.log(result);

        if (result.status === "success") {
          console.log(result);
          navigation("/Products");
        } else {
          toast.error(result.error.message);
          console.log(result.error);
        }
      })
      .catch((error) => console.log("error", error));
  };
  const addProduct1 = async (displayImages) => {
    await fetch(`${process.env.REACT_APP_API_URI}/admin/product/add`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        displayName: displayName.current,
        brand_title: brand_title.current,
        description: prodDescriptionContent.current,
        price: price.current,
        availability: availability.current,
        displayImage: displayImages,
        product_category: categoryType._id,
        color: activeColor._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          console.log(result);
          navigation("/Products");
        } else {
          toast.error(result.error.message);
          console.log(result.error);
        }
      })
      .catch((err) => console.log(err));
    setAddProductLoading(false);
  };

  const editProduct = async (displayImages) => {
    console.log(imagePreviewObj, "<<<thisiseditproduct");

    let prevImages = [];
    let newFiles = [];
    if (
      imagePreviewObj.imagePreview1.file == null &&
      imagePreviewObj.imagePreview1.url != null
    ) {
      // newFiles=[...newFiles,imagePreviewObj.image]
      prevImages = [...prevImages, { url: imagePreviewObj.imagePreview1.url }];
    }
    if (
      imagePreviewObj.imagePreview2.file == null &&
      imagePreviewObj.imagePreview2.url != null
    ) {
      // newFiles=[...newFiles,imagePreviewObj.image]
      prevImages = [...prevImages, { url: imagePreviewObj.imagePreview2.url }];
    }
    if (
      imagePreviewObj.imagePreview3.file == null &&
      imagePreviewObj.imagePreview3.url != null
    ) {
      // newFiles=[...newFiles,imagePreviewObj.image]
      prevImages = [...prevImages, { url: imagePreviewObj.imagePreview3.url }];
    }
    if (
      imagePreviewObj.imagePreview4.file == null &&
      imagePreviewObj.imagePreview4.url != null
    ) {
      // newFiles=[...newFiles,imagePreviewObj.image]
      prevImages = [...prevImages, { url: imagePreviewObj.imagePreview4.url }];
    }
    if (
      imagePreviewObj.imagePreview5.file == null &&
      imagePreviewObj.imagePreview5.url != null
    ) {
      // newFiles=[...newFiles,imagePreviewObj.image]
      prevImages = [...prevImages, { url: imagePreviewObj.imagePreview5.url }];
    }
    console.log(prevImages, "<<<thisisprevimage");
    // return null;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + user.token);

    var formdata = new FormData();
    formdata.append("displayName", displayName.current);
    formdata.append("brand_title", brand_title.current);
    formdata.append("description", prodDescriptionContent.current);
    formdata.append("color", activeColor._id);
    formdata.append("availability", availability.current);
    formdata.append("price", price.current);
    formdata.append("prevImage", JSON.stringify(prevImages));
    formdata.append("product_category", categoryType._id);

    if (imagePreviewObj.imagePreview1?.file != null) {
      formdata.append(
        "image",
        imagePreviewObj?.imagePreview1?.file,
        imagePreviewObj?.imagePreview1?.file.name
      );
    }
    if (imagePreviewObj.imagePreview2?.file != null) {
      formdata.append(
        "image",
        imagePreviewObj?.imagePreview2?.file,
        imagePreviewObj?.imagePreview2?.file.name
      );
    }
    if (imagePreviewObj.imagePreview3?.file != null) {
      formdata.append(
        "image",
        imagePreviewObj?.imagePreview3?.file,
        imagePreviewObj?.imagePreview3?.file.name
      );
    }
    if (imagePreviewObj.imagePreview4?.file != null) {
      formdata.append(
        "image",
        imagePreviewObj?.imagePreview4?.file,
        imagePreviewObj?.imagePreview4?.file.name
      );
    }
    if (imagePreviewObj.imagePreview5?.file != null) {
      formdata.append(
        "image",
        imagePreviewObj?.imagePreview5?.file,
        imagePreviewObj?.imagePreview5?.file.name
      );
    }

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    console.log("uploading data");
    // fetch(process.env.REACT_APP_API_URI + "/admin/product/add", requestOptions)
    fetch(
      `${process.env.REACT_APP_API_URI}/admin/product/${location.state._id}/edit`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result1) => {
        const result = JSON.parse(result1);
        console.log(result);

        if (result.status === "success") {
          console.log(result);
          navigation("/Products");
        } else {
          toast.error(result.error.message);
          console.log(result.error);
        }
      })
      .catch((error) => console.log("error", error));

    return null;
    // console.log(displayImages, "before edit product");
    // `${process.env.REACT_APP_API_URI}/admin/product/${location.state._id}/edit`,

    return null;
    await fetch(
      `http://localhost:8080/admin/product/${location.state._id}/edit`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify({
          displayName: displayName.current,
          brand_title: brand_title.current,
          description: prodDescriptionContent.current,
          price: price.current,
          availability: availability.current,
          displayImage: displayImages,
          product_category: categoryType._id,
          color: activeColor._id,
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          console.log(result);
          navigation("/Products");
        } else {
          toast.error(result.error.message);
          console.log(result.error);
        }
      })
      .catch((err) => console.log(err));
    setAddProductLoading(false);
  };

  const handleAddColor = async () => {
    setAddColorLoading(true);
    await fetch(`${process.env.REACT_APP_API_URI}/product/color/add`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        color_name: color_name.current,
        hexcode: hexcode.current,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          const newColorList = [...colorList, result.data.product_color];
          setColorList(newColorList);
          toast.success(`Color: ${color_name.current} added successfully.`);
          CloseColourCategory();
        } else toast.error(result.error.message);
      })
      .catch((err) => console.log(err));
    setAddColorLoading(false);
  };

  const handleAddProductCategory = async (displayImage) => {
    setAddCetgoryLoading(true);
    await fetch(`${process.env.REACT_APP_API_URI}/product/category/add`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        name: categoryName.current,
        description: categoryDescription.current,
        displayImage,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          const newCategList = [...categoryList, result.data.product_category];
          setCategoryList(newCategList);
          toast.success(result.data.message);
          CloseAddCategory();
        } else toast.error(result.error.message);
      })
      .catch((err) => console.log(err));
    setAddCetgoryLoading(false);
  };

  const postProductCategoryImage = async () => {
    const data = new FormData();
    data.append(
      "file",
      categoryImagePreview?.url ? categoryImagePreview.url.toString() : ""
    );
    data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
    data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
    data.append("folder", process.env.REACT_APP_FOLDER);

    await fetch(`${process.env.REACT_APP_CLOUDINARY_URI}`, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return toast.error(data.error.message);
        const displayImage = { url: data.url };
        handleAddProductCategory(displayImage);
      })
      .catch((err) => console.log(err));
  };

  // modal functionality
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [addColourModalOpen, setAddColourModalOpen] = useState(false);

  const OpenAddCategory = () => {
    setAddCategoryModalOpen(true);
  };
  const CloseAddCategory = () => {
    setAddCategoryModalOpen(false);
    setCategoryImagePreview({ url: null });
  };

  const OpenColourCategory = () => {
    setAddColourModalOpen(true);
  };
  const CloseColourCategory = () => {
    setAddColourModalOpen(false);
  };

  const AddProductButton = () => {
    return addProductLoading ? (
      <CircularLoader />
    ) : (
      <div
        className="addArticleButton"
        onClick={() => handleAddEditSubmit("add")}
      >
        Add Product
      </div>
    );
  };

  const EditProductButton = () => {
    return addProductLoading ? (
      <CircularLoader />
    ) : (
      <div
        className="addArticleButton"
        onClick={() => handleAddEditSubmit("edit")}
      >
        Edit Product
      </div>
    );
  };

  return (
    <div>
      <ToastContainer />
      <div className="adminPageNavbar">
        <div className="adminBrandnameNavbar">Aalna | Admin Page</div>
        <div className="adminNavbarItems">
          Add Product <div className="adminNavbarItemsActiveline"></div>
        </div>
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
          <div className="addarticleHeading">Add Product</div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Name</div>
            <div className="addArticleInputContainer">
              <input
                type="text"
                className="addArticleInput"
                onChange={(e) => (displayName.current = e.target.value)}
                defaultValue={
                  location?.state?.displayName ? location.state.displayName : ""
                }
              />
            </div>
          </div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Brand name</div>
            <div className="addArticleInputContainer">
              <input
                type="text"
                className="addArticleInput"
                onChange={(e) => (brand_title.current = e.target.value)}
                defaultValue={
                  location?.state?.brand_title ? location.state.brand_title : ""
                }
              />
            </div>
          </div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Price</div>
            <div className="addArticleInputContainer">
              <input
                type="number"
                className="addArticleInput"
                onChange={(e) => (price.current = e.target.value)}
                defaultValue={
                  location?.state?.price ? location.state.price : ""
                }
                placeholder="Enter only integer"
              />
            </div>
          </div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Availability</div>
            <div className="addArticleInputContainer">
              <input
                type="number"
                className="addArticleInput"
                onChange={(e) => (availability.current = e.target.value)}
                defaultValue={
                  location?.state?.availability
                    ? location.state.availability
                    : ""
                }
                placeholder="Enter only positive integer, in case of 0 product will be shown out of stock on site"
              />
            </div>
          </div>
          {/* <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Description</div>
            <div className="addArticleInputContainer">
              <textarea
                type="text"
                className="addArticletextarea"
                onChange={(e) => (description.current = e.target.value)}
                defaultValue={
                  location?.state?.description ? location.state.description : ""
                }
              />
            </div>
          </div> */}
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Description</div>
            <div className="addArticleInputContainer">
              <Editor
                // editorState={editorState}
                defaultEditorState={
                  prodDescriptionContent.current
                    ? EditorState.createWithContent(
                        ContentState.createFromBlockArray(
                          convertFromHTML(prodDescriptionContent.current)
                        )
                      )
                    : editorState
                }
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
                // placeholder="Write your Blog.."
              />
            </div>
          </div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Image1</div>
            {/* {!imagePreview ? ( */}
            {!imagePreviewObj.imagePreview1.url ? (
              <div className="addArticleImageInputContainer">
                <label
                  htmlFor="articleImageInput"
                  className="addArticleImageInputLabel"
                >
                  Choose File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="articleImageInput"
                  className="addArticleInput addArticleImageInput"
                  onChange={(e) => handleFileChange(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewObj.imagePreview1.url}
                    alt=""
                    className="imagePreviewImage"
                  />
                  <div
                    className="imagePreviewRemove"
                    onClick={() => {
                      // setImagePreview(null);
                      setimagePreviewObj({
                        ...imagePreviewObj,
                        imagePreview1: { edit: true, url: null, file: null },
                      });
                    }}
                  >
                    Remove Image
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Image2</div>
            {/* {!imagePreview2 ? ( */}
            {!imagePreviewObj.imagePreview2.url ? (
              <div className="addArticleImageInputContainer">
                <label
                  htmlFor="articleImageInput"
                  className="addArticleImageInputLabel"
                >
                  Choose File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="articleImageInput"
                  className="addArticleInput addArticleImageInput"
                  onChange={(e) => handleFileChange2(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewObj.imagePreview2.url}
                    alt=""
                    className="imagePreviewImage"
                  />
                  <div
                    className="imagePreviewRemove"
                    onClick={() => {
                      // setImagePreview2(null);
                      setimagePreviewObj({
                        ...imagePreviewObj,
                        imagePreview2: {
                          edit: true,
                          url: null,
                          file: null,
                        },
                      });
                    }}
                  >
                    Remove Image
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Image3</div>
            {/* {!imagePreview3 ? ( */}
            {!imagePreviewObj.imagePreview3.url ? (
              <div className="addArticleImageInputContainer">
                <label
                  htmlFor="articleImageInput"
                  className="addArticleImageInputLabel"
                >
                  Choose File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="articleImageInput"
                  className="addArticleInput addArticleImageInput"
                  onChange={(e) => handleFileChange3(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewObj.imagePreview3.url}
                    alt=""
                    className="imagePreviewImage"
                  />
                  <div
                    className="imagePreviewRemove"
                    onClick={() => {
                      // setImagePreview3(null);
                      setimagePreviewObj({
                        ...imagePreviewObj,
                        imagePreview3: {
                          edit: true,
                          url: null,
                          file: null,
                        },
                      });
                    }}
                  >
                    Remove Image
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Image4</div>
            {/* {!imagePreview4 ? ( */}
            {!imagePreviewObj.imagePreview4.url ? (
              <div className="addArticleImageInputContainer">
                <label
                  htmlFor="articleImageInput"
                  className="addArticleImageInputLabel"
                >
                  Choose File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="articleImageInput"
                  className="addArticleInput addArticleImageInput"
                  onChange={(e) => handleFileChange4(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewObj.imagePreview4.url}
                    alt=""
                    className="imagePreviewImage"
                  />
                  <div
                    className="imagePreviewRemove"
                    onClick={() => {
                      // setImagePreview4(null);
                      setimagePreviewObj({
                        ...imagePreviewObj,
                        imagePreview4: {
                          edit: true,
                          url: null,
                          file: null,
                        },
                      });
                    }}
                  >
                    Remove Image
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Image5</div>
            {/* {!imagePreview4 ? ( */}
            {!imagePreviewObj.imagePreview5.url ? (
              <div className="addArticleImageInputContainer">
                <label
                  htmlFor="articleImageInput"
                  className="addArticleImageInputLabel"
                >
                  Choose File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="articleImageInput"
                  className="addArticleInput addArticleImageInput"
                  onChange={(e) => handleFileChange5(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewObj.imagePreview5.url}
                    alt=""
                    className="imagePreviewImage"
                  />
                  <div
                    className="imagePreviewRemove"
                    onClick={() => {
                      // setImagePreview4(null);
                      setimagePreviewObj({
                        ...imagePreviewObj,
                        imagePreview5: {
                          edit: true,
                          url: null,
                          file: null,
                        },
                      });
                    }}
                  >
                    Remove Image
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Category</div>
            <div className="addArticleTypeContainer">
              {categoryList.map((item) => (
                <div
                  key={item._id}
                  className={
                    item.name == categoryType.name
                      ? "addArticleTypeActive"
                      : "addArticleType"
                  }
                  onClick={() => {
                    categoryType.name != item.name && handlePostType(item);
                  }}
                >
                  {item.name}
                </div>
              ))}
              <div
                className="addArticleTypeAdder"
                onClick={OpenAddCategory}
                style={{ cursor: "pointer" }}
              >
                <BsPlusLg style={{ marginRight: "4%" }} />
                Add Category
              </div>
            </div>
          </div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Colour</div>
            <div className="addArticleTypeContainer">
              {colorList.map((item) => (
                <div
                  key={item._id}
                  className={
                    activeColor.color_name == item.color_name
                      ? "addArticleTypeActive"
                      : "addArticleType"
                  }
                  onClick={() => {
                    activeColor.color_name != item.color_name &&
                      handleActiveColor(item);
                  }}
                >
                  {item.color_name}
                </div>
              ))}
              <div className="addArticleTypeAdder" onClick={OpenColourCategory}>
                <BsPlusLg style={{ marginRight: "4%" }} />
                Add Colour
              </div>
            </div>
          </div>
          {location?.state?._id ? <EditProductButton /> : <AddProductButton />}
          {/* <div className='addArticleButton'>Add Product</div> */}
        </div>
      </div>
      <Modal
        isOpen={addCategoryModalOpen}
        onRequestClose={CloseAddCategory}
        className="modalContainer"
      >
        <div className="addCategoryModalHeaderCnotainer">
          <div className="addCategoryModalHeader">Add Category</div>
          <RxCross2 onClick={CloseAddCategory} />
        </div>

        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">Category Name:</div>
          <input
            className="addCategoryModalInput"
            onChange={(e) => (categoryName.current = e.target.value)}
          />
        </div>
        <div className="addCategoryModalInputFeild">
          <div
            className="addCategoryModalInputLabel"
            style={{ marginRight: "1%" }}
          >
            Category Image:{" "}
          </div>
          {!categoryImagePreview.url ? (
            <div className="addArticleImageInputContainer">
              <label
                htmlFor="categoryImageInput"
                className="addArticleImageInputLabel"
                style={{ padding: "4%" }}
              >
                Choose File
              </label>
              <input
                type="file"
                accept="image/*"
                id="categoryImageInput"
                className="addArticleInput addArticleImageInput"
                onChange={(e) => handleCategoryImageChange(e)}
              />
            </div>
          ) : (
            <>
              <div className="imagePreviewBox">
                <img
                  src={categoryImagePreview.url}
                  alt=""
                  className="imagePreviewImage"
                />
                <div
                  className="imagePreviewRemove"
                  onClick={() => {
                    setCategoryImagePreview({
                      url: null,
                      file: null,
                    });
                  }}
                >
                  Remove Image
                </div>
              </div>
            </>
          )}
        </div>
        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">
            Category Description:{" "}
          </div>
          <textarea
            className="addCategoryModalInputTextArea"
            placeholder="Write a Short Description "
            onChange={(e) => (categoryDescription.current = e.target.value)}
          />
        </div>
        <div className="prductsOnSiteButtonContainer addCategoryModalButtonContainer">
          {addCetgoryLoading ? (
            <CircularLoader />
          ) : (
            <div className="cancelButton" onClick={postProductCategoryImage}>
              Add Category
            </div>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={addColourModalOpen}
        onRequestClose={CloseColourCategory}
        className="modalContainer"
      >
        <div className="addCategoryModalHeaderCnotainer">
          <div className="addCategoryModalHeader">Add Colour</div>
          <RxCross2 onClick={CloseColourCategory} />
        </div>

        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">Colour Name:</div>
          <input
            className="addCategoryModalInput"
            placeholder="Enter Colour Name"
            onChange={(e) => (color_name.current = e.target.value)}
          />
        </div>
        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">Colour HexCode: </div>
          <input
            className="addCategoryModalInput"
            placeholder="Enter full colour Hexcode (e.g. #000000)"
            onChange={(e) => (hexcode.current = e.target.value)}
          />
        </div>
        <div className="prductsOnSiteButtonContainer addCategoryModalButtonContainer">
          {addColorLoading ? (
            <CircularLoader />
          ) : (
            <div className="cancelButton" onClick={handleAddColor}>
              Add Colour
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminPortalHome;
