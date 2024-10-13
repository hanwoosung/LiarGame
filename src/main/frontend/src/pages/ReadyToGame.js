import React, { useEffect } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { useLocation } from 'react-router-dom';
import { useGame } from '../hooks/gameHooks';
import '../assets/css/game.css';

/**
 * ReadyToGame 컴포넌트
 * 게임 시작 전 대기 화면을 관리하며, 유저 목록 및 채팅 기능을 제공
 */
const ReadyToGame = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get('username');
    const roomId = queryParams.get('roomNo');

    const {
        publicChats,
        userList,
        userData,
        sendValue,
        setUserData,
        sendLeaveMessage,
        onDisconnect,
    } = useGame(username, roomId);

    /**
     * 페이지가 닫히거나 새로고침될 때 연결된 유저라면 퇴장 메시지를 전송
     */
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

    /**
     * 입력된 메시지를 상태로 업데이트하는 함수
     */
    const handleMessage = (event) => {
        setUserData({ ...userData, message: event.target.value });
    };

    /**
     * 게임 종료 시 실행되는 함수, 메인 화면으로 이동
     */
    const confirmLeaveGame = () => {
        window.location.href = "http://localhost:3000";
    };

    return (
        <div>
            {userData.connected ? (
                <div className="container">
                    <h1>유저 목록</h1>
                    <ul className="user-name">
                        {userList.map((user, index) => (
                            <li key={index}>{index + 1} 유저 이름: {user}</li>
                        ))}
                    </ul>
                    <div className="chat-box">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username ? "self" : ""}`}
                                    key={index}>
                                    {chat.senderName !== userData.username &&
                                        <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message || chat.content}</div>
                                    {chat.senderName === userData.username &&
                                        <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>
                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="메시지 입력" value={userData.message}
                                   onChange={handleMessage}/>
                            <button className="send-button" onClick={sendValue}>전송</button>
                        </div>
                    </div>
                    <button onClick={confirmLeaveGame}>게임 종료</button>
                </div>
            ) : (
                <div>
                    <h2>서버에 연결 중입니다... 사용자 이름: {userData.username}</h2>
                </div>
            )}
        </div>
    );
};

export default ReadyToGame;
