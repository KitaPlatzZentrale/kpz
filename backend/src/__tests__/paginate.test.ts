import paginate, { PaginatedResultsResponse } from "../utils/paginate";

describe("paginate", () => {
  it("should return a paginated list of items", () => {
    const sortedList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const page = 2;
    const limit = 3;

    const expected: PaginatedResultsResponse<number> = {
      meta: {
        page: 2,
        totalPages: 4,
        itemsPerPage: 3,
        totalItems: 10,
        amountOfItems: 3,
        nextPage: 3,
      },
      items: [4, 5, 6],
    };

    const result = paginate<number>(sortedList, page, limit);

    expect(result).toEqual(expected);
  });

  it("should return the remaining items if the end index is greater than the list length", () => {
    const sortedList: number[] = [1, 2, 3, 4, 5];
    const page = 2;
    const limit = 3;

    const expected: PaginatedResultsResponse<number> = {
      meta: {
        page: 2,
        totalPages: 2,
        itemsPerPage: 3,
        totalItems: 5,
        amountOfItems: 2,
        nextPage: false,
      },
      items: [4, 5],
    };

    const result = paginate<number>(sortedList, page, limit);

    expect(result).toEqual(expected);
  });

  it("should return an empty array if the list is empty", () => {
    const sortedList: number[] = [];
    const page = 1;
    const limit = 10;

    const expected: PaginatedResultsResponse<any> = {
      meta: {
        page: 1,
        totalPages: 1,
        itemsPerPage: 10,
        totalItems: 0,
        amountOfItems: 0,
        nextPage: false,
      },
      items: [],
    };

    const result = paginate<any>(sortedList, page, limit);

    expect(result).toEqual(expected);
  });
});
