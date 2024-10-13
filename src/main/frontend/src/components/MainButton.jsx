import '../assets/css/button.css';

const MainButton = ({ name, onClick }) => {
    return (
        <button  className="mainBtn fontLaundry" onClick={onClick}>
            {name}
        </button>
    );
};

export default MainButton
