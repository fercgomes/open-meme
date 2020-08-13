import React from "react";
import Layout from "../../components/Layout/Layout";
import { Header, Input, Button, Form, Checkbox } from "semantic-ui-react";
import { Formik, FormikHelpers } from "formik";
import { Api } from "../../service/api";
import Thumb from "../../components/Thumbnail/Thumbnail";
import Logger from "js-logger";
import { useHistory } from "react-router-dom";

const log = Logger.get("New Post Page");

interface CreatePostData {
  title: string;
  file: any;
}

const NewPost: React.FC = () => {
  const history = useHistory();

  const initialValues: CreatePostData = {
    title: "",
    file: null,
  };

  const submitHandler = async (
    values: CreatePostData,
    helpers: FormikHelpers<CreatePostData>
  ) => {
    log.info(`Uploading file ${values.file.name}`);

    let data = new FormData();
    data.append("file", values.file);

    try {
      const { ref } = await Api.media.sendImage(data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      log.info("Got ref = " + ref);

      try {
        const res = await Api.posts.createPost({
          title: values.title,
          contentRef: ref,
        });

        log.info(`Post created (${res.id}). Redirecting.`);
        history.push(`/post/${res.id}`);
      } catch (err) {
        log.error(`Creating post failed.`);
      }
    } catch (err) {
      log.error(`Media upload failed. ${err.response.message}`);
    }
  };

  return (
    <Layout>
      <Header as="h2">Create new post</Header>
      <Formik
        initialValues={initialValues}
        onSubmit={submitHandler}
        render={({ values, handleSubmit, setFieldValue, ...formik }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div>
                <Form.Field>
                  <label htmlFor="content">Post title</label>
                  <Input name="title" type="text" placeholder="Post title" />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="file">Upload content</label>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    onChange={(event: any) => {
                      setFieldValue("file", event.target.files[0]);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox label="I agree to the Terms and Conditions" />
                </Form.Field>
                <Button type="submit">Submit post</Button>
              </div>
              <Thumb file={values.file} />
            </Form>
          );
        }}
      />
    </Layout>
  );
};

export default NewPost;
