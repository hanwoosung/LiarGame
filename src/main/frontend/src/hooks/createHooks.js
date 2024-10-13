import { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

/**
 * useCreateRoom 훅
 * 방 생성에 필요한 상태 및 방 생성 기능을 제공
 */
export const useCreateRoom = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate
    const [roomNo, setRoomNo] = useState(Math.floor(Math.random() * 300)); // 방 번호 랜덤 생성
    const [nickname, setNickname] = useState('');
    const [category, setCategory] = useState('');
    const [count, setCount] = useState('');

    /**
     * 방을 생성하는 함수
     * 입력된 닉네임, 카테고리, 반복 횟수를 확인하고 서버에 방 생성 요청을 전송
     */
    const handleCreateRoom = async () => {
        if (!nickname || !category || !count) {
            alert("닉네임, 카테고리, 반복 횟수를 선택하세요.");
            return;
        }

        const room = {
            roomNo: roomNo,
            userName: nickname,
            subject: category,
            count: parseInt(count),
        };

        try {
            // 방 생성 요청
            const response = await axios.post("/create-room", room);
            console.log("방 생성 성공", response.data);

            // 방 생성 성공 시 ReadyToGame 페이지로 이동
            navigate(`/ReadyToGame?roomNo=${roomNo}&username=${nickname}`);

        } catch (error) {
            if (error.response && error.response.status === 400) {
                // 이미 존재하는 방 번호일 때 새로운 방 번호 생성
                alert("이미 존재하는 방 번호입니다. 다시 방 번호를 생성합니다.");
                const newRoomNo = Math.floor(Math.random() * 300); // 새로운 방 번호 생성
                setRoomNo(newRoomNo); // 방 번호 업데이트
                handleCreateRoom(); // 방 생성 재시도
            } else {
                console.log("방 생성 중 오류 발생", error);
                alert("방 생성에 실패했습니다.");
            }
        }
    };

    return {
        nickname,
        category,
        count,
        setNickname,
        setCategory,
        setCount,
        handleCreateRoom
    };
};
