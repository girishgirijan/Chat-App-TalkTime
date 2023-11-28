import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Loader from "../assets/loader.gif";
import axios from "axios";
import { avatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  

function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate(); 

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please choose an avatar", toastOptions);
    } else {
        const user = await JSON.parse(localStorage.getItem('chat-app-user'));
        const {data} = await axios.post(`${avatarRoute}/${user._id}`, {
            image: avatars[selectedAvatar]
        });        

        if(data.isSet){
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem('chat-app-user', JSON.stringify(user));
            navigate("/");
        } else {
            toast.error("Error setting avatar. Please try again!", toastOptions);
        }
    }
  };

  const pickAvatar = async () => { 
    try {
      const data = [];
      for (let i = 0; i < 4; i++) { 
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    } catch (err) { 
        toast.error(err, toastOptions);
    }
  };

  useEffect(() => {  
    if(!localStorage.getItem("chat-app-user")){
        navigate("/login");           
      } else {
        pickAvatar();
      }
    
  });

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={Loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as profile picture
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  background-color: #e5e5e5;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: #323459;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }

    .selected {
      border: 0.4rem solid #f1bf38; 
    }
  }
  .submit-btn {
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
`;

export default SetAvatar;
