export type SignupResult = {
  success: boolean;
  error?: string;
  data?: {
    name: string;
    email: string;
    passwordLength: number;
    countdown: number;
  };
};

export type SignupSuccessInfo = {
  name: string;
  email: string;
  passwordLength: number;
  countdown: number;
};