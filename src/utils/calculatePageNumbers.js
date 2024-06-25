export const calculatePageNumbers = (totalRecord) => {
  const pageLimit = 10;
  const pageNumber = Math.ceil(totalRecord / pageLimit);
  return pageNumber;
};
