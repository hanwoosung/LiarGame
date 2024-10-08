import React from "react";
import {Route, Routes} from 'react-router-dom';
import Main from "./pages/Main";
import CreateRoom from "./pages/CreateRoom";
import ReadyToGame from "./pages/ReadyToGame";

function App() {

    // const [data, setData] = useState()
    // const API_URL = 'http://localhost:8080'
    //
    // useEffect(() => {
    //     axios.get(`${API_URL}/api/data`)
    //         .then(res => setData(res.data))
    //         .catch(err => console.log(err))
    // }, []);

    return (
        <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/CreateRoom" element={<CreateRoom/>}/>
            <Route path="/ReadyToGame" element={<ReadyToGame/>}/>
        </Routes>

    );
}

export default App;