import { Input, Typography } from "@mui/material";

//Form generator here
export const DesignForms = (form, error) => {
  return form.map((elem) => {
    return (
      <div key={elem.name}>
        <Input
          placeholder={elem.placeholder}
          fullWidth
          name={elem.name}
          error={error}
          style={{
            marginTop: "30px",
            ...elem.style,
          }}
        />
        <Typography
          textAlign="left"
          style={{
            color: "rgba(0, 0, 0, 0.7)",
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            fontWeight: "400",
            fontSize: "0.75rem",
            lineHeight: "1.66",
            letterSpacing: "0.03333em",
            textAlign: "left",
            margin: "3px 14px 0px",
          }}
          variant="h3"
        >
          {elem.helperText}
        </Typography>
      </div>
    );
  });
};

//Form fields here

//SingUpForm
export const SignupForm = [
  {
    name: "name",
    placeholder: "Name",
    style: { marginTop: "0px" },
    helperText: "Please enter your name here",
  },
  {
    name: "email",
    placeholder: "Email",
    helperText: "Please enter your email here",
  },
  {
    name: "password",
    placeholder: "Password",
    helperText: "Please enter your password here",
  },
  {
    name: "cnfpassword",
    placeholder: "Confirm Password",
    helperText: "Please confirm your password here",
  },
];

//Signinform
export const SigninForm = [
  {
    name: "username",
    placeholder: "Email",
    helperText: "Please enter your email here",
    style: { marginTop: "0px" },
  },
  {
    name: "password",
    placeholder: "Password",
    helperText: "Please enter your password here",
  },
];
