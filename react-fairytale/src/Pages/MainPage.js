import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import axios from "axios";

import Dall_E from '../image/dall_e.png';
import API_Icon from '../image/API_Icon.png';
import DefaultImage from '../image/ModalImg1.png';
import Write from '../image/write.png';
import Read from '../image/read.png';
import English from '../image/english.png';
import MakeImage from '../image/makeImage.png';
import Main1 from '../image/main1.png';
import Main2 from '../image/main2.png';
import Main3 from '../image/main3.png';

const images = [Main1, Main2, Main3];

const MainPage = () => {
    const [productList, setProductList] = useState([]);
    const [bestBoardList, setBestBoardList] = useState([]);
    const [announcementList, setAnnouncementList] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null); // 마우스 오버 상태를 관리하는 로컬 상태 추가
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const aladinApiKey = process.env.REACT_APP_ALADDIN_KEY; // 알라딘 apiKey
    const address = process.env.REACT_APP_SERVER_PORT;
    const navigate = useNavigate();
    const id = JSON.parse(sessionStorage.getItem('user'))?.id;

    const fetchAladinProductList = async () => {
        try {
            const url = `/ttb/api/ItemList.aspx`;
            const params = {
                TTBKey: aladinApiKey,
                QueryType: 'ItemEditorChoice',
                MaxResults: 5, // 가져올 상품의 최대 개수
                Start: 1, // 시작 인덱스
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

    const fetchBestBoardList = async () => {
        try {
            const response = await axios.post(address + '/server/board/bestBoard', null);
            setBestBoardList(response.data.bestBoard);
        }catch (error) {
            console.error('Error posting best board list:', error);
        }
    }

    const getAnnouncementList = async () => {
        await axios.post(`${address}/server/announcement/announcementList`, {
            currentPage: 1,
            pageSize: 10
        })
        .then((response) => {
            setAnnouncementList(response.data.announcementList);
        })
        .catch((error) => {
            console.error(error);
        })
    }

    useEffect(() => {
        getAnnouncementList();
        fetchAladinProductList();
        fetchBestBoardList();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // 5초마다 이미지 변경
    
        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
      }, []);

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

    // 선택 시 게시물 접근
    const selectBookList = async (seqNum) => {
        if(id){
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
        } else {
            alert("로그인이 필요한 기능입니다.");
            navigate('/login');
        }
    }

    return (
        <PageContainer>
            <div style={{ 
                    backgroundImage: `url(${images[currentImageIndex]})`,
                    width: '100%', // 배경 이미지 크기 설정
                    height: '100vh', // 배경 이미지 높이 설정
                    backgroundSize: 'cover', // 배경 이미지가 div를 꽉 채우도록 설정
                    backgroundPosition: 'center top',
                    transition: 'background-image 0.5s ease-in-out', // 이미지 변경 시 부드러운 전환 효과
                }}>
                <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', paddingLeft: 250, paddingBottom: 200 }}>
                    <StoryDiv>
                        <BigStoryFont>
                            <h2>아이가 스스로 만드는</h2>
                            <h2>나만의 AI 동화책!</h2>
                        </BigStoryFont>
                        <SmallStoryFont>
                            <span>아이들이 AI를 활용하여 동화책을 스스로 만들 수 있도록 합니다.</span>
                            <span>시각적인 흥미와 언어적 능력 향상을 위한 AI 동화책 만들기로</span>
                            <span>아이의 상상력과 창의력을 자유롭게 발휘해보세요.</span>
                        </SmallStoryFont>
                        <button style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} onClick={() => navigate('/booklist')}>스토리 보기</button>
                    </StoryDiv>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <NoticeDiv>
                    <span>공지사항</span>
                    <button style={{ position: 'relative', right: '20rem', background: 'none', border: 'none'}} onClick={() => selectAnnouncement(announcementList[0].seqNum)}>{announcementList[0]?.title}</button>
                    <button style={{background: 'none', border: 'none'}} onClick={() => navigate('/announcementList')}>더보기</button>
                </NoticeDiv>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <BoardkDiv>
                <span>Open Gallary</span>
                <TitleDiv>
                    <h2>직접 만든 동화책을 감상해요</h2>
                    <button onClick={() => navigate('/booklist')}>더 보러가기</button>
                </TitleDiv>
                <BoardList>
                    {bestBoardList.map((board, index) => (
                        <BoardCard 
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)} 
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => selectBookList(board.seqNum)}
                        style={{
                            // 조건부 스타일링: 마우스 오버된 아이템의 경우 스타일 변경
                            transform: hoveredIndex === index ? 'scale(0.80)' : 'scale(0.7)',
                            transition: 'transform 0.2s, filter 0.2s',
                            position: 'relative', // 자식 요소인 제목을 절대 위치로 배치하기 위함
                        }}>
                            <BoardImage
                            src={board.titleImage || DefaultImage}
                            alt={board.title}
                            style={{
                                width: '300px', // 혹은 필요한 너비
                                height: '330px', // 비율 유지를 위함
                                filter: hoveredIndex === index ? 'brightness(80%)' : 'brightness(100%)', // 마우스 오버 시 밝기 조절
                                transition: 'filter 0.2s' // 부드러운 필터 효과 전환
                            }}/>
                            {hoveredIndex === index && (
                                <div style={{ 
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: '0rem',
                                    }}>
                                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <div style={{ width: '80%', height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <span style={{
                                        fontSize: '30px',
                                        fontWeight: 'bold',
                                        color: 'white',
                                    }}>
                                        {board.title}
                                    </span>
                                    <span style={{
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        color: 'white',
                                    }}>
                                        보러가기
                                    </span>
                                    </div>
                                    </div>
                                </div>
                            )}
                        </BoardCard>
                    ))}
                </BoardList>
            </BoardkDiv>
            </div>
            <KidDiv>
                <h2>아이들의 이야기, 동화책 전시!</h2>
                <span>창의성을 뽑낼 준비가 되었나요?</span>
                <span>아이들의 창의력과 상상력이 담겨진 동화책으로 도서 전시회를 선보이세요.</span>
                <span>직접 참여하고 창작하는 과정을 통해 자신의 아이디어를 발휘하며 더 큰 성취를</span>
                <span>이룰 수 있습니다. 특별한 전시회로 나만의 독특한 이야기 세계를 함께 공유해요.</span>
            </KidDiv>
            <NewDiv>
                <BigNewDiv>
                    <h2 style={{ color: '#660099' }}>최신 기술을 접목한&nbsp;</h2>
                    <h2>동화책 만들기,</h2>
                </BigNewDiv>
                <h2>북작북작을 선택해야 하는 이유</h2>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem' }}>
                <span>글쓰기는 따분하고 지루하다고요? 그런 선입견을 깨뜨리고 교육과 재미 모두 잡은 글쓰기</span>
                <span>프로그램을 체험해보세요. 상상력이 풍부한 아이들의 이야기를 실현해주세요!</span>
                </div>
            </NewDiv>
            <AllCardDiv>
                <h2 style={{ width: '720px', textAlign: 'right', fontWeight: 'bold', marginTop: '10rem', color: '#660099' }}>Chat GPT-4 turbo 사용</h2>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <TopCardDiv>
                    <CardInfo style={{ backgroundColor: '#6133E2' }}>
                        <h6>01</h6>
                        <BigInfo>
                            <h3>어떤 이야기를</h3>
                            <h3>쓰고 싶으신가요?</h3>
                        </BigInfo>
                        <SmallInfo>
                            <span>평소 어떤 글을 쓰실지 감은 잡았지만 생각을</span>
                            <span>정리하지 못하시나요? 떠오르는 스토리를 쓰면</span>
                            <span>적은 내용을 토대로 스토리를 추천드려요.</span>
                        </SmallInfo>
                        <CardImage>
                            <img src={Write}/>
                        </CardImage>
                    </CardInfo>
                    <CardInfo style={{ backgroundColor: '#181818' }}>
                        <h6>02</h6>
                        <BigInfo>
                            <h3>나만의 AI 도우미와</h3>
                            <h3>더욱 쉽고 간편한 글쓰기</h3>
                        </BigInfo>
                        <SmallInfo>
                            <span>줄거리를 토대로 단계 별 플롯을 생성해 주고,</span>
                            <span>동화책 페이지에 들어갈 이야기를 수정할 수</span>
                            <span>있어요.</span>
                        </SmallInfo>
                        <CardImage>
                            <img src={Read}/>
                        </CardImage>
                    </CardInfo>
                </TopCardDiv>
                </div>
                <div style={{ height: '600px', display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: 'black' }}>
                <BottomCardDiv>
                    <CardInfo style={{ backgroundColor: '#181818' }}>
                        <h6>03</h6>
                        <BigInfo>
                            <h3>영어로 써야하는 프롬프트,</h3>
                            <h3>한글로도 쉽게 써요</h3>
                        </BigInfo>
                        <SmallInfo>
                            <span>영어만 지원하는 AI 생성은 그만!</span>
                            <span>북작북작에선 한글로 적어도 최상의</span>
                            <span>퀄리티의 그림을 생성해줘요.</span>
                        </SmallInfo>
                        <CardImage>
                            <img src={English}/>
                        </CardImage>
                    </CardInfo>
                    <CardInfo style={{ backgroundColor: '#6133E2' }}>
                        <h6>04</h6>
                        <BigInfo>
                            <h3>빠르고 쉽게,</h3>
                            <h3>나도 프로 동화책 작가</h3>
                        </BigInfo>
                        <SmallInfo>
                            <span>글 내용을 분석한 뒤 이미지 생성 문장을 자동</span>
                            <span>으로 생성하여 아이들도 수준 높은 일러스트가</span>
                            <span>들어가는 동화책을 만들 수 있습니다.</span>
                        </SmallInfo>
                        <CardImage>
                            <img src={MakeImage}/>
                        </CardImage>
                    </CardInfo>
                </BottomCardDiv>
                </div>
                <ImageDiv>
                    <ImageInfo>
                        <h2 style={{ color: '#660099' }}>DALL·E 3</h2>
                        <h2 style={{ color: 'white' }}>로 강력해진 이미지 생성</h2>
                    </ImageInfo>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                    <span>AI 기술의 선두를 달리는 DALL·E 3를 사용하여</span>
                    <span>상상했던 이미지 그 이상의 능력을 제공합니다.</span>
                    </div>
                    <img src={Dall_E}/>
                </ImageDiv>
                <GPTInfo>
                    <img src={API_Icon}/>
                </GPTInfo>
            </AllCardDiv>
        </PageContainer>
    );
}

const StoryDiv = styled.div`

    button {
        width: 130px;
        height: 50px;
        display: inline-block;
        align-items: center;
        font-weight: 900;
        border-radius: 30px;
        border: 1px solid white;
        color: white;
        background: none;
        margin-top: 2rem;
    }
`

const BigStoryFont = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;

    h2 {
        font-size: 48px;
        font-weight: 900;
        color: white;
    }
`

const SmallStoryFont = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-top: 1rem;

    span {
        color: white;
        font-weight: 600;
    }
`

const NoticeDiv = styled.div`
    width: 70%;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid;

    span {
        color: white;
        font-weight: 600;
    }

    button {
        color: white;
        font-weight: 600;
    }
`

const PageContainer = styled.div`
    height: 100%;
    background-color: black;
`;

const BoardkDiv = styled.div`
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10rem;

    span {
        color: #660099;
        font-weight: 700;
    }
`

const TitleDiv = styled.div`
    display: flex;
    flexDirection: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 70px;

    h2 {
        color: white;
        font-size: 32px;
        font-weight: 700;
        margin-top: 0.5rem;
    }

    button {
        width: 120px;
        height: 50px;
        background: none;
        border-radius: 30px;
        border: 1px solid white;
        color: white;
    }
`

const BoardList = styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-evenly;
margin-top: 3rem;
`;

const BoardCard = styled.button`
width: 100%;
text-align: center;
background: none;
border: none;
`;

const BoardImage = styled.img`
    width: 270px;
    height: 300px;
    border-radius: 15px;
    margin-bottom: 10px;
`;

const BoardName = styled.div`
font-size: 1em;
`;

const KidDiv = styled.div`
    display: flex;
    height: 400px;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;

    h2 {
        color: white;
        font-weight: 900;
        font-size: 38px;
        margin-top: 1rem;
        margin-bottom: 2rem;
    }

    span {
        color: white;
        font-weight: 600;
        padding: 3px;
    }
`

const NewDiv = styled.div`
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 7rem;

    h2 {
        color: white;
        font-size: 32px;
        font-weight: 800;
    }

    span {
        color: white;
        font-weight: 600;
    }
`

const BigNewDiv = styled.div`
    display: flex;
    flex-direction: row;

    h2 {
        color: white;
        font-size: 32px;
        font-weight: 800;
    }
`

const AllCardDiv = styled.div`
    height: 1000px;

    h2 {
        text-align: left;
    }
`

const TopCardDiv = styled.div`
    width: 870px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 2rem;
    margin-right: 10rem;
`

const BottomCardDiv = styled.div`
    width: 870px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 4rem;
    margin-left: 10rem;
`

const CardInfo = styled.div`
    width: 420px;
    height: 470px;
    border: 1px solid;
    border-radius: 15px;
    display: flex;
    flex-direction: column;

    h3 {
        color: white;
        font-weight: bold;
    }

    h6 {
        color: white;
        width: 80px;
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        margin-top: 1rem;
    }

    span {
        color: white;
        font-weight: bold;
        padding: 2px;
    }

    img {
        width: 50px;
        height: 50px;
    }
`

const BigInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 2rem;
`

const SmallInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 1rem;
`

const CardImage = styled.div`
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    margin-right: 2rem;

    img {
        width: 50px;
        height: 50px;
        -webkit-filter: opacity(.5) drop-shadow(0 0 0 white) saturate(0%) brightness(200%);
        filter: opacity(.5) drop-shadow(0 0 0 white) saturate(0%) brightness(200%);
    }
`

const ImageDiv = styled.div`
height: 1400px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
background-color: black;

span {
    color: white;
    font-weight: bold;
    padding: 2px;
}

img {
    color: white;
    margin-top: 3rem;
    width: 1200px;
    height: 1050px;
    border-radius: 30px;
}
`

const ImageInfo = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
h2 {
    font-size: 32px;
    font-weight: bold;
}
`

const GPTInfo = styled.div`
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: black;

    img {
        width: 500px;
        height: 50px;
    }
`

export default MainPage;