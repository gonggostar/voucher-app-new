// 로그인한 사람의 번호(ID)를 기억하는 변수입니다.
let currentUserId = null;

export const setUserId = (id) => {
  currentUserId = id;
};

export const getUserId = () => {
  return currentUserId;
};