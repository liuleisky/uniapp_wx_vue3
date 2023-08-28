export type THeaderOption = {
  'content-type'?: string,
  token?: string,
  clientType?: string,
  version? :string,
  Authorization: string,
}

export type TPatamOption = {
  isToken?: boolean
}

export type BaseUrlOption = {
  api_url?: string,
  file_url?:string,
  upload_url?: string
}
