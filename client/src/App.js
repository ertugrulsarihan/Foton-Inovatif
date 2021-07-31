import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";

const server = "http://localhost:8000";

function App() {
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      //Post Request
      axios.post(`${server}/login`, { username, password }).then((res) => {
        setUser(res.data);
      });
    } catch (error) {
      console.log(error);
      setError("Invalid Username or Password");
    }
  };

  useEffect(async () => {
    //Data from server
    await axios
      .get(`${server}/`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));

    //Connecting Socket Server
    const socket = io.connect(server);
    socket.on("datetime", (data) => {
      setDate(data);
      console.log(data);
    });
  }, [user]);

  console.log(users);
  console.log(user);
  return (
    <div className="App">
      {user ? (
        <div>
          <h3>Welcome {user.username}</h3>
          <h3>{date}</h3>
        </div>
      ) : (
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            className="form-control"
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            placeholder="Username"
          />
          <input
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            placeholder="Password"
          />
          <button className="btn btn-warning text-center" type="submit">
            Login
          </button>
           <p>{error}</p> 
        </form>
      )}
    </div>
  );
}

export default App;
