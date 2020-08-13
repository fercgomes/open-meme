import React from "react";
import styled from "styled-components";
import { TextInput, Button } from "grommet";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../../store/auth/actions";
import { RootState } from "../../../store/types";
import { Redirect } from "react-router-dom";

// const RootDiv = styled.div``;

const FormBox = styled.div`
  width: 50%;
  margin: auto;
`;

interface LoginData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const redirectPath = useSelector(
    (state: RootState) => state.auth.authRedirectPath
  );
  const isAuth = useSelector((state: RootState) => state.auth.authenticated);
  const dispatch = useDispatch();

  const submitHandler = (
    values: LoginData,
    helpers: FormikHelpers<LoginData>
  ) => {
    helpers.resetForm();
    dispatch(auth(values.username, values.password));
  };

  const redirect = isAuth ? <Redirect to={redirectPath} /> : null;

  const initialValues: LoginData = {
    username: "",
    password: "",
  };

  return (
    <>
      {redirect}
      <FormBox>
        <Formik initialValues={initialValues} onSubmit={submitHandler}>
          <Form>
            <Field name="username" placeholder="username" as={TextInput} />
            <Field name="password" placeholder="password" as={TextInput} />
            <Button type="submit" label="Sign in" />
          </Form>
        </Formik>
      </FormBox>
    </>
  );
};

export default SignIn;
