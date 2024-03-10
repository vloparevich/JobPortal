import { Form, redirect, useNavigation, Link } from "react-router-dom";
import { FormRow, Logo } from "../components";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  console.log("I wish I could escape");
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/auth/register", data);
    toast.success("Registration successful");
    return redirect("/login");
  } catch (err) {
    console.log(err);
    toast.error(err?.response?.data?.msg);
    return err;
  }
};

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow type="text" name="name" defaultValue="John" />
        <FormRow
          type="text"
          name="lastName"
          labelText="Last Name"
          defaultValue="Loparevich"
        />
        <FormRow type="text" name="location" defaultValue="earth" />
        <FormRow type="text" name="email" defaultValue="v@dd.com" />
        <FormRow
          type="password"
          name="password"
          defaultValue="supersecret123"
        />
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </button>
        <p>Already a member</p>
        <Link to="/login" className="member-btn">
          Login
        </Link>
      </Form>
    </Wrapper>
  );
};

export default Register;
