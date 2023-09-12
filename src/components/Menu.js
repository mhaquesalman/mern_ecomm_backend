import { useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { singout, isAuthenticated, userInfo } from '../utils/auth';
import { StateContext } from '../StateProvider';

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: '#ff9900' }
    } else {
        return { color: 'grey' }
    }
}

const Menu = ({ history }) => {
    const [input, setInput] = useState("")
    const {search} = useContext(StateContext)

    return (
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
            <ul className="nav" >
                <li className='nav-item'>
                    <img src="https://drive.google.com/uc?id=1LAAHZlJXw_4a102YvVpitoBXAujleYBV" 
                    style={{ marginTop: 5}} width="30" height="30" alt="" />
                </li>
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, '/')} to="/">Home</Link>
                </li>
                {!isAuthenticated() && (<>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/login')} to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/register')} to="/register">Register</Link>
                    </li>
                </>)}

                {isAuthenticated() && (<>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, `/${userInfo().role}/dashboard`)} 
                        to={`/${userInfo().role}/dashboard`}>Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, `/cart`)} 
                        to={`/cart`}>Cart</Link>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" style={{ cursor: 'pointer', color: 'grey' }} onClick={() => {
                            singout(() => {
                                history.push('/login')
                            });
                        }}> Logout</span>
                    </li>
                </>)}
            </ul>
            {history.location.pathname === "/" ? (
                            <div className='collapse navbar-collapse justify-content-end'>
                            <form className='form-inline' onSubmit={e => {
                                e.preventDefault()
                                search(input)
                            }}>
                                <input className='form-control mr-2' type='search' placeholder='Search Product'
                                aria-label='Search' onChange={e => setInput(e.target.value)}/>
                                <button type='submit' className='btn btn-outline-success'>Search</button>
                            </form>
                        </div>
            ) : ""}
        </nav>
    )
}

export default withRouter(Menu);