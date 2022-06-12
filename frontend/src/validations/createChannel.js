export const validate = (data, propic, setErrors) => {
  let pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let phone_pattern = /^([+]\d{2})?\d{10}$/;
  let web_pattern =
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  let isValid = true;
  const { channelName, phone, email, website, files } = data;

  if (channelName.length < 3 || channelName[0] === " ") {
    setErrors((prev) => ({ ...prev, channelName: "Invalid channel name" }));
    isValid = false;
  }

  if (!phone_pattern.test(phone)) {
    setErrors((prev) => ({ ...prev, phone: "Phone number not valid" }));
    isValid = false;
  }

  if (!pattern.test(email)) {
    setErrors((prev) => ({ ...prev, email: "Email not valid" }));
    isValid = false;
  }

  if (!web_pattern.test(website)) {
    setErrors((prev) => ({ ...prev, website: "Website not valid" }));
    isValid = false;
  }

  if (files === null) {
    setErrors((prev) => ({ ...prev, files: "Select atleast one file" }));
    isValid = false;
  }

  if (files !== null && files.length > 3) {
    setErrors((prev) => ({ ...prev, files: "Maximum 3 files are allowed" }));
    isValid = false;
  }
  if (!propic) {
    setErrors((prev) => ({ ...prev, propic: "Choose a channel picture" }));
    isValid = false;
  }

  return isValid;
};
