import MainButton from "../components/MainButton";
import Toolbar from "../components/Toolbar";

const Main = ({name, link = ''}) => {
    return (
            <div className="textC vh100 container">
                <Toolbar />
            <div className="flexC itemC">

                <h1 className="White font64 stylishText">라이어 게임</h1>

                <div className="marginT50"><MainButton name="랜덤 입장" link="/ReadyToGame"/></div>
                <div className="marginT50"><MainButton name="방 만들기" link="/CreateRoom"/></div>
                <div className="marginT50"><MainButton name="계획 없음"/></div>
            </div>
            </div>
    )
}
export default Main
