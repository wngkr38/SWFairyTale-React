import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';

import DeleteIcon from '../image/DeleteIcon.png'
import NoLikeImage from '../image/nonlike_book.png';
import LikeImage from '../image/like_book.png';
import CommandImage from '../image/commend_book.png';
import PlayBook from '../image/play_book.png';
import DefaultImage from '../image/ModalImg1.png';

const BookInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookDetails = location.state.bookDetails;
    const boardNum = bookDetails.boardNum;
    const seqNum = bookDetails.seqNum;
    const address = process.env.REACT_APP_SERVER_PORT;
    const userId = JSON.parse(sessionStorage.getItem('user'))?.id;

    const [likes, setLikes] = useState(0);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [title, setTitle] = useState("");
    const [titleImage, setTitleImage] = useState("");
    const [viewCnt, setViewCnt] = useState(0);
    const [likeCnt, setLikesCnt] = useState(0);
    const [commentCnt, setCommentCnt] = useState(0);
    const [summary, setSummary] = useState("");
    const [id, setId] = useState('');

    const [likeImage, setLikeImage] = useState(require('../image/nonlike_book.png'));
    const [userLikeState, setUserLikeState] = useState('');

    const refreshBoardDetails = () => {
        axios.post(`${address}/server/board/selectBoard`, { seqNum: seqNum }, )
        .then(response => {
            const bookInfo = response.data.selectBoard;
            setLikes(bookInfo.like);
            setName(bookInfo.name);
            setDate(bookInfo.date.split(' ')[0]);
            setTitle(bookInfo.title);
            setTitleImage(bookInfo.titleImage);
            setViewCnt(bookInfo.viewCnt);
            setLikesCnt(bookInfo.like);
            setCommentCnt(bookInfo.commentCnt);
            setSummary(bookInfo.summary);
            setId(bookInfo.id);
            
        })
        .catch(error => {
            console.error("error", error);
        })
    };

    // 게시물 페이지가 로드될 때마다 조회수 증가 요청 보내기
    useEffect(() => {
        refreshBoardDetails();
        axios.post(`${address}/server/board/boardView`, null, {
            params: {
                boardNum: boardNum
            }
        })
        .then(response => {
            console.log("조회수가 업데이트 되었습니다.");
        })
        .catch(error => {
            console.error("조회수 업데이트 중 오류 발생:", error);
        });
    }, []);

    // 좋아요 버튼 클릭 시 실행될 함수
    const handleLike = () => {
        if(userId){
            axios.post(`${address}/server/board/boardLike`, null, {
                params: {
                    userId: userId,
                    boardNum: boardNum
                }
            })
            .then(response => {
                console.log("좋아요 상태가 업데이트 되었습니다.");
                setLikes(response.data.like);
                checkUserLikeState();
            })
            .catch(error => {
                console.error("네트워크 오류:", error);
            });
        } else {
            alert("로그인이 필요한 기능입니다.");
            navigate('/login');
        }
    };

    // 댓글 버튼 클릭 시 실행될 함수
    const handleComment = () => {
        if(userId){
            axios.post(`${address}/server/comment/selectComment`, { boardNum: boardNum })
            .then(response => {
                // CommentList.js 페이지로 네비게이션하면서 데이터 전달
                navigate('/commentList', { state: {
                    comments: response.data.selectComment,
                    boardNum: boardNum
                } });
            })
            .catch(error => {
                console.error("댓글 조회 중 오류 발생:", error);
            });
        } else {
            alert("로그인이 필요한 기능입니다.");
            navigate('/login');
        }
    };

    // 동화 보기 버튼 클릭 시 실행될 함수
    const handleViewStory = () => {
        if(userId){
            axios.post(`${address}/server/book/viewBook`, { 
                seqNum: seqNum,
                id: userId
            })
            .then(response => {
                // CommentList.js 페이지로 네비게이션하면서 데이터 전달
                const viewBook = response.data.viewBook;
                navigate('/viewPage', { state: { viewInfo: viewBook, userPageNum: 0 } });
            })
            .catch(error => {
                console.error("동화 조회 중 오류 발생:", error);
            });
        } else {
            alert("로그인이 필요한 기능입니다.");
            navigate('/login');
        }
    };

    const handleBoardDelete = () => {
        if(window.confirm('해당 게시물을 삭제하시겠습니까?')) {
            axios.post(address + '/server/board/deleteBoard', { boardNum : boardNum })
            .then((response) => {
                navigate('/booklist');  
            })
            .catch((error) => {
                console.error("error : " + error);
            })
        }
    }

    // 헤당 게시물에 대한 사용자의 좋아요 상태 확인하는 함수
    const checkUserLikeState = () => {
        axios.post(`${address}/server/board/checkUserLikeState`, null, {
            params: {
                userId: userId,
                boardNum: boardNum
            }
        })
        .then(response => {
            console.log("사용자의 좋아요 상태입니다. : " + response.data.like);
            setUserLikeState(response.data.like);

            if(response.data.like === 0) {
                setLikeImage(require('../image/nonlike_book.png'));
            } else {
                setLikeImage(require('../image/like_book.png'));
            }

        })
        .catch(error => {
            console.error("네트워크 오류:", error);
        });
    };

    // id 일치하면 게시물 삭제 버튼 생성
    // React.useLayoutEffect(() => {
    //     // id와 userId가 일치할 때만 버튼을 보이게 함
    //     if (id === userId) {
    //         navigation.setOptions({
    //             headerRight: () => ( 
    //                 <TouchableOpacity onPress={handleBoardDelete}>
    //                 <Image
    //                     source={DeleteIcon} // 이미지 경로 설정
    //                     style={{ width: screenWidth * 30, height: screenHeight * 30, marginRight: screenWidth * 15}} // 이미지의 가로, 세로 크기 설정
    //                 />
    //                 </TouchableOpacity>
    //             ),
    //         });
    //     } else {
    //         navigation.setOptions({
    //             headerRight: () => null, // id와 userId가 일치하지 않을 경우, 버튼을 보이지 않게 함
    //         });
    //     }
    // }, [id, userId]); // 의존성 배열에 id와 userId 추가

    return (
        <Container>
            <InfoDiv>
                <Image src={titleImage ? titleImage : DefaultImage} alt="Title Image" />
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <InputText>
                        <h2>{title}</h2>
                        <div style={{ width: '100%', height: '40px', display: 'flex', flexDirection: 'row', borderBottom: '1px solid #ddd' }}>
                            <UserDiv>
                                <h6>{name}&nbsp;&nbsp;</h6>
                                <h6>{date}</h6>
                            </UserDiv>
                            <CountDiv>
                                <h6>조회수 : {viewCnt}&nbsp;</h6>
                                <h6>좋아요 : {likeCnt}&nbsp;</h6>
                                <h6>댓글 : {commentCnt}</h6>
                            </CountDiv>
                        </div>
                        <div style={{ width: '100%', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <span>{summary}</span>
                        </div>
                        <ButtonDiv>
                            <BookBut onClick={handleLike}>
                                <img src={likeImage} style={{ width: '80px', height: '80px'}} alt="Like" />
                                <span>좋아요</span>
                            </BookBut>
                            <BookBut onClick={handleComment}>
                                <img src={CommandImage} style={{ width: '75px', height: '75px'}} alt="commend" />
                                <sapn>댓글</sapn>
                            </BookBut>
                            <BookBut onClick={handleViewStory}>
                                <img src={PlayBook} style={{ width: '80px', height: '80px'}} alt="view" />
                                <sapn>동화보기</sapn>
                            </BookBut>
                        </ButtonDiv>
                    </InputText>
                </div>
            </InfoDiv>
    </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const InfoDiv = styled.div`
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`

const InputText = styled.div`
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    h2 {
        font-size: 23px;
        font-weight: bold;
    }

    span {
        font-weight: bold;
        text-align: left;
    }
`

const UserDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    h6 {
        font-size: 14.5px;
    }
`

const CountDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`

const Image = styled.img`
  width: 40%;
  height: 600px;
  object-fit: cover;
  border: 1px solid;
`;

const ButtonDiv = styled.div`
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1px solid #ddd;
`

const BookBut = styled.button`
    display: flex;
    flex-direction: column;
    width: 100px;
    height: 100px;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
`

export default BookInfo;