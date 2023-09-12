import { useEffect, useState } from 'react';
import Layout from '../Layout';
import { API } from '../../utils/config';
import { Link } from 'react-router-dom';
import { getComments, getProductDetails } from '../../api/apiProduct';
import { showSuccess, showError } from '../../utils/messages';
import { addToCart } from '../../api/apiOrder';
import { isAuthenticated, userInfo } from '../../utils/auth';
import Rating from '../../utils/Rating';
import CommentItem from '../CommentItem';
import CommentForm from '../CommentForm';

const ProductDetails = (props) => {
    const [product, setProduct] = useState({});
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const id = props.match.params.id;
        getProductDetails(id)
            .then(response => setProduct(response.data))
            .catch(err => setError("Failed to load products"))
        getComments(id)
        .then(response => setComments(response.data))
        .catch(err => setError("Failed to load comments"))    
    }, [])

    const handleAddToCart = product => () => {
        if (isAuthenticated()) {
            setError(false);
            setSuccess(false);
            const user = userInfo();
            const cartItem = {
                user: user._id,
                product: product._id,
                price: product.price,
            }
            addToCart(user.token, cartItem)
                .then(reponse => setSuccess(true))
                .catch(err => {
                    if (err.response) setError(err.response.data);
                    else setError("Adding to cart failed!");
                })
        } else {
            setSuccess(false);
            setError("Please Login First!");
        }
    }

    return (
      <Layout title="Product Page">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <a href="#">Product</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.category ? product.category.name : ""}
            </li>
          </ol>
        </nav>
        <div>
          {showSuccess(success, "Item Added to Cart!")}
          {showError(error, error)}
        </div>
        <div className="row container">
          <div className="col-6">
            <img
              src={`${API}/product/photo/${product._id}`}
              alt={product.name}
              width="100%"
            />
          </div>
          <div className="col-6">
            <h3>{product.name}</h3>
            <span style={{ fontSize: 20 }}>&#2547;</span>
            {product.price}
            <p>
              {product.quantity ? (
                <span className="badge badge-pill badge-primary">In Stock</span>
              ) : (
                <span className="badge badge-pill badge-danger">Out of Stock</span>
              )}
            </p>
            <Rating rating={product.rating} />
            <p>{product.description}</p>
            {product.quantity ? (
              <>
                &nbsp;
                <button
                  className="btn btn-outline-primary btn-md"
                  onClick={handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </>
            ) : (
              ""
            )}
            <hr />
            {isAuthenticated() ? ( <CommentForm id={product._id} />) : 
            (<h5 style={{color: "gray"}}>Login to comment....</h5>) }      
            <hr />
            {comments.length > 0 ? (
              <>
                
                <h4>Comments</h4>
                <hr />
                <CommentItem comments={comments} />
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </Layout>
    );
}

export default ProductDetails;