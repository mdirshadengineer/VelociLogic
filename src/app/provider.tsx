import type { FC, ReactNode } from "react";

type RootProvidersProps = {
  children: ReactNode;
}

const RootProviders: FC<RootProvidersProps> = (props) => {
  return (
    <>
      {props.children}
    </>
  )
}

export default RootProviders