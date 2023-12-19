import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import DefaultImage from '../image/ModalImg1.png';
import SelectIcon from '../image/select_Icon.png';

const RecommendList = () => {
    const [start, setStart] = useState(1);
    const [page, setPage] = useState(1);
    const [productList, setProductList] = useState([]);
    const [queryType, setQueryType] = useState('ItemEditorChoice');
    const [selectedLabel, setSelectedLabel] = useState('편집자 추천 리스트');
    // 검색창 텍스트
    const [searchTerm, setSearchTerm] = useState('');
    // 알라딘 apiKey
    const aladinApiKey = process.env.REACT_APP_ALADDIN_KEY;
    const navigate = useNavigate();

    const fetchAladinProductList = async (type) => {
        setQueryType(type);
        if(type == 'ItemEditorChoice') {
            setSelectedLabel('편집자 추천 리스트');
        } else if(type == 'ItemNewAll') {
            setSelectedLabel('신간 전체 리스트');
        } else if(type == 'ItemNewSpecial') {
            setSelectedLabel('주목할 만한 신간 리스트');
        } else {
            setSelectedLabel('베스트셀러 리스트');
        }
        try {
            const url = `/ttb/api/ItemList.aspx`;
            const params = {
                TTBKey: aladinApiKey,
                QueryType: type,
                MaxResults: 10, // 가져올 상품의 최대 개수
                Start: start, // 시작 인덱스
                CategoryId: 13789,
                Cover: 'Big',
                Output: 'js', // JSON 형식으로 데이터를 요청
                Version: 20131101 // API 버전
            };
            // axios를 이용하여 API 요청
            const response = await axios.get(url, { params });

            // 응답 데이터에서 상품 리스트 추출
            setProductList(response.data.item);
        } catch (error) {
            console.error('Error fetching Aladin product list:', error);
        }
    };

    const fetchAladinProductFind = async () => {
        try {
            const url = `/ttb/api/ItemSearch.aspx`;
            const params = {
                TTBKey: aladinApiKey,
                QueryType: searchTerm ? 'Title' : queryType,
                Query: searchTerm, // 검색어가 있을 경우에만 Query 설정
                MaxResults: 10, // 가져올 상품의 최대 개수
                Start: 1, // 시작 인덱스
                CategoryId: 1108,
                Cover: 'Big',
                Output: 'js', // JSON 형식으로 데이터를 요청
                Version: 20131101 // API 버전
            };
            // axios를 이용하여 API 요청
            const response = await axios.get(url, { params });

            // 응답 데이터에서 상품 리스트 추출
            setProductList(response.data.item || []);
        } catch (error) {
            console.error('Error fetching Aladin product list:', error);
        }
    };

    useEffect(() => {
        if (searchTerm === '') {
            fetchAladinProductList('ItemEditorChoice');
        } else {
            const delaySearch = setTimeout(() => {
                fetchAladinProductFind();
            }, 500);
            return () => clearTimeout(delaySearch);
        }
    }, [start, searchTerm]);

    const handleNext = () => {
        setStart(prevStart => prevStart + 10);
        setPage(prevPage => prevPage + 1);
    };

    const handlePrev = () => {
        setStart(prevStart => (prevStart > 1 ? prevStart - 10 : 1));
        setPage(prevPage => prevPage - 1);
    };

    return (
        <BookListContainer>
            <TitleDiv>
                <h2>알라딘 목록</h2>
                <span>실제 동화책 작품들을 모아보아요.</span>
            </TitleDiv>
            <SelectDiv>
                <SelectText>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="책 제목을 입력해주세요."
                    />
                    <button onClick={fetchAladinProductFind} style={{ width: '50px' }}><img src={SelectIcon} style={{ width: '18px', height: '18px' }} /></button>
                </SelectText>
            </SelectDiv>
            <div style={{ width: '70%', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <SelectBtu>
                <select
                    value={selectedLabel}
                    onChange={(e) => {
                        setSelectedLabel(e.target.value);
                        fetchAladinProductList(e.target.value);
                    }}
                >
                    <option value="ItemEditorChoice">편집자 추천 리스트</option>
                    <option value="ItemNewAll">신간 전체 리스트</option>
                    <option value="ItemNewSpecial">주목할 만한 신간 리스트</option>
                    <option value="Bestseller">베스트셀러 리스트</option>
                </select>
            </SelectBtu>
            </div>
            <BookItemContainer>
             {/* 첫 번째 5개의 아이템 */}
             {productList.slice(0, 5).map((product, index) => (
                <a style={{ textDecoration : 'none', color: 'black' }} href={product.link} key={index}>
                <BookItem key={index}>
                    <img src={product?.cover ? product?.cover : DefaultImage} alt={product.title} />
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h5 style={{ marginLeft: '1rem', marginTop: '1rem' }}>{product.title}</h5>
                        <h6 style={{ marginLeft: '1rem' }}>{product.author}</h6>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '2rem', marginBottom: '1rem' }}>
                        <span >{product.date}</span>
                    </div>
               </BookItem>
               </a>
             ))}
             {/* 두 번째 5개의 아이템 */}
             {productList.slice(5, 10).map((product, index) => (
                <a style={{ textDecoration : 'none', color: 'black' }} href={product.link} key={index}>
                <BookItem>
                    <img src={product?.cover ? product?.cover : DefaultImage} alt={product.title} />
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h5 style={{ marginLeft: '1rem', marginTop: '1rem' }}>{product.title}</h5>
                        <h6 style={{ marginLeft: '1rem' }}>{product.author}</h6>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '2rem', marginBottom: '1rem' }}>
                        <span >{product.date}</span>
                    </div>
                </BookItem>
                </a>
             ))}
           </BookItemContainer>
        <PaginationContainer>
            <button onClick={handlePrev} disabled={page <= 1}>이전</button>
            <span>현재 페이지: {page}</span>
            <button onClick={handleNext}>다음</button>
        </PaginationContainer>
    </BookListContainer>
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
    padding: 15px;

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
    margin-top: 2rem;
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
        width: 200px;
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

export default RecommendList;