export interface PaginationI {
    countPerPage: number
    page: number
    skip?: number
}

export default class Pagination implements PaginationI {
    countPerPage!: number;
    page!: number;

    public get skip() {
        return (this.page - 1) * this.countPerPage
    }

}