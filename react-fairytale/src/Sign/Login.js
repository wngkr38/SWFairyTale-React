import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import LoginLogo from '../image/loginLogo.png';

const Login = () => {
    const address = process.env.REACT_APP_SERVER_PORT;
    const [id, setId] = useState('아이디');
    const [pw, setPw] = useState('1234');
    const navigate = useNavigate();
    const location = window.location.pathname;
    const [disabled, setDisabled] = useState(true);
    const idRef = useRef(null);
    const pwRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const signUpButton = () => {
        navigate('/signUp');
    }

    const handleClickOutside = (event) => {
        if (id.current && !id.current.contains(event.target)) {
            if (id !== '아이디' || pw !== '1234') {
                setId('아이디');
                setPw('1234');
            }
        }
    };

    const idChange = (e) => {
        const length = e.target.value; 
        setId(length); 
        if (pw.length >= 1 || length.length >= 1) { 
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }

    const pwChange = (e) => {
        const length = e.target.value; 
        setPw(length);   
        if (id.length >= 1 || length.length >= 1) { 
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }

    const handleSignIn = async (event) => {
        event.preventDefault(); // 폼 제출될 때 기본 동작 막음
        await axios.post(`${address}/server/member/login`, {
            id: id,
            pw: pw
          })
          .then((response) => {
            console.log(response.status);
            if (response.data.result) {
                sessionStorage.setItem('user', JSON.stringify(response.data.result));
                navigate('/'); // 메인 화면으로 이동
            } else {
                alert('아이디와 비밀번호를 확인해주세요.');
                window.location.reload();
            }
          })
          .catch((error) => {
            console.error(error);
          })
    };

    //enter로도 버튼기능을 쓸 수 있음
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {   
            setId("아이디를 입력하세요."); 
            setPw("비밀번호를 입력하세요."); 
            handleSignIn(event);
            idRef.current.blur();
            pwRef.current.blur();
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '24%', height: '100%',display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 100}}>
            <div style={{ width: '400px', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <img src={LoginLogo} style={{ width: '400px', height:  '200px' }}/>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6133E2', marginTop: '1rem' }}>북작북작</h4>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '1rem' }}>에 오신것을 환영합니다</h4>
                </div>
            </div>
        <LoginDiv>
            <TextDiv>
                <IdText
                    ref={idRef}
                    type="text"
                    value={id}
                    onChange={idChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setId("")}
                />
                <PwText
                    ref={pwRef}
                    type="password"
                    value={pw}
                    onChange={pwChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setPw("")}
                />
                <LoginBut type="button" disabled={disabled} onClick={() => handleSignIn}>로그인</LoginBut>
                <h6>계정이 없으신가요? <button style={{ background: 'none', border: 'none', fontWeight: 'bold', color: '#6133E2' }} onClick={signUpButton}>회원가입</button></h6>
            </TextDiv>
        </LoginDiv>
        </div>
        </div>
    )
}

const LoginDiv = styled.div`
    display: flex;
    flexDirection: row;
`

const TextDiv = styled.div`
    display: flex;
    flex-direction: column;
    h6 {
        margin-top: 3rem;
    }
`

const IdText = styled.input`
    width: 450px;
    height: 55px;
    margin-top: 1.5rem;
    padding-left: 1rem;
    &:focus {
        outline: none; /* 포커스 테두리 제거 */
    }
`

const PwText = styled.input`
    width: 450px;
    height: 55px;
    margin-top: 1.5rem;
    padding-left: 1rem;
    &:focus {
        outline: none; /* 포커스 테두리 제거 */
    }
`

const LoginBut = styled.button`
    width: 450px;
    height: 55px;
    margin-top: 1.5rem;
    background-color: #6133E2;
    font-size: 18px;
    font-weight: bold;
    color: white;
`

export default Login;