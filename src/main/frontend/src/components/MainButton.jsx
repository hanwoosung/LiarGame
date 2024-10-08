import {useNavigate} from "react-router-dom";

const MainButton = ({name, link = ''}) => {
    const navigate = useNavigate();

    const goNav = () => {
        navigate(link);
    };

    return (
        <div>
            <button className="mainBtn fontLaundry" onClick={goNav}>{name}</button>
        </div>
    )
}
export default MainButton
