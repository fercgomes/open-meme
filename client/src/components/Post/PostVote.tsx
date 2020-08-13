import React from "react";
import { VoteType } from "../../service/types/common";
import { Button } from "grommet";
import { Like } from "grommet-icons";

interface PostVoteProps {
  // TODO this should be received from API!
  vote: VoteType;
  onClick: () => void;
}

const PostVote: React.FC<PostVoteProps> = ({ vote, onClick }) => {
  return (
    <div>
      <Button icon={<Like />} onClick={onClick} />
    </div>
  );
};

export default PostVote;
