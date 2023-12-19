import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const NoticeWrite = () => {
    const [localImage, setLocalImage] = useState('');
    const [title, setTitle] = useState('');
    const [context, setContext] = useState('');
    const id = JSON.parse(sessionStorage.getItem('user'))?.id;
    const name = JSON.parse(sessionStorage.getItem('user'))?.name;
    const address = process.env.REACT_APP_SERVER_PORT;
    const navigate = useNavigate();

    const handleSubmit = async () => {
        await axios.post(`${address}/server/announcement/insertAnnouncement`, {
            title: title,
            context: context,
            image: localImage,
            id: id,
            name: name
        })
        .then((response) => {
            console.log("업로드 성공");
            navigate("/announcementList");
        })
        .catch((error) => {
            console.error(error);
        })
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setLocalImage(e.target.result); // 로컬 이미지 URL 설정
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <AnnouncementInfoContainer>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <AnnouncementDiv>
                    <div style={{ width: '70%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <h5>제목 :&nbsp;</h5>
                        <Input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                        <div style={{ width: '70%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #ddd', marginTop: '1.5rem' }}>
                            <p>작성자: {name}</p>
                        </div>
                    <ImageInputContainer>
                        <ImageInput type="file" onChange={handleImageChange} />
                        {localImage && <ImagePreview src={localImage} alt="Preview" />}
                    </ImageInputContainer>
                    <TextArea
                         name="context"
                         value={context}
                         onChange={(e) => setContext(e.target.value)}
                     />
                    <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
                </AnnouncementDiv>
            </div>
        </AnnouncementInfoContainer>
    );
};

const AnnouncementInfoContainer = styled.div`
    padding: 20px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
`;

const AnnouncementDiv = styled.div`
    width: 70%;
    height: 80vh;
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

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 500px;
    margin: 20px auto;
`;

const InputLabel = styled.label`
    margin: 10px 0;
`;

const Input = styled.input`
    width: 50%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;

    &:focus {
        outline: none; /* 포커스 테두리 제거 */
    }
`;

const TextArea = styled.textarea`
    width: 80%;
    height: 350px;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;

    &:focus {
        outline: none; /* 포커스 테두리 제거 */
    }
`;

const SubmitButton = styled.button`
    margin-top: 15px;
    padding: 10px 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 20px;
    background: none;
`;

const ImageInputContainer = styled.div`
  margin: 50px 0;
`;

const ImageInput = styled.input`
  margin-bottom: 10px;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 300px; // 미리보기 이미지 크기 조정
  object-fit: cover;
`;

export default NoticeWrite;