import { useMutation } from "@tanstack/react-query";
import { registerUserAPI } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { pageRoutes } from "@/apiRoutes";

export const useRegisterUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password, name }) =>
      registerUserAPI(email, password, name),
    onSuccess: () => {
      console.log("가입 성공!");
      navigate(pageRoutes.login);
    },
    onError: (error) => {
      console.error(
        "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.",
        error
      );
    },
  });
};
