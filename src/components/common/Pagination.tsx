import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = (props: PaginationProps) => {
  const { currentPage, totalPage, onPageChange, className } = props;
  const currentPages: number[] = useMemo(() => {
    const currentPageCount: number =
      Math.floor(totalPage / 5) > Math.floor((currentPage - 1) / 5)
        ? 5
        : totalPage % 5;

    return new Array(currentPageCount)
      .fill(0)
      .map((_, i) => i + 1 + Math.floor((currentPage - 1) / 5) * 5);
  }, [currentPage, totalPage]);

  const changePage = (page: number) => {
    onPageChange(page);
  };

  return (
    <div
      className={`flex justify-center items-center space-x-2 mt-4 ${className}`}
    >
      <button
        className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        onClick={() => changePage(1)}
        disabled={currentPage === 1}
      >
        처음
      </button>
      <button
        className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>

      {currentPages.map((page) => (
        <button
          className={`px-4 py-2 rounded ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => changePage(page)}
          disabled={currentPage === page}
          key={page}
        >
          {page}
        </button>
      ))}
      <button
        className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPage}
      >
        다음
      </button>
      <button
        className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        onClick={() => onPageChange(totalPage)}
        disabled={currentPage === totalPage}
      >
        마지막
      </button>
    </div>
  );
};

export default Pagination;
