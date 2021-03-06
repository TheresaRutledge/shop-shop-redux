import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { idbPromise } from '../utils/helpers';
// import { useStoreContext } from "../utils/Store";
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from '../utils/actions';

import Cart from '../components/Cart';

import { QUERY_PRODUCTS } from "../utils/queries";
import spinner from '../assets/spinner.gif'

import {store} from "../utils/Store"
import {connect} from 'react-redux';




const mapStateToProps = state => {
  return{
    products:state.products,
    cart:state.cart
  }
}

function Detail({cart,products}) {
  // const [state, dispatch] = useStoreContext();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({})

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // const { products, cart } = state;

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if (itemInCart) {
      store.dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      store.dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 }
      });
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });

    }
  };

  const removeFromCart = () => {
    store.dispatch({
      type: REMOVE_FROM_CART,
      _id: id
    });
    idbPromise('cart','delete',{...currentProduct})
  }

  useEffect(() => {
    // exists in global state
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));
    } 
    // retrieve from server
    else if (data) {
      store.dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });
      // store to indexDb
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    // no connection, get from cache in indexDB 
    else if(!loading){
      idbPromise('products','get').then((indexedProducts)=> {
        store.dispatch({
          type:UPDATE_PRODUCTS,
          products:indexedProducts
        });
      });
    }
  }, [products, data, loading, store.dispatch, id]);

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">
            ← Back to Products
          </Link>

          <h2>{currentProduct.name}</h2>

          <p>
            {currentProduct.description}
          </p>

          <p>
            <strong>Price:</strong>
            ${currentProduct.price}
            {" "}
            <button onClick={addToCart}>
              Add to Cart
            </button>
            <button 
            disabled={!cart.find(p=>p._id === id)}
            onClick={removeFromCart}>
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {
        loading ? <img src={spinner} alt="loading" /> : null
      }
      <Cart />
    </>
  );
};

export default connect(mapStateToProps)(Detail);
