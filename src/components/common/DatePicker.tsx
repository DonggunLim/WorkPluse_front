import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

dayjs.locale("ko");

type DatepickerProps = {
  className?: string;
  dateFormat?: string;
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  id?: string;
  readOnly?: boolean;
  minDate?: Date;
};

const Datepicker: React.FC<DatepickerProps> = ({
  selected,
  onChange,
  className,
  dateFormat,
  id,
  readOnly,
  minDate,
}) => {
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"]; // 요일 한글화

  return (
    <div>
      {id ? (
        <label className={"text-sm"} htmlFor={id}>
          {id}
        </label>
      ) : null}
      <DatePicker
        className={`border text-gray-900 focus:outline-none focus:ring-2 ${className}`}
        dateFormat={dateFormat}
        selected={selected}
        onChange={onChange}
        readOnly={readOnly}
        minDate={minDate}
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
          <div>
            <div className="flex justify-between items-center px-2 py-1">
              <button onClick={decreaseMonth} className="text-sm">
                {"<"}
              </button>
              <span className="text-sm font-medium">
                {dayjs(date).format("YYYY년 M월")}
              </span>
              <button onClick={increaseMonth} className="text-sm">
                {">"}
              </button>
            </div>
            <div className="grid grid-cols-7 mt-2">
              {daysOfWeek.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>
          </div>
        )}
        formatWeekDay={(day) => daysOfWeek[dayjs(day).day()]}
      />
    </div>
  );
};

export default Datepicker;
