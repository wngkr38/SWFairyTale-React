import React, { useState, useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';
import styled from 'styled-components';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";


export default function UserAddress() {
    const navigate = useNavigate();
    const context = JSON.parse(sessionStorage.getItem('user'));
    const location = useLocation();
    const [isModal, setModal] = useState(false);
    const address = process.env.REACT_APP_SERVER_PORT;
    const [extraAddress, setExtraAddress] = useState('');
    const [paymentWidgetControl, setPaymentWidgetControl] = useState(null);
    const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] = useState(null);
    const [agreementWidgetControl, setAgreementWidgetControl] = useState(null);
    const payProduct = '내가 쓴 책 만들기';
    const amount =  '15000';
    const product = location.state.product;
    const book = product.title;
    const [address1, setAddress1] = useState('');
    const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
    const customerKey = process.env.REACT_APP_TOSS_CUSTOMER_KEY;
    const setUserMembership = context.primium;
    const setEndMembershipDate = context.endDate;
    const Id = context.id;
    const name = context.name;
    const userId = context?.id;
    console.log(product);
    console.log(product.title);
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
                { value: location?.state?.amount || '15000' },
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
        try {
            console.log(Id,name,payProduct,amount,address1,book);
            await axios.post(`${address}/server/payment/addPayment`, { userId: Id, name: name, product: payProduct, amount: amount, address: address1, book: book })
                .then((res) => {
                    console.log('저장 성공');
                    console.log(Id,name,payProduct,amount,address1,book);
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

    const fetchBookAddress = (product) => {
        if (address1 === '' || extraAddress === '') {
            alert('주소를 확인해주세요. 배송 받으실 주소를 입력해주세요.');
        } else {
            // navigation.navigate('PayMent', { book: product.title, address: address + ' ' + extraAddress, amount: 15000, product: "내가 쓴 책 만들기" });
            console.log("Proceed to payment");
        }
    };

    const getAddressData = data => {
        if (!data) {
            console.log('Data is undefined!');
            return;
        }
        let defaultAddress = '';
        if (data.buildingName === 'N') {
            defaultAddress = data.apartment;
        } else {
            defaultAddress = data.buildingName;
        }

        setAddress1(data.address + ' ' + defaultAddress);
        setModal(false);
    };
    return (
        <div style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
            <div id="agreement" hidden />
            <div id="payment-methods" />
            <div className="wrapper">
                <div className="box_section"></div>
            <BoardImage src={product.titleImage} alt={product.title} />
            <h2>{product.title}</h2>
            <p>{product.summary}</p>
            <button onClick={() => setModal(true)}>주소찾기</button>
            {isModal ? (
                <ModalBackground>
                    <ModalContent>
                        <DaumPostcode
                            onComplete={data => {
                                getAddressData(data);
                                setModal(false);
                            }}
                        />
                    </ModalContent>
                </ModalBackground>
            ) : null}
            <input
                className="input"
                onChange={e => setAddress1(e.target.value)}
                value={address1}
                placeholder="주소찾기 버튼을 눌러 주소를 추가해주세요."
                disabled
            />
            <input
                className="input"
                onChange={e => setExtraAddress(e.target.value)}
                value={extraAddress}
                placeholder="추가 주소를 입력하세요"
            />

            
                <button
                    onClick={async () => {
                        try {
                            // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
                            // 더 많은 결제 정보 파라미터는 결제위젯 SDK에서 확인하세요.
                            // https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
                            await paymentWidgetControl
                                ?.requestPayment({
                                    orderId: customerKey,
                                    orderName: payProduct,
                                    customerName: userId,
                                    // customerEmail: "customer123@gmail.com",
                                    // customerMobilePhone: "01012341234",
                                    // successUrl: `http://localhost:3000/paypage`,
                                    // failUrl: `http://localhost:3000`,
                                })
                            console.log('결제 성공');
                            alert('결제에 성공했습니다.');
                            checkMembership();
                            addPayment();
                            navigate('/');
                        } catch (error) {
                            // 에러 처리하기
                            console.error(error)
                        }
                    }}
                >₩ 15000 결제하러 가기</button>
            </div>
        </div>
    )
}

const ModalBackground = styled.div`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            `;

const ModalContent = styled.div`
            background-color: white;
            padding: 20px;
            width: 80%;
            max-width: 500px;
            `;
const BoardImage = styled.img`
            width: 200px;
            height: 250px;
            margin-bottom: 10px;
            `;