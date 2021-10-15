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
}
