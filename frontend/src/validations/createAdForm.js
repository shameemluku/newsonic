import moment from "moment";

export const isAdDetailsValid = (fields, setFieldErrors) => {
  let isValid = true;

  const { 
      title, 
      url, 
      startDate, 
      endDate, 
      imageFrm, 
      imageSqr, 
      estView 
    } = fields;

  if (
    title === "" ||
    title === null ||
    title[0] === " " ||
    title.length > 100
  ) {
    setFieldErrors((prevState) => ({
      ...prevState,
      title: "Enter a valid title",
    }));
    isValid = false;
  }
  if (url === null || url === "" || url.includes(" ")) {
    setFieldErrors((prevState) => ({
      ...prevState,
      url: "Enter a valid Url",
    }));
    isValid = false;
  }
  if (startDate === null || endDate === null) {
    setFieldErrors((prevState) => ({
      ...prevState,
      date: "Select proper dates",
    }));
    isValid = false;
  }
  if (startDate !== null && endDate !== null) {
    if (findDiff(startDate, endDate) < 5) {
      setFieldErrors((prevState) => ({
        ...prevState,
        date: "Select atleast 5 days for Campain",
      }));
      isValid = false;
    }
  }
  if (imageFrm === null) {
    setFieldErrors((prevState) => ({
      ...prevState,
      imageFrm: "Cropped Image is required",
    }));
    isValid = false;
  }
  if (imageSqr === null) {
    setFieldErrors((prevState) => ({
      ...prevState,
      imageSqr: "Square Image is required",
    }));
    isValid = false;
  }
  if (estView < 500 || isNaN(estView)) {
    setFieldErrors((prevState) => ({
      ...prevState,
      views: "Please check the field. Cannot be below 500",
    }));
    isValid = false;
  }

  if (!isValid) {
    return false;
  }

  return true;
};

export const findDiff = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  return end.diff(start, "days");
};
