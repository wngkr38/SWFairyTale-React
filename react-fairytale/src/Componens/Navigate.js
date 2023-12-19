import React, { useState } from 'react';
import styled from "styled-components";
import { Navbar, Nav, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';  // 외부 css에서 네비바 가져옴
import { useNavigate } from 'react-router-dom';

import DropdownMenu from './DropdownMenu';
import Logo from '../image/logo.png';

const Navigate = () => {
    const navigate = useNavigate();
    const context = JSON.parse(sessionStorage.getItem('user'))?.id;

    const LoginButton = () => {
        navigate('/login');
    }

    const MainButton = () => {  // 로고 클릭시 메인페이지 이동
        navigate("/");
    }

    const BoardButton = () => {  // 버튼 클릭시 게시판 페이지 이동
        navigate("/booklist");
      }
    
    const AnnouncementButton = () => {  // 버튼 클릭시 공지사항 페이지 이동
        navigate("/announcementList");
    }

    const adminButton = () => { // 버튼 클릭시 관리자 페이지 이동
        navigate("/adminPage");
    }

    const recommendButton = () => { // 버튼 클릭시 책 구매 페이지 이동
        navigate("/recommendList");
    }
    
    const PayButton = () => {  // 버튼 클릭시 결제 페이지 이동
        navigate("/paypage");
    }

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    return (
        <TopNav>
            <Navbar style={{backgroundColor : "white", boxShadow : "1.5px 1.5px 1.5px 1.5px #F3F4F6", width: "100vw", height: "7.6vh", zIndex: "1000"}} >
                <Navbar.Brand>
                    <Nav_Str>
                        <LogoDiv>
                        <LogoImg onClick={MainButton}>
                            <img style={{ width: '180px', height: '40px' }} className="LogoImage" alt="FairyTale_Logo" src={Logo}/>
                        </LogoImg>
                        </LogoDiv>
                        <ListDiv>
                        <BoardBut onClick={BoardButton}>
                            도서관
                        </BoardBut>
                        <RecommenddBut onClick={recommendButton}>
                            책 구매
                        </RecommenddBut>
                        <AnnouncementBut onClick={AnnouncementButton}>
                            공지사항
                        </AnnouncementBut>
                        {context === 'admin' && (
                            <AdminBut onClick={adminButton}>
                                관리자
                            </AdminBut>
                        )}
                        </ListDiv>
                        <UserDiv>
                            <PayBut onClick={PayButton}>
                                결제
                            </PayBut>
                            {sessionStorage.getItem('user') ? (
                                <UserInfo>
                                    <DropdownMenu/>
                                </UserInfo>
                            ) : (
                                <Form>
                                    
                                    <LoginBut onClick={LoginButton}>로그인</LoginBut>
                                </Form>
                            )}
                        </UserDiv>
                    </Nav_Str>
                </Navbar.Brand>
            </Navbar>
        </TopNav>
    )
}

const TopNav = styled.div`
  height: 7.6vh;
`

const Nav_Str = styled.div`
  display: flex;
  flexDirection: row;
  width: 100vw;
`

const LogoDiv = styled.div`
    flex:1;
    display: flex;
    justify-content: flex-start;
`

const LogoImg = styled.button`
    margin-left: 2rem;
    background: none;
    border: none;
`

const ListDiv = styled.div`
flex:1;
display: flex;
justify-content: space-evenly;
`

const BoardBut = styled.button`
background: none;
    border: none;
    font-size: 17px;
`

const RecommenddBut = styled.button`
background: none;
    border: none;
    font-size: 17px;
`

const AnnouncementBut = styled.button`
background: none;
    border: none;
    font-size: 17px;
`

const AdminBut = styled.button`
background: none;
    border: none;
    font-size: 17px;
`

const UserDiv = styled.div`
flex:1;
display: flex;
justify-content: flex-end;
`

const UserInfo = styled.div`
display: flex;
flexDirection: row;
align-items: center;
margin-right: 3rem;

img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 1rem;
}
`

const PayBut = styled.button`
margin-right: 2rem;
background: none;
    border: none;
    font-size: 17px;
`

const LoginBut = styled.button`
margin-top: 7px;
margin-right: 5rem;
background: none;
    border: none;
    font-size: 17px;
`

export default Navigate;