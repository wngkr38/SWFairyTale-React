import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import DefaultImage from '../image/ModalImg1.png';

const MyFairyTale = () => {
    const [bookList, setBookList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [scrollDirection, setScrollDirection] = useState(0); // 스크롤 방향을 저장하는 상태
    const context = JSON.parse(sessionStorage.getItem('user'));
    const address = process.env.REACT_APP_SERVER_PORT;
    const id = context.id;
    const bookListRef = useRef(null);
    const navigate = useNavigate();
    const pageSize = 3;

    // 선택 시 게시물 접근
    const selectBookList = async (seqNum) => {
        await axios.post(`${address}/server/book/viewBook`, {
            seqNum: seqNum,
            id: id
        })
        .then((response) => {
            navigate('/viewPage', { state: { viewInfo: response.data.viewBook, userPageNum: 0 } });
        })
        .catch((error) => {
            console.error(error);
        })
    }

    // 게시물 삭제 함수
    const deleteBookList = async (seqNum) => {
        if(window.confirm('해당 게시물을 삭제하시겠습니까?')) {
            await axios.post(`${address}/server/book/deleteBook`, {
                seqNum: seqNum
            })
            .then((response) => {
                console.log('게시물 삭제 성공');
                getMyFairyTale(); // 삭제 후 목록 새로고침
            })
            .catch((error) => {
                console.error('게시물 삭제 실패', error);
            });
        }
    };

    const getMyFairyTale = async () => {
        try {
            await axios.post(address + '/server/board/myBookList', {
                id: id,
                currentPage: currentPage,
                pageSize: pageSize
            })
            .then((response) => {
                setBookList(response.data.myFairyTale);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.error(error);
            })
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getMyFairyTale();
    }, [currentPage])

    // 새 데이터 로드 후 스크롤 애니메이션 실행
    useEffect(() => {
        if (scrollDirection !== 0 && bookListRef.current) {
            const scrollAmount = 320; // 아이템 너비 + 여백
            const currentScroll = bookListRef.current.scrollLeft;
            bookListRef.current.scrollTo({
                left: currentScroll + scrollAmount * scrollDirection,
                behavior: 'smooth'
            });
            setScrollDirection(0); // 스크롤 방향 초기화
        }
    }, [bookList, scrollDirection]);

    // 이전 페이지로 이동
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setScrollDirection(-1); // 스크롤 방향 설정
            setCurrentPage(prev => prev - 1);
        }
    };

    // 다음 페이지로 이동
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setScrollDirection(1); // 스크롤 방향 설정
            setCurrentPage(prev => prev + 1);
        }
    };

    return (
        <Container>
        <StyledButton onClick={handlePrevPage} disabled={currentPage <= 1}>이전</StyledButton>
        <BookListContainer>
        {bookList.length > 0 ? (
            bookList.slice(0, 3).map((item, index) => (
                <BookItem key={index} onClick={() => selectBookList(item.seqNum)}>
                    <img src={item?.titleImage ? item?.titleImage : DefaultImage} alt={item.title} />
                    <div style={{ width: '100%', height: '70px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h5 style={{ fontWeight: 600, marginLeft: '1rem' }}>{item.title}</h5>
                        {(JSON.parse(sessionStorage.getItem('user'))?.id === "admin" || JSON.parse(sessionStorage.getItem('user'))?.id === item.id) && 
                        <button 
                            style={{ 
                                width: '50px',
                                height: '30px',
                                fontWeight: '600', 
                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', 
                                border: 'none', 
                                borderRadius: '20px',
                                background: 'none',
                                marginRight: '1rem'
                            }}
                            onClick={() => deleteBookList(item.seqNum)}
                        >
                            삭제
                        </button> 
                        }
                    </div>
                </BookItem>
            ))
        ) : (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>데이터가 없습니다.</div>
        )}

        </BookListContainer>
        <StyledButton onClick={handleNextPage} disabled={currentPage >= totalPages}>다음</StyledButton>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

const BookListContainer = styled.div`
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    margin: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const BookItem = styled.div`
    width: 290px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ddd;
    cursor: pointer;
    margin-left: 1rem;
    margin-right: 1rem;

    &:hover {
        background-color: #f9f9f9;
    }

    img {
        width: 90%;
        height: 250px;
        margin-top: 1rem;
    }

    h5 {
        font-size: 16px;
        font-weight: bold;
    }

    h6 {
        font-size: 15px;
    }

    span {
        font-size: 12px;
        color: #0000004D;
    }
`;

const StyledButton = styled.button`
  background-color: #FFFFFF;
  color: #000000;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  outline: none; /* 포커스 시 외곽선 제거 */
  font-weight: bold;

  &:hover {
    background-color: #F0F0F0;
  }

  &:disabled {
    background-color: #EFEFEF; /* 비활성화 시 배경색 */
    color: #666666; /* 비활성화 시 글자색 */
    box-shadow: none; /* 비활성화 시 그림자 제거 */
  }
`;

export default MyFairyTale;