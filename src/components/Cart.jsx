import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "../app/atoms";
import { buildRequestOptions } from "../app/api";
import "../index.css";
import { useNavigate } from "react-router-dom";
import CartItem from "./ShoppingCart/CartItem";

export default function Cart({ onRemoveItem = () => {}, onUpdateItem = () => {}, isOpen, onClose}){
  const { token } = useAtomValue(userAtom);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [cartAmount, setCartAmount] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const { url, options } = buildRequestOptions("cart", "cart", {
      token: token,
    });

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Cart not fetched");
      }
      const data = await response.json();
      // console.log("Cart fetched:", data);
      setCartItems(data.items);
      setCartAmount(data.amount);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Error fetching cart. Please try again later.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const handleActionComplete = () => {
    fetchCart();
  };

  const handleResponse = (response, action) => {
    if (action == "validate") {
      navigate(`/order/${response.order.id}`);
    }
  };
  const handleUpdateCart = (event) => {
    const action = event.target.id;
    const { url, options } = buildRequestOptions("cart", "cart_update", {
      token: token,
      body: { cart: { action: action } },
    });
    fetch(url, options)
      .then((response) => response.json())
      .then((response) => handleResponse(response, action))
      .catch((err) =>
        setError(`Error occured. Please try again later. ${err}`)
      );
    setCartItems([]);
    setCartAmount(0);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="cart-container">
      <h2>Mon panier</h2>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={() => onRemoveItem(item.id)}
            onUpdateQuantity={(quantity) => onUpdateItem(item.id, quantity)}
            onActionComplete={handleActionComplete}
          />
        ))
      ) : (
        <h4>Votre panier est vide.</h4>
      )}
      <div>Total : {cartAmount}</div>
      {cartAmount && (
        <div>
          <button onClick={handleUpdateCart} id="clear">
            Vider le panier
          </button>
          <button onClick={handleUpdateCart} id="validate">
            Valider le panier
          </button>
          <a href="/" className="logo-container">
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 908 302" preserveAspectRatio="xMidYMid meet" className="logo">
            <g id="logo-content" transform="translate(0,302) scale(0.1,-0.1)" fill="#000000" stroke="none" className="logo">
              <path d="M515 3008 c-2 -7 -115 -515 -250 -1128 -136 -613 -250 -1132 -255 -1152 l-8 -38 302 0 301 0 84 383 c47 210 86 388 89 395 3 10 43 12 170 10 l165 -3 107 -390 107 -390 331 -3 c183 -1 332 1 332 5 0 4 -61 186 -135 404 -74 218 -135 401 -135 406 0 6 19 16 43 23 198 59 394 234 492 441 56 118 77 215 78 354 2 208 -50 335 -192 475 -99 97 -178 144 -316 187 l-90 27 -608 4 c-491 2 -608 1 -612 -10z m1038 -512 c170 -61 211 -285 75 -412 -86 -82 -159 -96 -484 -92 l-251 3 54 245 c29 135 55 251 58 258 7 18 495 16 548 -2z"/>
              <path d="M3100 2413 c-72 -8 -232 -43 -305 -68 -129 -43 -335 -156 -335 -184 0 -7 196 -370 206 -380 2 -2 21 8 42 21 134 89 271 132 422 133 163 0 253 -37 298 -125 19 -38 22 -60 22 -158 l0 -114 -37 36 c-44 43 -151 97 -238 121 -93 25 -293 31 -394 11 -261 -49 -404 -209 -418 -466 -9 -174 37 -301 152 -415 82 -82 161 -125 285 -156 193 -49 440 5 598 130 l52 41 0 -75 0 -75 315 0 315 0 0 549 c0 594 -5 659 -55 782 -52 128 -156 238 -287 305 -142 72 -421 110 -638 87z m215 -1098 c33 -9 77 -27 98 -41 35 -23 37 -27 37 -78 0 -61 -10 -73 -85 -108 -42 -19 -67 -23 -160 -23 -96 0 -116 3 -153 23 -112 60 -79 200 54 231 61 14 144 12 209 -4z"/>
              <path d="M7307 2400 c-115 -24 -257 -93 -331 -161 l-56 -51 0 96 0 96 -315 0 -315 0 0 -845 0 -845 315 0 315 0 0 524 0 524 45 40 c74 65 107 77 212 77 107 0 134 -13 171 -85 22 -44 22 -45 22 -562 l0 -518 315 0 315 0 0 524 0 524 45 40 c74 65 107 77 212 77 107 0 134 -13 171 -85 22 -44 22 -45 22 -562 l0 -518 315 0 315 0 0 653 c0 615 -1 658 -19 730 -23 89 -41 127 -89 185 -77 96 -202 150 -366 159 -224 13 -424 -65 -576 -223 -34 -36 -63 -64 -64 -62 -44 104 -121 190 -206 231 -117 57 -290 71 -453 37z"/>
              <path d="M4224 2318 c13 -35 161 -420 330 -856 168 -435 306 -800 306 -810 0 -33 -30 -61 -82 -77 -66 -19 -198 -20 -243 -1 -42 18 -33 49 -85 -284 -30 -194 -37 -256 -27 -262 23 -14 124 -23 257 -22 356 3 582 116 710 355 23 44 402 1015 770 1972 l18 47 -333 0 -332 0 -158 -467 c-87 -258 -160 -473 -164 -480 -4 -7 -78 203 -166 467 l-160 480 -332 0 -333 0 24 -62z"/>
            </g>
          </svg>
        </a>
        </div>
      )}
    </div>
  );
};

Cart.propTypes = {
  onRemoveItem: PropTypes.func,
  onUpdateItem: PropTypes.func,
};

