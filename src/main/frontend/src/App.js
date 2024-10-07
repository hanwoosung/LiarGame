import {useEffect, useState} from "react";
import axios from "axios";
import React from 'react';
function App() {

    const [data, setData] = useState()
    const API_URL = 'http://localhost:8080'

    useEffect(() => {
        axios.get(`${API_URL}/api/data`)
            .then(res => setData(res.data))
            .catch(err => console.log(err))
    }, []);

  return (
      <div>
           값 :{data}
      </div>

  );
}

export default App;
Q