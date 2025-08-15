export type SignupResult = {
  success: boolean;
  error?: string;
  data?: {
    name: string;
    email: string;
    passwordLength: number;
  };
};

export type SignupSuccessInfo = {
  name: string;
  email: string;
  passwordLength: number;
};
