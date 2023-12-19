import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Navigate from './Componens/Navigate';
import MainPage from './Pages/MainPage';
import SignUp from './Sign/SignUp';
import Login from './Sign/Login';
import BookList from './Pages/BookList';
import BookInfo from './Pages/BookInfo';
import Profile from './Pages/Profile';
import EditProfile from './Pages/EditProfile';
import RecommendList from './Pages/RecommendList';
import RecommendInfo from './Pages/RecommendInfo';
import PayPage from './Pay/PayPage';
import PayMent from './Pay/PayMent';
import MyPage from './Pages/MyPage';
import AnnouncementList from './Pages/AnnouncementList';
import AnnouncementInfo from './Pages/AnnouncementInfo';
import NoticeWrite from './Pages/NoticeWrite';
import ViewPage from './Pages/ViewPage';
import AdminPage from './Pages/AdminPage';
import UserAddress from './Pay/UserAddress';
import MyBookList from './Pay/MyBookList';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigate/>
        <Routes>
          <Route path = "/" element={<MainPage/>}></Route>
          <Route path = "/signUp" element={<SignUp/>}></Route>
          <Route path = "/login" element={<Login/>}></Route>
          <Route path = "/booklist" element={<BookList/>}></Route>
          <Route path = "/bookinfo" element={<BookInfo/>}></Route>
          <Route path = "/profile" element={<Profile/>}></Route>
          <Route path = "/editprofile" element={<EditProfile/>}></Route>
          <Route path = "/recommendlist" element={<RecommendList/>}></Route>
          <Route path = "/recommendinfo" element={<RecommendInfo/>}></Route>
          <Route path = "/paypage" element={<PayPage/>}></Route>
          <Route path = "/payMent" element={<PayMent/>}></Route>
          <Route path = "/mypage" element={<MyPage/>}></Route>
          <Route path = "/announcementList" element={<AnnouncementList/>}></Route>
          <Route path = "/announcementInfo" element={<AnnouncementInfo/>}></Route>
          <Route path = "/noticeWrite" element={<NoticeWrite/>}></Route>
          <Route path = "/viewPage" element={<ViewPage/>}></Route>
          <Route path = "/adminPage" element={<AdminPage/>}></Route>
          <Route path="/UserAddress" element={<UserAddress />}></Route>
          <Route path ="/MyBookList" element={<MyBookList/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
