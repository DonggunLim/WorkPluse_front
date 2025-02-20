import { useMemo } from "react";
type UsePaginatorArgs = {
  total: number;
  currentPage?: number;
  blockSize?: number;
  pageSize?: number;
};

const usePaginator = ({
  total = 0,
  currentPage = 0,
  blockSize = 10,
  pageSize = 10,
}: UsePaginatorArgs) => {
  // total 156
  const totalPageLength = useMemo(
    () => Math.floor(Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  const firstPageFromCurrent = useMemo(
    () => Math.floor(currentPage / blockSize) * 10,
    [currentPage, blockSize]
  );

  const lastPageFromCurrent = useMemo(() => {
    const last = Math.floor(currentPage / blockSize) * 10 + 10 - 1; // 19
    return last < totalPageLength - 1 ? last : totalPageLength - 1;
  }, [currentPage, blockSize, totalPageLength]);

  const blockLengthFromCurrent = useMemo(
    () => lastPageFromCurrent - firstPageFromCurrent + 1,
    [lastPageFromCurrent, firstPageFromCurrent]
  );

  const pages = useMemo(
    () =>
      Array.from(
        { length: blockLengthFromCurrent },
        (_, index) => firstPageFromCurrent + index
      ),
    [blockLengthFromCurrent, firstPageFromCurrent]
  );

  return { pages, totalPageLength };
};

export default usePaginator;
