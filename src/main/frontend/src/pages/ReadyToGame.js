import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client as StompClient } from '@stomp/stompjs';

var stompClient = null;

const ReadyToGame = () => {
    const [publicChats, setPublicChats] = useState([]); // 채팅 메시지 저장
    const [userData, setUserData] = useState({
        username: '', // 사용자 이름
        connected: false, // 서버에 연결되었는지 여부
        message: '' // 사용자가 입력한 메시지
    });

    useEffect(() => {
        console.log("payloaddata"+ JSON.stringify(userData))
    }, [userData]);

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws'); // WebSocket 서버 주소
        stompClient = new StompClient({
            webSocketFactory: () => Sock,
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000 // 연결 끊김 시 재연결 시간 (5초)
        });

        stompClient.onConnect = onConnected; // 연결 성공 시 실행
        stompClient.onStompError = onError; // 에러 발생 시 실행
        stompClient.activate(); // Stomp 클라이언트 활성화
    }

    const onConnected = () => {
        setUserData({ ...userData, connected: true });
        stompClient.subscribe('/chatroom/public', onMessageReceived); // 채팅방 구독
        userJoin(); // 사용자가 채팅방에 들어왔음을 알리는 메시지 전송
    }

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN" // 사용자가 입장했음을 알리는 상태
        };
        stompClient.publish({
            destination: "/app/message",
            body: JSON.stringify(chatMessage),
        }); // 서버로 메시지 전송
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN": // 사용자가 입장했을 때
                break;
            case "MESSAGE": // 메시지 받았을 때
                publicChats.push(payloadData);
                console.log("payloaddata"+ JSON.stringify(payloadData))
                setPublicChats([...publicChats]); // 메시지 리스트 업데이트
                break;
        }
    }

    const onError = (err) => {
        console.log(err); // 에러 발생 시 로그 출력
    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, message: value });
    }

    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE" // 상태: 메시지 전송
            };
            stompClient.publish({
                destination: "/app/message",
                body: JSON.stringify(chatMessage),
            }); // 메시지 전송
            setUserData({ ...userData, message: "" }); // 메시지 입력창 초기화
        }
    }

    const handleUsername = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, username: value });
    }

    const registerUser = () => {
        connect();
    }

    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    <div className="chat-content">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="Enter the message" value={userData.message} onChange={handleMessage} />
                            <button type="button" className="send-button" onClick={sendValue}>Send</button>
                        </div>
                    </div>
                </div>
                :
                <div className="register">
                    <input
                        id="user-name"
                        placeholder="Enter your name"
                        name="userName"
                        value={userData.username}
                        onChange={handleUsername}
                    />
                    <button type="button" onClick={registerUser}>
                        Connect
                    </button>
                </div>}
        </div>
    )
}

export default ReadyToGame;
