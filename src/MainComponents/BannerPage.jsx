import { useEffect, useState } from "react";
import { BsNutFill, BsPlusLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../App";
import { CircularLoader } from "./Loader";

const BannerPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bannerList, setBannerList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [bannerUploadLoading, setBannerUploadLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/banner/all`)
      .then(res => res.json())
      .then(result => {
        const imagePreviewData = { ...imagePreviewObj };
        if (result.status === "success") {
          // setBannerList(result.data.banners);
          result.data.banners.map((item, index) => {
            imagePreviewData[`imagePreview${index + 1}`] = {
              edit: false,
              url: item.bannerImage.url,
            };
          });
          setimagePreviewObj(imagePreviewData);
          // console.log(imagePreviewData);
        } else toast.error(result.error.message);
      })
      .catch(err => {
        console.log(err);
        toast.info("Internal server error");
      });
  }, []);

  const [imagePreviewObj, setimagePreviewObj] = useState({
    imagePreview1: {
      edit: false,
      url: null,
    },
    imagePreview2: {
      edit: false,
      url: null,
    },
    imagePreview3: {
      edit: false,
      url: null,
    },
    imagePreview4: {
      edit: false,
      url: null,
    },
  });

  const [imagePreviewDesignObj, setimagePreviewDesignObj] = useState({
    imageDesignPreview1: {
      edit: false,
      url: null,
    },
    imageDesignPreview2: {
      edit: false,
      url: null,
    },
    imageDesignPreview3: {
      edit: false,
      url: null,
    },
  });
  const handleFileChange = e => {
    const selected = e.target.files[0];
    // console.log(selected);
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview1: {
          edit: true,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChange2 = e => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview2(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview2: {
          edit: true,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChange3 = e => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview3(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview3: {
          edit: true,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChange4 = e => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview4(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview4: {
          edit: true,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };

  const handleFileChangeDesign = e => {
    const selected = e.target.files[0];
    // console.log(selected);
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview(reader.result);
      setimagePreviewDesignObj({
        ...imagePreviewDesignObj,
        imageDesignPreview1: {
          edit: true,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChangeDesign2 = e => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview2(reader.result);
      setimagePreviewDesignObj({
        ...imagePreviewDesignObj,
        imageDesignPreview2: {
          edit: true,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChangeDesign3 = e => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview3(reader.result);
      setimagePreviewDesignObj({
        ...imagePreviewDesignObj,
        imageDesignPreview3: {
          edit: true,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };

  const handleAddBannerSubmit = () => {
    postImage();
  };

  const postImage = async () => {
    setBannerUploadLoading(true);
    const newData = [];
    const promises = Object.keys(imagePreviewObj).map(async item => {
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
            .then(res => res.json())
            .then(data => {
              console.log(data);
              newData.push({ bannerImage: { url: data.url } });
            })
            .catch(err => console.log(err));
        }
      } else {
        if (imagePreviewObj[item].url) {
          newData.push({ bannerImage: { url: imagePreviewObj[item].url } });
        }
      }
      return Promise.resolve();
    });
    console.log({ newData });
    // setdisplayImages(newData2);
    await Promise.all(promises);

    handlePostBannerImages(newData);
  };

  const handlePostBannerImages = async data => {
    console.log(data);
    fetch(`${process.env.REACT_APP_API_URI}/admin/banner/add`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({ banners: data }),
    })
      .then(res => res.json())
      .then(result => {
        const imagePreviewData = {
          imagePreview1: {
            edit: false,
            url: null,
          },
          imagePreview2: {
            edit: false,
            url: null,
          },
          imagePreview3: {
            edit: false,
            url: null,
          },
          imagePreview4: {
            edit: false,
            url: null,
          },
        };
        if (result.status === "success") {
          result.data.banners.map((item, index) => {
            imagePreviewData[`imagePreview${index + 1}`] = {
              edit: false,
              url: item.bannerImage.url,
            };
          });
          setimagePreviewObj(imagePreviewData);
          toast.success(result.data.message);
        } else toast.error(result.error.message);
        setBannerUploadLoading(false);
      })
      .catch(err => {
        console.log(err);
        setBannerUploadLoading(false);
        toast.info("Internal server error.");
      });
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
        <Link to="/CouponPage">
          <div className="adminNavbarItems">
            Coupons <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>

        <div className="adminNavbarItems">
          Banner <div className="adminNavbarItemsActiveline"></div>
        </div>
        <Link to="/TrendingPage">
          <div className="adminNavbarItems">
            Trending <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>

        <div className="adminLogoutButton">
          Logout <div className="adminNavbarItemsUnActiveline "></div>
        </div>
        <div className="adminPagemainContainer">
          <div className="addarticleHeading">Banner Page</div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Banner 1</div>
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
                  onChange={e => handleFileChange(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewObj.imagePreview1.url}
                    alt=""
                    className="imagePreviewImageBanner"
                  />
                  <div
                    className="imagePreviewRemove"
                    onClick={() => {
                      // setImagePreview(null);
                      setimagePreviewObj({
                        ...imagePreviewObj,
                        imagePreview1: { edit: true, url: null },
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
            <div className="addArticleFeildHeader">Banner 2</div>
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
                  onChange={e => handleFileChange2(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewObj.imagePreview2.url}
                    alt=""
                    className="imagePreviewImageBanner"
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
            <div className="addArticleFeildHeader">Banner 3</div>
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
                  onChange={e => handleFileChange3(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewObj.imagePreview3.url}
                    alt=""
                    className="imagePreviewImageBanner"
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
            <div className="addArticleFeildHeader">Banner 4</div>
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
                  onChange={e => handleFileChange4(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewObj.imagePreview4.url}
                    alt=""
                    className="imagePreviewImageBanner"
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
          {bannerUploadLoading ? (
            <CircularLoader />
          ) : (
            <div className="addArticleButton" onClick={handleAddBannerSubmit}>
              Add Banners
            </div>
          )}
          {/* <div className="addArticleButton" onClick={handleAddBannerSubmit}>
            Add Banners
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BannerPage;
