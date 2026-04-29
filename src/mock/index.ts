import Mock from 'mockjs'
Mock.setup({
  timeout: "200-600"
})
//登录接口
Mock.mock("https://www.demo.com/login", "post", (options: any) => {
  const { account, password } = JSON.parse(options.body);
  if (account === "admin" && password === "admin666") {
    return {
      code: 200,
      message: "登录成功",
      data: {
        token: "admintokensafvdffds453hghj",
        username: '管理员',
        roles: ['admin']
      }
    }
  }
  else if (account === "user" && password === "user666") {
    return {
      code: 200,
      message: "登录成功",
      data: {
        token: "usertokenfkdgac282jhaghs",
        username: '普通用户',
        roles: ['user']

      }
    }
  } else if (account === "leader" && password === "leader666") {
    return {
      code: 200,
      message: "登录成功",
      data: {
        token: "leadertokenfkdgac282jhaghs",
        username: '社团管理员',
        roles: ['leader']

      }
    }

  }
  else {
    return {
      code: 401,
      message: "用户名或密码错误",
      data: null
    }
  }
})
// 学生 mock
let studentList = [
  { studentId: "001", name: "张三", password: "123456", phone: "13800138001", },
  { studentId: "002", name: "李四", password: "123456", phone: "13800138002", },
  { studentId: "003", name: "王五", password: "123456", phone: "13800138003", },
  { studentId: "004", name: "赵六", password: "123456", phone: "13800138004", },
  { studentId: "005", name: "刘七", password: "123456", phone: "13800138005", },
  { studentId: "006", name: "陈八", password: "123456", phone: "13800138006", },
  { studentId: "007", name: "杨九", password: "123456", phone: "13800138007", },
  { studentId: "008", name: "黄十", password: "123456", phone: "13800138008", },
  { studentId: "009", name: "周十一", password: "123456", phone: "13800138009", },
  { studentId: "010", name: "吴十二", password: "123456", phone: "13800138010", },
  { studentId: "011", name: "郑十三", password: "123456", phone: "13800138011", },
  { studentId: "012", name: "马十四", password: "123456", phone: "13800138012", },
  { studentId: "013", name: "胡十五", password: "123456", phone: "13800138013", },
  { studentId: "014", name: "林十六", password: "123456", phone: "13800138014", },
  { studentId: "015", name: "郭十七", password: "123456", phone: "13800138015", },
  { studentId: "016", name: "何十八", password: "123456", phone: "13800138016", },
  { studentId: "017", name: "高十九", password: "123456", phone: "13800138017", },
  { studentId: "018", name: "罗二十", password: "123456", phone: "13800138018", },
  { studentId: "019", name: "梁超级", password: "123456", phone: "13800138019", },
  { studentId: "020", name: "宋管理", password: "123456", phone: "13800138020", },
  { studentId: "021", name: "唐二一", password: "123456", phone: "13800138021", },
  { studentId: "022", name: "邓二二", password: "123456", phone: "13800138022", },
  { studentId: "023", name: "曹二三", password: "123456", phone: "13800138023", },
  { studentId: "024", name: "袁二四", password: "123456", phone: "13800138024", },
  { studentId: "025", name: "许二五", password: "123456", phone: "13800138025", },
  { studentId: "026", name: "傅二六", password: "123456", phone: "13800138026", },
  { studentId: "027", name: "沈二七", password: "123456", phone: "13800138027", },
  { studentId: "028", name: "曾二八", password: "123456", phone: "13800138028", },
  { studentId: "029", name: "彭二九", password: "123456", phone: "13800138029", },
  { studentId: "030", name: "吕三十", password: "123456", phone: "13800138030", },
  { studentId: "031", name: "苏三一", password: "123456", phone: "13800138031", },
  { studentId: "032", name: "卢三二", password: "123456", phone: "13800138032", },
  { studentId: "033", name: "蒋三三", password: "123456", phone: "13800138033", },
  { studentId: "034", name: "蔡三四", password: "123456", phone: "13800138034", },
  { studentId: "035", name: "丁三五", password: "123456", phone: "13800138035", },
  { studentId: "036", name: "魏三六", password: "123456", phone: "13800138036", },
  { studentId: "037", name: "薛三七", password: "123456", phone: "13800138037", },
  { studentId: "038", name: "叶三八", password: "123456", phone: "13800138038", },
  { studentId: "039", name: "阎三九", password: "123456", phone: "13800138039", },
  { studentId: "040", name: "余四十", password: "123456", phone: "13800138040", },
  { studentId: "041", name: "潘四一", password: "123456", phone: "13800138041", },
  { studentId: "042", name: "杜四二", password: "123456", phone: "13800138042", },
  { studentId: "043", name: "戴四三", password: "123456", phone: "13800138043", },
  { studentId: "044", name: "夏四四", password: "123456", phone: "13800138044", },
  { studentId: "045", name: "钟四五", password: "123456", phone: "13800138045", },
  { studentId: "046", name: "汪四六", password: "123456", phone: "13800138046", },
  { studentId: "047", name: "田四七", password: "123456", phone: "13800138047", },
  { studentId: "048", name: "任四八", password: "123456", phone: "13800138048", },
  { studentId: "049", name: "姜四九", password: "123456", phone: "13800138049", },
  { studentId: "050", name: "范五十", password: "123456", phone: "13800138050", },
  { studentId: "051", name: "马五一", password: "123456", phone: "13800138051", },
  { studentId: "052", name: "方五二", password: "123456", phone: "13800138052", },
  { studentId: "053", name: "石五三", password: "123456", phone: "13800138053", },
  { studentId: "054", name: "姚五四", password: "123456", phone: "13800138054", },
  { studentId: "055", name: "谭五五", password: "123456", phone: "13800138055", },
  { studentId: "056", name: "廖五六", password: "123456", phone: "13800138056", },
];

// 社团 mock
let clubList = [
  {
    clubId: "C001",
    name: "计算机协会",
    intro: "学习编程、软件开发、AI技术交流",
    managerName: "社团管理员A",
    category: "学术科技",
    size: 4,
    studentIds: ["S001", "S003", "S005", "S009"]
  },
  {
    clubId: "C002",
    name: "篮球社",
    intro: "篮球训练、比赛、校园体育活动",
    managerName: "社团管理员B",
    category: "体育竞技",
    studentIds: ["S002", "S004", "S006"]
  },
  {
    clubId: "C003",
    name: "音乐社",
    intro: "声乐、乐器、校园演出、音乐交流",
    managerName: "社团管理员C",
    category: "文艺艺术",
    studentIds: ["S007", "S008", "S010"]
  },
  {
    clubId: "C004",
    name: "机器人社团",
    intro: "机器人制作、编程控制、竞赛参与",
    managerName: "社团管理员D",
    category: "学术科技",
    studentIds: ["S011", "S012", "S013", "S014"]
  },
  {
    clubId: "C005",
    name: "足球社",
    intro: "足球训练、校内联赛、体育精神培养",
    managerName: "社团管理员E",
    category: "体育竞技",
    studentIds: ["S015", "S016", "S017"]
  },
  {
    clubId: "C006",
    name: "舞蹈社",
    intro: "现代舞、民族舞、舞台表演、文艺汇演",
    managerName: "社团管理员F",
    category: "文艺艺术",
    studentIds: ["S018", "S019", "S020"]
  },
  {
    clubId: "C007",
    name: "数学建模社",
    intro: "数学建模竞赛、数据分析、模型构建",
    managerName: "社团管理员G",
    category: "学术科技",
    studentIds: ["S021", "S022", "S023"]
  },
  {
    clubId: "C008",
    name: "羽毛球社",
    intro: "羽毛球技巧训练、友谊赛、体能提升",
    managerName: "社团管理员H",
    category: "体育竞技",
    studentIds: ["S024", "S025", "S026"]
  },
  {
    clubId: "C009",
    name: "话剧社",
    intro: "剧本创作、舞台表演、话剧演出",
    managerName: "社团管理员I",
    category: "文艺艺术",
    studentIds: ["S027", "S028", "S029"]
  },
  {
    clubId: "C010",
    name: "电子竞技社",
    intro: "电竞交流、团队比赛、游戏技术研讨",
    managerName: "社团管理员J",
    category: "兴趣爱好",
    studentIds: ["S030", "S031", "S032"]
  },
  {
    clubId: "C011",
    name: "公益志愿者社",
    intro: "校园公益、社区服务、爱心活动组织",
    managerName: "社团管理员K",
    category: "公益服务",
    studentIds: ["S033", "S034", "S035"]
  },
  {
    clubId: "C012",
    name: "创业实践社",
    intro: "创业项目、商业计划、实践落地交流",
    managerName: "社团管理员L",
    category: "创新创业",
    studentIds: ["S036", "S037", "S038"]
  },
  {
    clubId: "C013",
    name: "摄影社",
    intro: "摄影技巧、后期修图、校园采风",
    managerName: "社团管理员M",
    category: "文艺艺术",
    studentIds: ["S039", "S040", "S041"]
  },
  {
    clubId: "C014",
    name: "乒乓球社",
    intro: "乒乓球训练、竞技比赛、兴趣交流",
    managerName: "社团管理员N",
    category: "体育竞技",
    studentIds: ["S042", "S043", "S044"]
  },
  {
    clubId: "C015",
    name: "人工智能社",
    intro: "AI学习、深度学习、项目实践",
    managerName: "社团管理员O",
    category: "学术科技",
    studentIds: ["S045", "S046", "S047"]
  },
  {
    clubId: "C016",
    name: "手绘漫画社",
    intro: "手绘、漫画创作、插画设计交流",
    managerName: "社团管理员P",
    category: "兴趣爱好",
    studentIds: ["S048", "S049", "S050"]
  },
  {
    clubId: "C017",
    name: "环保社",
    intro: "环保宣传、绿色校园、志愿活动",
    managerName: "社团管理员Q",
    category: "公益服务",
    studentIds: ["S051", "S052", "S053"]
  },
  {
    clubId: "C018",
    name: "市场营销社",
    intro: "营销策划、市场调研、实践活动",
    managerName: "社团管理员R",
    category: "创新创业",
    studentIds: ["S054", "S055", "S056"]
  },

];

// 报名 mock
let enrollList = [
  { id: 2, studentName: "S2025002", clubName: "C001", major: "计算机", createTime: "2025-04-01 11:10:22", status: "pass" },
  { id: 3, studentName: "S2025003", clubName: "C001", major: "计算机", createTime: "2025-04-01 14:05:33", status: "reject" },
  { id: 4, studentName: "S2025004", clubName: "C002", major: "计算机", createTime: "2025-04-01 09:12:44", status: "pending" },
  { id: 5, studentName: "S2025005", clubName: "C002", major: "计算机", createTime: "2025-04-01 15:33:55", status: "pass" },
  { id: 6, studentName: "S2025006", clubName: "C002", major: "计算机", createTime: "2025-04-01 16:21:00", status: "reject" },
  { id: 7, studentName: "S2025007", clubName: "C003", major: "计算机", createTime: "2025-04-02 08:40:11", status: "pending" },
  { id: 8, studentName: "S2025008", clubName: "C003", major: "计算机", createTime: "2025-04-02 10:10:22", status: "pass" },
  { id: 9, studentName: "S2025009", clubName: "C003", major: "计算机", createTime: "2025-04-02 13:30:33", status: "reject" },
  { id: 10, studentName: "S2025010", clubName: "C001", major: "计算机", createTime: "2025-04-02 14:40:44", status: "pending" },
  { id: 11, studentName: "S2025011", clubName: "C002", major: "计算机", createTime: "2025-04-03 09:20:55", status: "pass" },
  { id: 12, studentName: "S2025012", clubName: "C003", major: "计算机", createTime: "2025-04-03 11:50:00", status: "pending" },
  { id: 13, studentName: "S2025013", clubName: "C001", major: "计算机", createTime: "2025-04-03 15:10:11", status: "pass" },
  { id: 14, studentName: "S2025014", clubName: "C002", major: "计算机", createTime: "2025-04-03 16:30:22", status: "pending" },
  { id: 15, studentName: "S2025015", clubName: "C003", major: "计算机", createTime: "2025-04-04 10:00:33", status: "pass" },
  { id: 1, studentName: "S2025001", clubName: "C001", major: "计算机", createTime: "2025-04-01 10:23:11", status: "pending" },
];
// 社团类型
let categoryList = [
  { id: 1, name: "学术科技", },
  { id: 2, name: "体育竞技", },
  { id: 3, name: "文艺艺术", },
  { id: 4, name: "兴趣爱好", },
  { id: 5, name: "公益服务", },
  { id: 6, name: "创新创业" }
]
// 获取所有学生列表
const originalStudentList = JSON.parse(JSON.stringify(studentList));
Mock.mock("https://www.demo.com/studentList", 'post', (options: any) => {
  studentList = originalStudentList
  const { id, name, page, pageSize } = options.body ? JSON.parse(options.body) : {}
  // 根据条件过滤数据
  if (name) {
    studentList = studentList.filter(item => item.name.includes(name));
  }
  if (id) {
    studentList = studentList.filter(item => item.studentId == id);
  }

  // 实现分页
  const total = studentList.length;
  const start = (page - 1) * pageSize;
  const paginatedItems = studentList.slice(start, start + pageSize);
  return {
    code: 200,
    success: true,
    data: {
      list: paginatedItems,
      total
    },

  };
});



// 获取所有社团信息,支持分页，筛选
const originalClubList = JSON.parse(JSON.stringify(clubList));
// 定义 API 接口
Mock.mock("https://www.demo.com/clubList", 'post', (options: any) => {
  clubList = originalClubList
  const { name, managerName, category, page, pageSize } = options.body ? JSON.parse(options.body) : {}
  // 根据条件过滤数据
  if (name) {
    clubList = clubList.filter(item => item.name.includes(name));
  }
  if (managerName) {
    clubList = clubList.filter(item => item.managerName === managerName);
  }
  if (category) {
    clubList = clubList.filter(item => item.category === category);
  }
  // 实现分页
  const total = clubList.length;
  const start = (page - 1) * pageSize;
  const paginatedItems = clubList.slice(start, start + pageSize);
  return {
    code: 200,
    success: true,
    data: {
      list: paginatedItems,
      total
    },

  };
});



//获取社团类别
Mock.mock("https://www.demo.com/clubCategory", 'get', () => {
  return {
    code: 200,
    message: '操作成功',
    data:
      categoryList

  };
})
// 获取所有报名信息
const originalEnrollList = enrollList
Mock.mock("https://www.demo.com/enrollList", 'post', (options: any) => {
  enrollList = originalEnrollList
  const { clubName, status, page, pageSize } = options.body ? JSON.parse(options.body) : {}
  // 根据条件过滤数据
  if (clubName) {
    enrollList = enrollList.filter(item => item.clubName.includes(clubName));
  }
  if (status) {
    enrollList = enrollList.filter(item => item.status === status);
  }

  // 实现分页
  const total = enrollList.length;
  const start = (page - 1) * pageSize;
  const paginatedItems = enrollList.slice(start, start + pageSize);
  return {
    code: 200,
    success: true,
    data: {
      list: paginatedItems,
      total
    },

  };
})
// 后续支持模糊查询应该改为post
