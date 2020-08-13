import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, queryCache } from "react-query";
import { Api } from "../../service/api";
import FullPost from "../../components/FullPost/FullPost";
import { VoteType } from "../../service/types/common";
import Logger from "js-logger";
import PostComment from "../../components/Post/PostComment";
import { Formik, Form, Field } from "formik";
import { TextArea, Button } from "grommet";
import Layout from "../../components/Layout/Layout";

const log = Logger.get("Post Page");

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { data } = useQuery(["full-post", postId], Api.posts.fetchFullPost);

  //! code duplication here!!
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

  const [postComment] = useMutation(Api.posts.createPostComment);

  // TODO these mutations should invalidate their respective queries
  const postLikeHandler = (postId: string) => {
    votePost({ postId, vote: VoteType.UPVOTE });
    queryCache.invalidateQueries("feed");
  };

  const postDislikeHandler = (postId: string) => {
    votePost({ postId, vote: VoteType.DOWNVOTE });
    queryCache.invalidateQueries("feed");
  };

  const initialValues = {
    comment: "",
  };

  const submitHandler = (values: any, helpers: any) => {
    helpers.resetForm();
    postComment(
      { postId: postId, content: values.comment },
      {
        onSuccess: () => {
          queryCache.invalidateQueries(["full-post", postId]);
        },
      }
    );
  };

  return (
    <Layout>
      {data ? (
        <>
          <FullPost
            post={data}
            onPressLike={postLikeHandler}
            onPressDislike={postDislikeHandler}
          />
          {/* Comments */}
          {/* TODO ?????? */}
          <div style={{ margin: "5%", padding: "0 20px" }}>
            {data.comments.map((comment) => (
              <PostComment key={comment.id} comment={comment} />
            ))}
            <Formik initialValues={initialValues} onSubmit={submitHandler}>
              <Form>
                <Field
                  name="comment"
                  as={TextArea}
                  placeholder="Say something!"
                />
                <Button label="Comment" type="submit" />
              </Form>
            </Formik>
          </div>
          {/* New Comment */}
        </>
      ) : null}
    </Layout>
  );
};

export default PostPage;
