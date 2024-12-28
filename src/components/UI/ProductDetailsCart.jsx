import React from "react";

import { Col, Container, Row } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/product-details.css";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import axiosClient from "../../axios-client";

import pimg from "../../assets/images/arm-chair-02.jpg";
import Carousel from "react-multi-carousel";
import { getCurrencydata } from "../../redux/slices/settingSlice";

import {
  AiFillMinusCircle,
  AiFillPlusCircle,
  AiOutlineShoppingCart,
  AiOutlineShopping,
  AiFillFacebook,
  AiFillTwitterSquare,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { useState, useEffect } from "react";

const ProductDetailsCart = ({
  productDetals,
  productDiscount,
  productImg,
  productmainImg,
  showImg,
  color,
  size,
  currencySymbol,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const basepath = useSelector((state) => state.setting.basepath);

  // Tạo các state cần thiết cho chọn màu, kích thước và số lượng
  const [choose_color, setchoose_color] = useState("");
  const [choose_size, setchoose_size] = useState("");
  const [qty, setQty] = useState(1);
  const [offerId, setofferId] = useState(0);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 10 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  const qtyChange = (type) => {
    if (type === "plus") {
      setQty((prev) => prev + 1);
    }
    if (type === "neg") {
      setQty((prev) => (prev <= 1 ? 1 : prev - 1));
    }
  };

  const addToCart = (item, type) => {
    dispatch(
      cartActions.addItem({
        id: item.id,
        productName: item.name,
        price: item.current_sale_price - productDiscount,
        imgUrl: item.image_path,
        offerId: offerId,
        color: choose_color,
        size: choose_size,
      })
    );
    let data = { id: item.id, qty };
    dispatch(cartActions.itemIncDic(data));
    type === "buy"
      ? navigate("/checkout")
      : toast.success("Product added successfully");
  };

  return (
    <section className="mb-4 pt-4">
      <Container>
        <div className="bg-white shadow-sm p-4">
          <Row>
            <Col lg="5" md="12">
              <div className="mb-4 mb-lg-0 imgdiv">
                <img
                  className="product__img"
                  src={`${basepath}/${showImg}`}
                  alt="product"
                />
              </div>
              <Carousel
                responsive={responsive}
                autoPlay={false}
                infinite={true}
                transitionDuration={300}
                autoPlaySpeed={3000}
                renderDotsOutside={true}
              >
                <div className="product_item_imgdiv">
                  <img
                    className="productitem"
                    src={`${basepath}/${productmainImg}`}
                    alt="product"
                  />
                </div>
                {productImg.map((imgData, index) => (
                  <div className="product_item_imgdiv" key={index}>
                    <img
                      className="productitem"
                      src={`${basepath}/${imgData.image}`}
                      alt="product"
                    />
                  </div>
                ))}
              </Carousel>
            </Col>
            <Col lg="7" md="12">
              <div className="product__details">
                <h1 className="mb-2 fs-20 fw-600">{productDetals.name}</h1>
                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                  <div>
                    {[...Array(5)].map((_, index) => (
                      <span key={index}>
                        <i className="ri-star-s-fill"></i>
                      </span>
                    ))}
                  </div>
                  <p>(4.5 ratings)</p>
                </div>
                <div className="d-flex align-items-center gap-5">
                  <span className="product__price">
                    {currencySymbol}{" "}
                    {productDetals.current_sale_price - productDiscount}
                  </span>
                  {productDiscount > 0 && (
                    <del>
                      {currencySymbol}{" "}
                      {Math.round(productDetals.current_sale_price)}
                    </del>
                  )}
                </div>
                {color && (
                  <div className="sizecolor_div">
                    <p>Color:</p>
                    {color.map((colordata) => (
                      <span
                        key={colordata}
                        className={`color_item ${
                          colordata === choose_color ? "activecolorst" : ""
                        }`}
                        onClick={() => setchoose_color(colordata)}
                        style={{ background: colordata }}
                      ></span>
                    ))}
                  </div>
                )}
                {size && (
                  <div className="sizecolor_div">
                    <p>Size:</p>
                    {size.map((sizedata) => (
                      <span
                        key={sizedata}
                        className={`sizedata ${
                          sizedata === choose_size ? "activecolorst" : ""
                        }`}
                        onClick={() => setchoose_size(sizedata)}
                      >
                        {sizedata}
                      </span>
                    ))}
                  </div>
                )}
                <div className="sizecolor_div">
                  <p>Quantity:</p>
                  <div className="input__button__div">
                    <AiFillMinusCircle
                      className="itemBtn__st"
                      onClick={() => qtyChange("neg")}
                    />
                    <div>
                      <input readOnly type="number" value={qty} />
                    </div>
                    <AiFillPlusCircle
                      className="itemBtn__st"
                      onClick={() => qtyChange("plus")}
                    />
                  </div>
                </div>
                <div className="sizecolor_div">
                  <p>Total Price:</p>
                  <span className="payabletxt">
                    {currencySymbol}{" "}
                    {(productDetals.current_sale_price - productDiscount) * qty}
                  </span>
                </div>
                <div className="sizecolor_div">
                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    className="buy__btn btninner"
                    onClick={() => addToCart(productDetals, "cartadd")}
                  >
                    <AiOutlineShoppingCart /> Add to Cart
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    className="buy__btn buyNow btninner"
                    onClick={() => addToCart(productDetals, "buy")}
                  >
                    Buy Now
                  </motion.button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default ProductDetailsCart;
