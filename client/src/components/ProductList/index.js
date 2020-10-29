import React,{useEffect} from "react";
import { useQuery } from '@apollo/react-hooks';

import { useStoreContext } from '../../utils/Store';
import { UPDATE_CART_QUANTITY, UPDATE_PRODUCTS } from '../../utils/actions';

import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif";
import { idbPromise } from "../../utils/helpers";
import {connect} from 'react-redux';
import {store} from "../../utils/Store";

const mapStateToProps = state => {
  return{
    currentCategory:state.currentCategory,
    products:state.products
  }
}


function ProductList({currentCategory,products}) {
  // const [state, dispatch] = useStoreContext();
  // const {currentCategory} = state;
  const { loading, data } = useQuery(QUERY_PRODUCTS);


  useEffect(()=> {
    if(data){
      store.dispatch({
        type:UPDATE_PRODUCTS,
        products:data.products
      });
      data.products.forEach((product) => {
        idbPromise('products','put',product)
      });
    } else if(!loading){
      idbPromise('products','get').then((products)=> {
        store.dispatch({
          type:UPDATE_PRODUCTS,
          products:products
        });
      });
    }
  },[data,loading,store.dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return products;
    }

    return products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
            {filterProducts().map(product => (
                <ProductItem
                  key= {product._id}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  quantity={product.quantity}
                />
            ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      { loading ? 
      <img src={spinner} alt="loading" />: null}
    </div>
  );
}

export default connect(mapStateToProps)(ProductList);
