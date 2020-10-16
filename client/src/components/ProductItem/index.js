import React from "react";
import { Link } from "react-router-dom";
import { idbPromise, pluralize } from "../../utils/helpers";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import {store} from '../../utils/store';
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {
    cart:state.cart
  }
}

function ProductItem(props) {
  const {
    image,
    name,
    _id,
    price,
    quantity,
    cart
  } = props;

  const item = {
    image,
    name,
    _id,
    price,
    quantity
  }

  const addToCart = () => {
    // find the cart item with the matching id
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);
  
    // if there was a match, call UPDATE with a new purchase quantity
    if (itemInCart) {
      store.dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });

      idbPromise('cart','put',{
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity)+1
      });
    } else {
      store.dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1 }
      });
      idbPromise('cart','put',{
        ...item,
        purchaseQuantity: 1
      })
    }
  };
 

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default connect(mapStateToProps)(ProductItem);
