import {ReactComponent as Note} from '../assets/images/note.svg';

const Toolbar = () => {
    return (
        <div className="flexR between alignC ">
            <h1 className="White fontLaundry font20 marginL20">Liar Game</h1>
            <Note className="marginR20 w" wight="30" height="30"/>
        </div>
    )
}

export default Toolbar