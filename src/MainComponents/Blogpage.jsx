import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./Blogpage.css";
import { BsPlusLg } from "react-icons/bs";
import { useContext, useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import RichTextEditor from "react-rte";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { UserContext } from "../App";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftjsToHtml from "draftjs-to-html";
import { convertFromHTML } from "draft-js";
import { CircularLoader } from "./Loader";
import * as DOMPurify from "dompurify";

const BlogPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { dispatch } = useContext(UserContext);
  const navigation = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [addBlogModal, setAddBlogModal] = useState(false);
  const [blogImagePreview, setBlogImagePreview] = useState({
    edit: false,
    url: null,
    file: null,
  });
  const [blogList, setBlogList] = useState([]);
  const [defaultBlogList, setDefaultBlogList] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editBlogData, setEditBlogData] = useState({});
  const [addBlogLoading, setAddBlogLoading] = useState(false);
  const title = useRef("");
  const content = useRef("");

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/blog/all`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          setBlogList(result.data.blogs);
          setDefaultBlogList(result.data.blogs);
        } else {
          toast.info(result.error.message);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const result = draftjsToHtml(convertToRaw(editorState.getCurrentContent()));
    content.current = result;
  };

  const handleAddEditSubmit = (blogId) => {
    setAddBlogLoading(true);
    if (modalType === "add") {
      postBlogImage(modalType);
    } else {
      postBlogImage(modalType, blogId);
    }
  };

  const postBlogImage = async (type, blogId) => {
    if (type === "add") handleAddBlog();
    else handleEditBlog(blogId);
    return null;
    const displayImage = [];

    if (blogImagePreview.edit) {
      const data = new FormData();
      data.append(
        "file",
        blogImagePreview?.url ? blogImagePreview.url.toString() : ""
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
          displayImage.push({ url: data.url });
        })
        .catch((err) => console.log(err));
    } else {
      if (blogImagePreview.url)
        displayImage.push({ url: blogImagePreview.url });
    }
  };

  const handleAddBlog = async () => {
    var formdata = new FormData();
    formdata.append(
      "image",
      blogImagePreview?.file,
      blogImagePreview.file.filename
    );
    formdata.append("title", title.current);
    formdata.append("content", content.current);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URI}/admin/blog/add`, requestOptions)
      .then((response) => response.text())
      .then((resu) => {
        let result = JSON.parse(resu);
        if (result.status === "success") {
          const newBlogList = [result.data.blog, ...blogList];
          setBlogList(newBlogList);
          toast.success(result.data.message);
          setEditorState("");
          OpenCloseAddBlogModal(false);
        }
      })
      .catch((error) => console.log("error", error));
    return null;

    await fetch(`${process.env.REACT_APP_API_URI}/admin/blog/add`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        title: title.current,
        content: content.current,
        // displayImage,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          const newBlogList = [result.data.blog, ...blogList];
          setBlogList(newBlogList);
          toast.success(result.data.message);
          setEditorState("");
          OpenCloseAddBlogModal(false);
        } else toast.error(result.error.message);
      })
      .catch((err) => console.log(err));
    setAddBlogLoading(false);
  };

  const handleEditBlog = async (_id) => {
    var formdata = new FormData();
    if (blogImagePreview?.file != null) {
      formdata.append(
        "image",
        blogImagePreview?.file,
        blogImagePreview.file.filename
      );
    }
    formdata.append("title", title.current);
    formdata.append("content", content.current);
    formdata.append("displayImage", [{ url: blogImagePreview?.url }]);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    // fetch(`http://localhost:8080/blog/${_id}/edit`, requestOptions)
    fetch(`${process.env.REACT_APP_API_URI}/blog/${_id}/edit`, requestOptions)
      .then((response) => response.text())
      .then((resu) => {
        let result = JSON.parse(resu);
        if (result.status === "success") {
          const newBlogList = blogList.map((item) => {
            if (item._id == _id) return result.data.updatedBlog;
            else return item;
          });
          setBlogList(newBlogList);
          toast.success(result.data.message);
          setEditBlogData({});
          OpenCloseAddBlogModal(false);
        }
      })
      .catch((error) => console.log("error", error));

    return null;

    await fetch(`${process.env.REACT_APP_API_URI}/blog/${_id}/edit`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        title: title.current,
        content: content.current,
        // displayImage,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          const newBlogList = blogList.map((item) => {
            if (item._id == _id) return result.data.updatedBlog;
            else return item;
          });
          setBlogList(newBlogList);
          toast.success(result.data.message);
          setEditBlogData({});
          OpenCloseAddBlogModal(false);
        }
      })
      .catch((err) => console.log(err));
    setAddBlogLoading(false);
  };

  const handleDeleteBlog = (_id, title) => {
    if (
      window.confirm(
        `Are you sure yu want to delete blog: ${title.slice(0, 20)}...`
      )
    ) {
      fetch(`${process.env.REACT_APP_API_URI}/blog/${_id}/delete`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + user.token,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status === "success") {
            toast.success(result.data.message);
            const newBlogList = blogList.filter((item) => _id != item._id);
            setBlogList(newBlogList);
          } else toast.error(result.error.message);
        });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    navigation("/");
  };
  const OpenCloseAddBlogModal = (value) => {
    setAddBlogModal(value);
    if (!value) {
      setBlogImagePreview({ edit: false, url: null });
      title.current = "";
      content.current = "";
    }
  };
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setBlogImagePreview({ edit: true, url: reader.result, file: selected });
    };
    reader.readAsDataURL(selected);
  };

  const filterIt = (text) => {
    if (text == "" || text.trim() == "" || text.trim() == null) {
      setBlogList(defaultBlogList);
      return null;
    }
    const lowerText = text.toLowerCase();

    const filterItem = defaultBlogList.filter((item) => {
      const lowerName = item.title.toLowerCase();
      const match = lowerName.match(lowerText);
      // console.log(match);
      if (match != null) {
        return true;
      } else return false;
    });
    setBlogList(filterItem);
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

        <div className="adminNavbarItems">
          Blogs <div className="adminNavbarItemsActiveline"></div>
        </div>
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
          <div className="addarticleHeading">Blogs</div>
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search blogs by title"
              onChange={(e) => filterIt(e.target.value)}
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
                setModalType("add");
                setEditBlogData({});
                OpenCloseAddBlogModal(true);
              }}
            >
              <BsPlusLg style={{ marginRight: "4%" }} />
              Add Blog
            </div>
          </div>
          {blogList.map((item) => (
            <div className="eachOrderContainer" key={item._id}>
              <div className="orderDetailingContainer">
                <div className="itemName">{item.title}</div>
                <div className="blogImageContainer">
                  <img src={item.displayImage[0].url} />
                </div>
                <div
                  className="itemPrice"
                  style={{ textAlign: "left" }}
                  dangerouslySetInnerHTML={createMarkup(item.content)}
                ></div>
                {/* <div className="blogShowButton">Hide Blog</div> */}
                <div className="prductsOnSiteButtonContainer">
                  <div
                    className="cancelButton"
                    onClick={() => {
                      setEditBlogData(item);
                      setBlogImagePreview({
                        edit: false,
                        url: item.displayImage[0].url,
                      });
                      title.current = item.title;
                      content.current = item.content;
                      setModalType("edit");
                      OpenCloseAddBlogModal(true);
                    }}
                  >
                    Edit
                  </div>
                  <div
                    className="cancelButton"
                    onClick={() => handleDeleteBlog(item._id, item.title)}
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
        isOpen={addBlogModal}
        onRequestClose={() => {
          OpenCloseAddBlogModal(false);
          setModalType(null);
        }}
        className="modalContainerBlog"
      >
        <div className="addCategoryModalHeaderCnotainer">
          <div className="addCategoryModalHeader">Add Blog</div>
          <RxCross2
            onClick={() => {
              OpenCloseAddBlogModal(false);
              setModalType(null);
            }}
          />
        </div>

        <div className="addCategoryModalInputFeild">
          <div
            className="addCategoryModalInputLabel"
            style={{ marginRight: "1%" }}
          >
            Blog Image:{" "}
          </div>
          {!blogImagePreview.url ? (
            <div className="addArticleImageInputContainer">
              <label
                htmlFor="articleImageInput"
                className="addArticleImageInputLabel"
                style={{ padding: "4%" }}
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
                  src={blogImagePreview.url}
                  alt=""
                  className="imagePreviewImage"
                  style={{ aspectRatio: "3/2" }}
                />
                <div
                  className="imagePreviewRemove"
                  onClick={() => {
                    setBlogImagePreview({ edit: true, url: null });
                  }}
                >
                  Remove Image
                </div>
              </div>
            </>
          )}
        </div>
        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">Blog Title :</div>
          <textarea
            className="addCategoryModalInputTextArea"
            placeholder="Enter Blog Title"
            defaultValue={editBlogData?.title ? editBlogData.title : ""}
            onChange={(e) => (title.current = e.target.value)}
          />
        </div>
        <div className="addCategoryModalInputFeild">
          <div className="addCategoryModalInputLabel">Blog Body: </div>
          {/* <textarea
            className="addCategoryModalInputTextArea"
            placeholder="Enter Answer"
          /> */}
          <div className="addCategoryModalInputTextArea addCategoryModalInputBlog">
            <Editor
              // editorState={editorState}
              defaultEditorState={
                editBlogData?.content
                  ? EditorState.createWithContent(
                      ContentState.createFromBlockArray(
                        convertFromHTML(editBlogData.content)
                      )
                    )
                  : editorState
              }
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
              placeholder="Write your Blog.."
            />
          </div>
        </div>

        <div className="prductsOnSiteButtonContainer addCategoryModalButtonContainer">
          {addBlogLoading ? (
            <CircularLoader />
          ) : (
            <div
              className="cancelButton"
              onClick={() => {
                if (modalType == "add") handleAddEditSubmit();
                else handleAddEditSubmit(editBlogData._id);
              }}
            >
              {modalType == "add" ? "Add" : "Edit"} Blog
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BlogPage;
