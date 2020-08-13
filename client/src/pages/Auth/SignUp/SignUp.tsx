import React from "react";
import Layout from "../../../components/Layout/Layout";
import { Form, Image } from "semantic-ui-react";
import {
  Formik,
  FormikHelpers,
  Form as FormikForm,
  Field as FormikField,
} from "formik";
import validationSchema from "./validation";

interface CreateUserForm {
  username: string;
  email: string;
  about: string;
  password: string;
  file: any;
}

const SignUp: React.FC = () => {
  const initialValues: CreateUserForm = {
    username: "",
    email: "",
    about: "",
    password: "",
    file: null,
  };

  const submitHandler = (
    values: CreateUserForm,
    helpers: FormikHelpers<CreateUserForm>
  ) => {
    alert(JSON.stringify(values));
  };

  return (
    <Layout>
      <div style={{ padding: 20 }}>
        <Formik
          initialValues={initialValues}
          onSubmit={submitHandler}
          validationSchema={validationSchema}
        >
          <FormikForm className="ui form">
            <Form.Group>
              <Image
                src="https://assets.newglue.com/assets/avatar_placeholder-c4a9963ad86c68649100b476add586667aaaf4672a3dbfd6abf0e7338f4f5337.jpg"
                size="small"
                circular
              />

              <Form.Field style={{ padding: 30 }}>
                <label>Avatar</label>
                <Form.Input type="file" />
              </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
              <FormikField
                name="username"
                as={Form.Input}
                fluid
                label="Nome de usuário"
                placeholder="Nome de usuário"
              />

              <FormikField
                name="email"
                as={Form.Input}
                fluid
                type="email"
                label="Email"
                placeholder="Email"
              />
            </Form.Group>

            <FormikField
              name="about"
              as={Form.TextArea}
              label="Sobre mim"
              placeholder="Nos conte mais sobre você..."
            />

            <Form.Group widths="equal">
              <FormikField
                name="password"
                as={Form.Input}
                fluid
                type="password"
                label="Senha"
                placeholder="Senha"
              />
            </Form.Group>

            <FormikField
              name="ToS"
              as={Form.Checkbox}
              label="Concordo com os Termos de Serviço"
            />

            <Form.Button>Cadastrar</Form.Button>
          </FormikForm>
        </Formik>
      </div>
    </Layout>
  );
};

export default SignUp;
