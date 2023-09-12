import { useState, useEffect, useContext } from 'react';
import Layout from '../Layout';
import Card from './Card';
import CheckBox from './CheckBox';
import RadioBox from './RadioBox';
import { prices } from '../../utils/prices';
import { showError, showSuccess, alertRemove } from '../../utils/messages';
import { getCategories, getProducts, getFilteredProducts } from '../../api/apiProduct';
import { addToCart } from '../../api/apiOrder';
import { isAuthenticated, userInfo } from '../../utils/auth';
import Dropdown from './Dropdown';
import { orders } from '../../utils/orders';
import { sorts } from '../../utils/sorts'
import DropdownSort from './DropdownSort';
import { StateContext } from '../../StateProvider';

const Home = () => {
    const { searchedProducts, required } = useContext(StateContext)
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [limit, setLimit] = useState(3);
    const [skip, setSkip] = useState(0);
    const [loadAll, setLoadAll] = useState(false)
    const [order, setOrder] = useState('desc');
    const [sortBy, setSortBy] = useState('createdAt');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [filters, setFilters] = useState({
        category: [],
        price: []
    })

    useEffect(() => {
        getProducts(sortBy, order, limit, skip)
            .then(response => {
                if (response.data.length !== 0) {
                    setProducts(response.data)
                    setLoadAll(false)
                } else {
                    setLoadAll(true)
                }
            })
            .catch(err => setError("Failed to load products!"));

        getCategories()
            .then(response => setCategories(response.data))
            .catch(err => setError("Failed to load categories! ", err));
    }, [])

    useEffect(() => {
        if (skip !== 0) {
            getProducts(sortBy, order, limit, skip)
            .then(response => {
                if (response.data.length !== 0) {
                    Object.values(response.data).forEach(product => {
                        setProducts(current => [...current, product])
                    })
                    setLoadAll(false)
                } else {
                    setLoadAll(true)
                    alert("Loaded all products")
                }
            })
            .catch(err => setError("Failed to load products!"));
        }
    }, [skip])

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

    const handleFilters = (myfilters, filterBy) => {
        const newFilters = { ...filters };
        if (filterBy === 'category') {
            newFilters[filterBy] = myfilters;
        }

        if (filterBy === 'price') {
            const data = prices;
            let arr = [];
            for (let i in data) {
                if (data[i].id === parseInt(myfilters)) {
                    arr = data[i].arr;
                }
            }
            newFilters[filterBy] = arr;
        }

        setFilters(newFilters);
        getFilteredProducts(skip, limit, newFilters, order, sortBy)
            .then(response => setProducts(response.data))
            .catch(err => setError("Failed to load products!"));
    }

    const handleSortOrders = (value, name) => {
        if (name === 'order') {
            getProducts(sortBy, value, limit)
            .then(response => {
                setOrder(value)
                setProducts(response.data)
            })
            .catch(err => setError("Failed to load products!"));
        } else {
            getProducts(value, order, limit)
            .then(response => {
                setSortBy(value)
                setProducts(response.data)
            })
            .catch(err => setError("Failed to load products!")); 
        }
    }
    const showFilters = () => {
        return (
            <>
                <div className="row">
                    <div className="col-sm-3">
                        <h5>Filter By Categories:</h5>
                        <ul>
                            <CheckBox
                                categories={categories}
                                handleFilters={myfilters => handleFilters(myfilters, 'category')}
                            />
                        </ul>
                    </div>
                    <div className="col-sm-4">
                        <h5>Filter By Price:</h5>
                        <div className="row">
                            <RadioBox
                                prices={prices}
                                handleFilters={myfilters => handleFilters(myfilters, 'price')}
                            />
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <h5>Order By:</h5>
                        <div className="row">
                            <Dropdown
                                orders={orders}
                                handleOrders={(order => handleSortOrders(order, "order"))}
                            />
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <h5>Sort By:</h5>
                        <div className="row">
                            <DropdownSort
                                sorts={sorts}
                                handleSorts={(sort => handleSortOrders(sort, "sort"))}
                            />
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const loadMore = () => {
        if (!loadAll) {
            setSkip(skip + limit)
        } else {
            alert("Loaded All Products")
        }
    }

    if(required.current && searchedProducts.length !== 0) {
        console.log("home ", searchedProducts)
        console.log("req ", required.current)
        setProducts(searchedProducts)
        required.current = false
    }

    return (
        <Layout title="Home Page" className="container-fluid">
            {showFilters()}
            <div style={{ width: "100%" }}>
                {showError(error, error)}
                {showSuccess(success, "Added to cart successfully!")}
            </div>
            <div className="row">
                {products && products.map(product => <Card product={product} key={product._id}
                    handleAddToCart={handleAddToCart(product)} />)}
            </div>
            <div className='text-center mb-3'>
            <button className='btn btn-primary' onClick={loadMore}>Load More</button>
            </div>
        </Layout>
    )
}

export default Home;