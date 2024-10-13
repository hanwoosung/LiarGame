import React, { useState } from "react";
import MainButton from "../components/MainButton";
import Toolbar from "../components/Toolbar";
import { useNavigate } from "react-router-dom";
import { usePopup, useRoom } from "../hooks/indexHooks";
import '../assets/css/index.css';
import axios from "axios";

/**
 * Main 컴포넌트
 * 사용자 이름을 입력받아 랜덤 방에 입장하거나 방을 생성할 수 있는 화면을 제공
 */
const Main = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const { showPopup, popupMessage, openPopup, closePopup } = usePopup();
    const { roomId, setRoomId, findAvailableRoom } = useRoom();

    /**
     * 랜덤 방 입장을 시도하는 함수
     * 빈 방을 찾은 후 팝업을 통해 사용자 이름을 입력받음
     */
    const handleRandomJoin = async () => {
        try {
            setRoomId(null);
            await findAvailableRoom();
            openPopup("사용자 이름을 입력해주세요");
        } catch (error) {
            console.error("방 찾기 실패:", error);
            alert("빈 자리가 있는 방을 찾을 수 없습니다.");
        }
    };

    /**
     * 팝업에서 사용자 이름을 입력 후 방에 입장하는 함수
     * 닉네임 중복 체크 후 입장 가능 시 게임 준비 화면으로 이동
     */
    const handleConfirmJoin = async () => {
        if (!username) {
            alert("이름을 입력해야 입장할 수 있습니다.");
            return;
        }

        if (!roomId) {
            alert("현재 생성되어 있는 방이 없습니다.");
            return;
        }

        try {
            const checkResponse = await axios.get(`/check-username?roomId=${roomId}&username=${username}`);
            if (checkResponse.data.isDuplicate) {
                openPopup("중복된 닉네임입니다. 다른 닉네임을 입력해주세요.");
                return;
            }

            navigate(`/ReadyToGame?roomNo=${roomId}&username=${username}`);
        } catch (error) {
            console.error("닉네임 중복 체크 실패:", error);
            alert("닉네임 중복 체크에 실패했습니다.");
        }

        closePopup();
    };

    /**
     * 방 생성 화면으로 이동하는 함수
     */
    const handleCreateRoom = () => {
        navigate(`/CreateRoom`);
    };

    return (
        <div className="textC vh100 container-main">
            <Toolbar />
            <div className="flexC itemC">
                <h1 className="White font64 stylishText">라이어 게임</h1>

                <div className="marginT50">
                    <MainButton name="랜덤 입장" onClick={handleRandomJoin} />
                </div>

                <div className="marginT50">
                    <MainButton name="방 만들기" onClick={handleCreateRoom} />
                </div>

                <div className="marginT50">
                    <MainButton name="계획 없음" />
                </div>
            </div>

            {showPopup && (
                <div className="popup-background">
                    <div className="popup">
                        <h2>{popupMessage}</h2>
                        <input
                            type="text"
                            placeholder="사용자 이름"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-name marginT10"
                        />
                        <div className="flex-center marginT30">
                            <MainButton name="확인" onClick={handleConfirmJoin} />
                            <MainButton name="취소" onClick={closePopup} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Main;
