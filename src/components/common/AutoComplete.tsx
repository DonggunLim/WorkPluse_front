import { UserData } from "../../types";

type AutoCompleteProps = {
  value?: string;
  onSelect?: (user: UserData) => void;
  id?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AutoComplete: React.FC<AutoCompleteProps> = ({
  id,
  readOnly,
  onChange,
  value,
}) => {
  return (
    <div className="">
      {id ? (
        <label className={"text-sm"} htmlFor={id}>
          {id}
        </label>
      ) : null}
      <input
        type="search"
        className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2"
        value={value}
        onChange={onChange}
        placeholder="참여자 검색"
        readOnly={readOnly}
      />
    </div>
  );
};

export default AutoComplete;
