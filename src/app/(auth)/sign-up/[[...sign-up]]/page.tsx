import { SignUp } from "@clerk/nextjs";
import { NextPage } from "next";

/**
 * Sign-up page using Clerk authentication.
 * Renders the Clerk <SignUp /> component.
 */
const SignUpPage: NextPage = () => {
  return <SignUp />;
};

export default SignUpPage;
