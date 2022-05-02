// customer validation method
const customerValidation = (customer) => {
  // error object
  const error = {};

  // grab all info from customer object
  const { firstName, lastName, email, password } = customer;

  // check if there is not first name
  if (!firstName) {
    error["message"] = "Error, first name is empty, please add your first name";
  }
  // check if there is not last name
  else if (!lastName) {
    error["message"] =
      "Error, last name not added, please write your last name";
  }
  // check if there is not email address
  else if (!email) {
    error["message"] =
      "Error, email not provided, please provide a valid email";
  }
  // check if there is not password
  else if (!password) {
    error["message"] =
      "Error, there was not password entered, please make sure to create a password";
  }

  return {
    //  send an object wether the validation is successful or not and the error object
    isSuccessful: !error.message ? true : false,
    error,
  };
};

module.exports = customerValidation;
