import React, { useState, useEffect, useCallback } from 'react';
import styled from "styled-components";
import { useLocation } from 'react-router-dom';

import DefaultImage from '../image/ModalImg1.png';

const RecommendInfo = () => {
    const location = useLocation();
    const product = location.state.product;
    const titleImage = product.cover;
    console.log(product);

    return (
      <Container>
          <InfoDiv>
              <Image src={product.cover ? product.cover : DefaultImage} alt="Title Image" />
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <InputText>
                      <h2>{product.title}</h2>
                      <div style={{ width: '100%', height: '40px', display: 'flex', flexDirection: 'row', borderBottom: '1px solid #ddd' }}>
                          <UserDiv>
                              <h6>{product.publisher}&nbsp;&nbsp;</h6>
                              <h6>{product.author}&nbsp;&nbsp;</h6>
                              <h6>{product.pubDate}</h6>
                          </UserDiv>
                          <CountDiv>
                              <h6>{product.categoryName}</h6>
                          </CountDiv>
                      </div>
                      <div style={{ width: '100%', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                          <span>{product.description}</span>
                      </div>
                      <ButtonDiv>
                          <BookBut>
                              <a href={product.link}>책사러가기</a>
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
  justify-content: center;
  align-items: flex-end;
  border-top: 1px solid #ddd;
`

const BookBut = styled.button`
  display: flex;
  flex-direction: column;
  width: 110px;
  height: 70px;
  justify-content: center;
  align-items: center;
  background: none;
  border: 1px solid #ddd;

  a {
    text-decoration: none;
    font-weight: bold;
    color: black;
  }
`

export default RecommendInfo;