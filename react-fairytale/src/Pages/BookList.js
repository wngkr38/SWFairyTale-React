import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import DefaultImage from '../image/ModalImg1.png';
import User from '../image/user.png';
import SelectIcon from '../image/select_Icon.png';

const BookList = () => {
    const navigate = useNavigate();
    const userId = JSON.parse(sessionStorage.getItem('user'))?.id
    const address = process.env.REACT_APP_SERVER_PORT;
    const [bestBoardList, setBestBoardList] = useState([]);
    const [bookList, setBookList] = useState([]);
    const [listValue, setListValue] = useState('최신순');
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const pageSize = 10;

    const fetchBestBoardList = async () => {
        try {
            const response = await axios.post(address + '/server/board/bestBoard', null);
            setBestBoardList(response.data.bestBoard);
        }catch (error) {
            console.error('Error posting best board list:', error);
        }
    }

    const getBookList = async (select) => {
        await axios.post(`${address}/server/board/${select}`, {
            currentPage: currentPage,
            pageSize: pageSize
        })
        .then((response) => {
            setBookList(response.data.boardList);
            setTotalPages(response.data.totalPages);
        })
        .catch((error) => {
            console.error(error);
        })
    }

    // 선택 시 게시물 접근
    const selectBookList = async (seqNum) => {
        if(userId) {
            await axios.post(`${address}/server/book/viewBook`, {
                seqNum: seqNum,
                id: userId
            })
            .then((response) => {
                console.log(response.data.selectBoard);
                navigate('/viewPage', { state: { viewInfo: response.data.viewBook, userPageNum: 0 } });
            })
            .catch((error) => {
                console.error(error);
            })
        } else {
            alert("로그인이 필요한 기능입니다.");
            navigate('/login');
        }
    }

    // 검색 실행 함수
    const handleSearch = async () => {
        await axios.post(`${address}/server/board/selectTitle`, {
            title: searchTerm
        })
        .then((response) => {
            setBookList(response.data.selectTitle);
            setCurrentPage(1); // 검색 후 첫 페이지로 이동
        })
        .catch((error) => {
            console.error(error);
        })
    }

    // 게시물 삭제 함수
    const deleteBookList = async (seqNum) => {
        if(window.confirm('해당 게시물을 삭제하시겠습니까?')) {
            await axios.post(`${address}/server/board/deleteBoard`, {
                seqNum: seqNum
            })
            .then((response) => {
                console.log('게시물 삭제 성공');
                getBookList('boardList'); // 삭제 후 목록 새로고침
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

    useEffect(() => {
        if (searchTerm === '') {
            getBookList('boardList');
            fetchBestBoardList();
        } else {
            const delaySearch = setTimeout(() => {
                handleSearch();
            }, 500);
            return () => clearTimeout(delaySearch);
        }
    }, [currentPage, searchTerm]);

    return (
        <BookListContainer>
            <TitleDiv>
                <h2>동화책 목록</h2>
                <span>북작북작으로 만든 작품들을 모아보아요.</span>
            </TitleDiv>
            <BestDiv>
                <h3>이번달 작가왕</h3>
                <BestBoard>
                    {bestBoardList.map((board, index) => (
                        <BoardCard
                            key={index}
                        >
                            <ImgDiv
                                onClick={() => selectBookList(board.seqNum)}
                            >
                                <BoardImage
                                    src={board?.titleImage? board?.titleImage : DefaultImage}
                                    alt={board.title}
                                />
                                <GradientOverlay>
                                    <h5 style={{ marginLeft: '3rem', marginTop: '5rem', marginBottom: '0.5rem' }}>{board.title}</h5>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <img src={User} style={{ width: '20px', height: '20px', marginLeft: '3rem' }}/>
                                        <h5 style={{ marginLeft: '0.5rem' }}>{board.name}</h5>
                                    </div>
                                </GradientOverlay>
                            </ImgDiv>
                        </BoardCard>
                    ))}
                </BestBoard>
            </BestDiv>
            <SelectDiv>
                <SelectText>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="책 제목을 입력해주세요."
                    />
                    <button onClick={handleSearch} style={{ width: '50px' }}><img src={SelectIcon} style={{ width: '18px', height: '18px' }} /></button>
                </SelectText>
            </SelectDiv>
            <div style={{ width: '70%', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <SelectBtu>
                <select
                    value={listValue}
                    onChange={(e) => {
                        setListValue(e.target.value);
                        getBookList(e.target.value);
                    }}
                >
                    <option value="boardList">최신 순</option>
                    <option value="commentBoardList">댓글 순</option>
                    <option value="likeBoardList">좋아요 순</option>
                    <option value="viewBoardList">조회수 순</option>
                </select>
            </SelectBtu>
            </div>
             <BookItemContainer>
             {/* 첫 번째 5개의 아이템 */}
             {bookList.slice(0, 5).map((item, index) => (
                <BookItem key={index} onClick={() => selectBookList(item.seqNum)}>
                    <img src={item?.titleImage ? item?.titleImage : DefaultImage} alt={item.title} />
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h5 style={{ marginLeft: '1rem', marginTop: '1rem' }}>{item.title}</h5>
                        <h6 style={{ marginLeft: '1rem' }}>{item.name}</h6>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '2rem', marginBottom: '1rem' }}>
                        <span >{item.date.split(' ')[0]}</span>
                    </div>
                    { (JSON.parse(sessionStorage.getItem('user'))?.id === "admin" || JSON.parse(sessionStorage.getItem('user'))?.id === item.id) && 
                        <button 
                            style={{ 
                                fontWeight: '600', 
                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', 
                                border: 'none', 
                                borderRadius: '20px',
                                background: 'none',
                                marginBottom: '1rem',
                                marginLeft: '13rem',
                            }}
                            onClick={() => deleteBookList(item.seqNum)}
                        >
                            삭제
                        </button> 
                    }
               </BookItem>
             ))}
             {/* 두 번째 5개의 아이템 */}
             {bookList.slice(5, 10).map((item, index) => (
                <BookItem key={index} onClick={() => selectBookList(item.seqNum)}>
                    <img src={item?.titleImage ? item?.titleImage : DefaultImage} alt={item.title} />
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h5 style={{ marginLeft: '1rem', marginTop: '1rem' }}>{item.title}</h5>
                        <h6 style={{ marginLeft: '1rem' }}>{item.name}</h6>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '2rem', marginBottom: '1rem' }}>
                        <span >{item.date.split(' ')[0]}</span>
                    </div>
                    { (JSON.parse(sessionStorage.getItem('user'))?.id === "admin" || JSON.parse(sessionStorage.getItem('user'))?.id === item.id) && 
                        <button 
                            style={{ 
                                fontWeight: '600', 
                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', 
                                border: 'none', 
                                borderRadius: '20px',
                                background: 'none',
                                marginBottom: '1rem',
                                marginLeft: '13rem',
                            }}
                            onClick={() => deleteBookList(item.seqNum)}
                        >
                            삭제
                        </button> 
                    }
                </BookItem>
             ))}
           </BookItemContainer>
        <PaginationContainer>
            <button onClick={handlePrevPage} disabled={currentPage <= 1}>이전</button>
            <span>현재 페이지: {currentPage}</span>
            <button onClick={handleNextPage} disabled={currentPage >= totalPages}>다음</button>
        </PaginationContainer>
    </BookListContainer>
    )
}

const TitleDiv = styled.div`
    height: 100px;
    padding: 15px;

    h2 {
        font-size: 30px;
        font-weight: 700;
    }
    span {
        color: rgba(0, 0, 0, 0.7);
    }
`

const BestDiv = styled.div`

    h3 {
        color: #6133E2;
        font-size: 20px;
        font-weight: 700;
        text-align: left;
        margin-left: 1rem;
    }
`

const BestBoard = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`

const BoardCard = styled.div`

`

const ImgDiv = styled.button`
    position: relative;
    width: 350px;
    height: 400px;
    border-radius: 15px;
    overflow: hidden;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border: none;
    background: none;
`;

const BoardImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 15px;
    object-fit: cover;
`

const GradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to top, white, transparent);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 0 0 15px 15px; // 그라디언트 부분에도 border-radius 적용

  h5 {
    font-size: 18px;
    font-weight: 600;
  }
`;

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

const SelectDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 5rem;
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
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;

    select {
        width: 120px;
        height: 40px;
        border: none;
        border-bottom: 2px solid;


        &:focus {
            outline: none; /* 포커스 테두리 제거 */
        }
    }
`

const BookListContainer = styled.div`
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BookItem = styled.div`
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    border: 1px solid #ddd;
    cursor: pointer;
    &:hover {
        background-color: #f9f9f9;
    }

    img {
        width: 100%;
        height: 270px;
        border-radius: 20px;
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

const BookItemContainer = styled.div`
    width: 80%;
    display: grid;
    grid-template-columns: repeat(5, 1fr); // 5개의 컬럼을 만듭니다.
    grid-gap: 16px; // 그리드 사이의 간격을 설정합니다.
    margin-bottom: 32px; // 줄 사이의 간격을 설정합니다.
`;

export default BookList;