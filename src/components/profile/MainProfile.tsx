import Button from "../common/Button";
import profileImg from "/img/profileImg.png";
import profileEditImg from "/img/profileEditImg.png";
import Input from "../common/Input";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import api from "../../utils/api";
import { ENDPOINT } from "../../utils/endpoints";

type UserInfo = {
  id?: string;
  email?: string;
  name?: string;
  username?: string;
  userImage?: string;
};

type MainProfileProps = {
  user: UserInfo;
  onEdit: (updatedUser: UserInfo) => void;
};

const MainProfile: React.FC<MainProfileProps> = ({ user, onEdit }) => {
  /* 이미지 업로드 */
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  /* 이름 수정 */
  const [editName, setEditName] = useState(user.name || "");

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setEditName(target.value);
  };

  /* 이름 수정 하기*/
  const handleClickEdit = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const { userId } = JSON.parse(storedUser);
      const response = await api.patch(`${ENDPOINT.USER_PROFILE}/${userId}`, {
        username: editName,
        id: userId,
      });

      if (response.status === 200 || response.status === 204) {
        onEdit({ ...user, name: editName });
        alert("이름 수정 완료");
      }
    } catch (err) {
      console.error("Error updating name:", err);
    }
  };
  /* input에도 현재 이름 보이게 */
  useEffect(() => {
    setEditName(user.name || "");
  }, [user.name]);

  /* 이미지 업로드 */
  const handleImageClick = () => {
    // 이미지 클릭 시 input 요소 클릭
    inputFileRef.current?.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const user = JSON.parse(storedUser);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("image", file); // 파일이 있을 경우에만 추가
      } else {
        // 파일이 없으면 추가하지 않음
        console.error("No file selected");
        return;
      }
      const response = await api.put(
        `${ENDPOINT.USER_PROFILE_IMAGE}/${user.userId}`,
        formData
      );
      if (response.status === 200 || response.status === 204) {
        // 업로드 후 처리 로직 (예: 이미지 URL 업데이트)

        const uploadedImageUrl = response.data.data.imgUrl;
        const updatedUser = {
          ...user,
          userImage: uploadedImageUrl,
          name: editName,
        };
        console.log({ updatedUser });
        localStorage.setItem("user", JSON.stringify(updatedUser)); // 로컬 스토리지에 저장
        onEdit(updatedUser);
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-lg">Profile</h2>
      <div className="flex flex-col justify-center items-center mt-20">
        <div>
          <input
            type="file"
            ref={inputFileRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            className="relative rounded-full border-transparent border-2  hover:border-blue-500"
            onClick={handleImageClick}
          >
            <img
              src={user.userImage || profileImg}
              alt="프로필 사진"
              className="cursor-pointer w-36 h-36 object-cover rounded-full"
            />
            <img
              src={profileEditImg}
              alt="수정 이미지"
              className="absolute bottom-0 w-8 h-8 right-1 cursor-pointer"
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold pt-3">{editName}</h3>
        <p className="text-sm">{user.email}</p>
      </div>
      <div className="pt-14">
        <p className="text-sm pt-4">이름</p>
        <Input
          type="text"
          name="name"
          value={editName}
          className="mt-2"
          onChange={handleChange}
        />
        <Button
          btnText="이름 수정"
          className="mt-16"
          onClick={handleClickEdit}
        />
      </div>
    </div>
  );
};

export default MainProfile;
