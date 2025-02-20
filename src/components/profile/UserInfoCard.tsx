import homeImg from "/img/addressImg.png";
import phoneImg from "/img/phone.png";
import birthImg from "/img/birthImg.png";
import Button from "../common/Button";
import Input from "../common/Input";
import { ChangeEvent, useEffect, useState } from "react";
import api from "../../utils/api";
import { ENDPOINT } from "../../utils/endpoints";
import { validatePhone, validateBirth } from "../../utils/validation";

type UserInfo = {
  phone?: string;
  birth?: string;
  address?: string;
};

type InfoCardProps = {
  title?: string;
  user: UserInfo;
  onEdit: (updatedUser: UserInfo) => void;
};

const UserInfoCard: React.FC<InfoCardProps> = ({ title, user, onEdit }) => {
  const [editInput, setEditInput] = useState({
    phone: user.phone || "",
    birth: user.birth || "",
    address: user.address || "",
  });

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;

    setEditInput((prev) => ({ ...prev, [name]: value }));
  };

  /* 부가 정보 수정 하기*/
  const handleClickPhoneChange = async () => {
    const phoneError = validatePhone(editInput.phone);
    if (phoneError) {
      alert(phoneError);
      return;
    }
    updateInfo();
  };
  const handleClickBirthChange = async () => {
    const birthError = validateBirth(editInput.birth);

    if (birthError) {
      alert(birthError);
      return;
    }
    updateInfo();
  };
  const handleClickAddressChange = async () => {
    updateInfo();
  };

  const updateInfo = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const { userId } = JSON.parse(storedUser);
      const response = await api.patch(`${ENDPOINT.USER_PROFILE}/${userId}`, {
        phone: editInput.phone,
        birth: editInput.birth,
        address: editInput.address,
        id: userId,
      });

      if (response.status === 204 || response.status === 200) {
        onEdit({
          ...user,
          phone: editInput.phone,
          birth: editInput.birth,
          address: editInput.address,
        });

        alert("수정 완료");
      }
    } catch (err) {
      console.error("Error updating phone:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setEditInput((prev) => ({
        ...prev,
        phone: user.phone || prev.phone,
        birth: user.birth || prev.birth,
        address: user.address || prev.address,
      }));
    }
  }, [user]);
  return (
    <div>
      <p className="font-bold pb-2 pt-8">{title}</p>
      <div className="border border-[#DFDFDF] bg-white rounded-md p-6">
        <div className="w-full flex gap-2 mb-1 justify-between items-center border-b border-gray-300 last:border-none py-2">
          <img src={phoneImg} alt="휴대폰이미지" />
          <Input
            onChange={handleChange}
            value={editInput.phone}
            placeholder="ex) 010-0000-0000"
            name="phone"
          />

          <Button
            btnText="수정"
            onClick={handleClickPhoneChange}
            className="max-w-[70px]"
          />
        </div>
        <div className="w-full flex gap-2 mb-1 justify-between items-center border-b border-gray-300 last:border-none py-2">
          <img src={birthImg} alt="케이크이미지" />
          <Input
            onChange={handleChange}
            value={editInput.birth}
            placeholder="ex) 2000.12.23"
            name="birth"
          />
          <Button
            btnText="수정"
            onClick={handleClickBirthChange}
            className="max-w-[70px]"
          />
        </div>
        <div className="w-full flex gap-2 mb-1 justify-between items-center border-b border-gray-300 last:border-none py-2">
          <img src={homeImg} alt="홈이미지" />
          <Input
            onChange={handleChange}
            value={editInput.address}
            placeholder="ex) 경기도 수원시 장안구"
            name="address"
          />
          <Button
            btnText="수정"
            onClick={handleClickAddressChange}
            className="max-w-[70px]"
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
