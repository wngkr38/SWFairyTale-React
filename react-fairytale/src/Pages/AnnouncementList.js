import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import SelectIcon from '../image/select_Icon.png';

const AnnouncementList = () => {
    const navigate = useNavigate();
    const address = process.env.REACT_APP_SERVER_PORT;
    const [announcementList, setAnnouncementList] = useState([]);
    const [listValue, setListValue] = useState('최신순');
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const isAdmin = JSON.parse(sessionStorage.getItem('user'))?.id === 'admin';
    const pageSize = 10;

    const noticeWriteBut = () => {
        navigate('/noticeWrite');
    }

    const getAnnouncementList = async (select) => {
        await axios.post(`${address}/server/announcement/${select}`, {
            currentPage: currentPage,
            pageSize: pageSize
        })
        .then((response) => {
            setAnnouncementList(response.data.announcementList);
            setTotalPages(response.data.totalPages);
        })
        .catch((error) => {
            console.error(error);
        })
    }

    // 선택 시 게시물 접근
    const selectAnnouncement = async (seqNum) => {
        await axios.post(`${address}/server/announcement/selectAnnouncement`, {
            seqNum: seqNum
        })
        .then((response) => {
            navigate('/announcementInfo', { state: { info: response.data.selectAnnouncement } });
        })
        .catch((error) => {
            console.error(error);
        })
    }

    // 검색 실행 함수
    const handleSearch = async () => {
        await axios.post(`${address}/server/announcement/selectTitle`, {
            title: searchTerm
        })
        .then((response) => {
            setAnnouncementList(response.data.selectTitle);
            setCurrentPage(1); // 검색 후 첫 페이지로 이동
        })
        .catch((error) => {
            console.error(error);
        })
    }

    // 게시물 삭제 함수
    const deleteAnnouncement = async (seqNum) => {
        if(window.confirm('해당 게시물을 삭제하시겠습니까?')) {
            await axios.post(`${address}/server/announcement/deleteAnnouncement`, {
                seqNum: seqNum
            })
            .then((response) => {
                console.log('게시물 삭제 성공');
                window.location.reload(); // 삭제 후 목록 새로고침
            })
            .catch((error) => {
                console.error('게시물 삭제 실패', error);
            });
        }
    };

    // 이전 페이지로 이동
    const handlePrevPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    };

    // 다음 페이지로 이동
    const handleNextPage = () => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    };

    // 페이지 변경 시 목록 다시 불러오기
    useEffect(() => {
        getAnnouncementList("announcementList");
    }, [currentPage]);

    return (
        <AnnouncementListContainer>
            <TitleDiv>
                <h2>공지사항</h2>
                <span>관리자가 전하는 말을 모아보아요.</span>
            </TitleDiv>
            <SelectDiv>
                <SelectText>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="검색어 입력"
                    />
                    <button onClick={handleSearch} style={{ width: '50px' }}><img src={SelectIcon} style={{ width: '18px', height: '18px' }} /></button>
                </SelectText>
            </SelectDiv>
            <div style={{ width: '80%', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <SelectBtu>
                <select
                    value={listValue}
                    onChange={(e) => {
                        setListValue(e.target.value);
                        getAnnouncementList(e.target.value);
                    }}
                >
                    <option value="announcementList">최신순</option>
                    <option value="viewAnnouncementList">조회수 순</option>
                </select>
                {isAdmin && <button onClick={noticeWriteBut}>게시물 작성</button>}
            </SelectBtu>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <AnnouncementItemContainer>
                <AnnouncementText>
                    <sapn>No</sapn>
                    <sapn>제목</sapn>
                    <sapn>등록일</sapn>
                </AnnouncementText>
            {announcementList.map((item, index) => (
                <AnnouncementItem key={index} onClick={() => selectAnnouncement(item.seqNum)}>
                    <sapn>{isAdmin && <button style={{}} onClick={() => deleteAnnouncement(item.seqNum)}>삭제</button>}{index + 1}</sapn>
                    <sapn>{item.title}</sapn>
                    <sapn>{item.date}</sapn>
                </AnnouncementItem>
            ))}
            </AnnouncementItemContainer>
            </div>
            <PaginationContainer>
                <button onClick={handlePrevPage} disabled={currentPage <= 1}>이전</button>
                <span>현재 페이지: {currentPage}</span>
                <button onClick={handleNextPage} disabled={currentPage >= totalPages}>다음</button>
            </PaginationContainer>
        </AnnouncementListContainer>
    )
}

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

    button {
        padding: 5px 10px;
        margin: 0 10px;
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 5px;
        cursor: pointer;

        &:disabled {
            background-color: #e0e0e0;
            cursor: default;
        }
    }

    span {
        margin: 0 10px;
    }
`;

const TitleDiv = styled.div`
    height: 100px;
    padding: 30px;

    h2 {
        font-size: 30px;
        font-weight: 700;
    }
    span {
        color: rgba(0, 0, 0, 0.7);
    }
`

const SelectDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 3rem;
`

const SelectText = styled.div`
    width: 550px;
    height: 50px;
    border: 1px solid;
    border-radius: 30px;
    display: flex;
    flex-direction: row;

    input {
        width: 480px;
        height: 50px;
        border: none;
        background: none;
        margin-left: 1.25rem;
        &:focus {
            outline: none; /* 포커스 테두리 제거 */
        }
    }

    button {
        border-radius: 30px;
        background: none;
        border:none;
    }
`

const SelectBtu = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    select {
        width: 120px;
        height: 40px;
        border: none;
        border-bottom: 2px solid;


        &:focus {
            outline: none; /* 포커스 테두리 제거 */
        }
    }

    button {
        width: 120px;
        height: 40px;
        font-weight: 600;
        margin-top: 5.5rem;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border: none;
        border-radius: 20px;
        background: none;
    }
`

const AnnouncementListContainer = styled.div`
    padding: 20px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
`;

const AnnouncementItemContainer = styled.div`
    width: 70%;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin: 20px;
`;
const AnnouncementText = styled.div`
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;

    sapn {
        font-size: 18px;
        margin-left: 5rem;
        margin-right: 5rem;
    }
`

const AnnouncementItem = styled.button`
    width: 100%;
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    border-bottom: 1px solid #ddd;
    
    &:hover {
        background-color: #f9f9f9;
    }
    &:last-child {
        border-bottom: none;
    }

    sapn {
        font-size: 15px;
        margin-left: 2rem;
        margin-right: 2rem;
    }

    button {
        font-weight: 600;
        margin-right: 1rem;
        width: 60px;
        height: 40px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border: none;
        border-radius: 20px;
        background: none;
    }
`;

export default AnnouncementList;