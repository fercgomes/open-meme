import React from "react";
import { IComment } from "../../service/types/comments";
import { timeSince } from "../../shared/utils";
import { User } from "grommet-icons";
import { Box, Avatar } from "grommet";
import { Link } from "react-router-dom";
import styled from "styled-components";

const CommentHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const CommentAuthorLink = styled(Link)`
  margin-left: 8px;
`;

const Timestamp = styled.p`
  font-size: 10px;
`;

const CommentContent = styled.p``;

interface PostCommentProps {
  comment: IComment;
}

const PostComment: React.FC<PostCommentProps> = ({ comment }) => {
  return (
    <div>
      <CommentHeader>
        <Box direction="row" gap="small" margin="none">
          <Avatar background="dark-1" size="small">
            <User size="small" color="light-1" />
          </Avatar>
        </Box>
        <CommentAuthorLink to="/">{comment.author.username}</CommentAuthorLink>
        <Timestamp>- {timeSince(new Date(comment.createdAt))} ago</Timestamp>
      </CommentHeader>
      <CommentContent>{comment.content}</CommentContent>
    </div>
  );
};

export default PostComment;
