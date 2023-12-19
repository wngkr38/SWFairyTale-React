import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import DefaultImage from '../image/ModalImg1.png';

export default function BoardList() {
    const context = JSON.parse(sessionStorage.getItem('user'));
    const [bookList, setBookList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10); // or any other default page size you want
    const address = process.env.REACT_APP_SERVER_PORT;
    const userId = context?.id;
    const userName = context?.name;
    const navigate = useNavigate();

    useEffect(() => {
        getMyFairyTale();
    }, [currentPage]);

    const getMyFairyTale = async () => {
        try {
            await axios.post(address + '/server/board/myBookList', {
                id: userId,
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

    // 이전 페이지로 이동
    const handlePrevPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    };

    // 다음 페이지로 이동
    const handleNextPage = () => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    };

    return (
        <BookListContainer>
            <TitleDiv>
                <h2>동화책 선택</h2>
                <span>우리 아이가 만든 책을 선택하여 동화책으로 만들어 보아요.</span>
            </TitleDiv>
            <BookItemContainer>
             {/* 첫 번째 5개의 아이템 */}
             {bookList.slice(0, 5).map((item, index) => (
                <BookItem key={index} onClick={() => navigate('/UserAddress', { state: { product: item } })}>
                    <img src={item?.titleImage ? item?.titleImage : DefaultImage} alt={item.title} />
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h5 style={{ marginLeft: '1rem', marginTop: '1rem' }}>{item.title}</h5>
                        <h6 style={{ marginLeft: '1rem' }}>{item.name}</h6>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '2rem', marginBottom: '1rem' }}>
                        <span >{item.date.split(' ')[0]}</span>
                    </div>
               </BookItem>
             ))}
             {/* 두 번째 5개의 아이템 */}
             {bookList.slice(5, 10).map((item, index) => (
                <BookItem key={index} onClick={() => navigate('/UserAddress', { state: { product: item } })}>
                    <img src={item?.titleImage ? item?.titleImage : DefaultImage} alt={item.title} />
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h5 style={{ marginLeft: '1rem', marginTop: '1rem' }}>{item.title}</h5>
                        <h6 style={{ marginLeft: '1rem' }}>{item.name}</h6>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '2rem', marginBottom: '1rem' }}>
                        <span >{item.date.split(' ')[0]}</span>
                    </div>
                </BookItem>
             ))}
           </BookItemContainer>
        <PaginationContainer>
            <button onClick={handlePrevPage} disabled={currentPage <= 1}>이전</button>
            <span>현재 페이지: {currentPage}</span>
            <button onClick={handleNextPage} disabled={currentPage >= totalPages}>다음</button>
        </PaginationContainer>
    </BookListContainer>
    );
}

const BookListContainer = styled.div`
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

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

const BookItemContainer = styled.div`
    width: 80%;
    display: grid;
    grid-template-columns: repeat(5, 1fr); // 5개의 컬럼을 만듭니다.
    grid-gap: 16px; // 그리드 사이의 간격을 설정합니다.
    margin-bottom: 32px; // 줄 사이의 간격을 설정합니다.
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

const BoardImage = styled.img`
    width: 200px;
    height: 250px;
    margin-bottom: 10px;
`;
const SectionTitle = styled.h2`
    font-size: 1.5em;
    margin-bottom: 20px;
`;
const BoardCard = styled.button`
width: 180px;
text-align: center;
background: none;
border: none;
`;