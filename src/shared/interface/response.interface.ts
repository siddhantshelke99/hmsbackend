export interface ResponseObject {
    response: {
        data: any,
        error: string | null,
        message: string | null,
        status: number
    }
}