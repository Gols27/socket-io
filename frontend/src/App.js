import React, { useEffect, useState, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";
import debounce from "lodash/debounce";
import io from "socket.io-client";

const socket = io.connect("http://localhost:9999/");

function App() {
  const [state, setState] = useState({ name: "" });
  const [chat, setChat] = useState([]);

  const onChangeHandler = useCallback(e => {
    const value = e.target.value;
    setState({ ...state, [e.target.name]: e.target.value });
  });

  useEffect(() => {
    const handler = name => {
      setChat([...chat, name]);
    };
    socket.on("message", handler);
    return () => socket.off("message", handler);
  });

  const renderChat = () => {
    return chat.map(({ name }, index) => (
      <div key={index}>
        <h4>{name}</h4>
      </div>
    ));
  };

  const onsubmit = useCallback(e => {
    e.preventDefault();
    const { name } = state;
    socket.emit("message", { name });
    setState({ name: "" });
  });

  return (
    <div className="App">
      <input
        type="text"
        name="name"
        onChange={e => onChangeHandler(e)}
        value={state.name}
      />
      <input type="submit" value="Submit" onClick={e => onsubmit(e)} />

      {renderChat()}
    </div>
  );
}

export default App;
