export const tokenService = {
  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },
  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },
  setAccessToken: (token: string) => {
    localStorage.setItem("accessToken", token);
  },
};

export default tokenService;
