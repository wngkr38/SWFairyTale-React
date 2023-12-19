import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import userIcon from '../image/profile.png';

const DropdownMenu = () => {
    const [modal, setModal] = useState(false);
    const [isImageLoaded, setImageLoaded] = useState(false);  // 이미지 로딩 상태 관리
    const navigate = useNavigate();
    let wrapperRef = useRef(); //모달창 가장 바깥쪽 태그를 감싸주는 역할
    const userInfo = JSON.parse(sessionStorage.getItem('user'));
    const imageUrl= userInfo?.profile;
    try {
        
    } catch (error) {
        console.error('Error parsing userInfo from sessionStorage', error);
    }

    const handleImageLoad = () => {
        setImageLoaded(true);
      };

    const handleClick = () => {
        setModal(true);
    }
    
    const handleClickOutside=(event)=>{ // 바깥 윈도우 클릭시 modal창 초기화
        if (wrapperRef && !wrapperRef.current.contains(event.target)) {
          setModal(false);
        }
    }

    const MyPageButton = () => {
        navigate('/mypage');
    }

    const logoutButton = () => {  // 로그아웃
        sessionStorage.clear();
        window.location.replace("/");
    }

    useEffect(()=>{ // 모달창 밖을 클릭하면 모달창 꺼짐
        document.addEventListener('mousedown', handleClickOutside);
        return()=>{
          document.removeEventListener('mousedown', handleClickOutside);
        }
      })
    return (
        <div ref={wrapperRef} className="Drop" >
            <Button onClick={handleClick}>
                <img src={imageUrl ? imageUrl : userIcon} onLoad={handleImageLoad} alt="User" style={{ visibility: isImageLoaded ? 'visible' : 'hidden' }} />
                <h6>{JSON.parse(sessionStorage.getItem('user')).name}</h6>
            </Button>
            {modal? (
        <div>
          <Nav_modal>
              <Nav_modalin>
                <UserInfomation>
                  <UserImg>
                    <img src={imageUrl ? imageUrl : userIcon} onLoad={handleImageLoad} alt="User" style={{ visibility: isImageLoaded ? 'visible' : 'hidden' }} />
                  </UserImg>
                  <UserInfos>
                    <h6>{JSON.parse(sessionStorage.getItem('user')).name}</h6>
                    <PayName>
                      <h4>{JSON.parse(sessionStorage.getItem('user')).premium === 'false' ? "베이직" : "프리미엄"}</h4>
                    </PayName>
                  </UserInfos>
                </UserInfomation>
                
                <LinkButton onClick={MyPageButton}>
                  <h6 >나의 동화책</h6>
                </LinkButton>
                
              </Nav_modalin>
              <UserButton onClick={logoutButton}>
                <h6>로그아웃</h6>
                </UserButton>
          </Nav_modal>
        </div>
      ):null}
        </div>
    )
}

const PayName = styled.div`
  width: 70%;
  height: 15%;

  h4 {
    width: 100%;
    height: 100%;
    display: flex;
    font-size: 13px;
    font-weight: 600;
    color: #6133E2;
  }
`

const UserImg = styled.div`
  width: 35%;
  display: flex;
  justify-content: center;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
`

const UserInfos = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  
  h6 {
    display: flex;
    float: left;
    font-size: 15px;
    font-weight: 600;
  }
`

const UserInfomation = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 2rem;
`

const Nav_modalin = styled.div`
  width: 220px;
  height: 140px;
  background-color: white;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  border-radius: 30px;
  font-family: "Jalnan";
  top: 0.3rem;
`

const Nav_modal = styled.div`
  background-color: white;
  width: 236px;
  height: 216px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  z-index: 1;
  border-radius: 8px;
  border: 1px solid #7C7C7C26;
  font-family: "Jalnan";
  right: 2rem;
  top: 4rem;
`

const UserButton = styled.button`
  position : absolute;
  background-color: white;
  width: 220px;
  height: 60px;
  bottom: 9px;
  border: none;
  font-family: "Jalnan";
  &:hover {
    font-weight: 800;
    background-color : #6133E2;
    color : white;
  }

  h5{
    position : absolute;
    left: 1rem;
    bottom: 11px;
  }

  h6 {
    position : absolute;
    left: 3rem;
    bottom: 13px;
  }
`

const Button = styled.button`
  background: none;
  border: none;
  color: black;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  flexDirection: row;
  align-items: center;
  margin-right: 6rem;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
`;

const LinkButton = styled.button`
  position : absolute;
  background-color: white;
  width: 100%;
  height: 60px;
  bottom: 0rem;
  border: none;
  
  img {
    width: 20px;
    height: 20px;
    position : absolute;
    left: 1rem;
    bottom: 18px;
  }

  h6 {
    position : absolute;
    left: 3rem;
    bottom: 12px;
  }

  &:hover {
    text-decoration: none;
    font-weight: 800;
    background-color : #6133E2;
    color : white;
  }
`

export default DropdownMenu;