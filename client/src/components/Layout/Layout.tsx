import React from "react";
import styled from "styled-components";
import Navbar from "../Navbar/Navbar";

const RootDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const CenteredContainer = styled.div`
  magin: auto;
  width: 50%;
`;

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <Navbar />
      <RootDiv>
        <CenteredContainer>{children}</CenteredContainer>
      </RootDiv>
    </div>
  );
};

export default Layout;
