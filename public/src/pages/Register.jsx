import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  //Declarations
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, []);

  //Functions
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (handleValidation()) {
        const { username, email, password } = values;
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        });

        

        //If there is any error.
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }

        //If everthing is correct.
        if (data.status === true) {
          localStorage.setItem("chat-app-user", JSON.stringify(data.user));
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (password != confirmPassword) {
      toast.error(
        "Password and Confirm password should be same!",
        toastOptions
      );
      return false;
    } else if (username.length <= 3) {
      toast.error(
        "Username should be greater than 3 characters!",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("UPlease enter email id", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>Talk Time</h1>
          </div>

          <input
            type="text"
            placeholder="Username"
            name="username"
            value={values.username}
            onChange={(e) => handleChange(e)}
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={(e) => handleChange(e)}
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={(e) => handleChange(e)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #e5e5e5;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #f1bf38;
    border-radius: .5rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #34365a;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #1565c0;
      outline: none;
    }
  }
  button {
    background-color: #34365a;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #323459;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #1565c0;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Register;
