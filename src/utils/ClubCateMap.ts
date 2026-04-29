const ClubCateMap: Record<number, string> = {
    1: '体育运动',
    2: '学术科技',
    3: '文娱艺术',
    4: '公益服务',
    5: '思想政治',
    6: '其他'
}

// 根据数字获取中文标签
const getLabel = (key: number) => {
    // console.log(ClubCateMap[key]);

    return ClubCateMap[key] || '未知分类'
}

export { getLabel }