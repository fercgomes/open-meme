import React from "react";
import PostRoot from "../../components/Post/PostRoot";
import PostHeader from "../../components/Post/PostHeader";
import PostContent from "../../components/Post/PostContent";
import PostActions from "../../components/Post/PostActions";
// import PostComment from "../../components/Post/PostComment";
import { IFullPost } from "../../service/types/posts";
import { Heading, Button, Text } from "grommet";
import { Like, Dislike } from "grommet-icons";

// TODO load comments separately, to paginate
// TODO then FullPost won't be necessary
interface FullPostProps {
  post: IFullPost;
  onPressLike: (postId: string) => void;
  onPressDislike: (postId: string) => void;
}

/** Post component that is rendered in the feed. */
const FeedPost: React.FC<FullPostProps> = ({
  post,
  onPressLike,
  onPressDislike,
}) => {
  return (
    <PostRoot>
      <PostHeader>
        <Heading level="4">{post.title}</Heading>
      </PostHeader>
      <PostContent imageUrl={post.imageUrl} />
      <PostActions>
        <Button icon={<Like />} />
        <Button icon={<Dislike />} />
        <Text size="14px" style={{ margin: "auto 0" }}>
          {post.points} points
        </Text>
      </PostActions>
    </PostRoot>
  );
};

export default FeedPost;
