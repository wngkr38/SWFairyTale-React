import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import MyBoard from '../Componens/MyBoard';
import MyFairyTale from '../Componens/MyFairyTale';

const MyPage = () => {
    const navigate = useNavigate();
    
    const context = JSON.parse(sessionStorage.getItem('user'));
    const address = process.env.REACT_APP_SERVER_PORT;
    const userId = context.id;
    const userPw = context.pw; 
    const userBirth = context.birth;
    const userNick = context.nick;
    const userProfile = context.profile;
    
    const [id, setId] = useState('');
    const [nick, setNick] = useState('');
    const [birth, setBirth] = useState('');
    const [name, setName] = useState('');
    const [profile, setProfile] = useState(userProfile);

    const year = birth.substring(0,4);
    const month = birth.substring(6,7);
    const day = birth.substring(9,10);
    const now = new Date();
    let nowYear = now.getFullYear(); 
    const age = (nowYear-year+1);

    const getUserProfile = () => {  // 사용자 정보 가져오기
      if(context){
          axios.post(`${address}/server/member/userProfile`,{
              id: userId
          })
          .then((res) => {
          if (res.data.result.id === userId) {
            console.log(res.data.result)
              setProfile (res.data.result.profile);
              setId (res.data.result.id);
              setName (res.data.result.name);
              setNick (res.data.result.nick);
              setBirth (res.data.result.birth);
          } else {
              alert('회원 정보 조회 오류.','페이지를 다시 로드해주세요.');
          }
          })
          .catch((err) => {
          console.error(err);
          });
      };
    };

    useEffect(() => {
        getUserProfile();
        if(userId===null || userId === '') {
          alert('접근 오류','다시 로그인해주세요.');
          navigate('/login');
        }
    }, [])

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '80%', height: '50px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
          <h4 style={{ fontSize: '21px', fontWeight: 'bold' }}>나의 동화책</h4>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
          <span style={{ fontWeight: 'bold' }}>안녕하세요&nbsp;</span>
          <span style={{ color: '#660099', fontWeight: 'bold' }}>{name}</span>
          <span style={{ fontWeight: 'bold' }}>님</span>
          </div>
        </div>
        <MyFairyTale/>
        <div style={{ width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <h4 style={{ fontSize: '21px', fontWeight: 'bold' }}>도서관에 등록한 동화책</h4>
        </div>
        <MyBoard/>
      </div>
    )
}

export default MyPage;