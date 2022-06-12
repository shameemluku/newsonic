export const isRegisterValid = (fields, setRegisterError, registerErrors) => {
  const { email, name, password, phone } = fields;
  let isValid = true;

  let pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!pattern.test(email)) {
    setRegisterError((prevState) => ({
      ...prevState,
      email: "Email not valid",
    }));
    isValid = false;
  }

  let phone_pattern = /^([+]\d{2})?\d{10}$/;
  if (!phone_pattern.test(phone)) {
    setRegisterError((prevState) => ({
      ...prevState,
      phone: "Phone number not valid",
    }));
    isValid = false;
  }

  if (name === "" || name[0] === " ") {
    setRegisterError((prevState) => ({
      ...prevState,
      name: "Please check this field",
    }));
    isValid = false;
  }

  if (password.length < 8 || password === "" || password.includes(" ")) {
    setRegisterError((prevState) => ({
      ...prevState,
      password: "Invalid password (Note: atleast 8 characters)",
    }));
    isValid = false;
  }

  if (!isValid) {
    return false;
  }

  return true;
};

export function isEmailValid(loginFields, setLoginError, enqueueSnackbar) {
  let email = loginFields.email;
  let pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!pattern.test(email)) {
    setLoginError((prevState) => ({ ...prevState, email: true }));
    enqueueSnackbar("Please check the email address!", { variant: "error" });
    return false;
  }
  return true;
}

export function isPassValid(loginFields, setLoginError, enqueueSnackbar) {
  let password = loginFields.password;
  if (password === "" || password === " ") {
    setLoginError((prevState) => ({ ...prevState, password: true }));
    enqueueSnackbar("Password cannot be blank!", { variant: "error" });
    return false;
  }
  return true;
}
