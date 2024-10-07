import { useSelector } from 'react-redux';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Header, PrivateComponents, About, Contact, Login, Signup, Otp, Dashboard, OpenRoute } from './filespath'
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



function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const {userDetails}=useSelector((state)=>state.user)
  const dispatch=useDispatch();
  
 
  useEffect(()=>{
    let token=sessionStorage.getItem("token");
    
     if (token) {
      const token = JSON.parse(sessionStorage.getItem("token"));
      dispatch(getUserDetails(token, dispatch));
    } 
  },[])

  return (
    <BrowserRouter>
      <div className=' '>
        <Header />
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />

          <Route element={<PrivateComponents />}>
            <Route path='/dashboard' element={<Dashboard />} >
            
            {userDetails.role==="Admin"||userDetails.role==="Seller"?
            <>
            <Route path='/dashboard/add-product' element={<AddProduct/>}/>
            <Route path='/dashboard/edit-products' element={<AddAttributes/>}/>
            </>
            :null}
              
             {userDetails.role==="Admin"?<Route path='/dashboard/admin' element={<AdminDashboard/>}/>:null} 
              <Route path='/dashboard/profile' element={<Profile />} />
              <Route path='/dashboard/settings' element={<Settings />} />
              {userDetails.role==='Seller' || userDetails.role==='Visitor'?<Route path='/dashboard/cart' element={<Cart />} />:null}
              
            </Route>

          </Route>

          <Route element={<OpenRoute />}>
            <Route path='/otp' element={<Otp />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Route>
          <Route path='*' element={'page not found'} />
        </Routes>
      </div>
      <Toaster
        position={width > 600 ? 'bottom-right' : 'bottom-right'}
        toastOptions={{
          style: {
            background: ' rgba(14,165,233,.7)',

          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: 'rgba(12,74,110,.9)',
            },
            style: {
              color: 'rgb(15, 23, 42)'
            }
          },
          error: {
            duration: 4000,
            style: {
              background: 'white',
              color: 'black',
              fontSize:'14px'
            },
            icon: <WarningIcon className=' text-red-600'/>,
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
    </BrowserRouter>
  );
}

export default App;
