import { get, put, post } from "@/utils/http";
import service from "@/utils/axios";

const Api = {
    userList: '/clubsystem/user',
    getUserInfo: '/clubsystem/user/getUserInfo',
    updateUser: '/clubsystem/user/update',
    getAllUserIdAndName: '/clubsystem/user/getAllUserIdAndName'

} as const;


function getUserListApi(page: number, limit: number, searchParams: any) {
    if (searchParams.keyword) {
        return get(`${Api.userList}/${page}/${limit}?keyword=${searchParams.keyword}`);
    }
    if (!searchParams.keyword) {
        return get(`${Api.userList}/${page}/${limit}`);
    }

}

function getUserInfoApi() {
    return get(Api.getUserInfo);
}

function updateUserApi(data: any) {
    return put(Api.updateUser, data);
}

function updatePasswordApi(data: { id: number | string, type: number, oldPassword?: string, newPassword?: string }) {
    return post('/clubsystem/user/updatePassword', data);
}

function updateUserStatusApi(id: number | string, status: number) {
    return get(`/clubsystem/user/updateStatus/${id}/${status}`);
}

function deleteUserApi(id: number | string) {
    return service.delete(`/clubsystem/user/remove/${id}`);
}

function getAllUserIdAndNameApi(name?: string) {
    const url = name ? `${Api.getAllUserIdAndName}?name=${name}` : Api.getAllUserIdAndName;
    return get(url);
}

export { getUserListApi, getUserInfoApi, updateUserApi, updatePasswordApi, updateUserStatusApi, deleteUserApi, getAllUserIdAndNameApi };