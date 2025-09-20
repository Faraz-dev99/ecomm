import { useSelector } from 'react-redux';
import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Home, Header, Footer, PrivateComponents, About, Contact, Login, Signup, Otp, Dashboard, OpenRoute } from './filespath'
import Profile from './components/core/Dashboard/profile/Profile.js';
import Cart from './components/core/Dashboard/cart/Cart';
import Settings from './components/core/Dashboard/settings/Settings';
import SellerDashboard from './components/core/Dashboard/Admin/AdminDashboard.js';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import { useDispatch } from 'react-redux';
import { getUserDetails } from './oprations/userApi.js';
import AddProduct from './components/core/Dashboard/Seller/AddProduct';
import AdminDashboard from './components/core/Dashboard/Admin/AdminDashboard.js';
import ProductDetails from './pages/ProductDetails.js';
import AddAttributes from './components/core/Dashboard/Seller/AddAttributes.js';
import ProductListing from './components/core/Dashboard/Seller/ProductListing';
import Search from './pages/Search.js';
import { setToken } from './slices/authSlice.js';
import Catalog from './pages/Catalog.js';
import ScrollToTop from './utils/ScrollToTop.js';
import Checkout from './pages/Checkout.js';
import MyOrder from './components/core/Dashboard/order/MyOrder.js';
import Order from './components/core/Dashboard/order/Order.js';
import PopulerProduct from './pages/PopulerProduct.js';
import LatestProduct from './pages/LatestProduct.js';



function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const { userDetails } = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const location = useLocation();
  const hideFooter = location.pathname.startsWith("/dashboard");


  useEffect(() => {
    let token = sessionStorage.getItem("token");

    if (token) {
      const token = JSON.parse(sessionStorage.getItem("token"));
      dispatch(setToken(token))
      dispatch(getUserDetails(token, dispatch));
    }
  }, [])

  return (
    <>
      <div className=' bg-zinc-950'>
        <Header />
        <ScrollToTop />
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/search/:key' element={<Search />} />
          <Route path='/populer' element={<PopulerProduct />} />
          <Route path='/latest' element={<LatestProduct />} />
          <Route path='/catalog/:key' element={<Catalog />} />

          <Route element={<PrivateComponents />}>
            <Route path='/dashboard' element={<Dashboard />} >

              {userDetails.role === "Admin" || userDetails.role === "Seller" ?
                <>
                  <Route path='/dashboard/add-product' element={<AddProduct />} />
                  <Route path='/dashboard/edit-product/:id' element={<AddProduct />} />
                  <Route path='/dashboard/product-listing' element={<ProductListing />} />
                </>
                : null}

              {userDetails.role === "Admin" ? <Route path='/dashboard/admin' element={<AdminDashboard />} /> : null}
              <Route path='/dashboard/profile' element={<Profile />} />
              <Route path='/dashboard/settings' element={<Settings />} />
              <Route path='/dashboard/order' element={<Order />} />
              

              {userDetails.role === 'Seller' || userDetails.role === 'Visitor' ? <><Route path='/dashboard/cart' element={<Cart />} /><Route path='/dashboard/my-order' element={<MyOrder />} /> </> : null}

            </Route>

          </Route>

          <Route element={<OpenRoute />}>
            <Route path='/otp' element={<Otp />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Route>
          <Route path='*' element={'page not found'} />
        </Routes>
        {!hideFooter && <Footer />}
      </div>
      <Toaster
        position={width > 600 ? 'bottom-right' : 'bottom-right'}
        toastOptions={{
          style: {
            background: '#00897B',

          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#00897b',
            },
            style: {
              color: 'rgb(15, 23, 42)'
            },
            iconTheme: {
              primary: 'white',
              secondary: 'black'
            }
          },
          error: {
            duration: 4000,
            style: {
              background: 'white',
              color: 'black',
              fontSize: '14px'
            },
            icon: <WarningIcon className=' text-red-600' />,
            iconTheme: {
              primary: 'rgba(248, 248, 248, 0.5)',
              secondary: 'black'
            }

          },
          loading: {
            iconTheme: {
              secondary: 'black'
            },
            style: {
              color: 'black',
              background: 'white',

            },
            position: 'top-center'
          },

        }}



      />
    </>
  );
}

export default App;
