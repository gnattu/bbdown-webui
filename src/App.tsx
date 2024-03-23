import './App.css'
import { useState, useEffect, useContext, useCallback } from 'react'
import {
  Navbar,
  Alignment,
  Button,
  Card,
  CardList,
  Colors,
  Divider,
  Icon,
  Intent,
  ProgressBar,
  Section,
  SectionCard,
  Tag,
  Tab,
  Tabs,
} from '@blueprintjs/core'
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import prettyBytes from 'pretty-bytes'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import {
  BBDownUIProps,
  IBBDownMyOption,
  DownloadTask,
  DownloadTaskCollection,
  DownloadTaskPros,
  UIConfig,
} from './datatype'
import * as defaultConfig from './defaultconfig.json'
import { ConfigContext } from './context'
import { AddTask } from './add-task'
import DefaultCover from './assets/deafult-cover.svg'

const queryClient = new QueryClient()
moment.locale('zh-cn')
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
await queryClient.prefetchQuery({
  queryKey: ['config', defaultConfig],
  queryFn: async () => {
    const res = await fetch(`userconfig.json`)
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    const userConfig = await res.json() as UIConfig
    return {
      ...defaultConfig,
      ...userConfig,
      bbdownMyOptions: {
        ...defaultConfig.bbdownMyOptions,
        ...userConfig.bbdownMyOptions,
      },
    }
  },
})

const DownloadingTask = (props: DownloadTaskPros) => {
  const { Title, Progress, Pic, DownloadSpeed } = props.task
  return (
    <div className="downloading-task download-task">
      <LazyLoadImage
        className="flex-item-responsive"
        style={{ flex: '0 1 128px' }}
        src={Pic}
        width="128"
      />
      <div
        className="flex-item-responsive finished-task-right"
        style={{ flex: '1 0 128px', minWidth: '128px', textAlign: 'left' }}
      >
        <span className="twoline">{Title}</span>
        <div className="flex-item-footer">
          <div className="flex-item-footer-item">
            <Tag minimal>{`${prettyBytes(DownloadSpeed)}/s`}</Tag>
          </div>
          <div className="flex-item-footer-item" style={{ flex: '1 1 300px' }}>
            <ProgressBar value={Progress} intent={Intent.PRIMARY} />
          </div>
        </div>
      </div>
    </div>
  )
}

const FinishedTask = (props: DownloadTaskPros) => {
  const { Aid, Title, Pic, TaskFinishTime, IsSuccessful, Url } = props.task
  const { bbdownUrl } = useContext(ConfigContext)
  const deleteFinishedTask = useMutation({
    mutationFn: async (aid: string) => {
      const res = await fetch(`${bbdownUrl}/remove-finished/${aid}`)
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      return
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks', bbdownUrl] })
    },
  })
  return (
    <div className="finished-task download-task">
      <LazyLoadImage
        className="flex-item-responsive"
        style={{ flex: '0 1 128px' }}
        src={Pic ?? DefaultCover}
        width="128"
      />
      <div
        className="flex-item-responsive finished-task-right"
        style={{ flex: '1 0 128px', minWidth: '128px', textAlign: 'left' }}
      >
        <span className="twoline">{Title ?? Url}</span>
        <div className="flex-item-footer">
          <Tag className="flex-item-footer-item" minimal>
            {moment(TaskFinishTime * 1000).fromNow()}
          </Tag>
          <Icon
            className="flex-item-footer-item"
            icon={IsSuccessful ? 'tick-circle' : 'cross-circle'}
            intent={IsSuccessful ? Intent.SUCCESS : Intent.DANGER}
          />
        </div>
      </div>
      <Button
        className="flex-item-responsive"
        small
        minimal
        icon="trash"
        onClick={() => deleteFinishedTask.mutate(Aid)}
      />
    </div>
  )
}

const DownloadTasks = () => {
  const { bbdownUrl } = useContext(ConfigContext)
  const query = useQuery({
    queryKey: ['tasks', bbdownUrl],
    queryFn: async () => {
      const res = await fetch(`${bbdownUrl}/get-tasks`)
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      return res.json()
    },
    // Refetch the data every second
    refetchInterval: 1000,
  })
  const data = query.data as DownloadTaskCollection | null | undefined

  return (
    <>
      <Section title="进行中">
        <SectionCard padded={false}>
          <CardList bordered={false}>
            {data?.Running.map((task: DownloadTask) => (
              <Card key={`${task.Aid}${task.TaskCreateTime}`}>
                <DownloadingTask task={task} />
              </Card>
            ))}
          </CardList>
        </SectionCard>
      </Section>
      <Divider style={{ marginTop: 15, marginBottom: 15 }} />
      <Section title="已完成">
        <SectionCard padded={false}>
          <CardList bordered={false}>
            {data?.Finished.map((task: DownloadTask) => (
              <Card key={`${task.Aid}${task.TaskCreateTime}`}>
                <FinishedTask task={task} />
              </Card>
            ))}
          </CardList>
        </SectionCard>
      </Section>
    </>
  )
}

const BBDownUI = (props: BBDownUIProps) => {
  const { isDarkMode, setIsDarkMode } = props
  const [selectedTab, setSelectedTab] = useState('tasks')
  const [urls, setUrls] = useState<string[]>([''])
  const [addTaskAdvancedMode, setAddTaskAdvancedMode] = useState(false)
  const handleTabChange = useCallback(
    (newTabId: string) => {
      setSelectedTab(newTabId)
    },
    [setSelectedTab],
  )
  const configQuery = useQuery({
    queryKey: ['config', defaultConfig],
  })
  const config = configQuery.data as UIConfig
  const { bbdownMyOptions } = config
  const [bbdownCurrentOption, setBbdownCurrentOption] = useState<IBBDownMyOption>({
    Url: '',
    ...bbdownMyOptions,
  })
  return (
    <>
      <ConfigContext.Provider value={config}>
        <Navbar className="nav">
          <Navbar.Group align={Alignment.LEFT} style={{ width: '100%' }}>
            <Navbar.Heading>BBDown</Navbar.Heading>
            <Navbar.Divider />
            <Tabs id="app-tabs" onChange={handleTabChange} selectedTabId={selectedTab}>
              <Tab id="tasks" icon="th-list" title="任务列表" />
              <Tab id="add-task" icon="insert" title="添加任务" />
            </Tabs>
            <Tabs.Expander />
            <Button
              icon={isDarkMode ? 'flash' : 'moon'}
              onClick={() => {
                setIsDarkMode(!isDarkMode)
              }}
            />
          </Navbar.Group>
        </Navbar>
        <div id="main">
          {selectedTab === 'tasks' ? (
            <DownloadTasks />
          ) : (
            <AddTask
              setSelectedTab={setSelectedTab}
              urls={urls}
              setUrls={setUrls}
              bbdownCurrentOption={bbdownCurrentOption}
              setBbdownCurrentOption={setBbdownCurrentOption}
              addTaskAdvancedMode={addTaskAdvancedMode}
              setAddTaskAdvancedMode={setAddTaskAdvancedMode}
            />
          )}
        </div>
      </ConfigContext.Provider>
    </>
  )
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(darkModeQuery.matches)
  const handleDarkModeColor = useCallback(
    (shouldUseDarkColor: boolean) => {
      document.documentElement.style.setProperty(
        'background-color',
        shouldUseDarkColor ? Colors.DARK_GRAY3 : Colors.WHITE,
      )
      setIsDarkMode(shouldUseDarkColor)
    },
    [setIsDarkMode],
  )
  useEffect(() => {
    const schemeChangeHandler = (evt: MediaQueryListEvent) => {
      darkModeQuery.removeEventListener('change', schemeChangeHandler)
      handleDarkModeColor(evt.matches)
      darkModeQuery.addEventListener('change', schemeChangeHandler)
    }
    darkModeQuery.addEventListener('change', schemeChangeHandler)
    return () => {
      darkModeQuery.removeEventListener('change', schemeChangeHandler)
    }
  }, [handleDarkModeColor])
  return (
    <div
      className={isDarkMode ? 'bp5-dark' : undefined}
      style={{ backgroundColor: isDarkMode ? Colors.DARK_GRAY3 : Colors.WHITE, height: '100%' }}
    >
      <QueryClientProvider client={queryClient}>
        <BBDownUI isDarkMode={isDarkMode} setIsDarkMode={handleDarkModeColor} />
      </QueryClientProvider>
    </div>
  )
}

export default App
