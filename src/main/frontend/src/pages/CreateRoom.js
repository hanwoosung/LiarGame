import '../assets/css/common.css';
import '../assets/css/create-room.css';
import { useCreateRoom } from '../hooks/createHooks';

/**
 * CreateRoom 컴포넌트
 * 사용자가 닉네임, 카테고리, 반복 횟수를 입력하여 방을 생성할 수 있는 화면을 제공
 */
const CreateRoom = () => {
    const {
        nickname,
        category,
        count,
        setNickname,
        setCategory,
        setCount,
        handleCreateRoom
    } = useCreateRoom();

    return (
        <div className="container">
            <div className="create-room-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1>방 만들기</h1>

                {/* 닉네임 입력 필드 */}
                <div className="input-group">
                    <label htmlFor="nickname">닉네임 설정</label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임을 입력하세요"
                        className="nickname-input"
                    />
                </div>

                {/* 카테고리 선택 필드 */}
                <div className="input-group">
                    <label htmlFor="category">게임 카테고리 선택</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="category-select"
                    >
                        <option value="">카테고리를 선택하세요</option>
                        <option value="GAME">게임</option>
                        <option value="ANIMAL">동물</option>
                        <option value="FOOD">음식</option>
                        <option value="PLACE">장소</option>
                        <option value="JOB">직업</option>
                        <option value="SPORT">스포츠</option>
                        <option value="MOVIE">영화</option>
                        <option value="CELEBRITY">연예인</option>
                    </select>
                </div>

                {/* 반복 횟수 선택 필드 */}
                <div className="input-group">
                    <label htmlFor="count">반복 횟수 선택</label>
                    <select
                        id="count"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        className="category-select"
                    >
                        <option value="">반복 횟수를 선택하세요</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>

                {/* 방 생성 버튼 */}
                <button className="create-room-button" onClick={handleCreateRoom}>
                    방 생성
                </button>
            </div>
        </div>
    );
};

export default CreateRoom;
