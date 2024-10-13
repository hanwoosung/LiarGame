import { useState, useEffect } from "react";
import axios from "axios";

/**
 * usePopup 훅
 * 팝업의 상태와 메시지를 관리하는 훅
 * @param {string} initialMessage - 초기 메시지
 * @returns {Object} 팝업 관련 상태 및 함수
 */
export const usePopup = (initialMessage = "사용자 이름을 입력해주세요") => {
    const [showPopup, setShowPopup] = useState(false); // 팝업 표시 여부
    const [popupMessage, setPopupMessage] = useState(initialMessage); // 팝업 메시지

    /**
     * 팝업을 열고 메시지를 설정하는 함수
     * @param {string} message - 팝업에 표시할 메시지
     */
    const openPopup = (message) => {
        setPopupMessage(message);
        setShowPopup(true);
    };

    /**
     * 팝업을 닫는 함수
     */
    const closePopup = () => {
        setShowPopup(false);
    };

    /**
     * ESC 키를 눌렀을 때 팝업을 닫는 이벤트 리스너
     */
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === "Escape") {
                closePopup();
            }
        };

        document.addEventListener("keydown", handleEscKey);

        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, []);

    return { showPopup, popupMessage, openPopup, closePopup };
};

/**
 * useRoom 훅
 * 방 찾기 로직을 관리하는 훅
 * @param {number} maxAttempts - 방 찾기 최대 시도 횟수
 * @returns {Object} 방 관련 상태 및 함수
 */
export const useRoom = (maxAttempts = 5) => {
    const [roomId, setRoomId] = useState(null); // 방 번호 상태

    /**
     * 빈 자리가 있는 방을 찾는 함수
     * @returns {Promise<number>} - 찾은 방 번호
     * @throws {Error} - 빈 방을 찾지 못한 경우
     */
    const findAvailableRoom = async () => {
        try {
            let attempts = 0;

            while (attempts < maxAttempts) {
                const response = await axios.get("/random-room");
                if (response.status === 200 && response.data) {
                    const room = response.data;

                    if (room.userList.length < 8) {
                        setRoomId(room.roomNo);
                        return room.roomNo;
                    }
                }
                attempts += 1;
            }
            throw new Error("빈 자리가 있는 방을 찾을 수 없습니다.");
        } catch (error) {
            console.error("빈 방 찾기 실패:", error);
            throw error;
        }
    };

    return { roomId, setRoomId, findAvailableRoom };
};
