import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";

import PayMentIcon from '../image/paymentIcon.png';
import Paymenttts from '../image/paymenttts.png';
import Paymentedit from '../image/paymentedit.png';
import Paymentdelivery from '../image/paymentdelivery.png';
import transtts from '../image/transtts.png';
import GuideIcon from '../image/GuideIcon.png';
import deliveryBook from '../image/deliveryBook.png'
const PayPage = () => {
    const navigate = useNavigate();
    const context = JSON.parse(sessionStorage.getItem('user'));
    const location = useLocation();
    const [paymentWidgetControl, setPaymentWidgetControl] = useState(null);
    const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] = useState(null);
    const [agreementWidgetControl, setAgreementWidgetControl] = useState(null);
    const Id = context?.id;
    const setUserMembership = context?.primium;
    const setEndMembershipDate = context?.endDate;
    const name = context?.name;
    const address = process.env.REACT_APP_SERVER_PORT;
    const product = location?.state?.product || '정기 회원권 결제';
    const amount = location?.state?.amount || '29000';
    const book = location?.state?.book || '';
    const [address1, setAddress1] = useState('');
    const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
    const customerKey = process.env.REACT_APP_TOSS_CUSTOMER_KEY;
    useEffect(() => {
        loadPaymentWidget(clientKey, ANONYMOUS)
            .then(widget => {
                console.log(widget);
                setPaymentWidgetControl(widget);
            })
            .catch(error => console.error('위젯 로딩 실패', error));
    }, []);

    useEffect(() => {
        if (paymentWidgetControl) {
            const paymentMethodsWidget = paymentWidgetControl.renderPaymentMethods(
                "#payment-method",
                { value: location?.state?.amount || '29000' },
                { variantKey: "DEFAULT" }
            );
            setPaymentMethodWidgetControl(paymentMethodsWidget);

            const agreementWidget = paymentWidgetControl.renderAgreement("#agreement", { variantKey: "DEFAULT" });

            setAgreementWidgetControl(agreementWidget);
        }
    }, [paymentWidgetControl]);

    const setMembership = async () => {
        try {
            const response = await axios.post(`${address}/server/member/setMembership`, {
                id: Id,
            });
            console.log('유료회원 전환 성공');
        } catch (error) {
            console.error('유료회원 전환 실패', error);
        }
    }

    const addPayment = async () => {
        console.log(product, amount, book, address1);
        try {
            await axios.post(`${address}/server/payment/addPayment`, { userId: Id, name: name, product: product, amount: amount, address: address1, book: book })
                .then((res) => {
                    console.log('저장 성공');
                })
                .catch((error) => {
                    console.error(error);
                })
        } catch (error) {
            console.log('저장실패', error);
        }
    }

    const checkMembership = async () => {
        await axios.post(`${address}/server/member/checkMembership`, { id: Id })
            .then((res) => {
                if (res.data.result) {
                    setUserMembership(res.data.result.premium);
                    setEndMembershipDate(res.data.result.endDate);
                    console.log('유저 결제 여부', context.primium);
                } else {
                    console.log('회원 멤버쉽 판별 오류');
                }
            }).catch((error) => {
                console.error(error);
            });
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>


            <div style={{ width: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>


            </div>
            <div style={{ height: '654px' }}>
                <div style={{ fontSize: '30px', fontWeight: '700', color: 'rgba(0, 0, 0, 0.8)' }}>
                </div>
                <div style={{ height: '666px', position: 'relative', textAlign: 'center' }}>
                    <div style={{ position: 'relative', textAlign: 'center', padding: '70px' }}>
                        <p style={{ fontSize: '20px', color: 'rgba(0, 0, 0, 0.6 )' }}>북작북작 회원님을 위해 준비했어요!</p>
                        <p style={{ fontSize: '30px', fontWeight: '700', color: 'rgba(0, 0, 0, 0.8)' }}>북작북작만의
                            <span style={{ color: '#6133E2' }}> 프리미엄 기능 3가지</span>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ justifyContent: 'center' }}>

                                </div>
                                <button
                                    style={{
                                        marginTop: '20px',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        backgroundColor: '#6133E2',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={async () => {
                                        try {
                                            // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
                                            // 더 많은 결제 정보 파라미터는 결제위젯 SDK에서 확인하세요.
                                            // https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
                                            await paymentWidgetControl?.requestPayment({
                                                orderId: customerKey,
                                                orderName: product,
                                                customerName: Id,
                                                // customerEmail: "customer123@gmail.com",
                                                // customerMobilePhone: "01012341234",
                                                // successUrl: `http://localhost:3000/paypage`,
                                                // failUrl: `http://localhost:3000`,
                                            });
                                            console.log('결제 성공');
                                            alert('결제에 성공했습니다.');
                                            setMembership();
                                            checkMembership();
                                            addPayment();
                                            // getDESCPaymentId();
                                            navigate('/');
                                        } catch (error) {
                                            // 에러 처리하기
                                            console.error(error);
                                        }
                                    }}
                                >
                                    프리미엄 결제하기
                                </button>

                            </div>
                        </p>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: '100px' }}>
                            <div style={{ width: '250px', marginRight: '50px' }}>
                                <img style={{ width: '200px' }} src={transtts}></img>
                                <p style={{ margin: '40px', fontSize: '24px', fontWeight: '700' }}>번역과 더빙 기능</p>
                                <p style={{ lineHeight: '23px', fontSize: '16px', color: 'rgba(0,0,0,0.6)' }}>여러가지 목소리로 읽어주고<br></br>영어로도 번역해서 읽어줘요!</p>
                            </div>
                            <div style={{ width: '250px', marginRight: '50px' }}>
                                <img style={{ width: '150px' }} src={GuideIcon}></img>
                                <p style={{ margin: '40px', fontSize: '24px', fontWeight: '700' }}>가이드 도우미</p>
                                <p style={{ lineHeight: '23px', fontSize: '16px', color: 'rgba(0,0,0,0.6)' }}>Chat-GPT로 동화책을 쓸 때 <br></br>도움을 받을 수 있어요!</p>
                            </div>
                            <div style={{ width: '250px', marginRight: '50px' }}>
                                <img style={{ width: '150px' }} src={deliveryBook}></img>
                                <p style={{ margin: '40px', fontSize: '24px', fontWeight: '700' }}>동화책을 실물로</p>
                                <p style={{ lineHeight: '23px', fontSize: '16px', color: 'rgba(0,0,0,0.6)' }}>열심히 만든 동화책을<br></br>실물로 받아볼 수 있어요!</p>
                                <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.6)' }}>추가결제 필요</p>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <div id="agreement" hidden />
                                    <div id="payment-methods" />
                                    <div className="wrapper">
                                        <div className="box_section"></div>
                                        <button
                                            style={{
                                                padding: '10px 20px',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                color: '#fff',
                                                backgroundColor: '#6133E2',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={async () => {

                                                navigate('/MyBookList');

                                            }}
                                        >내가 쓴 책 만들러가기</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

const ImageSize = styled.img`
            margin-top: 20;
            width: 80;
            height: 80;
            `

export default PayPage;