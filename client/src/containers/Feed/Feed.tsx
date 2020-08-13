import React from "react";
import styled from "styled-components";
import { Api } from "../../service/api";
import { useQuery, useMutation } from "react-query";
import { VoteType } from "../../service/types/common";
import { queryCache } from "react-query";
import Logger from "js-logger";
import { useHistory } from "react-router-dom";
import FeedPost from "../../components/Post/FeedPost";
const log = Logger.get("Feed Component");

const Root = styled.div``;

const Feed: React.FC = () => {
  /** Fetch posts for feed. */
  const history = useHistory();
  const { data } = useQuery(["feed"], Api.posts.query);
  const [votePost] = useMutation(Api.posts.votePost, {
    onSuccess: (_, mutationVariables) => {
      log.info(
        `${
          mutationVariables.vote === VoteType.UPVOTE ? "Upvoting" : "Downvoting"
        } post ${mutationVariables.postId} succeeded.`
      );
    },
    onError: (_, vars) => {
      log.info(
        `${vars.vote === VoteType.UPVOTE ? "Upvoting" : "Downvoting"} post ${
          vars.postId
        } failed.`
      );
    },
  });

  // TODO these mutations should invalidate their respective queries
  const postLikeHandler = (postId: string) => {
    votePost(
      { postId, vote: VoteType.UPVOTE },
      {
        onSuccess: () => {
          queryCache.invalidateQueries("feed");
        },
      }
    );
  };

  const postDislikeHandler = (postId: string) => {
    votePost(
      { postId, vote: VoteType.DOWNVOTE },
      {
        onSuccess: () => {
          queryCache.invalidateQueries("feed");
        },
      }
    );
  };
  const postCommentHandler = (postId: string) => {
    history.push(`/post/${postId}`);
  };

  return (
    <Root>
      {data
        ? data.map((post) => (
            <FeedPost
              key={post.id}
              post={post}
              onPressLike={postLikeHandler}
              onPressDislike={postDislikeHandler}
              onPressComments={postCommentHandler}
            />
          ))
        : null}
    </Root>
  );
};

export default Feed;
