import { SignIn } from "@clerk/nextjs";
import { NextPage } from "next";

/**
 * Sign-in page using Clerk authentication.
 * Renders the Clerk <SignIn /> component.
 */
const SignInPage: NextPage = () => {
  return <SignIn />;
};

export default SignInPage;
