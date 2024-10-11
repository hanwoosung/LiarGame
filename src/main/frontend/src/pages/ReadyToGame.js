import React, {useEffect, useState} from 'react';
import SockJS from 'sockjs-client';
import {Client as StompClient} from '@stomp/stompjs';
import {useBeforeunload} from 'react-beforeunload';

let stompClient = null;

const ReadyToGame = () => {
    const [publicChats, setPublicChats] = useState([]); // 채팅 메시지 저장
    const [userData, setUserData] = useState({
        username: '',
        connected: false,
        message: ''
    });
    const [userList, setUserList] = useState([]); // 유저 리스트 저장

    useEffect(() => {
        console.log("유저 데이터: " + JSON.stringify(userData));
        window.history.pushState(null, null, window.location.href);
    }, [userData]);

    // 페이지를 떠날 때 경고창 띄우기
    useBeforeunload((event) => {
        if (userData.connected) {
            event.preventDefault();
            event.returnValue = '';
        }
    });

    useEffect(() => {
        const handleUnload = () => {
            if (userData.connected) {
                sendLeaveMessage();
            }
        };

        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('unload', handleUnload);
        };
    }, [userData]);

    // 서버 연결
    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = new StompClient({
            webSocketFactory: () => Sock,
            debug: (str) => console.log(str),
            reconnectDelay: 5000
        });

        stompClient.onConnect = onConnected;
        stompClient.onStompError = onError;
        stompClient.activate();
    }

    const onConnected = () => {
        setUserData({...userData, connected: true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/chatroom/user-name', onUserListReceived);
        userJoin();
    }

    // 유저가 떠날 때 서버로 알림 전송
    const sendLeaveMessage = () => {
        if (userData.username) {
            const chatMessage = {
                senderName: userData.username,
                status: "LEAVE"
            };
            navigator.sendBeacon('/leave', JSON.stringify(chatMessage));
        }
    }

    // 연결 해제
    const onDisconnect = () => {
        if (userData.username) {
            sendLeaveMessage();
            setUserData({...userData, connected: false});
            stompClient.deactivate();
        }
    };

    // 유저 입장 알림 전송
    const userJoin = () => {
        const chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.publish({
            destination: "/app/message",
            body: JSON.stringify(chatMessage),
        });
    }

    // 채팅 메시지 수신 처리
    const onMessageReceived = (payload) => {
        const payloadData = JSON.parse(payload.body);
        if (payloadData.status === "MESSAGE") {
            setPublicChats((prevChats) => [...prevChats, payloadData]);
        }
    }

    // 유저 리스트 수신 처리
    const onUserListReceived = (payload) => {
        setUserList(JSON.parse(payload.body));
    }

    const onError = (err) => {
        console.error("Error:", err);
    }

    const handleMessage = (event) => {
        setUserData({...userData, message: event.target.value});
    }

    // 메시지 전송
    const sendValue = () => {
        if (stompClient && userData.message) {
            const chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            stompClient.publish({
                destination: "/app/message",
                body: JSON.stringify(chatMessage),
            });
            setUserData({...userData, message: ""});
        }
    }

    const handleUsername = (event) => {
        setUserData({...userData, username: event.target.value});
    }

    // 연결 시작
    const registerUser = () => {
        if (userData.username) {
            connect();
        }
    }

    // 게임 종료 시 처리
    const confirmLeaveGame = () => {
        window.location.href = "http://localhost:3000";
    };

    return (
        <div className="container">
            {userData.connected ? (
                <div>
                    <h1>유저 목록</h1>
                    <ul className="user-name">
                        {userList.map((user, index) => (
                            <li key={index}>{index + 1} 유저 이름: {user}</li>
                        ))}
                    </ul>
                    <div className="chat-box">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username ? "self" : ""}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>
                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="메시지 입력" value={userData.message} onChange={handleMessage}/>
                            <button className="send-button" onClick={sendValue}>전송</button>
                        </div>
                    </div>
                    <button onClick={confirmLeaveGame}>게임 종료</button>
                </div>
            ) : (
                <div className="register">
                    <input type="text" placeholder="사용자 이름 입력" value={userData.username} onChange={handleUsername}/>
                    <button onClick={registerUser}>연결</button>
                </div>
            )}
        </div>
    );
}

export default ReadyToGame;
