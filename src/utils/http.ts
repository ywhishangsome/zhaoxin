import service from "./axios";
interface ResponseData {
    code: number,
    message: string,
    data: any
}

// 封装get请求
function get(url: string, params?: any): Promise<ResponseData> {
    return service.get(url, { params })
}
// 封装post请求
function post(url: string, data?: any): Promise<ResponseData> {
    return service.post(url, data)
}

// 封装put请求
function put(url: string, data?: any): Promise<ResponseData> {
    return service.put(url, data)
}

export { get, post, put }