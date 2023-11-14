import { useContext, useCallback, ChangeEvent } from 'react'
import {
  Button,
  Card,
  CardList,
  Intent,
  Section,
  SectionCard,
  Tag,
  TextArea,
  FormGroup,
  InputGroup,
  Switch,
  HTMLSelect,
} from '@blueprintjs/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AddTaskProps,
  BBDownMyOption,
  BBDownMyOptionKeys,
  BBDownMyOptionMetadataItem,
  BBDownMyOptionBooleanKey,
  BBDownMyOptionStringKey,
  IBBDownMyOption,
} from './datatype'
import { ConfigContext } from './context'
import { bbdownMyOptionMetadata } from './bbdown-myoption-metadata'
import { appToaster } from './toaster'

const qualities = [
  '默认',
  '8K 超高清',
  '杜比视界',
  'HDR 真彩',
  '4K 超清',
  '1080P 高帧率',
  '1080P 高码率',
  '1080P 高清',
  '720P 高帧率',
  '720P 高清',
  '480P 清晰',
  '360P 流畅',
  '240P 流畅',
  '144P 流畅',
]

const videoSources = ['Web', 'TV', 'App', '国际版']

const isValidBiliUrl = (text: string) => {
  if (text.startsWith('http://') && text.length > 7) return true
  if (text.startsWith('https://') && text.length > 8) return true
  if (text.startsWith('av') && text.length > 2) return true
  if (text.startsWith('bv') && text.length > 2) return true
  if (text.startsWith('BV') && text.length > 2) return true
  if (text.startsWith('ep') && text.length > 2) return true
  if (text.startsWith('ss') && text.length > 2) return true
  return false
}

const bbdownMyOption = new BBDownMyOption()
const bbdownMyOptionPropertyNames = Object.keys(bbdownMyOption) as BBDownMyOptionKeys[]

export const AddTask = (props: AddTaskProps) => {
  const {
    setSelectedTab,
    urls,
    setUrls,
    bbdownCurrentOption,
    setBbdownCurrentOption,
    addTaskAdvancedMode,
    setAddTaskAdvancedMode,
  } = props
  const { bbdownUrl } = useContext(ConfigContext)
  const queryClient = useQueryClient()
  const handleUrlTextChange = useCallback(
    (e: ChangeEvent) => {
      setUrls((e.target as HTMLInputElement).value.split('\n').filter((x) => x !== ''))
    },
    [setUrls],
  )
  const handleAdvancedModeSwitchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAddTaskAdvancedMode(e.target.checked)
    },
    [setAddTaskAdvancedMode],
  )
  const handleQualitySelectorChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setBbdownCurrentOption({
        ...bbdownCurrentOption,
        DfnPriority: e.target.value === '默认' ? undefined : e.target.value,
      })
    },
    [bbdownCurrentOption, setBbdownCurrentOption],
  )
  const handleVideoSourceSelectorChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const sourceFlags: Partial<IBBDownMyOption> = {
        UseTvApi: undefined,
        UseAppApi: undefined,
        UseIntlApi: undefined,
      }
      switch (e.target.value) {
        case 'TV': {
          sourceFlags.UseTvApi = true
          break
        }
        case 'App': {
          sourceFlags.UseAppApi = true
          break
        }
        case '国际版': {
          sourceFlags.UseIntlApi = true
          break
        }
        default: {
          break
        }
      }
      setBbdownCurrentOption({
        ...bbdownCurrentOption,
        ...sourceFlags,
      })
    },
    [bbdownCurrentOption, setBbdownCurrentOption],
  )
  const pushNewTask = useMutation({
    mutationFn: async (task: IBBDownMyOption) => {
      try {
        await fetch(`${bbdownUrl}/add-task`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(task),
        })
        return true
      } catch (e) {
        console.error(`ERROR: Task with url ${task.Url} failed to add.`)
        appToaster.show({ message: `任务${task.Url}提交失败`, intent: Intent.DANGER })
        console.error(e)
        return false
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks', bbdownUrl] })
    },
  })
  const validBiliUrlCount = urls.filter((x) => isValidBiliUrl(x)).length
  const hasInvalidUrl = validBiliUrlCount < urls.length || urls.length === 0
  return (
    <div className="add-task-panel">
      <div className="task-submit-form">
        <FormGroup
          fill
          helperText="请注意：BBDown服务器目前无下载队列，提交的所有任务会同时并行下载，一次提交过多任务可能导致下载失败"
          label="视频地址"
          labelFor="text-input"
          labelInfo={`(${validBiliUrlCount}个视频地址)`}
        >
          <TextArea
            id="text-input"
            onChange={handleUrlTextChange}
            placeholder="请输入视频地址 或 av|bv|BV|ep|ss 一行一个"
            fill
            intent={hasInvalidUrl ? Intent.DANGER : Intent.SUCCESS}
            style={{ resize: 'none', height: 200 }}
          />
        </FormGroup>
        <Button
          large
          disabled={hasInvalidUrl}
          intent={Intent.PRIMARY}
          icon="upload"
          style={{ float: 'right', marginBottom: 15 }}
          onClick={() => {
            void (async () => {
              const taskResultsPromise = urls.map((url) => {
                return pushNewTask.mutateAsync({ ...bbdownCurrentOption, Url: url })
              })
              setSelectedTab('tasks')
              setUrls([''])
              const taskResults = await Promise.all(taskResultsPromise)
              if (taskResults.every((r) => r === false)) {
                appToaster.show({ message: `任务提交失败`, intent: Intent.DANGER })
              } else if (taskResults.every((r) => r === true)) {
                appToaster.show({ message: `任务提交成功`, intent: Intent.SUCCESS })
              } else {
                appToaster.show({ message: `部分任务提交失败`, intent: Intent.WARNING })
              }
            })()
          }}
        >
          提交任务
        </Button>
      </div>
      <Section
        title="下载选项"
        rightElement={
          <Switch
            inline
            checked={addTaskAdvancedMode}
            onChange={handleAdvancedModeSwitchChange}
            alignIndicator="right"
            style={{ height: '100%', marginBottom: 0 }}
          ><Tag minimal intent={Intent.DANGER}>
            进阶模式
          </Tag></Switch>
        }
      >
        <SectionCard padded={false}>
          <CardList bordered={false}>
            {addTaskAdvancedMode || (
              <>
                <Card>
                  <FormGroup
                    inline
                    fill
                    label="画质"
                    labelFor="qualiy-select"
                    style={{
                      justifyContent: 'space-between',
                      margin: 0,
                      alignItems: 'center',
                    }}
                  >
                    <HTMLSelect
                      id="qualiy-select"
                      className="simple-select"
                      value={
                        bbdownCurrentOption.DfnPriority
                          ? qualities.includes(String(bbdownCurrentOption.DfnPriority))
                            ? String(bbdownCurrentOption.DfnPriority)
                            : '自定义'
                          : '默认'
                      }
                      onChange={handleQualitySelectorChange}
                      options={
                        qualities.includes(String(bbdownCurrentOption.DfnPriority))
                          ? qualities
                          : ['自定义', ...qualities]
                      }
                    />
                  </FormGroup>
                </Card>
                <Card>
                  <FormGroup
                    inline
                    fill
                    label="下载源"
                    labelFor="video-source-select"
                    style={{
                      justifyContent: 'space-between',
                      margin: 0,
                      alignItems: 'center',
                    }}
                  >
                    <HTMLSelect
                      id="video-source-select"
                      className="simple-select"
                      value={
                        bbdownCurrentOption.UseTvApi
                          ? 'TV'
                          : bbdownCurrentOption.UseAppApi
                          ? 'App'
                          : bbdownCurrentOption.UseIntlApi
                          ? '国际版'
                          : 'Web'
                      }
                      onChange={handleVideoSourceSelectorChange}
                      options={videoSources}
                    />
                  </FormGroup>
                </Card>
              </>
            )}
            {bbdownMyOptionPropertyNames
              .filter(
                (x) =>
                  addTaskAdvancedMode ||
                  (bbdownMyOptionMetadata[x] as BBDownMyOptionMetadataItem).showInSimpleMode,
              )
              .map((key) => {
                const itemMetadata = bbdownMyOptionMetadata[key] as BBDownMyOptionMetadataItem
                const isBooleanItem = itemMetadata.type === 'boolean'
                const hidden =
                  Boolean(itemMetadata.depends) &&
                  !bbdownCurrentOption[itemMetadata.depends as keyof IBBDownMyOption]
                return (
                  <Card key={key} style={{ display: hidden ? 'none' : undefined }}>
                    <FormGroup
                      inline={isBooleanItem}
                      fill
                      label={isBooleanItem ? bbdownMyOptionMetadata[key].description : key}
                      labelFor={key}
                      helperText={!isBooleanItem ? bbdownMyOptionMetadata[key].description : null}
                      style={{
                        justifyContent: 'space-between',
                        margin: 0,
                        alignItems: isBooleanItem ? 'center' : undefined,
                      }}
                    >
                      {isBooleanItem ? (
                        <Switch
                          large
                          id={key}
                          checked={Boolean(bbdownCurrentOption[key])}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const newOption: IBBDownMyOption = { ...bbdownCurrentOption }
                            newOption[key as BBDownMyOptionBooleanKey] = event.target.checked
                            setBbdownCurrentOption(newOption)
                          }}
                        />
                      ) : (
                        <InputGroup
                          id={key}
                          value={bbdownCurrentOption[key] ? String(bbdownCurrentOption[key]) : ''}
                          onValueChange={(value: string) => {
                            const newOption: IBBDownMyOption = { ...bbdownCurrentOption }
                            newOption[key as BBDownMyOptionStringKey] =
                              value.length === 0 ? undefined : value
                            setBbdownCurrentOption(newOption)
                          }}
                        />
                      )}
                    </FormGroup>
                  </Card>
                )
              })}
          </CardList>
        </SectionCard>
      </Section>
    </div>
  )
}
