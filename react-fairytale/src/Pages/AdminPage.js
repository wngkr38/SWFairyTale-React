
import React, { useState, useEffect } from 'react';
import LineChats from "../Chart/LineChats";
import PieChats from "../Chart/PieChats";
import axios, { all } from 'axios';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';

import DefaultImage from '../image/ModalImg1.png';
import User from '../image/user.png';

const AdminPage = () => {
    const [memberInfo, setMemberInfo] = useState([]);
    const [yearSelectValue, setYearSelectValue] = useState(""); // select value값
    const [monthSelectValue, setMonthSelectValue] = useState(""); // select value값
    const [daySelectValue, setDaySelectValue] = useState(""); // select value값
    const [yearSelected, setYearSelected] = useState(false);  // 연도별
    const [monthSelected, setMonthSelected] = useState(false);  // 월별
    const [selectedYear, setSelectedYear] = useState(null); // 연도별 조건
    const [selectedMonth, setSelectedMonth] = useState(null); // 일별 조건
    const [tebButtonKey, setTebButtonKey] = useState("all");   // 전체 버튼
    const [allValue, setAllValue] = useState(["2022", "2023"])
    const [yearsValue, setYearsValue] = useState(""); // 연도별 value
    const [monthsValue, setMonthsValue] = useState(""); // 월별 value
    const [dayValue, setDaysValue] = useState("");  // 일별 value
    const [memberYear, setMemberYear] = useState([]); // 멤버 연도별
    const [memberMonth, setMemberMonth] = useState([]); // 멤버 월별
    const [memberDay, setMemberDay] = useState([]); // 멤버 일별
    const [selectedData, setSelectedData] = useState([]); // 선택한 select인 경우
    const [lineData, setLineData] = useState([]); // Line 차트에 들어갈 데이터

    const [weeklyData, setWeeklyData] = useState([]); // 일주일 결제 단위

    const [payMentList, setPayMentList] = useState([]); // 결제한 유저 정보 리스트
    const address = process.env.REACT_APP_SERVER_PORT;
    
    const [makeInfo, setMakeInfo] = useState([]); // book을 생성한 유저 정보

    const isLeapYear = (year) => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));  // 연도에 따라 일별이 달라짐(28, 29, 30, 31)

    const handleEntireButton = (e) => { // 전체 데이터 Select
        window.location.reload();
    };

    const handleYearSelect = (e) => { // 연도별 Select
        const year = e.target.value;  // year select value
        setYearsValue(year);
        setTebButtonKey("years");// tebButtonKey years slect key
        setYearSelected(true);
        setSelectedYear(year === "" ? null : parseInt(year, 10)); // 연도별을 클릭하지 않으면 월별은 null 클릭하면 1월 ~ 12월 띄움
        setMonthSelectValue(""); // 월 선택 상자 초기화
        setDaySelectValue(""); // 일 선택 상자 초기화
        setMonthSelected(false); // 일별 select문 활성화 초기
    }

    const handleMonthSelect = (e) => { 
        const monthBasic = e.target.value;  // month select value
        const month = parseInt(monthBasic.split("월"));

        setYearSelected(true);
        setMonthsValue(month - 1);  // value - 1
        setTebButtonKey("months"); // tebButtonKey months slect key
        setSelectedMonth(parseInt(month, 10));  // 월별을 클릭하지 않으면 일별은 null, 클릭하면 1일 ~ 31일
        setDaySelectValue(""); // 일 선택 상자 초기화
    }

    const handleDaySelect = (e) => {  // 일별 Select
        const dayBasic = e.target.value;  // day select value
        const day = parseInt(dayBasic.split("일")); // value에서 "일" 빼고 정수형
        
        setDaysValue(day - 1);  // value - 1
        setTebButtonKey("days"); // tebButtonKey days
    };

    const getDaysInMonth = (month) => { // 연도별과 월별에 따른 일별
        if (!month || !selectedYear) return 0;
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month === 2 && isLeapYear(selectedYear)) {
          return 29;
        }
        return daysInMonth[month - 1];
    };

    const getPayMentList = async () => {
        await axios.post(`${address}/server/payment/paymentList`, {
            currentPage: 1,
            pageSize: 5
        })
        .then((response) => {
            setPayMentList(response.data.paymentList);
        })
        .catch((error) => {
            console.error(error);
        })
    }

    const getBookList = async () => {
        await axios.post(`${address}/server/board/makeInfo`, {
            currentPage: 1,
            pageSize: 5
        })
        .then((response) => {
            console.log(response.data.makeInfo);
            setMakeInfo(response.data.makeInfo);
        })
        .catch((error) => {
            console.error(error);
        })
    }

    useEffect(() => {
        const fetchInterface = async () => {
            try {
                const response = await axios.post(`${address}/server/payment/getDESCPaymentId`);
                setMemberInfo(response.data.paymentList);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchInterface();
        getPayMentList();
        getBookList();
    }, [])

    useEffect(() => {
        const classifyDate = () => {
            let yearData = [];
            let monthData = [];
            let dayData = [];
    
            memberInfo.forEach((item) => {
                const date = new Date(item.date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
        
                if (!yearsValue || year === parseInt(yearsValue)) {
                    yearData.push(item);
                }
                if (!monthsValue || month === parseInt(monthsValue) + 1) {
                    monthData.push(item);
                }
                if (!dayValue || day === parseInt(dayValue) + 1) {
                    dayData.push(item);
                }
            });
        
            return { yearData, monthData, dayData };
        }
    
        const { yearData, monthData, dayData } = classifyDate();
    
        setMemberYear(yearData);
        setMemberMonth(monthData);
        setMemberDay(dayData);
    }, [memberInfo, yearsValue, monthsValue, dayValue])
    
    useEffect(() => {
        if (dayValue !== "") {
          setSelectedData(memberDay);
        } else if (monthsValue !== "") {
          setSelectedData(memberMonth);
        } else if (yearsValue !== "") {
          setSelectedData(memberYear);
        } else {
          setSelectedData(memberInfo);
          const dayData = getLastWeekDataCount(memberInfo);
          setWeeklyData(dayData);
        }
      }, [memberDay, memberMonth, memberYear, memberInfo, dayValue, monthsValue, yearsValue]);

      const getCurrentData = (data) => {
        let processedData = [];
    
        if (tebButtonKey === 'all') {
            allValue.forEach((value) => {
                let numStorybook = 0;
                let numPremium = 0;
                const valueInfo = data.reduce((acc, item) => {
                    if (item.product === "Storybook Creation" && new Date(item.date).getFullYear() === parseInt(value)) {
                        numStorybook++;
                    } else if (item.product === "Premium" && new Date(item.date).getFullYear() === parseInt(value)) {
                        numPremium++;
                    }
                    return acc;
                }, { name: parseInt(value), premium: 0, storybook: 0 });
    
                valueInfo.storybook = numStorybook;
                valueInfo.premium = numPremium;
                processedData.push(valueInfo);
            });
        } else if (tebButtonKey === 'years') {
            // 연도별 데이터 처리
            processedData = Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                let numStorybook = 0;
                let numPremium = 0;
    
                const yearInfo = data.reduce((acc, item) => {
                    if (item.product === "Storybook Creation" && new Date(item.date).getMonth() === parseInt(month) - 1) {
                        numStorybook++;
                    } else if (item.product === "Premium" && new Date(item.date).getMonth() === parseInt(month) - 1) {
                        numPremium++;
                    }
                    return acc;
                }, { name: parseInt(month), premium: 0, storybook: 0 });
    
                yearInfo.storybook = numStorybook;
                yearInfo.premium = numPremium;
                return yearInfo;
            });
        } else if (tebButtonKey === 'months') {
            // 월별 데이터 처리
            processedData = Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1).map((day) => {
                let numStorybook = 0;
                let numPremium = 0;
    
                const monthInfo = data.reduce((acc, item) => {
                    if (item.product === "Storybook Creation" && new Date(item.date).getDate() === parseInt(day)) {
                        numStorybook++;
                    } else if (item.product === "Premium" && new Date(item.date).getDate() === parseInt(day)) {
                        numPremium++;
                    }
                    return acc;
                }, { name: parseInt(day), premium: 0, storybook: 0 });
    
                monthInfo.storybook = numStorybook;
                monthInfo.premium = numPremium;
                return monthInfo;
            });
        } else if (tebButtonKey === 'days') {
            // 일별 데이터 처리
            processedData = Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => {
                let numStorybook = 0;
                let numPremium = 0;
    
                const dayInfo = data.reduce((acc, item) => {
                    if (item.product === "Storybook Creation" && new Date(item.date).getHours() === hour) {
                        numStorybook++;
                    } else if (item.product === "Premium" && new Date(item.date).getHours() === hour) {
                        numPremium++;
                    }
                    return acc;
                }, { name: hour, premium: 0, storybook: 0 });
    
                dayInfo.storybook = numStorybook;
                dayInfo.premium = numPremium;
                return dayInfo;
            });
        }
    
        return processedData;
    };

    useEffect(() => {
        const allInfo = getCurrentData(selectedData);
        setLineData(allInfo);
    }, [selectedData])

    const getLastWeekDataCount = (data) => {
        const today = new Date();
        const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    
        let dailyCounts = [];
    
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() + i);
            const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    
            const todaysData = data.filter(item => {
                const itemDate = new Date(item.date);
                return (
                    itemDate.getFullYear() === currentDate.getFullYear() &&
                    itemDate.getMonth() === currentDate.getMonth() &&
                    itemDate.getDate() === currentDate.getDate()
                );
            });
    
            // Premium과 Storybook Creation의 주문 수와 매출액 계산
            const premiumData = todaysData.filter(item => item.product === 'Premium');
            const storybookData = todaysData.filter(item => item.product === 'Storybook Creation');
            
            const premiumCount = premiumData.length;
            const storybookCount = storybookData.length;
    
            const premiumSales = premiumData.reduce((acc, item) => acc + item.amount, 0);
            const storybookSales = storybookData.reduce((acc, item) => acc + item.amount, 0);
    
            // 해당 날짜의 개수와 매출액을 배열에 추가합니다.
            dailyCounts.push({
                date: dateStr,
                count: premiumCount + storybookCount,
                price: premiumSales + storybookSales
            });
        }
    
        return dailyCounts;
    };
    

    return (
        <AdminContainer>
            <div style={{ width: '90%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <LineSty>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '1rem' }}>전체 결제 내역</h5>
                    <div style={{ display: 'flex', flexDirection: 'row', marginRight: '1rem', marginTop: '1rem' }}>
                    <EntireButton onClick={handleEntireButton}>
                        전체
                    </EntireButton>
                    <YearSelect
                        value={yearSelectValue}
                        onChange={(e) => {
                            setYearSelectValue(e.target.value);
                            handleYearSelect(e);
                        }}
                        >
                        <option value="">연도별</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                    </YearSelect>
                    <MonthSelect
                        value={monthSelectValue}
                        onChange={(e) => {
                            setMonthSelectValue(e.target.value);
                            handleMonthSelect(e);
                        }}
                    >
                        <option value="">월별</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <option key={month}>{month}월</option>
                        ))}
                    </MonthSelect>
                    <DaySelect
                        value={daySelectValue}
                        onChange={(e) => {
                            setDaySelectValue(e.target.value);
                            handleDaySelect(e);
                        }}
                    >
                        <option value="">일별</option>
                        {Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1).map((day) => (
                            <option key={day}>{day}일</option>
                        ))}
                    </DaySelect>
                    </div>
                </div>
                 <LineChats data={lineData}/>
            </LineSty>
            <Table>
            <thead>
                <tr>
                <th style={{ fontWeight: 'bold', fontSize: '17px' }}>일자별 요약</th>
                <th></th>
                <th></th>
                <th>일주일 통계</th>
                </tr>
                <tr style={{ backgroundColor: '#f4f4f4' }}>
                <th>일자</th>
                <th>주문 수</th>
                <th>매출액</th>
                <th>취소</th>
                </tr>
            </thead>
            <tbody>
                {weeklyData.length > 0 ? (
                weeklyData.map((item, index) => (
                    <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.count}</td>
                    <td>{item.price.toLocaleString()}원</td>
                    <td>{item.cancelled ? 'Yes' : 'No'}</td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="7">지난 1주일 동안의 결제 내역이 없습니다.</td>
                </tr>
                )}
                <tr style={{ backgroundColor: '#f4f4f4' }}>
                <th>최근 7일 합계</th>
                <th>{weeklyData.reduce((acc, item) => acc + item.count, 0)}개</th>
                <th>{weeklyData.reduce((acc, item) => acc + item.price, 0).toLocaleString()}원</th>
                <th>0건</th>
                </tr>
            </tbody>
            </Table>
            </div>
            <div style={{ width: '90%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{ width: '800px', height: '400px', boxShadow: '0 2px 3px #ccc' }}>
                <div style={{ width: '100%', height: '50px', borderBottom: '1px solid #ddd', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <h5 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '1rem' }}>구매 내역</h5>
                    </div>
                        {payMentList.map((item, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '10px',}}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <img src={User} style={{ width: '50px', height: '50px' }}/>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '1rem' }}>
                                    <span>{item.product === 'Premium' ? '월정액 결제' : `책 결제`}</span>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                        <span>{item.name}</span>
                                        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                </div>
                <div style={{ width: '50%', height: '400px', boxShadow: '0 2px 3px #ccc' }}>
                    <div style={{ width: '100%', height: '50px', borderBottom: '1px solid #ddd', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <h5 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '1rem' }}>컨텐츠 반응</h5>
                    </div>
                    {makeInfo.map((item, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <img src={item.titleImage ? item.titleImage : DefaultImage} style={{ width: '50px', height: '50px' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '1rem' }}>
                                    <span>[책 만들기]&nbsp;{item.title}</span>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                        <span>{item.name}</span>
                                        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>        
                        </div>
                    ))}
                </div>
            </div>
        </AdminContainer>
    )
}

const AdminContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const LineSty = styled.div`
  width: 800px;
  height: 400px;
  background-color: white;
  margin-top: 20px;
  border-radius:10px;
  box-shadow: 0 2px 3px #ccc;
  
  h5 {
    margin-top: 1rem;
    font-size: 15px;
    font-weight: 700;
  }
`

const Table = styled.table`
  width: 50%;
  height: 400px;
  border-collapse: collapse;
  box-shadow: 0 2px 3px #ccc;
  margin: 20px 0;
  text-align: center;

  th, td {
    padding: 8px;
    font-size: 14px;
  }
`

const EntireButton = styled.button`
  border: 1px solid #ddd;
  width: 60px;
  height: 30px;
  appearance: none;
  font-size: 11px;
  text-align: center;
  background-color: white;
`

const YearSelect = styled.select`
  border:1px solid #ddd;
  outline:none
  box-shadow:none;
  width: 60px;
  height: 30px;
  appearance: none;
  font-size: 11px;
  text-align: center;
  background-color: white;
  margin-left: 1rem;
`

const MonthSelect = styled.select`
  border: 1px solid #ddd;
  width: 60px;
  height: 30px;
  appearance: none;
  font-size: 11px;
  text-align: center;
  background-color: white;
  margin-left: 1rem;
`

const DaySelect = styled.select`
  border: 1px solid #ddd;
  width: 60px;
  height: 30px;
  appearance: none;
  font-size: 11px;
  text-align: center;
  background-color: white;
  margin-left: 1rem;

  option {
    min-width: 30rem;
  }
`

export default AdminPage;