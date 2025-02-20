type ListWrapProps = {
  headers: string[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
};
const ListWrap: React.FC<ListWrapProps> = ({
  headers,
  data = [],
  renderRow,
}) => {
  return (
    <>
      <div className="w-full ">
        <table className="w-full">
          {/* 테이블 헤더 */}
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, index) => (
                <th key={index} className="border-b p-2 pl-4 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* 테이블 바디 */}
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b h-[57px]">
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListWrap;
