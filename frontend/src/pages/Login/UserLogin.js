import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { authActions } from "@store/slices/authSlice";
import authSelectors from "@store/selectors/authSelectors";

import styled, { keyframes } from "styled-components";
import {
  StyledInput,
  StyledButton,
  StyledLabel,
} from "@styles/login/LoginPage.styled";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const UserLoginContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  p {
    transform: ${(props) => (props.$isActive ? "scale(1)" : "scale(.6)")};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const AnimatedDiv = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: max-height 0.8s ease-in-out;

  max-height: ${(props) => (props.$isActive ? "200px" : "100px")};
`;

const SwitchText = styled.span`
  color: #004a99;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #002d66;
  }
`;

const ErrorText = styled.div`
  color: #db0707c0;
  font-size: 0.9em;
  margin-top: 5px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const AnimatedInput = styled(StyledInput)`
  animation: ${fadeIn} 0.5s ease;
`;

function UserLogin(props) {
  const { isActive, toggleForm } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const loginSession = useSelector(authSelectors.selectAuthSession);
  const loading = useSelector(authSelectors.selectAuthLoading);
  const reduxError = useSelector(authSelectors.selectAuthError);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Username and password cannot be empty");
      return;
    }

    setErrorMsg(null);
    if (registerMode) {
      dispatch(
        authActions.registerRequest({
          username,
          nickname,
          password,
        })
      );
    } else {
      dispatch(
        authActions.loginRequest({
          side: "login",
          username,
          password,
        })
      );
    }
  };

  useEffect(() => {
    if (isActive && reduxError?.toLowerCase().includes("emp")) {
      setErrorMsg("username or password doesn't exist!");
    }
  }, [reduxError, isActive]);

  useEffect(() => {
    if (isActive && loginSession?.token) {
      setErrorMsg(null);
      localStorage.setItem("token", loginSession.token);
      navigate("/");
    }
  }, [isActive, loginSession, navigate]);

  useEffect(() => {
    if (!isActive) {
      setErrorMsg(null);
    }
  }, [isActive]);

  return (
    <UserLoginContainer $isActive={isActive} onClick={toggleForm}>
      <Form>
        <AnimatedDiv $isActive={isActive}>
          <StyledLabel>{registerMode ? "Register" : "User Login"}</StyledLabel>
        </AnimatedDiv>

        <StyledInput
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required=""
          autoComplete="on"
          disabled={loading}
        />

        {registerMode && (
          <AnimatedInput
            type="text"
            name="nickname"
            placeholder="Nickname"
            onChange={(e) => setNickname(e.target.value)}
            required=""
            disabled={loading}
          />
        )}

        <StyledInput
          type="password"
          name="pswd"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required=""
          disabled={loading}
        />

        {errorMsg && <ErrorText>{errorMsg || "Unknown error"}</ErrorText>}

        <div
          style={{
            textAlign: "center",
            marginTop: "1.2rem",
            marginBottom: "0.5rem",
          }}
        >
          {!registerMode ? (
            <SwitchText onClick={() => setRegisterMode(true)}>
              Don't have an account? Register
            </SwitchText>
          ) : (
            <SwitchText onClick={() => setRegisterMode(false)}>
              Already have an account? Login
            </SwitchText>
          )}
        </div>

        <StyledButton onClick={isActive && !loading ? handleLogin : null}>
          {registerMode ? "Register" : "Login"}
        </StyledButton>
      </Form>
    </UserLoginContainer>
  );
}

export default UserLogin;
