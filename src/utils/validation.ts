export const validatePhone = (phone: string) => {
  const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
  if (!phoneRegex.test(phone)) {
    return "전화번호는 010-0000-0000 형식이어야 합니다.";
  }
  return "";
};

export const validateBirth = (birth: string) => {
  const birthRegex = /^\d{4}\.\d{2}\.\d{2}$/;
  if (!birthRegex.test(birth)) {
    return "생년월일은 YYYY.MM.DD 형식이어야 합니다.";
  }
  return "";
};
