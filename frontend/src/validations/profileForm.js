export const verifyPassword = (password, setPasswordErrors) => {
  let isValid = true;
  const { newPassword, oldPassword, confirmPassword } = password;
  if (oldPassword === "" || oldPassword.includes(" ")) {
    setPasswordErrors((prev) => ({
      ...prev,
      oldPassword: "Please check this field",
    }));
    isValid = false;
  } else setPasswordErrors((prev) => ({ ...prev, oldPassword: "" }));
  if (
    newPassword === "" ||
    newPassword.includes(" ") ||
    newPassword.length < 8
  ) {
    setPasswordErrors((prev) => ({
      ...prev,
      newPassword: "Please check this field",
    }));
    isValid = false;
  } else setPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
  if (confirmPassword !== newPassword) {
    setPasswordErrors((prev) => ({
      ...prev,
      confirmPassword: "Please does not matching",
    }));
    isValid = false;
  } else setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));

  return isValid;
};

export const verifyPhone = (phone) => {
  let re = /^([+]\d{2})?\d{10}$/;
  return re.test(phone);
};
