import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import type { User } from "@/core/model/User";
// export interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   role : string;
//   imageUrl : string;
//   api_token: string;
// }

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.api_token);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
  }

  function login(credentials: User) {
    return ApiService.post("auth/login", credentials)
      .then(({ data }) => {
        const dataUser = data.userData;
        dataUser.api_token = data.token;
        setAuth(dataUser);
      })
      .catch(({ response }) => {
        setError(response.data.error);
      });
  }

  function logout() {
    purgeAuth();
  }

  function register(credentials: User) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.error);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.error);
      });
  }

  function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.query("/auth/verify", {})
        .then(({ data }) => {
          const dataUser = data.userData;
          dataUser.api_token = data.token;
          setAuth(dataUser);
        })
        .catch(({ response }) => {
          setError(response.data.error);
          purgeAuth();
        });
    } else {
      purgeAuth();
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    setAuth,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
  };
});
