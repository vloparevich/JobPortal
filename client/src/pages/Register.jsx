import { Link } from "react-router-dom";
import { FormRow, Logo } from "../components";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";

const Register = () => {
  return (
    <Wrapper>
      <form className="form">
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
        <button type="submit" className="btn btn-block">
          Submit
        </button>
        <p>Already a memeber</p>
        <Link to="/login" className="member-btn">
          Login
        </Link>
      </form>
    </Wrapper>
  );
};

export default Register;
