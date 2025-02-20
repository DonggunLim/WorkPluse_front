interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => {
  const { className = "", type = "text", id } = props;

  return (
    <div>
      {id && (
        <label className="text-sm" htmlFor={id}>
          {id}
        </label>
      )}
      <input
        {...props}
        type={type}
        className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 ${className}`}
      />
    </div>
  );
};

export default Input;
