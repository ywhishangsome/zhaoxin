import { post, get } from "@/utils/http";
interface LoginParams {
    code: string,
    password: string,
    picCode: string,
    key: string
}
const Api = {
    picCode: '/clubsystem/user/code',
    Login: '/clubsystem/user/login',
    Register: '/clubsystem/user/register'
} as const;

function getPicCodeApi() {
    return get(Api.picCode);
}
function loginApi(data: LoginParams): Promise<any> {
    return post(Api.Login, data)
}
function registerApi(data: any): Promise<any> {
    return post(Api.Register, data)
}
export { loginApi, getPicCodeApi, registerApi };