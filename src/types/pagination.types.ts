export interface PaginationI {
  countPerPage: number
  page: number
  skip?: number
}

/**
 * Pagination
 */
export default class Pagination implements PaginationI {
  countPerPage!: number
  page!: number

  /**
   * Calculate skip value
   */
  public get skip() {
    return (this.page - 1) * this.countPerPage
  }

  /**
   * Create a new instance from pagination value
   * @return {Pagination}
   */
  public static default(): Pagination {
    const pagination = new Pagination()
    pagination.countPerPage = 25
    pagination.page = 1
    return pagination
  }
}
