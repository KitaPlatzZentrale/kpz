export type PaginatedResultsMetadata = {
  page: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  amountOfItems: number;
  nextPage: number | false;
};

export interface PaginatedResultsResponse<T> {
  meta: PaginatedResultsMetadata;
  items: T[];
}

const paginate = <T = any>(
  sortedList: any[],
  page: number,
  limit: number
): PaginatedResultsResponse<T> => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  let itemsInPage;

  if (endIndex > sortedList.length) {
    itemsInPage = sortedList.slice(startIndex);
  } else {
    itemsInPage = sortedList.slice(startIndex, endIndex);
  }

  const maxNumOfPages = Math.ceil(sortedList.length / limit);

  return {
    meta: {
      page: page,
      totalPages: maxNumOfPages > 0 ? maxNumOfPages : 1,
      itemsPerPage: limit,
      totalItems: sortedList.length,
      amountOfItems: itemsInPage.length,
      nextPage: page < maxNumOfPages ? page + 1 : false,
    },
    items: itemsInPage,
  };
};

export default paginate;
