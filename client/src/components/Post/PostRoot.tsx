import React from "react";
import styled from "styled-components";

const RootDiv = styled.div`
  padding: 0 20px;
  margin: 5%;
  display: flex;
  flex-direction: column;
`;

const PostRoot: React.FC = ({ children }) => {
  return <RootDiv>{children}</RootDiv>;
};

export default PostRoot;
