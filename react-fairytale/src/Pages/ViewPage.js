import React, { useState, useEffect, Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import HTMLFlipBook from 'react-pageflip';
import axios from 'axios';

import Mike from '../image/mike.png';
import Voice from '../image/voice.png';

const ViewPage = () => {
    const locatoin = useLocation();
    const navigate = useNavigate();
    const viewInfo = locatoin.state.viewInfo;
    const userPageNum = locatoin.state.userPageNum;
    const seqNum = viewInfo.seqNum;
    const MaxPage = viewInfo.pageNum;
    let [currentPageData, setCurrentPageData] = useState({});
    const [currentPageNum, setCurrentPageNum] = useState(userPageNum); // 현재 페이지 번호
    const [soundModal, setSoundModal] = useState(false);
    const [voicename, setVoiceName] = useState("ngaram");
    const [tempVoiceName, setTempVoiceName] = useState(voicename || '');
    const [Summary, setSummary] = useState(viewInfo.summary);
    const [Title, setTitle] = useState(viewInfo.title);
    const [Name, setName] = useState(viewInfo.name);
    let [PageText, setPageText] = useState([]);
    const [isKorean, setIsKorean] = useState(true);
    let [soundplay, setSoundPlay] = useState(false);
    let [nextPageData, setNextPageData] = useState({});
    const [flipBookDimensions, setFlipBookDimensions] = useState({ width: 650, height: 600 });
    const formattedText = currentPageData && currentPageData.text ? currentPageData.text.replace(/\./g, '.\n') : '';

    const context = JSON.parse(sessionStorage.getItem('user'));
    const address = process.env.REACT_APP_SERVER_PORT;

    const [contentStyles, setContentStyles] = useState({
        fontSize1: '35px',
        fontSize2: '25px',
        imageHeight: '600px' // 기본 이미지 높이
    });

    
    const OpenSoundModal = () => {
        setSoundModal(true);
    }
    const CloseSoundModal = () => {
        setSoundModal(false);
    }
    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    const handleLanguageChange = (value) => {
        setIsKorean(value === 'true');
    };

    const updatePageNumInServer = (pageNum) => {
        axios.post(`${address}/server/book/updateRecently`, {
            id: context.id,
            seqNum: viewInfo.seqNum,
            pageNum: pageNum
        })
            .then(response => {
                console.log("페이지 번호가 업데이트되었습니다:", pageNum);
            })
            .catch(error => {
                console.error("페이지 번호 업데이트 오류:", error);
            });
    };

    const handleNextPage = () => {
        if (currentPageNum <= viewInfo.pageNum + 1) {
            setCurrentPageNum(currentPageNum + 1);
            updatePageNumInServer(currentPageNum + 1);
            console.log("오른쪽", currentPageNum);

        }
    }
    const handlenowPage = () => {
        if (currentPageNum <= viewInfo.pageNum + 1) {
            setCurrentPageNum(currentPageNum);
            updatePageNumInServer(currentPageNum);
            console.log("현재", currentPageNum);
        }
    }

    const handlePrevPage = () => {
        setCurrentPageNum(currentPageNum - 1);
        updatePageNumInServer(currentPageNum - 1);
        console.log("왼쪽", currentPageNum);
    }

    const lastPage = async () => {
        if (window.confirm('마지막 페이지입니다.\n종료하시겠습니까?')) {
            updatePageNumInServer(currentPageNum);
            await axios.post(`${address}/server/board/selectBoard`, {
                seqNum: seqNum
            })
                .then((response) => {
                    console.log(response.data.selectBoard);
                    navigate('/bookinfo', { state: { bookDetails: response.data.selectBoard } });
                })
                .catch((error) => {
                    console.error(error);
                })
        } else {

        }
    }
    const nowPage = () => {
        if (currentPageNum > 0) {
            axios.post(`${address}/server/book/pageData`, { seqNum: viewInfo.seqNum, pageNum: currentPageNum })
                .then(response => {
                    setCurrentPageData(response.data.pageData);

                    // setPageText(response.data.pageData.text);


                })
                .catch(error => {
                    console.error("페이지 데이터 조회 오류:", error);
                });
        }
    }
    useEffect(() => {
        // 첫 페이지가 아니라면 페이지 데이터를 가져옴
        if (currentPageNum > 0) {
            axios.post(`${address}/server/book/pageData`, { seqNum: viewInfo.seqNum, pageNum: currentPageNum })
                .then(response => {
                    setCurrentPageData(response.data.pageData);

                    // setPageText(response.data.pageData.text);


                })
                .catch(error => {
                    console.error("페이지 데이터 조회 오류:", error);
                });
        }

    }, [currentPageNum, viewInfo.seqNum]);

    useEffect(() => {
        if (currentPageNum < viewInfo.pageNum) { // 마지막 페이지가 아닐 때만 다음 페이지 데이터를 가져옴
            axios.post(`${address}/server/book/pageData`, { seqNum: viewInfo.seqNum, pageNum: currentPageNum + 1 })
                .then(response => {
                    setNextPageData(response.data.pageData);
                    console.log(response.data.pageData);
                })
                .catch(error => {
                    console.error("다음 페이지 데이터 조회 오류:", error);
                });
        }

    }, [currentPageNum, viewInfo.seqNum, viewInfo.pageNum]);

    useEffect(() => {
        updatePageNumInServer();
    }, [])
    useEffect(() => {
        if (isKorean != true && PageText[currentPageNum - 1] == null) {
            PapagoApi();
        }

    }, [currentPageData])

    const handlePreViewText = () => {
        PreviewVoice();
    }

    const handleReadText = () => {
        speakText(); // speaktext 함수 호출
        console.log(currentPageNum);
        console.log(voicename);
    }

    const speakText = async () => {
        setSoundPlay(true);
        let textToSpeak;
        if (!isKorean) {
            textToSpeak = PageText[currentPageNum - 1];
        } else {
            textToSpeak = currentPageData.text;
        }
        const naverClientId = process.env.REACT_APP_NAVER_ID;
        const naverClientSecret = process.env.REACT_APP_NAVER_SECRET;

        const params = new URLSearchParams({
            speaker: voicename,
            volume: '1',
            speed: '0',
            text: textToSpeak,
        });

        try {
            const response = await axios.post(
                '/tts-premium/v1/tts',
                params.toString(),
                {
                    responseType: 'blob', // 응답을 Blob 객체로 받음
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-NCP-APIGW-API-KEY-ID': naverClientId,
                        'X-NCP-APIGW-API-KEY': naverClientSecret,
                    },
                },
            );

            // Blob 객체를 URL로 변환
            const audioUrl = URL.createObjectURL(response.data);

            // 오디오 재생
            const audio = new Audio(audioUrl);
            audio.play();

            audio.onended = () => {
                setSoundPlay(false);
                URL.revokeObjectURL(audioUrl); // 사용이 끝난 URL을 정리
            };
        } catch (error) {
            console.error('Error:', error);
            setSoundPlay(false);
        }
    };

    useEffect(() => {
        const handleReadText = () => {
            if (!soundplay) {
                speakText(); // speaktext 함수 호출
                console.log(currentPageNum);
                console.log(voicename);
            }
        }

        const speakText = async () => {
            if (!soundplay) {
                setSoundPlay(true);
                let textToSpeak;
                if (!isKorean) {
                    textToSpeak = PageText[currentPageNum - 1];
                } else {
                    textToSpeak = currentPageData.text;
                }
                const naverClientId = process.env.REACT_APP_NAVER_ID;
                const naverClientSecret = process.env.REACT_APP_NAVER_SECRET;

                const params = new URLSearchParams({
                    speaker: voicename,
                    volume: '1',
                    speed: '0',
                    text: textToSpeak,
                });

                try {
                    const response = await axios.post(
                        '/tts-premium/v1/tts',
                        params.toString(),
                        {
                            responseType: 'blob', // 응답을 Blob 객체로 받음
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'X-NCP-APIGW-API-KEY-ID': naverClientId,
                                'X-NCP-APIGW-API-KEY': naverClientSecret,
                            },
                        },
                    );

                    // Blob 객체를 URL로 변환
                    const audioUrl = URL.createObjectURL(response.data);

                    // 오디오 재생
                    const audio = new Audio(audioUrl);
                    audio.play();

                    audio.onended = () => {
                        setSoundPlay(false);
                        URL.revokeObjectURL(audioUrl); // 사용이 끝난 URL을 정리
                    };
                } catch (error) {
                    console.error('Error:', error);
                    setSoundPlay(false);
                }
            }
        };
    }, [voicename, currentPageNum, soundplay]);

    const PreviewVoice = async () => {
        if (!soundplay) {
            setSoundPlay(true);

            let previewText = isKorean ? "제 목소리 미리 들어보세요" : "Listen to my voice in advance";

            const naverClientId = process.env.REACT_APP_NAVER_ID;
            const naverClientSecret = process.env.REACT_APP_NAVER_SECRET;

            const params = new URLSearchParams({
                speaker: tempVoiceName,
                volume: '1',
                speed: '0',
                text: previewText,
            });

            try {
                const response = await axios.post(
                    '/tts-premium/v1/tts',
                    params.toString(),
                    {
                        responseType: 'blob',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-NCP-APIGW-API-KEY-ID': naverClientId,
                            'X-NCP-APIGW-API-KEY': naverClientSecret,
                        },
                    },
                );

                /// Blob 객체를 URL로 변환
                const audioUrl = URL.createObjectURL(response.data);

                // 오디오 재생
                const audio = new Audio(audioUrl);
                audio.play();

                audio.onended = () => {
                    setSoundPlay(false);
                    URL.revokeObjectURL(audioUrl); // 사용이 끝난 URL을 정리
                };

            } catch (error) {
                console.log("dpfjdpfjdpfj");
                console.error('Error:', error.response ? error.response.data : error.message);
                setSoundPlay(false);
            }
        }
    };

    const PapagoApi = () => {
        axios.post(`${address}/server/papago/translate`, { text: currentPageData.text })
            .then(response => {
                console.log(response);
                console.log("파파고 전송 완료")
                const responsetranslate = JSON.parse(response.data.message.result.translatedText);
                console.log(responsetranslate.text);
                setPageText(prevPageText => [...prevPageText, responsetranslate.text]);
                console.log(response.data);
                console.log(response.data.message);
                console.log(response.data.message.result);
                console.log(response.data.message.result.translatedText.text[0]);
                console.log(PageText);
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth * 0.4;
            const newHeight = window.innerHeight * 0.81;
            setFlipBookDimensions({ width: newWidth, height: newHeight });
        
            // 화면 크기에 따라 폰트 크기와 이미지 높이 조정
            const newFontSize1 = window.innerWidth * 0.63 < 500 ? '30px' : '35px';
            const newFontSize2 = window.innerWidth < 1200 ? '20px' : '25px';
            const newImageHeight = window.innerHeight * 0.63;
            setContentStyles({
                fontSize1: newFontSize1,
                fontSize2: newFontSize2,
                imageHeight: newImageHeight
            });
        };

        // 리사이즈 이벤트 리스너 추가
        window.addEventListener('resize', handleResize);

        // 초기 크기 설정
        handleResize();

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '23%', height: '80px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <PlayBut onClick={handleReadText}>
                    <img src={Voice} style={{ width: '50px', height: '40px' }}/>
                    <h6>보이스 재생</h6>
                </PlayBut>
                <VoiceBut onClick={OpenSoundModal}>
                    <img src={Mike} style={{ width: '50px', height: '35px' }}/>
                    <h6>번역 & 목소리 선택</h6>
                </VoiceBut>
            </div>
            <div style={{ width: '100%', padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                <HTMLFlipBook
                    style={{ width: '100%', height: '100%', backgroundColor: 'white' }}
                    onFlip={(e) => {
                        console.log('Current page: ' + e.data);
                        if (currentPageNum + 1 == e.data / 2) { // 오른쪽으로 넘김
                            console.log('Current page: ' + e.data);
                            setCurrentPageNum(e.data / 2);
                            handleNextPage(Math.ceil(e.data / 2));
                        } else { // 왼쪽으로 넘김
                            console.log('Current page: ' + e.data);
                            setCurrentPageNum(e.data / 2);
                            handlePrevPage(Math.ceil(e.data / 2));
                        }

                    }}
                    getPageCount={MaxPage}
                    width={flipBookDimensions.width}
                    height={flipBookDimensions.height}
                >
                    <Page number={1}></Page>
                    <Page number={2}>
                        <div style={{ flex: 1, padding: 10, height: '100%', boxShadow: '5px -3px 10px 2px rgba(0,0,0,1)', alignItems: 'center' }}>
                        <img style={{ width: '100%', height: contentStyles.imageHeight }} src={viewInfo.titleImage} alt="" />

                            {isKorean ? (
                                <BigStoryFont>
                                    <span style={{ fontSize: contentStyles.fontSize1, textAlign: 'center' }}>{viewInfo.title}</span>
                                    <span style={{ fontSize: contentStyles.fontSize2, textAlign: 'center' }}>글쓴이 : {viewInfo.name}</span>
                                </BigStoryFont>
                            ) : (
                                <BigStoryFont>
                                    <span style={{ fontSize: contentStyles.fontSize2, textAlign: 'center' }}>{Title}</span>
                                    <span style={{ fontSize: contentStyles.fontSize2, textAlign: 'center' }}>{Name}</span>
                                </BigStoryFont>
                            )}
                        </div>
                    </Page>
                    {Array.from({ length: viewInfo.pageNum * 2 }, (_, index) => (
                        <Page key={index + 3} number={index + 3}>
                            {(index + 3) % 2 === 1 && currentPageData ? (  // 홀수 페이지: 이미지
                                <div style={{ flex: 1, padding: 10, height: '100%', boxShadow: '5px -3px 15px 2px rgba(0,0,0,1)' }}>
                                    <img style={{ width: '100%', height: '100%' }} src={currentPageData.image} alt="" />
                                </div>
                            ) : currentPageData ? (  // 짝수 페이지: 텍스트
                                isKorean ? (
                                    <div style={{ flex: 1, padding: 30, borderLeft: '1px solid', height: '100%', width: '100%', boxShadow: '5px 0px 15px 2px rgba(0,0,0,1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <h5 style={{ fontSize: '25px', textAlign: 'left', whiteSpace: 'pre-line', lineHeight: '2.0' }}>{formattedText}</h5>
                                    </div>
                                ) : (
                                    <div style={{ flex: 1, padding: 30, borderLeft: '1px solid', height: '100%', width: '100%', boxShadow: '5px 0px 15px 2px rgba(0,0,0,1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <h5 style={{ fontSize: '25px', textAlign: 'left' , whiteSpace: 'pre-line', lineHeight: '2.0' }}>{PageText[currentPageNum - 1]}</h5>
                                    </div>
                                )
                            ) : null}
                        </Page>


                    ))}
                </HTMLFlipBook>
                {soundModal && (
                    <>
                        <Nav_modal onClick={CloseSoundModal}>
                            <Nav_modalin onClick={stopPropagation}>
                                <SoundDiv>
                                    <SoundModal>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 50 }}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="true"
                                                    name="language"
                                                    checked={isKorean}
                                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                                />
                                                <span>한국어</span>
                                            </label>
                                            <label style={{ marginLeft: '4rem' }}>
                                                <input
                                                    type="radio"
                                                    value="false"
                                                    name="language"
                                                    checked={!isKorean}
                                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                                />
                                                <span>영어</span>
                                            </label>
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            {isKorean ? (
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', padding: 10 }}>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="ngaram"
                                                                name="voiceChoice"
                                                                checked={tempVoiceName === "ngaram"}
                                                                onChange={(e) => setTempVoiceName(e.target.value)}
                                                            />
                                                            <span>가람</span>
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="nshasha"
                                                                name="voiceChoice"
                                                                checked={tempVoiceName === "nshasha"}
                                                                onChange={(e) => setTempVoiceName(e.target.value)}
                                                            />
                                                            <span>샤샤</span>
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="nsabina"
                                                                name="voiceChoice"
                                                                checked={tempVoiceName === "nsabina"}
                                                                onChange={(e) => setTempVoiceName(e.target.value)}
                                                            />
                                                            <span>마녀 사비나</span>
                                                        </label>
                                                    </div>
                                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="nwoof"
                                                                name="voiceChoice"
                                                                checked={tempVoiceName === "nwoof"}
                                                                onChange={(e) => setTempVoiceName(e.target.value)}
                                                            />
                                                            <span>멍멍이</span>
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="nhajun"
                                                                name="voiceChoice"
                                                                checked={tempVoiceName === "nhajun"}
                                                                onChange={(e) => setTempVoiceName(e.target.value)}
                                                            />
                                                            <span>하준</span>
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="nmammon"
                                                                name="voiceChoice"
                                                                checked={tempVoiceName === "nmammon"}
                                                                onChange={(e) => setTempVoiceName(e.target.value)}
                                                            />
                                                            <span>악마 마몬</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            value="clara"
                                                            name="voiceChoice"
                                                            checked={tempVoiceName === "clara"}
                                                            onChange={(e) => setTempVoiceName(e.target.value)}
                                                        />
                                                        <span>클라라</span>
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            value="matt"
                                                            name="voiceChoice"
                                                            checked={tempVoiceName === "matt"}
                                                            onChange={(e) => setTempVoiceName(e.target.value)}
                                                        />
                                                        <span>매트</span>
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            value="danna"
                                                            name="voiceChoice"
                                                            checked={tempVoiceName === "danna"}
                                                            onChange={(e) => setTempVoiceName(e.target.value)}
                                                        />
                                                        <span>안나</span>
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            value="djoey"
                                                            name="voiceChoice"
                                                            checked={tempVoiceName === "djoey"}
                                                            onChange={(e) => setTempVoiceName(e.target.value)}
                                                        />
                                                        <span>조이</span>
                                                    </label>
                                                </div>
                                            )}
                                            <div style={{ width: '100%', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <button onClick={handlePreViewText} style={{ marginBottom: '1rem', border: 'none', background: 'none', border: '1px solid' }}>목소리 미리 들어보기</button>
                                                <button style={{ border: 'none', background: 'none', border: '1px solid' }} onClick={() => {
                                                    setVoiceName(tempVoiceName);
                                                    if (isKorean != true) {
                                                        PapagoApi();
                                                    }
                                                    CloseSoundModal();
                                                }}
                                                >저장</button>
                                            </div>
                                        </div>
                                    </SoundModal>
                                </SoundDiv>
                            </Nav_modalin>
                        </Nav_modal>
                    </>
                )}
            </div>
        </div>
    )
}

const Page = styled.div`
    // 페이지 스타일
`;

const Nav_modalin = styled.div`
  width: 400px;
  height: 420px;
  background-color: white;
  padding: 20px; // 내부 패딩 추가
  border-radius: 8px; // 둥근 모서리
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1); // 그림자 효과 추가
  background: #FFFFFF 0% 0% no-repeat padding-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  img {
    position: relative;
    top: 3rem;
  }

  h4 {
    position: relative;
    top: 5rem;
    font-size: 15px;
  }

  h5 {
    position: relative;
    font-size: 13px;
    top: 8rem;
    left: 4.8rem;
    color: #747474;
  }
`

const Nav_modal = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); // 어두운 반투명 배경
  position: fixed;
  top: 0; // 화면 상단부터 시작
  left: 0; // 화면 왼쪽부터 시작
  z-index: 999; // 다른 요소들 위에 나타나도록 z-index 설정
`

const SoundDiv = styled.div`
  width: 100%;
  height: 100%;
`

const SoundModal = styled.div`
    width: 100%; // 원하는 너비를 설정합니다.
    height: 100%; // 원하는 높이를 설정합니다.
    background-color: white; // 검은색 배경에 알파값을 0.7로 설정
    border-radius: 20%;
    padding: 35px;
    align-items: center;
`

const RadioButton = styled.input`

`

const PlayBut = styled.button`
    width: 200px;
    height: 50px;
    display: flex;
    flexDirection: row;
    justify-content: center;
    align-items: center;
    border: none;
    background: none;
    border-radius: 20px;

    h6 {
        fontSize: 15px;
        text-align: center;
    }
`
const BigStoryFont = styled.div`
    height: 20%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    text-align: left;

    h2 {
        font-size: 48px;
        font-weight: 900;
        color: white;
    }
`

const VoiceBut = styled.button`
    display: flex;
    flexDirection: row;
    justify-content: center;
    align-items: center;
    border: none;
    background: none;

    h6 {
        fontSize: 15px;
        text-align: center;
}
`;


export default ViewPage;