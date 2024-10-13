import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client as StompClient } from '@stomp/stompjs';

let stompClient = null;

/**
 * useGame 훅
 * 게임 방에서 유저의 연결 상태와 채팅 메시지, 유저 리스트 관리
 */
export const useGame = (username, roomId) => {
    const [publicChats, setPublicChats] = useState([]);
    const [userList, setUserList] = useState([]);
    const [userData, setUserData] = useState({
        username: username || '',
        roomId: roomId || '',
        connected: false,
        message: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * WebSocket 연결
     * 방 번호에 해당하는 WebSocket을 구독
     */
    const connect = (roomId) => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = new StompClient({
            webSocketFactory: () => Sock,
            debug: (str) => console.log(str),
            reconnectDelay: 5000
        });

        stompClient.onConnect = () => onConnected(roomId);
        stompClient.onStompError = onError;
        stompClient.activate();
    };

    /**
     * WebSocket 연결 성공 시 실행
     * 방의 메시지 채널과 유저 리스트 채널을 구독
     */
    const onConnected = (roomId) => {
        setUserData(prevData => ({ ...prevData, connected: true }));
        stompClient.subscribe(`/chatroom/${roomId}`, onMessageReceived);
        stompClient.subscribe(`/chatroom/${roomId}/user-list`, onUserListReceived);
        userJoin(roomId);
    };

    /**
     * 방에 유저가 참가했을 때 메시지를 전송
     */
    const userJoin = (roomId) => {
        const chatMessage = {
            senderName: userData.username,
            roomId: roomId,
            status: "JOIN"
        };
        stompClient.publish({
            destination: `/app/message/${roomId}`,
            body: JSON.stringify(chatMessage),
        });
    };

    /**
     * 서버로부터 메시지 수신 시 실행
     * 상태에 따라 채팅 메시지 또는 에러 메시지 처리
     */
    const onMessageReceived = (payload) => {
        const payloadData = JSON.parse(payload.body);
        if (["MESSAGE", "JOIN", "LEAVE"].includes(payloadData.status)) {
            setPublicChats(prevChats => [...prevChats, payloadData]);
        } else if (payloadData.status === "ERROR") {
            setErrorMessage(payloadData.message);
        }
    };

    /**
     * 서버로부터 유저 리스트 수신 시 실행
     */
    const onUserListReceived = (payload) => {
        setUserList(JSON.parse(payload.body));
    };

    /**
     * WebSocket 에러 발생 시 실행
     */
    const onError = (err) => {
        console.error("Error:", err);
    };

    /**
     * 유저가 메시지를 전송할 때 실행
     * 메시지를 WebSocket을 통해 서버로 전송
     */
    const sendValue = () => {
        if (stompClient && userData.message) {
            const chatMessage = {
                senderName: userData.username,
                message: userData.message,
                roomId: roomId,
                status: "MESSAGE"
            };
            stompClient.publish({
                destination: `/app/message/${roomId}`,
                body: JSON.stringify(chatMessage),
            });
            setUserData(prevData => ({ ...prevData, message: "" }));
        }
    };

    /**
     * 유저가 방을 떠날 때 실행
     * LEAVE 메시지를 서버로 전송
     */
    const sendLeaveMessage = () => {
        if (userData.username && roomId) {
            const chatMessage = {
                senderName: userData.username,
                roomId: roomId,
                status: "LEAVE"
            };
            navigator.sendBeacon('/leave', JSON.stringify(chatMessage));
        }
    };

    /**
     * WebSocket 연결 해제
     * 유저가 방을 떠날 때 호출
     */
    const onDisconnect = () => {
        if (userData.username) {
            sendLeaveMessage();
            setUserData(prevData => ({ ...prevData, connected: false }));
            stompClient.deactivate();
        }
    };

    /**
     * 컴포넌트가 마운트될 때 WebSocket 연결 초기화
     */
    useEffect(() => {
        if (userData.username && roomId && !userData.connected) {
            connect(roomId);
        }
    }, [userData.username, roomId]);

    return {
        publicChats,
        userList,
        userData,
        errorMessage,
        sendValue,
        setUserData,
        sendLeaveMessage,
        onDisconnect,
    };
};
