//TODO fix type
export type TweetMode = string//'timeline' | 'tag' | 'search' | 'status'
export type TweetType = string//'all' | 'self' | 'retweet' | 'media'

export interface State {
  dark: '0' | '1' | '2'
  globalHandle: FileSystemDirectoryHandle | null
  dataHandle: [string, FileSystemFileHandle][]
  page: number
  mode: number
  flexible: number
}
