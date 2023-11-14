type SetBooleanState = React.Dispatch<React.SetStateAction<boolean>>
type SetSelectedTabState = React.Dispatch<React.SetStateAction<string>>
type SetUrlsState = React.Dispatch<React.SetStateAction<string[]>>
type SetBBDownCurrentOptionState = React.Dispatch<React.SetStateAction<IBBDownMyOption>>

interface DownloadTask {
  Aid: string
  Url: string
  TaskCreateTime: number
  Title: string
  Pic: string
  VideoPubTime: number
  TaskFinishTime: number
  Progress: number
  DownloadSpeed: number
  TotalDownloadedBytes: number
  IsSuccessful: boolean
}

interface DownloadTaskCollection {
  Running: Array<DownloadTask>
  Finished: Array<DownloadTask>
}

interface DownloadTaskPros {
  task: DownloadTask
}

interface BBDownUIProps {
  isDarkMode: boolean
  setIsDarkMode: (shouldUseDarkColor: boolean) => void
}

interface AddTaskProps {
  setSelectedTab: SetSelectedTabState
  urls: string[]
  setUrls: SetUrlsState
  bbdownCurrentOption: IBBDownMyOption
  setBbdownCurrentOption: SetBBDownCurrentOptionState
  addTaskAdvancedMode: boolean
  setAddTaskAdvancedMode: SetBooleanState
}

class BBDownMyOption {
  UseTvApi?: boolean | null = null
  UseAppApi?: boolean | null = null
  UseIntlApi?: boolean | null = null
  UseMP4box?: boolean | null = null
  Mp4boxPath?: string | null = null
  EncodingPriority?: string | null = null
  DfnPriority?: string | null = null
  UseAria2c?: boolean | null = null
  Aria2cArgs?: string | null = null
  Aria2cPath?: string | null = null
  Aria2cProxy?: string | null = null
  MultiThread?: boolean | null = null
  SimplyMux?: boolean | null = null
  VideoOnly?: boolean | null = null
  AudioOnly?: boolean | null = null
  DanmakuOnly?: boolean | null = null
  CoverOnly?: boolean | null = null
  SubOnly?: boolean | null = null
  SkipMux?: boolean | null = null
  SkipSubtitle?: boolean | null = null
  SkipCover?: boolean | null = null
  ForceHttp?: boolean | null = null
  DownloadDanmaku?: boolean | null = null
  SkipAi?: boolean | null = null
  VideoAscending?: boolean | null = null
  AudioAscending?: boolean | null = null
  AllowPcdn?: boolean | null = null
  ForceReplaceHost?: boolean | null = null
  FilePattern?: string | null = null
  MultiFilePattern?: string | null = null
  SelectPage?: string | null = null
  Language?: string | null = null
  UserAgent?: string | null = null
  Cookie?: string | null = null
  AccessToken?: string | null = null
  WorkDir?: string | null = null
  FFmpegPath?: string | null = null
  UposHost?: string | null = null
  DelayPerPage?: string | null = null
  Host?: string | null = null
  EpHost?: string | null = null
  Area?: string | null = null
  ConfigFile?: string | null = null
}

interface IBBDownMyOption extends BBDownMyOption {
  Url: string
  Debug?: boolean | null
  OnlyShowInfo?: boolean | null
  ShowAll?: boolean | null
  Interactive?: boolean | null
  HideStreams?: boolean | null
  OnlyHevc?: boolean | null
  OnlyAvc?: boolean | null
  OnlyAv1?: boolean | null
  AddDfnSubfix?: boolean | null
  NoPaddingPageNum?: boolean | null
  BandwithAscending?: boolean | null
}

type BBDownMyOptionKeys = keyof BBDownMyOption

interface BBDownMyOptionMetadataItem {
  type: string
  description: string
  defaultValue?: boolean | string | null
  depends?: string | null
  showInSimpleMode?: boolean
}

type BBDownMyOptionBooleanKey =
  | 'UseTvApi'
  | 'UseAppApi'
  | 'UseIntlApi'
  | 'UseMP4box'
  | 'OnlyShowInfo'
  | 'ShowAll'
  | 'UseAria2c'
  | 'Interactive'
  | 'HideStreams'
  | 'MultiThread'
  | 'SimplyMux'
  | 'VideoOnly'
  | 'AudioOnly'
  | 'DanmakuOnly'
  | 'CoverOnly'
  | 'SubOnly'
  | 'Debug'
  | 'SkipMux'
  | 'SkipSubtitle'
  | 'SkipCover'
  | 'ForceHttp'
  | 'DownloadDanmaku'
  | 'SkipAi'
  | 'VideoAscending'
  | 'AudioAscending'
  | 'AllowPcdn'
  | 'ForceReplaceHost'
  | 'OnlyHevc'
  | 'OnlyAvc'
  | 'OnlyAv1'
  | 'AddDfnSubfix'
  | 'NoPaddingPageNum'
  | 'BandwithAscending'

type BBDownMyOptionStringKey =
  | 'Mp4boxPath'
  | 'EncodingPriority'
  | 'DfnPriority'
  | 'FilePattern'
  | 'MultiFilePattern'
  | 'SelectPage'
  | 'Language'
  | 'UserAgent'
  | 'Cookie'
  | 'AccessToken'
  | 'Aria2cArgs'
  | 'WorkDir'
  | 'FFmpegPath'
  | 'Aria2cPath'
  | 'UposHost'
  | 'DelayPerPage'
  | 'Host'
  | 'EpHost'
  | 'Area'
  | 'ConfigFile'
  | 'Aria2cProxy'

interface UIConfig {
    bbdownUrl: string
    bbdownMyOptions: Partial<IBBDownMyOption>
  }

export type {
  AddTaskProps,
  DownloadTask,
  DownloadTaskCollection,
  DownloadTaskPros,
  UIConfig,
  BBDownUIProps,
  IBBDownMyOption,
  BBDownMyOptionKeys,
  BBDownMyOptionMetadataItem,
  BBDownMyOptionBooleanKey,
  BBDownMyOptionStringKey,
}
export { BBDownMyOption }
