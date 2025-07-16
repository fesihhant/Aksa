import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Helmet} from 'react-helmet-async';

//#region "admin pages"

import Users from './components/admin/Users';
import EditUser from './components/admin/EditUser';

import Categories from './components/admin/Categories';
import EditCategory from './components/admin/EditCategory';

import ProjectList from './components/admin/Projects';
import EditProject from './components/admin/EditProject';

import Products from './components/admin/Products';
import NewProduct from './components/admin/NewProduct';

import References from './components/admin/References';
import EditReference from './components/admin/EditReference';
import IntroductionBookletEdit from './components/admin/IntroductionBookletEdit';
import EditAbout from './components/admin/EditAbout';
import SocialMediaList from './components/admin/SocialMediaList';
import SocialMediaEdit from './components/admin/SocialMediaEdit';
import EventList from './components/admin/EventList';
import EditEvent from './components/admin/EditEvent';


// #endregion

//#region "public pages"
import HomePage from './components/public/HomePage';
import Login from './components/public/Login';
import Register from './components/public/Register';

import About from './components/public/About';
import Contact from './components/public/Contact';

import Projects from './components/public/Projects';
import ProjectDetail from './components/public/ProjectDetail';
import OurActivities from './components/public/OurActivities';
import ResetPassword from './components/public/ResetPassword';

import Product from './components/public/Product';
import ProductDetail from './components/public/ProductDetail';

import SocialMediaFloatingBar from './components/htmlComponent/SocialMediaFloatingBar';
import Profile from './components/htmlComponent/Profile';  
import Notifications from './components/htmlComponent/Notifications';
import Reservations from './components/htmlComponent/Reservations';
import AttendedEvents from './components/htmlComponent/AttendedEvents';
import Favorites from './components/htmlComponent/Favorites';

import Events from './components/public/Events';
import EventDetail from './components/public/EventDetail';

// #endregion

//#region "private route"
import PrivateRoute from './components/public/PrivateRoute';
//#endregion

//#region "styles"
import './App.css';
import './index.css';

import Banner from './components/public/Banner';
import Footer from './components/public/Footer';
//#endregion

<Helmet>
  <title>Aksa İnşaat </title>
  <meta name="description" content="İnşaat, doğalgaz, boru hattı" />
  <meta name="keywords" content="İnşaat, doğalgaz, boru hattı, belediye, bakanlık" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOM8d7x1z5l5e5c5e5e5e5e5e5e5e5e5e5e5e5" crossOrigin="anonymous" />  
  <meta property="og:title" content="Aksa" />
  <meta property="og:description" content="İnşaat, doğalgaz, boru hattı" />
  <meta property="og:image" content="https://www.siteniz.com/proje.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
</Helmet>

function App() {
  // Kullanıcı bilgisini state'te tut
  const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Banner'a user ve setUser gönder */}
          <Banner storedUser={storedUser} setStoredUser={setStoredUser} />
          <SocialMediaFloatingBar/>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* <Route path="/projects" element={<Projects />} /> */}
            <Route path="/project-detail" element={<ProjectDetail />} />
            <Route path="/activities" element={<OurActivities />} />
            
            <Route path="/product" element={<Product />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            
            {/* Doğa Benim */}
            <Route path="/events" element={<Events />} />
            <Route path="/event-detail" element={<EventDetail />} />

            <Route  path="/event-list" element={<PrivateRoute requireAdmin><EventList /></PrivateRoute>} />
            <Route path="/event/new" element={<PrivateRoute requireAdmin><EditEvent /></PrivateRoute>} />
            <Route path="/event/edit/:id" element={<PrivateRoute requireAdmin><EditEvent /></PrivateRoute>}/> 
            


            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
            <Route path="/user-activated/:activatedToken" element={<ResetPassword />} />
            
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/attended-events" element={<AttendedEvents />} />
            <Route path="/favorites" element={<Favorites />} />

            <Route path="/test" element={<div>Test Çalışıyor</div>} />

            {/* Admin Routes */}
           
            <Route  path="/users" element={<PrivateRoute requireAdmin><Users /></PrivateRoute>} />
            <Route path="/users/new" element={<PrivateRoute requireAdmin><EditUser /></PrivateRoute>} />
            <Route path="/users/edit/:id" element={<PrivateRoute requireAdmin><EditUser /></PrivateRoute>}/> 
            
            <Route path="/categories" element={<PrivateRoute requireAdmin><Categories /></PrivateRoute>} /> 
            <Route path="/categories/new" element={ <PrivateRoute requireAdmin><EditCategory /></PrivateRoute>}/>
            <Route path="/categories/edit/:id" element={<PrivateRoute requireAdmin><EditCategory /></PrivateRoute>}/>  
                       
            <Route path="/projects" element={<PrivateRoute requireAdmin><ProjectList /></PrivateRoute>}/>           
            <Route path="/projects/new" element={<PrivateRoute requireAdmin><EditProject /></PrivateRoute>}/>                             
            <Route path="/projects/edit/:id" element={<PrivateRoute requireAdmin><EditProject /></PrivateRoute>}/>   
            <Route path="/projectdetail" element={<PrivateRoute requireAdmin><EditProject /></PrivateRoute>}/> 
            
            <Route path="/products" element={<PrivateRoute requireAdmin><Products /></PrivateRoute>}/>    
            <Route path="/product/new" element={<PrivateRoute requireAdmin><NewProduct /></PrivateRoute>}/>
            <Route path="/product/edit/:id" element={<PrivateRoute requireAdmin><NewProduct /></PrivateRoute>} />
            
            <Route path="/references" element={<PrivateRoute requireAdmin><References /></PrivateRoute>}/>
            <Route path="/reference/new" element={<PrivateRoute requireAdmin><EditReference /></PrivateRoute>}/>
            <Route path="/reference/edit/:id" element={<PrivateRoute requireAdmin><EditReference /></PrivateRoute>}/>
            <Route path="/referencedetail" element={<PrivateRoute requireAdmin><EditReference /></PrivateRoute>}/>
            
            <Route path="/introductionBooklet" element={<PrivateRoute requireAdmin><IntroductionBookletEdit /></PrivateRoute>}/>
            
            <Route path="/editAbout" element={<PrivateRoute requireAdmin> <EditAbout /></PrivateRoute>} />
               
            <Route path="/social-media" element={<PrivateRoute requireAdmin> <SocialMediaList /></PrivateRoute>} />
            <Route path="/social-media/new" element={<PrivateRoute requireAdmin><SocialMediaEdit /></PrivateRoute>} />
            <Route path="/social-media/edit/:id" element={<PrivateRoute requireAdmin><SocialMediaEdit /></PrivateRoute>} />
          </Routes>
          <Footer/>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
