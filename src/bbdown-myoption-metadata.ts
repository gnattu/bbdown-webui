const bbdownMyOptionMetadata = {
  Url: { type: 'string', description: 'URL 地址' },
  UseTvApi: { type: 'boolean', description: '使用 TV 端解析模式' },
  UseAppApi: { type: 'boolean', description: '使用 APP 端解析模式' },
  UseIntlApi: { type: 'boolean', description: '使用国际版(东南亚视频)解析模式' },
  UseMP4box: { type: 'boolean', description: '使用 MP4Box 来混流' },
  Mp4boxPath: { type: 'string', description: '设置 mp4box 的路径', depends: 'UseMP4box' },
  EncodingPriority: {
    type: 'string',
    description: '视频编码的选择优先级，用逗号分割 例: "hevc,av1,avc"',
  },
  DfnPriority: {
    type: 'string',
    description: '画质优先级，用逗号分隔 例: "8K 超高清, 1080P 高码率, HDR 真彩, 杜比视界"',
  },
  OnlyShowInfo: { type: 'boolean', description: '仅解析而不进行下载' },
  ShowAll: { type: 'boolean', description: '展示所有分P标题' },
  UseAria2c: {
    type: 'boolean',
    description: '调用 aria2c 进行下载',
  },
  Aria2cArgs: {
    type: 'string',
    description: '调用 aria2c 的附加参数(默认参数包含"-x16 -s16 -j16 -k 5M", 使用时注意字符串转义)',
    depends: 'UseAria2c',
  },
  Aria2cPath: { type: 'string', description: '设置 aria2c 的路径', depends: 'UseAria2c' },
  Aria2cProxy: { type: 'string', description: '指定Aria2代理', depends: 'UseAria2c' },
  Interactive: { type: 'boolean', description: '交互式选择清晰度' },
  HideStreams: { type: 'boolean', description: '不要显示所有可用音视频流' },
  MultiThread: { type: 'boolean', description: '使用多线程下载(默认开启)', defaultValue: true },
  SimplyMux: { type: 'boolean', description: '简化混流参数' },
  VideoOnly: { type: 'boolean', description: '仅下载视频' },
  AudioOnly: { type: 'boolean', description: '仅下载音频' },
  DanmakuOnly: { type: 'boolean', description: '仅下载弹幕' },
  CoverOnly: { type: 'boolean', description: '仅下载封面' },
  SubOnly: { type: 'boolean', description: '仅下载字幕' },
  Debug: { type: 'boolean', description: '输出调试日志' },
  SkipMux: { type: 'boolean', description: '跳过混流步骤' },
  SkipSubtitle: { type: 'boolean', description: '跳过字幕下载' },
  SkipCover: { type: 'boolean', description: '跳过封面下载' },
  ForceHttp: {
    type: 'boolean',
    description: '下载时使用HTTP替换HTTPS(默认开启)',
    defaultValue: true,
  },
  DownloadDanmaku: { type: 'boolean', description: '下载弹幕' },
  SkipAi: { type: 'boolean', description: '跳过 AI 字幕下载(默认开启)', defaultValue: true },
  VideoAscending: { type: 'boolean', description: '视频升序(最小体积优先)' },
  AudioAscending: { type: 'boolean', description: '音频升序(最小体积优先)' },
  AllowPcdn: {
    type: 'boolean',
    description: '不替换 PCDN 域名, 仅在无法下载时使用',
  },
  ForceReplaceHost: {
    type: 'boolean',
    description: '强制替换下载服务器 host(默认开启)',
    defaultValue: true,
  },
  FilePattern: {
    type: 'string',
    description: '使用内置变量自定义单P存储文件名 默认为: <videoTitle>',
  },
  MultiFilePattern: {
    type: 'string',
    description:
      '使用内置变量自定义多P存储文件名 默认为: <videoTitle>/[P<pageNumberWithZero>]<pageTitle>',
  },
  SelectPage: {
    type: 'string',
    description: '选择指定分p或分p范围: (-p 8 或 -p 1,2 或 -p 3-5 或 -p ALL 或 -p LAST)',
  },
  Language: { type: 'string', description: '设置混流的音频语言(代码), 如 chi, jpn 等' },
  UserAgent: { type: 'string', description: '指定 user-agent, 否则使用随机 user-agent' },
  Cookie: {
    type: 'string',
    description: '设置字符串 cookie 用以下载网页接口的会员内容',
    showInSimpleMode: true,
  },
  AccessToken: {
    type: 'string',
    description: '设置 access_token 用以下载 TV/APP 接口的会员内容',
    showInSimpleMode: true,
  },
  WorkDir: { type: 'string', description: '设置程序的工作目录', showInSimpleMode: true },
  FFmpegPath: { type: 'string', description: '设置 ffmpeg 的路径' },
  UposHost: { type: 'string', description: '自定义 upos 服务器' },
  DelayPerPage: {
    type: 'string',
    description: '设置下载合集分P之间的下载间隔时间(单位: 秒, 默认无间隔)',
  },
  Host: {
    type: 'string',
    description:
      '指定 BiliPlus host(使用 BiliPlus 需要 access_token, 不需要 cookie, 解析服务器能够获取你账号的大部分权限!)',
  },
  EpHost: {
    type: 'string',
    description:
      '指定 BiliPlus EP host(用于代理 api.bilibili.com/pgc/view/web/season, 大部分解析服务器不支持代理该接口)',
  },
  Area: { type: 'string', description: '(hk|tw|th) 使用 BiliPlus 时必选, 指定 BiliPlus area' },
  ConfigFile: {
    type: 'string',
    description: '读取指定的 BBDown 本地配置文件(默认为: BBDown.config)',
  },
  OnlyHevc: { type: 'boolean', description: '仅下载hevc编码视频(默认关闭)' },
  OnlyAvc: { type: 'boolean', description: '仅下载avc编码视频(默认关闭)' },
  OnlyAv1: { type: 'boolean', description: '仅下载av1编码视频(默认关闭)' },
  AddDfnSubfix: { type: 'boolean', description: '下载视频时附加清晰度后缀' },
  NoPaddingPageNum: { type: 'boolean', description: '多P下载时不进行页数补零(默认补零)' },
  BandwithAscending: { type: 'boolean', description: '按照带宽升序排序(默认降序)' },
}

export { bbdownMyOptionMetadata }
