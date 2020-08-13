import * as yup from "yup";

export default yup.object({
  username: yup.string().max(16).required("Obrigatório"),
  email: yup.string().email().required("Obrigatório"),
  about: yup.string().max(200),
  password: yup
    .string()
    .min(6, "Senha precisa ter no mínimo 6 caracteres")
    .max(16, "Senha muito longa")
    .required("Obrigatório"),
  file: yup.mixed(),
});
