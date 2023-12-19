import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import { nanoid } from 'nanoid';

const PayMent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentWidgetControl, setPaymentWidgetControl] = useState(null);
  const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] = useState(null);
  const [agreementWidgetControl, setAgreementWidgetControl] = useState(null);
  const context = JSON.parse(sessionStorage.getItem('user'));
  const Id = context.id;
  const setUserMembership = context.primium;
  const setEndMembershipDate = context.endDate;
  const name = context.name;
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
        "#payment-methods",
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
    <div className="wrapper">
      <div className="box_section"></div>
      <div>
       
        <div id="agreement" />
        <button style={{width:100,height:100}}
          title="결제요청"
          onClick={async () => {
            if (paymentWidgetControl == null || agreementWidgetControl == null) {
              alert('주문 정보가 초기화되지 않았습니다.');
              return;
            }
            const agreeement = await agreementWidgetControl.getAgreementStatus();
            if (agreeement.agreedRequiredTerms !== true) {
              alert('약관에 동의하지 않았습니다.');
              return;
            }
            paymentWidgetControl.requestPayment?.({
              orderId: customerKey,
              orderName: product,
            }).then((result) => {
              if (result.success) {
                console.log('결제 성공');
                alert('결제에 성공했습니다.');
                setMembership();
                checkMembership();
                addPayment();
                // getDESCPaymentId();
                navigate('/');
              } else {
                console.log('결제 실패', result);  // 여기에서 result 객체를 출력하도록 수정합니다.
              }
            });
          }}
        />
      </div>
    </div>

  )
}

export default PayMent;