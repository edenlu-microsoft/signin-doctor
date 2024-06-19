import React, { createContext, useContext, useState } from "react";

type DoctorState = {
  email: string;
  setEmail: (email: string) => void;
  pwd: string;
  setPwd: (pwd: string) => void;
  signInDiagnose: any;
  setSignInDiagnose: (diagnose: any) => void;
};

const doctorContext = createContext<DoctorState>({
  email: "",
  setEmail: () => {},
  pwd: "",
  setPwd: () => {},
  signInDiagnose: {},
  setSignInDiagnose: () => {},
});

// AssetGroupManager's global storage
// below states/actions can be accessed by children of AssetGroupManager component
export const DoctorStateProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { Provider } = doctorContext;
  const [email, setEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [signInDiagnose, setSignInDiagnose] = useState<any>();

  const value: DoctorState = {
    email,
    setEmail,
    pwd,
    setPwd,
    signInDiagnose,
    setSignInDiagnose,
  };

  return <Provider value={value}>{children}</Provider>;
};

export const useDoctorState = () => {
  return useContext(doctorContext);
};
