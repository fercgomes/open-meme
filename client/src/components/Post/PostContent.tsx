import React from "react";
import styled from "styled-components";

const Root = styled.div``;

const Image = styled.img`
  width: 100%;
  max-width: 100%;
  magin: auto;
  object-fit: cover;
`;

interface PostContentProps {
  imageUrl: string;
}

const PostContent: React.FC<PostContentProps> = ({ imageUrl }) => {
  return (
    <Root>
      <Image src={imageUrl} />
    </Root>
  );
};

export default PostContent;
