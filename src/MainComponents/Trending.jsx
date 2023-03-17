import { useEffect, useState } from "react";
import { BsNutFill, BsPlusLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../App";
import { CircularLoader } from "./Loader";

const TrendingPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bannerList, setBannerList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [bannerUploadLoading, setBannerUploadLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/trending_product/all`)
      .then(res => res.json())
      .then(result => {
        const imagePreviewData = { ...imagePreviewDesignObj };
        if (result.status === "success") {
          // setBannerList(result.data.banners);
          result.data.site_trending_products.map((item, index) => {
            imagePreviewData[`imageDesignPreview${index + 1}`] = {
              edit: false,
              url: item.productImage.url,
            };
          });
          console.log(imagePreviewData);
          setimagePreviewDesignObj(imagePreviewData);
          // console.log(imagePreviewData);
        } else toast.error(result.error.message);
      })
      .catch(err => {
        console.log(err);
        toast.info("Internal server error");
      });
  }, []);

  // const [imagePreviewObj, setimagePreviewObj] = useState({
  //   imagePreview1: {
  //     edit: false,
  //     url: null,
  //   },
  //   imagePreview2: {
  //     edit: false,
  //     url: null,
  //   },
  //   imagePreview3: {
  //     edit: false,
  //     url: null,
  //   },
  //   imagePreview4: {
  //     edit: false,
  //     url: null,
  //   },
  // });

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
  // const handleFileChange = (e) => {
  //   const selected = e.target.files[0];
  //   // console.log(selected);
  //   let reader = new FileReader();
  //   reader.onloadend = () => {
  //     // setImagePreview(reader.result);
  //     setimagePreviewObj({
  //       ...imagePreviewObj,
  //       imagePreview1: {
  //         edit: true,
  //         url: reader.result,
  //       },
  //     });
  //     // console.log(reader.result);
  //   };
  //   reader.readAsDataURL(selected);
  // };
  // const handleFileChange2 = (e) => {
  //   const selected = e.target.files[0];
  //   let reader = new FileReader();
  //   reader.onloadend = () => {
  //     // setImagePreview2(reader.result);
  //     setimagePreviewObj({
  //       ...imagePreviewObj,
  //       imagePreview2: {
  //         edit: true,
  //         url: reader.result,
  //       },
  //     });
  //     // console.log(reader.result);
  //   };
  //   reader.readAsDataURL(selected);
  // };
  // const handleFileChange3 = (e) => {
  //   const selected = e.target.files[0];
  //   let reader = new FileReader();
  //   reader.onloadend = () => {
  //     // setImagePreview3(reader.result);
  //     setimagePreviewObj({
  //       ...imagePreviewObj,
  //       imagePreview3: {
  //         edit: true,
  //         url: reader.result,
  //       },
  //     });
  //     // console.log(reader.result);
  //   };
  //   reader.readAsDataURL(selected);
  // };
  // const handleFileChange4 = (e) => {
  //   const selected = e.target.files[0];
  //   let reader = new FileReader();
  //   reader.onloadend = () => {
  //     // setImagePreview4(reader.result);
  //     setimagePreviewObj({
  //       ...imagePreviewObj,
  //       imagePreview4: {
  //         edit: true,
  //         url: reader.result,
  //       },
  //     });
  //     // console.log(reader.result);
  //   };
  //   reader.readAsDataURL(selected);
  // };

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

  const handleAddImageSubmit = () => {
    postImage();
  };

  const postImage = async () => {
    setBannerUploadLoading(true);
    const newData = [];
    const promises = Object.keys(imagePreviewDesignObj).map(async item => {
      if (imagePreviewDesignObj[item].edit) {
        if (imagePreviewDesignObj[item].url) {
          const data = new FormData();
          data.append("file", imagePreviewDesignObj[item].url.toString());
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
              newData.push({ productImage: { url: data.url } });
            })
            .catch(err => console.log(err));
        }
      } else {
        if (imagePreviewDesignObj[item].url) {
          newData.push({
            productImage: { url: imagePreviewDesignObj[item].url },
          });
        }
      }
      return Promise.resolve();
    });
    console.log({ newData });
    // setdisplayImages(newData2);
    await Promise.all(promises);

    handlePostTrendProductImages(newData);
  };

  const handlePostTrendProductImages = async data => {
    console.log(data);
    fetch(`${process.env.REACT_APP_API_URI}/admin/trending_product/add`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({ productImages: data }),
    })
      .then(res => res.json())
      .then(result => {
        const imagePreviewDesignData = {
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
        };
        if (result.status === "success") {
          result.data.site_trending_product.map((item, index) => {
            imagePreviewDesignData[`imageDesignPreview${index + 1}`] = {
              edit: false,
              url: item.productImage.url,
            };
          });
          setimagePreviewDesignObj(imagePreviewDesignData);
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
        <Link to="/BannerPage">
          <div className="adminNavbarItems">
            Banner <div className="adminNavbarItemsUnActiveline"></div>
          </div>
        </Link>

        <div className="adminNavbarItems">
          Trending <div className="adminNavbarItemsActiveline"></div>
        </div>

        <div className="adminLogoutButton">
          Logout <div className="adminNavbarItemsUnActiveline "></div>
        </div>
        <div className="adminPagemainContainer">
          <div className="addarticleHeading">Trending Design Page</div>
          <div className="addArticleFeild">
            <div className="addArticleFeildHeader">Trending Image 1</div>
            {/* {!imagePreview ? ( */}
            {!imagePreviewDesignObj.imageDesignPreview1.url ? (
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
                  onChange={e => handleFileChangeDesign(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewDesignObj.imageDesignPreview1.url}
                    alt=""
                    className="imagePreviewDesign"
                  />
                  <div
                    className="imagePreviewRemove"
                    onClick={() => {
                      // setImagePreview(null);
                      setimagePreviewDesignObj({
                        ...imagePreviewDesignObj,
                        imageDesignPreview1: { edit: true, url: null },
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
            <div className="addArticleFeildHeader">Trending Image 2</div>
            {/* {!imagePreview2 ? ( */}
            {!imagePreviewDesignObj.imageDesignPreview2.url ? (
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
                  onChange={e => handleFileChangeDesign2(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewDesignObj.imageDesignPreview2.url}
                    alt=""
                    className="imagePreviewDesign"
                  />
                  <div
                    className="imagePreviewRemove"
                    onClick={() => {
                      // setImagePreview2(null);
                      setimagePreviewDesignObj({
                        ...imagePreviewDesignObj,
                        imageDesignPreview2: {
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
            <div className="addArticleFeildHeader">Trending Image 3</div>
            {/* {!imagePreview3 ? ( */}
            {!imagePreviewDesignObj.imageDesignPreview3.url ? (
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
                  onChange={e => handleFileChangeDesign3(e)}
                />
              </div>
            ) : (
              <>
                <div className="imagePreviewBox">
                  <img
                    src={imagePreviewDesignObj.imageDesignPreview3.url}
                    alt=""
                    className="imagePreviewDesign"
                  />
                  <div
                    className="imagePreviewRemove"
                    onClick={() => {
                      // setImagePreview3(null);
                      setimagePreviewDesignObj({
                        ...imagePreviewDesignObj,
                        imageDesignPreview3: {
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
            <div className="addArticleButton" onClick={handleAddImageSubmit}>
              Add Designs
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;
