import React from "react";
import PostRoot from "./PostRoot";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import { IPost } from "../../service/types/posts";
import { Heading, Button, Text } from "grommet";
import { Like, Dislike, Chat } from "grommet-icons";
import { VoteType } from "../../service/types/common";
import { useSelector } from "react-redux";
import { RootState } from "../../store/types";

interface FeedPostProps {
  post: IPost;
  onPressLike: (postId: string) => void;
  onPressDislike: (postId: string) => void;
  onPressComments: (postId: string) => void;
}

/** Post component that is rendered in the feed. */
const FeedPost: React.FC<FeedPostProps> = ({
  post,
  onPressLike,
  onPressDislike,
  onPressComments,
}) => {
  const authenticated = useSelector(
    (state: RootState) => state.auth.authenticated
  );
  const [localPoints, setLocalPoints] = React.useState<number>(post.points);
  const [localVote, setLocalVote] = React.useState<VoteType | null | undefined>(
    post.userVoted ? post.userVoted : null
  );

  // TODO check user is authenticated

  function handleVote(newVote: VoteType) {
    if (!authenticated) {
      // TODO better messages
      alert("You have to be authenticated to do this.");
      return;
    }

    if (localVote === null || localVote === undefined) {
      if (newVote === "upvote") {
        onPressLike(post.id);
        setLocalPoints(localPoints + 1);
      } else {
        onPressDislike(post.id);
        setLocalPoints(localPoints + 1);
      }
      setLocalVote(newVote);
    } else {
      if (localVote === "upvote") {
        if (newVote === "downvote") {
          onPressDislike(post.id);
          setLocalVote(newVote);
          setLocalPoints(localPoints - 2);
        }
      } else {
        if (newVote === "upvote") {
          onPressLike(post.id);
          setLocalVote(newVote);
          setLocalPoints(localPoints + 2);
        }
      }
    }
  }

  function getLikeBtnColor() {
    if (localVote) {
      if (localVote === VoteType.UPVOTE) return "#fba";
    }
  }

  function getDislikeBtnColor() {
    if (localVote) {
      if (localVote === VoteType.DOWNVOTE) return "#fba";
    }
  }

  return (
    <PostRoot>
      <PostHeader>
        <Heading level="4">{post.title}</Heading>
      </PostHeader>
      <PostContent imageUrl={post.imageUrl} />
      <PostActions>
        <Button
          icon={<Like color={getLikeBtnColor()} />}
          onClick={() => handleVote(VoteType.UPVOTE)}
        />
        <Button
          icon={<Dislike color={getDislikeBtnColor()} />}
          onClick={() => handleVote(VoteType.DOWNVOTE)}
        />
        <Button icon={<Chat />} onClick={() => onPressComments(post.id)} />
        <Text size="14px" style={{ margin: "auto 0" }}>
          {localPoints} points
        </Text>
      </PostActions>
    </PostRoot>
  );
};

export default FeedPost;
