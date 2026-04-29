import { get, post } from "@/utils/http";


const Api = {
    signPage: '/clubsystem/club-apply/getAdminApplyInfo',
    signUp: '/clubsystem/club-apply/signUp',
    userApplyInfo: '/clubsystem/club-apply/getUserApplyInfo',
    audit: '/clubsystem/club-apply/audit',
} as const
// 社团管理员获取用户报名信息
function getSignPageApi(page: number, limit: number, searchParams: any) {
    const query = new URLSearchParams();
    if (searchParams.name) query.append('name', searchParams.name);
    if (searchParams.status !== undefined && searchParams.status !== '') query.append('status', searchParams.status);
    
    const queryString = query.toString();
    const url = `${Api.signPage}/${page}/${limit}${queryString ? `?${queryString}` : ''}`;
    return get(url);
}

function signUpApi(data: { clubId: number, userId: number, apply_note: string }) {
    return post(Api.signUp, data);
}

// 获取用户个人的报名信息
function getUserApplyInfoApi(page: number, limit: number, params?: { clubName?: string, status?: string }) {
    const query = new URLSearchParams();
    if (params?.clubName) query.append('clubName', params.clubName);
    if (params?.status) query.append('status', params.status);
    
    const queryString = query.toString();
    const url = `${Api.userApplyInfo}/${page}/${limit}${queryString ? `?${queryString}` : ''}`;
    return get(url);
}

// 审核/取消报名
function auditApplyApi(id: number | string, status: number | string) {
    return post(`${Api.audit}/${id}/${status}`);
}

export { getSignPageApi, signUpApi, getUserApplyInfoApi, auditApplyApi }
