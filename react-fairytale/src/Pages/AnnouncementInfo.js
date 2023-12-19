import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from "styled-components";
import axios from "axios";

const AnnouncementInfo = () => {
    const location = useLocation();
    const info = location.state?.info;
    const address = process.env.REACT_APP_SERVER_PORT;

    // 게시물 페이지가 로드될 때마다 조회수 증가 요청 보내기
    useEffect(() => {
        axios.post(`${address}/server/announcement/announcementView`, {
            seqNum: info.seqNum
        })
        .then(response => {
            console.log("조회수가 업데이트 되었습니다.");
        })
        .catch(error => {
            console.error("조회수 업데이트 중 오류 발생:", error);
        });
    }, []);

    return (
        <AnnouncementInfoContainer>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <AnnouncementDiv>
                    <h1>{info.title}</h1>
                    <div style={{ width: '70%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                        <p>작성자: {info.name}</p>
                        <p>등록일: {info.date}</p>
                    </div>
                    {info.image && (
                        <div>
                            <img src={info.image || null} alt="Announcement" />
                        </div>
                    )}
                    <p style={{ marginTop: '5rem' }}>{info.context + 1}</p>
                    <p style={{ width: '70%', textAlign: 'right', marginTop: '5rem', borderTop: '1px solid #ddd' }}>Views: {info.views}</p>
                </AnnouncementDiv>
            </div>
        </AnnouncementInfoContainer>
    );
}

const AnnouncementInfoContainer = styled.div`
    padding: 20px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
`;

const AnnouncementDiv = styled.div`
    width: 70%;
    height: 60vh;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        font-size: 30px;
        width: 70%;
        margin-top: 3rem;
        text-align: left;
    }
`;

export default AnnouncementInfo;