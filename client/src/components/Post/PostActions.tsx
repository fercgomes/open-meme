import React from "react";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 50px;
  margin: 10px 0;
`;

const PostActions: React.FC = ({ children }) => {
  return <Root>{children}</Root>;
};

export default PostActions;
