import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import CheckSignUp from "./CheckSignUp";

const SignUp = () => {
    const address = process.env.REACT_APP_SERVER_PORT;
    const navigate = useNavigate();
    const idRef = useRef(null);
    const [disabled, setDisabled] = useState(true);
  
    const basicProfileUrl = '../image/basic-profile.png';
  
    const [id, setId] = useState('아이디');
    const [pw, setPw] = useState('비밀번호');
    const [pw2, setPw2] = useState('비밀번호');
    const [name, setName] = useState('이름');
    const [nick, setNick] = useState('닉네임');
    const [pNum1, setPNum1] = useState('주민등록번호 앞 6자리');
    const [pNum2, setPNum2] = useState('주민등록번호 뒤 7자리');
    const [year, setYear] = useState('연도');
    const [month, setMonth] = useState('월');
    const [day, setDay] = useState('일');
    const [profile, setProfile] = useState(basicProfileUrl);
    const [exId, setExId] = useState('영어, 숫자 4글자 이상 12글자 이하.');
    const [exPw1, setExPw1] = useState('x');
    const [exPw2, setExPw2] = useState('x');
    const [exPw3, setExPw3] = useState('x');
    const [exName, setExName] = useState('영어 또는 한글 2글자 이상 12글자 이하.');
    const [exNickName, setExNickName] = useState('영어 또는 한글 1글자 이상 12글자 이하.');

    const idChange = (e) => {
        const length = e.target.value; 
        setId(length); 
        if (length.length >= 1) { 
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }
    
  
    // ************ 주민등록번호 유효성 검사를 위한 함수 *************
   const CheckpNum = (pNum1, pNum2, setYear, setMonth, setDay) => {
      // 주민등록번호 유효성 검사 true -> 생일 자동 입력하기
      let checkpNum1 = /[0-9]{6,6}$/; // 주민번호 정규식 앞에 숫자 6개
      let checkpNum2 = /[0-9]{7,7}$/; // 주민번호 정규식 뒤에 숫자 7개
  
      // 주민 번호 앞/뒷자리
      let arrIdNum1 = new Array();
      let arrIdNum2 = new Array();
  
      if (!pNum1 || !pNum2) { // 주민등록 번호가 입력되지 않은 경우
        alert('주민등록번호를 입력해주세요.');
        return false;
      }
      if (!(checkpNum1.test(pNum1) && checkpNum2.test(pNum2))) { // 주민 등록번호의 형식에 안맞게 작성된 경우
        alert('주민등록번호가 제대로 입력되지 않았습니다.');
        return false;
      }
  
      // *** 주민등록 번호 검증식 ***
      for (let i = 0; i < pNum1.length; i++) {
        arrIdNum1[i] = pNum1.charAt(i);
      }
  
      for (let i = 0; i < pNum2.length; i++) {
        arrIdNum2[i] = pNum2.charAt(i);
      }
  
      let tempSum = 0;
  
      for (let i = 0; i < pNum1.length; i++) {
        tempSum += arrIdNum1[i] * (2 + i);
      }
  
      for (let i = 0; i < pNum2.length - 1; i++) {
        if (i >= 2) {
          tempSum += arrIdNum2[i] * i;
        } else {
          tempSum += arrIdNum2[i] * (8 + i);
        }
      }
  
      if ((11 - (tempSum % 11)) % 10 != arrIdNum2[6]) {
        alert("올바른 주민번호가 아닙니다.");
        return false;
      }
  
      // **************** 입력된 주민 번호로 생일 입력하기 *****************
      if (arrIdNum2[0] == 1 || arrIdNum2[0] == 2) { // 2000년 이전
        let y = (pNum1.substring(0, 2)); // 2자리씩
        let m = (pNum1.substring(2, 4));
        let d = (pNum1.substring(4, 6));
        setYear(`${1900 + parseInt(y)}`); // 년
        setMonth(`${m.padStart(2, '0')}`); // 월
        setDay(`${d.padStart(2, '0')}`); // 일
      } else if (arrIdNum2[0] == 3 || arrIdNum2[0] == 4) { // 2000년 이후
        let y = (pNum1.substring(0, 2));
        let m = (pNum1.substring(2, 4));
        let d = (pNum1.substring(4, 6));
        setYear(`${2000 + parseInt(y)}`);
        setMonth(`${m.padStart(2, '0')}`);
        setDay(`${d.padStart(2, '0')}`);
      }
  
        return true;
    };
  
    // ID 중복 확인  
    const checkButton = () => {
      axios.post(`${address}/server/member/idCheck?id=${id}`)
      .then((res) => {
        console.log(res.data.result && res.data.result.id !== null);
        if (res.data.result && res.data.result.id !== null) {
          alert('사용 불가능한 아이디 입니다.\n다시 입력해주세요.');
        } else {
          alert('사용가능한 아이디 입니다');
          setExId("성공")
        }
      })
      .catch((err) => {
        console.error(err);
      });
    }
  
    // 회원 가입 버튼 -> 유효성 검사 -> true 로그인 페이지로 이동
    const handleSignUp = () => {
      const isValid = CheckSignUp({ // CheckSignUp 함수에 사용자 입력 정보 전달
        id: id,
        pw: pw,
        pw2: pw2,
        name: name,
        nick: nick,
        pNum1: pNum1,
        pNum2: pNum2,
        year: year,
        month: month,
        day: day
      });
    
      if (isValid) { // 유효성 검사가 통과했을 경우
        alert('회원가입 완료', '회원가입이 성공적으로 완료되었습니다.');
        signUp();
      } else { // 유효성 검사가 통과하지 못했을 경우
      }
    };
    
    const signUp = async () => {
      try {
        let response = await axios.post(`${address}/server/member/regist`, {
          id: id,
          pw: pw,
          name: name,
          nick: nick,
          birth: year + "-" + month + "-" + day,
          profile: profile
        });
        console.log(response.status);
        if (response.status === 200) { // 성공적으로 회원가입이 되었을 때
          alert('회원가입 완료', '회원가입이 성공적으로 완료되었습니다.');
          navigate('/login'); // 로그인 페이지로 이동
        } else {
          alert('회원가입 실패', '회원가입에 실패하였습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    const handleCheckpNum = () => {
        return () => CheckpNum(pNum1, pNum2, setYear, setMonth, setDay);
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 150}}>
            <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'center', marginBottom: '2rem' }}>
                <h4>회원가입</h4>
            </div>
            <div style={{ width: '450px', height: '40px', display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}>
                <IdInput
                    ref={idRef}
                    type="text"
                    value={id}
                    onChange={idChange}
                    onFocus={() => setId("")}
                />
                <button style={{ width: '80px', background: 'none', border: '1px solid', fontWeight: 'bold', fontSize: '15px' }} disabled={disabled} onClick={checkButton}>중복확인</button>
            </div>
            <div style={{display: 'flex', flexDirection: "column", alignItems: 'center', padding: '1rem'}}>
                <PwInput
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    onFocus={() => setPw("")}
                />
                <Pw2Input
                    type="password"
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    onFocus={() => setPw2("")}
                />
                <NameInut
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setName("")}
                />
                <NicInput
                    type="text"
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                    onFocus={() => setNick("")}
                />
            </div>
            <div style={{ width: '810px', display: 'flex', flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                  <FrontInput
                      type="text"
                      value={pNum1}
                      onChange={(e) => setPNum1(e.target.value)}
                      onFocus={() => setPNum1("")}
                  />
                  <h5>&nbsp;&nbsp;-&nbsp;&nbsp;</h5>
                  <BackInput
                      type="text"
                      value={pNum2}
                      onChange={(e) => setPNum2(e.target.value)}
                      onFocus={() => setPNum2("")}
                  />
                </div>
                <button style={{ width: '55px', height: '40px', background: 'none', border: '1px solid', fontWeight: 'bold', fontSize: '15px' }} onClick={handleCheckpNum()}>인증</button>
            </div>
            <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'center', alignItems: 'center', padding: '1rem'}}>
                <YearInput
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={false}
                />
                <h5>&nbsp;&nbsp;-&nbsp;&nbsp;</h5>
                <MonthInput
                    type="text"
                    value={month}
                    onChange={setMonth}
                    disabled={false}
                />
                <h5>&nbsp;&nbsp;-&nbsp;&nbsp;</h5>
                <DayInput
                    type="text"
                    value={day}
                    onChange={setDay}
                    disabled={false}
                />
            </div>
            <button style={{ width: '80px', height: '40px', background: 'none', border: '1px solid', fontWeight: 'bold', fontSize: '15px' }} onClick={handleSignUp}>회원가입</button>
        </div>
    )
}

const IdInput = styled.input`
width: 350px;
height: 40px;
background: none;
padding-left: 1rem;
border: 1px solid;

&:focus {
  outline: none; /* 포커스 테두리 제거 */
}
`
const PwInput = styled.input`
width: 350px;
height: 40px;
background: none;
border: none;
padding-left: 1rem;
border: 1px solid;

&:focus {
  outline: none; /* 포커스 테두리 제거 */
}
`
const Pw2Input  = styled.input`
width: 350px;
height: 40px;
background: none;
border: none;
padding-left: 1rem;
border: 1px solid;
margin-top: 1rem;

&:focus {
  outline: none; /* 포커스 테두리 제거 */
}
`
const NameInut = styled.input`
width: 350px;
height: 40px;
background: none;
border: none;
padding-left: 1rem;
border: 1px solid;
margin-top: 1rem;

&:focus {
  outline: none; /* 포커스 테두리 제거 */
}
`
const NicInput = styled.input`
width: 350px;
height: 40px;
background: none;
padding-left: 1rem;
border: 1px solid;
margin-top: 1rem;

&:focus {
  outline: none; /* 포커스 테두리 제거 */
}
`
const FrontInput = styled.input`
width: 350px;
height: 40px;
background: none;
padding-left: 1rem;
border: 1px solid;

&:focus {
  outline: none; /* 포커스 테두리 제거 */
}
`
const BackInput = styled.input`
width: 350px;
height: 40px;
background: none;
padding-left: 1rem;
border: 1px solid;

&:focus {
  outline: none; /* 포커스 테두리 제거 */
}
`
const YearInput = styled.input`
width: 350px;
height: 40px;
background: none;
padding-left: 1rem;
border: 1px solid;

&:focus {
  outline: none; /* 포커스 테두리 제거 */
}
`
const MonthInput = styled.input`
width: 350px;
height: 40px;
background: none;
padding-left: 1rem;
border: 1px solid;

&:focus {
  outline: none; /* 포커스 테두리 제거 */
}
`
const DayInput = styled.input`
width: 350px;
height: 40px;
background: none;
padding-left: 1rem;
border: 1px solid;

&:focus {
  outline: none; /* 포커스 테두리 제거 */
}
`

export default SignUp;