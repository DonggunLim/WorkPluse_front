import Button from "./Button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  date: string;
  creatorUsername?: string;
  agenda?: string;
  vacationType?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  attendant?: string[];
  children?: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  date,
  creatorUsername,
  agenda,
  reason,
  attendant,
  children,
}) => {
  if (!isOpen) return;

  /* 모달 밖부분 클릭해도 모달 닫히게  */
  const handleBackgroundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  /* 모달 내부에서 클릭 시 안닫히게 */
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
    >
      <div
        onClick={handleModalClick}
        className="flex flex-col justify-center items-center w-96  bg-white p-6 rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-bold truncate w-[300px] text-center">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">일자: {date}</p>
        <div className="w-full h-px my-4 bg-gray-300"></div>
        <div className="w-full flex flex-col justify-left text-sm">
          {/* 알림 모달 내용 */}
          {creatorUsername && (
            <>
              <p className="mt-4 text-gray-500">주최자</p>
              <p className="mt-2">{creatorUsername}</p>
            </>
          )}

          {attendant && (
            <>
              <p className="mt-4 text-gray-500">참여자</p>
              <p className="mt-2 break-words">
                {attendant.map((name, index) => (
                  <span key={index}>
                    {name}
                    {index < attendant.length - 1 && ","}
                    {/* 마지막 이름 뒤에는 마침표를 추가하지 않음 */}
                  </span>
                ))}
              </p>
            </>
          )}
          {agenda && (
            <>
              <p className="mt-4 text-gray-500 break-words">회의 안건</p>
              <p className="mt-2 break-words">{agenda}</p>
            </>
          )}
          {/* 연차 모달 내용 */}
          {reason && (
            <>
              <p className="mt-4 text-gray-500">휴가 사유</p>
              <p className="mt-2">{reason}</p>
            </>
          )}
        </div>
        {children}
        <Button onClick={onClose} btnText="확인" className="mt-8" />
      </div>
    </div>
  );
};

export default Modal;
