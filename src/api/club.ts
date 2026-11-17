import { post, get, put } from "@/utils/http";
import service from "@/utils/axios";

const Api = {
    clubList: '/clubsystem/club/user/list',
    listMyClub: '/clubsystem/club/user/listMyClub',
    club: '/clubsystem/club/get/',
    clubPage: '/clubsystem/club/list',
    clubUserList: '/clubsystem/club-user/getClubUser/',
    addClubUser: '/clubsystem/club-user/addClubUser',
    deleteClubUser: '/clubsystem/club-user/deleteClubUser/',
    addClub: '/clubsystem/club/save',
    updateClub: '/clubsystem/club/update',
    deleteClub: '/clubsystem/club/remove/',
    clubMemberInfo: '/clubsystem/club/getClubMemberInfo/'
} as const;

// 获取社团成员信息
function getClubMemberInfoApi(clubId: number | string) {
    return get(`${Api.clubMemberInfo}${clubId}`);
}

// 添加社团
function addClubApi(data: any) {
    return post(Api.addClub, data);
}

// 修改社团
function updateClubApi(data: any) {
    return put(Api.updateClub, data);
}

// 删除社团
function deleteClubApi(id: number | string) {
    return service.delete(`${Api.deleteClub}${id}`);
}

// 获取社团成员列表
function getClubUserListApi(page: number, pageSize: number, id: number | string) {
    return get(`${Api.clubUserList}${page}/${pageSize}/${id}`);
}

// 添加社团成员
function addClubUserApi(data: { clubId: number | string, userId: number | string, roleType: number | string }) {
    return post(Api.addClubUser, data);
}

// 删除社团成员
function deleteClubUserApi(userId: number | string, clubId: number | string) {
    return service.delete(`${Api.deleteClubUser}${userId}/${clubId}`);
}

// 获取用户自己的社团
function getMyClubListApi() {
    return get(Api.listMyClub);
}

// 用户获取所有社团，用于社团浏览展示
function getClubListApi() {
    return get(Api.clubList);
}

function getClubByIdApi(id: number) {
    return get(Api.club + id);
}
//分页获取社团列表
function getClubPageApi(page: number, limit: number, params: any) {
    // console.log(params.name, params.category);
    if (params.name && !params.category) {
        return get(`${Api.clubPage}/${page}/${limit}?clubName=${params.name}`);
    }
    if (params.category && !params.name) {
        return get(`${Api.clubPage}/${page}/${limit}?category=${params.category}`);
    }
    if (params.name && params.category) {

        return get(`${Api.clubPage}/${page}/${limit}?clubName=${params.name || ''}&category=${params.category || ''}`);
    }
    if (!params.name && !params.category) {
        return get(`${Api.clubPage}/${page}/${limit}`);
    }
}
export { getClubListApi, getClubByIdApi, getClubPageApi, getMyClubListApi, getClubUserListApi, addClubUserApi, deleteClubUserApi, addClubApi, updateClubApi, deleteClubApi, getClubMemberInfoApi };